import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { campaignId } = await params
  const doc = await adminDb.collection('adminNotificationCampaigns').doc(campaignId).get()

  if (!doc.exists) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const data = doc.data()!
  return NextResponse.json({
    id: doc.id,
    title: data.title ?? '',
    status: data.status ?? '',
    metrics: data.metrics ?? { targeted: 0, sent: 0, failed: 0, opened: 0 },
    deepLink: data.deepLink ?? null,
    segment: data.segment ?? {},
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
  })
}

const CANCELLABLE_STATUSES = new Set(['queued', 'scheduled', 'processing'])

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { campaignId } = await params
  const body = (await request.json().catch(() => ({}))) as { action?: string }

  const ref = adminDb.collection('adminNotificationCampaigns').doc(campaignId)
  const snapshot = await ref.get()
  if (!snapshot.exists) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const current = snapshot.data() ?? {}
  const currentStatus = typeof current.status === 'string' ? current.status : 'unknown'

  if (body.action === 'cancel') {
    if (!CANCELLABLE_STATUSES.has(currentStatus)) {
      return NextResponse.json({ error: `No se puede cancelar una campaña en estado ${currentStatus}` }, { status: 400 })
    }

    await ref.update({
      status: 'cancelled',
      cancelledAt: FieldValue.serverTimestamp(),
      cancelledBy: authResult.uid,
      updatedAt: FieldValue.serverTimestamp(),
    })

    await writeAdminAuditLog({
      actorUid: authResult.uid,
      action: 'notification.cancel',
      entity: { type: 'adminNotificationCampaign', id: campaignId, path: `adminNotificationCampaigns/${campaignId}` },
      summary: `Cancelled notification campaign ${campaignId}`,
    })

    return NextResponse.json({ ok: true, status: 'cancelled' })
  }

  if (body.action === 'expedite') {
    if (currentStatus !== 'scheduled') {
      return NextResponse.json({ error: `Solo se puede adelantar una campaña en estado scheduled` }, { status: 400 })
    }

    await ref.update({
      status: 'queued',
      scheduledFor: FieldValue.serverTimestamp(),
      expeditedAt: FieldValue.serverTimestamp(),
      expeditedBy: authResult.uid,
      updatedAt: FieldValue.serverTimestamp(),
    })

    await writeAdminAuditLog({
      actorUid: authResult.uid,
      action: 'notification.expedite',
      entity: { type: 'adminNotificationCampaign', id: campaignId, path: `adminNotificationCampaigns/${campaignId}` },
      summary: `Expedited notification campaign ${campaignId}`,
    })

    return NextResponse.json({ ok: true, status: 'queued' })
  }

  return NextResponse.json({ error: 'Acción no soportada' }, { status: 400 })
}
