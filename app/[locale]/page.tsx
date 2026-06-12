import type { Metadata } from 'next'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getSiteDescription } from '@/lib/site'
import Hero from '@/components/public/Hero'
import ValueProposition from '@/components/public/ValueProposition'
import FeaturesShowcase from '@/components/public/FeaturesShowcase'
import DirectoryMapSection, { type DirectoryEducator } from '@/components/public/DirectoryMapSection'
import CallToAction from '@/components/public/CallToAction'
import Footer from '@/components/public/Footer'
import type { Group, MapNucleo } from '@/lib/types'

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const COPY = {
  es: {
    title: 'Agenda Capoeiragem',
    eyebrow: 'Plataforma Oficial',
    heroLine1: 'Tu comunidad', heroEm: 'conectada', heroLine2: 'en',
    heroLine3: 'Agenda Capoeiragem',
    body: 'La herramienta definitiva para el capoeirista moderno. Gestiona tus núcleos, organiza batizados, pasa lista a tus alumnos y genera reportes profesionales de tu actividad.',
    ctaHero: 'Únete a la Comunidad',
    showcaseTitle: 'Una plataforma, dos experiencias',
    showcaseBody: 'Diseñada específicamente para las necesidades de quienes organizan el juego y quienes participan en él.',
    educatorSubtitle: 'Para Educadores y Organizadores',
    educatorFeatures: [
      { t: 'KPI Dashboard', d: 'Visualiza alumnos activos, retención mensual y salud financiera de tu núcleo en tiempo real.' },
      { t: 'Control de Asistencia', d: 'Pasa lista de forma inmediata en cada sesión del día y mantén el registro actualizado en la nube.' },
      { t: 'Sistema de Graduación', d: 'Configura la jerarquía de cordas de tu grupo, define umbrales de educador y gestiona asignaciones.' },
      { t: 'Tesorería del Núcleo', d: 'Administra pagos pendientes, mensualidades y clases sueltas con insignias visuales de estado y control multi-moneda.' },
      { t: 'Reportes Exportables', d: 'Genera reportes de asistencia y finanzas automáticamente para exportarlos en PDF y CSV.' },
      { t: 'Gestión de Eventos', d: 'Crea batizados y rodas, fija la ubicación en el mapa, sube múltiples pósters y asigna co-organizadores.' },
      { t: 'Directorio de Alumnos', d: 'Base de datos completa con el historial de graduaciones, progreso y contacto de cada miembro.' }
    ],
    studentSubtitle: 'Para Alumnos y Viajeros',
    studentFeatures: [
      { t: 'Directorio y Mapa Global', d: 'Busca núcleos, grupos y educadores por ciudad o país en un mapa interactivo para encontrar dónde entrenar.' },
      { t: 'Calendario de Eventos', d: 'Descubre rodas, talleres y batizados organizados por proximidad. Confirma tu interés y agrégalos a tu calendario.' },
      { t: 'Perfil Comunitario', d: 'Lleva tu historial capoeirístico en el bolsillo: tu corda, tu grupo, y la red de núcleos donde entrenas.' },
      { t: 'Feed Personalizado', d: 'Recibe noticias, notificaciones push de tus educadores y avisos de última hora directamente en tu inicio.' }
    ],
    advancedTitle: 'Ecosistema Avanzado',
    advancedFeatures: [
      { t: 'Jerarquía de Grupo', d: 'Supervisa educativamente múltiples núcleos y gestiona a los administradores de tu organización.', mockup: 'home' },
      { t: 'Métricas Reales', d: 'Gráficos de retención, crecimiento de alumnos y finanzas consolidadas para una toma de decisiones inteligente.', mockup: 'kpi' },
      { t: 'Sincronización Segura', d: 'Datos protegidos para garantizar que el historial y la información de tu comunidad siempre estén a salvo.', mockup: 'finances' }
    ],
    betaTitle: 'Únete a Agenda Capoeiragem',
    betaBody: 'Únete a cientos de capoeiristas en todo el mundo. Déjanos tus datos y te enviaremos una invitación personal para que empieces a organizar tu comunidad hoy mismo.',
    statsLabel1: 'Educadores',
    statsLabel2: 'Núcleos',
    statsLabel3: 'Países',
  },
  pt: {
    title: 'Agenda Capoeiragem',
    eyebrow: 'Plataforma Oficial',
    heroLine1: 'Sua comunidade', heroEm: 'conectada', heroLine2: 'na',
    heroLine3: 'Agenda Capoeiragem',
    body: 'A ferramenta definitiva para o capoeirista moderno. Gerencie seus núcleos, organize batizados, faça chamadas e gere relatórios profissionais da sua atividade.',
    ctaHero: 'Junte-se à Comunidade',
    showcaseTitle: 'Uma plataforma, duas experiências',
    showcaseBody: 'Projetada especificamente para as necessidades de quem organiza a roda e de quem participa.',
    educatorSubtitle: 'Para Educadores e Organizadores',
    educatorFeatures: [
      { t: 'Painel KPI', d: 'Visualize alunos ativos, retenção mensal e saúde financeira do seu núcleo em tempo real.' },
      { t: 'Controle de Presença', d: 'Faça a chamada instantaneamente em cada sessão do dia e mantenha o registro atualizado na nuvem.' },
      { t: 'Sistema de Graduação', d: 'Configure a hierarquia de cordas do seu grupo, defina limites de educador e gerencie atribuições.' },
      { t: 'Tesouraria do Núcleo', d: 'Administre pagamentos pendentes, mensalidades e aulas avulsas com emblemas visuais e controle multi-moeda.' },
      { t: 'Relatórios Exportáveis', d: 'Gere relatórios de frequência e finanças automaticamente para exportá-los em PDF e CSV.' },
      { t: 'Gestão de Eventos', d: 'Crie batizados e rodas, marque a localização no mapa, faça upload de vários pôsteres e atribua co-organizadores.' },
      { t: 'Diretório de Alunos', d: 'Base de dados completa com o histórico de graduação, progresso e contato de cada membro.' }
    ],
    studentSubtitle: 'Para Alunos e Viajantes',
    studentFeatures: [
      { t: 'Diretório e Mapa Global', d: 'Busque núcleos, grupos e educadores por cidade ou país em um mapa interativo para encontrar onde treinar.' },
      { t: 'Calendário de Eventos', d: 'Descubra rodas, oficinas e batizados por proximidade. Confirme seu interesse e adicione-os ao seu calendário.' },
      { t: 'Perfil Comunitário', d: 'Leve seu histórico de capoeira no bolso: sua corda, seu grupo e a rede de núcleos onde treina.' },
      { t: 'Feed Personalizado', d: 'Receba notícias, notificações push de seus educadores e avisos de última hora diretamente no seu início.' }
    ],
    advancedTitle: 'Ecossistema Avançado',
    advancedFeatures: [
      { t: 'Hierarquia de Grupo', d: 'Supervisione educativamente múltiplos núcleos e gerencie os administradores da sua organização.', mockup: 'home' },
      { t: 'Métricas Reais', d: 'Gráficos de retenção, crescimento de alunos e finanças consolidadas para uma tomada de decisão inteligente.', mockup: 'kpi' },
      { t: 'Sincronização Segura', d: 'Dados protegidos para garantir que o histórico e a informação da sua comunidade estejam sempre seguros.', mockup: 'finances' }
    ],
    betaTitle: 'Faça parte da Agenda Capoeiragem',
    betaBody: 'Junte-se a centenas de capoeiristas em todo o mundo. Deixe seus dados e enviaremos um convite pessoal para você começar a organizar sua comunidade hoje.',
    statsLabel1: 'Educadores',
    statsLabel2: 'Núcleos',
    statsLabel3: 'Países',
  },
  en: {
    title: 'Agenda Capoeiragem',
    eyebrow: 'Official Platform',
    heroLine1: 'Your community', heroEm: 'connected', heroLine2: 'on',
    heroLine3: 'Agenda Capoeiragem',
    body: 'The ultimate tool for the modern capoeirista. Manage your schools, organize batizados, take attendance, and generate professional reports of your activity.',
    ctaHero: 'Join the Community',
    showcaseTitle: 'One platform, two experiences',
    showcaseBody: 'Designed specifically for the needs of those who organize the roda and those who play in it.',
    educatorSubtitle: 'For Educators and Organizers',
    educatorFeatures: [
      { t: 'KPI Dashboard', d: 'Visualize active students, monthly retention, and financial health in real-time.' },
      { t: 'Attendance Control', d: 'Take attendance instantly for each daily session and keep records synced in the cloud.' },
      { t: 'Graduation System', d: 'Configure your group’s belt hierarchy, define educator thresholds, and manage assignments.' },
      { t: 'Center Treasury', d: 'Manage pending payments, monthly fees, and single classes with visual status badges and multi-currency control.' },
      { t: 'Exportable Reports', d: 'Generate automatic attendance and financial reports to export as PDF and CSV.' },
      { t: 'Event Management', d: 'Create batizados and rodas, pin map locations, upload multiple posters, and assign co-organizers.' },
      { t: 'Student Directory', d: 'Complete database with graduation history, progress, and contact info for each member.' }
    ],
    studentSubtitle: 'For Students and Travelers',
    studentFeatures: [
      { t: 'Global Directory & Map', d: 'Search for centers, groups, and educators by city or country on an interactive map to find where to train.' },
      { t: 'Event Calendar', d: 'Discover rodas, workshops, and batizados by proximity. Confirm your interest and add them to your calendar.' },
      { t: 'Community Profile', d: 'Carry your capoeira history in your pocket: your belt, your group, and the network of centers where you train.' },
      { t: 'Personalized Feed', d: 'Receive news, push notifications from your educators, and last-minute announcements directly on your home screen.' }
    ],
    advancedTitle: 'Advanced Ecosystem',
    advancedFeatures: [
      { t: 'Group Hierarchy', d: 'Educatively supervise multiple centers and manage the administrators of your organization.', mockup: 'home' },
      { t: 'Real Metrics', d: 'Retention charts, student growth, and consolidated finances for smart decision making.', mockup: 'kpi' },
      { t: 'Secure Synchronization', d: 'Protected data to ensure your group’s history and community information are always safe.', mockup: 'finances' }
    ],
    betaTitle: 'Be part of Agenda Capoeiragem',
    betaBody: 'Join hundreds of capoeiristas worldwide. Leave us your details and we will send a personal invite to start organizing your community today.',
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
  let nucleos: MapNucleo[] = []
  let groups: Group[] = []
  let educators: DirectoryEducator[] = []
  try {
    const { getStats, getAllNucleos, getAllGroups, getAllEducators, getGraduationLevelNamesByGroup } = await import('@/lib/queries')
    const [s, allNucleos, allGroups, allEducators] = await Promise.all([
      getStats(),
      getAllNucleos(),
      getAllGroups(),
      getAllEducators(),
    ])
    stats = { educators: s.educators, nucleos: s.nucleos, countries: s.countries }
    nucleos = allNucleos
    groups = allGroups

    const groupNameById = new Map(allGroups.map((g) => [g.id, g.name]))
    const gradNamesByGroup = await getGraduationLevelNamesByGroup(
      allEducators.map((e) => e.groupId).filter((id): id is string => Boolean(id))
    )
    educators = allEducators.map((e) => ({
      ...e,
      groupName: e.groupId ? groupNameById.get(e.groupId) ?? null : null,
      graduationName:
        e.groupId && e.graduationLevelId
          ? gradNamesByGroup.get(e.groupId)?.get(e.graduationLevelId) ?? null
          : null,
    }))
  } catch {}

  return (
    <main className="min-h-screen bg-bg selection:bg-accent/20 overflow-x-hidden">
      <DirectoryMapSection locale={locale} nucleos={nucleos} groups={groups} educators={educators} />
      <Hero copy={c} stats={stats} />
      <ValueProposition />
      <FeaturesShowcase copy={c} locale={locale} />
      <CallToAction copy={c} locale={locale} />
      <Footer />
    </main>
  )
}
