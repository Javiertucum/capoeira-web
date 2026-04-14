'use client'

import { useRouter, usePathname } from 'next/navigation'

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
    <header className="h-[64px] flex-shrink-0 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span>Admin</span>
        <span className="text-border">/</span>
        <span className="font-semibold text-text">{section}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full bg-surface border border-border px-3 py-1.5 shadow-sm">
          <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[10px] font-bold text-accent">
            JM
          </div>
          <span className="text-[11px] font-medium text-text-secondary">Javier Muñoz</span>
        </div>
        
        <button
          onClick={handleLogout}
          className="rounded-lg bg-surface border border-border px-3 py-1.5 text-[11px] font-semibold text-text-muted hover:text-danger hover:border-danger/30 transition-all cursor-pointer"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  )
}
