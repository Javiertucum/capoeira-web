import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import {
  formatPageTitle,
  getLanguageAlternates,
  getLocalizedPath,
  getOgImageUrl,
  buildPersonSchema,
  buildBreadcrumbSchema,
  getLocalizedUrl,
} from '@/lib/site'
import { getEducatorProfile, getGroup, getGraduationLevel, getNucleosByEducator } from '@/lib/queries'
import { normalizeSocialLink, getSocialDisplayLabel } from '@/lib/social-links'
import { isoForCountry } from '@/lib/country-flags'
import CountryFlag from '@/components/public/CountryFlag'
import CordaVisual from '@/components/public/CordaVisual'

type Props = Readonly<{ params: Promise<{ locale: string; uid: string }> }>

const SOCIAL_PLATFORMS = ['instagram', 'facebook', 'whatsapp', 'youtube', 'tiktok', 'website'] as const

const DAY_SHORT = {
  es: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
  pt: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sá'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
} as const

function getDayShort(locale: string) {
  return DAY_SHORT[locale as keyof typeof DAY_SHORT] ?? DAY_SHORT.en
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, uid } = await params
  const educator = await getEducatorProfile(uid)
  if (!educator) return {}

  const fullName = `${educator.name} ${educator.surname}`.trim()
  const path = `/educadores/${uid}`
  return {
    title: fullName,
    description: educator.bio ?? undefined,
    alternates: { canonical: getLocalizedPath(locale, path), languages: getLanguageAlternates(path) },
    openGraph: {
      title: formatPageTitle(fullName),
      description: educator.bio ?? undefined,
      url: getLocalizedPath(locale, path),
      type: 'profile',
      images: [getOgImageUrl({ title: fullName, sub: educator.nickname ?? undefined, type: 'educator' })],
    },
  }
}

