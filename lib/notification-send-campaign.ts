import 'server-only'
import { FieldValue } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { writeAdminAuditLog } from './admin-audit'
import { adminDb, adminApp } from './firebase-admin'
import { resolveAudience, type SegmentFilter, type TokenEntry } from './notification-audience'

// FCM multicast supports up to 500 tokens per batch
const FIREBASE_BATCH_SIZE = 500

export type DeepLink = {
  screen: string
  entityId?: string
  entityType?: string
}

export type CampaignSendResult = {
  campaignId: string
  targeted: number
  sent: number
  failed: number
  purged: number
  errors: string[]
  empty: boolean
}

async function purgeStaleTokens(uids: string[]): Promise<void> {
  if (uids.length === 0) return
  const batch = adminDb.batch()
  for (const uid of uids) {
    batch.update(adminDb.collection('users').doc(uid), { fcmToken: FieldValue.delete() })
  }
  await batch.commit().catch((err) => console.error('[FCM] purge failed:', err))
}

type ChunkResult = { success: number; failed: number; staleUids: string[]; errors: string[] }

async function sendFcmChunk(
  entries: TokenEntry[],
  title: string,
  body: string,
  campaignId: string,
  deepLink?: DeepLink,
): Promise<ChunkResult> {
  const fcm = getMessaging(adminApp)
  const staleUids: string[] = []
  const errors: string[] = []
  let success = 0
  let failed = 0

  const data: Record<string, string> = { campaignId }
  if (deepLink) {
    data.screen = deepLink.screen
    if (deepLink.entityId) data.entityId = deepLink.entityId
    if (deepLink.entityType) data.entityType = deepLink.entityType
  }

  const results = await fcm.sendEachForMulticast({
    tokens: entries.map((e) => e.token),
    notification: { title, body },
    data,
    android: { priority: 'high', notification: { channelId: 'default', sound: 'default' } },
    apns: { payload: { aps: { sound: 'default' } } },
  })

  results.responses.forEach((result, i) => {
    const entry = entries[i]
    if (result.success) {
      success++
    } else {
      failed++
      const errorCode = result.error?.code ?? 'unknown'
      errors.push(result.error?.message ?? errorCode)
      if (
        errorCode === 'messaging/registration-token-not-registered' ||
        errorCode === 'messaging/invalid-registration-token'
      ) {
        if (entry) staleUids.push(entry.uid)
      }
    }
  })

  return { success, failed, staleUids, errors }
}

async function writeRecipients(
  campaignId: string,
  entries: TokenEntry[],
  sentUids: Set<string>,
): Promise<void> {
  // Firestore batch limit is 500 writes
  for (let i = 0; i < entries.length; i += 500) {
    const chunk = entries.slice(i, i + 500)
    const batch = adminDb.batch()
    for (const entry of chunk) {
      const ref = adminDb
        .collection('adminNotificationCampaigns')
        .doc(campaignId)
        .collection('recipients')
        .doc(entry.uid)
      batch.set(ref, {
        displayName: entry.displayName,
        email: entry.email,
        sent: sentUids.has(entry.uid),
        opened: false,
        openedAt: null,
      })
    }
    await batch.commit()
  }
}

/**
 * Resolves the audience and sends the push, writing the campaign doc + recipients subcollection.
 * Pass an existing `campaignId` to update a doc that was already created (e.g. a scheduled send
 * picked up by the cron processor); omit it to create a new one (immediate send from the admin form).
 */
export async function runCampaignSend(input: {
  campaignId?: string
  title: string
  body: string
  segment: SegmentFilter
  deepLink?: DeepLink
  createdBy: string
}): Promise<CampaignSendResult> {
  const entries = await resolveAudience(input.segment)

  const ref = input.campaignId
    ? adminDb.collection('adminNotificationCampaigns').doc(input.campaignId)
    : adminDb.collection('adminNotificationCampaigns').doc()
  const campaignId = ref.id

  if (entries.length === 0) {
    await ref.set(
      {
        title: input.title,
        body: input.body,
        status: 'failed',
        type: 'push',
        segment: input.segment,
        deepLink: input.deepLink ?? null,
        metrics: { targeted: 0, sent: 0, failed: 0, opened: 0, purged: 0 },
        createdBy: input.createdBy,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
    return { campaignId, targeted: 0, sent: 0, failed: 0, purged: 0, errors: [], empty: true }
  }

  let successCount = 0
  let failureCount = 0
  const allStaleUids: string[] = []
  const allErrors: string[] = []
  const sentUids = new Set<string>()

  for (let i = 0; i < entries.length; i += FIREBASE_BATCH_SIZE) {
    const chunk = entries.slice(i, i + FIREBASE_BATCH_SIZE)
    const { success, failed, staleUids, errors } = await sendFcmChunk(
      chunk,
      input.title,
      input.body,
      campaignId,
      input.deepLink,
    )
    successCount += success
    failureCount += failed
    allStaleUids.push(...staleUids)
    allErrors.push(...errors)
    chunk.forEach((entry) => {
      sentUids.add(entry.uid)
    })
  }
  for (const uid of allStaleUids) sentUids.delete(uid)

  void purgeStaleTokens(allStaleUids)

  await ref.set(
    {
      title: input.title,
      body: input.body,
      status: successCount > 0 ? 'sent' : 'failed',
      type: 'push',
      segment: input.segment,
      deepLink: input.deepLink ?? null,
      metrics: {
        targeted: entries.length,
        sent: successCount,
        failed: failureCount,
        opened: 0,
        purged: allStaleUids.length,
      },
      createdBy: input.createdBy,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  void writeRecipients(campaignId, entries, sentUids)
  void writeAdminAuditLog({
    actorUid: input.createdBy,
    action: 'notification.send',
    entity: { type: 'adminNotificationCampaign', id: campaignId, path: `adminNotificationCampaigns/${campaignId}` },
    summary: `Sent push "${input.title}" to ${successCount}/${entries.length} · purged ${allStaleUids.length}`,
    metadata: { successCount, failureCount, purged: allStaleUids.length, segment: input.segment },
  })

  return {
    campaignId,
    targeted: entries.length,
    sent: successCount,
    failed: failureCount,
    purged: allStaleUids.length,
    errors: allErrors.slice(0, 5),
    empty: false,
  }
}
