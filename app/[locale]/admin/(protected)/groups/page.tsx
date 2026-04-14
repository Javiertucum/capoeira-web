import { getAllGroups } from '@/lib/queries'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminGroupsPage({ params }: Props) {
  const { locale } = await params
  let groups: any[] = []
  try {
    groups = await getAllGroups()
  } catch (error) {
    console.error('[AdminGroupsPage] failed to fetch groups', error)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopbar section="Grupos" />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Gestión de Grupos</h1>
            <p className="mt-1 text-sm text-text-muted">Administra organizaciones y sus sistemas de graduación.</p>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-text-secondary">
            {groups.length} grupos
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface/30">
                  {['Logo', 'Nombre', 'Países', 'Graduación', 'Miembros', ''].map(h => (
                    <th key={h} className="text-left text-[10px] tracking-[0.2em] uppercase text-text-muted px-6 py-4 border-b border-border font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {groups.map(group => (
                  <tr key={group.id} className="hover:bg-surface/40 transition-colors">
                    <td className="px-6 py-4">
                      {group.logoUrl ? (
                         <div className="h-10 w-10 rounded-lg border border-border bg-white overflow-hidden p-1">
                            <img src={group.logoUrl} className="h-full w-full object-contain" alt="logo" />
                         </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg border border-border bg-surface-muted flex items-center justify-center text-xs font-bold text-text-muted">
                          {group.name[0]}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text">{group.name}</div>
                      <div className="text-[10px] text-text-muted mt-1 uppercase tracking-tight">{group.id.slice(0, 12)}...</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary">
                      {group.representedCountries?.join(', ') || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="accent">{group.graduationSystemName || 'Personalizado'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-medium">
                      {group.memberCount || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/${locale}/admin/groups/${group.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-surface px-4 text-xs font-bold text-accent transition-all hover:bg-accent/10 hover:border-accent/30 no-underline"
                      >
                        Gestionar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
