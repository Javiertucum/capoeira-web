'use client'

import { usePathname, useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import ThemeToggle from '@/components/public/ThemeToggle'

interface Props {
  section: string
  description?: string
}

export default function AdminTopbar({ section, description }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'es'

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    posthog.capture('admin_logout_completed')
    posthog.reset()
    router.refresh()
    router.push(`/${locale}/admin/login`)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 text-text backdrop-blur-xl shadow-sm">
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
              Control Panel
            </p>
            <p className="mt-1 truncate text-base font-black text-text tracking-tight">{section}</p>
            {description ? (
              <p className="mt-0.5 text-xs text-text-muted font-medium">{description}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="rounded-full border border-border bg-surface px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted">
              Admin active
            </div>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-2xl border border-border bg-surface px-4 py-2 text-xs font-bold text-text transition-all hover:bg-danger hover:border-danger hover:text-white hover:scale-105"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
