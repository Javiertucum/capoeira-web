import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { adminDb } from '@/lib/firebase-admin'

const PAGE_SIZE = 20

type Filter = 'all' | 'sent' | 'opened' | 'failed'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { campaignId } = await params
  const searchParams = request.nextUrl.searchParams
  const filter = (searchParams.get('filter') ?? 'all') as Filter
  const cursor = searchParams.get('cursor') ?? null

  let query = adminDb
    .collection('adminNotificationCampaigns')
    .doc(campaignId)
    .collection('recipients')
    .orderBy('displayName')
    .limit(PAGE_SIZE + 1)

  if (filter === 'sent') query = query.where('sent', '==', true) as typeof query
  if (filter === 'opened') query = query.where('opened', '==', true) as typeof query
  if (filter === 'failed') query = query.where('sent', '==', false) as typeof query

  if (cursor) {
    const cursorDoc = await adminDb
      .collection('adminNotificationCampaigns')
      .doc(campaignId)
      .collection('recipients')
      .doc(cursor)
      .get()
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc) as typeof query
    }
  }

  const snap = await query.get()
  const docs = snap.docs

  const hasMore = docs.length > PAGE_SIZE
  const pageItems = hasMore ? docs.slice(0, PAGE_SIZE) : docs
  const nextCursor = hasMore ? pageItems[pageItems.length - 1].id : null

  const recipients = pageItems.map((doc) => {
    const data = doc.data()
    return {
      uid: doc.id,
      displayName: data.displayName ?? '',
      email: data.email ?? '',
      sent: data.sent === true,
      opened: data.opened === true,
      openedAt: data.openedAt?.toDate?.()?.toISOString() ?? null,
    }
  })

  return NextResponse.json({ recipients, nextCursor })
}
