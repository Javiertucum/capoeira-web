import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminModerationActionButtons from '@/components/admin/AdminModerationActionButtons'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import { getAdminModerationEntities } from '@/lib/admin-queries'

type Props = {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ state?: string; type?: string }>
}

function stateVariant(state: string) {
  if (state === 'suspended') return 'danger' as const
  if (state === 'hidden') return 'warning' as const
  return 'accent' as const
}

export default async function ModerationPage({ params, searchParams }: Props) {
  const { locale } = await params
  const filters = (await searchParams) ?? {}
  const { rows, stats } = await getAdminModerationEntities().catch((error) => {
    console.error('[ModerationPage] failed to fetch moderation entities', error)
    return {
      rows: [],
      stats: { total: 0, visible: 0, hidden: 0, suspended: 0 },
    }
  })

  const filteredRows = rows.filter((row) => {
    if (filters.state && row.state !== filters.state) return false
    if (filters.type && row.type !== filters.type) return false
    return true
  })

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar
        section="Moderacion"
        description="Control directo de visibilidad publica y suspensiones."
      />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader
            eyebrow="Control publico"
            title="Moderacion"
            description="Las acciones de esta pantalla escriben el objeto moderation en Firestore. La web publica ya excluye usuarios, grupos, nucleos y eventos ocultos o suspendidos."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Entidades" value={stats.total.toLocaleString(locale)} helper="Inventario moderable cargado" />
            <AdminStatCard label="Visibles" value={stats.visible.toLocaleString(locale)} helper="Aparecen en la web publica" tone="accent" />
            <AdminStatCard label="Ocultas" value={stats.hidden.toLocaleString(locale)} helper="Fuera de listados y detalle" tone={stats.hidden > 0 ? 'warning' : 'default'} />
            <AdminStatCard label="Suspendidas" value={stats.suspended.toLocaleString(locale)} helper="Solo aplica a usuarios" tone={stats.suspended > 0 ? 'danger' : 'default'} />
          </div>

          <AdminSectionCard
            title="Inventario de moderacion"
            description="Ocultar afecta la visibilidad publica. Restaurar vuelve el estado a visible."
            contentClassName="overflow-x-auto p-0"
          >
            {filteredRows.length === 0 ? (
              <div className="p-6">
                <AdminEmptyState
                  eyebrow="Moderacion"
                  title="No hay entidades para este filtro"
                  description="El inventario se alimenta desde usuarios, grupos, nucleos y eventos actuales."
                />
              </div>
            ) : (
              <table className="w-full min-w-[1040px] border-collapse">
                <thead>
                  <tr className="bg-surface/10">
                    {['Tipo', 'Entidad', 'Estado', 'Motivo', 'Grupo', 'Actualizado', 'Acciones'].map((heading) => (
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
                    <tr key={`${row.type}:${row.groupId ?? 'root'}:${row.id}`} className="align-top transition-colors hover:bg-surface/30">
                      <td className="px-6 py-4">
                        <Badge>{row.type}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-text">{row.label}</div>
                        <div className="mt-1 max-w-[360px] text-xs text-text-muted">{row.description || row.id}</div>
                        <div className="mt-1 text-[11px] text-text-muted">{row.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={stateVariant(row.state)}>{row.state}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {row.reason ?? row.note ?? '--'}
                      </td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{row.groupId ?? '--'}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">
                        {row.updatedAt ? new Date(row.updatedAt).toLocaleString(locale) : '--'}
                      </td>
                      <td className="px-6 py-4">
                        <AdminModerationActionButtons
                          entityId={row.id}
                          entityType={row.type}
                          groupId={row.groupId}
                          state={row.state}
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
