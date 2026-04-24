import type { FinanceProviderResult } from './types'

function currentPeriod() {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

type TokenResponse = { access_token: string }
type AdSenseReport = { totals?: { cells?: Array<{ value?: string }> } }

export async function fetchAdSenseEarnings(): Promise<FinanceProviderResult> {
  const clientId = process.env.ADSENSE_CLIENT_ID
  const clientSecret = process.env.ADSENSE_CLIENT_SECRET
  const publisherId = process.env.ADSENSE_PUBLISHER_ID
  const refreshToken = process.env.ADSENSE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !publisherId || !refreshToken) {
    return { available: false, provider: 'AdSense', kind: 'income', amount: 0, currency: 'USD', period: currentPeriod(), status: 'unavailable' }
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
    const url = new URL(`https://adsense.googleapis.com/v2/accounts/${publisherId}/reports:generate`)
    url.searchParams.set('metrics', 'ESTIMATED_EARNINGS')
    url.searchParams.set('dateRange', 'CUSTOM')
    url.searchParams.set('startDate.year', String(now.getFullYear()))
    url.searchParams.set('startDate.month', String(now.getMonth() + 1))
    url.searchParams.set('startDate.day', '1')
    url.searchParams.set('endDate.year', String(now.getFullYear()))
    url.searchParams.set('endDate.month', String(now.getMonth() + 1))
    url.searchParams.set('endDate.day', String(now.getDate()))

    const reportResponse = await fetch(url, {
      headers: { Authorization: `Bearer ${access_token}` },
      signal: AbortSignal.timeout(15000),
    })
    if (!reportResponse.ok) throw new Error(`Report HTTP ${reportResponse.status}`)
    const reportData = await reportResponse.json() as AdSenseReport
    const amount = Number(reportData?.totals?.cells?.[0]?.value ?? 0)

    return { available: true, provider: 'AdSense', kind: 'income', amount, currency: 'USD', period: currentPeriod(), status: 'fresh' }
  } catch (error) {
    return { available: true, provider: 'AdSense', kind: 'income', amount: 0, currency: 'USD', period: currentPeriod(), status: 'error', errorMessage: String(error) }
  }
}
