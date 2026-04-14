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

export default function AdminSidebar({ locale, openBugReports = 0 }: Props) {
  const pathname = usePathname()

  const sections: { label: string; items: NavItem[] }[] = [
    {
      label: 'General',
      items: [
        { label: 'Dashboard',   href: `/${locale}/admin/dashboard` },
        { label: 'Usuarios',    href: `/${locale}/admin/users` },
        { label: 'Grupos',      href: `/${locale}/admin/groups` },
        { label: 'Eventos',     href: `/${locale}/admin/events` },
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

  return (
    <aside className="w-[240px] flex-shrink-0 bg-surface-muted border-r border-border py-8 overflow-y-auto">
      <div className="px-6 mb-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-accent">
          Agenda Capoeiragem
        </p>
        <p className="mt-2 text-xs font-bold text-text-muted">ADMIN PANEL</p>
      </div>

      {sections.map(section => (
        <div key={section.label} className="px-4 mb-8">
          <p className="text-[10px] tracking-[0.2em] uppercase text-text-muted px-4 mb-3">
            {section.label}
          </p>
          <div className="space-y-1">
            {section.items.map(item => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] transition-all no-underline
                    ${active
                      ? 'bg-accent/15 text-accent font-semibold shadow-sm'
                      : 'text-text-muted hover:bg-surface hover:text-text-secondary'
                    }`}
                >
                  <span className="flex-1">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                      ${item.badgeVariant === 'danger'
                        ? 'bg-danger text-[#08110C]'
                        : 'bg-warning text-[#08110C]'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </aside>
  )
}
