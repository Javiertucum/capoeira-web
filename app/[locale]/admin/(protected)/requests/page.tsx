import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminRequestActionButtons from '@/components/admin/AdminRequestActionButtons'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import {
  getPendingAdminRequests,
  getPendingAdminRequestStats,
} from '@/lib/admin-queries'

type Props = { params: Promise<{ locale: string }> }

export default async function RequestsPage({ params }: Props) {
  const { locale } = await params

  const [requests, stats] = await Promise.all([
    getPendingAdminRequests().catch((error) => {
      console.error('[RequestsPage] failed to fetch requests', error)
      return []
    }),
    getPendingAdminRequestStats().catch((error) => {
      console.error('[RequestsPage] failed to fetch request stats', error)
      return {
        totalPending: 0,
        groupJoinPending: 0,
        nucleoJoinPending: 0,
        educatorPending: 0,
        transitionPending: 0,
      }
    }),
  ])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar
        section="Solicitudes"
        description="Cola operativa con decisiones reales sobre ingresos y transiciones."
      />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader
            eyebrow="Operacion viva"
            title="Solicitudes"
            description="Esta bandeja unifica las solicitudes pendientes que ya existen en Firestore. Aprobar o rechazar desde aqui actualiza el estado real del sistema."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <AdminStatCard
              label="Pendientes"
              value={stats.totalPending.toLocaleString()}
              helper="Total de solicitudes activas en la cola"
              tone={stats.totalPending > 0 ? 'warning' : 'accent'}
            />
            <AdminStatCard
              label="Ingreso a grupo"
              value={stats.groupJoinPending.toLocaleString()}
              helper="Educadores que quieren cambiar o entrar a un grupo"
              tone={stats.groupJoinPending > 0 ? 'warning' : 'default'}
            />
            <AdminStatCard
              label="Ingreso a nucleo"
              value={stats.nucleoJoinPending.toLocaleString()}
              helper="Alumnos pendientes de validacion por sede"
              tone={stats.nucleoJoinPending > 0 ? 'warning' : 'default'}
            />
            <AdminStatCard
              label="Relacion educador"
              value={stats.educatorPending.toLocaleString()}
              helper="Solicitudes de jerarquia entre educadores"
              tone={stats.educatorPending > 0 ? 'warning' : 'default'}
            />
            <AdminStatCard
              label="Transiciones"
              value={stats.transitionPending.toLocaleString()}
              helper="Cambios de nucleo o grupo aun sin resolver"
              tone={stats.transitionPending > 0 ? 'warning' : 'default'}
            />
          </div>

          <AdminSectionCard
            title="Bandeja de solicitudes"
            description="Las filas desaparecen de esta vista apenas dejan de estar en estado pendiente. Algunas decisiones disparan automatizaciones en segundo plano."
            contentClassName="overflow-x-auto p-0"
          >
            {requests.length === 0 ? (
              <div className="p-6">
                <AdminEmptyState
                  eyebrow="Solicitudes"
                  title="No hay solicitudes pendientes"
                  description="La cola esta limpia. Cuando entre una nueva solicitud de grupo, nucleo, relacion o transicion aparecera aqui con sus acciones disponibles."
                />
              </div>
            ) : (
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="bg-surface/10">
                    {['Tipo', 'Solicita', 'Destino', 'Contexto', 'Fecha', 'Acciones'].map((heading) => (
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
                  {requests.map((request) => (
                    <tr key={`${request.requestType}:${request.id}`} className="align-top transition-colors hover:bg-surface/30">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <Badge variant="warning">{request.typeLabel}</Badge>
                          <span className="text-[11px] text-text-muted">{request.requestType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-text">{request.requesterName}</div>
                        <div className="mt-1 text-xs text-text-muted">{request.requesterId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text">{request.subject}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[360px] text-sm leading-6 text-text-secondary">
                          {request.context}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text">
                          {request.createdAt
                            ? new Date(request.createdAt).toLocaleString(locale)
                            : '--'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <AdminRequestActionButtons
                          requestId={request.id}
                          requestType={request.requestType}
                        />
                      </td>
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
