import AdminCreateJobForm from '@/components/admin/AdminCreateJobForm'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import { getAdminFinanceSnapshotRows } from '@/lib/admin-queries'

type Props = { params: Promise<{ locale: string }> }

function money(value: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}

export default async function FinancesPage({ params }: Props) {
  const { locale } = await params
  const rows = await getAdminFinanceSnapshotRows().catch((error) => {
    console.error('[FinancesPage] failed to fetch finance snapshots', error)
    return []
  })
  const income = rows.filter((row) => row.kind === 'income').reduce((sum, row) => sum + row.amount, 0)
  const costs = rows.filter((row) => row.kind === 'cost').reduce((sum, row) => sum + row.amount, 0)
  const stale = rows.filter((row) => row.status === 'stale' || row.status === 'error').length
  const net = income - costs

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section="Finanzas" description="Snapshots cacheados y costos manuales." />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader eyebrow="Resultado operativo" title="Finanzas" description="La pagina lee adminFinanceSnapshots y adminFinanceManualCosts. Las APIs externas deben alimentar snapshots; el render nunca llama providers directamente." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Ingresos" value={money(income, 'USD', locale)} helper="Snapshots income" tone="accent" />
            <AdminStatCard label="Costos" value={money(costs, 'USD', locale)} helper="Snapshots cost + manual costs" tone={costs > 0 ? 'danger' : 'default'} />
            <AdminStatCard label="Neto" value={money(net, 'USD', locale)} helper="Ingresos menos costos" tone={net >= 0 ? 'accent' : 'danger'} />
            <AdminStatCard label="Stale/error" value={stale.toLocaleString(locale)} helper="Proveedores que requieren refresh" tone={stale > 0 ? 'warning' : 'accent'} />
          </div>
          <AdminCreateJobForm kind="finance-cost" />
          <AdminSectionCard title="Snapshots financieros" description="AdMob, AdSense, RevenueCat, Billing y costos manuales se consolidan aqui cuando existen datos." contentClassName="overflow-x-auto p-0">
            {rows.length === 0 ? (
              <div className="p-6"><AdminEmptyState eyebrow="Finanzas" title="No hay snapshots financieros" description="Agrega un costo manual o conecta workers para poblar adminFinanceSnapshots." /></div>
            ) : (
              <table className="w-full min-w-[840px] border-collapse">
                <thead><tr className="bg-surface/10">{['Proveedor', 'Tipo', 'Monto', 'Periodo', 'Estado', 'Fuente', 'Actualizado'].map((heading) => <th key={heading} className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">{heading}</th>)}</tr></thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-surface/30">
                      <td className="px-6 py-4 text-sm font-semibold text-text">{row.provider}</td>
                      <td className="px-6 py-4"><Badge variant={row.kind === 'income' ? 'accent' : 'danger'}>{row.kind}</Badge></td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{money(row.amount, row.currency, locale)}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{row.period || '--'}</td>
                      <td className="px-6 py-4"><Badge variant={row.status === 'error' ? 'danger' : row.status === 'stale' ? 'warning' : 'muted'}>{row.status}</Badge></td>
                      <td className="px-6 py-4 text-xs text-text-muted">{row.source ?? '--'}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{row.updatedAt ? new Date(row.updatedAt).toLocaleString(locale) : '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </AdminSectionCard>
        </div>
      </div>
    </div>
  )
}
