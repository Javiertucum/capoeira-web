import type { FinanceProviderResult } from './types'

function currentPeriod() {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

export async function fetchRevenueCatMrr(): Promise<FinanceProviderResult> {
  const apiKey = process.env.REVENUECAT_API_KEY
  if (!apiKey) {
    return { available: false, provider: 'RevenueCat', kind: 'income', amount: 0, currency: 'USD', period: currentPeriod(), status: 'unavailable' }
  }

  try {
    const response = await fetch('https://api.revenuecat.com/v1/charts/mrr', {
      headers: { Authorization: `Bearer ${apiKey}`, 'X-Platform': 'ios' },
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json() as { summary?: { total?: number; currency?: string } }
    const amount = data?.summary?.total ?? 0
    const currency = data?.summary?.currency ?? 'USD'
    return { available: true, provider: 'RevenueCat', kind: 'income', amount, currency, period: currentPeriod(), status: 'fresh', metadata: data as Record<string, unknown> }
  } catch (error) {
    return { available: true, provider: 'RevenueCat', kind: 'income', amount: 0, currency: 'USD', period: currentPeriod(), status: 'error', errorMessage: String(error) }
  }
}
