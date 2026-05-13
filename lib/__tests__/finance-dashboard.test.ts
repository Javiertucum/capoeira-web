import { getFinanceDashboardRows } from '../finance-dashboard'

describe('getFinanceDashboardRows', () => {
  it('excludes ad providers from the admin finance dashboard', () => {
    const rows = getFinanceDashboardRows([
      {
        id: 'adsense',
        provider: 'AdSense',
        kind: 'income',
        amount: 12,
        currency: 'USD',
        period: '2026-05',
        status: 'fresh',
        updatedAt: null,
        source: 'api_refresh',
      },
      {
        id: 'admob',
        provider: 'AdMob',
        kind: 'income',
        amount: 20,
        currency: 'USD',
        period: '2026-05',
        status: 'fresh',
        updatedAt: null,
        source: 'api_refresh',
      },
      {
        id: 'revenuecat',
        provider: 'RevenueCat',
        kind: 'income',
        amount: 50,
        currency: 'USD',
        period: '2026-05',
        status: 'fresh',
        updatedAt: null,
        source: 'api_refresh',
      },
    ])

    expect(rows.map((row) => row.provider)).toEqual(['RevenueCat'])
  })
})
