import AdminCampaignRow from '@/components/admin/AdminCampaignRow'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminNotificationSendForm from '@/components/admin/AdminNotificationSendForm'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import { getAdminAppVersionStats, getAdminNucleos, getAdminOperationJobs } from '@/lib/admin-queries'
import { adminDb } from '@/lib/firebase-admin'

type Props = { params: Promise<{ locale: string }> }

async function getGroups(): Promise<{ id: string; name: string }[]> {
  const snap = await adminDb.collection('groups').orderBy('name').get().catch(() => ({ docs: [] }))
  return snap.docs.map((doc) => ({
    id: doc.id,
    name: typeof doc.data().name === 'string' ? doc.data().name : doc.id,
  }))
}

export default async function NotificationsPage({ params }: Props) {
  const { locale } = await params
  const [campaigns, groups, nucleos, appVersions] = await Promise.all([
    getAdminOperationJobs('adminNotificationCampaigns').catch(() => []),
    getGroups(),
    getAdminNucleos().catch(() => []),
    getAdminAppVersionStats().catch(() => []),
  ])

  const active = campaigns.filter((c) => ['queued', 'scheduled', 'processing'].includes(c.status)).length
  const sent = campaigns.filter((c) => c.status === 'sent').length
  const failed = campaigns.filter((c) => c.status === 'failed').length

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section="Notificaciones" description="Envío de push notifications a segmentos de usuarios." />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader
            eyebrow="Comunicaciones"
            title="Notificaciones"
            description="Envía push notifications a todos los usuarios o a segmentos específicos por rol, país, plan o grupo."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Campañas" value={campaigns.length.toLocaleString(locale)} helper="Total historial" />
            <AdminStatCard label="Activas" value={active.toLocaleString(locale)} helper="En proceso" tone={active > 0 ? 'warning' : 'default'} />
            <AdminStatCard label="Enviadas" value={sent.toLocaleString(locale)} helper="Estado sent" tone="accent" />
            <AdminStatCard label="Fallidas" value={failed.toLocaleString(locale)} helper="Requieren revisión" tone={failed > 0 ? 'danger' : 'default'} />
          </div>

          <AdminNotificationSendForm
            groups={groups}
            nucleos={nucleos.map((n) => ({ id: n.id, name: n.name, groupId: n.groupId, groupName: n.groupName }))}
            appVersions={appVersions}
          />

          <AdminSectionCard
            title="Historial de campañas"
            description="Haz clic en una fila para ver el detalle de destinatarios."
            contentClassName="overflow-x-auto p-0"
          >
            {campaigns.length === 0 ? (
              <div className="p-6">
                <AdminEmptyState
                  eyebrow="Notificaciones"
                  title="No hay campañas creadas"
                  description="Envía una notificación para que aparezca aquí en el historial."
                />
              </div>
            ) : (
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-surface/10">
                    {['Título', 'Estado', 'Objetivo', 'Enviadas', 'Abiertas', 'Fallidas', 'Fecha', ''].map((heading) => (
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
                  {campaigns.map((campaign) => {
                    const metrics = campaign.metadata as {
                      sent?: number
                      failed?: number
                      targeted?: number
                      opened?: number
                    } | undefined
                    return (
                      <AdminCampaignRow
                        key={campaign.id}
                        href={`/${locale}/admin/notifications/${campaign.id}`}
                        title={campaign.title}
                        status={campaign.status}
                        targeted={metrics?.targeted ?? '--'}
                        sent={metrics?.sent ?? '--'}
                        opened={metrics?.opened ?? '--'}
                        failed={metrics?.failed ?? '--'}
                        createdAtLabel={campaign.createdAt ? new Date(campaign.createdAt).toLocaleString(locale) : '--'}
                        deleteEndpoint={campaign.status === 'scheduled' ? `/api/admin/notifications/${campaign.id}` : null}
                      />
                    )
                  })}
                </tbody>
              </table>
            )}
          </AdminSectionCard>
        </div>
      </div>
    </div>
  )
}
