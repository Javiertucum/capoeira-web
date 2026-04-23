import AdminModuleScaffold, {
  type AdminModuleStat,
} from '@/components/admin/AdminModuleScaffold'

type Props = { params: Promise<{ locale: string }> }

const stats: AdminModuleStat[] = [
  {
    label: 'Cobertura visible',
    value: '--',
    helper: 'Resumen geografico aun sin calcular',
  },
  {
    label: 'Puntos QA',
    value: 0,
    helper: 'Ubicaciones por validar en mapa',
  },
  {
    label: 'Mapa base',
    value: 'API',
    helper: 'Proveedor geografico externo',
    tone: 'accent',
  },
  {
    label: 'Cache de mapa',
    value: 'Pendiente',
    helper: 'Revision de frescura y consistencia',
    tone: 'warning',
  },
]

export default async function GlobalMapPage({ params }: Props) {
  await params

  return (
    <AdminModuleScaffold
      section="Mapa global"
      description="Cobertura geografica, validacion visual y QA del mapa."
      title="Mapa global"
      intro="Este modulo consolidara la vision geografica del ecosistema para revisar cobertura, detectar puntos inconsistentes y asegurar que el mapa publico mantenga calidad."
      emptyTitle="La operacion del mapa aparecera aqui"
      emptyDescription="En la siguiente fase se mostraran ubicaciones, controles de QA y herramientas para corregir coordenadas o validar la cobertura por pais y ciudad."
      stats={stats}
    />
  )
}
