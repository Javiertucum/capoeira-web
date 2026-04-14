import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import NucleoListItem from '@/components/public/NucleoListItem'
import Badge from '@/components/ui/Badge'
import { getEducatorProfile, getGroupWithNucleos } from '@/lib/queries'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath } from '@/lib/site'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

const COPY = {
  es: {
    eyebrow: 'Perfil publico del grupo',
    summary: 'Una vista mas clara para entender el tamano, el alcance y los espacios activos de la comunidad.',
  },
  pt: {
    eyebrow: 'Perfil publico do grupo',
    summary: 'Uma vista mais clara para entender o tamanho, o alcance e os espacos ativos da comunidade.',
  },
  en: {
    eyebrow: 'Public group profile',
    summary: 'A clearer view of the scale, reach, and active training spaces behind this community.',
  },
} as const

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.en
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params
  const result = await getGroupWithNucleos(id)

  if (!result) return { title: 'Grupo no encontrado' }

  const path = `/group/${id}`
  const description = `Grupo de capoeira con ${result.nucleos.length} nucleos activos.`

  return {
    title: result.group.name,
    description,
    alternates: {
      canonical: getLocalizedPath(locale, path),
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title: formatPageTitle(result.group.name),
      description,
      url: getLocalizedPath(locale, path),
      type: 'website',
    },
  }
}

export default async function GroupPage({ params }: Props) {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'profile' })
  const copy = getCopy(locale)

  const data = await getGroupWithNucleos(id).catch(() => null)
  if (!data) {
    notFound()
  }

  const { group, nucleos } = data

  const adminUser = group.adminUserIds?.[0]
    ? await getEducatorProfile(group.adminUserIds[0]).catch(() => null)
    : null

  // Sistema de graduación
  const graduationSystem = group.graduationSystemName || t('unspecified')

  const stats = [
    { label: t('members'), value: group.memberCount ?? 0 },
    { label: t('nucleos'), value: nucleos.length },
    { label: t('representedCountries'), value: group.representedCountries?.length ?? 0 },
    { label: t('representedCities'), value: group.representedCities?.length ?? 0 },
    { label: t('graduationSystem'), value: graduationSystem },
  ]

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(216,173,99,0.12),transparent_68%)] pointer-events-none"
      />

      <main className="relative mx-auto max-w-[1180px] px-5 py-10 sm:px-8 lg:px-12">
        <Link
          href={`/${locale}/map?filter=groups`}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-text-muted transition-colors hover:border-accent/20 hover:text-text"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </Link>

        <section className="relative overflow-hidden rounded-[34px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-6 shadow-[0_30px_90px_var(--shadow)] sm:p-8">
          <div
            aria-hidden="true"
            className="absolute right-[-70px] top-[-70px] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(216,173,99,0.18)_0%,rgba(216,173,99,0)_72%)]"
          />

          <div className="relative grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
            <div className="flex justify-center lg:justify-start">
              <div className="relative h-[170px] w-[170px] overflow-hidden rounded-[30px] border border-border bg-surface shadow-[0_22px_60px_var(--shadow-soft)]">
                {group.logoUrl ? (
                  <img
                    src={group.logoUrl}
                    alt={group.name}
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 h-full w-full object-contain p-5"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-text-muted">
                    {group.name?.[0] ?? '?'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                {copy.eyebrow}
              </p>
              <h1 className="mt-4 text-[clamp(34px,5vw,60px)] font-semibold leading-[0.96] tracking-[-0.06em] text-text">
                {group.name}
              </h1>
              <p className="mt-5 max-w-[58ch] text-base leading-8 text-text-secondary">
                {copy.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {group.graduationSystemName ? (
                  <Badge variant="accent">{t('graduationSystem') + ': ' + group.graduationSystemName}</Badge>
                ) : null}
                {group.memberCount ? <Badge>{`${group.memberCount} ${t('members')}`}</Badge> : null}
                {group.representedCountries?.length ? (
                  <Badge>{`${group.representedCountries.length} ${t('representedCountries')}`}</Badge>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[30px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-6 shadow-[0_22px_60px_var(--shadow-soft)]">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-text">
              {`${t('nucleos')} (${nucleos.length})`}
            </h2>

            {group.representedCountries && group.representedCountries.length > 0 ? (
              <div className="mt-5 rounded-[22px] border border-border bg-surface/60 px-5 py-4 text-sm leading-7 text-text-secondary">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-muted">
                  {t('representedCountries')}
                </span>
                <div className="mt-2">{group.representedCountries.join(' | ')}</div>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-4">
              {nucleos.length > 0 ? (
                nucleos.map((nucleo) => (
                  <NucleoListItem key={nucleo.id} nucleo={nucleo} isActive={false} />
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-border bg-surface-muted/70 px-5 py-8 text-center text-sm leading-7 text-text-muted">
                  {t('noNucleos')}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                {t('stats')}
              </p>
              <div className="mt-5 grid gap-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[18px] border border-border bg-surface px-4 py-4"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted">
                      {item.label}
                    </p>
                    <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.04em] text-text">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {adminUser ? (
              <section className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                  {t('admin')}
                </p>
                <div className="mt-5 text-center">
                  <div className="relative mx-auto h-[84px] w-[84px] overflow-hidden rounded-full border border-accent/20 bg-surface">
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

                  <p className="mt-4 font-semibold text-text">
                    {adminUser.nickname || `${adminUser.name} ${adminUser.surname}`}
                  </p>
                  {/* Mostrar cuerda y sistema de graduación si existen */}
                  {adminUser.graduationLevelId && group.graduationSystemName ? (
                    <div className="mt-2">
                      <Badge variant="accent">{`${group.graduationSystemName}: ${adminUser.graduationLevelId}`}</Badge>
                    </div>
                  ) : null}

                  <Link
                    href={`/${locale}/educator/${adminUser.uid}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-border bg-surface px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-accent/20 hover:text-text"
                  >
                    {t('viewProfile')}
                  </Link>
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </main>
    </div>
  )
}
