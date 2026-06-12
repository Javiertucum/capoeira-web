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
  buildLocalBusinessSchema,
  buildBreadcrumbSchema,
} from '@/lib/site'
import { getNucleoById, getGroup, getEducatorProfile, getNucleoMembers } from '@/lib/queries'

type Props = Readonly<{ params: Promise<{ locale: string; groupId: string; nucleoId: string }> }>

const DAY_NAMES = {
  es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  pt: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
} as const

function getDayNames(locale: string) {
  return DAY_NAMES[locale as keyof typeof DAY_NAMES] ?? DAY_NAMES.en
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, groupId, nucleoId } = await params
  const nucleo = await getNucleoById(groupId, nucleoId)
  if (!nucleo) return {}

  const path = `/nucleos/${groupId}/${nucleoId}`
  const sub = [nucleo.city, nucleo.country].filter(Boolean).join(', ')
  return {
    title: nucleo.name,
    description: nucleo.address ?? sub,
    alternates: { canonical: getLocalizedPath(locale, path), languages: getLanguageAlternates(path) },
    openGraph: {
      title: formatPageTitle(nucleo.name),
      description: nucleo.address ?? sub,
      url: getLocalizedPath(locale, path),
      type: 'website',
      images: [getOgImageUrl({ title: nucleo.name, sub: nucleo.groupName, type: 'nucleo' })],
    },
  }
}

export default async function NucleoProfilePage({ params }: Props) {
  const { locale, groupId, nucleoId } = await params
  const t = await getTranslations('profile')

  const nucleo = await getNucleoById(groupId, nucleoId)
  if (!nucleo) notFound()

  const [group, responsibleEducator, coEducators, members] = await Promise.all([
    getGroup(groupId),
    nucleo.responsibleEducatorId ? getEducatorProfile(nucleo.responsibleEducatorId) : Promise.resolve(null),
    Promise.all((nucleo.coEducatorIds ?? []).map((uid) => getEducatorProfile(uid))),
    getNucleoMembers(nucleoId),
  ])

  const dayNames = getDayNames(locale)
  const sortedSchedules = [...(nucleo.schedules ?? [])].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))

  const localBusinessSchema = buildLocalBusinessSchema({
    name: nucleo.name,
    url: getLocalizedUrl(locale, `/nucleos/${groupId}/${nucleoId}`),
    description: group?.description ?? undefined,
    address: nucleo.address,
    city: nucleo.city,
    country: nucleo.country,
    latitude: nucleo.latitude ?? undefined,
    longitude: nucleo.longitude ?? undefined,
    schedules: nucleo.schedules,
    educatorName: responsibleEducator ? `${responsibleEducator.name} ${responsibleEducator.surname}` : undefined,
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Agenda Capoeiragem', url: getLocalizedUrl(locale) },
    { name: t('viewNucleo'), url: getLocalizedUrl(locale, '/#directorio') },
    { name: nucleo.name, url: getLocalizedUrl(locale, `/nucleos/${groupId}/${nucleoId}`) },
  ])

  const validCoEducators = coEducators.filter((e): e is NonNullable<typeof e> => Boolean(e))

  return (
    <main className="min-h-screen bg-bg py-16 lg:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="page-shell-narrow">
        <Link href={`/${locale}/#directorio`} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-accent-ink hover:underline">
          ← {t('back')}
        </Link>

        <h1 className="font-black text-ink leading-[1.05] tracking-[-0.02em]" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          {nucleo.name}
        </h1>
        {group && (
          <Link href={`/${locale}/grupos/${groupId}`} className="mt-1 inline-block text-sm font-bold uppercase tracking-[0.12em] text-accent-ink hover:underline">
            {group.name}
          </Link>
        )}

        {/* Info grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <InfoRow label={t('address')} value={nucleo.address ?? t('unspecified')} />
          <InfoRow label={t('location')} value={[nucleo.city, nucleo.country].filter(Boolean).join(', ') || t('unspecified')} />
        </div>

        {/* Schedules */}
        {sortedSchedules.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('schedules')}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {sortedSchedules.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
                  <span className="font-bold text-ink">{dayNames[s.dayOfWeek] ?? s.dayOfWeek}</span>
                  <span className="text-sm text-text-secondary">{s.startTime} – {s.endTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Responsible educator */}
        {responsibleEducator && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('responsibleEducator')}</p>
            <Link
              href={`/${locale}/educadores/${responsibleEducator.uid}`}
              className="block rounded-2xl border border-border bg-card p-4 transition-colors duration-150 hover:border-accent"
            >
              <p className="font-bold text-ink">{responsibleEducator.name} {responsibleEducator.surname}</p>
              {responsibleEducator.bio && <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{responsibleEducator.bio}</p>}
            </Link>
          </div>
        )}

        {/* Co-educators */}
        {validCoEducators.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-3">{t('coEducators')}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {validCoEducators.map((educator) => (
                <Link
                  key={educator.uid}
                  href={`/${locale}/educadores/${educator.uid}`}
                  className="block rounded-2xl border border-border bg-card p-4 transition-colors duration-150 hover:border-accent"
                >
                  <p className="font-bold text-ink">{educator.name} {educator.surname}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Members count */}
        <div className="mt-10">
          <InfoRow label={t('members')} value={members.length > 0 ? String(members.length) : t('noMembers')} />
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