export default async function EducatorProfilePage({ params }: Props) {
  const { locale, uid } = await params
  const t = await getTranslations('profile')

  const educator = await getEducatorProfile(uid)
  if (!educator) notFound()

  const [group, graduationLevel, nucleos] = await Promise.all([
    educator.groupId ? getGroup(educator.groupId) : Promise.resolve(null),
    educator.groupId && educator.graduationLevelId
      ? getGraduationLevel(educator.groupId, educator.graduationLevelId)
      : Promise.resolve(null),
    getNucleosByEducator(uid, educator.nucleoIds),
  ])

  const fullName = `${educator.name} ${educator.surname}`.trim()
  const countryFlag = isoForCountry(educator.country)
  const dayShort = getDayShort(locale)

  const socialLinks = SOCIAL_PLATFORMS
    .map((platform) => ({
      platform,
      href: normalizeSocialLink(platform, educator.socialLinks?.[platform]),
      label: getSocialDisplayLabel(platform, educator.socialLinks?.[platform]),
    }))
    .filter((l): l is { platform: typeof SOCIAL_PLATFORMS[number]; href: string; label: string } =>
      Boolean(l.href && l.label)
    )

  const personSchema = buildPersonSchema({
    name: fullName,
    url: getLocalizedUrl(locale, `/educadores/${uid}`),
    image: educator.avatarUrl,
    description: educator.bio,
    sameAs: socialLinks.map((l) => l.href),
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Agenda Capoeiragem', url: getLocalizedUrl(locale) },
    { name: t('educators'), url: getLocalizedUrl(locale, '/#directorio') },
    { name: fullName, url: getLocalizedUrl(locale, `/educadores/${uid}`) },
  ])

  return (
    <main className="min-h-screen bg-bg py-16 lg:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="page-shell-narrow">
        <Link href={`/${locale}/#directorio`} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-accent-ink hover:underline">
          ← {t('back')}
        </Link>

        {/* Profile card */}
        <div className="rounded-[28px] border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {educator.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={educator.avatarUrl} alt={fullName} className="h-24 w-24 shrink-0 rounded-full border border-border object-cover" />
            ) : (
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border border-border bg-surface text-2xl font-bold text-text-secondary">
                {`${educator.name?.[0] ?? ''}${educator.surname?.[0] ?? ''}`.toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-black text-ink leading-[1.05] tracking-[-0.02em]" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
                {fullName}
                {countryFlag && <CountryFlag country={educator.country} className="ml-2 align-middle" />}
              </h1>
              {educator.nickname && <p className="mt-1 text-lg text-text-secondary">&ldquo;{educator.nickname}&rdquo;</p>}
              {!countryFlag && educator.country && (
                <p className="mt-1 text-sm font-bold text-text-secondary">{educator.country}</p>
              )}
            </div>
          </div>

          {/* Group badge */}
          {group && (
            <Link
              href={`/${locale}/grupos/${group.id}`}
              className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 transition-colors duration-150 hover:border-accent"
            >
              {group.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={group.logoUrl} alt={group.name} className="h-7 w-7 shrink-0 rounded-full border border-border object-cover" />
              ) : (
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border bg-card text-xs font-bold text-text-secondary">
                  {group.name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <span className="text-sm font-bold text-ink">{group.name}</span>
            </Link>
          )}

          {/* Role + graduation badges */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {educator.role === 'educator' && (
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-sm font-bold text-accent-ink">
                {t('educatorRole')}
              </span>
            )}
            {graduationLevel && (
              <span className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold text-ink">
                <CordaVisual
                  colors={graduationLevel.colors}
                  tipColorLeft={graduationLevel.tipColorLeft}
                  tipColorRight={graduationLevel.tipColorRight}
                />
                {t('graduatedAs', { level: graduationLevel.name })}
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        {educator.bio && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('bio')}</p>
            <p className="whitespace-pre-line text-base leading-relaxed text-text-secondary">{educator.bio}</p>
          </div>
        )}

        {/* Nucleos */}
        {nucleos.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('myNucleos')} ({nucleos.length})</p>
            <div className="space-y-3">
              {nucleos.map((nucleo) => {
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
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-accent">
                        <path d="M12 22s8-7.58 8-13a8 8 0 1 0-16 0c0 5.42 8 13 8 13z" />
                        <circle cx="12" cy="9" r="3" />
                      </svg>
                      <div className="min-w-0">
                        <p className="font-bold text-ink">
                          {nucleo.name}
                          <CountryFlag country={nucleo.country} className="ml-2" />
                        </p>
                        {nucleo.address && <p className="mt-1 text-sm text-text-secondary">{nucleo.address}</p>}
                        {(nucleo.city || nucleo.country) && (
                          <p className="mt-0.5 text-xs text-text-muted">
                            {[nucleo.city, nucleo.country].filter(Boolean).join(', ')}
                          </p>
                        )}
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
          </div>
        )}

        {/* Contact */}
        {socialLinks.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('contact')}</p>
            <div className="space-y-2">
              {socialLinks.map((l) => (
                <a
                  key={l.platform}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 transition-colors duration-150 hover:border-accent"
                >
                  <span className="flex items-center gap-3 text-sm font-bold text-ink">
                    <SocialIcon platform={l.platform} />
                    {l.label}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-text-muted">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <path d="M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function SocialIcon({ platform }: { platform: typeof SOCIAL_PLATFORMS[number] }) {
  switch (platform) {
    case 'instagram':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-accent-ink">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'facebook':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-accent-ink">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-accent-ink">
          <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-4-1L3 21l1.3-3.9a8.38 8.38 0 0 1-1.2-4.5 8.5 8.5 0 1 1 17.9-1.1z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-accent-ink">
          <rect x="2" y="5" width="20" height="14" rx="3" />
          <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-accent-ink">
          <path d="M14 2v12.5a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 2a5 5 0 0 0 5 5" />
        </svg>
      )
    case 'website':
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-accent-ink">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
        </svg>
      )
  }
}
