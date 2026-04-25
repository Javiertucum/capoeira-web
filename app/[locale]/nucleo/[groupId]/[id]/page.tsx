import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import {
  getNucleoById,
  getNucleoMembers,
  getGraduationLevels,
  getEducatorProfile,
  getGroup,
} from '@/lib/queries'
import CordaVisual from '@/components/public/CordaVisual'
import {
  getLanguageAlternates,
  getLocalizedUrl,
  getOgImageUrl,
  buildLocalBusinessSchema,
  buildBreadcrumbSchema,
} from '@/lib/site'

export const revalidate = 300

type Props = {
  params: Promise<{ locale: string; groupId: string; id: string }>
}

const DAY_LABELS: Record<string, Record<number, string>> = {
  es: { 0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mie', 4: 'Jue', 5: 'Vie', 6: 'Sab' },
  pt: { 0: 'Dom', 1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex', 6: 'Sab' },
  en: { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' },
}

function getDay(locale: string, day: number) {
  return (DAY_LABELS[locale] ?? DAY_LABELS.en)[day] ?? day.toString()
}

const NUCLEO_NOT_FOUND = {
  es: 'Nucleo no encontrado',
  pt: 'Nucleo nao encontrado',
  en: 'Nucleo not found',
} as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { groupId, id, locale } = await params
  const nucleo = await getNucleoById(groupId, id)

  if (!nucleo) {
    return { title: NUCLEO_NOT_FOUND[locale as keyof typeof NUCLEO_NOT_FOUND] ?? NUCLEO_NOT_FOUND.en }
  }

  const location = [nucleo.city, nucleo.country].filter(Boolean).join(', ')
  const title = `${nucleo.name}${location ? ` - ${location}` : ''} - Capoeira`

  const descMap: Record<string, string> = {
    es: `Clases de capoeira en ${location || nucleo.name}. Nucleo del grupo ${nucleo.groupName}. Encuentra horarios, educadores y direccion.`,
    pt: `Aulas de capoeira em ${location || nucleo.name}. Nucleo do grupo ${nucleo.groupName}. Encontre horarios, educadores e endereco.`,
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

  const [members, graduationLevels, responsibleEducator, group] = await Promise.all([
    getNucleoMembers(nucleo.id).catch(() => []),
    getGraduationLevels(groupId).catch(() => []),
    nucleo.responsibleEducatorId
      ? getEducatorProfile(nucleo.responsibleEducatorId).catch(() => null)
      : Promise.resolve(null),
    getGroup(groupId).catch(() => null),
  ])

  const coEducatorProfiles = await Promise.all(
    (nucleo.coEducatorIds ?? []).map((uid) => getEducatorProfile(uid).catch(() => null))
  ).then((list) => list.filter((item): item is NonNullable<typeof item> => item !== null))

  const gradLevelById = new Map(graduationLevels.map((level) => [level.id, level]))
  const hasMap = typeof nucleo.latitude === 'number' && typeof nucleo.longitude === 'number'
  const mapEmbedUrl = hasMap
    ? `https://maps.google.com/maps?q=${nucleo.latitude},${nucleo.longitude}&z=15&output=embed`
    : null

  const responsibleName = responsibleEducator
    ? responsibleEducator.nickname || `${responsibleEducator.name} ${responsibleEducator.surname}`
    : null
  const groupName = group?.name ?? nucleo.groupName

  const localBusinessSchema = buildLocalBusinessSchema({
    name: nucleo.name,
    url: getLocalizedUrl(locale, `/nucleo/${groupId}/${id}`),
    address: nucleo.address,
    city: nucleo.city,
    country: nucleo.country,
    latitude: nucleo.latitude ?? undefined,
    longitude: nucleo.longitude ?? undefined,
    schedules: nucleo.schedules,
    educatorName: responsibleName ?? undefined,
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Capoeira Map', url: getLocalizedUrl(locale) },
    { name: nucleo.groupName, url: getLocalizedUrl(locale, `/group/${groupId}`) },
    { name: nucleo.name, url: getLocalizedUrl(locale, `/nucleo/${groupId}/${id}`) },
  ])

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="page-shell relative py-10">
        <Link
          href={`/${locale}/group/${groupId}`}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-text-muted transition-colors hover:text-text"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </Link>

        <section className="rounded-[22px] border border-border bg-card p-6 sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
            {groupName}
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mt-0.5 shrink-0 text-text-muted"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{nucleo.address}</span>
            </div>
          )}
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_390px] 2xl:grid-cols-[minmax(0,1.08fr)_420px] xl:items-start">
          <div className="space-y-6">
            {responsibleEducator ? (
              <section className="rounded-[22px] border border-border bg-card p-6 sm:p-8">
                <div className="grid gap-6 2xl:grid-cols-[260px_minmax(0,1fr)]">
                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-border bg-surface-muted px-5 py-5 text-center">
                      <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-border bg-card shadow-lg xl:h-40 xl:w-40">
                        {responsibleEducator.avatarUrl ? (
                          <Image
                            src={responsibleEducator.avatarUrl}
                            alt={responsibleName ?? 'Educator'}
                            fill
                            sizes="(min-width: 1280px) 160px, 128px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-surface-muted text-3xl font-bold text-text-muted">
                            {responsibleEducator.name?.[0] ?? '?'}
                          </div>
                        )}
                      </div>
                      <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                        {t('responsibleEducator')}
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-text">{responsibleName}</h2>
                      {responsibleEducator.graduationLevelId &&
                      gradLevelById.get(responsibleEducator.graduationLevelId) ? (
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <CordaVisual
                            colors={gradLevelById.get(responsibleEducator.graduationLevelId)!.colors}
                            tipColorLeft={gradLevelById.get(responsibleEducator.graduationLevelId)!.tipColorLeft}
                            tipColorRight={gradLevelById.get(responsibleEducator.graduationLevelId)!.tipColorRight}
                            width={64}
                            height={10}
                          />
                          <span className="text-xs text-text-secondary">
                            {gradLevelById.get(responsibleEducator.graduationLevelId)!.name}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {group ? (
                      <Link
                        href={`/${locale}/group/${groupId}`}
                        className="flex items-center gap-4 rounded-[24px] border border-border bg-surface-muted px-4 py-4 transition-colors hover:border-text/20"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[18px] border border-border bg-surface">
                          {group.logoUrl ? (
                            <Image
                              src={group.logoUrl}
                              alt={group.name}
                              fill
                              sizes="64px"
                              className="object-contain p-2"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-text-muted">
                              {group.name?.[0] ?? '?'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-muted">
                            {t('group')}
                          </p>
                          <p className="mt-1 truncate text-sm font-semibold text-text">{group.name}</p>
                        </div>
                      </Link>
                    ) : null}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
                        {t('contact')}
                      </h3>
                      {responsibleEducator.socialLinks ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {responsibleEducator.socialLinks.whatsapp ? (
                            <a
                              href={`https://wa.me/${responsibleEducator.socialLinks.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, vi el nucleo "${nucleo.name}" en Agenda Capoeiragem y me gustaria saber mas.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 rounded-[14px] border border-border bg-surface-muted px-4 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-[#25D366]/40 hover:bg-[#25D366]/5 hover:text-text"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                              WhatsApp
                            </a>
                          ) : null}
                          {responsibleEducator.socialLinks.instagram ? (
                            <a
                              href={`https://instagram.com/${responsibleEducator.socialLinks.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 rounded-[14px] border border-border bg-surface-muted px-4 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-[#E4405F]/40 hover:bg-[#E4405F]/5 hover:text-text"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" /></svg>
                              Instagram
                            </a>
                          ) : null}
                          {responsibleEducator.socialLinks.facebook ? (
                            <a
                              href={`https://facebook.com/${responsibleEducator.socialLinks.facebook.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 rounded-[14px] border border-border bg-surface-muted px-4 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-[#1877F2]/40 hover:bg-[#1877F2]/5 hover:text-text"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                              Facebook
                            </a>
                          ) : null}
                          {responsibleEducator.socialLinks.youtube ? (
                            <a
                              href={`https://youtube.com/@${responsibleEducator.socialLinks.youtube.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 rounded-[14px] border border-border bg-surface-muted px-4 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-[#FF0000]/40 hover:bg-[#FF0000]/5 hover:text-text"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
                              YouTube
                            </a>
                          ) : null}
                          {responsibleEducator.socialLinks.tiktok ? (
                            <a
                              href={`https://tiktok.com/@${responsibleEducator.socialLinks.tiktok.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 rounded-[14px] border border-border bg-surface-muted px-4 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-border hover:text-text"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" /></svg>
                              TikTok
                            </a>
                          ) : null}
                          {responsibleEducator.socialLinks.website ? (
                            <a
                              href={
                                responsibleEducator.socialLinks.website.startsWith('http')
                                  ? responsibleEducator.socialLinks.website
                                  : `https://${responsibleEducator.socialLinks.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 rounded-[14px] border border-border bg-surface-muted px-4 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-text/20 hover:text-text"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                              {t('website')}
                            </a>
                          ) : null}
                        </div>
                      ) : (
                        <p className="text-sm italic text-text-muted">{t('unspecified')}</p>
                      )}
                    </div>

                    <Link
                      href={`/${locale}/educator/${responsibleEducator.uid}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-widest text-text-secondary transition-colors hover:text-text"
                    >
                      {t('viewProfile')}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </section>
            ) : null}

            {coEducatorProfiles.length > 0 ? (
              <section className="rounded-[22px] border border-border bg-card p-5">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                  {t('coEducators')}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {coEducatorProfiles.map((educator) => {
                    const gradLevel = educator.graduationLevelId
                      ? gradLevelById.get(educator.graduationLevelId)
                      : undefined

                    return (
                      <Link
                        key={educator.uid}
                        href={`/${locale}/educator/${educator.uid}`}
                        className="flex items-center gap-3 rounded-[18px] border border-border bg-surface-muted px-3 py-3 transition-colors hover:border-text/20"
                      >
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-card">
                          {educator.avatarUrl ? (
                            <Image
                              src={educator.avatarUrl}
                              alt={educator.nickname || educator.name || 'Co-educator'}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-text-muted">
                              {educator.name?.[0] ?? '?'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-text">
                            {educator.nickname || `${educator.name} ${educator.surname}`}
                          </p>
                          {gradLevel ? (
                            <div className="mt-1 flex items-center gap-1.5">
                              <CordaVisual
                                colors={gradLevel.colors}
                                tipColorLeft={gradLevel.tipColorLeft}
                                tipColorRight={gradLevel.tipColorRight}
                                width={36}
                                height={7}
                              />
                              <span className="truncate text-[9px] text-text-muted">{gradLevel.name}</span>
                            </div>
                          ) : null}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {nucleo.schedules && nucleo.schedules.length > 0 ? (
              <section className="rounded-[22px] border border-border bg-card p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                  {t('schedules')}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {nucleo.schedules.map((schedule, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-border bg-surface-muted px-3 py-1.5 text-sm font-medium text-text-secondary"
                    >
                      {getDay(locale, schedule.dayOfWeek)} · {schedule.startTime}-{schedule.endTime}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-[22px] border border-border bg-card p-5">
              <div className="flex items-end justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                  {t('members')}
                </p>
                <span className="text-sm text-text-secondary">{members.length}</span>
              </div>

              {members.length === 0 ? (
                <p className="mt-4 text-sm text-text-muted">{t('noMembers')}</p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {members.map((member) => {
                    const gradLevel = member.graduationLevelId
                      ? gradLevelById.get(member.graduationLevelId)
                      : undefined

                    const card = (
                      <>
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-card">
                          {member.avatarUrl ? (
                            <Image
                              src={member.avatarUrl}
                              alt={member.nickname || member.name || 'Member'}
                              fill
                              sizes="40px"
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
                        {member.role === 'educator' ? (
                          <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-ink">
                            EDU
                          </span>
                        ) : null}
                      </>
                    )

                    if (member.role === 'educator') {
                      return (
                        <Link
                          key={member.uid}
                          href={`/${locale}/educator/${member.uid}`}
                          className="flex items-center gap-3 rounded-[18px] border border-border bg-surface-muted px-4 py-3 transition-colors hover:border-text/20"
                        >
                          {card}
                        </Link>
                      )
                    }

                    return (
                      <div
                        key={member.uid}
                        className="flex items-center gap-3 rounded-[18px] border border-border bg-surface px-4 py-3"
                      >
                        {card}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
            {mapEmbedUrl ? (
              <section className="overflow-hidden rounded-[22px] border border-border">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="380"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={nucleo.name}
                />
              </section>
            ) : null}

            <Link
              href={`/${locale}/group/${groupId}`}
              className="flex items-center gap-4 rounded-[22px] border border-border bg-card px-5 py-4 transition-colors hover:border-text/20"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[16px] border border-border bg-surface">
                {group?.logoUrl ? (
                  <Image
                    src={group.logoUrl}
                    alt={group.name}
                    fill
                    sizes="56px"
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-text-muted">
                    {groupName?.[0] ?? '?'}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">{t('group')}</p>
                <p className="mt-1 truncate text-sm font-semibold text-text">{groupName}</p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0 text-text-muted"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
