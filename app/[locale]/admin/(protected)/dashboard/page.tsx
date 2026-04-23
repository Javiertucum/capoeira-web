import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import {
  getAdminEvents,
  getAdminUsers,
  getBugReports,
  getDashboardStats,
} from '@/lib/admin-queries'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params

  const [stats, users, bugs, events] = await Promise.all([
    getDashboardStats(),
    getAdminUsers(5).catch(() => []),
    getBugReports().catch(() => []),
    getAdminEvents(5).catch(() => []),
  ])

  const recentBugs = bugs.slice(0, 4)
  const statCards = [
    {
      label: 'Usuarios totales',
      value: stats.totalUsers.toLocaleString(),
      helper: `+${stats.newUsersThisWeek} creados esta semana`,
      tone: 'accent' as const,
    },
    {
      label: 'Grupos activos',
      value: stats.totalGroups.toLocaleString(),
      helper: 'Estructura principal del directorio',
      tone: 'default' as const,
    },
    {
      label: 'Nucleos',
      value: stats.totalNucleos.toLocaleString(),
      helper: 'Sedes activas registradas en la plataforma',
      tone: 'default' as const,
    },
    {
      label: 'Solicitudes pendientes',
      value: stats.pendingRequests.toLocaleString(),
      helper: 'Cola operativa que requiere revision del admin',
      tone: stats.pendingRequests > 0 ? ('warning' as const) : ('accent' as const),
    },
    {
      label: 'Bug reports abiertos',
      value: stats.openBugReports.toLocaleString(),
      helper: 'Incidentes sin cerrar desde soporte',
      tone: stats.openBugReports > 0 ? ('danger' as const) : ('accent' as const),
    },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar
        section="Dashboard"
        description="Vista general del estado operativo del admin."
      />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader
            eyebrow="Centro de control"
            title="Dashboard"
            description="Resumen global de usuarios, sedes, incidencias y flujo operativo. El contenido prioriza accion rapida sobre navegacion decorativa."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {statCards.map((card) => (
              <AdminStatCard
                key={card.label}
                label={card.label}
                value={card.value}
                helper={card.helper}
                tone={card.tone}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <AdminSectionCard
              title="Usuarios recientes"
              description="Ultimos perfiles visibles en la plataforma."
              action={
                <Link
                  href={`/${locale}/admin/users`}
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-accent transition-opacity hover:opacity-80"
                >
                  Ver usuarios
                </Link>
              }
              contentClassName="overflow-x-auto p-0"
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface/10">
                    {['Nombre', 'Rol', 'Estado'].map((heading) => (
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
                  {users.map((user) => (
                    <tr key={user.uid} className="transition-colors hover:bg-surface/40">
                      <td className="px-6 py-4">
                        <Link
                          href={`/${locale}/admin/users/${user.uid}`}
                          className="text-sm font-medium text-text transition-colors hover:text-accent"
                        >
                          {`${user.name} ${user.surname}`.trim() || user.uid}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-xs capitalize text-text-secondary">{user.role}</td>
                      <td className="px-6 py-4">
                        <Badge variant={user.disabled ? 'danger' : 'accent'}>
                          {user.disabled ? 'Bloqueado' : 'Activo'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-sm italic text-text-muted">
                        No hay usuarios registrados todavia.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </AdminSectionCard>

            <AdminSectionCard
              title="Bug reports"
              description="Incidencias recientes enviadas desde la app."
              action={
                <Link
                  href={`/${locale}/admin/bug-reports`}
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-accent transition-opacity hover:opacity-80"
                >
                  Ver soporte
                </Link>
              }
              contentClassName="divide-y divide-border p-0"
            >
              {recentBugs.map((bug) => (
                <Link
                  key={bug.id}
                  href={`/${locale}/admin/bug-reports/${bug.id}`}
                  className="group flex items-start gap-4 px-6 py-5 transition-colors hover:bg-surface/40"
                >
                  <div
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      bug.status === 'open'
                        ? 'bg-danger'
                        : bug.status === 'reviewing'
                          ? 'bg-warning'
                          : 'bg-accent'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-text transition-colors group-hover:text-accent">
                      {bug.description || 'Reporte sin descripcion'}
                    </div>
                    <div className="mt-1 text-xs text-text-muted">
                      {bug.userEmail || 'Sin correo'} · v{bug.appVersion || 'n/a'}
                    </div>
                  </div>
                  <div className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                    {bug.createdAt ? new Date(bug.createdAt).toLocaleDateString(locale) : '--'}
                  </div>
                </Link>
              ))}
              {recentBugs.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm italic text-text-muted">
                  No hay reportes de bugs pendientes.
                </div>
              ) : null}
            </AdminSectionCard>
          </div>

          <AdminSectionCard
            title="Eventos recientes"
            description="Ultimas publicaciones creadas desde el ecosistema."
            action={
              <Link
                href={`/${locale}/admin/events`}
                className="text-xs font-semibold uppercase tracking-[0.16em] text-accent transition-opacity hover:opacity-80"
              >
                Ver eventos
              </Link>
            }
            contentClassName="overflow-x-auto p-0"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface/10">
                  {['Titulo', 'Organizador', 'Fecha', 'Categoria', 'Estado'].map((heading) => (
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
                {events.map((event) => (
                  <tr key={event.id} className="transition-colors hover:bg-surface/40">
                    <td className="px-6 py-4">
                      <Link
                        href={`/${locale}/admin/events/${event.id}`}
                        className="text-sm font-medium text-text transition-colors hover:text-accent"
                      >
                        {event.title ?? '(sin titulo)'}
                      </Link>
                    </td>
                    <td className="max-w-[150px] truncate px-6 py-4 text-xs text-text-secondary">
                      {event.createdBy}
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary">
                      {event.startDate ? new Date(event.startDate).toLocaleDateString(locale) : '--'}
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary">
                      {event.category ?? '--'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="accent">Publicado</Badge>
                    </td>
                  </tr>
                ))}
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm italic text-text-muted">
                      No se han creado eventos recientemente.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </AdminSectionCard>
        </div>
      </div>
    </div>
  )
}
