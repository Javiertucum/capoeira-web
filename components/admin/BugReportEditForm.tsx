'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BugReport } from '@/lib/admin-queries'

interface Props {
  report: BugReport
}

export default function BugReportEditForm({ report }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<BugReport['status']>(report.status)
  const [adminNote, setAdminNote] = useState(report.adminNote ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/bug-reports/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNote,
        }),
      })

      if (!res.ok) {
        throw new Error('Error al actualizar el reporte')
      }

      setMessage({ type: 'ok', text: 'Reporte actualizado correctamente' })
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

  const inputClass =
    'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/35'

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
        <h3 className="text-sm font-semibold text-text">Gestion del reporte</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              Estado
            </label>
            <select
              className={inputClass}
              value={status}
              onChange={(event) => setStatus(event.target.value as BugReport['status'])}
            >
              <option value="open">Abierto</option>
              <option value="reviewing">En revision</option>
              <option value="closed">Cerrado</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              Nota interna
            </label>
            <textarea
              className={`${inputClass} min-h-[160px] resize-y`}
              value={adminNote}
              onChange={(event) => setAdminNote(event.target.value)}
              placeholder="Deja contexto para el siguiente admin o para el seguimiento."
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
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
