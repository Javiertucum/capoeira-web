import AdminModuleScaffold, {
  type AdminModuleStat,
} from '@/components/admin/AdminModuleScaffold'

type Props = { params: Promise<{ locale: string }> }

const stats: AdminModuleStat[] = [
  {
    label: 'Niveles activos',
    value: 0,
    helper: 'Escala de cordas aun sin cargar',
  },
  {
    label: 'Asignaciones hoy',
    value: 0,
    helper: 'Cambios pendientes de publicacion',
  },
  {
    label: 'Revision de cordas',
    value: 'Pendiente',
    helper: 'Validacion manual de reglas y permisos',
    tone: 'warning',
  },
  {
    label: 'Proximo cambio',
    value: '--',
    helper: 'Agenda futura de graduaciones',
    tone: 'accent',
  },
]

export default async function GraduationsPage({ params }: Props) {
  await params

  return (
    <AdminModuleScaffold
      section="Graduaciones"
      description="Niveles, cordas y asignaciones dentro del sistema."
      title="Graduaciones"
      intro="El modulo de graduaciones ordenara la jerarquia tecnica, las reglas de corda y las asignaciones para que cada cambio quede claro y auditable."
      emptyTitle="Las graduaciones se gestionaran desde aqui"
      emptyDescription="En la siguiente fase se habilitaran niveles, catalogo de cordas y acciones para asignar, revisar o corregir graduaciones por usuario."
      stats={stats}
    />
  )
}
