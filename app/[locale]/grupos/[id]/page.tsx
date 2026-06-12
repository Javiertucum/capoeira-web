import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import {
  formatPageTitle,
  getLanguageAlternates,
  getLocalizedPath,
  getOgImageUrl,
  getLocalizedUrl,
  buildSportsOrganizationSchema,
  buildBreadcrumbSchema,
} from '@/lib/site'
import { getGroupWithNucleos, getGroupEducators, getGraduationLevels, getGraduationLevelNamesByGroup } from '@/lib/queries'

type Props = Readonly<{ params: Promise<{ locale: string; id: string }> }>

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params
  const result = await getGroupWithNucleos(id)
  if (!result) return {}
  const { group } = result

  const path = `/grupos/${id}`
  return {
    title: group.name,
    description: group.description ?? undefined,
    alternates: { canonical: getLocalizedPath(locale, path), languages: getLanguageAlternates(path) },
    openGraph: {
      title: formatPageTitle(group.name),
      description: group.description ?? undefined,
      url: getLocalizedPath(locale, path),
      type: 'website',
      images: [getOgImageUrl({ title: group.name, sub: group.graduationSystemName ?? undefined, type: 'group' })],
    },
  }
}

export default async function GroupProfilePage({ params }: Props) {
  const { locale, id } = await params
  const t = await getTranslations('profile')

  const result = await getGroupWithNucleos(id)
  if (!result) notFound()
  const { group, nucleos } = result

  const [educators, graduationLevels] = await Promise.all([
    getGroupEducators(id),
    getGraduationLevels(id),
  ])

  const gradNamesByGroup = await getGraduationLevelNamesByGroup([id])
  const gradMap = gradNamesByGroup.get(id)

  const orgSchema = buildSportsOrganizationSchema({
    name: group.name,
    url: getLocalizedUrl(locale, `/grupos/${id}`),
    logo: group.logoUrl,
    description: group.description ?? undefined,
    memberCount: group.memberCount,
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Agenda Capoeiragem', url: getLocalizedUrl(locale) },
    { name: t('group'), url: getLocalizedUrl(locale, '/#directorio') },
    { name: group.name, url: getLocalizedUrl(locale, `/grupos/${id}`) },
  ])

  return (
    <main className="min-h-screen bg-bg py-16 lg:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="page-shell-narrow">
        <Link href={`/${locale}/#directorio`} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-accent-ink hover:underline">
          ← {t('back')}
        </Link>

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {group.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={group.logoUrl} alt={group.name} className="h-24 w-24 shrink-0 rounded-2xl border border-border object-cover" />
          ) : (
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border border-border bg-surface text-2xl font-bold text-text-secondary">
              {group.name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <div>
            <h1 className="font-black text-ink leading-[1.05] tracking-[-0.02em]" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
              {group.name}
            </h1>
            {group.graduationSystemName && <p className="mt-1 text-lg text-text-secondary">{group.graduationSystemName}</p>}
          </div>
        </div>

        {group.description && (
          <p className="mt-8 max-w-[70ch] text-base leading-relaxed text-text-secondary">{group.description}</p>
        )}

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <InfoRow label={t('members')} value={String(group.memberCount ?? 0)} />
          <InfoRow
            label={t('representedCountries')}
            value={group.representedCountries?.length ? group.representedCountries.join(', ') : t('unspecified')}
          />
          <InfoRow
            label={t('representedCities')}
            value={group.representedCities?.length ? group.representedCities.join(', ') : t('unspecified')}
          />
        </div>

        {/* Graduation system */}
        {graduationLevels.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('graduationSystem')}</p>
            <div className="flex flex-wrap gap-2">
              {graduationLevels.map((level) => (
                <span
                  key={level.id}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-ink"
                >
                  {level.colors.length > 0 && (
                    <span className="flex h-3 w-6 overflow-hidden rounded-full border border-border/50">
                      {level.colors.map((color, i) => (
                        <span key={i} style={{ backgroundColor: color, flex: 1 }} />
                      ))}
                    </span>
                  )}
                  {level.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Educators */}
        {educators.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('educators')}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {educators.map((educator) => (
                <Link
                  key={educator.uid}
                  href={`/${locale}/educadores/${educator.uid}`}
                  className="block rounded-2xl border border-border bg-card p-4 transition-colors duration-150 hover:border-accent"
                >
                  <p className="font-bold text-ink">{educator.name} {educator.surname}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">
                    {(educator.graduationLevelId && gradMap?.get(educator.graduationLevelId)) ?? t('unspecified')}
                  </p>
                  {educator.bio && <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{educator.bio}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Nucleos */}
        <div className="mt-10">
          <p className="eyebrow acc mb-3">{t('viewNucleo')}s</p>
          {nucleos.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {nucleos.map((nucleo) => (
                <Link
                  key={nucleo.id}
                  href={`/${locale}/nucleos/${nucleo.groupId}/${nucleo.id}`}
                  className="block rounded-2xl border border-border bg-card p-4 transition-colors duration-150 hover:border-accent"
                >
                  <p className="font-bold text-ink">{nucleo.name}</p>
                  <p className="mt-1 text-sm text-text-secondary">{[nucleo.city, nucleo.country].filter(Boolean).join(', ')}</p>
                  {nucleo.address && <p className="mt-1 text-xs text-text-muted">{nucleo.address}</p>}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">{t('noNucleos')}</p>
          )}
        </div>
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
