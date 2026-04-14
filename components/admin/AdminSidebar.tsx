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
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminSidebar({ locale, openBugReports = 0 }: Props) {
  const pathname = usePathname()

  const sections: { label: string; items: NavItem[] }[] = [
    {
      label: 'Gestion',
      items: [
        { label: 'Dashboard', href: `/${locale}/admin/dashboard` },
        { label: 'Usuarios', href: `/${locale}/admin/users` },
        { label: 'Grupos', href: `/${locale}/admin/groups` },
        { label: 'Nucleos', href: `/${locale}/admin/nucleos` },
        { label: 'Eventos', href: `/${locale}/admin/events` },
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

  return (
    <>
      <aside className="hidden w-[248px] shrink-0 border-r border-border bg-surface-muted/70 lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto px-4 py-6">
          <div className="mb-8 rounded-[22px] border border-border bg-card px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
              Agenda Capoeiragem
            </p>
            <p className="mt-2 text-sm font-semibold text-text">Admin</p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Gestion centralizada de usuarios, grupos, nucleos, eventos y soporte.
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
                      className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors ${
                        active
                          ? 'bg-accent/12 text-accent'
                          : 'text-text-secondary hover:bg-card hover:text-text'
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

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[rgba(8,16,25,0.96)] px-3 py-2 backdrop-blur-lg lg:hidden">
        <nav className="flex gap-2 overflow-x-auto">
          {flatItems.map((item) => {
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
