'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminEvent } from '@/lib/admin-queries'

interface Props {
  event: AdminEvent
  locale: string
}

export default function EventEditForm({ event, locale }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: event.title || '',
    description: event.description || '',
    category: event.category || '',
    startDate: event.startDate ? event.startDate.split('T')[0] : '',
    endDate: event.endDate ? event.endDate.split('T')[0] : '',
    groupId: event.groupId || '',
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          groupId: form.groupId || null,
          endDate: form.endDate || null,
        }),
      })

      if (!res.ok) {
        throw new Error('Error al guardar')
      }

      setMessage({ type: 'ok', text: 'Evento actualizado correctamente' })
      router.refresh()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este evento permanentemente?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      router.push(`/${locale}/admin/events`)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al eliminar',
      })
      setDeleting(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/35'
  const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted'

  return (
    <div className="space-y-6">
      {message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            message.type === 'ok'
              ? 'border-accent/20 bg-accent/10 text-accent'
              : 'border-danger/20 bg-danger/10 text-danger'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <section className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-text">Detalles del evento</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Titulo</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(event) => set('title', event.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Fecha de inicio</label>
            <input
              type="date"
              className={inputClass}
              value={form.startDate}
              onChange={(event) => set('startDate', event.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Fecha de fin</label>
            <input
              type="date"
              className={inputClass}
              value={form.endDate}
              onChange={(event) => set('endDate', event.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Categoria</label>
            <select
              className={inputClass}
              value={form.category}
              onChange={(event) => set('category', event.target.value)}
            >
              <option value="Encuentro">Encuentro / Batizado</option>
              <option value="Taller">Taller / Workshop</option>
              <option value="Roda">Roda</option>
              <option value="Festival">Festival</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Grupo relacionado</label>
            <input
              className={inputClass}
              value={form.groupId}
              onChange={(event) => set('groupId', event.target.value)}
              placeholder="groupId opcional"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Descripcion</label>
            <textarea
              className={`${inputClass} min-h-[150px] resize-y`}
              value={form.description}
              onChange={(event) => set('description', event.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center justify-center rounded-xl border border-danger/30 bg-danger/10 px-5 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/14 disabled:opacity-50"
        >
          {deleting ? 'Eliminando...' : 'Eliminar evento'}
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-92 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
