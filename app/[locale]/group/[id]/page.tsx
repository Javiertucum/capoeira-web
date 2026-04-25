import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import NucleoListItem from '@/components/public/NucleoListItem'
import Badge from '@/components/ui/Badge'
import { getEducatorProfile, getGraduationLevels, getGroupWithNucleos, getGroupEducators } from '@/lib/queries'
import { getLanguageAlternates, getLocalizedUrl, getOgImageUrl, buildSportsOrganizationSchema, buildBreadcrumbSchema } from '@/lib/site'
import CordaVisual from '@/components/public/CordaVisual'
import AdDisplay from '@/components/ads/AdDisplay'
import type { GraduationLevel } from '@/lib/types'

export const revalidate = 300

type Props = {
  params: Promise<{ locale: string; id: string }>
}


const GROUP_NOT_FOUND = {
  es: 'Grupo no encontrado',
  pt: 'Grupo não encontrado',
  en: 'Group not found',
}

const GROUP_DESCRIPTIONS = {
  es: (name: string, count: number, countries: number) =>
    `${name} — grupo de capoeira con ${count} núcleo${count !== 1 ? 's' : ''} activo${count !== 1 ? 's' : ''}${countries > 1 ? ` en ${countries} países` : ''}. Conoce sus educadores, graduaciones y espacios de entrenamiento.`,
  pt: (name: string, count: number, countries: number) =>
    `${name} — grupo de capoeira com ${count} núcleo${count !== 1 ? 's' : ''} ativo${count !== 1 ? 's' : ''}${countries > 1 ? ` em ${countries} países` : ''}. Conheça seus educadores, graduações e espaços de treino.`,
  en: (name: string, count: number, countries: number) =>
    `${name} — capoeira group with ${count} active nucleo${count !== 1 ? 's' : ''}${countries > 1 ? ` in ${countries} countries` : ''}. Meet their educators, graduation system, and training spaces.`,
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params
  const result = await getGroupWithNucleos(id)

  if (!result) return { title: GROUP_NOT_FOUND[locale as keyof typeof GROUP_NOT_FOUND] ?? GROUP_NOT_FOUND.en }

  const path = `/group/${id}`
  const descFn = GROUP_DESCRIPTIONS[locale as keyof typeof GROUP_DESCRIPTIONS] ?? GROUP_DESCRIPTIONS.en
  const countries = result.group.representedCountries?.length ?? 0
  const description = descFn(result.group.name, result.nucleos.length, countries)
  const title = `${result.group.name} — Capoeira`
  const ogImage = getOgImageUrl({ title: result.group.name, sub: description.slice(0, 100), type: 'group' })

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
      images: [{ url: ogImage, width: 1200, height: 630, alt: result.group.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

function GradRow({ level, isLast, threshold }: { level: GraduationLevel; isLast: boolean; threshold: number }) {
  const isEduc =
    ((!level.category || level.category === 'adult') && threshold > 0 && level.order >= threshold) ||
    (!!level.isEstagiario && !!level.isEducator) ||
    (!!level.isSpecial && !!level.isEducator)

  return (
    <div className={`flex items-center gap-3 py-2.5 ${!isLast ? 'border-b border-line/50' : ''}`}>
      <CordaVisual
        colors={level.colors}
        tipColorLeft={level.tipColorLeft}
        tipColorRight={level.tipColorRight}
        width={80}
        height={12}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{level.name}</p>
        {level.description ? (
          <p className="text-[10px] italic text-ink-3">{level.description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 gap-1">
        {level.isEstagiario && (
          <span className="rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide bg-accent-soft text-accent-ink">ESTAG.</span>
        )}
        {level.isSpecial && !level.isEstagiario && (
          <span className="rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide bg-[#A78BFA]/20 text-[#A78BFA]">ESPEC.</span>
        )}
        {isEduc && (
          <span className="rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide bg-accent-soft text-accent-ink">EDUC.</span>
        )}
      </div>
    </div>
  )
}

function GradSection({ label, levels, threshold }: { label: string; levels: GraduationLevel[]; threshold: number }) {
  if (levels.length === 0) return null
  return (
    <div className="mt-3">
      <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-ink-3 opacity-70">{label}</p>
      {levels.map((l, i) => (
        <GradRow key={l.id} level={l} isLast={i === levels.length - 1} threshold={threshold} />
      ))}
    </div>
  )
}

function GraduationSystemSection({ levels, title }: { levels: GraduationLevel[]; title: string }) {
  const adultos    = levels.filter(l => !l.isSpecial && !l.isEstagiario && (!l.category || l.category === 'adult'))
  const juveniles  = levels.filter(l => !l.isSpecial && !l.isEstagiario && l.category === 'juvenil')
  const infantiles = levels.filter(l => !l.isSpecial && !l.isEstagiario && l.category === 'infantil')
  const estagiarios = levels.filter(l => !!l.isEstagiario)
  const especiales  = levels.filter(l => !!l.isSpecial && !l.isEstagiario)

  return (
    <section className="rounded-[22px] border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-3">
          {title}
        </p>
        <span className="text-[10px] text-ink-3">({levels.length})</span>
      </div>
      <div className="mt-2">
        <GradSection label="ADULTOS" levels={adultos} threshold={0} />
        <GradSection label="JUVENILES" levels={juveniles} threshold={0} />
        <GradSection label="INFANTILES" levels={infantiles} threshold={0} />
        <GradSection label="ESTAGIARIOS" levels={estagiarios} threshold={0} />
        <GradSection label="ESPECIALES" levels={especiales} threshold={0} />
      </div>
    </section>
  )
}

export default async function GroupPage({ params }: Props) {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'profile' })

  const data = await getGroupWithNucleos(id).catch(() => null)
  if (!data) {
    notFound()
  }

  const { group, nucleos } = data

  const [adminUser, graduationLevels, educators] = await Promise.all([
    group.adminUserIds?.[0]
      ? getEducatorProfile(group.adminUserIds[0]).catch(() => null)
      : Promise.resolve(null),
    getGraduationLevels(id).catch(() => []),
    getGroupEducators(id).catch(() => []),
  ])

  // Sistema de graduación
  const graduationSystem = group.graduationSystemName

  // Map graduation levels by id for quick lookup
  const gradLevelById = new Map(graduationLevels.map((l) => [l.id, l]))

  const stats = [
    { label: t('members'), value: group.memberCount ?? 0 },
    { label: t('nucleos'), value: nucleos.length },
    { label: t('representedCountries'), value: group.representedCountries?.length ?? 0 },
    { label: t('representedCities'), value: group.representedCities?.length ?? 0 },
    ...(graduationSystem ? [{ label: t('graduationSystem'), value: graduationSystem }] : []),
  ]

  const groupSchema = buildSportsOrganizationSchema({
    name: group.name,
    url: getLocalizedUrl(locale, `/group/${id}`),
    logo: group.logoUrl ?? undefined,
    memberCount: group.memberCount,
    country: group.representedCountries?.[0],
  })
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Capoeira Map', url: getLocalizedUrl(locale) },
    { name: group.name, url: getLocalizedUrl(locale, `/group/${id}`) },
  ])

  return (
    <div className="relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(groupSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="page-shell relative py-12">
        <header className="mb-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="berimbau-dot" />
                <span className="eyebrow acc">{t('group')} · {group.representedCountries?.[0]}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(48px, 6vw, 92px)', lineHeight: 0.9, letterSpacing: '-0.06em' }}>
                {group.name}
              </h1>
            </div>
            {group.logoUrl && (
              <div className="relative h-24 w-24 overflow-hidden rounded-[24px] border border-line bg-white p-3 shadow-sm lg:h-32 lg:w-32">
                <Image src={group.logoUrl} alt={group.name} fill className="object-contain" priority />
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: t('members'), value: group.memberCount?.toLocaleString() ?? '—' },
              { label: t('nucleos'), value: nucleos.length },
              { label: t('educators'), value: educators.length },
              { label: locale === 'en' ? 'Countries' : 'Países', value: group.representedCountries?.length ?? 0 },
            ].map((s) => (
              <div key={s.label} className="card-paper px-6 py-5" style={{ borderRadius: 'var(--radius-lg)' }}>
                <div className="text-[32px] font-black leading-none tracking-tight text-ink" style={{ fontFamily: 'var(--font-display)' }}>
                  {s.value}
                </div>
                <div className="mono mt-2 text-[9px] uppercase tracking-widest text-ink-4">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-12">
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-ink">{t('nucleos')}</h2>
                <div className="h-px flex-1 bg-line/60" />
              </div>

              <div className="grid gap-6 2xl:grid-cols-2">
                {nucleos.length > 0 ? (
                  nucleos.map((nucleo) => (
                    <div key={nucleo.id} className="card p-6 shadow-sm transition-all hover:shadow-md" style={{ borderRadius: 'var(--radius-xl)' }}>
                       <NucleoListItem nucleo={nucleo} isActive={false} showGroupLink={false} />
                    </div>
                  ))
                ) : (
                  <div className="rounded-[32px] border border-dashed border-line bg-surface-muted px-5 py-12 text-center text-sm leading-7 text-ink-3">
                    {t('noNucleos')}
                  </div>
                )}
              </div>
            </section>

            {/* Educators */}
            {educators.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-ink">{t('educators')}</h2>
                  <div className="h-px flex-1 bg-line/60" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {educators.map((edu) => {
                    const gradLevel = edu.graduationLevelId ? gradLevelById.get(edu.graduationLevelId) : undefined
                    return (
                      <Link
                        key={edu.uid}
                        href={`/${locale}/educator/${edu.uid}`}
                        className="card flex items-center gap-4 p-4 transition-all hover:shadow-md"
                        style={{ borderRadius: 'var(--radius-lg)' }}
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[16px] border border-line bg-surface">
                          {edu.avatarUrl ? (
                            <Image src={edu.avatarUrl} alt={edu.nickname || edu.name} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-ink-3">
                              {edu.name?.[0] ?? '?'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[16px] font-bold text-ink">
                            {edu.nickname || `${edu.name} ${edu.surname}`}
                          </p>
                          {gradLevel ? (
                            <div className="mt-2 flex items-center gap-2">
                              <CordaVisual
                                colors={gradLevel.colors}
                                tipColorLeft={gradLevel.tipColorLeft}
                                tipColorRight={gradLevel.tipColorRight}
                                width={56}
                                height={10}
                              />
                              <span className="truncate text-[10px] uppercase tracking-wider text-ink-3">{gradLevel.name}</span>
                            </div>
                          ) : null}
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink-4">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* ── Right side ── */}
          <aside className="space-y-10">
            {graduationLevels.length > 0 ? (
              <GraduationSystemSection
                levels={graduationLevels}
                title={graduationSystem ?? t('graduation')}
              />
            ) : null}

            {adminUser ? (
              <section className="card p-6" style={{ borderRadius: 'var(--radius-xl)' }}>
                <p className="mono mb-6 text-[10px] uppercase tracking-[0.2em] text-ink-3">
                  {t('admin')}
                </p>
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border border-line bg-surface-muted shadow-sm">
                    {adminUser.avatarUrl ? (
                      <Image src={adminUser.avatarUrl} alt={adminUser.nickname || adminUser.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl font-black text-ink-3">{adminUser.name?.[0]}</div>
                    )}
                  </div>
                  <h3 className="mt-5 text-[18px] font-bold text-ink">
                    {adminUser.nickname || `${adminUser.name} ${adminUser.surname}`}
                  </h3>
                  <Link
                    href={`/${locale}/educator/${adminUser.uid}`}
                    className="btn btn-ghost btn-sm mt-6 w-full"
                  >
                    {t('viewProfile')}
                  </Link>
                </div>
              </section>
            ) : null}

            <AdDisplay />
          </aside>
        </div>
      </div>
    </div>
  )
}
