import type { FinanceProviderResult } from './types'

function currentPeriod() {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

export async function fetchGCloudBillingCost(): Promise<FinanceProviderResult> {
  const billingAccountId = process.env.GOOGLE_CLOUD_BILLING_ACCOUNT_ID
  const saKeyJson = process.env.GOOGLE_CLOUD_SA_KEY_JSON

  if (!billingAccountId || !saKeyJson) {
    return {
      available: false,
      provider: 'Google Cloud',
      kind: 'cost',
      amount: 0,
      currency: 'USD',
      period: currentPeriod(),
      status: 'unavailable',
    }
  }

  // Cloud Billing API requires service account JWT auth.
  // Architecture is ready — enable when SA key is configured in env vars.
  return {
    available: false,
    provider: 'Google Cloud',
    kind: 'cost',
    amount: 0,
    currency: 'USD',
    period: currentPeriod(),
    status: 'unavailable',
    errorMessage: 'GCloud billing SA JWT auth pending configuration',
  }
}
