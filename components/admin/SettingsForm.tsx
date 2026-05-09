'use client'

import { useState } from 'react'

interface SettingsValues {
  appVersion: string
  statusLabel: string
  betaRegistrationOpen: boolean
}

interface Props {
  initial: SettingsValues
}

export default function SettingsForm({ initial }: Props) {
  const [form, setForm] = useState<SettingsValues>(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  function set<K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? 'Error al guardar')
      }
      setMessage({ type: 'ok', text: 'Configuración guardada correctamente' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error desconocido' })
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/35'
  const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted'
  const sectionClass = 'rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6'

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

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Versión y Estado</h3>
        <p className="mt-1 text-xs text-text-muted">
          Controla lo que los usuarios ven en la landing page respecto al estado de la app.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Versión de la App</label>
            <input
              className={inputClass}
              value={form.appVersion}
              onChange={(e) => set('appVersion', e.target.value)}
              placeholder="2.6.0"
            />
          </div>
          <div>
            <label className={labelClass}>Etiqueta de Estado</label>
            <input
              className={inputClass}
              value={form.statusLabel}
              onChange={(e) => set('statusLabel', e.target.value)}
              placeholder="Beta cerrada"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3">
              <div
                role="switch"
                aria-checked={form.betaRegistrationOpen}
                onClick={() => set('betaRegistrationOpen', !form.betaRegistrationOpen)}
                className={`relative h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors ${
                  form.betaRegistrationOpen ? 'bg-accent' : 'bg-border'
                }`}
              >
                <div
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    form.betaRegistrationOpen ? 'left-6' : 'left-1'
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Registro de Beta Abierto</p>
                <p className="text-xs text-text-muted">
                  Permite que nuevos usuarios se inscriban desde la web.
                </p>
              </div>
            </label>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Integraciones</h3>
        <p className="mt-1 text-xs text-text-muted">Servicios externos conectados a la plataforma.</p>
        <div className="mt-5 space-y-3">
          {[
            { name: 'Firebase Admin', status: 'Conectado' },
            { name: 'Google Play Console', status: 'Conectado' },
            { name: 'Postmark Email', status: 'Conectado' },
          ].map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3"
            >
              <p className="text-sm font-semibold text-text">{s.name}</p>
              <span className="text-xs font-bold text-accent">{s.status}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
