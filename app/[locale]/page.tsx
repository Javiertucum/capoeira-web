import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import CategoryCards from '@/components/public/CategoryCards'
import EducatorCard from '@/components/public/EducatorCard'
import HeroSearch from '@/components/public/HeroSearch'
import StatsBar from '@/components/public/StatsBar'
import SectionLabel from '@/components/ui/SectionLabel'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getLocalizedUrl, getSiteDescription, getOgImageUrl, buildWebSiteSchema } from '@/lib/site'
import AdDisplay from '@/components/ads/AdDisplay'
import type { PublicUserProfile, StatsData } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = Readonly<{
  params: Promise<{ locale: string }>
}>

const EMPTY_STATS: StatsData = {
  nucleos: 0,
  groups: 0,
  educators: 0,
  countries: 0,
}

const EMPTY_EDUCATORS: PublicUserProfile[] = []

const META_TITLES = {
  es: 'Directorio de Capoeira — Grupos, Núcleos y Educadores en el Mundo',
  pt: 'Diretório de Capoeira — Grupos, Núcleos e Educadores no Mundo',
  en: 'Capoeira Directory — Groups, Nucleos & Educators Worldwide',
} as const

const META_DESCRIPTIONS = {
  es: 'Encuentra grupos de capoeira, núcleos de entrenamiento y educadores en todo el mundo. El directorio más completo de la comunidad capoeirista global.',
  pt: 'Encontre grupos de capoeira, núcleos de treino e educadores em todo o mundo. O diretório mais completo da comunidade capoeirista global.',
  en: 'Find capoeira groups, training nucleos, and educators worldwide. The most complete directory of the global capoeira community.',
} as const

const LANDING_COPY = {
  es: {
    heroTag: 'Directorio vivo para la comunidad',
    heroLead:
      'Explora lugares de entrenamiento, grupos y educadores con una experiencia pensada primero para descubrir y luego para conectar.',
    heroPrimary: 'Abrir mapa',
    heroSecondary: 'Conocer la app',
    panelEyebrow: 'Pulso de la comunidad',
    panelTitle: 'Una portada mas util para entrar a la capoeira global.',
    panelBody:
      'La idea no es solo listar perfiles. Queremos ayudarte a encontrar una roda, entender quien esta detras y decidir si ese espacio encaja contigo.',
    panelPoints: [
      'Busqueda directa por ciudad, pais o grupo',
      'Perfiles con mas contexto y menos relleno',
      'Mapa y lista adaptados al uso movil real',
    ],
    categoriesLead:
      'Empieza por el tipo de entrada que mejor responda a tu busqueda.',
    educatorsLead:
      'Perfiles publicos con mejor jerarquia visual, enlaces utiles y acceso rapido a sus espacios de entrenamiento.',
    ctaEyebrow: 'App preview',
    ctaTitle: 'La app viene despues de una web que ya sirva de verdad.',
    ctaBody:
      'Mientras cerramos enlaces definitivos de descarga, la web ya puede funcionar como puerta de entrada para descubrir la comunidad.',
    ctaPoints: ['Explora el directorio', 'Conoce grupos', 'Descubre educadores'],
    footerNote: 'Datos y perfiles impulsados por la comunidad Agenda Capoeiragem.',
    featured: 'Educador destacado',
    featuredAction: 'Ver perfil',
    phoneTitle: 'Companion movil',
    phoneCards: [
      'Descubre clases y comunidades',
      'Ten perfiles y enlaces mas a mano',
      'Sigue el mapa global desde tu telefono',
    ],
  },
  pt: {
    heroTag: 'Diretorio vivo para a comunidade',
    heroLead:
      'Explore locais de treino, grupos e educadores com uma experiencia pensada primeiro para descobrir e depois para conectar.',
    heroPrimary: 'Abrir mapa',
    heroSecondary: 'Conhecer o app',
    panelEyebrow: 'Pulso da comunidade',
    panelTitle: 'Uma capa mais util para entrar na capoeira global.',
    panelBody:
      'A ideia nao e apenas listar perfis. Queremos ajudar voce a encontrar uma roda, entender quem esta por tras e decidir se esse espaco combina com voce.',
    panelPoints: [
      'Busca direta por cidade, pais ou grupo',
      'Perfis com mais contexto e menos vazio',
      'Mapa e lista adaptados ao uso movel real',
    ],
    categoriesLead:
      'Comece pelo tipo de entrada que melhor responda a sua busca.',
    educatorsLead:
      'Perfis publicos com melhor hierarquia visual, links uteis e acesso rapido aos seus espacos de treino.',
    ctaEyebrow: 'App preview',
    ctaTitle: 'O app vem depois de uma web que ja sirva de verdade.',
    ctaBody:
      'Enquanto fechamos os links definitivos de download, a web ja pode funcionar como porta de entrada para descobrir a comunidade.',
    ctaPoints: ['Explorar o diretorio', 'Conhecer grupos', 'Descobrir educadores'],
    footerNote: 'Dados e perfis impulsionados pela comunidade Agenda Capoeiragem.',
    featured: 'Educador em destaque',
    featuredAction: 'Ver perfil',
    phoneTitle: 'Companion movel',
    phoneCards: [
      'Descubra aulas e comunidades',
      'Tenha perfis e links mais a mao',
      'Acompanhe o mapa global pelo celular',
    ],
  },
  en: {
    heroTag: 'A living directory for the community',
    heroLead:
      'Explore training spots, groups, and educators through a public experience built first for discovery and then for connection.',
    heroPrimary: 'Open map',
    heroSecondary: 'See the app',
    panelEyebrow: 'Community pulse',
    panelTitle: 'A more useful front door into global capoeira.',
    panelBody:
      'The goal is not only to list profiles. It is to help people find a roda, understand who is behind it, and decide whether that space feels right.',
    panelPoints: [
      'Direct search by city, country, or group',
      'Profiles with more context and less filler',
      'Map and list tuned for real mobile usage',
    ],
    categoriesLead:
      'Start from the entry point that best matches what you are looking for.',
    educatorsLead:
      'Public profiles with clearer hierarchy, useful links, and fast access to the training spaces they teach in.',
    ctaEyebrow: 'App preview',
    ctaTitle: 'The app should come after the web is already genuinely useful.',
    ctaBody:
      'While the final store links are being prepared, the web can already act as the front door for discovering the community.',
    ctaPoints: ['Explore the directory', 'Meet groups', 'Discover educators'],
    footerNote: 'Profiles and directory data powered by the Agenda Capoeiragem community.',
    featured: 'Featured educator',
    featuredAction: 'View profile',
    phoneTitle: 'Mobile companion',
    phoneCards: [
      'Discover classes and communities',
      'Keep profiles and links close',
      'Follow the global map from your phone',
    ],
  },
} as const

