'use client'

import { useRouter } from 'next/navigation'
import Badge from '@/components/ui/Badge'
import AdminDeleteButton from './AdminDeleteButton'

type Props = {
  href: string
  title: string
  status: string
  targeted: number | string
  sent: number | string
  opened: number | string
  failed: number | string
  createdAtLabel: string
  deleteEndpoint: string | null
}

export default function AdminCampaignRow({
  href,
  title,
  status,
  targeted,
  sent,
  opened,
  failed,
  createdAtLabel,
  deleteEndpoint,
}: Props) {
  const router = useRouter()

  return (
    <tr
      onClick={() => router.push(href)}
      className="cursor-pointer transition-colors hover:bg-surface/30"
    >
      <td className="px-6 py-4">
        <span className="font-semibold text-accent hover:underline">{title}</span>
      </td>
      <td className="px-6 py-4">
        <Badge
          variant={
            status === 'failed' ? 'danger' : status === 'sent' ? 'accent' : status === 'canceled' ? 'muted' : 'warning'
          }
        >
          {status}
        </Badge>
      </td>
      <td className="px-6 py-4 text-sm text-text-secondary">{targeted}</td>
      <td className="px-6 py-4 text-sm text-text-secondary">{sent}</td>
      <td className="px-6 py-4 text-sm text-text-secondary">{opened}</td>
      <td className="px-6 py-4 text-sm text-text-secondary">{failed}</td>
      <td className="px-6 py-4 text-xs text-text-muted">{createdAtLabel}</td>
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        {deleteEndpoint && (
          <AdminDeleteButton
            endpoint={deleteEndpoint}
            label="Cancelar"
            labelDeleting="Cancelando..."
            confirmMessage="¿Cancelar esta notificación programada? No se enviará."
            className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/20"
          />
        )}
      </td>
    </tr>
  )
}
