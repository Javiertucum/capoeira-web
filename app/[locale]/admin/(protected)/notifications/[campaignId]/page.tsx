import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import CampaignStatusActions from '@/components/admin/CampaignStatusActions'
import Badge from '@/components/ui/Badge'
import { adminDb } from '@/lib/firebase-admin'

type Props = { params: Promise<{ locale: string; campaignId: string }> }

type CampaignDetail = {
  id: string
  title: string
  body: string
  status: string
  metrics: {
    targeted?: number
    sent?: number
    failed?: number
    opened?: number
    purged?: number
  }
  deepLink: string | null
  segment: Record<string, unknown>
  createdAt: string | null
}

type RecipientRow = {
  uid: string
  displayName: string
  email: string
  sent: boolean
  opened: boolean
  openedAt: string | null
}

async function getCampaign(campaignId: string): Promise<CampaignDetail | null> {
  const doc = await adminDb.collection('adminNotificationCampaigns').doc(campaignId).get()
  if (!doc.exists) return null

  const data = doc.data() ?? {}
  return {
    id: doc.id,
    title: typeof data.title === 'string' ? data.title : 'Notificación',
    body: typeof data.body === 'string' ? data.body : '',
    status: typeof data.status === 'string' ? data.status : 'unknown',
    metrics: {
      targeted: typeof data.metrics?.targeted === 'number' ? data.metrics.targeted : 0,
      sent: typeof data.metrics?.sent === 'number' ? data.metrics.sent : 0,
      failed: typeof data.metrics?.failed === 'number' ? data.metrics.failed : 0,
      opened: typeof data.metrics?.opened === 'number' ? data.metrics.opened : 0,
      purged: typeof data.metrics?.purged === 'number' ? data.metrics.purged : 0,
    },
    deepLink: typeof data.deepLink === 'string' ? data.deepLink : null,
    segment: typeof data.segment === 'object' && data.segment !== null ? data.segment : {},
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
  }
}

async function getRecipients(campaignId: string): Promise<RecipientRow[]> {
  const snap = await adminDb
    .collection('adminNotificationCampaigns')
    .doc(campaignId)
    .collection('recipients')
    .orderBy('displayName')
    .limit(20)
    .get()

  return snap.docs.map((doc) => {
    const data = doc.data()
    return {
      uid: doc.id,
      displayName: typeof data.displayName === 'string' ? data.displayName : '',
      email: typeof data.email === 'string' ? data.email : '',
      sent: data.sent === true,
      opened: data.opened === true,
      openedAt: data.openedAt?.toDate?.()?.toISOString?.() ?? null,
    }
  })
}

