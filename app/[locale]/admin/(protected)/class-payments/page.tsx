import AdminModuleScaffold, {
  type AdminModuleStat,
} from '@/components/admin/AdminModuleScaffold'

type Props = { params: Promise<{ locale: string }> }

const stats: AdminModuleStat[] = [
  {
    label: 'Pagos pendientes',
    value: 0,
    helper: 'Clases aun sin conciliar',
    tone: 'warning',
  },
  {
    label: 'Conciliacion',
    value: 'Pendiente',
    helper: 'Revision de cobros por sesion',
  },
  {
    label: 'Proveedor',
    value: 'API',
    helper: 'Conector externo de cobro por clase',
    tone: 'accent',
  },
  {
    label: 'Ultimo lote',
    value: '--',
    helper: 'Sin corrida de control todavia',
  },
]

export default async function ClassPaymentsPage({ params }: Props) {
  await params

  return (
    <AdminModuleScaffold
      section="Pagos de clases"
      description="Control de cobros puntuales y conciliacion por sesion."
      title="Pagos de clases"
      intro="El modulo prepara la operacion para revisar pagos por clase, detectar faltantes y dejar un rastro claro entre asistencia, cobro y conciliacion."
      emptyTitle="El control de pagos por clase aparecera aqui"
      emptyDescription="En la siguiente fase se mostraran sesiones cobrables, estados de pago y acciones para confirmar, observar o regularizar cada movimiento."
      stats={stats}
    />
  )
}
