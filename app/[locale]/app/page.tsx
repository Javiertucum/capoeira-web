import type { Metadata } from 'next'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getOgLocale, getSiteDescription, SITE_NAME } from '@/lib/site'
import { getStats } from '@/lib/queries'
import AppHero from '@/components/public/AppHero'
import AppHowItWorks from '@/components/public/AppHowItWorks'
import AppFeaturesBento from '@/components/public/AppFeaturesBento'
import AppBenefitsEducators from '@/components/public/AppBenefitsEducators'
import AppBenefitsStudents from '@/components/public/AppBenefitsStudents'
import AppPremium from '@/components/public/AppPremium'
import AppFAQ from '@/components/public/AppFAQ'
import AppDownloadCTA from '@/components/public/AppDownloadCTA'
import Footer from '@/components/public/Footer'

export const revalidate = 3600

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const COPY = {
  es: {
    title: 'Descarga la App — Agenda Capoeiragem',
    // Hero
    appHeroEyebrow: 'Gratis en Google Play',
    appHeroTitle: 'Lleva tu comunidad de capoeira en el bolsillo',
    appHeroSubtitle: 'La app gratuita que organiza tu grupo de capoeira: pasa lista, gestiona graduaciones y pagos, publica eventos y encuentra dónde entrenar en cualquier ciudad del mundo.',
    appHeroPlayButton: 'Descargar gratis',
    appHeroIosNote: 'iOS próximamente',
    appHeroForEducators: 'Soy educador',
    appHeroForStudents: 'Soy alumno o viajero',
    // Stats labels
    statGroups: 'Grupos',
    statNucleos: 'Núcleos',
    statEducators: 'Educadores',
    statCountries: 'Países',
    // Bento
    featuresBentoLabel: 'Qué incluye la app',
    bentoShorts: {
      attendance: 'Marca presentes y ausentes con un toque.',
      kpi: 'Alumnos activos, retención e ingresos del mes.',
      graduation: 'Cordas configurables para cualquier estilo.',
      finances: 'Mensualidades, pagos y reportes en PDF.',
      map: 'Núcleos y grupos en todo el mundo.',
      event: 'Batizados, rodas y talleres con recordatorios.',
    },
    howTitle: 'Empieza en 3 pasos',
    howSteps: [
      { t: 'Descarga la app', d: 'Gratis en Google Play. Sin tarjeta y sin compromiso.' },
      { t: 'Crea tu perfil', d: 'Elige si eres educador o alumno y únete a tu grupo, o crea el tuyo en minutos.' },
      { t: 'Todo en marcha', d: 'Pasa lista, publica eventos, sigue tus graduaciones o encuentra dónde entrenar.' },
    ],
    // Educators
    educatorsTitle: 'Para educadores y organizadores',
    educatorsIntro: 'Todo lo necesario para gestionar tu núcleo, desde el celular.',
    educatorsCtaLabel: 'Descargar gratis',
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
    // FAQ
    faqTitle: 'Preguntas frecuentes',
    faqItems: [
      {
        q: '¿La app es gratis?',
        a: 'Sí. Descargarla y usar las funciones principales (asistencia, graduaciones, finanzas, mapa y eventos) es completamente gratis. Existe un plan Pro opcional de $2 USD al mes que desbloquea eventos ilimitados y elimina los anuncios.',
      },
      {
        q: '¿Está disponible para iPhone?',
        a: 'Por ahora la app está disponible para Android en Google Play. La versión para iOS está en desarrollo y llegará próximamente.',
      },
      {
        q: '¿Sirve para cualquier estilo de capoeira?',
        a: 'Sí. El sistema de graduaciones es totalmente configurable: define tus propias cordas con categorías infantil, juvenil y adulto. Funciona con Angola, Regional, Contemporánea y sistemas mixtos.',
      },
      {
        q: '¿Cómo me uno a mi grupo?',
        a: 'Crea tu perfil, busca tu grupo o núcleo en el directorio y solicita unirte, o pide a tu educador que te invite. Si tu grupo aún no está en la app, un educador puede crearlo en minutos.',
      },
      {
        q: '¿Necesito ser educador para usarla?',
        a: 'No. Como alumno puedes ver tu corda e historial de graduaciones, confirmar asistencia a eventos y usar el mapa global para encontrar dónde entrenar cuando viajas.',
      },
      {
        q: '¿Qué incluye el plan Pro?',
        a: 'Eventos ilimitados para educadores, registro de hasta 5 rodas por mes para alumnos, exportación de reportes en PDF y CSV, cero anuncios y soporte prioritario. Cuesta $2 USD al mes, con plan anual disponible.',
      },
    ],
    // Final CTA
    appCtaTitle: 'Empieza hoy',
    appCtaBody: 'Disponible gratis en Google Play. Configura tu perfil en minutos y conéctate con tu comunidad.',
    appCtaButton: 'Descargar en Google Play',
  },
  pt: {
    title: 'Baixe o App — Agenda Capoeiragem',
    appHeroEyebrow: 'Grátis na Google Play',
    appHeroTitle: 'Leve sua comunidade de capoeira no bolso',
    appHeroSubtitle: 'O app gratuito que organiza seu grupo de capoeira: faça a chamada, gerencie graduações e pagamentos, publique eventos e encontre onde treinar em qualquer cidade do mundo.',
    appHeroPlayButton: 'Baixar grátis',
    appHeroIosNote: 'iOS em breve',
    appHeroForEducators: 'Sou educador',
    appHeroForStudents: 'Sou aluno ou viajante',
    statGroups: 'Grupos',
    statNucleos: 'Núcleos',
    statEducators: 'Educadores',
    statCountries: 'Países',
    featuresBentoLabel: 'O que inclui o app',
    bentoShorts: {
      attendance: 'Marque presentes e ausentes com um toque.',
      kpi: 'Alunos ativos, retenção e receita do mês.',
      graduation: 'Cordas configuráveis para qualquer estilo.',
      finances: 'Mensalidades, pagamentos e relatórios em PDF.',
      map: 'Núcleos e grupos no mundo todo.',
      event: 'Batizados, rodas e oficinas com lembretes.',
    },
    howTitle: 'Comece em 3 passos',
    howSteps: [
      { t: 'Baixe o app', d: 'Grátis na Google Play. Sem cartão e sem compromisso.' },
      { t: 'Crie seu perfil', d: 'Escolha se você é educador ou aluno e entre no seu grupo, ou crie o seu em minutos.' },
      { t: 'Tudo em andamento', d: 'Faça a chamada, publique eventos, acompanhe suas graduações ou encontre onde treinar.' },
    ],
    educatorsTitle: 'Para educadores e organizadores',
    educatorsIntro: 'Tudo o que você precisa para gerenciar seu núcleo, direto do celular.',
    educatorsCtaLabel: 'Baixar grátis',
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
    faqTitle: 'Perguntas frequentes',
    faqItems: [
      {
        q: 'O app é gratuito?',
        a: 'Sim. Baixar e usar as funções principais (presença, graduações, finanças, mapa e eventos) é completamente grátis. Existe um plano Pro opcional de US$ 2 por mês que desbloqueia eventos ilimitados e remove os anúncios.',
      },
      {
        q: 'Está disponível para iPhone?',
        a: 'Por enquanto o app está disponível para Android na Google Play. A versão para iOS está em desenvolvimento e chegará em breve.',
      },
      {
        q: 'Serve para qualquer estilo de capoeira?',
        a: 'Sim. O sistema de graduações é totalmente configurável: defina suas próprias cordas com categorias infantil, juvenil e adulto. Funciona com Angola, Regional, Contemporânea e sistemas mistos.',
      },
      {
        q: 'Como entro no meu grupo?',
        a: 'Crie seu perfil, busque seu grupo ou núcleo no diretório e solicite entrar, ou peça ao seu educador para convidá-lo. Se seu grupo ainda não está no app, um educador pode criá-lo em minutos.',
      },
      {
        q: 'Preciso ser educador para usar?',
        a: 'Não. Como aluno você pode ver sua corda e histórico de graduações, confirmar presença em eventos e usar o mapa global para encontrar onde treinar quando viaja.',
      },
      {
        q: 'O que inclui o plano Pro?',
        a: 'Eventos ilimitados para educadores, registro de até 5 rodas por mês para alunos, exportação de relatórios em PDF e CSV, zero anúncios e suporte prioritário. Custa US$ 2 por mês, com plano anual disponível.',
      },
    ],
    appCtaTitle: 'Comece hoje',
    appCtaBody: 'Disponível gratuitamente na Google Play. Configure seu perfil em minutos e conecte-se com sua comunidade.',
    appCtaButton: 'Baixar na Google Play',
  },
  en: {
    title: 'Download the App — Agenda Capoeiragem',
    appHeroEyebrow: 'Free on Google Play',
    appHeroTitle: 'Carry your capoeira community in your pocket',
    appHeroSubtitle: 'The free app that organizes your capoeira group: take attendance, manage graduations and payments, publish events, and find a place to train in any city in the world.',
    appHeroPlayButton: 'Download free',
    appHeroIosNote: 'iOS coming soon',
    appHeroForEducators: "I'm an educator",
    appHeroForStudents: "I'm a student or traveler",
    statGroups: 'Groups',
    statNucleos: 'Schools',
    statEducators: 'Educators',
    statCountries: 'Countries',
    featuresBentoLabel: 'What the app includes',
    bentoShorts: {
      attendance: 'Mark present or absent with one tap.',
      kpi: 'Active students, retention and monthly revenue.',
      graduation: 'Configurable belts for any style.',
      finances: 'Fees, payments and PDF reports.',
      map: 'Schools and groups worldwide.',
      event: 'Batizados, rodas and workshops with reminders.',
    },
    howTitle: 'Get started in 3 steps',
    howSteps: [
      { t: 'Download the app', d: 'Free on Google Play. No card, no commitment.' },
      { t: 'Create your profile', d: 'Choose educator or student and join your group — or create your own in minutes.' },
      { t: "You're all set", d: 'Take attendance, publish events, track your graduations or find a place to train.' },
    ],
    educatorsTitle: 'For educators and organizers',
    educatorsIntro: 'Everything you need to run your school, right from your phone.',
    educatorsCtaLabel: 'Download free',
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
    faqTitle: 'Frequently asked questions',
    faqItems: [
      {
        q: 'Is the app free?',
        a: 'Yes. Downloading it and using the core features (attendance, graduations, finances, map and events) is completely free. There is an optional Pro plan at $2 USD per month that unlocks unlimited events and removes ads.',
      },
      {
        q: 'Is it available for iPhone?',
        a: 'For now the app is available for Android on Google Play. The iOS version is in development and coming soon.',
      },
      {
        q: 'Does it work for any capoeira style?',
        a: 'Yes. The graduation system is fully configurable: define your own belts with children, youth and adult categories. It works with Angola, Regional, Contemporary and mixed systems.',
      },
      {
        q: 'How do I join my group?',
        a: 'Create your profile, find your group or school in the directory and request to join, or ask your educator to invite you. If your group is not in the app yet, an educator can create it in minutes.',
      },
      {
        q: 'Do I need to be an educator to use it?',
        a: 'No. As a student you can see your belt and graduation history, confirm attendance to events, and use the global map to find a place to train when you travel.',
      },
      {
        q: 'What does the Pro plan include?',
        a: 'Unlimited events for educators, logging up to 5 rodas per month for students, PDF and CSV report exports, zero ads and priority support. It costs $2 USD per month, with an annual plan available.',
      },
    ],
    appCtaTitle: 'Get started today',
    appCtaBody: 'Free on Google Play. Set up your profile in minutes and connect with your community.',
    appCtaButton: 'Get it on Google Play',
  },
  fr: {
    title: 'Téléchargez l\'app — Agenda Capoeiragem',
    appHeroEyebrow: 'Gratuit sur Google Play',
    appHeroTitle: 'Emportez votre communauté de capoeira dans votre poche',
    appHeroSubtitle: 'L\'app gratuite qui organise votre groupe de capoeira : faites l\'appel, gérez graduations et paiements, publiez des événements et trouvez où vous entraîner dans n\'importe quelle ville du monde.',
    appHeroPlayButton: 'Télécharger gratuitement',
    appHeroIosNote: 'iOS bientôt disponible',
    appHeroForEducators: 'Je suis éducateur',
    appHeroForStudents: 'Je suis élève ou voyageur',
    statGroups: 'Groupes',
    statNucleos: 'Noyaux',
    statEducators: 'Éducateurs',
    statCountries: 'Pays',
    featuresBentoLabel: 'Ce que contient l\'app',
    bentoShorts: {
      attendance: 'Marquez présents et absents d\'un toucher.',
      kpi: 'Élèves actifs, rétention et revenus du mois.',
      graduation: 'Cordes configurables pour tout style.',
      finances: 'Mensualités, paiements et rapports PDF.',
      map: 'Noyaux et groupes dans le monde entier.',
      event: 'Batizados, rodas et ateliers avec rappels.',
    },
    howTitle: 'Commencez en 3 étapes',
    howSteps: [
      { t: 'Téléchargez l\'app', d: 'Gratuit sur Google Play. Sans carte, sans engagement.' },
      { t: 'Créez votre profil', d: 'Choisissez éducateur ou élève et rejoignez votre groupe, ou créez le vôtre en quelques minutes.' },
      { t: 'Tout est prêt', d: 'Faites l\'appel, publiez des événements, suivez vos graduations ou trouvez où vous entraîner.' },
    ],
    educatorsTitle: 'Pour les éducateurs et organisateurs',
    educatorsIntro: 'Tout ce qu\'il faut pour gérer votre noyau, directement depuis votre téléphone.',
    educatorsCtaLabel: 'Télécharger gratuitement',
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
    faqTitle: 'Questions fréquentes',
    faqItems: [
      {
        q: 'L\'app est-elle gratuite ?',
        a: 'Oui. La télécharger et utiliser les fonctions principales (présence, graduations, finances, carte et événements) est entièrement gratuit. Il existe un forfait Pro optionnel à 2 USD par mois qui débloque les événements illimités et supprime les publicités.',
      },
      {
        q: 'Est-elle disponible pour iPhone ?',
        a: 'Pour le moment, l\'app est disponible pour Android sur Google Play. La version iOS est en développement et arrivera bientôt.',
      },
      {
        q: 'Fonctionne-t-elle avec tous les styles de capoeira ?',
        a: 'Oui. Le système de graduation est entièrement configurable : définissez vos propres cordes avec des catégories enfant, jeune et adulte. Compatible avec l\'Angola, le Regional, le Contemporain et les systèmes mixtes.',
      },
      {
        q: 'Comment rejoindre mon groupe ?',
        a: 'Créez votre profil, trouvez votre groupe ou noyau dans l\'annuaire et demandez à le rejoindre, ou demandez à votre éducateur de vous inviter. Si votre groupe n\'est pas encore dans l\'app, un éducateur peut le créer en quelques minutes.',
      },
      {
        q: 'Faut-il être éducateur pour l\'utiliser ?',
        a: 'Non. En tant qu\'élève, vous pouvez voir votre corde et votre historique de graduations, confirmer votre présence aux événements et utiliser la carte mondiale pour trouver où vous entraîner en voyage.',
      },
      {
        q: 'Que comprend le forfait Pro ?',
        a: 'Événements illimités pour les éducateurs, enregistrement de jusqu\'à 5 rodas par mois pour les élèves, exportation de rapports en PDF et CSV, zéro publicité et support prioritaire. Il coûte 2 USD par mois, avec un forfait annuel disponible.',
      },
    ],
    appCtaTitle: 'Commencez aujourd\'hui',
    appCtaBody: 'Gratuit sur Google Play. Configurez votre profil en quelques minutes et connectez-vous à votre communauté.',
    appCtaButton: 'Télécharger sur Google Play',
  },
  de: {
    title: 'App herunterladen — Agenda Capoeiragem',
    appHeroEyebrow: 'Kostenlos bei Google Play',
    appHeroTitle: 'Deine Capoeira-Community in der Hosentasche',
    appHeroSubtitle: 'Die kostenlose App, die deine Capoeira-Gruppe organisiert: Anwesenheit erfassen, Graduierungen und Zahlungen verwalten, Events veröffentlichen und in jeder Stadt der Welt einen Trainingsort finden.',
    appHeroPlayButton: 'Kostenlos herunterladen',
    appHeroIosNote: 'iOS demnächst',
    appHeroForEducators: 'Ich bin Lehrer',
    appHeroForStudents: 'Ich bin Schüler oder auf Reisen',
    statGroups: 'Gruppen',
    statNucleos: 'Núcleos',
    statEducators: 'Lehrer',
    statCountries: 'Länder',
    featuresBentoLabel: 'Was die App bietet',
    bentoShorts: {
      attendance: 'Anwesend oder abwesend mit einem Tap.',
      kpi: 'Aktive Schüler, Bindung und Monatseinnahmen.',
      graduation: 'Konfigurierbare Cordas für jeden Stil.',
      finances: 'Beiträge, Zahlungen und PDF-Berichte.',
      map: 'Núcleos und Gruppen weltweit.',
      event: 'Batizados, Rodas und Workshops mit Erinnerungen.',
    },
    howTitle: 'In 3 Schritten loslegen',
    howSteps: [
      { t: 'App herunterladen', d: 'Kostenlos bei Google Play. Ohne Karte, ohne Verpflichtung.' },
      { t: 'Profil erstellen', d: 'Wähle Lehrer oder Schüler und tritt deiner Gruppe bei — oder gründe deine eigene in Minuten.' },
      { t: 'Alles startklar', d: 'Erfasse Anwesenheit, veröffentliche Events, verfolge Graduierungen oder finde einen Trainingsort.' },
    ],
    educatorsTitle: 'Für Lehrer und Organisatoren',
    educatorsIntro: 'Alles, was du brauchst, um dein Núcleo zu verwalten, direkt vom Handy aus.',
    educatorsCtaLabel: 'Kostenlos herunterladen',
    educatorsSpotlights: [
      {
        tag: 'Anwesenheit',
        title: 'Anwesenheit in Sekunden erfassen',
        desc: 'Wähle den Zeitslot, markiere jeden Schüler mit einem Tap als anwesend oder abwesend und speichere mit Bestätigung. Die Historie wird in Echtzeit in der Cloud synchronisiert.',
        mockup: 'attendance',
      },
      {
        tag: 'KPI-Dashboard',
        title: 'Der Zustand deines Núcleos auf einen Blick',
        desc: 'Aktive Schüler, Bindungsrate, durchschnittliche Anwesenheit und Monatseinnahmen. Wichtige Kennzahlen, ohne Tabellenkalkulation oder komplizierte Konfiguration.',
        mockup: 'kpi',
      },
      {
        tag: 'Graduierungen',
        title: 'Deine Hierarchie, nach deinem Maß',
        desc: 'Konfiguriere die Cordas deiner Gruppe mit Kategorien für Kinder, Jugendliche und Erwachsene. Lege fest, ab welchem Level ein Schüler zum Lehrer wird. Kompatibel mit Angola, Regional, Contemporânea und gemischten Systemen.',
        mockup: 'graduation',
      },
      {
        tag: 'Finanzen',
        title: 'Kasse ohne Tabellenkalkulation',
        desc: 'Verwalte Monatsbeiträge, Kurspakete und offene Zahlungen. Mehrwährungsfähig (CLP, USD, EUR und mehr). Exportiere Anwesenheits- und Finanzberichte als PDF und CSV mit einem Tap.',
        mockup: 'finances',
      },
    ],
    studentsTitle: 'Für Schüler und Reisende',
    studentsIntro: 'Finde deine Community und bleib verbunden, wo immer du bist.',
    studentsSpotlights: [
      {
        tag: 'Globale Karte',
        title: 'Finde Capoeira, wohin du auch gehst',
        desc: 'Interaktive Karte mit Núcleos, Gruppen und Lehrern aus aller Welt. Filtere nach Stadt, Land oder Capoeira-Stil. Unverzichtbar für Capoeiristas auf Reisen.',
        mockup: 'map',
      },
      {
        tag: 'Events',
        title: 'Dein Kalender für Batizados und Rodas',
        desc: 'Entdecke Batizados, Rodas und Workshops in deinem Netzwerk und weltweit. Bestätige deine Teilnahme, markiere Interesse und erhalte automatische Erinnerungen von deinem Lehrer.',
        mockup: 'event',
      },
    ],
    studentsExtrasLabel: 'Und außerdem enthalten',
    studentsExtras: [
      { t: 'Community-Profil', d: 'Deine Corda, deine Gruppe, dein Netzwerk von Núcleos und deine Graduierungshistorie an einem Ort.' },
      { t: 'Benachrichtigungen', d: 'Mitteilungen deiner Lehrer und Neuigkeiten aus deiner Community sofort, ohne etwas zu verpassen.' },
    ],
    premiumEyebrow: 'Pläne',
    premiumTitle: 'Kostenlos starten, grenzenlos wachsen',
    premiumBody: 'Die App ist komplett kostenlos. Der Pro-Plan schaltet unbegrenzte Events für Lehrer frei, mehr Aktivität für Schüler und entfernt Werbung.',
    premiumFreeLabel: 'Kostenlos',
    premiumFreePrice: '0 €',
    premiumFreeCta: 'Kostenlos herunterladen',
    premiumFreeItems: [
      'Karte und globales Verzeichnis von Núcleos und Gruppen',
      'Community-Profil mit Corda und Historie',
      'Bis zu 10 Events pro Monat (Lehrer)',
      'Registrierung von 1 Roda pro Monat (Schüler)',
      'Anwesenheits- und Finanzverwaltung',
      'Vollständiges Graduierungssystem',
    ],
    premiumProLabel: 'Pro',
    premiumProPrice: '2 USD',
    premiumProPeriod: 'pro Monat · auch als Jahresplan verfügbar',
    premiumProCta: 'Mit Pro starten',
    premiumProItems: [
      'Alles aus dem kostenlosen Plan',
      'Unbegrenzte Events für Lehrer',
      'Registrierung von bis zu 5 Rodas pro Monat (Schüler)',
      'Keine Werbung in der gesamten App',
      'PDF- und CSV-Export von Berichten',
      'Bevorzugter Support',
      'Du unterstützt die Entwicklung der Plattform',
    ],
    faqTitle: 'Häufige Fragen',
    faqItems: [
      {
        q: 'Ist die App kostenlos?',
        a: 'Ja. Der Download und die Kernfunktionen (Anwesenheit, Graduierungen, Finanzen, Karte und Events) sind komplett kostenlos. Optional gibt es einen Pro-Plan für 2 USD pro Monat, der unbegrenzte Events freischaltet und Werbung entfernt.',
      },
      {
        q: 'Gibt es die App für das iPhone?',
        a: 'Derzeit ist die App für Android bei Google Play verfügbar. Die iOS-Version ist in Entwicklung und kommt bald.',
      },
      {
        q: 'Funktioniert sie mit jedem Capoeira-Stil?',
        a: 'Ja. Das Graduierungssystem ist voll konfigurierbar: Definiere deine eigenen Cordas mit Kategorien für Kinder, Jugendliche und Erwachsene. Kompatibel mit Angola, Regional, Contemporânea und gemischten Systemen.',
      },
      {
        q: 'Wie trete ich meiner Gruppe bei?',
        a: 'Erstelle dein Profil, finde deine Gruppe oder dein Núcleo im Verzeichnis und stelle eine Beitrittsanfrage — oder lass dich von deinem Lehrer einladen. Ist deine Gruppe noch nicht in der App, kann ein Lehrer sie in Minuten anlegen.',
      },
      {
        q: 'Muss ich Lehrer sein, um sie zu nutzen?',
        a: 'Nein. Als Schüler siehst du deine Corda und Graduierungshistorie, bestätigst deine Teilnahme an Events und findest über die Weltkarte einen Trainingsort, wenn du reist.',
      },
      {
        q: 'Was beinhaltet der Pro-Plan?',
        a: 'Unbegrenzte Events für Lehrer, Registrierung von bis zu 5 Rodas pro Monat für Schüler, PDF- und CSV-Berichtsexport, keine Werbung und bevorzugter Support. Er kostet 2 USD pro Monat, ein Jahresplan ist verfügbar.',
      },
    ],
    appCtaTitle: 'Starte noch heute',
    appCtaBody: 'Kostenlos bei Google Play verfügbar. Richte dein Profil in wenigen Minuten ein und verbinde dich mit deiner Community.',
    appCtaButton: 'Bei Google Play herunterladen',
  },
  it: {
    title: 'Scarica l\'App — Agenda Capoeiragem',
    appHeroEyebrow: 'Gratis su Google Play',
    appHeroTitle: 'Porta la tua comunità di capoeira in tasca',
    appHeroSubtitle: 'L\'app gratuita che organizza il tuo gruppo di capoeira: fai l\'appello, gestisci graduazioni e pagamenti, pubblica eventi e trova dove allenarti in qualsiasi città del mondo.',
    appHeroPlayButton: 'Scarica gratis',
    appHeroIosNote: 'iOS prossimamente',
    appHeroForEducators: 'Sono un educatore',
    appHeroForStudents: 'Sono un alunno o viaggiatore',
    statGroups: 'Gruppi',
    statNucleos: 'Núcleos',
    statEducators: 'Educatori',
    statCountries: 'Paesi',
    featuresBentoLabel: 'Cosa include l\'app',
    bentoShorts: {
      attendance: 'Segna presenti e assenti con un tocco.',
      kpi: 'Alunni attivi, ritenzione ed entrate del mese.',
      graduation: 'Corde configurabili per ogni stile.',
      finances: 'Quote, pagamenti e report in PDF.',
      map: 'Núcleos e gruppi in tutto il mondo.',
      event: 'Batizados, rodas e workshop con promemoria.',
    },
    howTitle: 'Inizia in 3 passi',
    howSteps: [
      { t: 'Scarica l\'app', d: 'Gratis su Google Play. Senza carta, senza impegno.' },
      { t: 'Crea il tuo profilo', d: 'Scegli educatore o alunno ed entra nel tuo gruppo, o creane uno in pochi minuti.' },
      { t: 'Tutto pronto', d: 'Fai l\'appello, pubblica eventi, segui le tue graduazioni o trova dove allenarti.' },
    ],
    educatorsTitle: 'Per educatori e organizzatori',
    educatorsIntro: 'Tutto il necessario per gestire il tuo núcleo, dal cellulare.',
    educatorsCtaLabel: 'Scarica gratis',
    educatorsSpotlights: [
      {
        tag: 'Presenze',
        title: 'Fai l\'appello in pochi secondi',
        desc: 'Seleziona l\'orario, segna ogni alunno come presente o assente con un tocco e salva con conferma. La cronologia si sincronizza nel cloud in tempo reale.',
        mockup: 'attendance',
      },
      {
        tag: 'Dashboard KPI',
        title: 'La salute del tuo núcleo, a colpo d\'occhio',
        desc: 'Alunni attivi, tasso di ritenzione, presenza media ed entrate del mese. Metriche che contano, senza foglio di calcolo né configurazioni complicate.',
        mockup: 'kpi',
      },
      {
        tag: 'Graduazioni',
        title: 'La tua gerarchia, su misura',
        desc: 'Configura le corde del tuo gruppo con categorie bambini, giovani e adulti. Definisci quale livello rende un alunno un educatore. Compatibile con Angola, Regional, Contemporânea e sistemi misti.',
        mockup: 'graduation',
      },
      {
        tag: 'Finanze',
        title: 'Tesoreria senza foglio di calcolo',
        desc: 'Gestisci quote mensili, pacchetti di lezioni e pagamenti in sospeso. Multi-valuta (CLP, USD, EUR e altre). Esporta report di presenze e finanze in PDF e CSV con un tocco.',
        mockup: 'finances',
      },
    ],
    studentsTitle: 'Per alunni e viaggiatori',
    studentsIntro: 'Trova la tua comunità e resta connesso, ovunque tu sia.',
    studentsSpotlights: [
      {
        tag: 'Mappa globale',
        title: 'Trova capoeira ovunque tu vada',
        desc: 'Mappa interattiva con núcleos, gruppi ed educatori di tutto il mondo. Filtra per città, paese o stile di capoeira. Indispensabile per i capoeiristi in movimento.',
        mockup: 'map',
      },
      {
        tag: 'Eventi',
        title: 'Il tuo calendario di batizados e rodas',
        desc: 'Scopri batizados, rodas e workshop nella tua rete e in tutto il mondo. Confermi la presenza, segna il tuo interesse e ricevi promemoria automatici dal tuo educatore.',
        mockup: 'event',
      },
    ],
    studentsExtrasLabel: 'E include anche',
    studentsExtras: [
      { t: 'Profilo comunitario', d: 'La tua corda, il tuo gruppo, la tua rete di núcleos e la tua cronologia delle graduazioni in un unico posto.' },
      { t: 'Notifiche', d: 'Avvisi dai tuoi educatori e novità della tua comunità all\'istante, senza perdere nulla.' },
    ],
    premiumEyebrow: 'Piani',
    premiumTitle: 'Inizia gratis, cresci senza limiti',
    premiumBody: 'L\'app è completamente gratuita. Il piano Pro sblocca eventi illimitati per gli educatori, più attività per gli alunni ed elimina la pubblicità.',
    premiumFreeLabel: 'Gratuito',
    premiumFreePrice: '0 €',
    premiumFreeCta: 'Scarica gratis',
    premiumFreeItems: [
      'Mappa e directory globale di núcleos e gruppi',
      'Profilo comunitario con corda e cronologia',
      'Fino a 10 eventi al mese (educatore)',
      'Registrazione di 1 roda al mese (alunno)',
      'Controllo presenze e finanze',
      'Sistema di graduazione completo',
    ],
    premiumProLabel: 'Pro',
    premiumProPrice: '2 USD',
    premiumProPeriod: 'al mese · disponibile anche piano annuale',
    premiumProCta: 'Inizia con Pro',
    premiumProItems: [
      'Tutto il piano gratuito',
      'Eventi illimitati per gli educatori',
      'Registrazione fino a 5 rodas al mese (alunno)',
      'Nessuna pubblicità in tutta l\'app',
      'Esportazione PDF e CSV dei report',
      'Supporto prioritario',
      'Sostieni lo sviluppo della piattaforma',
    ],
    faqTitle: 'Domande frequenti',
    faqItems: [
      {
        q: 'L\'app è gratuita?',
        a: 'Sì. Scaricarla e usare le funzioni principali (presenze, graduazioni, finanze, mappa ed eventi) è completamente gratis. Esiste un piano Pro opzionale da 2 USD al mese che sblocca eventi illimitati ed elimina la pubblicità.',
      },
      {
        q: 'È disponibile per iPhone?',
        a: 'Per ora l\'app è disponibile per Android su Google Play. La versione iOS è in sviluppo e arriverà presto.',
      },
      {
        q: 'Funziona con qualsiasi stile di capoeira?',
        a: 'Sì. Il sistema di graduazione è totalmente configurabile: definisci le tue corde con categorie bambini, giovani e adulti. Compatibile con Angola, Regional, Contemporânea e sistemi misti.',
      },
      {
        q: 'Come entro nel mio gruppo?',
        a: 'Crea il tuo profilo, trova il tuo gruppo o núcleo nella directory e richiedi di entrare, oppure chiedi al tuo educatore di invitarti. Se il tuo gruppo non è ancora nell\'app, un educatore può crearlo in pochi minuti.',
      },
      {
        q: 'Devo essere un educatore per usarla?',
        a: 'No. Come alunno puoi vedere la tua corda e la cronologia delle graduazioni, confermare la presenza agli eventi e usare la mappa globale per trovare dove allenarti quando viaggi.',
      },
      {
        q: 'Cosa include il piano Pro?',
        a: 'Eventi illimitati per gli educatori, registrazione fino a 5 rodas al mese per gli alunni, esportazione di report in PDF e CSV, zero pubblicità e supporto prioritario. Costa 2 USD al mese, con piano annuale disponibile.',
      },
    ],
    appCtaTitle: 'Inizia oggi',
    appCtaBody: 'Disponibile gratis su Google Play. Configura il tuo profilo in pochi minuti e connettiti con la tua comunità.',
    appCtaButton: 'Scarica su Google Play',
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
      <AppHowItWorks copy={c} />
      <AppFeaturesBento copy={c} />
      <AppBenefitsEducators copy={c} />
      <AppBenefitsStudents copy={c} />
      <AppPremium copy={c} />
      <AppFAQ copy={c} />
      <AppDownloadCTA copy={c} />
      <Footer locale={locale} />
    </main>
  )
}
