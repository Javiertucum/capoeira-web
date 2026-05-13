import type { AdminFinanceSnapshotRow } from '@/lib/admin-queries'

const HIDDEN_PROVIDERS = new Set(['admob', 'adsense'])

export function getFinanceDashboardRows(rows: AdminFinanceSnapshotRow[]): AdminFinanceSnapshotRow[] {
  return rows.filter((row) => !HIDDEN_PROVIDERS.has(row.provider.trim().toLowerCase()))
}
