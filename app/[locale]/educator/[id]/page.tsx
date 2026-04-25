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
      <div className="page-shell relative py-12">
        {/* Header Section */}
        <header className="mb-12">
          <div className="grid gap-10 lg:grid-cols-[400px_1fr] lg:items-end">
            {/* Profile Image Card */}
            <div className="card relative aspect-square overflow-hidden shadow-lg" style={{ borderRadius: 'var(--radius-xl)' }}>
              {educator.avatarUrl ? (
                <Image
                  src={educator.avatarUrl}
                  alt={fullName}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-muted text-6xl font-black text-ink-3">
                  {educator.name?.[0] ?? '?'}
                </div>
              )}
              {/* Overlay info if needed */}
              <div className="absolute bottom-6 left-6">
                <div className="chip acc font-black uppercase tracking-wider text-[10px]">
                  {educator.role}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="berimbau-dot" />
                <span className="eyebrow acc">{t('role')} · {educator.country}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(48px, 6vw, 84px)', lineHeight: 0.9, letterSpacing: '-0.05em' }}>
                {educator.nickname || educator.name} <em className="italic">{educator.nickname ? educator.surname : ''}</em>
              </h1>
              
              <div className="mt-8 flex flex-wrap gap-4">
                {/* Graduation Chip */}
                {graduationLevel && (
                  <div className="card-paper flex items-center gap-4 px-6 py-4" style={{ borderRadius: 'var(--radius-lg)' }}>
                    <CordaVisual
                      colors={graduationLevel.colors}
                      tipColorLeft={graduationLevel.tipColorLeft}
                      tipColorRight={graduationLevel.tipColorRight}
                      width={100}
                      height={14}
                    />
                    <div className="flex flex-col">
                      <span className="mono text-[9px] uppercase tracking-widest text-ink-4">{t('graduation')}</span>
                      <span className="text-[15px] font-bold text-ink">{graduationLevel.name}</span>
                    </div>
                  </div>
                )}

                {/* Group Chip */}
                {group && (
                  <Link 
                    href={`/${locale}/group/${group.id}`}
                    className="card-paper flex items-center gap-4 px-6 py-4 transition-all hover:shadow-md" 
                    style={{ borderRadius: 'var(--radius-lg)' }}
                  >
                    <div className="relative h-10 w-10 overflow-hidden rounded-[12px] bg-white p-1">
                       {group.logoUrl ? (
                        <Image src={group.logoUrl} alt={group.name} fill className="object-contain" />
                       ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold">{group.name[0]}</div>
                       )}
                    </div>
                    <div className="flex flex-col">
                      <span className="mono text-[9px] uppercase tracking-widest text-ink-4">{t('group')}</span>
                      <span className="text-[15px] font-bold text-ink">{group.name}</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[1fr_360px]">
          {/* ── Left side: Bio & Nucleos ── */}
          <div className="space-y-12">
            {/* Bio */}
            <section className="rounded-[32px] border border-line bg-surface p-8 sm:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-ink">{t('bio')}</h2>
              <div className="page-copy-measure mt-6 whitespace-pre-wrap text-[17px] leading-relaxed text-ink-2">
                {educator.bio || t('unspecified')}
              </div>
            </section>

            {/* Nucleos */}
            {nucleos.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-ink">{t('nucleos')}</h2>
                  <div className="h-px flex-1 bg-line/60" />
                </div>
                <div className="grid gap-6 2xl:grid-cols-2">
                  {nucleos.map((nucleo) => {
                    const VIEW_LABEL: Record<string, string> = { es: 'Ver núcleo', pt: 'Ver núcleo', en: 'View nucleo' }
                    const WHATSAPP_LABEL: Record<string, string> = { es: 'Contacto WhatsApp', pt: 'Contato WhatsApp', en: 'WhatsApp contact' }
                    return (
                      <div key={nucleo.id} className="card p-6 transition-all hover:shadow-md" style={{ borderRadius: 'var(--radius-xl)' }}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            {nucleo.groupName && (
                              <p className="mono text-[10px] uppercase tracking-[0.2em] text-ink-4">
                                {nucleo.groupName}
                              </p>
                            )}
                            <h3 className="mt-1 text-[19px] font-bold text-ink">{nucleo.name}</h3>
                            <p className="mt-3 flex items-center gap-2 text-sm text-ink-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-ink">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                <circle cx="12" cy="9" r="2.5" />
                              </svg>
                              {[nucleo.city, nucleo.country].filter(Boolean).join(', ')}
                            </p>
                          </div>
                          <Link
                            href={`/${locale}/nucleo/${nucleo.groupId}/${nucleo.id}`}
                            className="btn btn-ghost btn-sm"
                          >
                            {VIEW_LABEL[locale] ?? VIEW_LABEL.en}
                          </Link>
                        </div>

                        {nucleo.schedules && nucleo.schedules.length > 0 && (
                          <div className="mt-6 flex flex-wrap gap-2">
                            {nucleo.schedules.map((s, i) => (
                              <span key={i} className="chip sm">
                                {getDay(locale, s.dayOfWeek)} {s.startTime}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* ── Right side: Contact & Extras ── */}
          <aside className="space-y-8">
            {/* Social links */}
            {(sl.instagram || sl.whatsapp || sl.facebook || sl.youtube || sl.tiktok || sl.website) && (
              <section className="card p-6" style={{ borderRadius: 'var(--radius-xl)' }}>
                <h3 className="mono mb-6 text-[10px] uppercase tracking-[0.2em] text-ink-3">Contacto directo</h3>
                <div className="flex flex-col gap-3">
                  {sl.whatsapp && (
                    <a
                      href={`https://wa.me/${sl.whatsapp.replace(/\D/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-full border border-line bg-surface-muted px-5 py-3.5 text-[14px] font-bold text-ink-2 transition-all hover:bg-[#25D366]/5 hover:text-[#25D366] hover:border-[#25D366]/30"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                      WhatsApp
                    </a>
                  )}
                  {sl.instagram && (
                    <a
                      href={`https://instagram.com/${sl.instagram.replace('@', '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-full border border-line bg-surface-muted px-5 py-3.5 text-[14px] font-bold text-ink-2 transition-all hover:bg-[#E4405F]/5 hover:text-[#E4405F] hover:border-[#E4405F]/30"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" /></svg>
                      Instagram
                    </a>
                  )}
                  {sl.website && (
                    <a
                      href={sl.website.startsWith('http') ? sl.website : `https://${sl.website}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-full border border-line bg-surface-muted px-5 py-3.5 text-[14px] font-bold text-ink-2 transition-all hover:border-accent/30 hover:text-ink"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                      Sitio web
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Support / Info card */}
            <div className="card-ink p-8 shadow-lg" style={{ borderRadius: 'var(--radius-xl)' }}>
              <h3 className="text-xl font-bold text-bg">Participa en la comunidad</h3>
              <p className="mt-3 text-sm leading-relaxed text-bg/70">
                Agenda Capoeiragem es un directorio abierto. Si conoces a alguien que no esté aquí, invítale a registrarse.
              </p>
              <button className="btn btn-accent mt-6 w-full font-bold">Inscribir núcleo</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
