import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import { getAdminAttendanceRows } from '@/lib/admin-queries'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export default async function AttendancePage({ params }: Props) {
  const { locale } = await params
  const rows = await getAdminAttendanceRows().catch((error) => {
    console.error('[AttendancePage] failed to fetch attendance', error)
    return []
  })
  const totalPresent = rows.reduce((sum, row) => sum + row.attendees, 0)
  const totalAbsent = rows.reduce((sum, row) => sum + row.absentees, 0)
  const nucleos = new Set(rows.map((row) => `${row.groupId}:${row.nucleoId}`)).size

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section="Asistencia" description="Sesiones reales registradas por nucleo." />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader eyebrow="Control de clases" title="Asistencia" description="Lectura de collectionGroup('sessions') con presentes, ausentes y enlaces a cada nucleo." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Sesiones" value={rows.length.toLocaleString(locale)} helper="Ultimos registros encontrados" tone="accent" />
            <AdminStatCard label="Presentes" value={totalPresent.toLocaleString(locale)} helper="Suma de attendees" />
            <AdminStatCard label="Ausentes" value={totalAbsent.toLocaleString(locale)} helper="Suma de absentees" />
            <AdminStatCard label="Nucleos" value={nucleos.toLocaleString(locale)} helper="Con sesiones registradas" />
          </div>
          <AdminSectionCard title="Sesiones recientes" description="La edicion fina vive en el nucleo; esta vista consolida auditoria operacional." contentClassName="overflow-x-auto p-0">
            {rows.length === 0 ? (
              <div className="p-6"><AdminEmptyState eyebrow="Asistencia" title="No hay sesiones registradas" description="Cuando los educadores registren asistencia, las sesiones apareceran aqui." /></div>
            ) : (
              <table className="w-full min-w-[900px] border-collapse">
                <thead><tr className="bg-surface/10">{['Fecha', 'Grupo', 'Nucleo', 'Presentes', 'Ausentes', 'Creado por', ''].map((heading) => <th key={heading} className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">{heading}</th>)}</tr></thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row) => (
                    <tr key={`${row.groupId}:${row.nucleoId}:${row.id}`} className="transition-colors hover:bg-surface/30">
                      <td className="px-6 py-4 text-sm text-text-secondary">{row.date ? new Date(row.date).toLocaleString(locale) : '--'}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{row.groupName}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-text">{row.nucleoName}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{row.attendees}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{row.absentees}</td>
                      <td className="px-6 py-4 text-xs text-text-muted">{row.createdBy || '--'}</td>
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
