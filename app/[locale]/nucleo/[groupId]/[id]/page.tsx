import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getNucleoById, getNucleoMembers, getGraduationLevels, getEducatorProfile } from '@/lib/queries'
import CordaVisual from '@/components/public/CordaVisual'
import Image from 'next/image'
import { getLanguageAlternates, getLocalizedUrl, getOgImageUrl, buildLocalBusinessSchema, buildBreadcrumbSchema } from '@/lib/site'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; groupId: string; id: string }>
}

const DAY_LABELS: Record<string, Record<number, string>> = {
  es: { 0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb' },
  pt: { 0: 'Dom', 1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex', 6: 'Sáb' },
  en: { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' },
}

function getDay(locale: string, day: number) {
  return (DAY_LABELS[locale] ?? DAY_LABELS.en)[day] ?? day.toString()
}

const NUCLEO_NOT_FOUND = {
  es: 'Núcleo no encontrado',
  pt: 'Núcleo não encontrado',
  en: 'Nucleo not found',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { groupId, id, locale } = await params
  const nucleo = await getNucleoById(groupId, id)
  if (!nucleo) return { title: NUCLEO_NOT_FOUND[locale as keyof typeof NUCLEO_NOT_FOUND] ?? NUCLEO_NOT_FOUND.en }

  const location = [nucleo.city, nucleo.country].filter(Boolean).join(', ')
  const title = `${nucleo.name}${location ? ` — ${location}` : ''} — Capoeira`

  const descMap: Record<string, string> = {
    es: `Clases de capoeira en ${location || nucleo.name}. Núcleo del grupo ${nucleo.groupName}. Encuentra horarios, educadores y dirección.`,
    pt: `Aulas de capoeira em ${location || nucleo.name}. Núcleo do grupo ${nucleo.groupName}. Encontre horários, educadores e endereço.`,
    en: `Capoeira classes in ${location || nucleo.name}. Nucleo of the ${nucleo.groupName} group. Find schedules, educators, and address.`,
  }
  const description = descMap[locale] ?? descMap.en
  const path = `/nucleo/${groupId}/${id}`
  const ogImage = getOgImageUrl({ title: nucleo.name, sub: description.slice(0, 90), type: 'nucleo' })

  return {
    title,
    description,
    alternates: {
      canonical: getLocalizedUrl(locale, path),
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: getLocalizedUrl(locale, path),
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: nucleo.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function NucleoPage({ params }: Props) {
  const { locale, groupId, id } = await params
  const t = await getTranslations({ locale, namespace: 'profile' })

  const nucleo = await getNucleoById(groupId, id)
  if (!nucleo) notFound()

  const [members, graduationLevels, responsibleEducator] = await Promise.all([
    getNucleoMembers(nucleo.id).catch(() => []),
    getGraduationLevels(groupId).catch(() => []),
    nucleo.responsibleEducatorId
      ? getEducatorProfile(nucleo.responsibleEducatorId).catch(() => null)
      : Promise.resolve(null),
  ])

  const coEducatorProfiles = await Promise.all(
    (nucleo.coEducatorIds ?? []).map((uid) => getEducatorProfile(uid).catch(() => null))
  ).then((list) => list.filter((e): e is NonNullable<typeof e> => e !== null))

  const gradLevelById = new Map(graduationLevels.map((l) => [l.id, l]))

  const hasMap = typeof nucleo.latitude === 'number' && typeof nucleo.longitude === 'number'
  const mapEmbedUrl = hasMap
    ? `https://maps.google.com/maps?q=${nucleo.latitude},${nucleo.longitude}&z=15&output=embed`
    : null

  const localBusinessSchema = buildLocalBusinessSchema({
    name: nucleo.name,
    url: getLocalizedUrl(locale, `/nucleo/${groupId}/${id}`),
    address: nucleo.address,
    city: nucleo.city,
    country: nucleo.country,
    latitude: nucleo.latitude ?? undefined,
    longitude: nucleo.longitude ?? undefined,
    schedules: nucleo.schedules,
    educatorName: responsibleEducator
      ? (responsibleEducator.nickname || `${responsibleEducator.name} ${responsibleEducator.surname}`)
      : undefined,
  })
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Capoeira Map', url: getLocalizedUrl(locale) },
    { name: nucleo.groupName, url: getLocalizedUrl(locale, `/group/${groupId}`) },
    { name: nucleo.name, url: getLocalizedUrl(locale, `/nucleo/${groupId}/${id}`) },
  ])

  return (
    <div className="relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_top,rgba(102,187,106,0.10),transparent_70%)] pointer-events-none"
      />

      <main className="relative mx-auto max-w-[900px] px-5 py-10 sm:px-8 lg:px-12">
        <Link
          href={`/${locale}/group/${groupId}`}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 text-sm text-text-muted transition-all hover:border-border/80 hover:text-text"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </Link>

        {/* Header */}
        <section className="rounded-[28px] border border-border bg-card/40 p-6 sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
            {nucleo.groupName}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {nucleo.name}
          </h1>
          {(nucleo.city || nucleo.country) && (
            <p className="mt-2 text-base text-text-secondary">
              {[nucleo.city, nucleo.country].filter(Boolean).join(', ')}
            </p>
          )}
          {nucleo.address && (
            <div className="mt-4 flex items-start gap-2 text-sm text-text-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-text-muted">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span>{nucleo.address}</span>
            </div>
          )}
        </section>

        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
          {/* Left column */}
          <div className="flex-1 space-y-6">
            {/* Schedules */}
            {nucleo.schedules && nucleo.schedules.length > 0 && (
              <section className="rounded-[22px] border border-border bg-card/40 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{t('schedules')}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {nucleo.schedules.map((s, i) => (
                    <span key={i} className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary">
                      {getDay(locale, s.dayOfWeek)} · {s.startTime}–{s.endTime}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Map embed */}
            {mapEmbedUrl && (
              <section className="overflow-hidden rounded-[22px] border border-border">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="320"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={nucleo.name}
                />
              </section>
            )}

            {/* Members */}
            <section>
              <h2 className="text-lg font-semibold text-text">
                {t('members')} ({members.length})
              </h2>
              {members.length === 0 ? (
                <p className="mt-3 text-sm text-text-muted">{t('noMembers')}</p>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  {members.map((member) => {
                    const gradLevel = member.graduationLevelId
                      ? gradLevelById.get(member.graduationLevelId)
                      : undefined
                    return (
                      <Link
                        key={member.uid}
                        href={member.role === 'educator' ? `/${locale}/educator/${member.uid}` : '#'}
                        className="flex items-center gap-3 rounded-[16px] border border-border bg-card/30 px-4 py-3 transition-colors hover:border-accent/30"
                      >
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-card">
                          {member.avatarUrl ? (
                            <Image
                              src={member.avatarUrl}
                              alt={member.nickname || member.name || 'Member'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-text-muted">
                              {member.name?.[0] ?? '?'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-text">
                            {member.nickname || `${member.name} ${member.surname}`}
                          </p>
                          {gradLevel ? (
                            <div className="mt-1 flex items-center gap-2">
                              <CordaVisual
                                colors={gradLevel.colors}
                                tipColorLeft={gradLevel.tipColorLeft}
                                tipColorRight={gradLevel.tipColorRight}
                                width={48}
                                height={8}
                              />
                              <span className="truncate text-[10px] text-text-muted">{gradLevel.name}</span>
                            </div>
                          ) : null}
                        </div>
                        {member.role === 'educator' && (
                          <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent">
                            EDU
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-5 md:w-[260px] md:shrink-0">
            {/* Responsible educator */}
            {responsibleEducator && (
              <section className="rounded-[22px] border border-border bg-card/40 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{t('responsibleEducator')}</p>
                <div className="mt-4 flex flex-col items-center text-center">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-accent/30 bg-card">
                    {responsibleEducator.avatarUrl ? (
                      <Image
                        src={responsibleEducator.avatarUrl}
                        alt={responsibleEducator.nickname || responsibleEducator.name || 'Educator'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-bold text-text-muted">
                        {responsibleEducator.name?.[0] ?? '?'}
                      </div>
                    )}
                  </div>
                  <p className="mt-3 font-semibold text-text">
                    {responsibleEducator.nickname || `${responsibleEducator.name} ${responsibleEducator.surname}`}
                  </p>
                  {responsibleEducator.graduationLevelId && gradLevelById.get(responsibleEducator.graduationLevelId) && (
                    <div className="mt-2 flex items-center gap-2">
                      <CordaVisual
                        colors={gradLevelById.get(responsibleEducator.graduationLevelId)!.colors}
                        tipColorLeft={gradLevelById.get(responsibleEducator.graduationLevelId)!.tipColorLeft}
                        tipColorRight={gradLevelById.get(responsibleEducator.graduationLevelId)!.tipColorRight}
                        width={64}
                        height={10}
                      />
                      <span className="text-xs text-text-secondary">{gradLevelById.get(responsibleEducator.graduationLevelId)!.name}</span>
                    </div>
                  )}
                  <Link
                    href={`/${locale}/educator/${responsibleEducator.uid}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-border bg-surface px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary transition-colors hover:border-accent/30 hover:text-text"
                  >
                    {t('viewProfile')}
                  </Link>
                </div>
              </section>
            )}

            {/* Co-educators */}
            {coEducatorProfiles.length > 0 && (
              <section className="rounded-[22px] border border-border bg-card/40 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{t('coEducators')}</p>
                <div className="mt-4 flex flex-col gap-3">
                  {coEducatorProfiles.map((edu) => {
                    const gradLevel = edu.graduationLevelId ? gradLevelById.get(edu.graduationLevelId) : undefined
                    return (
                      <Link
                        key={edu.uid}
                        href={`/${locale}/educator/${edu.uid}`}
                        className="flex items-center gap-3 rounded-[14px] border border-border bg-surface px-3 py-2.5 transition-colors hover:border-accent/30"
                      >
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-card">
                          {edu.avatarUrl ? (
                            <Image
                              src={edu.avatarUrl}
                              alt={edu.nickname || edu.name || 'Co-educator'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-text-muted">
                              {edu.name?.[0] ?? '?'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-text">
                            {edu.nickname || `${edu.name} ${edu.surname}`}
                          </p>
                          {gradLevel && (
                            <div className="mt-0.5 flex items-center gap-1.5">
                              <CordaVisual
                                colors={gradLevel.colors}
                                tipColorLeft={gradLevel.tipColorLeft}
                                tipColorRight={gradLevel.tipColorRight}
                                width={36}
                                height={7}
                              />
                              <span className="truncate text-[9px] text-text-muted">{gradLevel.name}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Group link */}
            <Link
              href={`/${locale}/group/${groupId}`}
              className="flex items-center justify-between rounded-[22px] border border-border bg-card/40 px-5 py-4 transition-colors hover:border-accent/30"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">{t('group')}</p>
                <p className="mt-1 text-sm font-semibold text-text">{nucleo.groupName}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
