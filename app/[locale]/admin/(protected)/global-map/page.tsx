import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import { getAdminNucleos } from '@/lib/admin-queries'
import Link from 'next/link'

type Props = {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ qa?: string }>
}

function hasCoordinates(nucleo: { latitude?: number | null; longitude?: number | null }) {
  return typeof nucleo.latitude === 'number' && typeof nucleo.longitude === 'number'
}

export default async function GlobalMapPage({ params, searchParams }: Props) {
  const { locale } = await params
  const filters = (await searchParams) ?? {}
  const nucleos = await getAdminNucleos().catch((error) => {
    console.error('[GlobalMapPage] failed to fetch nucleos', error)
    return []
  })

  const countries = new Set(nucleos.map((nucleo) => nucleo.country).filter(Boolean)).size
  const cities = new Set(nucleos.map((nucleo) => `${nucleo.country ?? ''}:${nucleo.city ?? ''}`).filter((value) => !value.endsWith(':'))).size
  const missingCoordinates = nucleos.filter((nucleo) => !hasCoordinates(nucleo))
  const missingResponsible = nucleos.filter((nucleo) => !nucleo.responsibleEducatorId)
  const qaRows = filters.qa === 'issues'
    ? nucleos.filter((nucleo) => !hasCoordinates(nucleo) || !nucleo.country || !nucleo.city || !nucleo.responsibleEducatorId)
    : nucleos

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar
        section="Mapa global"
        description="Cobertura geografica y QA de ubicaciones publicas."
      />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader
            eyebrow="QA geografico"
            title="Mapa global"
            description="Vista operativa de todos los nucleos que alimentan el mapa publico. Prioriza datos faltantes de coordenadas, ciudad, pais y responsable."
            actions={
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/${locale}/admin/global-map`}
                  className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
                >
                  Todos
                </Link>
                <Link
                  href={`/${locale}/admin/global-map?qa=issues`}
                  className="rounded-xl border border-warning/20 bg-warning/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-warning transition-colors hover:bg-warning/15"
                >
                  Revisar QA
                </Link>
              </div>
            }
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <AdminStatCard label="Nucleos" value={nucleos.length.toLocaleString(locale)} helper="Sedes visibles para operacion admin" />
            <AdminStatCard label="Paises" value={countries.toLocaleString(locale)} helper="Cobertura por pais declarada" tone="accent" />
            <AdminStatCard label="Ciudades" value={cities.toLocaleString(locale)} helper="Cobertura urbana declarada" />
            <AdminStatCard label="Sin coordenadas" value={missingCoordinates.length.toLocaleString(locale)} helper="No pueden posicionarse con precision" tone={missingCoordinates.length > 0 ? 'warning' : 'accent'} />
            <AdminStatCard label="Sin responsable" value={missingResponsible.length.toLocaleString(locale)} helper="Requiere asignacion operativa" tone={missingResponsible.length > 0 ? 'danger' : 'accent'} />
          </div>

          <AdminSectionCard
            title="QA de ubicaciones"
            description="Cada fila enlaza a la edicion del nucleo para corregir datos de mapa."
            contentClassName="overflow-x-auto p-0"
          >
            {qaRows.length === 0 ? (
              <div className="p-6">
                <AdminEmptyState
                  eyebrow="Mapa global"
                  title="No hay problemas de QA"
                  description="Todos los nucleos cargados para este filtro tienen datos minimos de mapa."
                />
              </div>
            ) : (
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="bg-surface/10">
                    {['Nucleo', 'Grupo', 'Ubicacion', 'Coordenadas', 'Responsable', 'Estado', ''].map((heading) => (
                      <th
                        key={heading}
                        className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {qaRows.map((nucleo) => {
                    const complete = hasCoordinates(nucleo) && nucleo.country && nucleo.city && nucleo.responsibleEducatorId
                    return (
                      <tr key={`${nucleo.groupId}:${nucleo.id}`} className="transition-colors hover:bg-surface/30">
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-text">{nucleo.name || nucleo.id}</div>
                          <div className="mt-1 text-xs text-text-muted">{nucleo.id}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{nucleo.groupName}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {[nucleo.city, nucleo.country].filter(Boolean).join(', ') || '--'}
                        </td>
                        <td className="px-6 py-4 text-xs text-text-secondary">
                          {hasCoordinates(nucleo) ? `${nucleo.latitude}, ${nucleo.longitude}` : '--'}
                        </td>
                        <td className="px-6 py-4 text-xs text-text-secondary">{nucleo.responsibleEducatorId ?? '--'}</td>
                        <td className="px-6 py-4">
                          <Badge variant={complete ? 'accent' : 'warning'}>{complete ? 'Completo' : 'Revisar'}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/${locale}/admin/nucleos/${nucleo.groupId}/${nucleo.id}`}
                            className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-surface px-4 text-xs font-bold text-accent transition-all hover:border-accent/30 hover:bg-accent/10"
                          >
                            Editar
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </AdminSectionCard>
        </div>
      </div>
    </div>
  )
}
