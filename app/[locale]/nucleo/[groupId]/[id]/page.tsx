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

      <div className="page-shell relative py-12">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="berimbau-dot" />
                <span className="eyebrow acc">{groupName} · {nucleo.country}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(44px, 6vw, 84px)', lineHeight: 0.9, letterSpacing: '-0.05em' }}>
                {nucleo.name}
              </h1>
              {nucleo.address && (
                <p className="mt-6 flex items-center gap-2.5 text-[19px] font-medium text-ink-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-ink">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  {nucleo.address}
                </p>
              )}
            </div>
            
            <div className="flex gap-4">
              <Link href={`/${locale}/group/${groupId}`} className="btn btn-ghost">
                {t('group')}
              </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          {/* ── Main Column ── */}
          <div className="space-y-12">
            {/* Schedules */}
            {nucleo.schedules && nucleo.schedules.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-ink">{t('schedules')}</h2>
                  <div className="h-px flex-1 bg-line/60" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {nucleo.schedules.map((schedule, index) => (
                    <div key={index} className="card-paper flex items-center gap-4 px-6 py-4" style={{ borderRadius: 'var(--radius-lg)' }}>
                      <div className="mono text-[11px] font-black uppercase tracking-widest text-accent-ink">
                        {getDay(locale, schedule.dayOfWeek)}
                      </div>
                      <div className="h-4 w-px bg-line" />
                      <div className="text-[15px] font-bold text-ink">
                        {schedule.startTime} — {schedule.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Members / Educators */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-ink">{t('members')}</h2>
                <div className="h-px flex-1 bg-line/60" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {members.map((member) => {
                  const gradLevel = member.graduationLevelId ? gradLevelById.get(member.graduationLevelId) : undefined
                  const content = (
                    <div className="flex items-center gap-4 p-4">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[14px] border border-line bg-surface">
                        {member.avatarUrl ? (
                          <Image src={member.avatarUrl} alt={member.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-ink-4">{member.name?.[0]}</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-bold text-ink">{member.nickname || `${member.name} ${member.surname}`}</p>
                        {gradLevel && (
                          <div className="mt-1 flex items-center gap-2">
                            <CordaVisual colors={gradLevel.colors} tipColorLeft={gradLevel.tipColorLeft} tipColorRight={gradLevel.tipColorRight} width={48} height={8} />
                            <span className="text-[10px] uppercase tracking-wider text-ink-3">{gradLevel.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )

                  return member.role === 'educator' ? (
                    <Link key={member.uid} href={`/${locale}/educator/${member.uid}`} className="card transition-all hover:shadow-md" style={{ borderRadius: 'var(--radius-lg)' }}>
                      {content}
                    </Link>
                  ) : (
                    <div key={member.uid} className="card-paper" style={{ borderRadius: 'var(--radius-lg)' }}>
                      {content}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-10">
            {responsibleEducator && (
              <section className="card p-6" style={{ borderRadius: 'var(--radius-xl)' }}>
                <p className="mono mb-6 text-[10px] uppercase tracking-[0.2em] text-ink-3">{t('responsibleEducator')}</p>
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border border-line bg-surface shadow-sm">
                    {responsibleEducator.avatarUrl ? (
                      <Image src={responsibleEducator.avatarUrl} alt={responsibleName || ''} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-black text-ink-3">{responsibleEducator.name?.[0]}</div>
                    )}
                  </div>
                  <h3 className="mt-5 text-[20px] font-black text-ink">{responsibleName}</h3>
                  <Link href={`/${locale}/educator/${responsibleEducator.uid}`} className="btn btn-ghost mt-6 w-full">{t('viewProfile')}</Link>
                </div>
              </section>
            )}

            {mapEmbedUrl && (
              <section className="overflow-hidden rounded-[32px] border border-line bg-surface shadow-sm">
                <iframe src={mapEmbedUrl} width="100%" height="320" style={{ border: 0 }} allowFullScreen loading="lazy" />
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
        </div>
      </div>
    </div>
  )
}
