import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getSiteDescription } from '@/lib/site'
import BetaRegistrationForm from '@/components/public/BetaRegistrationForm'

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const COPY = {
  es: {
    title: 'Agenda Capoeiragem',
    eyebrow: 'Beta cerrada · Google Play Console',
    heroLine1: 'La plataforma', heroEm: 'definitiva', heroLine2: 'para la',
    heroLine3: 'comunidad', heroLine4: 'capoeira.',
    body: 'Gestiona tus núcleos, organiza tus eventos y conecta con tu linaje en una sola herramienta diseñada específicamente para nuestro arte.',
    ctaHero: 'Unirse a la prueba cerrada',
    featuresTitle: 'Todo lo que necesitas en tu bolsillo',
    features: [
      { t: 'Mapa Interactivo', d: 'Encuentra núcleos y grupos en tiempo real con geolocalización precisa.' },
      { t: 'Sistema de Cordas', d: 'Crea y personaliza tu propio sistema de graduación para tu grupo.' },
      { t: 'Agenda de Eventos', d: 'Batizados, workshops y rodas organizadas en un calendario privado.' },
      { t: 'Gestión de Alumnos', d: 'Sigue el progreso y las graduaciones de tus alumnos directamente.' },
      { t: 'Mensajería Interna', d: 'Conecta con otros educadores sin depender de redes sociales externas.' },
      { t: 'Perfil Público', d: 'Tu historia y trayectoria profesional visible para toda la comunidad.' },
    ],
    showcaseTitle: 'Una experiencia diseñada para capoeiristas',
    showcaseBody: 'Hemos cuidado cada detalle visual para que la app no solo sea útil, sino que refleje la belleza y la fuerza de la capoeira.',
    betaTitle: 'Solicita tu acceso a la beta',
    betaBody: 'Estamos en fase de pruebas cerradas en Google Play. Déjanos tus datos y te invitaremos personalmente para que seas de los primeros en probarla.',
    statsLabel1: 'Educadores',
    statsLabel2: 'Núcleos',
    statsLabel3: 'Países',
  },
  pt: {
    title: 'Agenda Capoeiragem',
    eyebrow: 'Beta fechada · Google Play Console',
    heroLine1: 'A plataforma', heroEm: 'definitiva', heroLine2: 'para a',
    heroLine3: 'comunidade', heroLine4: 'capoeira.',
    body: 'Gerencie seus núcleos, organize seus eventos e conecte-se com sua linhagem em uma única ferramenta projetada especificamente para nossa arte.',
    ctaHero: 'Participar do teste fechado',
    featuresTitle: 'Tudo o que você precisa no seu bolso',
    features: [
      { t: 'Mapa Interativo', d: 'Encontre núcleos e grupos em tempo real com geolocalização precisa.' },
      { t: 'Sistema de Cordas', d: 'Crie e personalize seu próprio sistema de graduação para seu grupo.' },
      { t: 'Agenda de Eventos', d: 'Batizados, workshops e rodas organizados em um calendário privado.' },
      { t: 'Gestão de Alunos', d: 'Acompanhe o progresso e as graduações de seus alunos diretamente.' },
      { t: 'Mensageria Interna', d: 'Conecte-se com outros educadores sem depender de redes sociais externas.' },
      { t: 'Perfil Público', d: 'Sua história e trajetória profissional visível para toda a comunidade.' },
    ],
    showcaseTitle: 'Uma experiência projetada para capoeiristas',
    showcaseBody: 'Cuidamos de cada detalhe visual para que o app não seja apenas útil, mas reflita a beleza e a força da capoeira.',
    betaTitle: 'Solicite seu acesso à beta',
    betaBody: 'Estamos em fase de testes fechados no Google Play. Deixe seus dados e o convidaremos pessoalmente.',
    statsLabel1: 'Educadores',
    statsLabel2: 'Núcleos',
    statsLabel3: 'Países',
  },
  en: {
    title: 'Agenda Capoeiragem',
    eyebrow: 'Closed Beta · Google Play Console',
    heroLine1: 'The', heroEm: 'ultimate', heroLine2: 'platform for the',
    heroLine3: 'capoeira', heroLine4: 'community.',
    body: 'Manage your schools, organize your events, and connect with your lineage in a single tool designed specifically for our art.',
    ctaHero: 'Join Closed Testing',
    featuresTitle: 'Everything you need in your pocket',
    features: [
      { t: 'Interactive Map', d: 'Find schools and groups in real-time with precise geolocation.' },
      { t: 'Corda System', d: 'Create and customize your own graduation system for your group.' },
      { t: 'Event Calendar', d: 'Batizados, workshops, and rodas organized in a private calendar.' },
      { t: 'Student Management', d: 'Track the progress and graduations of your students directly.' },
      { t: 'Internal Messaging', d: 'Connect with other educators without depending on external social media.' },
      { t: 'Public Profile', d: 'Your professional history and career visible to the whole community.' },
    ],
    showcaseTitle: 'An experience built for capoeiristas',
    showcaseBody: 'We have taken care of every visual detail so that the app is not only useful but reflects the beauty and strength of capoeira.',
    betaTitle: 'Request your beta access',
    betaBody: 'We are in the closed testing phase on Google Play. Leave us your details and we will personally invite you.',
    statsLabel1: 'Educators',
    statsLabel2: 'Schools',
    statsLabel3: 'Countries',
  },
} as const

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.en
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const copy = getCopy(locale)
  return {
    title: copy.title,
    description: getSiteDescription(locale),
    alternates: { canonical: getLocalizedPath(locale, ''), languages: getLanguageAlternates('') },
    openGraph: { title: formatPageTitle(copy.title), description: getSiteDescription(locale), url: getLocalizedPath(locale, ''), type: 'website' },
  }
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params
  const c = getCopy(locale)

  let stats = { educators: 0, nucleos: 0, countries: 0 }
  try {
    const { getStats } = await import('@/lib/queries')
    const s = await getStats()
    stats = { educators: s.educators, nucleos: s.nucleos, countries: s.countries }
  } catch {}

  return (
    <div className="min-h-screen bg-ink">
      {/* ── HERO ── */}
      <section className="page-shell relative overflow-hidden pt-32 pb-24 lg:pt-48">
        <div className="absolute -top-24 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent-soft opacity-20 blur-[140px]" />
        
        <div className="relative z-10 grid gap-16 lg:grid-cols-[1fr_500px] lg:items-center">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="mono text-[11px] uppercase tracking-[0.3em] text-bg/60">{c.eyebrow}</span>
            </div>
            <h1 className="text-bg" style={{ fontSize: 'clamp(56px, 8vw, 110px)', lineHeight: 0.85, letterSpacing: '-0.06em' }}>
              {c.heroLine1} <br/>
              <em className="italic text-accent">{c.heroEm}</em> <br/>
              {c.heroLine3}
            </h1>
            <p className="mt-10 max-w-[540px] mx-auto lg:mx-0 text-[19px] leading-[1.6] text-bg/75">
              {c.body}
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <a href="#beta" className="btn btn-accent btn-lg h-16 px-10 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-all">
                {c.ctaHero}
              </a>
              
              <div className="flex gap-10">
                <div>
                  <div className="text-[28px] font-black text-bg">{stats.educators.toLocaleString()}</div>
                  <div className="mono text-[9px] uppercase tracking-widest text-bg/40">{c.statsLabel1}</div>
                </div>
                <div>
                  <div className="text-[28px] font-black text-bg">{stats.nucleos.toLocaleString()}</div>
                  <div className="mono text-[9px] uppercase tracking-widest text-bg/40">{c.statsLabel2}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-[4/5] w-full max-w-[500px] mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-accent/10 blur-[100px] rounded-full" />
            <Image 
              src="/images/app-hero.png" 
              alt="Agenda Capoeiragem App Hero" 
              fill 
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── SHOWCASE GRID ── */}
      <section className="page-shell py-32 border-t border-bg/5">
        <div className="text-center mb-24">
          <h2 className="text-bg" style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
            {c.showcaseTitle}
          </h2>
          <p className="mt-8 mx-auto max-w-[600px] text-[18px] text-bg/60 leading-[1.6]">
            {c.showcaseBody}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_450px] items-center">
          <div className="grid gap-6 sm:grid-cols-2">
            {c.features.map((f) => (
              <div key={f.t} className="rounded-[40px] border border-bg/10 bg-bg/5 p-8 backdrop-blur-sm hover:bg-bg/10 transition-all group">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <h3 className="text-xl font-black text-bg mb-3" style={{ fontFamily: 'var(--font-display)' }}>{f.t}</h3>
                <p className="text-sm leading-relaxed text-bg/60">{f.d}</p>
              </div>
            ))}
          </div>

          <div className="relative aspect-[9/16] w-full rounded-[48px] overflow-hidden border border-bg/20 shadow-2xl">
             <Image 
               src="/images/app-grid.png" 
               alt="App Functions Grid" 
               fill 
               className="object-cover"
             />
          </div>
        </div>
      </section>

      {/* ── BETA SECTION ── */}
      <section id="beta" className="page-shell py-32 bg-bg/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] bg-accent/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-[800px] mx-auto text-center">
          <span className="mono text-[11px] uppercase tracking-[0.4em] text-accent mb-6 block font-black">Join the testing</span>
          <h2 className="text-bg" style={{ fontSize: 'clamp(44px, 6vw, 84px)', lineHeight: 0.85, letterSpacing: '-0.05em' }}>
            {c.betaTitle}
          </h2>
          <p className="mt-8 text-[19px] text-bg/70 leading-[1.6] mb-16">
            {c.betaBody}
          </p>

          <div className="bg-ink p-1 rounded-[48px] border border-bg/10 shadow-2xl overflow-hidden">
            <div className="p-8 sm:p-12">
              <BetaRegistrationForm locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="page-shell py-12 border-t border-bg/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <span className="grid h-6 w-6 place-items-center rounded-lg bg-accent text-[12px] font-black text-white">a·c</span>
             <span className="text-[13px] font-bold text-bg/40 tracking-tight">Agenda Capoeiragem &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-8">
            <Link href={`/${locale}/privacy`} className="text-[12px] font-bold text-bg/40 hover:text-accent transition-colors uppercase tracking-widest">
              {locale === 'en' ? 'Privacy' : locale === 'pt' ? 'Privacidade' : 'Privacidad'}
            </Link>
            <Link href={`/${locale}/terms`} className="text-[12px] font-bold text-bg/40 hover:text-accent transition-colors uppercase tracking-widest">
              {locale === 'en' ? 'Terms' : locale === 'pt' ? 'Termos' : 'Términos'}
            </Link>
            <Link href={`/${locale}/admin`} className="text-[12px] font-bold text-bg/40 hover:text-accent transition-colors uppercase tracking-widest">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
