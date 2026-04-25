import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getSiteDescription } from '@/lib/site'

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const COPY = {
  es: {
    title: 'App',
    eyebrow: 'Companion móvil · Agenda Capoeiragem',
    heroLine1: 'La', heroEm: 'app', heroLine2: 'es donde',
    heroLine3: 'la comunidad', heroLine4: 'se organiza.',
    body: 'Esta web es la cara pública del directorio: cualquiera puede encontrar un núcleo, un educador o un grupo. La app es la cocina: ahí los educadores publican y mantienen sus datos, gestionan cordas, organizan eventos y conectan entre sí.',
    googlePlay: 'Google Play', appStore: 'App Store', appStoreSoon: 'Próximamente',
    stat1: '2.4k', stat1Label: 'Practicantes',
    stat2: '312', stat2Label: 'Núcleos publicados',
    stat3: '44',  stat3Label: 'Países',
    splitNum: '01 / Diferencias',
    splitTitle: 'Una sola base de datos, dos puertas.',
    webTag: 'Web pública', webTitle: 'Para encontrar.',
    webBody: 'Sin login. Indexable. Para alguien que llega a una ciudad nueva, o que recién quiere empezar y busca un espacio cerca.',
    webItems: ['Mapa y directorio de núcleos', 'Perfiles públicos de educadores', 'Información de grupos y linajes', 'Contacto directo (WhatsApp, IG)'],
    appTag: 'App móvil', appTitle: 'Para participar.',
    appBody: 'Con cuenta. Donde la comunidad publica, organiza, gestiona cordas y se conecta sin pasar por redes sociales.',
    appItems: ['Crear y gestionar núcleos', 'Sistema de cordas personalizable', 'Agenda de eventos privada', 'Co-organización entre educadores', 'Mensajes y comunidad'],
    featNum: '02 / Lo que hace la app',
    featTitle: 'Pensada por practicantes y educadores.',
    features: [
      { tag: 'Para educadores', t: 'Crea y gestiona tus núcleos', d: 'Horarios, ubicación, equipo. Tu núcleo aparece publicado en la web automáticamente.' },
      { tag: 'Para grupos',     t: 'Tu sistema de cordas, tu linaje', d: 'Define tu propia graduación. Asigna cordas a tus alumnos. Reconoce tu historia visualmente.' },
      { tag: 'Para todos',      t: 'Agenda de eventos privada', d: 'Batizados, encuentros, workshops. Co-organiza con otros educadores. Visible solo dentro de la app.' },
      { tag: 'Comunidad',       t: 'Perfil, contactos, mensajes', d: 'Conecta con educadores de tu linaje, sin pasar por redes sociales.' },
    ],
    ctaTag: 'Para educadores',
    ctaTitle: '¿Tu núcleo todavía no aparece en la web?',
    ctaBody: 'Descarga la app, registra tu núcleo en 3 minutos, y aparece publicado automáticamente en este directorio. Verificación humana, gratis.',
    ctaBtn: 'Descargar app',
    mockupDay: 'Mi núcleo · Hoy', mockupName: 'Pelourinho',
    nextTraining: 'Próximo treino', nextTime: 'Hoy 19:00 · Adultos',
    privateEvent: 'Evento privado', eventName: 'Batizado 2026',
    badgeText: 'v1.0 · gratis',
  },
  pt: {
    title: 'App',
    eyebrow: 'Companion móvel · Agenda Capoeiragem',
    heroLine1: 'O', heroEm: 'app', heroLine2: 'é onde',
    heroLine3: 'a comunidade', heroLine4: 'se organiza.',
    body: 'Esta web é a cara pública do diretório: qualquer pessoa pode encontrar um núcleo, um educador ou um grupo. O app é a cozinha: lá os educadores publicam seus dados, gerenciam cordas e se conectam.',
    googlePlay: 'Google Play', appStore: 'App Store', appStoreSoon: 'Em breve',
    stat1: '2.4k', stat1Label: 'Praticantes',
    stat2: '312', stat2Label: 'Núcleos publicados',
    stat3: '44',  stat3Label: 'Países',
    splitNum: '01 / Diferenças',
    splitTitle: 'Uma única base de dados, duas portas.',
    webTag: 'Web pública', webTitle: 'Para encontrar.',
    webBody: 'Sem login. Indexável. Para quem chega a uma cidade nova ou quer começar.',
    webItems: ['Mapa e diretório de núcleos', 'Perfis públicos de educadores', 'Informações de grupos e linagens', 'Contato direto (WhatsApp, IG)'],
    appTag: 'App móvel', appTitle: 'Para participar.',
    appBody: 'Com conta. Onde a comunidade publica, organiza, gerencia cordas e se conecta.',
    appItems: ['Criar e gerenciar núcleos', 'Sistema de cordas personalizável', 'Agenda de eventos privada', 'Co-organização entre educadores', 'Mensagens e comunidade'],
    featNum: '02 / O que o app faz',
    featTitle: 'Pensado por praticantes e educadores.',
    features: [
      { tag: 'Para educadores', t: 'Crie e gerencie seus núcleos', d: 'Horários, localização, equipe. Seu núcleo aparece publicado na web automaticamente.' },
      { tag: 'Para grupos',     t: 'Seu sistema de cordas, sua linhagem', d: 'Defina sua própria graduação. Atribua cordas aos seus alunos.' },
      { tag: 'Para todos',      t: 'Agenda de eventos privada', d: 'Batizados, encontros, workshops. Co-organize com outros educadores.' },
      { tag: 'Comunidade',      t: 'Perfil, contatos, mensagens', d: 'Conecte-se com educadores da sua linhagem, sem passar pelas redes sociais.' },
    ],
    ctaTag: 'Para educadores',
    ctaTitle: 'Seu núcleo ainda não aparece na web?',
    ctaBody: 'Baixe o app, registre seu núcleo em 3 minutos e apareça publicado automaticamente neste diretório. Verificação humana, grátis.',
    ctaBtn: 'Baixar app',
    mockupDay: 'Meu núcleo · Hoje', mockupName: 'Pelourinho',
    nextTraining: 'Próximo treino', nextTime: 'Hoje 19:00 · Adultos',
    privateEvent: 'Evento privado', eventName: 'Batizado 2026',
    badgeText: 'v1.0 · grátis',
  },
  en: {
    title: 'App',
    eyebrow: 'Mobile companion · Agenda Capoeiragem',
    heroLine1: 'The', heroEm: 'app', heroLine2: 'is where',
    heroLine3: 'the community', heroLine4: 'organizes.',
    body: 'This website is the public face of the directory: anyone can find a nucleo, educator, or group. The app is the kitchen: that\'s where educators publish their data, manage cords, organize events, and connect with each other.',
    googlePlay: 'Google Play', appStore: 'App Store', appStoreSoon: 'Coming soon',
    stat1: '2.4k', stat1Label: 'Practitioners',
    stat2: '312', stat2Label: 'Published nucleos',
    stat3: '44',  stat3Label: 'Countries',
    splitNum: '01 / Differences',
    splitTitle: 'One database, two doors.',
    webTag: 'Public web', webTitle: 'To find.',
    webBody: 'No login. Indexable. For someone arriving in a new city, or just starting out.',
    webItems: ['Nucleo map and directory', 'Public educator profiles', 'Group and lineage info', 'Direct contact (WhatsApp, IG)'],
    appTag: 'Mobile app', appTitle: 'To participate.',
    appBody: 'With an account. Where the community publishes, organizes, manages cords, and connects.',
    appItems: ['Create and manage nucleos', 'Customizable cord system', 'Private event calendar', 'Co-organization between educators', 'Messages and community'],
    featNum: '02 / What the app does',
    featTitle: 'Built by practitioners and educators.',
    features: [
      { tag: 'For educators', t: 'Create and manage your nucleos', d: 'Schedules, location, team. Your nucleo appears published on the web automatically.' },
      { tag: 'For groups',    t: 'Your cord system, your lineage', d: 'Define your own graduation. Assign cords to your students. Recognize your history visually.' },
      { tag: 'For everyone',  t: 'Private event calendar', d: 'Batizados, meetups, workshops. Co-organize with other educators. Visible only inside the app.' },
      { tag: 'Community',     t: 'Profile, contacts, messages', d: 'Connect with educators from your lineage, without going through social media.' },
    ],
    ctaTag: 'For educators',
    ctaTitle: 'Is your nucleo missing from the web?',
    ctaBody: 'Download the app, register your nucleo in 3 minutes, and appear published automatically in this directory. Human verification, free.',
    ctaBtn: 'Download app',
    mockupDay: 'My nucleo · Today', mockupName: 'Pelourinho',
    nextTraining: 'Next class', nextTime: 'Today 7pm · Adults',
    privateEvent: 'Private event', eventName: 'Batizado 2026',
    badgeText: 'v1.0 · free',
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
    alternates: { canonical: getLocalizedPath(locale, '/app'), languages: getLanguageAlternates('/app') },
    openGraph: { title: formatPageTitle(copy.title), description: getSiteDescription(locale), url: getLocalizedPath(locale, '/app'), type: 'website' },
  }
}

