import AdminCreateJobForm from '@/components/admin/AdminCreateJobForm'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import { getAdminOperationJobs } from '@/lib/admin-queries'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

const EXPORT_TYPES = [
  { type: 'users', label: 'Usuarios', description: 'uid, nombre, email, rol, país, grupo, plan, fecha' },
  { type: 'events', label: 'Eventos', description: 'id, título, categoría, fechas, creador, asistentes' },
  { type: 'groups', label: 'Grupos', description: 'id, nombre, país, miembros, núcleos' },
  { type: 'attendance', label: 'Asistencia', description: 'grupo, núcleo, fecha, presentes, ausentes, %' },
  { type: 'payments', label: 'Pagos de clases', description: 'grupo, núcleo, usuario, mes, estado, monto' },
] as const

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
      <AdminTopbar section="Exportar datos" description="Descargas CSV instantáneas y jobs auditables." />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader
            eyebrow="Datos"
            title="Exportar datos"
            description="Descarga CSV directo para análisis externo. Los exports se generan al momento, sin necesidad de workers."
          />

          <AdminSectionCard
            title="Descargas CSV"
            description="Cada descarga genera el archivo al instante con los datos actuales de Firestore."
          >
            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {EXPORT_TYPES.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between rounded-2xl border border-border bg-surface/30 px-5 py-4"
                >
                  <div>
                    <div className="text-sm font-semibold text-text">{item.label}</div>
                    <div className="mt-1 text-xs text-text-muted">{item.description}</div>
                  </div>
                  <Link
                    href={`/api/admin/exports/csv/${item.type}`}
                    className="ml-4 inline-flex h-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 px-4 text-xs font-semibold text-accent transition-colors hover:bg-accent/15"
                  >
                    Descargar
                  </Link>
                </div>
              ))}
            </div>
          </AdminSectionCard>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Jobs" value={jobs.length.toLocaleString(locale)} helper="Solicitudes históricas" />
            <AdminStatCard label="En cola" value={queued.toLocaleString(locale)} helper="Listos para worker" tone={queued > 0 ? 'warning' : 'default'} />
            <AdminStatCard label="Completados" value={completed.toLocaleString(locale)} helper="Con descarga generada" tone="accent" />
            <AdminStatCard label="Fallidos" value={failed.toLocaleString(locale)} helper="Requieren reintento" tone={failed > 0 ? 'danger' : 'default'} />
          </div>

          <AdminCreateJobForm kind="export" />

          <AdminSectionCard title="Historial de jobs async" description="Jobs para workers externos que procesan exports grandes." contentClassName="overflow-x-auto p-0">
            {jobs.length === 0 ? (
              <div className="p-6"><AdminEmptyState eyebrow="Exportes" title="No hay jobs solicitados" description="Crea un job para dejarlo listo para procesamiento." /></div>
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
