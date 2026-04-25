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

  const statItems = [
    { n: stats.nucleos || 312, label: tStats('nucleos') },
    { n: stats.groups || 68, label: tStats('groups') },
    { n: stats.educators || 1248, label: tStats('educators') },
    { n: stats.countries || 44, label: locale === 'pt' ? 'Países' : locale === 'en' ? 'Countries' : 'Países' },
  ]

  const lanes = [
    {
      tag: locale === 'en' ? 'Map' : 'Mapa',
      n: stats.nucleos || 312,
      name: locale === 'en' ? 'Nucleos' : 'Núcleos',
      desc: locale === 'pt'
        ? 'Espaços onde se treina. Endereço, horários, responsável e contato direto.'
        : locale === 'en'
        ? 'Training spaces. Address, schedule, responsible, and direct contact.'
        : 'Espacios donde se entrena. Dirección, horarios, responsable y contacto directo.',
      tone: '#FBE7DC',
      href: `/${locale}/map`,
    },
    {
      tag: locale === 'en' ? 'Communities' : 'Comunidades',
      n: stats.groups || 68,
      name: locale === 'en' ? 'Groups' : 'Grupos',
      desc: locale === 'pt'
        ? 'A organização por trás do cordel. Sistema de graduação, países e núcleos.'
        : locale === 'en'
        ? 'The lineage behind the cord. Graduation system, countries, and nucleos.'
        : 'La organización detrás del cordel. Sistema de graduación, países y núcleos.',
      tone: '#DDE8DD',
      href: `/${locale}/map?filter=groups`,
    },
    {
      tag: locale === 'en' ? 'People' : 'Personas',
      n: stats.educators || 1248,
      name: locale === 'en' ? 'Educators' : 'Educadores',
      desc: locale === 'pt'
        ? 'Mestres e professores com sua corda, núcleo e canal de contato real.'
        : locale === 'en'
        ? 'Masters and teachers with their cord, nucleo, and real contact channel.'
        : 'Maestros y profesores con su corda, su núcleo y un canal real de contacto.',
      tone: '#F0E5C8',
      href: `/${locale}/educators`,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />

      {/* ── HERO ── */}
      <section className="px-5 pt-14 pb-6 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          {/* Left: headline */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent"
                style={{ boxShadow: '0 0 0 4px rgba(217,84,43,0.12)' }}
              />
              <span
                className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent-ink"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Directorio global · Capoeira viva
              </span>
            </div>
            <h1 className="text-[clamp(48px,7vw,86px)] leading-[0.93] tracking-[-0.035em] text-text">
              {locale === 'en' ? (
                <>Find <em className="italic text-accent">capoeira</em><br />near you.</>
              ) : locale === 'pt' ? (
                <>Encontre <em className="italic text-accent">capoeira</em><br />perto de você.</>
              ) : (
                <>Encuentra <em className="italic text-accent">capoeira</em><br />cerca de tu casa.</>
              )}
            </h1>
            <p className="mt-6 max-w-[480px] text-[17px] leading-[1.6] text-text-secondary">
              {locale === 'en'
                ? 'Nucleos, groups and educators in 44 countries. Whether you\'re starting from zero or keeping the rhythm while traveling.'
                : locale === 'pt'
                ? 'Núcleos, grupos e educadores em 44 países. Para começar do zero ou manter o ritmo quando está viajando.'
                : 'Núcleos, grupos y educadores en 44 países. Para empezar de cero, o para no perder el ritmo cuando estás de viaje.'}
            </p>
          </div>

          {/* Right: live stats card */}
          <div className="flex flex-col items-start lg:items-end">
            <div className="w-full max-w-[320px] rounded-[22px] border border-border bg-card p-5" style={{ boxShadow: 'var(--shadow-md)' }}>
              <div
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-text-muted"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-green"
                  style={{ boxShadow: '0 0 0 4px var(--green-soft)' }}
                />
                {locale === 'en' ? 'Live · updated today' : locale === 'pt' ? 'Ao vivo · atualizado hoje' : 'En vivo · actualizado hoy'}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {statItems.map(({ n, label }) => (
                  <div key={label}>
                    <div
                      className="text-[34px] leading-none tracking-[-0.02em] text-text"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {n.toLocaleString()}
                    </div>
                    <div
                      className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-text-muted"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto mt-10 max-w-[1280px]">
          <HeroSearch />
        </div>
      </section>

      {/* Berimbau separator */}
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-16 mt-10">
        <div className="berimbau-line" />
      </div>

      {/* ── THREE LANES ── */}
      <section className="px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-6 flex items-baseline gap-3">
            <span
              className="text-[12px] text-text-faint"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              01 / {locale === 'en' ? 'Explore' : 'Explorar'}
            </span>
            <h2 className="text-[26px] text-text">
              {locale === 'en'
                ? 'Three ways into the directory.'
                : locale === 'pt'
                ? 'Três portas de entrada no diretório.'
                : 'Tres puertas de entrada al directorio.'}
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {lanes.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="relative block overflow-hidden rounded-[22px] border border-border bg-card p-7 transition-colors hover:border-text/20"
              >
                <div
                  className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-60"
                  style={{ background: c.tone }}
                />
                <div className="relative">
                  <span
                    className="rounded-[4px] bg-surface-muted px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-text-muted"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {c.tag}
                  </span>
                  <div className="mt-8">
                    <div
                      className="text-[52px] leading-[0.9] tracking-[-0.03em] text-text"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {c.n.toLocaleString()}
                    </div>
                    <h3 className="mt-2 text-[24px] text-text">{c.name}</h3>
                  </div>
                  <p className="mt-3 text-[14px] leading-[1.6] text-text-secondary">{c.desc}</p>
                  <div className="mt-6 flex items-center gap-1.5 text-[13px] font-medium text-accent-ink">
                    {locale === 'en' ? 'Open directory' : locale === 'pt' ? 'Abrir diretório' : 'Abrir directorio'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOR EDUCATORS ── */}
      <section className="px-5 pb-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-6 rounded-[22px] bg-text p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span
                className="text-[11px] uppercase tracking-[0.18em] text-bg opacity-70"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {locale === 'en' ? 'For educators' : locale === 'pt' ? 'Para educadores' : 'Para educadores'}
              </span>
              <h3
                className="mt-3 text-[26px] text-bg"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
              >
                {locale === 'en'
                  ? "Is your nucleo missing from the map?"
                  : locale === 'pt'
                  ? 'Seu núcleo ainda não está no mapa?'
                  : '¿Tu núcleo no está en el mapa?'}
              </h3>
              <p className="mt-2 max-w-[480px] text-[14px] leading-[1.6] text-bg opacity-75">
                {locale === 'en'
                  ? 'Download the app, register your nucleo in 3 minutes and appear here. Human verification, free.'
                  : locale === 'pt'
                  ? 'Baixe o app, registre seu núcleo em 3 minutos e apareça aqui. Verificação humana, grátis.'
                  : 'Descarga la app, registra tu núcleo en 3 minutos y aparece aquí. Verificación humana, gratis.'}
              </p>
            </div>
            <Link
              href={`/${locale}/app`}
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-accent px-6 text-[13px] font-medium text-white transition-all hover:opacity-90"
            >
              {locale === 'en' ? 'Download app' : locale === 'pt' ? 'Baixar app' : 'Descargar app'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-auto border-t border-border py-10">
        <div className="page-shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[460px]">
            <span
              className="text-[11px] uppercase tracking-[0.24em] text-text-muted"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Agenda Capoeiragem
            </span>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {tFooter('credits')}
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-text-muted md:items-end">
            <span className="text-[11px]" style={{ fontFamily: 'var(--font-mono)' }}>
              © 2026 Agenda Capoeiragem
            </span>
            <div className="flex gap-5 text-[11px] font-medium uppercase tracking-[0.18em]">
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
