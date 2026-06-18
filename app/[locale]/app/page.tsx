import type { Metadata } from 'next'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getOgLocale, getSiteDescription, SITE_NAME } from '@/lib/site'
import { getStats } from '@/lib/queries'
import AppHero from '@/components/public/AppHero'
import AppFeaturesBento from '@/components/public/AppFeaturesBento'
import AppBenefitsEducators from '@/components/public/AppBenefitsEducators'
import AppBenefitsStudents from '@/components/public/AppBenefitsStudents'
import AppPremium from '@/components/public/AppPremium'
import AppTestimonials from '@/components/public/AppTestimonials'
import AppDownloadCTA from '@/components/public/AppDownloadCTA'
import Footer from '@/components/public/Footer'

export const revalidate = 3600

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const COPY = {
  es: {
    title: 'Descarga la App — Agenda Capoeiragem',
    // Hero
    appHeroEyebrow: 'Disponible en Google Play',
    appHeroTitle: 'Lleva tu comunidad de capoeira en el bolsillo',
    appHeroSubtitle: 'Asistencia, graduaciones, finanzas, eventos y el mapa global de núcleos. Todo en un solo lugar, para educadores y alumnos.',
    appHeroPlayButton: 'Descargar en Google Play',
    appHeroIosNote: 'iOS próximamente',
    // Stats labels
    statGroups: 'Grupos',
    statNucleos: 'Núcleos',
    statEducators: 'Educadores',
    statCountries: 'Países',
    // Bento
    featuresBentoLabel: 'Qué incluye la app',
    // Educators
    educatorsTitle: 'Para educadores y organizadores',
    educatorsIntro: 'Todo lo necesario para gestionar tu núcleo, desde el celular.',
    educatorsSpotlights: [
      {
        tag: 'Asistencia',
        title: 'Pasa lista en segundos',
        desc: 'Selecciona el horario, marca cada alumno como presente o ausente con un toque y guarda con confirmación. El historial queda sincronizado en la nube en tiempo real.',
        mockup: 'attendance',
      },
      {
        tag: 'Dashboard KPI',
        title: 'La salud de tu núcleo, de un vistazo',
        desc: 'Alumnos activos, tasa de retención, asistencia promedio e ingresos del mes. Métricas que importan, sin hoja de cálculo ni configuraciones complicadas.',
        mockup: 'kpi',
      },
      {
        tag: 'Graduaciones',
        title: 'Tu jerarquía, a tu medida',
        desc: 'Configura las cordas de tu grupo con categorías infantil, juvenil y adulto. Define qué nivel convierte a un alumno en educador. Compatible con cualquier estilo: Angola, Regional, Contemporánea y sistemas mixtos.',
        mockup: 'graduation',
      },
      {
        tag: 'Finanzas',
        title: 'Tesorería sin hoja de cálculo',
        desc: 'Administra mensualidades, packs de clases y pagos pendientes. Multi-moneda (CLP, USD, EUR y más). Exporta reportes de asistencia y finanzas en PDF y CSV con un toque.',
        mockup: 'finances',
      },
    ],
    // Students
    studentsTitle: 'Para alumnos y viajeros',
    studentsIntro: 'Encuentra tu comunidad y mantente conectado, estés donde estés.',
    studentsSpotlights: [
      {
        tag: 'Mapa global',
        title: 'Encuentra capoeira donde vayas',
        desc: 'Mapa interactivo con núcleos, grupos y educadores de todo el mundo. Filtra por ciudad, país o estilo de capoeira. Imprescindible para capoeiristas en movimiento.',
        mockup: 'map',
      },
      {
        tag: 'Eventos',
        title: 'Tu calendario de batizados y rodas',
        desc: 'Descubre batizados, rodas y talleres en tu red y alrededor del mundo. Confirma asistencia, marca interés y recibe recordatorios automáticos de tu educador.',
        mockup: 'event',
      },
    ],
    studentsExtrasLabel: 'Y también incluye',
    studentsExtras: [
      { t: 'Perfil comunitario', d: 'Tu corda, tu grupo, tu red de núcleos y tu historial de graduaciones en un solo lugar.' },
      { t: 'Notificaciones', d: 'Avisos de tus educadores y novedades de tu comunidad al instante, sin perderte nada.' },
    ],
    // Premium
    premiumEyebrow: 'Planes',
    premiumTitle: 'Empieza gratis, crece sin límites',
    premiumBody: 'La app es completamente gratuita. El plan Pro desbloquea eventos ilimitados para educadores, más actividad para alumnos y elimina los anuncios.',
    premiumFreeLabel: 'Gratuito',
    premiumFreePrice: '$0',
    premiumFreeCta: 'Descargar gratis',
    premiumFreeItems: [
      'Mapa y directorio global de núcleos y grupos',
      'Perfil comunitario con corda e historial',
      'Hasta 10 eventos por mes (educador)',
      'Registro de 1 roda por mes (alumno)',
      'Control de asistencia y finanzas',
      'Sistema de graduación completo',
    ],
    premiumProLabel: 'Pro',
    premiumProPrice: '$2 USD',
    premiumProPeriod: 'por mes · también disponible plan anual',
    premiumProCta: 'Comenzar con Pro',
    premiumProItems: [
      'Todo lo del plan gratuito',
      'Eventos ilimitados para educadores',
      'Registro de hasta 5 rodas por mes (alumno)',
      'Sin anuncios en toda la app',
      'Exportación PDF y CSV de reportes',
      'Soporte prioritario',
      'Apoyas el desarrollo de la plataforma',
    ],
    // Final CTA
    appCtaTitle: 'Empieza hoy',
    appCtaBody: 'Disponible gratis en Google Play. Configura tu perfil en minutos y conéctate con tu comunidad.',
    appCtaButton: 'Descargar en Google Play',
  },
  pt: {
    title: 'Baixe o App — Agenda Capoeiragem',
    appHeroEyebrow: 'Disponível na Google Play',
    appHeroTitle: 'Leve sua comunidade de capoeira no bolso',
    appHeroSubtitle: 'Presença, graduações, finanças, eventos e o mapa global de núcleos. Tudo em um só lugar, para educadores e alunos.',
    appHeroPlayButton: 'Baixar na Google Play',
    appHeroIosNote: 'iOS em breve',
    statGroups: 'Grupos',
    statNucleos: 'Núcleos',
    statEducators: 'Educadores',
    statCountries: 'Países',
    featuresBentoLabel: 'O que inclui o app',
    educatorsTitle: 'Para educadores e organizadores',
    educatorsIntro: 'Tudo o que você precisa para gerenciar seu núcleo, direto do celular.',
    educatorsSpotlights: [
      {
        tag: 'Presença',
        title: 'Faça a chamada em segundos',
        desc: 'Selecione o horário, marque cada aluno como presente ou ausente com um toque e salve com confirmação. O histórico fica sincronizado na nuvem em tempo real.',
        mockup: 'attendance',
      },
      {
        tag: 'Painel KPI',
        title: 'A saúde do seu núcleo, de relance',
        desc: 'Alunos ativos, taxa de retenção, presença média e receita do mês. Métricas que importam, sem planilha nem configurações complicadas.',
        mockup: 'kpi',
      },
      {
        tag: 'Graduações',
        title: 'Sua hierarquia, do seu jeito',
        desc: 'Configure as cordas do seu grupo com categorias infantil, juvenil e adulto. Defina qual nível torna um aluno em educador. Compatível com Angola, Regional, Contemporânea e sistemas mistos.',
        mockup: 'graduation',
      },
      {
        tag: 'Finanças',
        title: 'Tesouraria sem planilha',
        desc: 'Gerencie mensalidades, pacotes de aulas e pagamentos pendentes. Multi-moeda (CLP, USD, EUR e mais). Exporte relatórios de presença e finanças em PDF e CSV com um toque.',
        mockup: 'finances',
      },
    ],
    studentsTitle: 'Para alunos e viajantes',
    studentsIntro: 'Encontre sua comunidade e permaneça conectado, onde quer que esteja.',
    studentsSpotlights: [
      {
        tag: 'Mapa global',
        title: 'Encontre capoeira onde for',
        desc: 'Mapa interativo com núcleos, grupos e educadores do mundo todo. Filtre por cidade, país ou estilo de capoeira. Indispensável para capoeiristas em movimento.',
        mockup: 'map',
      },
      {
        tag: 'Eventos',
        title: 'Seu calendário de batizados e rodas',
        desc: 'Descubra batizados, rodas e oficinas na sua rede e ao redor do mundo. Confirme presença, marque interesse e receba lembretes automáticos do seu educador.',
        mockup: 'event',
      },
    ],
    studentsExtrasLabel: 'E também inclui',
    studentsExtras: [
      { t: 'Perfil comunitário', d: 'Sua corda, seu grupo, sua rede de núcleos e seu histórico de graduações em um só lugar.' },
      { t: 'Notificações', d: 'Avisos dos seus educadores e novidades da sua comunidade instantaneamente, sem perder nada.' },
    ],
    premiumEyebrow: 'Planos',
    premiumTitle: 'Comece grátis, cresça sem limites',
    premiumBody: 'O app é completamente gratuito. O plano Pro desbloqueia eventos ilimitados para educadores, mais atividade para alunos e elimina os anúncios.',
    premiumFreeLabel: 'Gratuito',
    premiumFreePrice: '$0',
    premiumFreeCta: 'Baixar grátis',
    premiumFreeItems: [
      'Mapa e diretório global de núcleos e grupos',
      'Perfil comunitário com corda e histórico',
      'Até 10 eventos por mês (educador)',
      'Registro de 1 roda por mês (aluno)',
      'Controle de presença e finanças',
      'Sistema de graduação completo',
    ],
    premiumProLabel: 'Pro',
    premiumProPrice: '$2 USD',
    premiumProPeriod: 'por mês · plano anual também disponível',
    premiumProCta: 'Começar com Pro',
    premiumProItems: [
      'Tudo do plano gratuito',
      'Eventos ilimitados para educadores',
      'Registro de até 5 rodas por mês (aluno)',
      'Sem anúncios em todo o app',
      'Exportação PDF e CSV de relatórios',
      'Suporte prioritário',
      'Você apoia o desenvolvimento da plataforma',
    ],
    appCtaTitle: 'Comece hoje',
    appCtaBody: 'Disponível gratuitamente na Google Play. Configure seu perfil em minutos e conecte-se com sua comunidade.',
    appCtaButton: 'Baixar na Google Play',
  },
  en: {
    title: 'Download the App — Agenda Capoeiragem',
    appHeroEyebrow: 'Available on Google Play',
    appHeroTitle: 'Carry your capoeira community in your pocket',
    appHeroSubtitle: 'Attendance, graduations, finances, events and the global map of schools. All in one place, for educators and students.',
    appHeroPlayButton: 'Get it on Google Play',
    appHeroIosNote: 'iOS coming soon',
    statGroups: 'Groups',
    statNucleos: 'Schools',
    statEducators: 'Educators',
    statCountries: 'Countries',
    featuresBentoLabel: 'What the app includes',
    educatorsTitle: 'For educators and organizers',
    educatorsIntro: 'Everything you need to run your school, right from your phone.',
    educatorsSpotlights: [
      {
        tag: 'Attendance',
        title: 'Take attendance in seconds',
        desc: 'Select the time slot, tap each student to mark them present or absent, and save with a confirmation dialog. The full history syncs to the cloud in real time.',
        mockup: 'attendance',
      },
      {
        tag: 'KPI Dashboard',
        title: "Your school's health, at a glance",
        desc: 'Active students, retention rate, average attendance and monthly revenue. Metrics that matter — no spreadsheet, no complicated setup.',
        mockup: 'kpi',
      },
      {
        tag: 'Graduations',
        title: 'Your hierarchy, your way',
        desc: "Configure your group's belts with children, youth, and adult categories. Set which level makes a student an educator. Compatible with Angola, Regional, Contemporary and mixed systems.",
        mockup: 'graduation',
      },
      {
        tag: 'Finances',
        title: 'Treasury without the spreadsheet',
        desc: 'Manage monthly fees, class packs and pending payments. Multi-currency (CLP, USD, EUR and more). Export attendance and financial reports as PDF and CSV with one tap.',
        mockup: 'finances',
      },
    ],
    studentsTitle: 'For students and travelers',
    studentsIntro: 'Find your community and stay connected, wherever you are.',
    studentsSpotlights: [
      {
        tag: 'Global map',
        title: 'Find capoeira wherever you go',
        desc: 'Interactive map with schools, groups and educators from around the world. Filter by city, country or capoeira style. A must-have for capoeiristas on the move.',
        mockup: 'map',
      },
      {
        tag: 'Events',
        title: 'Your batizado and roda calendar',
        desc: 'Discover batizados, rodas and workshops in your network and around the world. Confirm attendance, mark interest and get automatic reminders from your educator.',
        mockup: 'event',
      },
    ],
    studentsExtrasLabel: 'Also included',
    studentsExtras: [
      { t: 'Community profile', d: 'Your belt, your group, your network of schools and your graduation history, all in one place.' },
      { t: 'Notifications', d: "Instant updates from your educators and news from your community — never miss a thing." },
    ],
    premiumEyebrow: 'Plans',
    premiumTitle: 'Start free, grow without limits',
    premiumBody: 'The app is completely free to download. The Pro plan unlocks unlimited events for educators, more activity for students, and removes all ads.',
    premiumFreeLabel: 'Free',
    premiumFreePrice: '$0',
    premiumFreeCta: 'Download free',
    premiumFreeItems: [
      'Global map and directory of schools and groups',
      'Community profile with belt and history',
      'Up to 10 events per month (educator)',
      'Log 1 roda per month (student)',
      'Attendance and financial tracking',
      'Full graduation system',
    ],
    premiumProLabel: 'Pro',
    premiumProPrice: '$2 USD',
    premiumProPeriod: 'per month · annual plan also available',
    premiumProCta: 'Start with Pro',
    premiumProItems: [
      'Everything in the free plan',
      'Unlimited events for educators',
      'Log up to 5 rodas per month (student)',
      'No ads anywhere in the app',
      'PDF and CSV report exports',
      'Priority support',
      'You support the development of the platform',
    ],
    appCtaTitle: 'Get started today',
    appCtaBody: 'Free on Google Play. Set up your profile in minutes and connect with your community.',
    appCtaButton: 'Get it on Google Play',
  },
  fr: {
    title: 'Téléchargez l\'app — Agenda Capoeiragem',
    appHeroEyebrow: 'Disponible sur Google Play',
    appHeroTitle: 'Emportez votre communauté de capoeira dans votre poche',
    appHeroSubtitle: 'Présence, graduations, finances, événements et la carte mondiale des noyaux. Tout au même endroit, pour les éducateurs et les élèves.',
    appHeroPlayButton: 'Télécharger sur Google Play',
    appHeroIosNote: 'iOS bientôt disponible',
    statGroups: 'Groupes',
    statNucleos: 'Noyaux',
    statEducators: 'Éducateurs',
    statCountries: 'Pays',
    featuresBentoLabel: 'Ce que contient l\'app',
    educatorsTitle: 'Pour les éducateurs et organisateurs',
    educatorsIntro: 'Tout ce qu\'il faut pour gérer votre noyau, directement depuis votre téléphone.',
    educatorsSpotlights: [
      {
        tag: 'Présence',
        title: 'Faites l\'appel en quelques secondes',
        desc: 'Sélectionnez le créneau, marquez chaque élève présent ou absent d\'un toucher et enregistrez avec confirmation. L\'historique se synchronise dans le cloud en temps réel.',
        mockup: 'attendance',
      },
      {
        tag: 'Tableau de bord KPI',
        title: 'La santé de votre noyau, en un coup d\'œil',
        desc: 'Élèves actifs, taux de rétention, présence moyenne et revenus du mois. Des métriques qui comptent, sans tableur ni configuration compliquée.',
        mockup: 'kpi',
      },
      {
        tag: 'Graduations',
        title: 'Votre hiérarchie, à votre façon',
        desc: 'Configurez les cordes de votre groupe avec des catégories enfant, jeune et adulte. Définissez quel niveau fait d\'un élève un éducateur. Compatible avec l\'Angola, le Regional, le Contemporain et les systèmes mixtes.',
        mockup: 'graduation',
      },
      {
        tag: 'Finances',
        title: 'Une trésorerie sans tableur',
        desc: 'Gérez les mensualités, les packs de cours et les paiements en attente. Multi-devises (CLP, USD, EUR et plus). Exportez des rapports de présence et de finances en PDF et CSV d\'un seul toucher.',
        mockup: 'finances',
      },
    ],
    studentsTitle: 'Pour les élèves et les voyageurs',
    studentsIntro: 'Trouvez votre communauté et restez connecté, où que vous soyez.',
    studentsSpotlights: [
      {
        tag: 'Carte mondiale',
        title: 'Trouvez de la capoeira où que vous alliez',
        desc: 'Carte interactive avec des noyaux, groupes et éducateurs du monde entier. Filtrez par ville, pays ou style de capoeira. Indispensable pour les capoeiristas en déplacement.',
        mockup: 'map',
      },
      {
        tag: 'Événements',
        title: 'Votre calendrier de batizados et de rodas',
        desc: 'Découvrez batizados, rodas et ateliers dans votre réseau et partout dans le monde. Confirmez votre présence, marquez votre intérêt et recevez des rappels automatiques de votre éducateur.',
        mockup: 'event',
      },
    ],
    studentsExtrasLabel: 'Et aussi inclus',
    studentsExtras: [
      { t: 'Profil communautaire', d: 'Votre corde, votre groupe, votre réseau de noyaux et votre historique de graduations au même endroit.' },
      { t: 'Notifications', d: 'Les annonces de vos éducateurs et les nouveautés de votre communauté en instantané, sans rien manquer.' },
    ],
    premiumEyebrow: 'Forfaits',
    premiumTitle: 'Commencez gratuitement, grandissez sans limites',
    premiumBody: 'L\'app est entièrement gratuite. Le forfait Pro débloque des événements illimités pour les éducateurs, plus d\'activité pour les élèves et supprime les publicités.',
    premiumFreeLabel: 'Gratuit',
    premiumFreePrice: '0 $',
    premiumFreeCta: 'Télécharger gratuitement',
    premiumFreeItems: [
      'Carte et annuaire mondial des noyaux et groupes',
      'Profil communautaire avec corde et historique',
      'Jusqu\'à 10 événements par mois (éducateur)',
      'Enregistrement d\'1 roda par mois (élève)',
      'Suivi de la présence et des finances',
      'Système de graduation complet',
    ],
    premiumProLabel: 'Pro',
    premiumProPrice: '2 USD',
    premiumProPeriod: 'par mois · forfait annuel aussi disponible',
    premiumProCta: 'Commencer avec Pro',
    premiumProItems: [
      'Tout le forfait gratuit',
      'Événements illimités pour les éducateurs',
      'Enregistrement de jusqu\'à 5 rodas par mois (élève)',
      'Aucune publicité dans toute l\'app',
      'Exportation PDF et CSV des rapports',
      'Support prioritaire',
      'Vous soutenez le développement de la plateforme',
    ],
    appCtaTitle: 'Commencez aujourd\'hui',
    appCtaBody: 'Gratuit sur Google Play. Configurez votre profil en quelques minutes et connectez-vous à votre communauté.',
    appCtaButton: 'Télécharger sur Google Play',
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
    openGraph: { title: formatPageTitle(copy.title), description: getSiteDescription(locale), url: getLocalizedPath(locale, 'app'), type: 'website', locale: getOgLocale(locale), siteName: SITE_NAME },
  }
}

export default async function AppLandingPage({ params }: Props) {
  const { locale } = await params
  const c = getCopy(locale)
  const stats = await getStats().catch(() => null)

  return (
    <main className="min-h-screen bg-bg selection:bg-accent/20 overflow-x-hidden">
      <AppHero copy={c} stats={stats ?? undefined} />
      <AppFeaturesBento copy={c} />
      <AppBenefitsEducators copy={c} />
      <AppBenefitsStudents copy={c} />
      <AppPremium copy={c} />
      <AppTestimonials locale={locale} />
      <AppDownloadCTA copy={c} />
      <Footer locale={locale} />
    </main>
  )
}
