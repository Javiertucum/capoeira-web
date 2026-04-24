'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminEntityType } from '@/lib/admin-queries'

type Props = Readonly<{
  entityId: string
  entityType: AdminEntityType
  groupId?: string
  label: string
  active: boolean
  order: number
}>

export default function AdminFeaturedToggle({
  entityId,
  entityType,
  groupId,
  label,
  active,
  order,
}: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function toggle() {
    setBusy(true)
    setMessage(null)
    try {
      const response = await fetch(`/api/admin/featured-content/${entityType}/${entityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          active: !active,
          order,
          groupId,
          label,
        }),
      })
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudo actualizar destacado')
      }
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        disabled={busy}
        onClick={toggle}
        className={`inline-flex h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          active
            ? 'border border-warning/20 bg-warning/10 text-warning hover:bg-warning/15'
            : 'bg-accent text-[#081019] hover:opacity-90'
        }`}
      >
        {busy ? 'Actualizando...' : active ? 'Quitar' : 'Destacar'}
      </button>
      {message ? <p className="text-[11px] text-danger">{message}</p> : null}
    </div>
  )
}
