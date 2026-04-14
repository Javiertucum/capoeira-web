import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import NucleoListItem from '@/components/public/NucleoListItem'
import Badge from '@/components/ui/Badge'
import { getEducatorProfile, getNucleosByEducator, getGroup, getGraduationLevel } from '@/lib/queries'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath } from '@/lib/site'
import { normalizeSocialLink } from '@/lib/social-links'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

const COPY = {
  es: {
    eyebrow: 'Perfil publico del educador',
    summary: 'Un perfil mas claro para entender quien ensena, donde esta y en que espacios participa.',
    role: 'Educador',
  },
  pt: {
    eyebrow: 'Perfil publico do educador',
    summary: 'Um perfil mais claro para entender quem ensina, onde esta e em quais espacos participa.',
    role: 'Educador',
  },
  en: {
    eyebrow: 'Public educator profile',
    summary: 'A clearer profile to understand who teaches, where they are, and which spaces they are part of.',
    role: 'Educator',
  },
} as const

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.en
}

function getDisplayName(name: string, surname: string, nickname?: string | null) {
  return nickname?.trim() || [name, surname].filter(Boolean).join(' ').trim()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params
  const educator = await getEducatorProfile(id)

  if (!educator) return { title: 'Educador no encontrado' }

  const fullName = educator.nickname || `${educator.name} ${educator.surname}`
  const path = `/educator/${id}`
  const description = educator.bio ?? 'Educador de capoeira'

  return {
    title: fullName,
    description,
    alternates: {
      canonical: getLocalizedPath(locale, path),
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title: formatPageTitle(fullName),
      description,
      url: getLocalizedPath(locale, path),
      type: 'profile',
    },
  }
}

export default async function EducatorProfilePage({ params }: Props) {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: 'profile' })
  const copy = getCopy(locale)

  const educator = await getEducatorProfile(id)
  if (!educator) {
    notFound()
  }

  const [nucleos, group, graduationName] = await Promise.all([
    getNucleosByEducator(id).catch(() => [] as Awaited<ReturnType<typeof getNucleosByEducator>>),
    educator.groupId ? getGroup(educator.groupId).catch(() => null) : Promise.resolve(null),
    educator.groupId && educator.graduationLevelId
      ? getGraduationLevel(educator.groupId, educator.graduationLevelId).catch(() => null)
      : Promise.resolve(null),
  ])

  // Sistema de graduación del grupo
  const graduationSystem = group?.graduationSystemName || t('unspecified')

  const displayName = getDisplayName(educator.name, educator.surname, educator.nickname)
  const fullName = [educator.name, educator.surname].filter(Boolean).join(' ').trim()

  const socialLinks = Object.entries(educator.socialLinks ?? {})
    .map(([platform, value]) => {
      const href = normalizeSocialLink(
        platform as Parameters<typeof normalizeSocialLink>[0],
        value ?? undefined
      )

      return href ? { platform, href } : null
    })
    .filter((item): item is { platform: string; href: string } => item !== null)

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(121,207,114,0.12),transparent_68%)] pointer-events-none"
      />

      <main className="relative mx-auto max-w-[1180px] px-5 py-10 sm:px-8 lg:px-12">
        <Link
          href={`/${locale}/map?filter=educators`}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-text-muted transition-colors hover:border-accent/20 hover:text-text"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </Link>

        <section className="relative overflow-hidden rounded-[34px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-6 shadow-[0_30px_90px_var(--shadow)] sm:p-8">
          <div
            aria-hidden="true"
            className="absolute right-[-70px] top-[-80px] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(121,207,114,0.18)_0%,rgba(121,207,114,0)_72%)]"
          />

          <div className="relative grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="relative h-[180px] w-[180px] overflow-hidden rounded-[32px] border border-accent/18 bg-[rgba(121,207,114,0.12)] shadow-[0_22px_60px_var(--shadow-soft)]">
                {educator.avatarUrl ? (
                  <img
                    src={educator.avatarUrl}
                    alt={displayName || 'Educator'}
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold uppercase tracking-[0.14em] text-accent">
                    {(displayName || 'AC').slice(0, 2)}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                {copy.eyebrow}
              </p>

              <h1 className="mt-4 text-[clamp(34px,5vw,60px)] font-semibold leading-[0.96] tracking-[-0.06em] text-text">
                {displayName || educator.uid}
              </h1>

              {educator.nickname && fullName ? (
                <p className="mt-2 text-base text-text-muted">{fullName}</p>
              ) : null}

              <p className="mt-5 max-w-[58ch] text-base leading-8 text-text-secondary">
                {copy.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="accent">{copy.role}</Badge>
                {educator.country ? <Badge>{educator.country}</Badge> : null}
                {/* Mostrar cuerda y sistema de graduación */}
                {graduationName ? (
                  <Badge variant="accent">{`${graduationSystem}: ${graduationName}`}</Badge>
                ) : null}
                {nucleos.length > 0 ? <Badge>{`${nucleos.length} ${t('nucleos')}`}</Badge> : null}
              </div>

              {socialLinks.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {socialLinks.map((item) => (
                    <a
                      key={item.platform}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-accent/20 hover:text-text"
                    >
                      {item.platform}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[30px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-6 shadow-[0_22px_60px_var(--shadow-soft)]">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-text">{t('bio')}</h2>
            <div className="mt-5 whitespace-pre-wrap text-base leading-8 text-text-secondary">
              {educator.bio || t('unspecified')}
            </div>

            <div className="mt-10">
              <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-text">{t('nucleos')}</h2>
              {nucleos.length > 0 ? (
                <div className="mt-6 flex flex-col gap-4">
                  {nucleos.map((nucleo) => (
                    <NucleoListItem key={nucleo.id} nucleo={nucleo} isActive={false} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[22px] border border-dashed border-border bg-surface-muted/70 px-5 py-8 text-center text-sm leading-7 text-text-muted">
                  {t('unspecified')}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                {t('group')}
              </p>
              {group ? (
                <Link
                  href={`/${locale}/group/${group.id}`}
                  className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-accent transition-opacity hover:opacity-80"
                >
                  {group.name}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <p className="mt-4 text-sm leading-7 text-text-secondary">{t('unspecified')}</p>
              )}
            </section>

            <section className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                {t('graduation')}
              </p>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                {graduationName ? `${graduationSystem}: ${graduationName}` : t('unspecified')}
              </p>
            </section>

            <section className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                {t('location')}
              </p>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                {educator.country || t('unspecified')}
              </p>
            </section>

            {socialLinks.length > 0 ? (
              <section className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                  {t('contact')}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {socialLinks.map((item) => (
                    <a
                      key={item.platform}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-accent/20 hover:text-text"
                    >
                      {item.platform}
                    </a>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </main>
    </div>
  )
}
