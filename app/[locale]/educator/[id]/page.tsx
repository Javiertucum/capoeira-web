import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEducatorProfile, getNucleosByEducator, getGroup, getGraduationLevelFull } from '@/lib/queries'
import NucleoListItem from '@/components/public/NucleoListItem'
import CordaVisual from '@/components/public/CordaVisual'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getLanguageAlternates, getLocalizedUrl, getOgImageUrl, buildPersonSchema, buildBreadcrumbSchema } from '@/lib/site'

export const revalidate = 300

type Props = {
  params: Promise<{ locale: string; id: string }>
}

const DAY_LABELS: Record<string, Record<number, string>> = {
  es: { 0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb' },
  pt: { 0: 'Dom', 1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex', 6: 'Sáb' },
  en: { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' },
}

function getDay(locale: string, day: number) {
  return (DAY_LABELS[locale] ?? DAY_LABELS.en)[day] ?? day.toString()
}

const EDU_NOT_FOUND = {
  es: 'Educador no encontrado',
  pt: 'Educador não encontrado',
  en: 'Educator not found',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params
  const edu = await getEducatorProfile(id)
  if (!edu) return { title: EDU_NOT_FOUND[locale as keyof typeof EDU_NOT_FOUND] ?? EDU_NOT_FOUND.en }

  const fullName = edu.nickname || `${edu.name} ${edu.surname}`
  const title = `${fullName} — Capoeira`

  const descSuffix: Record<string, string> = {
    es: `Educador de capoeira${edu.country ? ` en ${edu.country}` : ''}. Conoce su graduación, núcleos de entrenamiento y contacto.`,
    pt: `Educador de capoeira${edu.country ? ` em ${edu.country}` : ''}. Conheça sua graduação, núcleos de treino e contato.`,
    en: `Capoeira educator${edu.country ? ` in ${edu.country}` : ''}. See their graduation level, training nucleos, and contact details.`,
  }
  const description = edu.bio?.slice(0, 160) ?? descSuffix[locale] ?? descSuffix.en

  const path = `/educator/${id}`
  const ogImage = getOgImageUrl({ title: fullName, sub: description.slice(0, 90), type: 'educator' })

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
      type: 'profile',
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function EducatorProfilePage({ params }: Props) {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'profile' })

  const educator = await getEducatorProfile(id)
  if (!educator) notFound()

  const [nucleos, group, graduationLevel] = await Promise.all([
    getNucleosByEducator(id, educator.nucleoIds).catch(() => []),
    educator.groupId ? getGroup(educator.groupId).catch(() => null) : Promise.resolve(null),
    educator.groupId && educator.graduationLevelId
      ? getGraduationLevelFull(educator.groupId, educator.graduationLevelId).catch(() => null)
      : Promise.resolve(null),
  ])

  const sl = educator.socialLinks ?? {}

  const fullName = educator.nickname || `${educator.name} ${educator.surname}`
  const sameAs = [
    sl.instagram ? `https://instagram.com/${sl.instagram.replace('@', '')}` : null,
    sl.facebook ? `https://facebook.com/${sl.facebook.replace('@', '')}` : null,
    sl.youtube ? `https://youtube.com/@${sl.youtube.replace('@', '')}` : null,
    sl.tiktok ? `https://tiktok.com/@${sl.tiktok.replace('@', '')}` : null,
    sl.website ? (sl.website.startsWith('http') ? sl.website : `https://${sl.website}`) : null,
  ].filter((v): v is string => v !== null)

  const personSchema = buildPersonSchema({
    name: fullName,
    url: getLocalizedUrl(locale, `/educator/${id}`),
    image: educator.avatarUrl ?? undefined,
    description: educator.bio ?? undefined,
    sameAs,
  })
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Capoeira Map', url: getLocalizedUrl(locale) },
    { name: fullName, url: getLocalizedUrl(locale, `/educator/${id}`) },
  ])

  return (
    <div className="relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="page-shell relative py-10">
        {/* Back link */}
        <Link
          href={`/${locale}/educators`}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink-3 transition-colors hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </Link>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[340px_minmax(0,1fr)] xl:gap-12">
          {/* ── Left sidebar ── */}
          <div className="flex flex-col items-center text-center xl:sticky xl:top-24 xl:self-start">
            <div className="flex flex-col items-center">
              <p
                className="mb-4 text-[10px] uppercase tracking-[0.32em] text-accent-ink"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {t('role')}
              </p>
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-line bg-surface xl:h-48 xl:w-48">
                {educator.avatarUrl ? (
                  <Image
                    src={educator.avatarUrl}
                    alt={educator.nickname || educator.name || 'Educator'}
                    fill
                    sizes="(min-width: 1280px) 192px, 160px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-surface-muted text-4xl font-bold text-ink-3">
                    {educator.name?.[0] ?? '?'}
                  </div>
                )}
              </div>
            </div>

            <h1 className="mt-6 text-2xl font-bold text-ink sm:text-3xl">
              {educator.nickname || `${educator.name} ${educator.surname}`}
            </h1>
            {educator.nickname && (
              <p className="mt-1 text-sm text-ink-3">
                {educator.name} {educator.surname}
              </p>
            )}

            <div className="mt-4 inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-[12px] font-semibold tracking-wider text-accent-ink uppercase">
              {educator.role}
            </div>

            <div className="mt-8 flex w-full flex-col gap-4 text-left">
              {/* Graduation */}
              <div className="rounded-[16px] border border-line bg-surface p-4">
                <p
                  className="text-[11px] uppercase tracking-widest text-ink-3"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {t('graduation')}
                </p>
                {graduationLevel ? (
                  <div className="mt-3 flex items-center gap-3">
                    <CordaVisual
                      colors={graduationLevel.colors}
                      tipColorLeft={graduationLevel.tipColorLeft}
                      tipColorRight={graduationLevel.tipColorRight}
                      width={80}
                      height={12}
                    />
                    <p className="text-sm font-medium text-ink-2">{graduationLevel.name}</p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm font-medium text-ink-2">{t('unspecified')}</p>
                )}
              </div>

              {/* Group */}
              {group && (
                <div className="rounded-[16px] border border-line bg-surface p-4">
                  <p
                    className="text-[11px] uppercase tracking-widest text-ink-3"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {t('group')}
                  </p>
                  <Link
                    href={`/${locale}/group/${group.id}`}
                    className="mt-3 flex items-center gap-3 rounded-[14px] border border-line bg-surface-muted px-3 py-3 text-left transition-colors hover:border-text/20"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[12px] border border-line bg-surface">
                      {group.logoUrl ? (
                        <Image
                          src={group.logoUrl}
                          alt={group.name}
                          fill
                          sizes="48px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-ink-3">
                          {group.name?.[0] ?? '?'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{group.name}</p>
                      <p className="mt-1 text-xs text-accent-ink">{t('viewProfile')}</p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Location */}
              <div className="rounded-[16px] border border-line bg-surface p-4">
                <p
                  className="text-[11px] uppercase tracking-widest text-ink-3"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {t('location')}
                </p>
                <p className="mt-1 text-sm font-medium text-ink-2">
                  {educator.country || t('unspecified')}
                </p>
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="flex-1 space-y-8">
            {/* Social links */}
            {(sl.instagram || sl.whatsapp || sl.facebook || sl.youtube || sl.tiktok || sl.website) && (
              <section className="rounded-[22px] border border-line bg-surface p-5">
                <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                  {sl.whatsapp && (
                    <a
                      href={`https://wa.me/${sl.whatsapp.replace(/\D/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-[14px] border border-line bg-surface-muted px-5 py-3 text-sm font-semibold text-ink-2 transition-all hover:border-[#25D366]/30 hover:bg-[rgba(37,211,102,0.05)] hover:text-ink"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                      WhatsApp
                    </a>
                  )}
                  {sl.instagram && (
                    <a
                      href={`https://instagram.com/${sl.instagram.replace('@', '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-[14px] border border-line bg-surface-muted px-5 py-3 text-sm font-semibold text-ink-2 transition-all hover:border-[#E4405F]/30 hover:bg-[rgba(228,64,95,0.05)] hover:text-ink"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" /></svg>
                      Instagram
                    </a>
                  )}
                  {sl.facebook && (
                    <a
                      href={`https://facebook.com/${sl.facebook.replace('@', '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-[14px] border border-line bg-surface-muted px-5 py-3 text-sm font-semibold text-ink-2 transition-all hover:border-[#1877F2]/30 hover:bg-[rgba(24,119,242,0.05)] hover:text-ink"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                      Facebook
                    </a>
                  )}
                  {sl.youtube && (
                    <a
                      href={`https://youtube.com/@${sl.youtube.replace('@', '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-[14px] border border-line bg-surface-muted px-5 py-3 text-sm font-semibold text-ink-2 transition-all hover:border-[#FF0000]/30 hover:bg-[rgba(255,0,0,0.05)] hover:text-ink"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
                      YouTube
                    </a>
                  )}
                  {sl.tiktok && (
                    <a
                      href={`https://tiktok.com/@${sl.tiktok.replace('@', '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-[14px] border border-line bg-surface-muted px-5 py-3 text-sm font-semibold text-ink-2 transition-all hover:border-line hover:text-ink"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
                      TikTok
                    </a>
                  )}
                  {sl.website && (
                    <a
                      href={sl.website.startsWith('http') ? sl.website : `https://${sl.website}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-[14px] border border-line bg-surface-muted px-5 py-3 text-sm font-semibold text-ink-2 transition-all hover:border-accent/30 hover:text-ink"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                      {t('website')}
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Nucleos */}
            {nucleos.length > 0 && (
              <section className="rounded-[22px] border border-line bg-surface p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-ink">{t('nucleos')}</h2>
                <div className="mt-6 grid gap-4 2xl:grid-cols-2">
                  {nucleos.map((nucleo) => {
                    const VIEW_LABEL: Record<string, string> = { es: 'Ver núcleo', pt: 'Ver núcleo', en: 'View nucleo' }
                    const WHATSAPP_LABEL: Record<string, string> = { es: 'Contacto WhatsApp', pt: 'Contato WhatsApp', en: 'WhatsApp contact' }
                    return (
                      <div key={nucleo.id} className="rounded-[18px] border border-line bg-surface-muted p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            {nucleo.groupName && (
                              <p
                                className="text-[10px] uppercase tracking-[0.22em] text-ink-3"
                                style={{ fontFamily: 'var(--font-mono)' }}
                              >
                                {nucleo.groupName}
                              </p>
                            )}
                            <h3 className="mt-1 text-base font-semibold text-ink">{nucleo.name}</h3>
                            {(nucleo.city || nucleo.country) && (
                              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-2">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 opacity-60">
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                  <circle cx="12" cy="9" r="2.5" />
                                </svg>
                                {[nucleo.city, nucleo.country].filter(Boolean).join(', ')}
                              </p>
                            )}
                            {nucleo.address && (
                              <p className="mt-1 flex items-start gap-1.5 text-xs text-ink-3">
                                {nucleo.address}
                              </p>
                            )}
                          </div>
                          <Link
                            href={`/${locale}/nucleo/${nucleo.groupId}/${nucleo.id}`}
                            className="shrink-0 rounded-full border border-accent-soft bg-accent-soft px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-ink transition-colors hover:bg-accent hover:text-white"
                          >
                            {VIEW_LABEL[locale] ?? VIEW_LABEL.en}
                          </Link>
                        </div>

                        {nucleo.schedules && nucleo.schedules.length > 0 && (
                          <div className="mt-4 border-t border-line/50 pt-4">
                            <p
                              className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3"
                              style={{ fontFamily: 'var(--font-mono)' }}
                            >
                              {t('schedules')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {nucleo.schedules.map((s, i) => (
                                <span key={i} className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-2">
                                  {getDay(locale, s.dayOfWeek)} {s.startTime}–{s.endTime}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {sl.whatsapp && (
                          <div className="mt-4 border-t border-line/50 pt-4">
                            <a
                              href={`https://wa.me/${sl.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, vi el núcleo "${nucleo.name}" en Agenda Capoeiragem y me gustaría saber más.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[rgba(37,211,102,0.08)] px-4 py-2 text-xs font-semibold text-[#25D366] transition-colors hover:bg-[rgba(37,211,102,0.14)]"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                              {WHATSAPP_LABEL[locale] ?? WHATSAPP_LABEL.en}
                            </a>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Bio */}
            <section className="rounded-[22px] border border-line bg-surface p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-ink">{t('bio')}</h2>
              <div className="page-copy-measure mt-4 whitespace-pre-wrap text-base leading-relaxed text-ink-2">
                {educator.bio || t('unspecified')}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
