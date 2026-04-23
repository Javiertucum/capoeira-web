import AdminModuleScaffold, {
  type AdminModuleStat,
} from '@/components/admin/AdminModuleScaffold'

type Props = { params: Promise<{ locale: string }> }

const stats: AdminModuleStat[] = [
  {
    label: 'Ingresos visibles',
    value: '--',
    helper: 'Resumen general aun sin importar',
  },
  {
    label: 'Proveedor externo',
    value: 'API',
    helper: 'Origen principal de datos financieros',
    tone: 'accent',
  },
  {
    label: 'Cache financiera',
    value: 'Pendiente',
    helper: 'Frescura del resumen y conciliaciones',
    tone: 'warning',
  },
  {
    label: 'Proximo cierre',
    value: '--',
    helper: 'Ventana de consolidacion pendiente',
  },
]

export default async function FinancesPage({ params }: Props) {
  await params

  return (
    <AdminModuleScaffold
      section="Finanzas"
      description="Resumen de ingresos, proveedores externos y frescura de cache."
      title="Finanzas"
      intro="La pantalla inicial ordena el espacio para una vista ejecutiva de ingresos, dependencias externas y estado de actualizacion antes de abrir integraciones reales."
      emptyTitle="El resumen financiero aparecera aqui"
      emptyDescription="En la siguiente fase se integraran vistas de ingresos, conciliaciones por proveedor y controles para revisar la frescura del cache financiero."
      stats={stats}
    />
  )
}
