import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { adminDb } from '@/lib/firebase-admin'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'
const EXPO_BATCH_SIZE = 100

type SegmentFilter = {
  roles?: string[]
  countries?: string[]
  groupIds?: string[]
  subscriptionPlans?: string[]
  userIds?: string[]
}

type TokenEntry = { uid: string; token: string }

type ExpoTicket =
  | { status: 'ok'; id: string }
  | { status: 'error'; message: string; details?: { error: string } }

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
    console.error('[Expo Push] failed to purge stale tokens:', err)
  })
  console.log(`[Expo Push] purged ${uids.length} stale tokens`)
}

type ChunkResult = {
  success: number
  failed: number
  staleUids: string[]
  errors: string[]
}

async function sendExpoChunk(entries: TokenEntry[], title: string, body: string): Promise<ChunkResult> {
  const messages = entries.map(({ token: to }) => ({
    to,
    title,
    body,
    sound: 'default',
    priority: 'high',
    channelId: 'default',
  }))

  const response = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(messages),
    signal: AbortSignal.timeout(20000),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => response.status.toString())
    console.error('[Expo Push] HTTP error:', response.status, text)
    return { success: 0, failed: entries.length, staleUids: [], errors: [`HTTP ${response.status}: ${text}`] }
  }

  const result = await response.json() as { data: ExpoTicket[] }
  const tickets = result.data ?? []
  const staleUids: string[] = []
  const errors: string[] = []

  tickets.forEach((ticket, i) => {
    if (ticket.status === 'error') {
      const entry = entries[i]
      const errorCode = ticket.details?.error ?? ''
      const msg = ticket.message ?? errorCode ?? 'unknown error'
      errors.push(msg)
      console.error(`[Expo Push] ticket error for uid ${entry?.uid}: ${msg}`)

      if (errorCode === 'DeviceNotRegistered' && entry) {
        staleUids.push(entry.uid)
      }
    }
  })

  const success = tickets.filter((t) => t.status === 'ok').length
  const failed = tickets.length - success

  return { success, failed: failed + (entries.length - tickets.length), staleUids, errors }
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

  for (let i = 0; i < entries.length; i += EXPO_BATCH_SIZE) {
    const chunk = entries.slice(i, i + EXPO_BATCH_SIZE)
    const { success, failed, staleUids, errors } = await sendExpoChunk(chunk, title, messageBody)
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
