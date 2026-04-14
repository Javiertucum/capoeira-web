import { getDashboardStats, getAdminUsers, getBugReports, getAdminEvents } from '@/lib/admin-queries'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params
  
  // Use trial-and-error approach for now to handle potential empty collections
  const [stats, users, bugs, events] = await Promise.all([
    getDashboardStats(),
    getAdminUsers(5).catch(() => []),
    getBugReports().catch(() => []),
    getAdminEvents(5).catch(() => []),
  ])

  const recentBugs = bugs.slice(0, 4)

  const statCards = [
    { label: 'Usuarios totales',     value: stats.totalUsers,      trend: `+${stats.newUsersThisWeek} esta semana`, variant: 'accent' as const },
    { label: 'Grupos activos',       value: stats.totalGroups,     trend: null, variant: 'accent' as const },
    { label: 'Núcleos',              value: stats.totalNucleos,    trend: null, variant: 'accent' as const },
    { label: 'Bug reports abiertos', value: stats.openBugReports,  trend: null, variant: stats.openBugReports > 0 ? 'warning' as const : 'accent' as const },
  ]

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopbar section="Dashboard" />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">Resumen global de la plataforma.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {statCards.map(card => (
            <div key={card.label} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-4">{card.label}</div>
              <div className={`text-4xl font-bold leading-none mb-3 ${card.variant === 'warning' ? 'text-warning' : 'text-text'}`}>
                {card.value.toLocaleString()}
              </div>
              {card.trend && (
                <div className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                  {card.trend}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-10">
          {/* Recent users */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface/30">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text">Usuarios recientes</h2>
              <Link href={`/${locale}/admin/users`} className="text-xs font-semibold text-accent hover:opacity-80 transition-opacity">Ver todos →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface/10">
                    {['Nombre', 'Rol', 'Estado'].map(h => (
                      <th key={h} className="text-left text-[10px] tracking-[0.2em] uppercase text-text-muted px-6 py-3 border-b border-border font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map(user => (
                    <tr key={user.uid} className="hover:bg-surface/40 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/${locale}/admin/users/${user.uid}`} className="text-sm font-medium text-text hover:text-accent transition-colors">
                          {user.name} {user.surname}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-xs text-text-secondary capitalize">{user.role}</td>
                      <td className="px-6 py-4">
                        <Badge variant={user.disabled ? 'danger' : 'accent'}>
                          {user.disabled ? 'Bloqueado' : 'Activo'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-sm text-text-muted italic">
                        No hay usuarios registrados todavía.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bug reports */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface/30">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text">Bug Reports</h2>
              <Link href={`/${locale}/admin/bug-reports`} className="text-xs font-semibold text-accent hover:opacity-80 transition-opacity">Ver todos →</Link>
            </div>
            <div className="divide-y divide-border">
              {recentBugs.map(bug => (
                <Link
                  key={bug.id}
                  href={`/${locale}/admin/bug-reports/${bug.id}`}
                  className="flex items-start gap-4 px-6 py-5 hover:bg-surface/40 transition-colors no-underline group"
                >
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-sm
                    ${bug.status === 'open' ? 'bg-danger' : bug.status === 'reviewing' ? 'bg-warning' : 'bg-accent'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text group-hover:text-accent transition-colors truncate">{bug.description}</div>
                    <div className="mt-1 text-xs text-text-muted">{bug.userEmail} · v{bug.appVersion}</div>
                  </div>
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex-shrink-0">
                    {bug.createdAt ? new Date(bug.createdAt).toLocaleDateString(locale) : '—'}
                  </div>
                </Link>
              ))}
              {recentBugs.length === 0 && (
                <div className="px-6 py-10 text-center text-sm text-text-muted italic">
                  No hay reportes de bugs pendientes.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Recent Events */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-10">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface/30">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text">Eventos recientes</h2>
            <Link href={`/${locale}/admin/events`} className="text-xs font-semibold text-accent hover:opacity-80 transition-opacity">Ver todos →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface/10">
                  {['Título', 'Organizador', 'Fecha', 'Categoría', 'Estado'].map(h => (
                    <th key={h} className="text-left text-[10px] tracking-[0.2em] uppercase text-text-muted px-6 py-3 border-b border-border font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map(event => (
                  <tr key={event.id} className="hover:bg-surface/40 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/${locale}/admin/events/${event.id}`} className="text-sm font-medium text-text hover:text-accent transition-colors">
                        {event.title ?? '(sin título)'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary truncate max-w-[150px]">{event.createdBy}</td>
                    <td className="px-6 py-4 text-xs text-text-secondary">
                      {event.startDate ? new Date(event.startDate).toLocaleDateString(locale) : '—'}
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary">{event.category ?? '—'}</td>
                    <td className="px-6 py-4"><Badge variant="accent">Publicado</Badge></td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-text-muted italic">
                      No se han creado eventos recientemente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  )
}
