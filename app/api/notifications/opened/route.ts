import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { adminDb, adminApp } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let uid: string
  try {
    const decoded = await getAuth(adminApp).verifyIdToken(token)
    uid = decoded.uid
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({})) as Record<string, unknown>
  const campaignId = typeof body.campaignId === 'string' ? body.campaignId.trim() : ''

  if (!campaignId) {
    return NextResponse.json({ error: 'campaignId required' }, { status: 400 })
  }

  const recipientRef = adminDb
    .collection('adminNotificationCampaigns')
    .doc(campaignId)
    .collection('recipients')
    .doc(uid)

  const recipientSnap = await recipientRef.get()

  if (!recipientSnap.exists || recipientSnap.data()?.sent !== true) {
    // Silently ignore — user may have received the notif before being in the subcollection
    return NextResponse.json({ ok: true })
  }

  if (recipientSnap.data()?.opened === true) {
    return NextResponse.json({ ok: true }) // idempotent
  }

  const campaignRef = adminDb.collection('adminNotificationCampaigns').doc(campaignId)

  await Promise.all([
    recipientRef.update({ opened: true, openedAt: FieldValue.serverTimestamp() }),
    campaignRef.update({ 'metrics.opened': FieldValue.increment(1) }),
  ])

  return NextResponse.json({ ok: true })
}
