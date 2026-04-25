import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getSiteDescription } from '@/lib/site'

type Props = Readonly<{
  params: Promise<{ locale: string }>
}>

const COPY = {
  es: {
    title: 'App',
    eyebrowTag: 'Companion móvil · Agenda Capoeiragem',
    heroEm: 'app',
    heroLine1: 'La',
    heroLine2: 'es donde',
    heroLine3: 'la comunidad se organiza.',
    body: 'Esta web es la cara pública del directorio: cualquiera puede encontrar un núcleo, un educador o un grupo. La app es la cocina: ahí los educadores publican sus datos, gestionan cordas, organizan sus grupos y se conectan entre sí.',
    googlePlay: 'Google Play',
    appStore: 'App Store',
    appStoreSoon: 'Próximamente',
    splitTitle: 'Una sola base de datos, dos puertas.',
    splitNum: '01 / Diferencias',
    webTitle: 'Para encontrar.',
    webTag: 'Web pública',
    webBody: 'Sin login. Indexable. Para alguien que llega a una ciudad nueva, o que recién quiere empezar.',
    webItems: ['Mapa y directorio de núcleos', 'Perfiles públicos de educadores', 'Información de grupos y linajes', 'Contacto directo (WhatsApp, IG)'],
    appTitle: 'Para participar.',
    appTag: 'App móvil',
    appBody: 'Con cuenta. Donde la comunidad publica, organiza, gestiona cordas y se conecta.',
    appItems: ['Crear y gestionar núcleos', 'Sistema de cordas personalizable', 'Agenda de eventos privada', 'Co-organización entre educadores', 'Mensajes y comunidad'],
    ctaTitle: '¿Tu núcleo todavía no aparece?',
    ctaTag: 'Para educadores',
    ctaBody: 'Descarga la app, registra tu núcleo en 3 minutos y aparece publicado automáticamente. Verificación humana, gratis.',
    ctaBtn: 'Descargar app',
    mockupLabel: 'Mi núcleo · Hoy',
    mockupName: 'Pelourinho',
    mockupTag: 'Próximo treino',
    mockupSchedule: 'Hoy 19:00 · Adultos',
    mockupEventTag: 'Evento privado',
    mockupEvent: 'Batizado 2026',
    badgeLabel: 'v1.0 · gratis',
  },
  pt: {
    title: 'App',
    eyebrowTag: 'Companion móvel · Agenda Capoeiragem',
    heroEm: 'app',
    heroLine1: 'O',
    heroLine2: 'é onde',
    heroLine3: 'a comunidade se organiza.',
    body: 'Esta web é a cara pública do diretório: qualquer pessoa pode encontrar um núcleo, educador ou grupo. O app é a cozinha: lá os educadores publicam seus dados, gerenciam cordas e se conectam.',
    googlePlay: 'Google Play',
    appStore: 'App Store',
    appStoreSoon: 'Em breve',
    splitTitle: 'Uma única base de dados, duas portas.',
    splitNum: '01 / Diferenças',
    webTitle: 'Para encontrar.',
    webTag: 'Web pública',
    webBody: 'Sem login. Indexável. Para quem chega a uma cidade nova ou quer começar.',
    webItems: ['Mapa e diretório de núcleos', 'Perfis públicos de educadores', 'Informações de grupos e linagens', 'Contato direto (WhatsApp, IG)'],
    appTitle: 'Para participar.',
    appTag: 'App móvel',
    appBody: 'Com conta. Onde a comunidade publica, organiza, gerencia cordas e se conecta.',
    appItems: ['Criar e gerenciar núcleos', 'Sistema de cordas personalizável', 'Agenda de eventos privada', 'Co-organização entre educadores', 'Mensagens e comunidade'],
    ctaTitle: 'Seu núcleo ainda não aparece?',
    ctaTag: 'Para educadores',
    ctaBody: 'Baixe o app, registre seu núcleo em 3 minutos e apareça publicado automaticamente. Grátis.',
    ctaBtn: 'Baixar app',
    mockupLabel: 'Meu núcleo · Hoje',
    mockupName: 'Pelourinho',
    mockupTag: 'Próximo treino',
    mockupSchedule: 'Hoje 19:00 · Adultos',
    mockupEventTag: 'Evento privado',
    mockupEvent: 'Batizado 2026',
    badgeLabel: 'v1.0 · grátis',
  },
  en: {
    title: 'App',
    eyebrowTag: 'Mobile companion · Agenda Capoeiragem',
    heroEm: 'app',
    heroLine1: 'The',
    heroLine2: 'is where',
    heroLine3: 'the community organizes.',
    body: 'This website is the public face of the directory: anyone can find a nucleo, educator or group. The app is the kitchen: that\'s where educators publish their data, manage cords, and connect with each other.',
    googlePlay: 'Google Play',
    appStore: 'App Store',
    appStoreSoon: 'Coming soon',
    splitTitle: 'One database, two doors.',
    splitNum: '01 / Differences',
    webTitle: 'To find.',
    webTag: 'Public web',
    webBody: 'No login. Indexable. For someone arriving in a new city, or starting from scratch.',
    webItems: ['Map and nucleo directory', 'Public educator profiles', 'Group and lineage information', 'Direct contact (WhatsApp, IG)'],
    appTitle: 'To participate.',
    appTag: 'Mobile app',
    appBody: 'With an account. Where the community publishes, organizes, manages cords and connects.',
    appItems: ['Create and manage nucleos', 'Customizable cord system', 'Private event agenda', 'Co-organization between educators', 'Messages and community'],
    ctaTitle: 'Your nucleo is not listed yet?',
    ctaTag: 'For educators',
    ctaBody: 'Download the app, register your nucleo in 3 minutes and appear published automatically. Free.',
    ctaBtn: 'Download app',
    mockupLabel: 'My nucleo · Today',
    mockupName: 'Pelourinho',
    mockupTag: 'Next class',
    mockupSchedule: 'Today 7pm · Adults',
    mockupEventTag: 'Private event',
    mockupEvent: 'Batizado 2026',
    badgeLabel: 'v1.0 · free',
  },
} as const

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.es
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const copy = getCopy(locale)

  return {
    title: copy.title,
    description: getSiteDescription(locale),
    alternates: {
      canonical: getLocalizedPath(locale, '/app'),
      languages: getLanguageAlternates('/app'),
    },
    openGraph: {
      title: formatPageTitle(copy.title),
      description: getSiteDescription(locale),
      url: getLocalizedPath(locale, '/app'),
      type: 'website',
    },
  }
}

