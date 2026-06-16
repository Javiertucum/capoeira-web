import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  formatPageTitle,
  getLanguageAlternateUrls,
  getLocalizedUrl,
  getOgImageUrl,
  buildBreadcrumbSchema,
  buildItemListSchema,
  SITE_NAME,
} from '@/lib/site'
import { getAllNucleos, getNucleosByCountry } from '@/lib/queries'
import { slugify } from '@/lib/slugify'
import { getDayShort } from '@/lib/day-short'
import CountryFlag from '@/components/public/CountryFlag'
import Footer from '@/components/public/Footer'

export const revalidate = 3600

type Props = Readonly<{ params: Promise<{ locale: string; paisSlug: string }> }>

const COPY = {
  es: {
    title: (c: string) => `Capoeira en ${c}`,
    description: (c: string, n: number) =>
      `Directorio de capoeira en ${c}. Encuentra ${n} ${n === 1 ? 'lugar' : 'lugares'} donde entrenar capoeira — grupos, núcleos y educadores con horarios y dirección.`,
    keywords: (c: string, cities: string[]) => [
      `capoeira en ${c}`, `clases de capoeira en ${c}`, `capoeira ${c}`,
      `grupos capoeira ${c}`, `dónde entrenar capoeira ${c}`,
      ...cities.flatMap((city) => [`capoeira en ${city}`, `clases capoeira ${city}`]),
    ],
    cities: 'Ciudades',
    nucleos: 'Lugares para entrenar',
    back: '← Directorio global',
    scheduleUnit: (n: number) => `${n} clase${n === 1 ? '' : 's'}/semana`,
    seeAll: (city: string) => `Ver capoeira en ${city}`,
  },
  pt: {
    title: (c: string) => `Capoeira em ${c}`,
    description: (c: string, n: number) =>
      `Diretório de capoeira em ${c}. Encontre ${n} ${n === 1 ? 'local' : 'locais'} para treinar capoeira — grupos, núcleos e educadores com horários e endereço.`,
    keywords: (c: string, cities: string[]) => [
      `capoeira em ${c}`, `aulas de capoeira em ${c}`, `capoeira ${c}`,
      `grupos capoeira ${c}`, `onde treinar capoeira ${c}`,
      ...cities.flatMap((city) => [`capoeira em ${city}`, `aulas capoeira ${city}`]),
    ],
    cities: 'Cidades',
    nucleos: 'Locais para treinar',
    back: '← Diretório global',
    scheduleUnit: (n: number) => `${n} aula${n === 1 ? '' : 's'}/semana`,
    seeAll: (city: string) => `Ver capoeira em ${city}`,
  },
  en: {
    title: (c: string) => `Capoeira in ${c}`,
    description: (c: string, n: number) =>
      `Capoeira directory for ${c}. Find ${n} capoeira training ${n === 1 ? 'location' : 'locations'} — groups, nucleos and educators with class schedules and addresses.`,
    keywords: (c: string, cities: string[]) => [
      `capoeira in ${c}`, `capoeira classes in ${c}`, `capoeira ${c}`,
      `capoeira groups ${c}`, `where to train capoeira ${c}`,
      ...cities.flatMap((city) => [`capoeira in ${city}`, `capoeira classes ${city}`]),
    ],
    cities: 'Cities',
    nucleos: 'Training locations',
    back: '← Global directory',
    scheduleUnit: (n: number) => `${n} class${n === 1 ? '' : 'es'}/week`,
    seeAll: (city: string) => `Capoeira in ${city}`,
  },
} as const

type Locale = keyof typeof COPY
const getCopy = (locale: string) => COPY[locale as Locale] ?? COPY.es

