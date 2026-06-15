import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import {
  formatPageTitle,
  getLanguageAlternates,
  getLocalizedPath,
  getOgImageUrl,
  getLocalizedUrl,
  buildSportsOrganizationSchema,
  buildBreadcrumbSchema,
} from '@/lib/site'
import { getGroupWithNucleos, getGroupEducators, getGraduationLevels, getGraduationLevelNamesByGroup } from '@/lib/queries'
import { flagForCountry } from '@/lib/country-flags'
import CordaVisual from '@/components/public/CordaVisual'
import ProfileCard, { LocationPinIcon } from '@/components/public/ProfileCard'
import Avatar from '@/components/public/Avatar'

type Props = Readonly<{ params: Promise<{ locale: string; id: string }> }>

const DAY_SHORT = {
  es: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
  pt: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sá'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
} as const

function getDayShort(locale: string) {
  return DAY_SHORT[locale as keyof typeof DAY_SHORT] ?? DAY_SHORT.en
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params
  const result = await getGroupWithNucleos(id)
  if (!result) return {}
  const { group } = result

  const path = `/grupos/${id}`
  return {
    title: group.name,
    description: group.description ?? undefined,
    alternates: { canonical: getLocalizedPath(locale, path), languages: getLanguageAlternates(path) },
    openGraph: {
      title: formatPageTitle(group.name),
      description: group.description ?? undefined,
      url: getLocalizedPath(locale, path),
      type: 'website',
      images: [getOgImageUrl({ title: group.name, sub: group.graduationSystemName ?? undefined, type: 'group' })],
    },
  }
}

export default async function GroupProfilePage({ params }: Props) {
  const { locale, id } = await params
  const t = await getTranslations('profile')

  const result = await getGroupWithNucleos(id)
  if (!result) notFound()
  const { group, nucleos } = result

  const [educators, graduationLevels] = await Promise.all([
    getGroupEducators(id),
    getGraduationLevels(id),
  ])

  const gradNamesByGroup = await getGraduationLevelNamesByGroup([id])
  const gradMap = gradNamesByGroup.get(id)
  const dayShort = getDayShort(locale)

  const orgSchema = buildSportsOrganizationSchema({
    name: group.name,
    url: getLocalizedUrl(locale, `/grupos/${id}`),
    logo: group.logoUrl,
    description: group.description ?? undefined,
    memberCount: group.memberCount,
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Agenda Capoeiragem', url: getLocalizedUrl(locale) },
    { name: t('group'), url: getLocalizedUrl(locale, '/#directorio') },
    { name: group.name, url: getLocalizedUrl(locale, `/grupos/${id}`) },
  ])

  return (
    <main className="min-h-screen bg-bg py-16 lg:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="page-shell-narrow">
        <Link href={`/${locale}/#directorio`} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-accent-ink hover:underline">
          ← {t('back')}
        </Link>

        {/* Profile card */}
        <ProfileCard>
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {group.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={group.logoUrl} alt={group.name} className="h-24 w-24 shrink-0 rounded-2xl border border-border object-cover" />
            ) : (
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border border-border bg-surface text-2xl font-bold text-text-secondary">
                {group.name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <div>
              <h1 className="font-black text-ink leading-[1.05] tracking-[-0.02em]" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
                {group.name}
              </h1>
              {group.graduationSystemName && <p className="mt-1 text-lg text-text-secondary">{group.graduationSystemName}</p>}
              {group.representedCountries && group.representedCountries.length > 0 && (
                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-text-secondary">
                  {group.representedCountries.map((country) => (
                    <span key={country} className="inline-flex items-center gap-1">
                      {flagForCountry(country) ?? ''} {country}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>

          {group.description && (
            <p className="mt-6 max-w-[70ch] text-base leading-relaxed text-text-secondary">{group.description}</p>
          )}

          {/* Stats */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-bold text-text-secondary">
            <span className="rounded-full border border-border bg-surface px-4 py-2">
              <span className="text-ink">{group.memberCount ?? 0}</span> {t('members').toLowerCase()}
            </span>
            {group.representedCities && group.representedCities.length > 0 && (
              <span className="rounded-full border border-border bg-surface px-4 py-2">
                {group.representedCities.join(' · ')}
              </span>
            )}
          </div>
        </ProfileCard>

        {/* Graduation system */}
        {graduationLevels.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('graduationSystem')}</p>
            <div className="flex flex-wrap gap-2">
              {graduationLevels.map((level) => (
                <span
                  key={level.id}
                  className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-ink"
                >
                  <CordaVisual colors={level.colors} tipColorLeft={level.tipColorLeft} tipColorRight={level.tipColorRight} />
                  {level.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Educators */}
        {educators.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('educators')}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {educators.map((educator) => (
                <Link
                  key={educator.uid}
                  href={`/${locale}/educadores/${educator.uid}`}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-colors duration-150 hover:border-accent"
                >
                  <Avatar name={educator.name} surname={educator.surname} avatarUrl={educator.avatarUrl} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink">
                      {educator.name} {educator.surname}
                      {flagForCountry(educator.country) && <span className="ml-2">{flagForCountry(educator.country)}</span>}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">
                      {(educator.graduationLevelId && gradMap?.get(educator.graduationLevelId)) ?? t('unspecified')}
                    </p>
                    {educator.bio && <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{educator.bio}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Nucleos */}
        <div className="mt-10">
          <p className="eyebrow acc mb-3">{t('nucleosSection')}</p>
          {nucleos.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {nucleos.map((nucleo) => {
                const nucleoFlag = flagForCountry(nucleo.country)
                const sortedSchedules = [...(nucleo.schedules ?? [])].sort(
                  (a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)
                )
                return (
                  <Link
                    key={nucleo.id}
                    href={`/${locale}/nucleos/${nucleo.groupId}/${nucleo.id}`}
                    className="block rounded-2xl border border-border bg-card p-4 transition-colors duration-150 hover:border-accent"
                  >
                    <div className="flex items-start gap-2">
                      <LocationPinIcon className="mt-0.5 shrink-0 text-accent" />
                      <div className="min-w-0">
                        <p className="font-bold text-ink">
                          {nucleo.name}
                          {nucleoFlag && <span className="ml-2">{nucleoFlag}</span>}
                        </p>
                        {nucleo.address && <p className="mt-1 text-sm text-text-secondary">{nucleo.address}</p>}
                        <p className="mt-0.5 text-xs text-text-muted">
                          {[nucleo.city, nucleo.country].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                    {sortedSchedules.length > 0 && (
                      <div className="mt-3 space-y-1 border-t border-border pt-3">
                        {sortedSchedules.map((s, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-text-secondary">
                              {dayShort[s.dayOfWeek] ?? s.dayOfWeek}
                            </span>
                            <span className="text-text-secondary">{s.startTime} - {s.endTime}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">{t('noNucleos')}</p>
          )}
        </div>
      </div>
    </main>
  )
}