export default async function AppPage({ params }: Props) {
  const { locale } = await params
  const copy = getCopy(locale)

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="page-shell grid gap-14 py-16 lg:grid-cols-[1fr_400px] lg:items-center">
        <div>
          <span
            className="text-[11px] uppercase tracking-[0.18em] text-accent-ink"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {copy.eyebrowTag}
          </span>
          <h1 className="mt-4 text-[clamp(44px,6vw,76px)] leading-[0.94] tracking-[-0.03em] text-text">
            {copy.heroLine1}{' '}
            <em className="italic text-accent">{copy.heroEm}</em>
            <br />
            {copy.heroLine2}
            <br />
            {copy.heroLine3}
          </h1>
          <p className="mt-5 max-w-[520px] text-[16px] leading-[1.7] text-text-secondary">
            {copy.body}
          </p>

          {/* Download buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.capoeiragem.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-text px-7 text-[15px] font-medium text-bg transition-colors hover:bg-accent"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.5 20.5V3.5L17 12 3.5 20.5z" opacity="0.8"/>
                <path d="M3.5 3.5l11 7.6 3.5-2.1.5-.3a1 1 0 000-1.7l-.5-.3-3.5-2L3.5 3.5z" opacity="0.6"/>
              </svg>
              {copy.googlePlay}
            </a>
            <span className="inline-flex h-14 cursor-not-allowed items-center gap-3 rounded-full border border-border bg-card px-7 text-[15px] text-text-muted">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="opacity-40" aria-hidden="true">
                <path d="M17 1.5a4.5 4.5 0 00-3 1.7c-.7.9-1.3 2.1-1.1 3.3 1.3 0 2.5-.8 3.2-1.7.7-.9 1.2-2.1.9-3.3zM20 17.5c-.5 1.1-1.2 2.2-2 3-1 1-2.2 2-3.7 2-1.4 0-1.9-.9-3.5-.9-1.7 0-2.2.9-3.6.9-1.5 0-2.6-1.1-3.6-2.1C1.4 18.2.4 14 2 11.2c1-2 3-3.3 5-3.3 1.5 0 2.9.9 3.7.9.8 0 2.5-1.1 4.3-1 .8 0 3 .3 4.4 2.4-3.7 2-3.1 7.4.6 7.3z"/>
              </svg>
              <span>
                <span className="block text-[10px] uppercase tracking-[0.14em] opacity-60" style={{ fontFamily: 'var(--font-mono)' }}>{copy.appStoreSoon}</span>
                {copy.appStore}
              </span>
            </span>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="flex justify-center">
          <div className="relative">
            <div
              className="absolute inset-[-40px] rounded-full opacity-50"
              style={{ background: 'var(--accent-soft)', filter: 'blur(40px)' }}
            />
            <div className="relative" style={{ transform: 'rotate(-3deg)' }}>
              <div
                className="w-[260px] rounded-[36px] bg-text p-2"
                style={{ height: '520px', boxShadow: '0 30px 80px rgba(40,28,12,0.18)' }}
              >
                <div className="flex h-full w-full flex-col overflow-hidden rounded-[30px] bg-bg">
                  <div className="p-6 pb-3">
                    <span
                      className="text-[9px] uppercase tracking-[0.18em] text-accent-ink"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {copy.mockupLabel}
                    </span>
                    <h3 className="mt-1 text-[22px] leading-tight text-text">{copy.mockupName}</h3>
                  </div>
                  <div className="mx-3 h-28 rounded-[12px] bg-surface-muted" />
                  <div className="flex flex-col gap-2.5 p-4 mt-1">
                    <div className="rounded-[12px] border border-border bg-card p-3">
                      <div
                        className="text-[9px] uppercase tracking-[0.16em] text-accent-ink"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {copy.mockupTag}
                      </div>
                      <div className="mt-1 text-[13px] font-semibold text-text">{copy.mockupSchedule}</div>
                    </div>
                    <div className="rounded-[12px] bg-text p-3">
                      <div
                        className="text-[9px] uppercase tracking-[0.16em] opacity-60 text-bg"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {copy.mockupEventTag}
                      </div>
                      <div className="mt-1 text-[13px] font-semibold text-bg">{copy.mockupEvent}</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Badge sticker */}
              <div
                className="absolute -top-4 -right-6 rounded-full bg-accent px-4 py-2 text-white"
                style={{
                  transform: 'rotate(8deg)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.12em]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {copy.badgeLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berimbau separator */}
      <div className="page-shell">
        <div className="berimbau-line" />
      </div>

      {/* ── WEB vs APP ── */}
      <section className="page-shell py-12">
        <div className="mb-6 flex items-baseline gap-3">
          <span
            className="text-[12px] text-text-faint"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {copy.splitNum}
          </span>
          <h2 className="text-[26px] text-text">{copy.splitTitle}</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Web card */}
          <div className="rounded-[22px] border border-border bg-card p-7">
            <span
              className="rounded-[4px] bg-surface-muted px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-text-muted"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {copy.webTag}
            </span>
            <h3 className="mt-3 text-[28px] text-text">{copy.webTitle}</h3>
            <p className="mt-2 text-[14px] leading-[1.6] text-text-secondary">{copy.webBody}</p>
            <ul className="mt-5 space-y-3">
              {copy.webItems.map((it) => (
                <li key={it} className="flex gap-2.5 text-[14px] text-text-secondary">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--green)"
                    strokeWidth="2.2"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>
          </div>

          {/* App card */}
          <div className="rounded-[22px] bg-text p-7">
            <span
              className="text-[10px] uppercase tracking-[0.12em] opacity-60 text-bg"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {copy.appTag}
            </span>
            <h3 className="mt-3 text-[28px] text-bg">{copy.appTitle}</h3>
            <p className="mt-2 text-[14px] leading-[1.6] text-bg opacity-75">{copy.appBody}</p>
            <ul className="mt-5 space-y-3">
              {copy.appItems.map((it) => (
                <li key={it} className="flex gap-2.5 text-[14px] text-bg opacity-85">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2.2"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="page-shell pb-16">
        <div className="flex flex-col gap-6 rounded-[22px] border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span
              className="text-[11px] uppercase tracking-[0.18em] text-accent-ink"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {copy.ctaTag}
            </span>
            <h3 className="mt-3 text-[28px] text-text">{copy.ctaTitle}</h3>
            <p className="mt-2 max-w-[480px] text-[14px] leading-[1.6] text-text-secondary">
              {copy.ctaBody}
            </p>
          </div>
          <a
            href="https://play.google.com/store/apps/details?id=com.capoeiragem.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-accent px-7 text-[13px] font-medium text-white transition-all hover:opacity-90"
          >
            {copy.ctaBtn}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}