export default async function AppPage({ params }: Props) {
  const { locale } = await params
  const c = getCopy(locale)

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="page-shell grid gap-14 py-16 lg:grid-cols-[1fr_400px] lg:items-center">
        <div>
          <span className="eyebrow acc block mb-4">{c.eyebrow}</span>
          <h1 style={{ fontSize: 'clamp(52px, 7vw, 80px)', lineHeight: 0.94, letterSpacing: '-0.035em' }}>
            {c.heroLine1} <em>{c.heroEm}</em> {c.heroLine2}
            <span className="block">{c.heroLine3}</span>
            <span className="block">{c.heroLine4}</span>
          </h1>
          <p className="mt-5 max-w-[540px] text-[16px] leading-[1.7] text-ink-2">{c.body}</p>

          {/* Store buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.capoeiragem.app"
              target="_blank" rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z" opacity=".8"/>
                <path d="M14.208 12l3.696 3.696-9.979 5.765-3.736-3.736L14.208 12z" opacity=".6"/>
                <path d="M20.302 10.067l2.106 1.217a1 1 0 0 1 0 1.432l-2.106 1.217-3.789-3.789 3.789-2.077z" opacity=".8"/>
                <path d="M8.189 2.539l9.979 5.765-3.696 3.696-9.283-9.282 2.997-.179z" opacity=".6"/>
              </svg>
              {c.googlePlay}
            </a>
            <span className="btn btn-ghost btn-lg opacity-60 cursor-not-allowed select-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>
                <span className="block text-[10px] uppercase tracking-[0.14em] opacity-60">{c.appStoreSoon}</span>
                {c.appStore}
              </span>
            </span>
          </div>

          {/* Stats */}
          <div className="mt-10 flex gap-10">
            {[
              { n: c.stat1, l: c.stat1Label },
              { n: c.stat2, l: c.stat2Label },
              { n: c.stat3, l: c.stat3Label },
            ].map(({ n, l }) => (
              <div key={l}>
                <div className="text-[32px] font-bold leading-none tracking-[-0.03em] text-ink" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{n}</div>
                <div className="mono mt-1.5 text-[11px] uppercase tracking-[0.16em] text-ink-3">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Phone mockup */}
        <div className="flex justify-center">
          <div className="relative" style={{ transform: 'rotate(-3deg)' }}>
            {/* Glow */}
            <div className="absolute inset-[-40px] rounded-full opacity-50" style={{ background: 'var(--accent-soft)', filter: 'blur(40px)', zIndex: 0 }} />
            {/* Frame */}
            <div
              className="relative overflow-hidden rounded-[36px] bg-ink"
              style={{ width: 260, height: 520, padding: 8, boxShadow: '0 30px 80px rgba(40,28,12,0.2)', zIndex: 1 }}
            >
              <div className="flex h-full w-full flex-col overflow-hidden rounded-[30px] bg-bg">
                {/* Status bar */}
                <div className="mono flex items-center justify-between px-5 pt-5 text-[10px] text-ink-3">
                  <span>9:41</span>
                  <span>▮▮▮</span>
                </div>
                {/* Content */}
                <div className="px-5 pt-2 pb-3">
                  <span className="eyebrow acc text-[9px]">{c.mockupDay}</span>
                  <h3 className="text-[22px] mt-1 text-ink">{c.mockupName}</h3>
                </div>
                {/* Image placeholder */}
                <div className="img-ph mx-4 rounded-[14px]" style={{ height: 120 }}>foto</div>
                <div className="flex flex-col gap-2.5 p-4 mt-1">
                  {/* Next class card */}
                  <div className="card p-3">
                    <span className="eyebrow acc text-[9px]">{c.nextTraining}</span>
                    <p className="mt-1 text-[13px] font-semibold text-ink">{c.nextTime}</p>
                    <p className="mono text-[11px] text-ink-3 mt-0.5">14 confirmados</p>
                  </div>
                  {/* Event card-ink */}
                  <div className="card-ink p-3">
                    <span className="eyebrow text-[9px] opacity-70">{c.privateEvent}</span>
                    <p className="mt-1 text-[13px] font-semibold text-bg">{c.eventName}</p>
                    <p className="mono text-[11px] text-bg opacity-70 mt-0.5">14–16 mar · 28 anotados</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Sticker */}
            <div
              className="absolute -top-4 -right-6 rounded-full bg-accent px-4 py-2 text-white"
              style={{ transform: 'rotate(8deg)', boxShadow: 'var(--shadow-md)', zIndex: 2 }}
            >
              <span className="mono text-[11px] font-semibold uppercase tracking-[0.12em]">{c.badgeText}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell"><div className="berimbau-line" /></div>

      {/* ── WEB vs APP ── */}
      <section className="page-shell py-12">
        <div className="section-head">
          <span className="num">{c.splitNum}</span>
          <h2>{c.splitTitle}</h2>
          <span className="rule" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Web */}
          <div className="card p-7">
            <span className="tag-mono">{c.webTag}</span>
            <h3 className="mt-3 text-[28px] text-ink">{c.webTitle}</h3>
            <p className="mt-2 text-[14px] leading-[1.6] text-ink-2">{c.webBody}</p>
            <ul className="mt-5 space-y-3">
              {c.webItems.map((it) => (
                <li key={it} className="flex gap-2.5 text-[14px] text-ink-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" className="mt-0.5 shrink-0" aria-hidden="true">
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>
          </div>
          {/* App */}
          <div className="card-ink p-7">
            <span className="tag-mono" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--bg)', opacity: 0.8 }}>{c.appTag}</span>
            <h3 className="mt-3 text-[28px] text-bg">{c.appTitle}</h3>
            <p className="mt-2 text-[14px] leading-[1.6] text-bg opacity-75">{c.appBody}</p>
            <ul className="mt-5 space-y-3">
              {c.appItems.map((it) => (
                <li key={it} className="flex gap-2.5 text-[14px] text-bg opacity-85">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" className="mt-0.5 shrink-0" aria-hidden="true">
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="page-shell pb-12">
        <div className="section-head">
          <span className="num">{c.featNum}</span>
          <h2>{c.featTitle}</h2>
          <span className="rule" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {c.features.map((f) => (
            <div key={f.t} className="card-paper p-6">
              <span className="tag-mono">{f.tag}</span>
              <h3 className="mt-3 text-[22px] text-ink" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, letterSpacing: '-0.01em' }}>{f.t}</h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-ink-2">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="page-shell pb-16">
        <div className="card flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="eyebrow acc block mb-2">{c.ctaTag}</span>
            <h3 className="text-[28px] text-ink">{c.ctaTitle}</h3>
            <p className="mt-2 max-w-[500px] text-[14px] leading-[1.6] text-ink-2">{c.ctaBody}</p>
          </div>
          <a
            href="https://play.google.com/store/apps/details?id=com.capoeiragem.app"
            target="_blank" rel="noopener noreferrer"
            className="btn btn-accent btn-lg shrink-0"
          >
            {c.ctaBtn}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}
