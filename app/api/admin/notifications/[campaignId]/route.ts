import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { adminDb } from '@/lib/firebase-admin'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { campaignId } = await params
  const ref = adminDb.collection('adminNotificationCampaigns').doc(campaignId)
  const doc = await ref.get()

  if (!doc.exists) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (doc.data()?.status !== 'scheduled') {
    return NextResponse.json(
      { error: 'Solo se pueden cancelar notificaciones programadas que aún no se enviaron' },
      { status: 400 },
    )
  }

  await ref.update({ status: 'canceled', updatedAt: FieldValue.serverTimestamp() })
  return NextResponse.json({ ok: true })
}

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
