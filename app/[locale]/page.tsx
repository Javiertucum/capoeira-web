import type { Metadata } from 'next'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getSiteDescription } from '@/lib/site'
import HeroHome from '@/components/public/HeroHome'
import DirectoryMapSection, { type DirectoryEducator } from '@/components/public/DirectoryMapSection'
import ValueProposition from '@/components/public/ValueProposition'
import FeaturesOverview from '@/components/public/FeaturesOverview'
import CallToAction from '@/components/public/CallToAction'
import Footer from '@/components/public/Footer'
import type { Group, MapNucleo } from '@/lib/types'

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const COPY = {
  es: {
    title: 'Agenda Capoeiragem',
    heroEyebrow: 'Directorio global de capoeira',
    heroTitlePre: 'Encuentra tu',
    heroAccent: 'comunidad',
    heroTitlePost: 'en cualquier parte del mundo',
    heroBody: 'Núcleos, grupos y educadores conectados en un solo lugar. Descubre dónde entrenar, conoce tu próxima roda y mantente al día con tu comunidad.',
    heroCtaMap: 'Explorar el mapa',
    heroCtaApp: 'Descargar la app',
    statsLabel1: 'Educadores',
    statsLabel2: 'Núcleos',
    statsLabel3: 'Países',
    featuresTitle: 'Una plataforma para toda la comunidad',
    featuresBody: 'Ya sea que busques dónde entrenar o gestiones tu propio núcleo, todo está conectado.',
    studentsTitle: 'Para quien busca dónde entrenar',
    studentsItems: [
      'Directorio y mapa global de núcleos, grupos y educadores.',
      'Calendario de eventos: rodas, talleres y batizados — disponibles en la app.',
      'Perfil comunitario con tu corda, tu grupo y tu red de núcleos.',
    ],
    educatorsTitle: 'Para quien organiza',
    educatorsItems: [
      'Control de asistencia y sistema de graduación/cordas configurable.',
      'Tesorería del núcleo con reportes exportables en PDF y CSV.',
      'Gestión de eventos: batizados y rodas con ubicación en el mapa.',
    ],
    educatorsCta: 'Descubre todo lo que puedes hacer',
    downloadTitle: 'La app ya está disponible',
    downloadBody: 'Descarga Agenda Capoeiragem y conecta tu núcleo, tus alumnos y tu comunidad en un solo lugar.',
    downloadBenefits: ['Disponible para Android', 'Gratis para empezar', 'Configuración en minutos'],
    downloadButton: 'Descargar para Android',
    downloadLearnMore: 'Conoce todos los beneficios',
    iosNote: 'iOS próximamente',
  },
  pt: {
    title: 'Agenda Capoeiragem',
    heroEyebrow: 'Diretório global de capoeira',
    heroTitlePre: 'Encontre sua',
    heroAccent: 'comunidade',
    heroTitlePost: 'em qualquer parte do mundo',
    heroBody: 'Núcleos, grupos e educadores conectados em um só lugar. Descubra onde treinar, conheça sua próxima roda e fique por dentro da sua comunidade.',
    heroCtaMap: 'Explorar o mapa',
    heroCtaApp: 'Baixar o app',
    statsLabel1: 'Educadores',
    statsLabel2: 'Núcleos',
    statsLabel3: 'Países',
    featuresTitle: 'Uma plataforma para toda a comunidade',
    featuresBody: 'Seja para encontrar onde treinar ou para gerenciar seu próprio núcleo, tudo está conectado.',
    studentsTitle: 'Para quem busca onde treinar',
    studentsItems: [
      'Diretório e mapa global de núcleos, grupos e educadores.',
      'Calendário de eventos: rodas, oficinas e batizados — disponíveis no app.',
      'Perfil comunitário com sua corda, seu grupo e sua rede de núcleos.',
    ],
    educatorsTitle: 'Para quem organiza',
    educatorsItems: [
      'Controle de presença e sistema de graduação/cordas configurável.',
      'Tesouraria do núcleo com relatórios exportáveis em PDF e CSV.',
      'Gestão de eventos: batizados e rodas com localização no mapa.',
    ],
    educatorsCta: 'Descubra tudo o que você pode fazer',
    downloadTitle: 'O app já está disponível',
    downloadBody: 'Baixe o Agenda Capoeiragem e conecte seu núcleo, seus alunos e sua comunidade em um só lugar.',
    downloadBenefits: ['Disponível para Android', 'Grátis para começar', 'Configuração em minutos'],
    downloadButton: 'Baixar para Android',
    downloadLearnMore: 'Conheça todos os benefícios',
    iosNote: 'iOS em breve',
  },
  en: {
    title: 'Agenda Capoeiragem',
    heroEyebrow: 'Global capoeira directory',
    heroTitlePre: 'Find your',
    heroAccent: 'community',
    heroTitlePost: 'anywhere in the world',
    heroBody: 'Schools, groups and educators connected in one place. Discover where to train, find your next roda and stay up to date with your community.',
    heroCtaMap: 'Explore the map',
    heroCtaApp: 'Download the app',
    statsLabel1: 'Educators',
    statsLabel2: 'Schools',
    statsLabel3: 'Countries',
    featuresTitle: 'One platform for the whole community',
    featuresBody: "Whether you're looking for a place to train or running your own school, it's all connected.",
    studentsTitle: 'For those looking for a place to train',
    studentsItems: [
      'Global directory and map of schools, groups and educators.',
      'Event calendar: rodas, workshops and batizados — available in the app.',
      'Community profile with your belt, your group and your network of schools.',
    ],
    educatorsTitle: 'For those who organize',
    educatorsItems: [
      'Attendance tracking and configurable belt/graduation system.',
      'School treasury with exportable PDF and CSV reports.',
      'Event management: batizados and rodas with map location.',
    ],
    educatorsCta: 'Discover everything you can do',
    downloadTitle: 'The app is already available',
    downloadBody: 'Download Agenda Capoeiragem and connect your school, your students and your community in one place.',
    downloadBenefits: ['Available for Android', 'Free to start', 'Setup in minutes'],
    downloadButton: 'Download for Android',
    downloadLearnMore: 'See all the benefits',
    iosNote: 'iOS coming soon',
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
      <HeroHome copy={c} stats={stats} locale={locale} />
      <DirectoryMapSection locale={locale} nucleos={nucleos} groups={groups} educators={educators} />
      <ValueProposition />
      <FeaturesOverview copy={c} locale={locale} />
      <CallToAction copy={c} locale={locale} />
      <Footer locale={locale} />
    </main>
  )
}
