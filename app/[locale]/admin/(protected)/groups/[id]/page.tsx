import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminTopbar from '@/components/admin/AdminTopbar'
import GroupEditForm from '@/components/admin/GroupEditForm'
import Badge from '@/components/ui/Badge'
import { getGroupWithNucleos } from '@/lib/queries'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function GroupAdminPage({ params }: Props) {
  const { locale, id } = await params
  const data = await getGroupWithNucleos(id, { includeHidden: true }).catch(() => null)

  if (!data) notFound()

  const { group, nucleos } = data

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminTopbar section={`Grupos / ${group.name}`} />

      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <Link
          href={`/${locale}/admin/groups`}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted transition-colors hover:text-accent"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a grupos
        </Link>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-3">
              {group.logoUrl ? (
                <img src={group.logoUrl} className="h-full w-full object-contain" alt={group.name} />
              ) : (
                <span className="text-2xl font-semibold text-text-muted">{group.name[0]}</span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.04em] text-text sm:text-3xl">
                {group.name}
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                Admin ID <code className="rounded bg-surface px-1.5 py-0.5 text-[11px]">{group.id}</code>
              </p>
              {/* Sistema de graduación */}
              {group.graduationSystemName && (
                <p className="mt-2 text-sm text-accent font-semibold">
                  Sistema de graduación: <span className="font-bold">{group.graduationSystemName}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="accent">{`${nucleos.length} nucleos`}</Badge>
            {group.memberCount ? <Badge>{`${group.memberCount} miembros`}</Badge> : null}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <GroupEditForm group={group} locale={locale} />

          <aside className="space-y-6">
            <section className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
              <h2 className="text-sm font-semibold text-text">Nucleos del grupo</h2>
              <div className="mt-5 space-y-3">
                {nucleos.length > 0 ? (
                  nucleos.map((nucleo) => (
                    <div
                      key={nucleo.id}
                      className="rounded-2xl border border-border bg-surface/70 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-text">{nucleo.name}</p>
                          <p className="mt-1 text-xs text-text-muted">
                            {[nucleo.city, nucleo.country].filter(Boolean).join(', ') || 'Sin ubicacion'}
                          </p>
                        </div>

                        <Link
                          href={`/${locale}/admin/nucleos/${group.id}/${nucleo.id}`}
                          className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent/30"
                        >
                          Editar
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-surface/55 px-4 py-6 text-sm text-text-muted">
                    No hay nucleos asociados a este grupo.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
              <h2 className="text-sm font-semibold text-text">Resumen</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Paises</span>
                  <span className="font-semibold text-text">{group.representedCountries?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Ciudades</span>
                  <span className="font-semibold text-text">{group.representedCities?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Graduacion</span>
                  <span className="font-semibold text-text">{group.graduationSystemName || 'Personalizada'}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
