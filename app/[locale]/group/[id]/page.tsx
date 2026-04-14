import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getGroupWithNucleos, getEducatorProfile } from '@/lib/queries'
import NucleoListItem from '@/components/public/NucleoListItem'
import Badge from '@/components/ui/Badge'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const result = await getGroupWithNucleos(id)
  if (!result) return { title: 'Grupo no encontrado' }
  return {
    title: `${result.group.name} — Capoeira Map`,
    description: `Grupo de capoeira con ${result.nucleos.length} núcleos activos`,
  }
}

export default async function GroupPage({ params }: Props) {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'profile' })

  const data = await getGroupWithNucleos(id)
  if (!data) {
    notFound()
  }

  const { group, nucleos } = data

  // For groups, we might want to show the main admin/organizer
  const adminUser = group.adminUserIds?.[0] 
    ? await getEducatorProfile(group.adminUserIds[0])
    : null

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_top,rgba(102,187,106,0.12),transparent_70%)] pointer-events-none"
      />

      <main className="relative mx-auto max-w-[1000px] px-5 py-10 sm:px-8 lg:px-12">
        <Link
          href={`/${locale}/map?filter=groups`}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 text-sm text-text-muted transition-all hover:border-border/80 hover:text-text"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </Link>

        {/* Group Header */}
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-card p-6 sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="absolute right-[-40px] top-[-40px] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(102,187,106,0.14)_0%,rgba(102,187,106,0)_72%)]"
          />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg sm:h-40 sm:w-40">
              {group.logoUrl ? (
                <img
                  src={group.logoUrl}
                  alt={group.name}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-contain p-4"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface text-4xl font-bold text-text-muted">
                  {group.name?.[0] ?? '?'}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">
                {group.name}
              </h1>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {group.graduationSystemName && (
                  <Badge variant="accent">{group.graduationSystemName}</Badge>
                )}
                <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-[11px] font-semibold tracking-wider text-text-muted uppercase">
                  {group.memberCount ?? 0} {t('members')}
                </span>
              </div>

              {group.representedCountries && group.representedCountries.length > 0 && (
                <p className="mt-6 text-sm leading-6 text-text-secondary">
                  <span className="font-semibold text-text-muted mr-2 uppercase tracking-widest text-[10px]">
                    {t('representedCountries')}:
                  </span>
                  {group.representedCountries.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* Main Content: Nucleos List */}
          <section>
            <h2 className="text-2xl font-bold text-text">
              {t('nucleos')} ({nucleos.length})
            </h2>
            <div className="mt-8 flex flex-col gap-6">
              {nucleos.length > 0 ? (
                nucleos.map((nucleo) => (
                  <NucleoListItem
                    key={nucleo.id}
                    nucleo={nucleo}
                    isActive={false}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center text-text-muted">
                  {t('noNucleos')}
                </div>
              )}
            </div>
          </section>

          {/* Sidebar: Admin / Info */}
          <aside className="space-y-8">
            {adminUser && (
              <section className="rounded-2xl border border-border bg-card/60 p-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">
                  {t('admin')}
                </h3>
                <div className="mt-5 text-center">
                  <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-accent/20 bg-surface">
                    {adminUser.avatarUrl ? (
                      <img
                        src={adminUser.avatarUrl}
                        alt={adminUser.nickname || adminUser.name || 'Admin'}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-bold text-text-muted">
                        {adminUser.name?.[0] ?? '?'}
                      </div>
                    )}
                  </div>
                  <p className="mt-3 font-semibold text-text">
                    {adminUser.nickname || `${adminUser.name} ${adminUser.surname}`}
                  </p>
                  <Link
                    href={`/${locale}/educator/${adminUser.uid}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-accent/30 hover:text-text"
                  >
                    {t('viewProfile')}
                  </Link>
                </div>
              </section>
            )}

            <section className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">
                {t('stats')}
              </h3>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{t('nucleos')}</span>
                  <span className="font-bold text-text">{nucleos.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{t('representedCities')}</span>
                  <span className="font-bold text-text">{group.representedCities?.length || 0}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
