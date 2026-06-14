import type { Metadata } from 'next'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getSiteDescription } from '@/lib/site'
import AppHero from '@/components/public/AppHero'
import AppBenefitsEducators from '@/components/public/AppBenefitsEducators'
import AppBenefitsStudents from '@/components/public/AppBenefitsStudents'
import AppDownloadCTA from '@/components/public/AppDownloadCTA'
import Footer from '@/components/public/Footer'

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const COPY = {
  es: {
    title: 'Descarga la App — Agenda Capoeiragem',
    appHeroEyebrow: 'Disponible en Google Play',
    appHeroTitle: 'Lleva tu comunidad de capoeira en el bolsillo',
    appHeroSubtitle: 'La app oficial de Agenda Capoeiragem conecta a educadores y alumnos: asistencia, graduaciones, finanzas, eventos y el mapa global de núcleos, todo en un solo lugar.',
    appHeroPlayButton: 'Descargar en Google Play',
    appHeroIosNote: 'iOS próximamente',
    educatorsTitle: 'Para educadores y organizadores',
    educatorsIntro: 'Todo lo necesario para gestionar tu núcleo, desde el celular.',
    educatorsItems: [
      { t: 'Dashboard KPI', d: 'Visualiza alumnos activos, retención mensual y la salud financiera de tu núcleo en tiempo real.' },
      { t: 'Control de asistencia', d: 'Pasa lista por horario en cada sesión y mantén el registro sincronizado en la nube.' },
      { t: 'Sistema de graduación', d: 'Configura la jerarquía de cordas de tu grupo y define a partir de qué nivel un alumno es educador.' },
      { t: 'Tesorería multi-moneda', d: 'Administra mensualidades, packs de clases y pagos pendientes en CLP, USD, EUR y más.' },
      { t: 'Reportes exportables', d: 'Genera reportes de asistencia y finanzas en PDF y CSV con un toque.' },
      { t: 'Gestión de eventos', d: 'Crea batizados y rodas, fija su ubicación en el mapa, sube pósters y asigna co-organizadores.' },
      { t: 'Directorio de alumnos', d: 'Historial completo de graduaciones, progreso y contacto de cada miembro.' },
      { t: 'Turmas y horarios', d: 'Agrupa a tus alumnos por horario y vincula cada turma a su modalidad de pago.' },
    ],
    educatorsMapCta: '¿Quieres que tu núcleo aparezca en el mapa global?',
    educatorsMapCtaLink: 'Descarga la app y regístralo',
    studentsTitle: 'Para alumnos y viajeros',
    studentsIntro: 'Encuentra tu comunidad estés donde estés.',
    studentsItems: [
      { t: 'Directorio y mapa global', d: 'Busca núcleos, grupos y educadores por ciudad o país en un mapa interactivo.' },
      { t: 'Calendario de eventos', d: 'Descubre rodas, talleres y batizados cercanos, confirma tu interés y agéndalos.' },
      { t: 'Perfil comunitario', d: 'Lleva tu historial: tu corda, tu grupo y tu red de núcleos donde entrenas.' },
      { t: 'Notificaciones', d: 'Recibe avisos de tus educadores y novedades de tu comunidad al instante.' },
    ],
    appCtaTitle: 'Empieza hoy',
    appCtaBody: 'Disponible gratis en Google Play. Configura tu perfil en minutos y conéctate con tu comunidad.',
    appCtaButton: 'Descargar en Google Play',
  },
  pt: {
    title: 'Baixe o App — Agenda Capoeiragem',
    appHeroEyebrow: 'Disponível na Google Play',
    appHeroTitle: 'Leve sua comunidade de capoeira no bolso',
    appHeroSubtitle: 'O app oficial do Agenda Capoeiragem conecta educadores e alunos: presença, graduações, finanças, eventos e o mapa global de núcleos, tudo em um só lugar.',
    appHeroPlayButton: 'Baixar na Google Play',
    appHeroIosNote: 'iOS em breve',
    educatorsTitle: 'Para educadores e organizadores',
    educatorsIntro: 'Tudo o que você precisa para gerenciar seu núcleo, direto do celular.',
    educatorsItems: [
      { t: 'Painel KPI', d: 'Visualize alunos ativos, retenção mensal e a saúde financeira do seu núcleo em tempo real.' },
      { t: 'Controle de presença', d: 'Faça a chamada por horário em cada sessão e mantenha o registro sincronizado na nuvem.' },
      { t: 'Sistema de graduação', d: 'Configure a hierarquia de cordas do seu grupo e defina a partir de qual nível um aluno é educador.' },
      { t: 'Tesouraria multi-moeda', d: 'Administre mensalidades, pacotes de aulas e pagamentos pendentes em CLP, USD, EUR e mais.' },
      { t: 'Relatórios exportáveis', d: 'Gere relatórios de presença e finanças em PDF e CSV com um toque.' },
      { t: 'Gestão de eventos', d: 'Crie batizados e rodas, marque a localização no mapa, envie pôsteres e atribua co-organizadores.' },
      { t: 'Diretório de alunos', d: 'Histórico completo de graduações, progresso e contato de cada membro.' },
      { t: 'Turmas e horários', d: 'Agrupe seus alunos por horário e vincule cada turma à sua modalidade de pagamento.' },
    ],
    educatorsMapCta: 'Quer que seu núcleo apareça no mapa global?',
    educatorsMapCtaLink: 'Baixe o app e cadastre-o',
    studentsTitle: 'Para alunos e viajantes',
    studentsIntro: 'Encontre sua comunidade onde estiver.',
    studentsItems: [
      { t: 'Diretório e mapa global', d: 'Busque núcleos, grupos e educadores por cidade ou país em um mapa interativo.' },
      { t: 'Calendário de eventos', d: 'Descubra rodas, oficinas e batizados próximos, confirme seu interesse e agende-os.' },
      { t: 'Perfil comunitário', d: 'Leve seu histórico: sua corda, seu grupo e sua rede de núcleos onde treina.' },
      { t: 'Notificações', d: 'Receba avisos dos seus educadores e novidades da sua comunidade instantaneamente.' },
    ],
    appCtaTitle: 'Comece hoje',
    appCtaBody: 'Disponível gratuitamente na Google Play. Configure seu perfil em minutos e conecte-se com sua comunidade.',
    appCtaButton: 'Baixar na Google Play',
  },
  en: {
    title: 'Download the App — Agenda Capoeiragem',
    appHeroEyebrow: 'Available on Google Play',
    appHeroTitle: 'Carry your capoeira community in your pocket',
    appHeroSubtitle: 'The official Agenda Capoeiragem app connects educators and students: attendance, graduations, finances, events and the global map of schools, all in one place.',
    appHeroPlayButton: 'Get it on Google Play',
    appHeroIosNote: 'iOS coming soon',
    educatorsTitle: 'For educators and organizers',
    educatorsIntro: 'Everything you need to run your school, from your phone.',
    educatorsItems: [
      { t: 'KPI Dashboard', d: "Track active students, monthly retention and your school's financial health in real time." },
      { t: 'Attendance tracking', d: 'Take attendance per time slot for each session and keep records synced in the cloud.' },
      { t: 'Graduation system', d: "Configure your group's belt hierarchy and set the level at which a student becomes an educator." },
      { t: 'Multi-currency treasury', d: 'Manage monthly fees, class packs and pending payments in CLP, USD, EUR and more.' },
      { t: 'Exportable reports', d: 'Generate attendance and financial reports in PDF and CSV with one tap.' },
      { t: 'Event management', d: 'Create batizados and rodas, pin their location on the map, upload posters and assign co-organizers.' },
      { t: 'Student directory', d: 'Full history of graduations, progress and contact info for every member.' },
      { t: 'Classes and schedules', d: 'Group your students by schedule and link each class to its payment plan.' },
    ],
    educatorsMapCta: 'Want your school to appear on the global map?',
    educatorsMapCtaLink: 'Download the app and register it',
    studentsTitle: 'For students and travelers',
    studentsIntro: 'Find your community wherever you are.',
    studentsItems: [
      { t: 'Global directory & map', d: 'Search for schools, groups and educators by city or country on an interactive map.' },
      { t: 'Event calendar', d: 'Discover nearby rodas, workshops and batizados, confirm your interest and add them to your calendar.' },
      { t: 'Community profile', d: 'Carry your history: your belt, your group and the network of schools where you train.' },
      { t: 'Notifications', d: 'Get instant updates from your educators and news from your community.' },
    ],
    appCtaTitle: 'Get started today',
    appCtaBody: 'Free on Google Play. Set up your profile in minutes and connect with your community.',
    appCtaButton: 'Get it on Google Play',
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
    alternates: { canonical: getLocalizedPath(locale, 'app'), languages: getLanguageAlternates('app') },
    openGraph: { title: formatPageTitle(copy.title), description: getSiteDescription(locale), url: getLocalizedPath(locale, 'app'), type: 'website' },
  }
}

export default async function AppLandingPage({ params }: Props) {
  const { locale } = await params
  const c = getCopy(locale)

  return (
    <main className="min-h-screen bg-bg selection:bg-accent/20 overflow-x-hidden">
      <AppHero copy={c} />
      <AppBenefitsEducators copy={c} locale={locale} />
      <AppBenefitsStudents copy={c} />
      <AppDownloadCTA copy={c} />
      <Footer locale={locale} />
    </main>
  )
}
