import { NextRequest, NextResponse } from 'next/server'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { runCampaignSend, type DeepLink } from '@/lib/notification-send-campaign'
import { type SegmentFilter } from '@/lib/notification-audience'

export const maxDuration = 60

// Cap per run so a backlog can't blow past maxDuration; the cron fires every minute,
// so any leftovers are picked up on the next tick.
const BATCH_LIMIT = 10

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return request.headers.get('authorization') === `Bearer ${secret}`
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const snap = await adminDb
    .collection('adminNotificationCampaigns')
    .where('status', '==', 'scheduled')
    .where('scheduledAt', '<=', Timestamp.now())
    .limit(BATCH_LIMIT)
    .get()

  const results: { id: string; sent?: number; failed?: number; error?: string }[] = []

  for (const doc of snap.docs) {
    const data = doc.data()
    try {
      const result = await runCampaignSend({
        campaignId: doc.id,
        title: typeof data.title === 'string' ? data.title : '',
        body: typeof data.body === 'string' ? data.body : '',
        segment: (data.segment ?? {}) as SegmentFilter,
        deepLink: (data.deepLink ?? undefined) as DeepLink | undefined,
        createdBy: typeof data.createdBy === 'string' ? data.createdBy : 'cron',
      })
      results.push({ id: doc.id, sent: result.sent, failed: result.failed })
    } catch (error) {
      console.error('[cron] failed to process scheduled campaign', doc.id, error)
      await doc.ref
        .set({ status: 'failed', updatedAt: FieldValue.serverTimestamp() }, { merge: true })
        .catch(() => {})
      results.push({ id: doc.id, error: error instanceof Error ? error.message : 'unknown error' })
    }
  }

  return NextResponse.json({ processed: results.length, results })
}
