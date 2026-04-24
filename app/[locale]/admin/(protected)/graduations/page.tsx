import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import { getAdminGraduationRows } from '@/lib/admin-queries'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export default async function GraduationsPage({ params }: Props) {
  const { locale } = await params
  const rows = await getAdminGraduationRows().catch((error) => {
    console.error('[GraduationsPage] failed to fetch graduations', error)
    return []
  })
  const groups = new Set(rows.map((row) => row.groupId)).size
  const assignedMembers = rows.reduce((sum, row) => sum + row.memberCount, 0)
  const educatorLevels = rows.filter((row) => row.isEducator).length

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
          <AdminSectionCard title="Catalogo de graduaciones" description="Edita el grupo para modificar el sistema completo." contentClassName="overflow-x-auto p-0">
            {rows.length === 0 ? (
              <div className="p-6">
                <AdminEmptyState eyebrow="Graduaciones" title="No hay niveles cargados" description="Cuando un grupo tenga graduationLevels aparecera aqui." />
              </div>
            ) : (
              <table className="w-full min-w-[940px] border-collapse">
                <thead>
                  <tr className="bg-surface/10">
                    {['Grupo', 'Nivel', 'Orden', 'Categoria', 'Colores', 'Miembros', ''].map((heading) => (
                      <th key={heading} className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row) => (
                    <tr key={`${row.groupId}:${row.id}`} className="transition-colors hover:bg-surface/30">
                      <td className="px-6 py-4 text-sm text-text-secondary">{row.groupName}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-text">{row.name}</div>
                        {row.isSpecial ? <div className="mt-1"><Badge variant="warning">Especial</Badge></div> : null}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{row.order}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{row.category ?? '--'}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {row.colors.map((color) => <span key={color} className="h-5 w-5 rounded-full border border-border" style={{ backgroundColor: color }} />)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-text">{row.memberCount}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/${locale}/admin/groups/${row.groupId}`} className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-surface px-4 text-xs font-bold text-accent transition-all hover:border-accent/30 hover:bg-accent/10">Grupo</Link>
                      </td>
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
