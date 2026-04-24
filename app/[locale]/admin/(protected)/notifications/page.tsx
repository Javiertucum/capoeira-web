import AdminCreateJobForm from '@/components/admin/AdminCreateJobForm'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import { getAdminOperationJobs } from '@/lib/admin-queries'

type Props = { params: Promise<{ locale: string }> }

export default async function NotificationsPage({ params }: Props) {
  const { locale } = await params
  const campaigns = await getAdminOperationJobs('adminNotificationCampaigns').catch((error) => {
    console.error('[NotificationsPage] failed to fetch campaigns', error)
    return []
  })
  const active = campaigns.filter((campaign) => ['queued', 'scheduled', 'processing'].includes(campaign.status)).length
  const sent = campaigns.filter((campaign) => campaign.status === 'sent').length
  const failed = campaigns.filter((campaign) => campaign.status === 'failed').length

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section="Notificaciones" description="Campanas push auditables." />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader eyebrow="Comunicaciones" title="Notificaciones" description="Campanas almacenadas en adminNotificationCampaigns. Los workers de envio procesan estados queued/scheduled cuando esten conectados en Functions." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Campanas" value={campaigns.length.toLocaleString(locale)} helper="Total creado desde admin" />
            <AdminStatCard label="Activas" value={active.toLocaleString(locale)} helper="Queued, scheduled o processing" tone={active > 0 ? 'warning' : 'default'} />
            <AdminStatCard label="Enviadas" value={sent.toLocaleString(locale)} helper="Estado sent" tone="accent" />
            <AdminStatCard label="Fallidas" value={failed.toLocaleString(locale)} helper="Requieren revision" tone={failed > 0 ? 'danger' : 'default'} />
          </div>
          <AdminCreateJobForm kind="notification" />
          <AdminSectionCard title="Historial de campanas" description="Drafts y estados de envio quedan listos para el worker push." contentClassName="overflow-x-auto p-0">
            {campaigns.length === 0 ? (
              <div className="p-6"><AdminEmptyState eyebrow="Notificaciones" title="No hay campanas creadas" description="Crea una campana para dejarla en draft y completar su segmentacion." /></div>
            ) : (
              <table className="w-full min-w-[820px] border-collapse">
                <thead><tr className="bg-surface/10">{['Titulo', 'Estado', 'Tipo', 'Creado por', 'Creado', 'Actualizado'].map((heading) => <th key={heading} className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">{heading}</th>)}</tr></thead>
                <tbody className="divide-y divide-border">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="transition-colors hover:bg-surface/30">
                      <td className="px-6 py-4 text-sm font-semibold text-text">{campaign.title}</td>
                      <td className="px-6 py-4"><Badge variant={campaign.status === 'failed' ? 'danger' : campaign.status === 'sent' ? 'accent' : 'warning'}>{campaign.status}</Badge></td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{campaign.type ?? 'push'}</td>
                      <td className="px-6 py-4 text-xs text-text-muted">{campaign.createdBy ?? '--'}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{campaign.createdAt ? new Date(campaign.createdAt).toLocaleString(locale) : '--'}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{campaign.updatedAt ? new Date(campaign.updatedAt).toLocaleString(locale) : '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </AdminSectionCard>
        </div>
      </div>
    </div>
  )
}
