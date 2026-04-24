import type { FinanceProviderResult } from './types'

function currentPeriod() {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

type TokenResponse = { access_token: string }
type AdMobReportRow = { row?: { metricValues?: { ESTIMATED_EARNINGS?: { microsValue?: string } } } }

export async function fetchAdMobEarnings(): Promise<FinanceProviderResult> {
  const clientId = process.env.ADMOB_CLIENT_ID
  const clientSecret = process.env.ADMOB_CLIENT_SECRET
  const publisherId = process.env.ADMOB_PUBLISHER_ID
  const refreshToken = process.env.ADMOB_REFRESH_TOKEN

  if (!clientId || !clientSecret || !publisherId || !refreshToken) {
    return { available: false, provider: 'AdMob', kind: 'income', amount: 0, currency: 'USD', period: currentPeriod(), status: 'unavailable' }
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' }),
      signal: AbortSignal.timeout(10000),
    })
    if (!tokenResponse.ok) throw new Error(`Token HTTP ${tokenResponse.status}`)
    const { access_token } = await tokenResponse.json() as TokenResponse

    const now = new Date()
    const reportResponse = await fetch(
      `https://admob.googleapis.com/v1/accounts/${publisherId}/networkReport:generate`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_spec: {
            date_range: {
              start_date: { year: now.getFullYear(), month: now.getMonth() + 1, day: 1 },
              end_date: { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() },
            },
            metrics: ['ESTIMATED_EARNINGS'],
          },
        }),
        signal: AbortSignal.timeout(15000),
      }
    )
    if (!reportResponse.ok) throw new Error(`Report HTTP ${reportResponse.status}`)
    const reportData = await reportResponse.json() as AdMobReportRow[]
    const totalMicros = reportData.reduce((sum, entry) => {
      return sum + Number(entry?.row?.metricValues?.ESTIMATED_EARNINGS?.microsValue ?? 0)
    }, 0)

    return { available: true, provider: 'AdMob', kind: 'income', amount: totalMicros / 1_000_000, currency: 'USD', period: currentPeriod(), status: 'fresh' }
  } catch (error) {
    return { available: true, provider: 'AdMob', kind: 'income', amount: 0, currency: 'USD', period: currentPeriod(), status: 'error', errorMessage: String(error) }
  }
}
