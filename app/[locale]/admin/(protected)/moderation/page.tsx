import AdminModuleScaffold, {
  type AdminModuleStat,
} from '@/components/admin/AdminModuleScaffold'

type Props = { params: Promise<{ locale: string }> }

const stats: AdminModuleStat[] = [
  {
    label: 'Casos abiertos',
    value: 0,
    helper: 'Sin reportes consolidados en la cola',
    tone: 'danger',
  },
  {
    label: 'Contenido oculto',
    value: 0,
    helper: 'Acciones de visibilidad aun sin ejecutar',
  },
  {
    label: 'Usuarios suspendidos',
    value: 0,
    helper: 'Control futuro sobre bloqueos temporales',
  },
  {
    label: 'Revision activa',
    value: 'Pendiente',
    helper: 'Flujo para personas y contenido',
    tone: 'warning',
  },
]

export default async function ModerationPage({ params }: Props) {
  await params

  return (
    <AdminModuleScaffold
      section="Moderacion"
      description="Revision de usuarios, contenido y acciones de ocultar o suspender."
      title="Moderacion"
      intro="La base del modulo permite ordenar futuras colas de revision para decidir suspensiones, ocultamientos y seguimiento de casos sensibles dentro de la comunidad."
      emptyTitle="La cola de moderacion aparecera aqui"
      emptyDescription="En la siguiente fase se reuniran reportes, estados de revision y acciones para ocultar contenido, suspender cuentas o dejar observaciones de seguimiento."
      stats={stats}
    />
  )
}
