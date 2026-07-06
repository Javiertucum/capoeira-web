'use client'

import { useState } from 'react'

type RecipientRow = {
  uid: string
  displayName: string
  email: string
  sent: boolean
  opened: boolean
  openedAt: string | null
}

type Filter = 'all' | 'sent' | 'opened' | 'failed'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'sent', label: 'Enviados' },
  { value: 'opened', label: 'Abiertos' },
  { value: 'failed', label: 'Fallidos' },
]

type Props = {
  campaignId: string
  locale: string
  initialRecipients: RecipientRow[]
  initialNextCursor: string | null
}

export default function CampaignRecipientsTable({ campaignId, locale, initialRecipients, initialNextCursor }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [recipients, setRecipients] = useState(initialRecipients)
  const [nextCursor, setNextCursor] = useState(initialNextCursor)
  const [loading, setLoading] = useState(false)

  async function fetchPage(nextFilter: Filter, cursor: string | null) {
    setLoading(true)
    try {
      const params = new URLSearchParams({ filter: nextFilter })
      if (cursor) params.set('cursor', cursor)
      const res = await fetch(`/api/admin/notifications/${campaignId}/recipients?${params}`)
      if (!res.ok) return
      const data = (await res.json()) as { recipients: RecipientRow[]; nextCursor: string | null }
      setRecipients((prev) => (cursor ? [...prev, ...data.recipients] : data.recipients))
      setNextCursor(data.nextCursor)
    } finally {
      setLoading(false)
    }
  }

  function handleFilterChange(value: Filter) {
    setFilter(value)
    void fetchPage(value, null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => handleFilterChange(f.value)}
            disabled={loading}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              filter === f.value
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-border bg-surface text-text-secondary hover:border-text-secondary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {recipients.length === 0 ? (
        <div className="p-6 text-sm text-text-secondary">Sin destinatarios para este filtro.</div>
      ) : (
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="bg-surface/10">
              {['Nombre', 'Email', 'Enviado', 'Abierto', 'Última apertura'].map((heading) => (
                <th
                  key={heading}
                  className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recipients.map((recipient) => (
              <tr key={recipient.uid} className="transition-colors hover:bg-surface/30">
                <td className="px-6 py-4 text-sm text-text-primary">{recipient.displayName || 'Sin nombre'}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{recipient.email || 'Sin email'}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{recipient.sent ? 'Sí' : 'No'}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{recipient.opened ? 'Sí' : 'No'}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {recipient.openedAt ? new Date(recipient.openedAt).toLocaleString(locale) : '–'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {nextCursor && (
        <div className="p-4">
          <button
            type="button"
            onClick={() => void fetchPage(filter, nextCursor)}
            disabled={loading}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-text-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Cargar más destinatarios'}
          </button>
        </div>
      )}
    </div>
  )
}
