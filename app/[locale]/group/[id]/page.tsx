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
    <div className={`flex items-center gap-3 py-2.5 ${!isLast ? 'border-b border-border/50' : ''}`}>
      <CordaVisual
        colors={level.colors}
        tipColorLeft={level.tipColorLeft}
        tipColorRight={level.tipColorRight}
        width={80}
        height={12}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text">{level.name}</p>
        {level.description ? (
          <p className="text-[10px] italic text-text-muted">{level.description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 gap-1">
        {level.isEstagiario && (
          <span className="rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide bg-accent/20 text-accent">ESTAG.</span>
        )}
        {level.isSpecial && !level.isEstagiario && (
          <span className="rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide bg-[#A78BFA]/20 text-[#A78BFA]">ESPEC.</span>
        )}
        {isEduc && (
          <span className="rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide bg-accent/15 text-accent">EDUC.</span>
        )}
      </div>
    </div>
  )
}

function GradSection({ label, levels, threshold }: { label: string; levels: GraduationLevel[]; threshold: number }) {
  if (levels.length === 0) return null
  return (
    <div className="mt-3">
      <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-text-muted opacity-70">{label}</p>
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
    <section className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
          {title}
        </p>
        <span className="text-[10px] text-text-muted">({levels.length})</span>
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
      <div className="page-shell relative py-10">
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
          <div className="relative grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
            <div className="flex justify-center lg:justify-start">
              <div className="relative h-[170px] w-[170px] overflow-hidden rounded-[30px] border border-border bg-surface shadow-[0_22px_60px_var(--shadow-soft)]">
                {group.logoUrl ? (
                  <Image
                    src={group.logoUrl}
                    alt={group.name}
                    fill
                    sizes="170px"
                    priority
                    className="object-contain p-5"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-text-muted">
                    {group.name?.[0] ?? '?'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h1 className="mt-4 text-[clamp(34px,5vw,60px)] font-semibold leading-[0.96] tracking-[-0.06em] text-text">
                {group.name}
              </h1>
              <div className="mt-6 flex flex-wrap gap-2">
                {graduationSystem ? (
                  <Badge variant="accent">{t('graduationSystem') + ': ' + graduationSystem}</Badge>
                ) : null}
                {group.memberCount ? <Badge>{`${group.memberCount} ${t('members')}`}</Badge> : null}
                {group.representedCountries?.length ? (
                  <Badge>{`${group.representedCountries.length} ${t('representedCountries')}`}</Badge>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_390px]">
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

            <div className="mt-6 grid gap-4 2xl:grid-cols-2">
              {nucleos.length > 0 ? (
                nucleos.map((nucleo) => (
                  <NucleoListItem key={nucleo.id} nucleo={nucleo} isActive={false} showGroupLink={false} />
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
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
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

            {graduationLevels.length > 0 ? (
              <GraduationSystemSection
                levels={graduationLevels}
                title={graduationSystem ?? t('graduation')}
              />
            ) : null}

            {adminUser ? (
              <section className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                  {t('admin')}
                </p>
                <div className="mt-5 text-center">
                  <div className="relative mx-auto h-[84px] w-[84px] overflow-hidden rounded-full border border-accent/20 bg-surface">
                    {adminUser.avatarUrl ? (
                      <Image
                        src={adminUser.avatarUrl}
                        alt={adminUser.nickname || adminUser.name || 'Admin'}
                        fill
                        sizes="84px"
                        className="object-cover"
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
                  {adminUser.graduationLevelId && gradLevelById.get(adminUser.graduationLevelId) ? (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <CordaVisual
                        colors={gradLevelById.get(adminUser.graduationLevelId)!.colors}
                        tipColorLeft={gradLevelById.get(adminUser.graduationLevelId)!.tipColorLeft}
                        tipColorRight={gradLevelById.get(adminUser.graduationLevelId)!.tipColorRight}
                        width={64}
                        height={10}
                      />
                      <span className="text-xs text-text-secondary">{gradLevelById.get(adminUser.graduationLevelId)!.name}</span>
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

            {educators.length > 0 && (
              <section className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                  {t('educators')} ({educators.length})
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {educators.map((edu) => {
                    const gradLevel = edu.graduationLevelId ? gradLevelById.get(edu.graduationLevelId) : undefined
                    return (
                      <Link
                        key={edu.uid}
                        href={`/${locale}/educator/${edu.uid}`}
                        className="flex items-center gap-3 rounded-[18px] border border-border bg-surface px-3 py-3 transition-colors hover:border-accent/30"
                      >
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-card">
                          {edu.avatarUrl ? (
                            <Image
                              src={edu.avatarUrl}
                              alt={edu.nickname || edu.name || 'Educator'}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-text-muted">
                              {edu.name?.[0] ?? '?'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-text">
                            {edu.nickname || `${edu.name} ${edu.surname}`}
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-text-muted">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            <AdDisplay />
          </aside>
        </div>
      </div>
    </div>
  )
}
