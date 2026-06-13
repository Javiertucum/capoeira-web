'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type OtherGroup = { id: string; name: string }

type Props = {
  locale: string
  groupId: string
  groupName: string
  otherGroups: OtherGroup[]
}

/**
 * Admin actions for handling duplicate groups: merge this group into another one,
 * or convert it into a nucleo of another group. Both move members/data and notify admins.
 */
export default function GroupMergeActions({ locale, groupId, groupName, otherGroups }: Props) {
  const router = useRouter()
  const [targetId, setTargetId] = useState(otherGroups[0]?.id ?? '')
  const [loading, setLoading] = useState<'merge' | 'convert' | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (otherGroups.length === 0) return null

  const targetName = otherGroups.find((group) => group.id === targetId)?.name ?? ''

  async function run(action: 'merge' | 'convert') {
    if (!targetId) return
    const confirmMessage =
      action === 'merge'
        ? `¿Combinar "${groupName}" con "${targetName}"? Sus nucleos y miembros se moveran a "${targetName}" y "${groupName}" se eliminara. Se notificara a los admins de ambos grupos.`
        : `¿Convertir "${groupName}" en un nucleo de "${targetName}"? Sus miembros y datos se moveran a "${targetName}" y "${groupName}" se eliminara. Se notificara a los admins de ambos grupos.`
    if (!window.confirm(confirmMessage)) return

    setLoading(action)
    setError(null)
    try {
      const endpoint = action === 'merge'
        ? `/api/admin/groups/${groupId}/merge`
        : `/api/admin/groups/${groupId}/convert-to-nucleo`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetGroupId: targetId }),
      })
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error || 'Error al procesar la solicitud')
      }
      router.push(`/${locale}/admin/groups/${targetId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setLoading(null)
    }
  }

  return (
    <section className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-sm font-semibold text-text">Grupos duplicados</h2>
      <p className="mt-2 text-xs text-text-muted">
        Si este grupo es un duplicado de otro, combina sus datos o conviertelo en un nucleo de otro grupo.
        Ambas acciones mueven miembros y registros, notifican a los admins involucrados y eliminan este grupo.
      </p>

      <div className="mt-4">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Grupo destino</label>
        <select
          value={targetId}
          onChange={(event) => setTargetId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text"
        >
          {otherGroups.map((group) => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => run('merge')}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-border bg-surface px-4 text-xs font-bold text-accent transition-all hover:border-accent/30 hover:bg-accent/10 disabled:opacity-50"
        >
          {loading === 'merge' ? 'Combinando...' : 'Combinar con grupo destino'}
        </button>
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => run('convert')}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-danger/30 bg-danger/10 px-4 text-xs font-bold text-danger transition-all hover:bg-danger/20 disabled:opacity-50"
        >
          {loading === 'convert' ? 'Convirtiendo...' : 'Convertir en nucleo del destino'}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </section>
  )
}
