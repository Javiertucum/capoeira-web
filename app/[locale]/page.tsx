import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import HeroSearch from '@/components/public/HeroSearch'
import { getLanguageAlternates, getLocalizedUrl, getSiteDescription, getOgImageUrl, buildWebSiteSchema } from '@/lib/site'
import type { StatsData } from '@/lib/types'

export const revalidate = 300

type Props = Readonly<{
  params: Promise<{ locale: string }>
}>

const EMPTY_STATS: StatsData = {
  nucleos: 0,
  groups: 0,
  educators: 0,
  countries: 0,
}

const META_TITLES = {
  es: 'Directorio de Capoeira — Grupos, Núcleos y Educadores en el Mundo',
  pt: 'Diretório de Capoeira — Grupos, Núcleos e Educadores no Mundo',
  en: 'Capoeira Directory — Groups, Nucleos & Educators Worldwide',
} as const

const META_DESCRIPTIONS = {
  es: 'Encuentra grupos de capoeira, núcleos de entrenamiento y educadores en todo el mundo.',
  pt: 'Encontre grupos de capoeira, núcleos de treino e educadores em todo o mundo.',
  en: 'Find capoeira groups, training nucleos, and educators worldwide.',
} as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const title = META_TITLES[locale as keyof typeof META_TITLES] ?? META_TITLES.es
  const description = META_DESCRIPTIONS[locale as keyof typeof META_DESCRIPTIONS] ?? getSiteDescription(locale)
  const ogImage = getOgImageUrl({ title: 'Agenda Capoeiragem', sub: description.slice(0, 80) })

  return {
    title,
    description,
    alternates: {
      canonical: getLocalizedUrl(locale),
      languages: getLanguageAlternates(),
    },
    openGraph: {
      title,
      description,
      url: getLocalizedUrl(locale),
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params

  const [tHero, tStats, tNav, tFooter] = await Promise.all([
    getTranslations({ locale, namespace: 'hero' }),
    getTranslations({ locale, namespace: 'stats' }),
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'footer' }),
  ])

  let stats = EMPTY_STATS
  try {
    const { getStats } = await import('@/lib/queries')
    stats = await getStats()
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Stats unavailable', error)
  }

  const webSiteSchema = buildWebSiteSchema(locale)

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />

      <main className="flex flex-1 flex-col items-center justify-center px-5 py-16 sm:px-8">
        <div className="w-full max-w-[560px] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
            Agenda Capoeiragem
          </p>

          <h1 className="mt-3 text-[clamp(28px,5vw,40px)] font-semibold leading-[1.1] tracking-[-0.04em] text-text">
            {tHero('eyebrow')}
          </h1>

          <div className="mt-8">
            <HeroSearch />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-text-secondary">
            <span>
              <strong className="font-semibold text-text">{stats.nucleos.toLocaleString()}</strong>{' '}
              {tStats('nucleos')}
            </span>
            <span className="text-border" aria-hidden="true">·</span>
            <span>
              <strong className="font-semibold text-text">{stats.groups.toLocaleString()}</strong>{' '}
              {tStats('groups')}
            </span>
            <span className="text-border" aria-hidden="true">·</span>
            <span>
              <strong className="font-semibold text-text">{stats.educators.toLocaleString()}</strong>{' '}
              {tStats('educators')}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${locale}/map`}
              className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-black transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {tNav('map')}
            </Link>
            <Link
              href={`/${locale}/educators`}
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card/60 px-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-text-secondary transition-all hover:border-accent/25 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {tNav('educators')}
            </Link>
            <Link
              href={`/${locale}/map?filter=groups`}
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card/60 px-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-text-secondary transition-all hover:border-accent/25 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {tNav('groups')}
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[460px]">
            <span className="text-[12px] font-semibold uppercase tracking-[0.24em] text-accent">
              Agenda Capoeiragem
            </span>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {tFooter('credits')}
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-text-muted md:items-end">
            <span>© 2026 Agenda Capoeiragem</span>
            <div className="flex gap-5 text-[11px] font-semibold uppercase tracking-[0.18em]">
              <Link href={`/${locale}/privacy`} className="transition-colors hover:text-text">
                {tFooter('privacy')}
              </Link>
              <Link href={`/${locale}/terms`} className="transition-colors hover:text-text">
                {tFooter('terms')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
