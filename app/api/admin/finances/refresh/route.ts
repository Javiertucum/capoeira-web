import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { adminDb } from '@/lib/firebase-admin'
import { fetchRevenueCatMrr } from '@/lib/finance-providers/revenuecat'
import { fetchAdMobEarnings } from '@/lib/finance-providers/admob'
import { fetchAdSenseEarnings } from '@/lib/finance-providers/adsense'
import { fetchGCloudBillingCost } from '@/lib/finance-providers/gcloud-billing'

function currentPeriod() {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const results = await Promise.allSettled([
    fetchRevenueCatMrr(),
    fetchAdMobEarnings(),
    fetchAdSenseEarnings(),
    fetchGCloudBillingCost(),
  ])

  const period = currentPeriod()
  const batch = adminDb.batch()

  for (const result of results) {
    if (result.status === 'rejected') continue
    const data = result.value
    const docId = `${data.provider.toLowerCase().replace(/\s+/g, '_')}_${period}`
    const ref = adminDb.collection('adminFinanceSnapshots').doc(docId)
    batch.set(ref, {
      provider: data.provider,
      kind: data.kind,
      amount: data.amount,
      currency: data.currency,
      period: data.period,
      status: data.status,
      source: 'api_refresh',
      errorMessage: data.errorMessage ?? null,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true })
  }

  await batch.commit()

  const summary = results.map((result) =>
    result.status === 'fulfilled'
      ? { provider: result.value.provider, status: result.value.status }
      : { provider: 'unknown', status: 'rejected' }
  )

  return NextResponse.json({ ok: true, period, summary })
}
