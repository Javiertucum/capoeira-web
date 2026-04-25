import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import HeroSearch from '@/components/public/HeroSearch'
import {
  getLanguageAlternates, getLocalizedUrl, getSiteDescription,
  getOgImageUrl, buildWebSiteSchema,
} from '@/lib/site'
import type { StatsData } from '@/lib/types'

export const revalidate = 300

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const EMPTY_STATS: StatsData = { nucleos: 0, groups: 0, educators: 0, countries: 0 }

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
    title, description,
    alternates: { canonical: getLocalizedUrl(locale), languages: getLanguageAlternates() },
    openGraph: { title, description, url: getLocalizedUrl(locale), type: 'website', images: [{ url: ogImage, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

/* ── lane content per locale ── */
function getLanes(locale: string, stats: StatsData) {
  const t = {
    es: {
      lanes: [
        { tag: 'Mapa',        name: 'Núcleos',     desc: 'Espacios donde se entrena. Dirección, horarios, responsable y contacto directo.', tone: '#FBE7DC', icon: '📍', href: '/map' },
        { tag: 'Comunidades', name: 'Grupos',       desc: 'La organización detrás del cordel. Sistema de graduación, países y núcleos asociados.', tone: '#DDE8DD', icon: '🤝', href: '/map?filter=groups' },
        { tag: 'Personas',    name: 'Educadores',   desc: 'Maestros y profesores con su corda, su núcleo y un canal real de contacto.', tone: '#F0E5C8', icon: '👤', href: '/educators' },
      ],
      openDir: 'Abrir directorio',
    },
    pt: {
      lanes: [
        { tag: 'Mapa',        name: 'Núcleos',     desc: 'Espaços onde se treina. Endereço, horários, responsável e contato direto.', tone: '#FBE7DC', icon: '📍', href: '/map' },
        { tag: 'Comunidades', name: 'Grupos',       desc: 'A organização por trás do cordel. Sistema de graduação, países e núcleos associados.', tone: '#DDE8DD', icon: '🤝', href: '/map?filter=groups' },
        { tag: 'Pessoas',     name: 'Educadores',   desc: 'Mestres e professores com sua corda, seu núcleo e canal real de contato.', tone: '#F0E5C8', icon: '👤', href: '/educators' },
      ],
      openDir: 'Abrir diretório',
    },
    en: {
      lanes: [
        { tag: 'Map',         name: 'Nucleos',     desc: 'Training spaces. Address, schedule, responsible educator, and direct contact.', tone: '#FBE7DC', icon: '📍', href: '/map' },
        { tag: 'Communities', name: 'Groups',       desc: 'The lineage behind the cord. Graduation system, countries, and nucleos.', tone: '#DDE8DD', icon: '🤝', href: '/map?filter=groups' },
        { tag: 'People',      name: 'Educators',   desc: 'Masters and teachers with their cord, nucleo, and a real contact channel.', tone: '#F0E5C8', icon: '👤', href: '/educators' },
      ],
      openDir: 'Open directory',
    },
  }
  const loc = t[locale as keyof typeof t] ?? t.es
  return loc.lanes.map((l, i) => ({
    ...l,
    n: i === 0 ? stats.nucleos : i === 1 ? stats.groups : stats.educators,
    href: `/${locale}${l.href}`,
  }))
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params

  const [tHero, tStats, tFooter] = await Promise.all([
    getTranslations({ locale, namespace: 'hero' }),
    getTranslations({ locale, namespace: 'stats' }),
    getTranslations({ locale, namespace: 'footer' }),
  ])

  let stats = EMPTY_STATS
  try {
    const { getStats } = await import('@/lib/queries')
    stats = await getStats()
  } catch {
    if (process.env.NODE_ENV === 'development') console.error('Stats unavailable')
  }

  const webSiteSchema = buildWebSiteSchema(locale)
  const lanes = getLanes(locale, stats)

  const statItems = [
    { n: stats.nucleos,    label: tStats('nucleos') },
    { n: stats.groups,     label: tStats('groups') },
    { n: stats.educators,  label: tStats('educators') },
    { n: stats.countries,  label: locale === 'en' ? 'Countries' : 'Países' },
  ]

  const heroText = {
    es: { before: 'Encuentra', em: 'capoeira', after: '\ncerca de tu casa.' },
    pt: { before: 'Encontre', em: 'capoeira', after: '\nperto de você.' },
    en: { before: 'Find', em: 'capoeira', after: '\nnear you.' },
  }[locale] ?? { before: 'Encuentra', em: 'capoeira', after: '\ncerca de tu casa.' }

  const bodyText = {
    es: 'Núcleos, grupos y educadores en 44 países. Para empezar de cero, o para no perder el ritmo cuando estás de viaje.',
    pt: 'Núcleos, grupos e educadores em 44 países. Para começar do zero ou manter o ritmo quando estiver viajando.',
    en: 'Nucleos, groups and educators in 44 countries. Whether starting from scratch or keeping the rhythm while traveling.',
  }[locale] ?? ''

  const liveLabel = locale === 'en' ? 'Live · updated today' : locale === 'pt' ? 'Ao vivo · atualizado hoje' : 'En vivo · actualizado hoy'

  const explorarLabel = {
    es: '01 / Explorar', pt: '01 / Explorar', en: '01 / Explore',
  }[locale] ?? '01 / Explorar'

  const tresPuertasLabel = {
    es: 'Tres puertas de entrada al directorio.',
    pt: 'Três portas de entrada no diretório.',
    en: 'Three ways into the directory.',
  }[locale] ?? 'Tres puertas de entrada al directorio.'

  const mapaTeaserLabel = {
    es: 'Mapa global', pt: 'Mapa global', en: 'Global map',
  }[locale] ?? 'Mapa global'

  const abrirMapaLabel = { es: 'Abrir mapa', pt: 'Abrir mapa', en: 'Open map' }[locale] ?? 'Abrir mapa'

  const ciudadLabel = { es: 'Ciudad de la semana', pt: 'Cidade da semana', en: 'City of the week' }[locale] ?? 'Ciudad de la semana'

  const paraEdLabel = { es: 'Para educadores', pt: 'Para educadores', en: 'For educators' }[locale] ?? 'Para educadores'
  const nucleoNoLabel = { es: '¿Tu núcleo no está en el mapa?', pt: 'Seu núcleo não está no mapa?', en: "Is your nucleo missing?" }[locale] ?? ''
  const nucleoBodyLabel = {
    es: 'Descarga la app, registra tu núcleo en 3 minutos y aparece aquí. Verificación humana, gratis.',
    pt: 'Baixe o app, registre seu núcleo em 3 minutos e apareça aqui. Verificação humana, grátis.',
    en: 'Download the app, register your nucleo in 3 minutes and appear here. Human verification, free.',
  }[locale] ?? ''
  const descargarLabel = { es: 'Descargar app', pt: 'Baixar app', en: 'Download app' }[locale] ?? ''

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />

      {/* ── HERO ── */}
      <section className="px-5 pt-14 pb-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left: headline */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="berimbau-dot" />
                <div className="flex flex-col">
                  <span className="eyebrow acc text-[10px] tracking-[0.25em]">Elegir día — Domingo</span>
                  <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-4">Capoeira Viva</span>
                </div>
              </div>
              <h1 style={{ fontSize: 'clamp(54px, 8vw, 110px)', lineHeight: 0.88, letterSpacing: '-0.05em' }}>
                {heroText.before} <em className="italic">{heroText.em}</em><br />
                {heroText.after.replace('\n', '')}
              </h1>
              <p className="mt-8 max-w-[520px] text-[19px] leading-[1.6] text-ink-2">
                {bodyText}
              </p>
              {/* Search bar integrated in hero for desktop */}
              <div className="mt-10 max-w-[600px]">
                <HeroSearch />
              </div>
            </div>

            {/* Right: stats card stylized */}
            <div className="hidden lg:flex justify-end">
              <div className="card-ink w-full max-w-[360px] p-8 shadow-lg" style={{ borderRadius: 'var(--radius-xl)' }}>
                <div className="mono mb-6 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] opacity-80">
                  <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
                  {liveLabel}
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                  {statItems.map(({ n, label }) => (
                    <div key={label}>
                      <div className="text-[44px] font-black leading-none tracking-[-0.04em] text-bg" style={{ fontFamily: 'var(--font-display)' }}>
                        {n.toLocaleString()}
                      </div>
                      <div className="mono mt-2 text-[10px] uppercase tracking-[0.2em] opacity-60">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berimbau separator */}
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-16 mt-10">
        <div className="berimbau-line" />
      </div>

      {/* ── TRES PUERTAS ── */}
      <section className="px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="section-head">
            <span className="num">{explorarLabel}</span>
            <h2>{tresPuertasLabel}</h2>
            <span className="rule" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {lanes.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="card group relative block overflow-hidden p-7 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ ['--shadow-md' as string]: 'var(--shadow-md)' }}
              >
                {/* Tonal blob */}
                <div
                  className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-60"
                  style={{ background: c.tone }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="tag-mono">{c.tag}</span>
                    <span
                      className="grid h-9 w-9 place-items-center rounded-[12px] bg-ink text-bg"
                      aria-hidden="true"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-8">
                    <div
                      className="text-[52px] leading-[0.9] tracking-[-0.03em] text-ink"
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}
                    >
                      {c.n.toLocaleString()}
                    </div>
                    <h3 className="mt-2 text-[26px] text-ink">{c.name}</h3>
                  </div>
                  <p className="mt-3 text-[14px] leading-[1.6] text-ink-2">{c.desc}</p>
                  <div className="mt-6 flex items-center gap-2 text-[13px] font-medium text-accent-ink">
                    {lanes[0]?.href.includes('/map') && c.href === lanes[0]?.href
                      ? (locale === 'en' ? 'Open directory' : locale === 'pt' ? 'Abrir diretório' : 'Abrir directorio')
                      : (locale === 'en' ? 'Open directory' : locale === 'pt' ? 'Abrir diretório' : 'Abrir directorio')}
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

      {/* ── MAPA TEASER + SIDEBAR ── */}
      <section className="px-5 pb-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-7 lg:grid-cols-[1.4fr_1fr]">
            {/* Mapa card */}
            <div className="card p-[22px]">
              <div className="mb-3 flex items-baseline justify-between">
                <div>
                  <span className="tag-mono">{mapaTeaserLabel}</span>
                  <h3 className="mt-2.5 text-[24px] text-ink">
                    {stats.nucleos.toLocaleString()} {locale === 'en' ? 'nucleos in' : 'núcleos en'} {stats.countries} {locale === 'en' ? 'countries.' : 'países.'}
                  </h3>
                </div>
                <Link
                  href={`/${locale}/map`}
                  className="btn btn-ghost btn-sm"
                >
                  {abrirMapaLabel}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              {/* Map placeholder — will be real map in production */}
              <div
                className="img-ph relative overflow-hidden"
                style={{ height: 300, borderRadius: 'var(--radius-lg)' }}
              >
                MAPA
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Ciudad de la semana */}
              <div className="card-paper p-6">
                <span className="tag-mono">{ciudadLabel}</span>
                <h3 className="mt-3 text-[32px] text-ink">Salvador, BA</h3>
                <p className="text-[13px] text-ink-2 mt-1">17 núcleos · 9 grupos representados</p>
                <div className="berimbau-line my-5" />
                <div className="flex flex-col gap-3">
                  {[
                    'Pelourinho · Mestre Bimba',
                    'Forte da Capoeira · Angola Palmares',
                    'Rio Vermelho · GCAP',
                  ].map((l) => (
                    <div key={l} className="flex items-center justify-between">
                      <span className="text-[14px] text-ink">{l}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-ink-3" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card-ink educadores */}
              <div className="card-ink p-6">
                <div className="mono mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] opacity-70">
                  {paraEdLabel}
                </div>
                <h3 className="text-[26px] text-bg">{nucleoNoLabel}</h3>
                <p className="mt-2.5 text-[14px] leading-[1.55] text-bg opacity-75">
                  {nucleoBodyLabel}
                </p>
                <Link
                  href={`/${locale}/app`}
                  className="btn btn-accent mt-5"
                >
                  {descargarLabel}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-auto border-t border-line-soft py-10">
        <div className="page-shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[420px]">
            <span className="eyebrow block mb-3">Agenda Capoeiragem</span>
            <p className="text-sm leading-7 text-ink-2">{tFooter('credits')}</p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-ink-3 md:items-end">
            <span className="mono text-[11px]">© 2026 Agenda Capoeiragem</span>
            <div className="flex gap-5 text-[11px] font-medium uppercase tracking-[0.18em]">
              <Link href={`/${locale}/privacy`} className="transition-colors hover:text-ink">{tFooter('privacy')}</Link>
              <Link href={`/${locale}/terms`}   className="transition-colors hover:text-ink">{tFooter('terms')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
