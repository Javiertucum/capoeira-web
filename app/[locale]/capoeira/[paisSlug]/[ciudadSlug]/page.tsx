import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  formatPageTitle,
  getLanguageAlternateUrls,
  getLocalizedUrl,
  getOgImageUrl,
  getOgLocale,
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildLocalBusinessSchema,
  SITE_NAME,
  escapeJsonLd,
} from '@/lib/site'
import { getAllNucleos, getNucleosByCity } from '@/lib/queries'
import { slugify } from '@/lib/slugify'
import { getDayShort } from '@/lib/day-short'
import CountryFlag from '@/components/public/CountryFlag'
import Footer from '@/components/public/Footer'

export const revalidate = 3600

type Props = Readonly<{ params: Promise<{ locale: string; paisSlug: string; ciudadSlug: string }> }>

const COPY = {
  es: {
    title: (city: string, country: string) => `Capoeira en ${city}, ${country}`,
    h1: (city: string) => `Clases de capoeira en ${city}`,
    description: (city: string, country: string, n: number) =>
      `Clases de capoeira en ${city}, ${country}. ${n} ${n === 1 ? 'lugar' : 'lugares'} donde entrenar — horarios, dirección y contacto de cada grupo.`,
    keywords: (city: string, country: string) => [
      `capoeira en ${city}`, `clases de capoeira en ${city}`,
      `capoeira ${city} ${country}`, `grupos capoeira ${city}`,
      `dónde entrenar capoeira ${city}`, `capoeira cerca de ${city}`,
      `escuela capoeira ${city}`, `academia capoeira ${city}`,
    ],
    nucleos: 'Lugares para entrenar',
    backCountry: (country: string) => `← Capoeira en ${country}`,
    back: '← Directorio global',
  },
  pt: {
    title: (city: string, country: string) => `Capoeira em ${city}, ${country}`,
    h1: (city: string) => `Aulas de capoeira em ${city}`,
    description: (city: string, country: string, n: number) =>
      `Aulas de capoeira em ${city}, ${country}. ${n} ${n === 1 ? 'local' : 'locais'} para treinar — horários, endereço e contato de cada grupo.`,
    keywords: (city: string, country: string) => [
      `capoeira em ${city}`, `aulas de capoeira em ${city}`,
      `capoeira ${city} ${country}`, `grupos capoeira ${city}`,
      `onde treinar capoeira ${city}`, `capoeira perto de ${city}`,
      `escola capoeira ${city}`, `academia capoeira ${city}`,
    ],
    nucleos: 'Locais para treinar',
    backCountry: (country: string) => `← Capoeira em ${country}`,
    back: '← Diretório global',
  },
  en: {
    title: (city: string, country: string) => `Capoeira in ${city}, ${country}`,
    h1: (city: string) => `Capoeira classes in ${city}`,
    description: (city: string, country: string, n: number) =>
      `Capoeira classes in ${city}, ${country}. ${n} training ${n === 1 ? 'location' : 'locations'} with schedules, addresses and instructor info.`,
    keywords: (city: string, country: string) => [
      `capoeira in ${city}`, `capoeira classes in ${city}`,
      `capoeira ${city} ${country}`, `capoeira groups ${city}`,
      `where to train capoeira ${city}`, `capoeira near ${city}`,
      `capoeira school ${city}`, `capoeira academy ${city}`,
    ],
    nucleos: 'Training locations',
    backCountry: (country: string) => `← Capoeira in ${country}`,
    back: '← Global directory',
  },
  fr: {
    title: (city: string, country: string) => `Capoeira à ${city}, ${country}`,
    h1: (city: string) => `Cours de capoeira à ${city}`,
    description: (city: string, country: string, n: number) =>
      `Cours de capoeira à ${city}, ${country}. ${n} ${n === 1 ? 'lieu' : 'lieux'} où s'entraîner — horaires, adresse et contact de chaque groupe.`,
    keywords: (city: string, country: string) => [
      `capoeira à ${city}`, `cours de capoeira à ${city}`,
      `capoeira ${city} ${country}`, `groupes capoeira ${city}`,
      `où pratiquer la capoeira ${city}`, `capoeira près de ${city}`,
      `école capoeira ${city}`, `académie capoeira ${city}`,
    ],
    nucleos: 'Lieux pour s\'entraîner',
    backCountry: (country: string) => `← Capoeira en ${country}`,
    back: '← Annuaire mondial',
  },
  de: {
    title: (city: string, country: string) => `Capoeira in ${city}, ${country}`,
    h1: (city: string) => `Capoeira-Kurse in ${city}`,
    description: (city: string, country: string, n: number) =>
      `Capoeira-Kurse in ${city}, ${country}. ${n} Trainings${n === 1 ? 'ort' : 'orte'} — Zeitpläne, Adresse und Kontakt für jede Gruppe.`,
    keywords: (city: string, country: string) => [
      `capoeira in ${city}`, `capoeira kurs ${city}`,
      `capoeira ${city} ${country}`, `capoeira gruppen ${city}`,
      `wo capoeira trainieren ${city}`, `capoeira in der nähe ${city}`,
      `capoeira schule ${city}`, `capoeira akademie ${city}`,
    ],
    nucleos: 'Trainingsorte',
    backCountry: (country: string) => `← Capoeira in ${country}`,
    back: '← Globales Verzeichnis',
  },
  it: {
    title: (city: string, country: string) => `Capoeira a ${city}, ${country}`,
    h1: (city: string) => `Corsi di capoeira a ${city}`,
    description: (city: string, country: string, n: number) =>
      `Corsi di capoeira a ${city}, ${country}. ${n} ${n === 1 ? 'luogo' : 'luoghi'} dove allenarsi — orari, indirizzo e contatto di ogni gruppo.`,
    keywords: (city: string, country: string) => [
      `capoeira a ${city}`, `corsi di capoeira a ${city}`,
      `capoeira ${city} ${country}`, `gruppi capoeira ${city}`,
      `dove allenarsi capoeira ${city}`, `capoeira vicino a ${city}`,
      `scuola capoeira ${city}`, `accademia capoeira ${city}`,
    ],
    nucleos: 'Luoghi per allenarsi',
    backCountry: (country: string) => `← Capoeira a ${country}`,
    back: '← Directory globale',
  },
} as const

