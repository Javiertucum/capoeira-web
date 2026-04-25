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

  let stats = { educators: 0, nucleos: 0, countries: 0 }
  try {
    const { getStats } = await import('@/lib/queries')
    const s = await getStats()
    stats = { educators: s.educators, nucleos: s.nucleos, countries: s.countries }
  } catch {}

  const statItems = [
    { n: stats.educators, l: c.stat1Label },
    { n: stats.nucleos,   l: c.stat2Label },
    { n: stats.countries, l: c.stat3Label },
  ]
    <div className="min-h-screen bg-ink">
      {/* ── HERO ── */}
      <section className="page-shell relative overflow-hidden py-24 lg:py-32">
        {/* Decorative background glow */}
        <div className="absolute -top-24 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent-soft opacity-20 blur-[120px]" />
        
        <div className="relative z-10 grid gap-16 lg:grid-cols-[1fr_450px] lg:items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-bg/80">{c.eyebrow}</span>
            </div>
            <h1 className="text-bg" style={{ fontSize: 'clamp(56px, 8vw, 100px)', lineHeight: 0.88, letterSpacing: '-0.05em' }}>
              Todo tu <br/>
              universo <br/>
              <em className="italic text-accent">capoeira</em>.
            </h1>
            <p className="mt-8 max-w-[500px] text-[18px] leading-[1.6] text-bg/80">{c.body}</p>

            {/* Store buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.capoeiragem.app"
                target="_blank" rel="noopener noreferrer"
                className="btn btn-accent btn-lg h-14 px-8 shadow-xl hover:shadow-accent/20 transition-all"
              >
                {c.googlePlay}
              </a>
              <div className="flex items-center gap-3 rounded-full border border-bg/10 bg-bg/5 px-6 py-3 backdrop-blur-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="opacity-60">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="mono text-[10px] uppercase tracking-widest text-bg/70">{c.appStoreSoon}</span>
            </div>

            {/* Real Stats Social Proof */}
            <div className="mt-16 flex flex-wrap gap-x-12 gap-y-8 border-t border-bg/10 pt-10">
              {statItems.map(({ n, l }) => (
                <div key={l}>
                  <div className="text-[32px] font-black text-bg leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                    {n.toLocaleString()}
                  </div>
                  <div className="mono mt-2 text-[10px] uppercase tracking-widest text-bg/50">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative" style={{ transform: 'rotate(-4deg)' }}>
              <div className="absolute inset-0 rounded-[44px] bg-accent/20 blur-[60px]" />
              <div
                className="relative overflow-hidden rounded-[48px] bg-[#1A1814] p-3 shadow-2xl"
                style={{ width: 280, height: 580, border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="flex h-full w-full flex-col overflow-hidden rounded-[38px] bg-[#F2EFE9]">
                  <div className="h-6 w-full bg-[#1A1814]" />
                  <div className="p-6">
                    <span className="eyebrow acc text-[10px]">{c.mockupDay}</span>
                    <h3 className="text-[24px] font-black mt-2 text-ink" style={{ fontFamily: 'var(--font-display)' }}>{c.mockupName}</h3>
                  </div>
                  <div className="flex-1 px-6 space-y-4">
                    <div className="h-32 w-full rounded-[24px] bg-surface-muted border border-line-soft" />
                    <div className="card p-4 shadow-sm" style={{ borderRadius: 'var(--radius-lg)' }}>
                      <span className="eyebrow acc text-[9px]">{c.nextTraining}</span>
                      <p className="mt-1 text-[15px] font-bold text-ink">{c.nextTime}</p>
                    </div>
                    <div className="bg-ink p-5 rounded-[28px] text-bg">
                      <span className="mono text-[9px] uppercase tracking-widest opacity-70">{c.privateEvent}</span>
                      <p className="mt-2 text-[16px] font-black">{c.eventName}</p>
                    </div>
                  </div>
                  <div className="h-20 w-full bg-surface-muted border-t border-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="page-shell py-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {c.features.map((f) => (
            <div key={f.t} className="group rounded-[36px] border border-bg/10 bg-bg/5 p-8 transition-all hover:bg-bg/10 backdrop-blur-sm">
              <span className="mono text-[10px] uppercase tracking-widest text-accent">{f.tag}</span>
              <h3 className="mt-5 text-[22px] font-black text-bg" style={{ fontFamily: 'var(--font-display)' }}>{f.t}</h3>
              <p className="mt-3 text-[14px] leading-[1.6] text-bg/75">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="page-shell pb-32">
        <div className="rounded-[56px] bg-accent p-10 lg:p-16 text-center text-bg overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
          <span className="eyebrow block mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>{c.ctaTag}</span>
          <h2 className="mx-auto max-w-[800px]" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
            {c.ctaTitle}
          </h2>
          <p className="mt-8 mx-auto max-w-[600px] text-[18px] opacity-80 leading-[1.6]">
            {c.ctaBody}
          </p>
          <div className="mt-12">
            <a
              href="https://play.google.com/store/apps/details?id=com.capoeiragem.app"
              target="_blank" rel="noopener noreferrer"
              className="btn bg-bg text-ink h-16 px-12 text-[18px] font-black rounded-full hover:scale-105 transition-transform"
            >
              {c.ctaBtn}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
