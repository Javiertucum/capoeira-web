import AdminCreateJobForm from '@/components/admin/AdminCreateJobForm'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import { getAdminOperationJobs } from '@/lib/admin-queries'

type Props = { params: Promise<{ locale: string }> }

export default async function ExportsPage({ params }: Props) {
  const { locale } = await params
  const jobs = await getAdminOperationJobs('adminExportJobs').catch((error) => {
    console.error('[ExportsPage] failed to fetch export jobs', error)
    return []
  })
  const queued = jobs.filter((job) => job.status === 'queued').length
  const completed = jobs.filter((job) => job.status === 'completed').length
  const failed = jobs.filter((job) => job.status === 'failed').length

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section="Exportar datos" description="Jobs auditables para descargas CSV/JSON." />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader eyebrow="Datos" title="Exportar datos" description="Crea jobs en adminExportJobs. El worker de Functions debe generar archivos, firmar URL y actualizar estados completed/failed." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Jobs" value={jobs.length.toLocaleString(locale)} helper="Solicitudes historicas" />
            <AdminStatCard label="En cola" value={queued.toLocaleString(locale)} helper="Listos para worker" tone={queued > 0 ? 'warning' : 'default'} />
            <AdminStatCard label="Completados" value={completed.toLocaleString(locale)} helper="Con descarga generada" tone="accent" />
            <AdminStatCard label="Fallidos" value={failed.toLocaleString(locale)} helper="Requieren reintento" tone={failed > 0 ? 'danger' : 'default'} />
          </div>
          <AdminCreateJobForm kind="export" />
          <AdminSectionCard title="Historial de exportes" description="Los jobs quedan trazados con autor, estado y metadata." contentClassName="overflow-x-auto p-0">
            {jobs.length === 0 ? (
              <div className="p-6"><AdminEmptyState eyebrow="Exportes" title="No hay exportes solicitados" description="Crea un job para dejarlo listo para procesamiento." /></div>
            ) : (
              <table className="w-full min-w-[820px] border-collapse">
                <thead><tr className="bg-surface/10">{['Nombre', 'Estado', 'Tipo', 'Creado por', 'Creado', 'Actualizado'].map((heading) => <th key={heading} className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">{heading}</th>)}</tr></thead>
                <tbody className="divide-y divide-border">
                  {jobs.map((job) => (
                    <tr key={job.id} className="transition-colors hover:bg-surface/30">
                      <td className="px-6 py-4 text-sm font-semibold text-text">{job.title}</td>
                      <td className="px-6 py-4"><Badge variant={job.status === 'failed' ? 'danger' : job.status === 'completed' ? 'accent' : 'warning'}>{job.status}</Badge></td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{job.type ?? 'json'}</td>
                      <td className="px-6 py-4 text-xs text-text-muted">{job.createdBy ?? '--'}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{job.createdAt ? new Date(job.createdAt).toLocaleString(locale) : '--'}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{job.updatedAt ? new Date(job.updatedAt).toLocaleString(locale) : '--'}</td>
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
