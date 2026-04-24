import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import { getAdminClassPaymentRows } from '@/lib/admin-queries'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

function statusVariant(status: string) {
  if (status === 'paid') return 'accent' as const
  if (status === 'free') return 'muted' as const
  return 'warning' as const
}

export default async function ClassPaymentsPage({ params }: Props) {
  const { locale } = await params
  const rows = await getAdminClassPaymentRows().catch((error) => {
    console.error('[ClassPaymentsPage] failed to fetch payments', error)
    return []
  })
  const pending = rows.filter((row) => row.status === 'pending').length
  const paid = rows.filter((row) => row.status === 'paid').length
  const reported = rows.filter((row) => row.reportedByStudent && !row.confirmedByEducator).length
  const totalAmount = rows.reduce((sum, row) => sum + (row.amount ?? 0), 0)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section="Pagos de clases" description="Conciliacion de pagos reportados por nucleos." />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader eyebrow="Cobranza operativa" title="Pagos de clases" description="Lectura real de groups/{groupId}/nucleos/{nucleoId}/payments para revisar pendientes, confirmados y reportes de alumnos." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Pagos" value={rows.length.toLocaleString(locale)} helper="Registros leidos" />
            <AdminStatCard label="Pendientes" value={pending.toLocaleString(locale)} helper="Requieren revision" tone={pending > 0 ? 'warning' : 'accent'} />
            <AdminStatCard label="Pagados" value={paid.toLocaleString(locale)} helper="Confirmados" tone="accent" />
            <AdminStatCard label="Monto visible" value={`$${totalAmount.toLocaleString(locale)}`} helper={`${reported} reportados sin confirmar`} />
          </div>
          <AdminSectionCard title="Registros de pago" description="Para corregir configuracion de cobro, entra al nucleo correspondiente." contentClassName="overflow-x-auto p-0">
            {rows.length === 0 ? (
              <div className="p-6"><AdminEmptyState eyebrow="Pagos" title="No hay pagos registrados" description="Cuando existan payments por nucleo apareceran en esta vista." /></div>
            ) : (
              <table className="w-full min-w-[1040px] border-collapse">
                <thead><tr className="bg-surface/10">{['Mes', 'Usuario', 'Grupo', 'Nucleo', 'Estado', 'Monto', 'Reporte', 'Actualizado', ''].map((heading) => <th key={heading} className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">{heading}</th>)}</tr></thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row) => (
                    <tr key={`${row.groupId}:${row.nucleoId}:${row.id}`} className="transition-colors hover:bg-surface/30">
                      <td className="px-6 py-4 text-sm text-text-secondary">{row.month || '--'}</td>
                      <td className="px-6 py-4 text-xs text-text-muted">{row.userId || '--'}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{row.groupName}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-text">{row.nucleoName}</td>
                      <td className="px-6 py-4"><Badge variant={statusVariant(row.status)}>{row.status}</Badge></td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{row.amount ? `$${row.amount.toLocaleString(locale)}` : '--'}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{row.reportedByStudent ? (row.confirmedByEducator ? 'Confirmado' : 'Alumno') : '--'}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{row.updatedAt ? new Date(row.updatedAt).toLocaleString(locale) : '--'}</td>
                      <td className="px-6 py-4 text-right"><Link href={`/${locale}/admin/nucleos/${row.groupId}/${row.nucleoId}`} className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-surface px-4 text-xs font-bold text-accent transition-all hover:border-accent/30 hover:bg-accent/10">Nucleo</Link></td>
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
