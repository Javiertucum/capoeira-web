import AdminModuleScaffold, {
  type AdminModuleStat,
} from '@/components/admin/AdminModuleScaffold'

type Props = { params: Promise<{ locale: string }> }

const stats: AdminModuleStat[] = [
  {
    label: 'Sesiones abiertas',
    value: 0,
    helper: 'Control en vivo aun sin sincronizar',
  },
  {
    label: 'Asistencia del dia',
    value: '--',
    helper: 'Resumen listo para corte por clase',
  },
  {
    label: 'Modo de control',
    value: 'Pendiente',
    helper: 'Definicion de registro manual o automatico',
    tone: 'warning',
  },
  {
    label: 'Ultimo cierre',
    value: '--',
    helper: 'Sin sesion consolidada todavia',
    tone: 'accent',
  },
]

export default async function AttendancePage({ params }: Props) {
  await params

  return (
    <AdminModuleScaffold
      section="Asistencia"
      description="Control de asistencia, sesiones y cierres operativos."
      title="Asistencia"
      intro="Esta pantalla servira para seguir sesiones activas, validar presencia por clase y mantener el control diario del registro operativo."
      emptyTitle="El control de asistencia aparecera aqui"
      emptyDescription="En la siguiente fase se cargaran sesiones, listas de presentes y herramientas para abrir, cerrar o corregir asistencia por grupo."
      stats={stats}
    />
  )
}
