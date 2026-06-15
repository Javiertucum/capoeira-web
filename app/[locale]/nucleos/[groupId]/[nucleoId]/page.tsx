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
  buildLocalBusinessSchema,
  buildBreadcrumbSchema,
} from '@/lib/site'
import { getNucleoById, getGroup, getEducatorProfile, getNucleoMembers } from '@/lib/queries'
import { flagForCountry } from '@/lib/country-flags'
import ProfileCard, { LocationPinIcon } from '@/components/public/ProfileCard'
import Avatar from '@/components/public/Avatar'

type Props = Readonly<{ params: Promise<{ locale: string; groupId: string; nucleoId: string }> }>

const DAY_SHORT = {
  es: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
  pt: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sá'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
} as const

function getDayShort(locale: string) {
  return DAY_SHORT[locale as keyof typeof DAY_SHORT] ?? DAY_SHORT.en
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, groupId, nucleoId } = await params
  const nucleo = await getNucleoById(groupId, nucleoId)
  if (!nucleo) return {}

  const path = `/nucleos/${groupId}/${nucleoId}`
  const sub = [nucleo.city, nucleo.country].filter(Boolean).join(', ')
  return {
    title: nucleo.name,
    description: nucleo.address ?? sub,
    alternates: { canonical: getLocalizedPath(locale, path), languages: getLanguageAlternates(path) },
    openGraph: {
      title: formatPageTitle(nucleo.name),
      description: nucleo.address ?? sub,
      url: getLocalizedPath(locale, path),
      type: 'website',
      images: [getOgImageUrl({ title: nucleo.name, sub: nucleo.groupName, type: 'nucleo' })],
    },
  }
}

export default async function NucleoProfilePage({ params }: Props) {
  const { locale, groupId, nucleoId } = await params
  const t = await getTranslations('profile')

  const nucleo = await getNucleoById(groupId, nucleoId)
  if (!nucleo) notFound()

  const [group, responsibleEducator, coEducators, members] = await Promise.all([
    getGroup(groupId),
    nucleo.responsibleEducatorId ? getEducatorProfile(nucleo.responsibleEducatorId) : Promise.resolve(null),
    Promise.all((nucleo.coEducatorIds ?? []).map((uid) => getEducatorProfile(uid))),
    getNucleoMembers(nucleoId),
  ])

  const dayShort = getDayShort(locale)
  const sortedSchedules = [...(nucleo.schedules ?? [])].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
  const nucleoFlag = flagForCountry(nucleo.country)

  const localBusinessSchema = buildLocalBusinessSchema({
    name: nucleo.name,
    url: getLocalizedUrl(locale, `/nucleos/${groupId}/${nucleoId}`),
    description: group?.description ?? undefined,
    address: nucleo.address,
    city: nucleo.city,
    country: nucleo.country,
    latitude: nucleo.latitude ?? undefined,
    longitude: nucleo.longitude ?? undefined,
    schedules: nucleo.schedules,
    educatorName: responsibleEducator ? `${responsibleEducator.name} ${responsibleEducator.surname}` : undefined,
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Agenda Capoeiragem', url: getLocalizedUrl(locale) },
    { name: t('viewNucleo'), url: getLocalizedUrl(locale, '/#directorio') },
    { name: nucleo.name, url: getLocalizedUrl(locale, `/nucleos/${groupId}/${nucleoId}`) },
  ])

  const validCoEducators = coEducators.filter((e): e is NonNullable<typeof e> => Boolean(e))

  return (
    <main className="min-h-screen bg-bg py-16 lg:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="page-shell-narrow">
        <Link href={`/${locale}/#directorio`} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-accent-ink hover:underline">
          ← {t('back')}
        </Link>

        {/* Profile card */}
        <ProfileCard>
          <div className="flex items-start gap-3">
            <LocationPinIcon className="mt-1 h-7 w-7 shrink-0 text-accent" />
            <div>
              <h1 className="font-black text-ink leading-[1.05] tracking-[-0.02em]" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
                {nucleo.name}
                {nucleoFlag && <span className="ml-2 align-middle">{nucleoFlag}</span>}
              </h1>
              {group && (
                <Link
                  href={`/${locale}/grupos/${groupId}`}
                  className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 transition-colors duration-150 hover:border-accent"
                >
                  {group.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={group.logoUrl} alt={group.name} className="h-6 w-6 shrink-0 rounded-full border border-border object-cover" />
                  ) : (
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border bg-card text-xs font-bold text-text-secondary">
                      {group.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                  <span className="text-sm font-bold text-ink">{group.name}</span>
                </Link>
              )}
            </div>
          </div>

          {nucleo.address && <p className="mt-6 text-base text-text-secondary">{nucleo.address}</p>}
          <p className="mt-1 text-sm text-text-muted">{[nucleo.city, nucleo.country].filter(Boolean).join(', ') || t('unspecified')}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-bold text-text-secondary">
            <span className="rounded-full border border-border bg-surface px-4 py-2">
              <span className="text-ink">{members.length}</span> {t('members').toLowerCase()}
            </span>
          </div>
        </ProfileCard>

        {/* Schedules */}
        {sortedSchedules.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('schedules')}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {sortedSchedules.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-text-secondary">
                    {dayShort[s.dayOfWeek] ?? s.dayOfWeek}
                  </span>
                  <span className="text-sm text-text-secondary">{s.startTime} – {s.endTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Responsible educator */}
        {responsibleEducator && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('responsibleEducator')}</p>
            <Link
              href={`/${locale}/educadores/${responsibleEducator.uid}`}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-colors duration-150 hover:border-accent"
            >
              <Avatar name={responsibleEducator.name} surname={responsibleEducator.surname} avatarUrl={responsibleEducator.avatarUrl} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink">
                  {responsibleEducator.name} {responsibleEducator.surname}
                  {flagForCountry(responsibleEducator.country) && <span className="ml-2">{flagForCountry(responsibleEducator.country)}</span>}
                </p>
                {responsibleEducator.bio && <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{responsibleEducator.bio}</p>}
              </div>
            </Link>
          </div>
        )}

        {/* Co-educators */}
        {validCoEducators.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('coEducators')}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {validCoEducators.map((educator) => (
                <Link
                  key={educator.uid}
                  href={`/${locale}/educadores/${educator.uid}`}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors duration-150 hover:border-accent"
                >
                  <Avatar name={educator.name} surname={educator.surname} avatarUrl={educator.avatarUrl} size="sm" />
                  <p className="font-bold text-ink">
                    {educator.name} {educator.surname}
                    {flagForCountry(educator.country) && <span className="ml-2">{flagForCountry(educator.country)}</span>}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
