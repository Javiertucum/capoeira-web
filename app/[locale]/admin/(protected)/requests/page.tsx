import AdminModuleScaffold, {
  type AdminModuleStat,
} from '@/components/admin/AdminModuleScaffold'

type Props = { params: Promise<{ locale: string }> }

const stats: AdminModuleStat[] = [
  {
    label: 'En cola',
    value: 0,
    helper: 'Pendiente de revision inicial',
    tone: 'warning',
  },
  {
    label: 'Flujo activo',
    value: 'Pendiente',
    helper: 'Aprobacion y rechazo manual',
  },
  {
    label: 'Origen',
    value: 'API',
    helper: 'Entradas desde formularios y backoffice',
    tone: 'accent',
  },
  {
    label: 'Ultimo cierre',
    value: '--',
    helper: 'Sin actividad consolidada todavia',
  },
]

export default async function RequestsPage({ params }: Props) {
  await params

  return (
    <AdminModuleScaffold
      section="Solicitudes"
      description="Cola y revision de altas, cambios y validaciones manuales."
      title="Solicitudes"
      intro="Este modulo prepara el flujo operativo para revisar la cola, priorizar casos y dejar trazabilidad sobre cada decision del equipo admin."
      emptyTitle="La cola de revision aparecera aqui"
      emptyDescription="En la siguiente fase se mostraran las solicitudes pendientes, su contexto y las acciones para aprobar, rechazar o devolver cada caso."
      stats={stats}
    />
  )
}
