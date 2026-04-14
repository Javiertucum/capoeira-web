'use client'

import { usePathname, useRouter } from 'next/navigation'

interface Props {
  section: string
}

export default function AdminTopbar({ section }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'es'

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.refresh()
    router.push(`/${locale}/admin/login`)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-[rgba(8,16,25,0.94)] backdrop-blur-lg">
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
              Admin panel
            </p>
            <p className="mt-2 truncate text-sm font-semibold text-text sm:text-base">{section}</p>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="rounded-full border border-border bg-card px-3 py-2 text-xs text-text-secondary">
              Sesion activa
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-danger/30 hover:text-danger"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