function getCopy(locale: string) {
  return LANDING_COPY[locale as keyof typeof LANDING_COPY] ?? LANDING_COPY.en
}

function getDisplayName(educator: PublicUserProfile) {
  const fullName = [educator.name, educator.surname].filter(Boolean).join(' ').trim()
  return educator.nickname?.trim() || fullName || educator.uid
}

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
  const copy = getCopy(locale)

  const [tHero, tCategories, tEducators, tCta, tFooter] = await Promise.all([
    getTranslations({ locale, namespace: 'hero' }),
    getTranslations({ locale, namespace: 'categories' }),
    getTranslations({ locale, namespace: 'educators' }),
    getTranslations({ locale, namespace: 'cta' }),
    getTranslations({ locale, namespace: 'footer' }),
  ])

  let stats = EMPTY_STATS
  let educators = EMPTY_EDUCATORS

  try {
    const { getFeaturedEducators, getStats } = await import('@/lib/queries')
    ;[stats, educators] = await Promise.all([getStats(), getFeaturedEducators()])
  } catch (error) {
    console.error('Landing data unavailable, rendering fallback content.', error)
  }

  const featuredEducator = educators[0] ?? null

  const webSiteSchema = buildWebSiteSchema(locale)

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <section className="relative isolate overflow-hidden px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pb-24">
        <div
          aria-hidden="true"
          className="absolute left-[-120px] top-[-100px] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(208,162,96,0.08)_0%,rgba(208,162,96,0)_72%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute right-[-100px] top-[-80px] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(132,201,122,0.08)_0%,rgba(132,201,122,0)_72%)] blur-2xl"
        />

        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
            <div className="rounded-[30px] border border-border bg-card px-6 py-7 shadow-sm sm:px-8 sm:py-9">
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                <span className="h-px w-8 bg-accent/40" />
                {copy.heroTag}
              </p>

              <h1 className="mt-6 max-w-[12ch] text-[clamp(50px,10vw,104px)] font-semibold leading-[0.9] tracking-[-0.07em] text-text">
                {tHero('title')}{' '}
                <span className="text-accent">{tHero('titleAccent')}</span>
              </h1>

              <p className="mt-6 max-w-[60ch] text-[clamp(16px,2vw,21px)] leading-8 text-text-secondary">
                {copy.heroLead}
              </p>

              <div className="mt-8">
                <HeroSearch />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/map`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card/80 px-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-accent/25 hover:text-text"
                >
                  {copy.heroPrimary}
                </Link>
                <Link
                  href={`/${locale}/app`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card/80 px-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-accent/25 hover:text-text"
                >
                  {copy.heroSecondary}
                </Link>
              </div>
            </div>

            <aside className="rounded-[30px] border border-border bg-card p-6 shadow-sm sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                {copy.panelEyebrow}
              </p>
              <h2 className="mt-4 text-[clamp(28px,5vw,42px)] font-semibold leading-[1.02] tracking-[-0.05em] text-text">
                {copy.panelTitle}
              </h2>
              <p className="mt-5 text-sm leading-7 text-text-secondary">{copy.panelBody}</p>

              <div className="mt-6 space-y-3">
                {copy.panelPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-[18px] border border-border bg-surface/60 px-4 py-3"
                  >
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-sm leading-6 text-text-secondary">{point}</span>
                  </div>
                ))}
              </div>

              {featuredEducator ? (
                <div className="mt-6 rounded-[22px] border border-border bg-surface/45 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                    {copy.featured}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="relative h-[64px] w-[64px] overflow-hidden rounded-[20px] border border-accent/20 bg-[rgba(121,207,114,0.14)]">
                      {featuredEducator.avatarUrl ? (
                        <img
                          src={featuredEducator.avatarUrl}
                          alt={getDisplayName(featuredEducator)}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-semibold uppercase tracking-[0.12em] text-accent">
                          {getDisplayName(featuredEducator).slice(0, 2)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-semibold text-text">
                        {getDisplayName(featuredEducator)}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {featuredEducator.country || 'Agenda Capoeiragem'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/educator/${featuredEducator.uid}`}
                    className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
                  >
                    {copy.featuredAction}
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
                </div>
              ) : null}
            </aside>
          </div>

          <div className="mt-8">
            <StatsBar locale={locale} stats={stats} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8 lg:px-12">
        <SectionLabel>{tCategories('title')}</SectionLabel>
        <div className="mb-8 max-w-[720px]">
          <h2 className="text-[clamp(30px,5vw,46px)] font-semibold leading-[1.02] tracking-[-0.05em] text-text">
            {tCategories('title')}
          </h2>
          <p className="mt-4 text-base leading-8 text-text-secondary">{copy.categoriesLead}</p>
        </div>
        <CategoryCards locale={locale} stats={stats} />
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:px-12">
        <SectionLabel>{tEducators('featured')}</SectionLabel>
        <div className="mb-8 max-w-[760px]">
          <h2 className="text-[clamp(30px,5vw,46px)] font-semibold leading-[1.02] tracking-[-0.05em] text-text">
            {tEducators('featured')}
          </h2>
          <p className="mt-4 text-base leading-8 text-text-secondary">{copy.educatorsLead}</p>
        </div>

        {educators.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {educators.slice(0, 4).map((educator) => (
              <EducatorCard key={educator.uid} educator={educator} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-border bg-card/70 px-6 py-12 text-center text-sm leading-7 text-text-muted">
            {tEducators('empty')}
          </div>
        )}
      </section>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <AdDisplay className="my-4" />
      </div>

      <section className="mx-auto max-w-[1280px] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
        <div className="grid gap-6 rounded-[30px] border border-border bg-card p-6 shadow-sm lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center lg:p-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
              {copy.ctaEyebrow}
            </p>
            <h2 className="mt-4 text-[clamp(30px,5vw,46px)] font-semibold leading-[1.02] tracking-[-0.05em] text-text">
              {copy.ctaTitle}
            </h2>
            <p className="mt-5 max-w-[58ch] text-base leading-8 text-text-secondary">
              {copy.ctaBody}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {copy.ctaPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-border bg-surface px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary"
                >
                  {point}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/${locale}/app`}
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#081019] transition-transform hover:-translate-y-0.5"
              >
                {tCta('download')}
              </Link>
              <Link
                href={`/${locale}/map`}
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-accent/25 hover:text-text"
              >
                {tCta('learnMore')}
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-surface/45 p-5">
            <div className="mx-auto max-w-[240px] rounded-[28px] border border-border bg-bg p-4 shadow-sm">
              <div className="mx-auto h-1.5 w-16 rounded-full bg-border" />
              <div className="mt-5 rounded-[22px] border border-border bg-card p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                  Agenda
                </p>
                <p className="mt-3 text-lg font-semibold text-text">{copy.phoneTitle}</p>
                <div className="mt-4 space-y-3">
                  {copy.phoneCards.map((item) => (
                    <div
                      key={item}
                      className="rounded-[16px] border border-border bg-surface px-3 py-3 text-sm text-text-secondary"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[460px]">
            <span className="text-[12px] font-semibold uppercase tracking-[0.24em] text-accent">
              Agenda Capoeiragem
            </span>
            <p className="mt-3 text-sm leading-7 text-text-secondary">{copy.footerNote}</p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-text-muted md:items-end">
            <span>{`© 2026 | ${tFooter('credits')}`}</span>
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
