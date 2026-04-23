import AdminModuleScaffold, {
  type AdminModuleStat,
} from '@/components/admin/AdminModuleScaffold'

type Props = { params: Promise<{ locale: string }> }

const stats: AdminModuleStat[] = [
  {
    label: 'Entidades curadas',
    value: 0,
    helper: 'Sin seleccion destacada todavia',
  },
  {
    label: 'Home activa',
    value: 'Pendiente',
    helper: 'Curaduria principal aun sin publicar',
    tone: 'warning',
  },
  {
    label: 'Fuente',
    value: 'Cache',
    helper: 'Listado preparado para render rapido',
    tone: 'accent',
  },
  {
    label: 'Proxima revision',
    value: '--',
    helper: 'Ventana de recambio editorial pendiente',
  },
]

export default async function FeaturedContentPage({ params }: Props) {
  await params

  return (
    <AdminModuleScaffold
      section="Contenido destacado"
      description="Curaduria de entidades y piezas visibles en espacios clave."
      title="Contenido destacado"
      intro="Esta vista deja preparado el punto de control para elegir que grupos, eventos o perfiles deben recibir visibilidad destacada dentro del producto."
      emptyTitle="La curaduria destacada aparecera aqui"
      emptyDescription="En la siguiente fase se administraran listas destacadas, orden manual y criterios para promover o retirar contenido segun prioridad editorial."
      stats={stats}
    />
  )
}
