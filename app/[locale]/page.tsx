import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getSiteDescription } from '@/lib/site'
import Nav from '@/components/public/Nav'
import BetaRegistrationForm from '@/components/public/BetaRegistrationForm'
import TutorialSection from '@/components/public/TutorialSection'
import FeatureMockup from '@/components/public/FeatureMockup'

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
    <main className="min-h-screen bg-bg selection:bg-accent/20 overflow-x-hidden">
      <Nav />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Vanguard Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1440px] pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
           <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[50%] bg-accent/5 blur-[100px] rounded-full" />
        </div>

        <div className="page-shell relative z-10">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-white/40 shadow-soft animate-in fade-in slide-in-from-top-4 duration-700 mx-auto lg:mx-0">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-accent-ink">{c.eyebrow}</span>
              </div>
              
              <h1 className="text-[#10131A] font-black leading-[0.85] tracking-[-0.05em] animate-in fade-in slide-in-from-left-8 duration-1000" style={{ fontSize: 'clamp(56px, 10vw, 120px)' }}>
                {c.heroLine1} <br />
                <span className="text-gradient italic">{c.heroEm}</span> <br/>
                {c.heroLine3}
              </h1>

              <p className="max-w-[540px] text-xl lg:text-2xl text-[#10131A]/60 leading-relaxed font-medium animate-in fade-in slide-in-from-left-12 duration-1000 delay-200 mx-auto lg:mx-0">
                {c.body}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <Link href="#beta" className="btn btn-accent btn-lg shadow-vanguard hover:scale-105 transition-transform px-10 h-16 text-lg font-black">
                  {c.ctaHero}
                </Link>
                
                <div className="flex gap-8 border-l border-[#10131A]/10 pl-8">
                  <div>
                    <div className="text-2xl font-black text-[#10131A] tracking-tighter leading-none">{stats.educators.toLocaleString()}</div>
                    <div className="eyebrow text-[9px] mt-1 text-[#10131A]/40">{c.statsLabel1}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[#10131A] tracking-tighter leading-none">{stats.nucleos.toLocaleString()}</div>
                    <div className="eyebrow text-[9px] mt-1 text-[#10131A]/40">{c.statsLabel2}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
               <div className="absolute inset-0 bg-accent/20 blur-[120px] rounded-full opacity-40 floating" />
               <FeatureMockup type="home" />
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUE PROPOSITION ── */}
      <section className="py-24 border-y border-bg/10 glass-dark">
         <div className="page-shell text-center">
            <p className="eyebrow acc mb-12 opacity-60">Impulsando la cultura capoeiragem</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               {['Agendamento', 'Financeiro', 'Graduação', 'Comunidade'].map(v => (
                  <span key={v} className="text-white font-black text-2xl tracking-tighter italic">{v}</span>
               ))}
            </div>
         </div>
      </section>

      {/* ── SHOWCASE GRID ── */}
      <section id="features" className="page-shell py-40">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-32">
          <div className="max-w-[800px]">
             <h2 className="text-[#10131A] font-black leading-none tracking-[-0.05em]" style={{ fontSize: 'clamp(48px, 6vw, 96px)' }}>
               {c.showcaseTitle}
             </h2>
          </div>
          <p className="max-w-[400px] text-xl text-[#10131A]/60 leading-relaxed pb-2 font-medium">
            {c.showcaseBody}
          </p>
        </div>

        {/* Educator Features - Bento Style */}
        <div className="mb-48">
          <div className="section-head mb-16">
            <span className="num text-[#10131A]/40">01</span>
            <h2 className="text-3xl font-black text-[#10131A] tracking-tight">{c.educatorSubtitle}</h2>
            <div className="rule border-[#10131A]/10" />
          </div>
          <div className="grid gap-12 lg:grid-cols-[1fr_400px] items-center">
            <div className="grid gap-6 sm:grid-cols-2">
              {c.educatorFeatures.map((f) => (
                <div key={f.t} className="rounded-[48px] border border-[#10131A]/10 bg-[#10131A]/5 p-10 hover-lift group">
                  <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-8 group-hover:bg-accent group-hover:text-white transition-colors duration-500 shadow-soft">
                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                  <h3 className="text-2xl font-black text-[#10131A] mb-4 leading-tight">{f.t}</h3>
                  <p className="text-base leading-relaxed text-[#10131A]/60 font-medium">{f.d}</p>
                </div>
              ))}
            </div>
            <div className="floating" style={{ animationDelay: '1s' }}>
               <FeatureMockup type="attendance" />
            </div>
          </div>
        </div>

        {/* Student Features */}
        <div className="mb-48">
          <div className="section-head mb-16">
            <span className="num text-[#10131A]/40">02</span>
            <h2 className="text-3xl font-black text-[#10131A] tracking-tight">{c.studentSubtitle}</h2>
            <div className="rule border-[#10131A]/10" />
          </div>
          <div className="grid gap-20 lg:grid-cols-[400px_1fr] items-center">
            <div className="floating">
               <FeatureMockup type="graduation" />
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {c.studentFeatures.map((f) => (
                <div key={f.t} className="rounded-[40px] border border-[#10131A]/10 bg-white/40 p-10 backdrop-blur-sm shadow-soft hover:shadow-lg transition-all group">
                  <div className="mb-6 opacity-20 group-hover:opacity-100 transition-opacity">
                     <div className="h-1 w-12 bg-accent rounded-full" />
                  </div>
                  <h3 className="text-2xl font-black text-[#10131A] mb-4 leading-tight">{f.t}</h3>
                  <p className="text-base leading-relaxed text-[#10131A]/60 font-medium">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TUTORIALS SECTION ── */}
        <TutorialSection locale={locale} />
      </section>

      {/* ── BETA REGISTRATION ── */}
      <section id="beta" className="relative py-40 overflow-hidden bg-[#0A0C10] selection:bg-accent/40">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/10 blur-[180px] rounded-full opacity-50" />
        </div>

        <div className="page-shell relative z-10">
          <div className="grid gap-20 lg:grid-cols-[1fr_500px] items-center">
            <div className="space-y-12 text-center lg:text-left">
               <div className="inline-block px-4 py-2 rounded-full border border-white/10 bg-white/5 text-accent text-xs font-black tracking-[0.2em] uppercase mx-auto lg:mx-0">
                  Beta Access Program
               </div>
               <h2 className="text-white font-black leading-[0.85] tracking-[-0.05em]" style={{ fontSize: 'clamp(56px, 8vw, 100px)' }}>
                 {c.betaTitle.split(' ')[0]} <br />
                 <span className="text-accent italic">{c.betaTitle.split(' ').slice(1).join(' ')}</span>
               </h2>
               <p className="text-white/50 text-xl lg:text-2xl leading-relaxed max-w-[500px] font-medium mx-auto lg:mx-0">
                 {c.betaBody}
               </p>
               
               <div className="grid grid-cols-2 gap-12 pt-8">
                  <div className="space-y-3">
                     <p className="text-white font-black text-4xl tracking-tighter leading-none">100%</p>
                     <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Cloud Native & Sync</p>
                  </div>
                  <div className="space-y-3">
                     <p className="text-white font-black text-4xl tracking-tighter leading-none">AES-256</p>
                     <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Encrypted Storage</p>
                  </div>
               </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full opacity-20" />
               <div className="relative glass-dark p-1 rounded-[56px] shadow-vanguard border-white/5">
                  <div className="p-8 lg:p-12">
                     <BetaRegistrationForm locale={locale} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-24 border-t border-ink/5">
        <div className="page-shell flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-6">
             <div className="h-12 w-12 rounded-2xl bg-accent shadow-lg shadow-accent/20 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-white/40 rounded-lg" />
             </div>
             <p className="text-ink/30 text-xs font-bold uppercase tracking-[0.3em]">Agenda Capoeiragem © 2026</p>
          </div>
          <div className="flex gap-10 text-[14px] font-black text-ink/40 uppercase tracking-tighter">
             <Link href="#features" className="hover:text-accent transition-colors">Funcionalidades</Link>
             <Link href="#tutorials" className="hover:text-accent transition-colors">Tutoriales</Link>
             <Link href="#beta" className="hover:text-accent transition-colors">Registrarse</Link>
          </div>
        </div>
        <div className="mt-20 text-center">
           <p className="text-ink/10 text-[10px] font-black tracking-[0.5em] uppercase">Vanguard Web Platform • v2.5.1</p>
        </div>
      </footer>
    </main>
  )
}
