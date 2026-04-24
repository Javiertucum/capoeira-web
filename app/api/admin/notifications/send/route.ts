import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { adminDb } from '@/lib/firebase-admin'

type SegmentFilter = {
  roles?: string[]
  countries?: string[]
  groupIds?: string[]
  subscriptionPlans?: string[]
  userIds?: string[]
}

async function collectFcmTokens(segment: SegmentFilter): Promise<string[]> {
  const snap = await adminDb.collection('users').get().catch(() => ({ docs: [] }))
  const tokens: string[] = []

  for (const doc of snap.docs) {
    const data = doc.data() as Record<string, unknown>
    const token = typeof data.fcmToken === 'string' ? data.fcmToken.trim() : null
    if (!token) continue

    if (segment.userIds && segment.userIds.length > 0) {
      if (segment.userIds.includes(doc.id)) tokens.push(token)
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

    tokens.push(token)
  }

  return tokens
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

  const tokens = await collectFcmTokens(segment)

  if (tokens.length === 0) {
    return NextResponse.json({ error: 'No se encontraron tokens FCM para el segmento seleccionado' }, { status: 400 })
  }

  const messaging = getMessaging()
  const BATCH_SIZE = 500
  let successCount = 0
  let failureCount = 0

  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE)
    const result = await messaging.sendEachForMulticast({
      tokens: batch,
      notification: { title, body: messageBody },
      android: { priority: 'high' },
      apns: { payload: { aps: { sound: 'default', badge: 1 } } },
    })
    successCount += result.successCount
    failureCount += result.failureCount
  }

  const ref = adminDb.collection('adminNotificationCampaigns').doc()
  await ref.set({
    title,
    body: messageBody,
    status: failureCount === tokens.length ? 'failed' : 'sent',
    type: 'push',
    segment,
    metrics: { targeted: tokens.length, sent: successCount, failed: failureCount },
    createdBy: authResult.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  await writeAdminAuditLog({
    actorUid: authResult.uid,
    action: 'notification.send',
    entity: { type: 'adminNotificationCampaign', id: ref.id, path: `adminNotificationCampaigns/${ref.id}` },
    summary: `Sent push notification "${title}" to ${successCount}/${tokens.length} tokens`,
    metadata: { successCount, failureCount, segment },
  })

  return NextResponse.json({ ok: true, id: ref.id, targeted: tokens.length, sent: successCount, failed: failureCount })
}