function renderSegmentSummary(segment: Record<string, unknown>) {
  const roles = Array.isArray(segment.roles) ? segment.roles.filter((value): value is string => typeof value === 'string') : []
  const countries = Array.isArray(segment.countries) ? segment.countries.filter((value): value is string => typeof value === 'string') : []
  const plans = Array.isArray(segment.subscriptionPlans) ? segment.subscriptionPlans.filter((value): value is string => typeof value === 'string') : []
  const groupIds = Array.isArray(segment.groupIds) ? segment.groupIds.filter((value): value is string => typeof value === 'string') : []
  const userIds = Array.isArray(segment.userIds) ? segment.userIds.filter((value): value is string => typeof value === 'string') : []
  const noGroup = segment.noGroup === true

  const summaryLines = [
    roles.length > 0 ? `Roles: ${roles.join(', ')}` : '',
    countries.length > 0 ? `Países: ${countries.join(', ')}` : '',
    plans.length > 0 ? `Planes: ${plans.join(', ')}` : '',
    groupIds.length > 0 ? `Grupos: ${groupIds.join(', ')}` : '',
    noGroup ? 'Usuarios sin grupo' : '',
    userIds.length > 0 ? `Usuarios individuales: ${userIds.length}` : '',
  ].filter(Boolean)

  if (summaryLines.length === 0) {
    return <p className="text-sm text-text-secondary">Segmento: Todos los usuarios</p>
  }

  return (
    <div className="space-y-2 text-sm text-text-secondary">
      {summaryLines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  )
}

export default async function CampaignDetailPage({ params }: Props) {
  const { locale, campaignId } = await params
  const campaign = await getCampaign(campaignId)

  if (!campaign) {
    notFound()
  }

  const recipients = await getRecipients(campaignId)
  const recipientsCount = recipients.length

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section="Notificaciones" description="Detalle de la campaña y primeros destinatarios." />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <AdminPageHeader
              eyebrow="Comunicaciones"
              title={campaign.title}
              description="Resumen de la campaña, segmento, métricas y destinatarios recientes."
            />
            <Link
              href={`/${locale}/admin/notifications`}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-text-secondary"
            >
              Volver al historial
            </Link>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,320px)]">
            <div className="space-y-4">
              <AdminSectionCard title="Resumen" description="Información clave de esta campaña.">
                <div className="space-y-4 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={campaign.status === 'failed' ? 'danger' : campaign.status === 'sent' ? 'accent' : 'warning'}>
                      {campaign.status}
                    </Badge>
                    {campaign.deepLink ? (
                      <Link href={campaign.deepLink} target="_blank" rel="noreferrer" className="text-sm font-medium text-accent hover:underline">
                        Ver deep link
                      </Link>
                    ) : (
                      <span className="text-sm text-text-secondary">Sin deep link</span>
                    )}
                  </div>

                  <CampaignStatusActions campaignId={campaign.id} status={campaign.status} />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Creado</p>
                      <p className="mt-1 text-sm text-text-primary">{campaign.createdAt ? new Date(campaign.createdAt).toLocaleString(locale) : '--'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Contenido</p>
                      <p className="mt-1 text-sm text-text-primary">{campaign.body || 'Sin cuerpo de mensaje'}</p>
                    </div>
                  </div>
                </div>
              </AdminSectionCard>

              <AdminSectionCard title="Segmento" description="Criterios usados para elegir los destinatarios.">
                <div className="p-6">{renderSegmentSummary(campaign.segment)}</div>
              </AdminSectionCard>
            </div>

            <div className="space-y-4">
              <AdminSectionCard title="Métricas" description="Resultados clave de esta campaña.">
                <div className="grid grid-cols-2 gap-4 p-6">
                  <AdminStatCard label="Objetivo" value={String(campaign.metrics.targeted ?? 0)} helper="Total planeado" />
                  <AdminStatCard label="Enviadas" value={String(campaign.metrics.sent ?? 0)} helper="Mensajes confirmados" tone="accent" />
                  <AdminStatCard label="Abiertas" value={String(campaign.metrics.opened ?? 0)} helper="Usuarios que abrieron" tone="accent" />
                  <AdminStatCard label="Fallidas" value={String(campaign.metrics.failed ?? 0)} helper="Errores de envío" tone={campaign.metrics.failed && campaign.metrics.failed > 0 ? 'danger' : 'default'} />
                </div>
              </AdminSectionCard>
            </div>
          </div>

          <AdminSectionCard
            title="Destinatarios recientes"
            description="Los primeros 20 destinatarios de la campaña. Usa la API de paginación para más resultados."
            contentClassName="overflow-x-auto p-0"
          >
            {recipientsCount === 0 ? (
              <div className="p-6">
                <AdminEmptyState
                  eyebrow="Destinatarios"
                  title="No hay destinatarios disponibles"
                  description="Esta campaña no tiene registros de destinatarios o aún no se han creado documentos."
                />
              </div>
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
                      <td className="px-6 py-4 text-sm text-text-secondary">{recipient.openedAt ? new Date(recipient.openedAt).toLocaleString(locale) : '–'}</td>
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