type Locale = keyof typeof COPY
const getCopy = (locale: string) => COPY[locale as Locale] ?? COPY.es

export async function generateStaticParams() {
  const nucleos = await getAllNucleos().catch(() => [])
  const locales = ['es', 'pt', 'en', 'fr', 'de', 'it']
  const pairs = [...new Map(
    nucleos
      .filter((n) => n.country && n.city)
      .map((n) => {
        const key = `${slugify(n.country!)}/${slugify(n.city!)}`
        return [key, { paisSlug: slugify(n.country!), ciudadSlug: slugify(n.city!) }]
      })
  ).values()]
  return locales.flatMap((locale) => pairs.map(({ paisSlug, ciudadSlug }) => ({ locale, paisSlug, ciudadSlug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, paisSlug, ciudadSlug } = await params
  const data = await getNucleosByCity(paisSlug, ciudadSlug)
  if (!data) return {}

  const c = getCopy(locale)
  const title = c.title(data.cityName, data.countryName)
  const description = c.description(data.cityName, data.countryName, data.nucleos.length)
  const path = `/capoeira/${paisSlug}/${ciudadSlug}`
  // Ciudades con un solo nucleo no tienen contenido unico suficiente —
  // noindex hasta que haya mas datos, para no diluir la calidad del sitio
  // a ojos de revisores de contenido (AdSense, Search Console).
  const hasEnoughContent = data.nucleos.length >= 2

  return {
    title,
    description,
    keywords: c.keywords(data.cityName, data.countryName),
    ...(!hasEnoughContent && { robots: { index: false, follow: true } }),
    alternates: { canonical: getLocalizedUrl(locale, path), languages: getLanguageAlternateUrls(path) },
    openGraph: {
      title: formatPageTitle(title),
      description,
      url: getLocalizedUrl(locale, path),
      type: 'website',
      locale: getOgLocale(locale),
      siteName: SITE_NAME,
      images: [{ url: getOgImageUrl({ title, type: 'default' }), width: 1200, height: 630, alt: title }],
    },
  }
}

export default async function CityPage({ params }: Props) {
  const { locale, paisSlug, ciudadSlug } = await params
  const data = await getNucleosByCity(paisSlug, ciudadSlug)
  if (!data) notFound()

  const c = getCopy(locale)
  const path = `/capoeira/${paisSlug}/${ciudadSlug}`
  const dayShort = getDayShort(locale)

  const breadcrumb = buildBreadcrumbSchema([
    { name: SITE_NAME, url: getLocalizedUrl(locale) },
    { name: c.title(data.countryName, data.countryName), url: getLocalizedUrl(locale, `/capoeira/${paisSlug}`) },
    { name: c.title(data.cityName, data.countryName), url: getLocalizedUrl(locale, path) },
  ])

  const itemList = buildItemListSchema(
    data.nucleos.map((n) => ({
      name: n.name,
      url: getLocalizedUrl(locale, `/nucleos/${n.groupId}/${n.id}`),
      description: n.address ?? [n.city, n.country].filter(Boolean).join(', '),
    })),
    locale
  )

  const locationSchemas = data.nucleos.map((n) =>
    buildLocalBusinessSchema({
      name: `${n.groupName ?? n.name} — ${data.cityName}`,
      url: getLocalizedUrl(locale, `/nucleos/${n.groupId}/${n.id}`),
      description: `Clases de capoeira en ${data.cityName}, ${data.countryName}.`,
      address: n.address,
      city: n.city,
      country: n.country,
      latitude: n.latitude ?? undefined,
      longitude: n.longitude ?? undefined,
      schedules: n.schedules,
    })
  )

  return (
    <main className="min-h-screen bg-bg py-16 lg:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(itemList) }} />
      {locationSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(schema) }} />
      ))}

      <div className="page-shell-narrow">
        <div className="mb-8 flex flex-col gap-1">
          <Link href={`/${locale}/capoeira/${paisSlug}`} className="inline-flex items-center gap-2 text-sm font-bold text-accent-ink hover:underline">
            {c.backCountry(data.countryName)}
          </Link>
        </div>

        <h1 className="font-black text-ink leading-tight tracking-tight" style={{ fontSize: 'clamp(28px, 5vw, 52px)' }}>
          {c.h1(data.cityName)}
        </h1>
        <p className="mt-1 text-sm font-bold text-text-secondary">
          <CountryFlag country={data.countryName} className="mr-1" />
          {data.cityName}, {data.countryName}
        </p>
        <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-text-secondary">
          {c.description(data.cityName, data.countryName, data.nucleos.length)}
        </p>

        <div className="mt-10">
          <p className="eyebrow acc mb-4">{c.nucleos} ({data.nucleos.length})</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.nucleos.map((nucleo) => {
              const sortedSchedules = [...(nucleo.schedules ?? [])].sort(
                (a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)
              )
              return (
                <Link
                  key={nucleo.id}
                  href={`/${locale}/nucleos/${nucleo.groupId}/${nucleo.id}`}
                  className="block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent"
                >
                  <p className="font-bold text-ink">{nucleo.name}</p>
                  {nucleo.groupName && (
                    <p className="mt-0.5 text-xs font-bold text-accent-ink">{nucleo.groupName}</p>
                  )}
                  {nucleo.address && (
                    <p className="mt-2 text-sm text-text-secondary">{nucleo.address}</p>
                  )}
                  {sortedSchedules.length > 0 && (
                    <div className="mt-3 space-y-1 border-t border-border pt-3">
                      {sortedSchedules.map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-text-secondary">
                            {dayShort[s.dayOfWeek] ?? s.dayOfWeek}
                          </span>
                          <span className="text-text-secondary">{s.startTime} – {s.endTime}</span>
                        </div>
                      ))}
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
