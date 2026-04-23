import AdminModuleScaffold, {
  type AdminModuleStat,
} from '@/components/admin/AdminModuleScaffold'

type Props = { params: Promise<{ locale: string }> }

const stats: AdminModuleStat[] = [
  {
    label: 'CSV listos',
    value: 0,
    helper: 'Archivos aun sin generarse',
  },
  {
    label: 'JSON listos',
    value: 0,
    helper: 'Exportes estructurados pendientes',
  },
  {
    label: 'Audit trail',
    value: 'Pendiente',
    helper: 'Registro de descargas y solicitudes',
    tone: 'warning',
  },
  {
    label: 'Ultima descarga',
    value: '--',
    helper: 'Sin exportes ejecutados todavia',
    tone: 'accent',
  },
]

export default async function ExportsPage({ params }: Props) {
  await params

  return (
    <AdminModuleScaffold
      section="Exportar datos"
      description="Salidas CSV y JSON con foco en auditabilidad."
      title="Exportar datos"
      intro="Esta pagina deja preparada la base para generar exportes confiables, rastrear quien los ejecuta y mantener claridad sobre el formato y destino de cada archivo."
      emptyTitle="Los exportes del sistema apareceran aqui"
      emptyDescription="En la siguiente fase se habilitaran lotes CSV y JSON, filtros de alcance y registro auditable para cada exportacion solicitada desde admin."
      stats={stats}
    />
  )
}
