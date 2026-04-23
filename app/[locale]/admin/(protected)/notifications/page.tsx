import AdminModuleScaffold, {
  type AdminModuleStat,
} from '@/components/admin/AdminModuleScaffold'

type Props = { params: Promise<{ locale: string }> }

const stats: AdminModuleStat[] = [
  {
    label: 'Campanas activas',
    value: 0,
    helper: 'Sin envios programados todavia',
  },
  {
    label: 'Canal push',
    value: 'API',
    helper: 'Proveedor externo de mensajeria',
    tone: 'accent',
  },
  {
    label: 'Entrega',
    value: 'Pendiente',
    helper: 'Seguimiento de envios y rebotes',
    tone: 'warning',
  },
  {
    label: 'Ultimo envio',
    value: '--',
    helper: 'Sin campaña consolidada todavia',
  },
]

export default async function NotificationsPage({ params }: Props) {
  await params

  return (
    <AdminModuleScaffold
      section="Notificaciones"
      description="Campanas push, envio y seguimiento de entrega."
      title="Notificaciones"
      intro="El modulo preparara el control de campanas push para lanzar mensajes, seguir su entrega y revisar incidencias sin salir del admin."
      emptyTitle="Las campanas de notificaciones apareceran aqui"
      emptyDescription="En la siguiente fase se administraran campañas, segmentos, estados de envio y metricas de entrega para seguimiento posterior al lanzamiento."
      stats={stats}
    />
  )
}