export async function generateStaticParams() {
  const nucleos = await getAllNucleos().catch(() => [])
  const locales = ['es', 'pt', 'en']
  const countrySlugs = [...new Set(
    nucleos.map((n) => n.country).filter((c): c is string => Boolean(c)).map(slugify)
  )]
  return locales.flatMap((locale) => countrySlugs.map((paisSlug) => ({ locale, paisSlug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, paisSlug } = await params
  const data = await getNucleosByCountry(paisSlug)
  if (!data) return {}

  const c = getCopy(locale)
  const title = c.title(data.countryName)
  const description = c.description(data.countryName, data.nucleos.length)
  const path = `/capoeira/${paisSlug}`

  return {
    title,
    description,
    keywords: c.keywords(data.countryName, data.cities.map((city) => city.name)),
    alternates: { canonical: getLocalizedUrl(locale, path), languages: getLanguageAlternateUrls(path) },
    openGraph: {
      title: formatPageTitle(title),
      description,
      url: getLocalizedUrl(locale, path),
      type: 'website',
      images: [{ url: getOgImageUrl({ title, type: 'default' }), width: 1200, height: 630, alt: title }],
    },
  }
}

export default async function CountryPage({ params }: Props) {
  const { locale, paisSlug } = await params
  const data = await getNucleosByCountry(paisSlug)
  if (!data) notFound()

  const c = getCopy(locale)
  const title = c.title(data.countryName)
  const path = `/capoeira/${paisSlug}`
  const dayShort = getDayShort(locale)

  const breadcrumb = buildBreadcrumbSchema([
    { name: SITE_NAME, url: getLocalizedUrl(locale) },
    { name: title, url: getLocalizedUrl(locale, path) },
  ])

  const itemList = buildItemListSchema(
    data.nucleos.map((n) => ({
      name: n.name,
      url: getLocalizedUrl(locale, `/nucleos/${n.groupId}/${n.id}`),
      description: [n.city, n.country].filter(Boolean).join(', '),
    }))
  )

  return (
    <main className="min-h-screen bg-bg py-16 lg:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <div className="page-shell-narrow">
        <Link href={`/${locale}/#directorio`} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-accent-ink hover:underline">
          {c.back}
        </Link>

        <h1 className="font-black text-ink leading-tight tracking-tight" style={{ fontSize: 'clamp(28px, 5vw, 52px)' }}>
          {title}
        </h1>
        <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-text-secondary">
          {c.description(data.countryName, data.nucleos.length)}
        </p>

        {data.cities.length > 1 && (
          <div className="mt-10">
            <p className="eyebrow acc mb-4">{c.cities}</p>
            <div className="flex flex-wrap gap-2">
              {data.cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${locale}/capoeira/${paisSlug}/${city.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-accent"
                >
                  {city.name}
                  <span className="text-xs text-text-muted">({city.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <p className="eyebrow acc mb-4">{c.nucleos} ({data.nucleos.length})</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.nucleos.map((nucleo) => {
              const scheduleCount = nucleo.schedules?.length ?? 0
              return (
                <Link
                  key={nucleo.id}
                  href={`/${locale}/nucleos/${nucleo.groupId}/${nucleo.id}`}
                  className="block rounded-2xl border border-border bg-card p-4 transition-colors hover:border-accent"
                >
                  <p className="font-bold text-ink">{nucleo.name}</p>
                  {(nucleo.city || nucleo.country) && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
                      <CountryFlag country={nucleo.country} />
                      {[nucleo.city, nucleo.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {nucleo.address && (
                    <p className="mt-0.5 text-xs text-text-muted">{nucleo.address}</p>
                  )}
                  {nucleo.groupName && (
                    <p className="mt-1 text-xs text-text-muted">{nucleo.groupName}</p>
                  )}
                  {scheduleCount > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {nucleo.schedules!.slice(0, 3).map((s, i) => (
                        <span key={i} className="rounded-full bg-surface px-2 py-0.5 text-xs text-text-secondary">
                          {dayShort[s.dayOfWeek]} {s.startTime}
                        </span>
                      ))}
                      {scheduleCount > 3 && (
                        <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-text-muted">
                          +{scheduleCount - 3}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </main>
  )
}
