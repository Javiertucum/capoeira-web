'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  /** The API endpoint to DELETE */
  endpoint: string
  /** Optional JSON body to send with DELETE */
  body?: Record<string, unknown>
  /** Label shown on the button */
  label?: string
  /** Label shown while deleting */
  labelDeleting?: string
  /** Confirm dialog message. If not provided, no confirm is shown. */
  confirmMessage?: string
  /** Called after a successful delete */
  onSuccess?: () => void
  /** Additional tailwind classes on the button */
  className?: string
  /** If true, router.refresh() is called on success instead of redirect */
  refreshOnSuccess?: boolean
  /** Redirect path on success (e.g. '/es/admin/events') */
  redirectTo?: string
}

/**
 * AdminDeleteButton — a reusable client component for DELETE operations.
 * Shows an optional confirm dialog, calls the endpoint, and either refreshes
 * the current page or redirects to a given path.
 */
export default function AdminDeleteButton({
  endpoint,
  body,
  label = 'Eliminar',
  labelDeleting = 'Eliminando...',
  confirmMessage,
  onSuccess,
  className,
  refreshOnSuccess = true,
  redirectTo,
}: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    if (confirmMessage && !window.confirm(confirmMessage)) return

    setDeleting(true)
    setError(null)

    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error || 'Error al eliminar')
      }

      onSuccess?.()

      if (redirectTo) {
        router.push(redirectTo)
      } else if (refreshOnSuccess) {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setDeleting(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={deleting}
        onClick={handleClick}
        className={
          className ??
          'inline-flex items-center justify-center rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/20 disabled:opacity-50'
        }
      >
        {deleting ? labelDeleting : label}
      </button>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}
