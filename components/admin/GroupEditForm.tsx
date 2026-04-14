'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  group: any
  locale: string
}

export default function GroupEditForm({ group, locale }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: group.name,
    description: group.description || '',
    graduationSystemName: group.graduationSystemName || '',
    logoUrl: group.logoUrl || '',
    representedCountries: group.representedCountries?.join(', ') || '',
    representedCities: group.representedCities?.join(', ') || '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const body = {
        ...form,
        representedCountries: form.representedCountries.split(',').map((s: string) => s.trim()).filter(Boolean),
        representedCities: form.representedCities.split(',').map((s: string) => s.trim()).filter(Boolean),
      }
      const res = await fetch(`/api/admin/groups/${group.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Error al guardar')
      setMessage({ type: 'ok', text: 'Grupo actualizado correctamente' })
      router.refresh()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error desconocido' })
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-accent/40 transition-colors"
  const labelClass = "block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2"

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-2xl border px-6 py-4 text-sm font-medium shadow-sm transition-all
          ${message.type === 'ok' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6">Información General</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nombre del Grupo</label>
              <input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Sistema de Graduación</label>
              <input className={inputClass} value={form.graduationSystemName} onChange={e => set('graduationSystemName', e.target.value)} placeholder="Ej: Cordas Abadá-Capoeira" />
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6">Identidad Visual</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="h-16 w-16 rounded-xl border border-border bg-white flex-shrink-0 p-2">
                 {form.logoUrl && <img src={form.logoUrl} className="h-full w-full object-contain" alt="preview" />}
              </div>
              <div className="flex-1">
                <label className={labelClass}>Logo URL</label>
                <input className={inputClass} value={form.logoUrl} onChange={e => set('logoUrl', e.target.value)} placeholder="https://..." />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6">Ubicaciones Representadas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Países (separados por coma)</label>
            <input className={inputClass} value={form.representedCountries} onChange={e => set('representedCountries', e.target.value)} placeholder="Brasil, España, Portugal..." />
          </div>
          <div>
            <label className={labelClass}>Ciudades (separados por coma)</label>
            <input className={inputClass} value={form.representedCities} onChange={e => set('representedCities', e.target.value)} placeholder="Madrid, Barcelona, Lisboa..." />
          </div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6">Descripción / Historia</h3>
        <textarea 
          className={`${inputClass} min-h-[150px] resize-none`} 
          value={form.description} 
          onChange={e => set('description', e.target.value)} 
          placeholder="Describe el origen y filosofía del grupo..."
        />
      </section>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-accent px-10 py-4 text-sm font-bold tracking-widest text-[#08110C] uppercase transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 shadow-[0_8px_32px_-8px_rgba(102,187,106,0.3)]"
        >
          {saving ? 'Guardando...' : 'Actualizar Grupo'}
        </button>
      </div>
    </div>
  )
}
