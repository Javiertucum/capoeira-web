'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminRequestType } from '@/lib/admin-queries'

type Props = Readonly<{
  requestId: string
  requestType: AdminRequestType
}>

type Decision = 'approve' | 'reject'

export default function AdminRequestActionButtons({ requestId, requestType }: Props) {
  const router = useRouter()
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'ok' | 'error' | null>(null)

  async function handleDecision(decision: Decision) {
    setPendingDecision(decision)
    setMessage(null)
    setMessageType(null)

    try {
      const response = await fetch(`/api/admin/requests/${requestType}/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ decision }),
      })

      const payload = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudo procesar la solicitud')
      }

      setMessage(decision === 'approve' ? 'Solicitud aprobada' : 'Solicitud rechazada')
      setMessageType('ok')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error desconocido')
      setMessageType('error')
    } finally {
      setPendingDecision(null)
    }
  }

  const busy = pendingDecision !== null

  return (
    <div className="flex min-w-[200px] flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <button
          disabled={busy}
          onClick={() => handleDecision('reject')}
          className="inline-flex h-9 items-center justify-center rounded-xl border border-danger/20 bg-danger/10 px-3 text-xs font-semibold text-danger transition-colors hover:bg-danger/16 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pendingDecision === 'reject' ? 'Procesando...' : 'Rechazar'}
        </button>
        <button
          disabled={busy}
          onClick={() => handleDecision('approve')}
          className="inline-flex h-9 items-center justify-center rounded-xl bg-accent px-3 text-xs font-semibold text-[#081019] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pendingDecision === 'approve' ? 'Procesando...' : 'Aprobar'}
        </button>
      </div>

      {message ? (
        <p
          className={`text-[11px] ${
            messageType === 'error' ? 'text-danger' : 'text-text-muted'
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}
