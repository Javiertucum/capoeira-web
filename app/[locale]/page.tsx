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
    heroLine1: 'Tu comunidad', heroEm: 'conectada', heroLine2: 'en',
    heroLine3: 'Agenda Capoeiragem',
    body: 'La herramienta definitiva para el capoeirista moderno. Gestiona tus núcleos, organiza batizados y workshops, personaliza tu sistema de graduación y mantente al día con la agenda global de nuestro arte.',
    ctaHero: 'Unirse a la prueba cerrada',
    featuresTitle: 'Todo lo que necesitas en tu bolsillo',
    features: [
      { t: 'Mapa de Núcleos', d: 'Geolocalización precisa de sedes de entrenamiento. Encuentra dónde treinar en cualquier ciudad del mundo con horarios y educadores responsables.' },
      { t: 'Sistema de Cordas', d: 'Configura el sistema de colores y niveles de tu grupo. Asigna graduaciones a tus alumnos y sigue su evolución técnica e histórica.' },
      { t: 'Agenda Inteligente', d: 'Batizados, rodas y workshops organizados por cercanía. Sincroniza eventos directamente con tu calendario y confirma asistencia con un toque.' },
      { t: 'Gestión de Educadores', d: 'Registra tus núcleos y alumnos. Activa tu perfil profesional, sube tus redes sociales y co-organiza eventos con otros maestros.' },
      { t: 'Privacidad y Control', d: 'Tú decides qué mostrar. Sistema seguro de solicitudes para unirse a grupos y núcleos, protegiendo la integridad de tu comunidad.' },
      { t: 'Multi-idioma Global', d: 'Traducida íntegramente al Español, Portugués e Inglés. Diseñada para unir a capoeiristas de todos los linajes en una plataforma común.' },
    ],
    showcaseTitle: 'Una experiencia diseñada para capoeiristas',
    showcaseBody: 'Hemos cuidado cada detalle visual basándonos en la experiencia real en la roda. Una interfaz oscura que no cansa la vista, rápida y 100% funcional sin conexión.',
    betaTitle: 'Solicita tu acceso a la beta',
    betaBody: 'Estamos en fase de pruebas cerradas en Google Play Console. Déjanos tus datos y te enviaremos una invitación personal para que empieces a organizar tu comunidad hoy mismo.',
    statsLabel1: 'Educadores',
    statsLabel2: 'Núcleos',
    statsLabel3: 'Países',
  },
  pt: {
    title: 'Agenda Capoeiragem',
    eyebrow: 'Beta fechada · Google Play Console',
    heroLine1: 'Sua comunidade', heroEm: 'conectada', heroLine2: 'na',
    heroLine3: 'Agenda Capoeiragem',
    body: 'A ferramenta definitiva para o capoeirista moderno. Gerencie seus núcleos, organize batizados e workshops, personalize seu sistema de graduação e acompanhe a agenda global da nossa arte.',
    ctaHero: 'Participar do teste fechado',
    featuresTitle: 'Tudo o que você precisa no seu bolso',
    features: [
      { t: 'Mapa de Núcleos', d: 'Geolocalização precisa de sedes de treino. Encontre onde treinar em qualquer cidade do mundo com horários e educadores responsáveis.' },
      { t: 'Sistema de Cordas', d: 'Configure o sistema de cores e níveis do seu grupo. Atribua graduações aos seus alunos e acompanhe sua evolução técnica e histórica.' },
      { t: 'Agenda Inteligente', d: 'Batizados, rodas e workshops organizados por proximidade. Sincronize eventos com seu calendário e confirme presença com um toque.' },
      { t: 'Gestão de Educadores', d: 'Registre seus núcleos e alunos. Ative seu perfil profissional, adicione redes sociais e co-organize eventos com outros mestres.' },
      { t: 'Privacidade e Controle', d: 'Você decide o que mostrar. Sistema seguro de solicitações para participar de grupos e núcleos, protegendo sua comunidade.' },
      { t: 'Multi-idioma Global', d: 'Traduzida integralmente para Espanhol, Português e Inglês. Projetada para unir capoeiristas de todas as linhagens em uma plataforma comum.' },
    ],
    showcaseTitle: 'Uma experiência projetada para capoeiristas',
    showcaseBody: 'Cuidamos de cada detalhe visual com base na experiência real na roda. Uma interface escura que não cansa a vista, rápida e 100% funcional offline.',
    betaTitle: 'Solicite seu acesso à beta',
    betaBody: 'Estamos em fase de testes fechados no Google Play Console. Deixe seus dados e enviaremos um convite pessoal para você começar a organizar sua comunidade hoje mesmo.',
    statsLabel1: 'Educadores',
    statsLabel2: 'Núcleos',
    statsLabel3: 'Países',
  },
  en: {
    title: 'Agenda Capoeiragem',
    eyebrow: 'Closed Beta · Google Play Console',
    heroLine1: 'Your community', heroEm: 'connected', heroLine2: 'on',
    heroLine3: 'Agenda Capoeiragem',
    body: 'The ultimate tool for the modern capoeirista. Manage your training centers, organize batizados and workshops, customize your graduation system, and stay updated with the global agenda of our art.',
    ctaHero: 'Join Closed Testing',
    featuresTitle: 'Everything you need in your pocket',
    features: [
      { t: 'Training Map', d: 'Precise geolocation of training centers. Find where to train in any city in the world with schedules and responsible educators.' },
      { t: 'Corda System', d: 'Set up your group\'s color and level system. Assign graduations to your students and track their technical and historical evolution.' },
      { t: 'Smart Agenda', d: 'Batizados, rodas, and workshops organized by proximity. Sync events directly with your calendar and confirm attendance with a tap.' },
      { t: 'Educator Management', d: 'Register your training centers and students. Activate your professional profile, link social media, and co-organize events.' },
      { t: 'Privacy and Control', d: 'You decide what to show. Secure request system to join groups and training centers, protecting your community\'s integrity.' },
      { t: 'Global Multi-language', d: 'Fully translated into Spanish, Portuguese, and English. Designed to unite capoeiristas from all lineages in a common platform.' },
    ],
    showcaseTitle: 'An experience built for capoeiristas',
    showcaseBody: 'We have taken care of every visual detail based on the real experience in the roda. A dark interface that is easy on the eyes, fast, and 100% functional offline.',
    betaTitle: 'Request your beta access',
    betaBody: 'We are in the closed testing phase on Google Play Console. Leave us your details and we will personally invite you to start organizing your community today.',
    statsLabel1: 'Educadores',
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
    <div className="min-h-screen bg-ink text-bg/90 selection:bg-accent/30 selection:text-white">
      {/* ── HERO ── */}
      <section className="page-shell relative overflow-hidden pt-32 pb-24 lg:pt-48">
        <div className="absolute -top-24 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent-soft opacity-10 blur-[140px]" />
        
        <div className="relative z-10 grid gap-16 lg:grid-cols-[1fr_500px] lg:items-center">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="mono text-[11px] uppercase tracking-[0.3em] text-bg/50">{c.eyebrow}</span>
            </div>
            <h1 className="text-bg font-black" style={{ fontSize: 'clamp(48px, 8vw, 110px)', lineHeight: 0.85, letterSpacing: '-0.06em' }}>
              {c.heroLine1} <br/>
              <em className="italic text-accent">{c.heroEm}</em> <br/>
              {c.heroLine3}
            </h1>
            <p className="mt-10 max-w-[540px] mx-auto lg:mx-0 text-[19px] leading-[1.6] text-bg/70">
              {c.body}
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
              <a href="#beta" className="btn btn-accent btn-lg h-16 px-10 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-all">
                {c.ctaHero}
              </a>
              
              <div className="flex gap-10">
                <div>
                  <div className="text-[28px] font-black text-bg tracking-tighter">{stats.educators.toLocaleString()}</div>
                  <div className="mono text-[9px] uppercase tracking-widest text-bg/40 font-bold">{c.statsLabel1}</div>
                </div>
                <div>
                  <div className="text-[28px] font-black text-bg tracking-tighter">{stats.nucleos.toLocaleString()}</div>
                  <div className="mono text-[9px] uppercase tracking-widest text-bg/40 font-bold">{c.statsLabel2}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-[4/5] w-full max-w-[460px] mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-accent/20 blur-[120px] rounded-full opacity-50" />
            <Image 
              src="/images/app-hero.png" 
              alt="Agenda Capoeiragem App Hero" 
              fill 
              className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── SHOWCASE GRID ── */}
      <section className="page-shell py-32 border-t border-bg/10">
        <div className="text-center mb-24">
          <h2 className="text-bg font-black" style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
            {c.showcaseTitle}
          </h2>
          <p className="mt-8 mx-auto max-w-[600px] text-[18px] text-bg/50 leading-[1.6]">
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
                <p className="text-[15px] leading-relaxed text-bg/50">{f.d}</p>
              </div>
            ))}
          </div>

          <div className="relative aspect-[9/16] w-full rounded-[48px] overflow-hidden border border-bg/20 shadow-2xl bg-bg/5">
             <Image 
               src="/images/app-grid.png" 
               alt="App Functions Grid" 
               fill 
               className="object-cover opacity-90 hover:opacity-100 transition-opacity"
             />
          </div>
        </div>
      </section>

      {/* ── BETA SECTION ── */}
      <section id="beta" className="page-shell py-32 bg-bg/5 relative overflow-hidden rounded-[64px] mb-8">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-accent/20 blur-[140px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <span className="mono text-[11px] uppercase tracking-[0.4em] text-accent mb-6 block font-black">Join the testing</span>
          <h2 className="text-bg font-black" style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.85, letterSpacing: '-0.05em' }}>
            {c.betaTitle}
          </h2>
          <p className="mt-8 text-[19px] text-bg/60 leading-[1.6] mb-16 max-w-[600px] mx-auto">
            {c.betaBody}
          </p>

          <div className="bg-ink p-1 rounded-[48px] border border-bg/20 shadow-2xl overflow-hidden max-w-[640px] mx-auto">
            <div className="p-8 sm:p-12">
              <BetaRegistrationForm locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="page-shell py-16 border-t border-bg/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
             <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-[14px] font-black text-white">a·c</span>
             <span className="text-[14px] font-bold text-bg/30 tracking-tight">Agenda Capoeiragem &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-10">
            <Link href={`/${locale}/privacy`} className="text-[11px] font-bold text-bg/40 hover:text-accent transition-colors uppercase tracking-[0.2em]">
              {locale === 'en' ? 'Privacy' : locale === 'pt' ? 'Privacidade' : 'Privacidad'}
            </Link>
            <Link href={`/${locale}/terms`} className="text-[11px] font-bold text-bg/40 hover:text-accent transition-colors uppercase tracking-[0.2em]">
              {locale === 'en' ? 'Terms' : locale === 'pt' ? 'Termos' : 'Términos'}
            </Link>
            <Link href={`/${locale}/admin`} className="text-[11px] font-bold text-bg/40 hover:text-accent transition-colors uppercase tracking-[0.2em]">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
