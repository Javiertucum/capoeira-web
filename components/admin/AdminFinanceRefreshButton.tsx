'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ProviderSummary = { provider: string; status: string }
type RefreshResult = { ok: boolean; period?: string; summary?: ProviderSummary[]; error?: string }

const STATUS_STYLES: Record<string, string> = {
  fresh: 'border-accent/20 bg-accent/8 text-accent',
  unavailable: 'border-border bg-surface text-text-muted',
  error: 'border-danger/20 bg-danger/8 text-danger',
  stale: 'border-warning/20 bg-warning/8 text-warning',
}

export default function AdminFinanceRefreshButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<ProviderSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleRefresh() {
    setLoading(true)
    setSummary(null)
    setError(null)
    try {
      const response = await fetch('/api/admin/finances/refresh', { method: 'POST' })
      const data = await response.json() as RefreshResult
      if (data.ok) {
        setSummary(data.summary ?? [])
        router.refresh()
      } else {
        setError(data.error ?? 'Error desconocido al actualizar')
      }
    } catch {
      setError('Error de red al actualizar datos financieros')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleRefresh}
        disabled={loading}
        className="self-start rounded-xl border border-accent/20 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/15 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Actualizando datos...' : 'Actualizar datos financieros'}
      </button>

      {summary && (
        <div className="flex flex-wrap gap-2">
          {summary.map((item) => (
            <span
              key={item.provider}
              className={`rounded-lg border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[item.status] ?? STATUS_STYLES.unavailable}`}
            >
              {item.provider}: {item.status}
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
