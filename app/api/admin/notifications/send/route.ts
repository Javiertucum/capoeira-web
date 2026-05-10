import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { adminDb, adminApp } from '@/lib/firebase-admin'
import { resolveAudience, type SegmentFilter, type TokenEntry } from '@/lib/notification-audience'

// FCM multicast supports up to 500 tokens per batch
const FIREBASE_BATCH_SIZE = 500

export type DeepLink = {
  screen: string
  entityId?: string
  entityType?: string
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

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json().catch(() => ({})) as Record<string, unknown>
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const messageBody = typeof body.body === 'string' ? body.body.trim() : ''

  if (!title || !messageBody) {
    return NextResponse.json({ error: 'Título y cuerpo son requeridos' }, { status: 400 })
  }

  const segment: SegmentFilter = {
    roles: Array.isArray(body.roles) ? (body.roles as string[]) : [],
    countries: Array.isArray(body.countries) ? (body.countries as string[]) : [],
    groupIds: Array.isArray(body.groupIds) ? (body.groupIds as string[]) : [],
    subscriptionPlans: Array.isArray(body.subscriptionPlans) ? (body.subscriptionPlans as string[]) : [],
    userIds: Array.isArray(body.userIds) ? (body.userIds as string[]) : [],
    noGroup: body.noGroup === true,
  }

  const deepLink: DeepLink | undefined =
    typeof body.screen === 'string' && body.screen
      ? {
          screen: body.screen as string,
          entityId: typeof body.entityId === 'string' ? body.entityId : undefined,
          entityType: typeof body.entityType === 'string' ? body.entityType : undefined,
        }
      : undefined

  const entries = await resolveAudience(segment)

  if (entries.length === 0) {
    return NextResponse.json(
      { error: 'No se encontraron tokens para el segmento seleccionado' },
      { status: 400 },
    )
  }

  // Create campaign doc first so we have the ID for the FCM data payload
  const ref = adminDb.collection('adminNotificationCampaigns').doc()
  const campaignId = ref.id

  let successCount = 0
  let failureCount = 0
  const allStaleUids: string[] = []
  const allErrors: string[] = []
  const sentUids = new Set<string>()

  for (let i = 0; i < entries.length; i += FIREBASE_BATCH_SIZE) {
    const chunk = entries.slice(i, i + FIREBASE_BATCH_SIZE)
    const { success, failed, staleUids, errors } = await sendFcmChunk(
      chunk,
      title,
      messageBody,
      campaignId,
      deepLink,
    )
    successCount += success
    failureCount += failed
    allStaleUids.push(...staleUids)
    allErrors.push(...errors)
    // Track which UIDs were successfully sent
    chunk.forEach((entry) => {
      sentUids.add(entry.uid)
    })
  }
  // Remove stale UIDs from sentUids (they failed)
  for (const uid of allStaleUids) sentUids.delete(uid)

  void purgeStaleTokens(allStaleUids)

  await ref.set({
    title,
    body: messageBody,
    status: successCount > 0 ? 'sent' : 'failed',
    type: 'push',
    segment,
    deepLink: deepLink ?? null,
    metrics: {
      targeted: entries.length,
      sent: successCount,
      failed: failureCount,
      opened: 0,
      purged: allStaleUids.length,
    },
    createdBy: authResult.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  // Write recipients subcollection (non-blocking on response)
  void writeRecipients(campaignId, entries, sentUids)

  await writeAdminAuditLog({
    actorUid: authResult.uid,
    action: 'notification.send',
    entity: { type: 'adminNotificationCampaign', id: campaignId, path: `adminNotificationCampaigns/${campaignId}` },
    summary: `Sent push "${title}" to ${successCount}/${entries.length} · purged ${allStaleUids.length}`,
    metadata: { successCount, failureCount, purged: allStaleUids.length, segment },
  })

  return NextResponse.json({
    ok: true,
    id: campaignId,
    targeted: entries.length,
    sent: successCount,
    failed: failureCount,
    purged: allStaleUids.length,
    errors: allErrors.slice(0, 5),
  })
}
