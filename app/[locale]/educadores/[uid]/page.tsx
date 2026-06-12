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
import { normalizeSocialLink } from '@/lib/social-links'

type Props = Readonly<{ params: Promise<{ locale: string; uid: string }> }>

const SOCIAL_PLATFORMS = ['instagram', 'facebook', 'whatsapp', 'youtube', 'tiktok', 'website'] as const

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

  const [group, graduationName, nucleos] = await Promise.all([
    educator.groupId ? getGroup(educator.groupId) : Promise.resolve(null),
    educator.groupId && educator.graduationLevelId
      ? getGraduationLevel(educator.groupId, educator.graduationLevelId)
      : Promise.resolve(null),
    getNucleosByEducator(uid, educator.nucleoIds),
  ])

  const fullName = `${educator.name} ${educator.surname}`.trim()

  const socialLinks = SOCIAL_PLATFORMS
    .map((platform) => ({ platform, href: normalizeSocialLink(platform, educator.socialLinks?.[platform]) }))
    .filter((l): l is { platform: typeof SOCIAL_PLATFORMS[number]; href: string } => Boolean(l.href))

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

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
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
            </h1>
            {educator.nickname && <p className="mt-1 text-lg text-text-secondary">&ldquo;{educator.nickname}&rdquo;</p>}
          </div>
        </div>

        {/* Info grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <InfoRow label={t('role')} value={educator.role === 'educator' ? t('admin') : t('role')} />
          <InfoRow label={t('location')} value={educator.country ?? t('unspecified')} />
          {group && (
            <InfoRow
              label={t('group')}
              value={<Link href={`/${locale}/grupos/${group.id}`} className="text-accent-ink hover:underline">{group.name}</Link>}
            />
          )}
          <InfoRow label={t('graduation')} value={graduationName ?? t('unspecified')} />
        </div>

        {/* Bio */}
        {educator.bio && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('bio')}</p>
            <p className="whitespace-pre-line text-base leading-relaxed text-text-secondary">{educator.bio}</p>
          </div>
        )}

        {/* Contact */}
        {socialLinks.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('contact')}</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((l) => (
                <a
                  key={l.platform}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-ink capitalize transition-colors duration-150 hover:border-accent"
                >
                  {l.platform}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Nucleos */}
        {nucleos.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('nucleos')}</p>
            <div className="space-y-3">
              {nucleos.map((nucleo) => (
                <Link
                  key={nucleo.id}
                  href={`/${locale}/nucleos/${nucleo.groupId}/${nucleo.id}`}
                  className="block rounded-2xl border border-border bg-card p-4 transition-colors duration-150 hover:border-accent"
                >
                  <p className="font-bold text-ink">{nucleo.name}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">{nucleo.groupName}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {[nucleo.city, nucleo.country].filter(Boolean).join(', ')}
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

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted">{label}</p>
      <p className="mt-1 text-base font-bold text-ink">{value}</p>
    </div>
  )
}
