import AdminModuleScaffold, {
  type AdminModuleStat,
} from '@/components/admin/AdminModuleScaffold'

type Props = { params: Promise<{ locale: string }> }

const stats: AdminModuleStat[] = [
  {
    label: 'Planes activos',
    value: 0,
    helper: 'Catalogo listo para conectarse a billing',
  },
  {
    label: 'Salud de cobro',
    value: 'Pendiente',
    helper: 'Lectura del estado general de facturacion',
    tone: 'warning',
  },
  {
    label: 'Churn visible',
    value: '--',
    helper: 'Sin ventanas de renovacion cargadas',
  },
  {
    label: 'Proxima renovacion',
    value: '--',
    helper: 'Seguimiento de vencimientos y reintentos',
    tone: 'accent',
  },
]

export default async function SubscriptionsPage({ params }: Props) {
  await params

  return (
    <AdminModuleScaffold
      section="Suscripciones"
      description="Planes, salud de cobro y seguimiento de renovaciones."
      title="Suscripciones"
      intro="La vista inicial deja lista la base para controlar planes, revisar caidas de facturacion y detectar churn o renovaciones antes de impactar a los usuarios."
      emptyTitle="El control de suscripciones aparecera aqui"
      emptyDescription="En la siguiente fase este modulo reunira planes, estado de cobros, renovaciones proximas y alertas para cuentas con riesgo de cancelacion."
      stats={stats}
    />
  )
}
