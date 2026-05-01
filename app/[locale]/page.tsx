import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getSiteDescription } from '@/lib/site'
import BetaRegistrationForm from '@/components/public/BetaRegistrationForm'
import TutorialSection from '@/components/public/TutorialSection'

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const COPY = {
  es: {
    title: 'Agenda Capoeiragem',
    eyebrow: 'Versión 2.5.1 · Beta cerrada',
    heroLine1: 'Tu comunidad', heroEm: 'conectada', heroLine2: 'en',
    heroLine3: 'Agenda Capoeiragem',
    body: 'La herramienta definitiva para el capoeirista moderno. Gestiona tus núcleos, organiza batizados, pasa lista a tus alumnos y genera reportes profesionales de tu actividad.',
    ctaHero: 'Unirse a la prueba cerrada',
    showcaseTitle: 'Una plataforma, dos experiencias',
    showcaseBody: 'Diseñada específicamente para las necesidades de quienes organizan el juego y quienes participan en él.',
    educatorSubtitle: 'Para Educadores y Organizadores',
    educatorFeatures: [
      { t: 'Panel de Control KPI', d: 'Visualiza alumnos activos, porcentaje de asistencia y salud financiera de tu núcleo en un solo vistazo.' },
      { t: 'Gestión de Cobros', d: 'Administra mensualidades, paquetes de clases y pagos en múltiples monedas con total claridad.' },
      { t: 'Reportes Profesionales', d: 'Pasa lista rápidamente y exporta reportes detallados de asistencia y finanzas en PDF o CSV.' },
      { t: 'Sistema de Graduación', d: 'Configura colores, niveles y jerarquías de cordas específicas para la identidad de tu grupo.' },
      { t: 'Supervisión de Grupo', d: 'Estructura roles de administrador y supervisión educativa para grandes organizaciones.' },
      { t: 'Eventos y Colaboración', d: 'Organiza batizados con cronogramas complejos, integrando co-organizadores y pagos directos.' }
    ],
    studentSubtitle: 'Para Alumnos y Viajeros',
    studentFeatures: [
      { t: 'Mapa de Núcleos', d: 'Localiza sedes de entrenamiento con horarios detallados y educadores responsables en cualquier ciudad.' },
      { t: 'Agenda Global', d: 'Rodas y workshops organizados por proximidad. Confirma asistencia y guárdalos en tu calendario.' },
      { t: 'Perfil Comunitario', d: 'Sigue tu historial de graduaciones, conecta tus redes sociales y descubre la red global de capoeira.' },
      { t: 'Feed Personalizado', d: 'Recibe noticias y actualizaciones de tu grupo y eventos de interés directamente en tu inicio.' }
    ],
    betaTitle: 'Solicita tu acceso a la beta',
    betaBody: 'Estamos en fase de pruebas cerradas en Google Play Console. Déjanos tus datos y te enviaremos una invitación personal para que empieces a organizar tu comunidad hoy mismo.',
    statsLabel1: 'Educadores',
    statsLabel2: 'Núcleos',
    statsLabel3: 'Países',
  },
  pt: {
    title: 'Agenda Capoeiragem',
    eyebrow: 'Versão 2.5.1 · Beta fechada',
    heroLine1: 'Sua comunidade', heroEm: 'conectada', heroLine2: 'na',
    heroLine3: 'Agenda Capoeiragem',
    body: 'A ferramenta definitiva para o capoeirista moderno. Gerencie seus núcleos, organize batizados, faça chamadas e gere relatórios profissionais da sua atividade.',
    ctaHero: 'Participar do teste fechado',
    showcaseTitle: 'Uma plataforma, duas experiências',
    showcaseBody: 'Projetada especificamente para as necessidades de quem organiza a roda e de quem participa.',
    educatorSubtitle: 'Para Educadores e Organizadores',
    educatorFeatures: [
      { t: 'Painel de Controle KPI', d: 'Visualize alunos ativos, porcentagem de frequência e saúde financeira do seu núcleo em um relance.' },
      { t: 'Gestão de Cobranças', d: 'Administre mensalidades, pacotes de aulas e pagamentos em várias moedas com total clareza.' },
      { t: 'Relatórios Profissionais', d: 'Faça a chamada rapidamente e exporte relatórios detalhados de frequência e finanças em PDF ou CSV.' },
      { t: 'Sistema de Cordas', d: 'Configure cores, níveis e hierarquias de graduação específicas para a identidade do seu grupo.' },
      { t: 'Supervisão de Grupo', d: 'Estruture papéis de administrador e supervisão educativa para grandes organizações.' },
      { t: 'Eventos e Colaboração', d: 'Organize batizados com cronogramas complexos, integrando co-organizadores e pagamentos diretos.' }
    ],
    studentSubtitle: 'Para Alunos e Viajantes',
    studentFeatures: [
      { t: 'Mapa de Núcleos', d: 'Encontre sedes de treino com horários detalhados e educadores responsáveis em qualquer cidade.' },
      { t: 'Agenda Global', d: 'Rodas e workshops organizados por proximidade. Confirme presença e salve no seu calendário.' },
      { t: 'Perfil Comunitário', d: 'Acompanhe seu histórico de graduação, conecte suas redes sociais e descubra a rede global de capoeira.' },
      { t: 'Feed Personalizado', d: 'Receba notícias e atualizações do seu grupo e eventos de interesse diretamente no seu início.' }
    ],
    betaTitle: 'Solicite seu acesso à beta',
    betaBody: 'Estamos em fase de testes fechados no Google Play Console. Deixe seus dados e enviaremos um convite pessoal para você começar a organizar sua comunidade hoje.',
    statsLabel1: 'Educadores',
    statsLabel2: 'Núcleos',
    statsLabel3: 'Países',
  },
  en: {
    title: 'Agenda Capoeiragem',
    eyebrow: 'Version 2.5.1 · Closed Beta',
    heroLine1: 'Your community', heroEm: 'connected', heroLine2: 'on',
    heroLine3: 'Agenda Capoeiragem',
    body: 'The ultimate tool for the modern capoeirista. Manage your schools, organize batizados, take attendance, and generate professional reports of your activity.',
    ctaHero: 'Join Closed Testing',
    showcaseTitle: 'One platform, two experiences',
    showcaseBody: 'Designed specifically for the needs of those who organize the roda and those who play in it.',
    educatorSubtitle: 'For Educators and Organizers',
    educatorFeatures: [
      { t: 'KPI Dashboard', d: 'View active students, attendance percentage, and financial health of your school at a glance.' },
      { t: 'Billing Management', d: 'Manage monthly fees, class packages, and payments in multiple currencies with total clarity.' },
      { t: 'Professional Reports', d: 'Take attendance quickly and export detailed attendance and finance reports in PDF or CSV.' },
      { t: 'Graduation System', d: 'Configure specific colors, levels, and graduation hierarchies for your group’s identity.' },
      { t: 'Group Supervision', d: 'Structure administrator roles and educational supervision for large organizations.' },
      { t: 'Events & Collaboration', d: 'Organize batizados with complex schedules, integrating co-organizers and direct payments.' }
    ],
    studentSubtitle: 'For Students and Travelers',
    studentFeatures: [
      { t: 'Training Map', d: 'Find training locations with detailed schedules and responsible educators in any city.' },
      { t: 'Global Agenda', d: 'Rodas and workshops organized by proximity. Confirm attendance and save to your calendar.' },
      { t: 'Community Profile', d: 'Track your graduation history, connect your social media, and discover the global capoeira network.' },
      { t: 'Personalized Feed', d: 'Receive news and updates from your group and events of interest directly in your home.' }
    ],
    betaTitle: 'Request your beta access',
    betaBody: 'We are in the closed testing phase on Google Play Console. Leave us your details and we will send a personal invite to start organizing your community today.',
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
          <div className="relative aspect-[9/19] w-full max-w-[320px] mx-auto lg:max-w-none lg:w-[320px] lg:justify-self-center rounded-[40px] border-[8px] border-bg/10 bg-bg/5 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-accent/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
            <Image 
              src="/images/user_mockup_4.jpg" 
              alt="Agenda Capoeiragem App Hero" 
              fill 
              className="object-cover object-top scale-[1.02]"
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

        {/* Educator Features */}
        <div className="mb-32">
          <div className="section-head mb-12">
            <span className="num">01</span>
            <h2 className="text-2xl lg:text-4xl font-black text-bg tracking-tight">{c.educatorSubtitle}</h2>
            <div className="rule" />
          </div>
          <div className="grid gap-12 lg:grid-cols-[1fr_450px] items-center">
            <div className="grid gap-6 sm:grid-cols-2">
              {c.educatorFeatures.map((f) => (
                <div key={f.t} className="rounded-[40px] border border-bg/10 bg-bg/5 p-8 backdrop-blur-sm hover:bg-bg/10 transition-all group">
                  <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                  <h3 className="text-xl font-black text-bg mb-3" style={{ fontFamily: 'var(--font-display)' }}>{f.t}</h3>
                  <p className="text-[15px] leading-relaxed text-bg/50">{f.d}</p>
                </div>
              ))}
            </div>
            <div className="relative aspect-[9/19] w-full max-w-[300px] mx-auto rounded-[40px] border-[8px] border-bg/10 bg-bg/5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden">
               <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full opacity-30 pointer-events-none" />
               <Image 
                 src="/images/user_mockup_1.jpg" 
                 alt="Educator Functions Grid" 
                 fill 
                 className="object-cover object-top scale-[1.02]"
               />
            </div>
          </div>
        </div>

        {/* Student Features */}
        <div className="mb-32">
          <div className="section-head mb-12">
            <span className="num">02</span>
            <h2 className="text-2xl lg:text-4xl font-black text-bg tracking-tight">{c.studentSubtitle}</h2>
            <div className="rule" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.studentFeatures.map((f) => (
              <div key={f.t} className="rounded-[32px] border border-bg/10 bg-ink-2 p-8 hover:border-bg/20 transition-colors">
                <h3 className="text-xl font-black text-bg mb-3" style={{ fontFamily: 'var(--font-display)' }}>{f.t}</h3>
                <p className="text-[15px] leading-relaxed text-bg/50">{f.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TUTORIALS SECTION ── */}
        <TutorialSection locale={locale} />
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
