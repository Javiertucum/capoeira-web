import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminFeaturedToggle from '@/components/admin/AdminFeaturedToggle'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import { getAdminFeaturedContentRows } from '@/lib/admin-queries'

type Props = {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ type?: string; status?: string }>
}

export default async function FeaturedContentPage({ params, searchParams }: Props) {
  const { locale } = await params
  const filters = (await searchParams) ?? {}
  const rows = await getAdminFeaturedContentRows().catch((error) => {
    console.error('[FeaturedContentPage] failed to fetch featured rows', error)
    return []
  })

  const activeRows = rows.filter((row) => row.active)
  const filteredRows = rows.filter((row) => {
    if (filters.type && row.entityType !== filters.type) return false
    if (filters.status === 'active' && !row.active) return false
    if (filters.status === 'inactive' && row.active) return false
    return true
  })

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar
        section="Contenido destacado"
        description="Ranking editorial para superficies publicas."
      />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader
            eyebrow="Editorial"
            title="Contenido destacado"
            description="Activa o desactiva entidades destacadas. La homepage ya usa picks activos de educadores y mantiene fallback automatico cuando no hay seleccion editorial."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Candidatos" value={rows.length.toLocaleString(locale)} helper="Usuarios, grupos, nucleos y eventos cargados" />
            <AdminStatCard label="Destacados" value={activeRows.length.toLocaleString(locale)} helper="Activos en adminFeaturedContent" tone="accent" />
            <AdminStatCard label="Educadores activos" value={activeRows.filter((row) => row.entityType === 'user').length.toLocaleString(locale)} helper="Usados por la homepage" />
            <AdminStatCard label="Orden editorial" value={activeRows.length > 0 ? 'Activo' : '--'} helper="Orden ascendente por campo order" tone={activeRows.length > 0 ? 'accent' : 'default'} />
          </div>

          <AdminSectionCard
            title="Inventario destacable"
            description="Los educadores destacados tienen efecto publico inmediato. Otros tipos quedan preparados para superficies editoriales futuras."
            contentClassName="overflow-x-auto p-0"
          >
            {filteredRows.length === 0 ? (
              <div className="p-6">
                <AdminEmptyState
                  eyebrow="Destacados"
                  title="No hay contenido para este filtro"
                  description="El inventario se carga desde usuarios, grupos, nucleos y eventos."
                />
              </div>
            ) : (
              <table className="w-full min-w-[940px] border-collapse">
                <thead>
                  <tr className="bg-surface/10">
                    {['Tipo', 'Entidad', 'Estado', 'Orden', 'Grupo', 'Actualizado', 'Accion'].map((heading) => (
                      <th
                        key={heading}
                        className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="align-top transition-colors hover:bg-surface/30">
                      <td className="px-6 py-4">
                        <Badge>{row.entityType}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-text">{row.label}</div>
                        <div className="mt-1 text-xs text-text-muted">{row.description || row.entityId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={row.active ? 'accent' : 'muted'}>
                          {row.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{row.order}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{row.groupId ?? '--'}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">
                        {row.updatedAt ? new Date(row.updatedAt).toLocaleString(locale) : '--'}
                      </td>
                      <td className="px-6 py-4">
                        <AdminFeaturedToggle
                          entityId={row.entityId}
                          entityType={row.entityType}
                          groupId={row.groupId}
                          label={row.label}
                          active={row.active}
                          order={row.order}
                        />
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
