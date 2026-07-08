import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import CordaVisual from '@/components/public/CordaVisual'
import Badge from '@/components/ui/Badge'
import { getAdminGraduationRows, getAdminGroupOptions, type AdminGraduationLevelRow } from '@/lib/admin-queries'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export default async function GraduationsPage({ params }: Props) {
  const { locale } = await params
  const [rows, allGroups] = await Promise.all([
    getAdminGraduationRows().catch((error) => {
      console.error('[GraduationsPage] failed to fetch graduations', error)
      return []
    }),
    getAdminGroupOptions().catch(() => []),
  ])
  const groups = new Set(rows.map((row) => row.groupId)).size
  const assignedMembers = rows.reduce((sum, row) => sum + row.memberCount, 0)
  const educatorLevels = rows.filter((row) => row.isEducator).length

  const groupedRows = new Map<string, { groupId: string; groupName: string; rows: AdminGraduationLevelRow[] }>()
  rows.forEach((row) => {
    const entry = groupedRows.get(row.groupId)
    if (entry) {
      entry.rows.push(row)
    } else {
      groupedRows.set(row.groupId, { groupId: row.groupId, groupName: row.groupName, rows: [row] })
    }
  })
  // Grupos sin sistema de graduación: también deben aparecer, con CTA para
  // crear el primer nivel.
  allGroups.forEach((group) => {
    if (!groupedRows.has(group.id)) {
      groupedRows.set(group.id, { groupId: group.id, groupName: group.name, rows: [] })
    }
  })
  const groupSections = Array.from(groupedRows.values()).sort((a, b) => a.groupName.localeCompare(b.groupName))

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section="Graduaciones" description="Catalogo de cordas por grupo y uso real por miembros." />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader
            eyebrow="Jerarquia tecnica"
            title="Graduaciones"
            description="Lectura real de groups/{groupId}/graduationLevels con conteo de miembros que usan cada nivel."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Niveles" value={rows.length.toLocaleString(locale)} helper="Cordas cargadas en todos los grupos" tone="accent" />
            <AdminStatCard label="Grupos" value={groups.toLocaleString(locale)} helper="Sistemas con graduaciones definidas" />
            <AdminStatCard label="Asignaciones" value={assignedMembers.toLocaleString(locale)} helper="Usuarios con graduationLevelId" />
            <AdminStatCard label="Niveles educador" value={educatorLevels.toLocaleString(locale)} helper="Marcados como isEducator" />
          </div>
          <AdminSectionCard title="Catalogo de graduaciones" description="Edita el grupo para modificar el sistema completo." contentClassName="p-0">
            {rows.length === 0 ? (
              <div className="p-6">
                <AdminEmptyState eyebrow="Graduaciones" title="No hay niveles cargados" description="Cuando un grupo tenga graduationLevels aparecera aqui." />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {groupSections.map((section) => (
                  <details key={section.groupId} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-surface/30">
                      <div className="flex items-center gap-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0 text-text-muted transition-transform group-open:rotate-90">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                        <span className="text-sm font-semibold text-text">{section.groupName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/${locale}/admin/graduations/${section.groupId}/new`}
                          className="inline-flex h-7 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 px-3 text-xs font-bold text-accent transition-all hover:bg-accent/20"
                        >
                          + Crear nivel
                        </Link>
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{section.rows.length} niveles</span>
                      </div>
                    </summary>
                    {section.rows.length === 0 ? (
                      <div className="px-6 py-5 text-sm text-text-muted">
                        Este grupo aún no tiene sistema de graduación — usa &quot;+ Crear nivel&quot; para cargar el primero.
                      </div>
                    ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[940px] border-collapse">
                        <thead>
                          <tr className="bg-surface/10">
                            {['Nivel', 'Orden', 'Categoria', 'Colores', 'Miembros', ''].map((heading) => (
                              <th key={heading} className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">{heading}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {section.rows.map((row) => (
                            <tr key={`${row.groupId}:${row.id}`} className="transition-colors hover:bg-surface/30">
                              <td className="px-6 py-4">
                                <div className="text-sm font-semibold text-text">{row.name}</div>
                                {row.isSpecial ? <div className="mt-1"><Badge variant="warning">Especial</Badge></div> : null}
                              </td>
                              <td className="px-6 py-4 text-sm text-text-secondary">{row.order}</td>
                              <td className="px-6 py-4 text-sm text-text-secondary">{row.category ?? '--'}</td>
                              <td className="px-6 py-4">
                                <CordaVisual colors={row.colors} tipColorLeft={row.tipColorLeft} tipColorRight={row.tipColorRight} midColorLeft={row.midColorLeft} midColorRight={row.midColorRight} width={96} height={14} />
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-text">{row.memberCount}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <Link href={`/${locale}/admin/graduations/${row.groupId}/${row.id}`} className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-surface px-4 text-xs font-bold text-accent transition-all hover:border-accent/30 hover:bg-accent/10">Editar</Link>
                                  <Link href={`/${locale}/admin/groups/${row.groupId}`} className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-surface px-3 text-xs font-bold text-text-secondary transition-all hover:text-text">Grupo</Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    )}
                  </details>
                ))}
              </div>
            )}
          </AdminSectionCard>
        </div>
      </div>
    </div>
  )
}
