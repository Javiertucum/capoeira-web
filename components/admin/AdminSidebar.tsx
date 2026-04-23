'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  badge?: number
  badgeVariant?: 'danger' | 'warning'
}

interface Props {
  locale: string
  openBugReports?: number
  pendingRequests?: number
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminSidebar({
  locale,
  openBugReports = 0,
  pendingRequests = 0,
}: Props) {
  const pathname = usePathname()

  const sections: { label: string; items: NavItem[] }[] = [
    {
      label: 'General',
      items: [
        { label: 'Dashboard', href: `/${locale}/admin/dashboard` },
        { label: 'Usuarios', href: `/${locale}/admin/users` },
        { label: 'Grupos', href: `/${locale}/admin/groups` },
        { label: 'Nucleos', href: `/${locale}/admin/nucleos` },
        { label: 'Eventos', href: `/${locale}/admin/events` },
      ],
    },
    {
      label: 'Personas',
      items: [
        {
          label: 'Solicitudes',
          href: `/${locale}/admin/requests`,
          badge: pendingRequests,
          badgeVariant: 'warning',
        },
        { label: 'Suscripciones', href: `/${locale}/admin/subscriptions` },
      ],
    },
    {
      label: 'Capoeira',
      items: [
        { label: 'Graduaciones', href: `/${locale}/admin/graduations` },
        { label: 'Asistencia', href: `/${locale}/admin/attendance` },
        { label: 'Pagos de clases', href: `/${locale}/admin/class-payments` },
      ],
    },
    {
      label: 'Contenido',
      items: [
        { label: 'Contenido destacado', href: `/${locale}/admin/featured-content` },
        { label: 'Moderacion', href: `/${locale}/admin/moderation` },
        { label: 'Mapa global', href: `/${locale}/admin/global-map` },
      ],
    },
    {
      label: 'Sistema',
      items: [
        { label: 'Finanzas', href: `/${locale}/admin/finances` },
        { label: 'Notificaciones', href: `/${locale}/admin/notifications` },
        { label: 'Exportar datos', href: `/${locale}/admin/exports` },
      ],
    },
    {
      label: 'Soporte',
      items: [
        {
          label: 'Bug Reports',
          href: `/${locale}/admin/bug-reports`,
          badge: openBugReports,
          badgeVariant: 'danger',
        },
      ],
    },
  ]

  const flatItems = sections.flatMap((section) => section.items)
  const mobileItems = flatItems.filter((item) =>
    [
      `/${locale}/admin/dashboard`,
      `/${locale}/admin/requests`,
      `/${locale}/admin/finances`,
      `/${locale}/admin/notifications`,
      `/${locale}/admin/bug-reports`,
    ].includes(item.href)
  )

  return (
    <>
      <aside className="hidden w-[280px] shrink-0 border-r border-border bg-surface-muted/70 xl:block">
        <div className="sticky top-0 h-screen overflow-y-auto px-4 py-6">
          <div className="mb-8 rounded-[26px] border border-border bg-card px-5 py-5 shadow-[0_18px_40px_-30px_var(--shadow)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
              Agenda Capoeiragem
            </p>
            <p className="mt-3 text-lg font-semibold text-text">Control admin</p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Centro operativo para revisar datos, resolver solicitudes y coordinar el estado completo de la plataforma.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.label} className="mb-7">
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActivePath(pathname, item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-[20px] border px-3 py-3 text-sm transition-colors ${
                        active
                          ? 'border-accent/20 bg-accent/12 text-accent'
                          : 'border-transparent text-text-secondary hover:border-border hover:bg-card hover:text-text'
                      }`}
                    >
                      <span className="flex-1">{item.label}</span>
                      {item.badge && item.badge > 0 ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            item.badgeVariant === 'danger'
                              ? 'bg-danger/16 text-danger'
                              : 'bg-warning/16 text-warning'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[rgba(8,16,25,0.96)] px-3 py-2 backdrop-blur-lg xl:hidden">
        <nav className="flex gap-2 overflow-x-auto">
          {mobileItems.map((item) => {
            const active = isActivePath(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? 'border-accent/30 bg-accent/12 text-accent'
                    : 'border-border bg-card text-text-secondary'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="rounded-full bg-danger/16 px-1.5 py-0.5 text-[10px] text-danger">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
