'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type JobKind = 'notification' | 'export' | 'finance-cost'

type Props = Readonly<{
  kind: JobKind
}>

const labels: Record<JobKind, { title: string; action: string; placeholder: string }> = {
  notification: {
    title: 'Nueva campana',
    action: 'Crear campana',
    placeholder: 'Titulo de la campana',
  },
  export: {
    title: 'Nuevo export',
    action: 'Crear export',
    placeholder: 'Nombre del export',
  },
  'finance-cost': {
    title: 'Costo manual',
    action: 'Agregar costo',
    placeholder: 'Proveedor o servicio',
  },
}

export default function AdminCreateJobForm({ kind }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const config = labels[kind]

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage(null)

    const endpoint =
      kind === 'notification'
        ? '/api/admin/notifications'
        : kind === 'export'
          ? '/api/admin/exports'
          : '/api/admin/finances/manual-costs'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          amount: amount ? Number(amount) : undefined,
        }),
      })
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) throw new Error(payload?.error || 'No se pudo crear el registro')
      setTitle('')
      setAmount('')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-[24px] border border-border bg-card p-5 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1">
        <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
          {config.title}
        </label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          placeholder={config.placeholder}
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/40"
        />
        {message ? <p className="mt-2 text-xs text-danger">{message}</p> : null}
      </div>
      {kind === 'finance-cost' ? (
        <div className="w-full sm:w-40">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Monto USD
          </label>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
            type="number"
            min="0"
            step="0.01"
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/40"
          />
        </div>
      ) : null}
      <button
        disabled={busy}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#081019] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? 'Creando...' : config.action}
      </button>
    </form>
  )
}
