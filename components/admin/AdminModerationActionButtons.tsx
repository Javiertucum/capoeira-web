'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type {
  AdminModerationEntityType,
  AdminModerationState,
} from '@/lib/admin-queries'

type Decision = 'hide' | 'suspend' | 'restore'

type Props = Readonly<{
  entityId: string
  entityType: AdminModerationEntityType
  groupId?: string | null
  state: AdminModerationState
}>

export default function AdminModerationActionButtons({
  entityId,
  entityType,
  groupId,
  state,
}: Props) {
  const router = useRouter()
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleDecision(decision: Decision) {
    setPendingDecision(decision)
    setMessage(null)

    try {
      const response = await fetch(`/api/admin/moderation/${entityType}/${entityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          groupId,
          reason: decision === 'restore' ? 'Restaurado desde admin' : 'Decision manual del admin',
        }),
      })
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudo actualizar moderacion')
      }
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setPendingDecision(null)
    }
  }

  const busy = pendingDecision !== null

  return (
    <div className="flex min-w-[260px] flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        {state !== 'hidden' ? (
          <button
            disabled={busy}
            onClick={() => handleDecision('hide')}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-warning/20 bg-warning/10 px-3 text-xs font-semibold text-warning transition-colors hover:bg-warning/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pendingDecision === 'hide' ? 'Ocultando...' : 'Ocultar'}
          </button>
        ) : null}
        {entityType === 'user' && state !== 'suspended' ? (
          <button
            disabled={busy}
            onClick={() => handleDecision('suspend')}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-danger/20 bg-danger/10 px-3 text-xs font-semibold text-danger transition-colors hover:bg-danger/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pendingDecision === 'suspend' ? 'Suspendiendo...' : 'Suspender'}
          </button>
        ) : null}
        {state !== 'visible' ? (
          <button
            disabled={busy}
            onClick={() => handleDecision('restore')}
            className="inline-flex h-9 items-center justify-center rounded-xl bg-accent px-3 text-xs font-semibold text-[#081019] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pendingDecision === 'restore' ? 'Restaurando...' : 'Restaurar'}
          </button>
        ) : null}
      </div>
      {message ? <p className="text-[11px] text-danger">{message}</p> : null}
    </div>
  )
}
