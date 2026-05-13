'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getNotificationCampaignActionAvailability } from '@/lib/notification-campaign-actions'

type Props = {
  campaignId: string
  status: string
}

export default function CampaignStatusActions({ campaignId, status }: Props) {
  const router = useRouter()
  const [loadingAction, setLoadingAction] = useState<'cancel' | 'expedite' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { canCancel, canExpedite } = getNotificationCampaignActionAvailability(status)

  async function runAction(action: 'cancel' | 'expedite') {
    setLoadingAction(action)
    setError(null)

    try {
      const res = await fetch(`/api/admin/notifications/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? 'No se pudo actualizar la campaña')
        return
      }

      router.refresh()
    } catch {
      setError('Error de red al actualizar la campaña')
    } finally {
      setLoadingAction(null)
    }
  }

  if (!canCancel && !canExpedite) return null

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {canExpedite && (
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={() => runAction('expedite')}
            className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAction === 'expedite' ? 'Lanzando...' : 'Lanzar ahora'}
          </button>
        )}
        {canCancel && (
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={() => runAction('cancel')}
            className="rounded-full border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-semibold text-danger transition hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAction === 'cancel' ? 'Cancelando...' : 'Cancelar campaña'}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
