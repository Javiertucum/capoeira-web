export type FinanceProviderResult = {
  available: boolean
  provider: string
  kind: 'income' | 'cost'
  amount: number
  currency: string
  period: string
  status: 'fresh' | 'stale' | 'error' | 'unavailable'
  errorMessage?: string
  metadata?: Record<string, unknown>
}
