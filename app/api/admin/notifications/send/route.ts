import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { adminDb, adminApp } from '@/lib/firebase-admin'

// FCM multicast supports up to 500 tokens per batch
const FIREBASE_BATCH_SIZE = 500

type SegmentFilter = {
  roles?: string[]
  countries?: string[]
  groupIds?: string[]
  subscriptionPlans?: string[]
  userIds?: string[]
}

type TokenEntry = { uid: string; token: string }

async function collectTokens(segment: SegmentFilter): Promise<TokenEntry[]> {
  const snap = await adminDb.collection('users').get().catch(() => ({ docs: [] }))
  const entries: TokenEntry[] = []

  for (const doc of snap.docs) {
    const data = doc.data() as Record<string, unknown>
    const token = typeof data.fcmToken === 'string' ? data.fcmToken.trim() : null
    if (!token) continue

    if (segment.userIds && segment.userIds.length > 0) {
      if (segment.userIds.includes(doc.id)) entries.push({ uid: doc.id, token })
      continue
    }

    if (segment.roles && segment.roles.length > 0) {
      const role = typeof data.role === 'string' ? data.role : 'student'
      if (!segment.roles.includes(role)) continue
    }

    if (segment.countries && segment.countries.length > 0) {
      const country = typeof data.country === 'string' ? data.country : null
      if (!country || !segment.countries.includes(country)) continue
    }

    if (segment.groupIds && segment.groupIds.length > 0) {
      const groupId = typeof data.groupId === 'string' ? data.groupId : null
      if (!groupId || !segment.groupIds.includes(groupId)) continue
    }

    if (segment.subscriptionPlans && segment.subscriptionPlans.length > 0) {
      const subDoc = await adminDb
        .collection('users').doc(doc.id)
        .collection('subscription').doc('current')
        .get().catch(() => null)
      const plan = subDoc?.data()?.plan === 'premium' ? 'premium' : 'free'
      if (!segment.subscriptionPlans.includes(plan)) continue
    }

    entries.push({ uid: doc.id, token })
  }

  return entries
}

async function purgeStaleTokens(uids: string[]): Promise<void> {
  if (uids.length === 0) return
  const batch = adminDb.batch()
  for (const uid of uids) {
    batch.update(adminDb.collection('users').doc(uid), {
      fcmToken: FieldValue.delete(),
    })
  }
  await batch.commit().catch((err) => {
    console.error('[FCM Push] failed to purge stale tokens:', err)
  })
  console.log(`[FCM Push] purged ${uids.length} stale tokens`)
}

type ChunkResult = {
  success: number
  failed: number
  staleUids: string[]
  errors: string[]
}

async function sendFcmChunk(entries: TokenEntry[], title: string, body: string): Promise<ChunkResult> {
  const fcm = getMessaging(adminApp)
  const staleUids: string[] = []
  const errors: string[] = []
  let success = 0
  let failed = 0

  const results = await fcm.sendEachForMulticast({
    tokens: entries.map(e => e.token),
    notification: { title, body },
    android: {
      priority: 'high',
      notification: {
        channelId: 'default',
        sound: 'default',
      },
    },
    apns: {
      payload: {
        aps: { sound: 'default' },
      },
    },
  })

  results.responses.forEach((result, i) => {
    const entry = entries[i]
    if (result.success) {
      success++
    } else {
      failed++
      const errorCode = result.error?.code ?? 'unknown'
      const errorMsg = result.error?.message ?? errorCode
      errors.push(errorMsg)
      console.error(`[FCM Push] failed for uid ${entry?.uid}: ${errorMsg}`)

      // Mark stale if the token is no longer registered on the device
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
  }

  const entries = await collectTokens(segment)

  if (entries.length === 0) {
    return NextResponse.json(
      { error: 'No se encontraron tokens de notificación para el segmento seleccionado' },
      { status: 400 }
    )
  }

  let successCount = 0
  let failureCount = 0
  const allStaleUids: string[] = []
  const allErrors: string[] = []

  for (let i = 0; i < entries.length; i += FIREBASE_BATCH_SIZE) {
    const chunk = entries.slice(i, i + FIREBASE_BATCH_SIZE)
    const { success, failed, staleUids, errors } = await sendFcmChunk(chunk, title, messageBody)
    successCount += success
    failureCount += failed
    allStaleUids.push(...staleUids)
    allErrors.push(...errors)
  }

  // Clean up stale tokens in the background — don't block the response
  void purgeStaleTokens(allStaleUids)

  const ref = adminDb.collection('adminNotificationCampaigns').doc()
  await ref.set({
    title,
    body: messageBody,
    status: successCount > 0 ? 'sent' : 'failed',
    type: 'push',
    segment,
    metrics: {
      targeted: entries.length,
      sent: successCount,
      failed: failureCount,
      purged: allStaleUids.length,
    },
    createdBy: authResult.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  await writeAdminAuditLog({
    actorUid: authResult.uid,
    action: 'notification.send',
    entity: { type: 'adminNotificationCampaign', id: ref.id, path: `adminNotificationCampaigns/${ref.id}` },
    summary: `Sent push "${title}" to ${successCount}/${entries.length} · purged ${allStaleUids.length} stale tokens`,
    metadata: { successCount, failureCount, purged: allStaleUids.length, segment },
  })

  return NextResponse.json({
    ok: true,
    id: ref.id,
    targeted: entries.length,
    sent: successCount,
    failed: failureCount,
    purged: allStaleUids.length,
    errors: allErrors.slice(0, 5),
  })
}
