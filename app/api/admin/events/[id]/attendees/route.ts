import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { FieldValue } from 'firebase-admin/firestore'

type RouteContext = { params: Promise<{ id: string }> }

/**
 * GET /api/admin/events/[id]/attendees
 * Returns the full attendee list for an event (going + interested).
 */
export async function GET(req: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  try {
    const snap = await adminDb.collection('events').doc(id).collection('attendees').get()
    const attendees = snap.docs.map((d) => {
      const data = d.data()
      return {
        userId: d.id,
        status: data.status ?? 'going',
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      }
    })
    return NextResponse.json({ attendees })
  } catch (error) {
    console.error('[GET attendees]', error)
    return NextResponse.json({ error: 'Error fetching attendees' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/events/[id]/attendees
 * Body: { userId: string }
 * Removes the attendee doc and decrements the appropriate counter on the event.
 */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const body = (await req.json().catch(() => null)) as { userId?: string } | null

  if (!body?.userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const { userId } = body

  try {
    const attendeeRef = adminDb
      .collection('events')
      .doc(id)
      .collection('attendees')
      .doc(userId)

    const eventRef = adminDb.collection('events').doc(id)

    const snap = await attendeeRef.get()
    if (!snap.exists) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 })
    }

    const actualStatus = snap.data()?.status ?? 'going'

    await adminDb.runTransaction(async (tx) => {
      tx.delete(attendeeRef)
      if (actualStatus === 'going') {
        tx.update(eventRef, { goingCount: FieldValue.increment(-1) })
      } else if (actualStatus === 'interested') {
        tx.update(eventRef, { interestedCount: FieldValue.increment(-1) })
      }
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[DELETE attendee]', error)
    return NextResponse.json({ error: 'Error removing attendee' }, { status: 500 })
  }
}
