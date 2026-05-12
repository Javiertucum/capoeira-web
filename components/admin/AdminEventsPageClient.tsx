'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminTopbar from '@/components/admin/AdminTopbar'
import AdminDeleteButton from '@/components/admin/AdminDeleteButton'
import Badge from '@/components/ui/Badge'
import CreateEventModal from './CreateEventModal'
import type { AdminEntityOption } from '@/lib/admin-queries'

type Props = {
  events: any[]
  locale: string
  groupOptions: AdminEntityOption[]
}

export default function AdminEventsPageClient({ events, locale, groupOptions }: Props) {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopbar section="Eventos" />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Gestión de Eventos</h1>
            <p className="mt-1 text-sm text-text-muted">Modera y crea los eventos de la comunidad.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCreate(true)}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-[#081019] shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Crear Nuevo Evento
            </button>
            <div className="hidden sm:block rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-text-secondary">
              {events.length} eventos
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface/30">
                  {['Título', 'Fecha Inicio', 'Categoría', 'Organizador', 'Alcance', ''].map(h => (
                    <th key={h} className="text-left text-[10px] tracking-[0.2em] uppercase text-text-muted px-6 py-4 border-b border-border font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map(event => (
                  <tr key={event.id} className="hover:bg-surface/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text">{event.title || '(Sin título)'}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary">
                      {event.startDate ? new Date(event.startDate).toLocaleDateString(locale) : '—'}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <Badge variant="accent">{event.category || 'Encuentro'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      {event.createdBy?.slice(0, 10)}...
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                         <span>🔥 {event.goingCount || 0}</span>
                         <span>👀 {event.interestedCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${locale}/admin/events/${event.id}`}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-surface px-4 text-xs font-bold text-accent transition-all hover:bg-accent/10 hover:border-accent/30 no-underline"
                        >
                          Editar
                        </Link>
                        <AdminDeleteButton
                          endpoint={`/api/admin/events/${event.id}`}
                          confirmMessage={`¿Eliminar el evento "${event.title || 'Sin título'}"? Esta acción no se puede deshacer.`}
                          label="Eliminar"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreate && <CreateEventModal locale={locale} groupOptions={groupOptions} onClose={() => setShowCreate(false)} />}
    </div>
  )
}
