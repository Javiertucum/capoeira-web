'use client'

import { usePathname, useRouter } from 'next/navigation'

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
    router.refresh()
    router.push(`/${locale}/admin/login`)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(10,12,16,0.92)] backdrop-blur-xl shadow-sm">
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
              Control Panel
            </p>
            <p className="mt-1 truncate text-base font-black text-white tracking-tight">{section}</p>
            {description ? (
              <p className="mt-0.5 text-xs text-white/50 font-medium">{description}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/40">
              Admin active
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-danger hover:border-danger hover:scale-105"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
