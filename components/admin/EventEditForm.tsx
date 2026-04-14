'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  event: any
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
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error al guardar')
      setMessage({ type: 'ok', text: 'Evento actualizado' })
      router.refresh()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error desconocido' })
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
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al eliminar' })
      setDeleting(false)
    }
  }

  const inputClass = "w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-accent/40 transition-colors"
  const labelClass = "block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2"

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-2xl border px-6 py-4 text-sm font-medium
          ${message.type === 'ok' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
          {message.text}
        </div>
      )}

      <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6">Detalles del Evento</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Título del Evento</label>
            <input className={inputClass} value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Fecha Inicio</label>
              <input type="date" className={inputClass} value={form.startDate} onChange={e => set('startDate', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Fecha Fin</label>
              <input type="date" className={inputClass} value={form.endDate} onChange={e => set('endDate', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Categoría</label>
            <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="Encuentro">Encuentro / Batizado</option>
              <option value="Taller">Taller / Workshop</option>
              <option value="Roda">Roda</option>
              <option value="Festival">Festival</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-xl border border-rose-900/40 bg-rose-950/10 px-6 py-3 text-sm font-bold text-rose-500 transition-all hover:bg-rose-950/20 disabled:opacity-50"
        >
          {deleting ? 'Eliminando...' : 'Eliminar Evento'}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-accent px-10 py-4 text-sm font-bold tracking-widest text-[#08110C] uppercase transition-all hover:opacity-90 disabled:opacity-50 shadow-sm"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  )
}
