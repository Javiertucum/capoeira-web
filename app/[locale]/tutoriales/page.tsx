import type { Metadata } from 'next'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getSiteDescription } from '@/lib/site'
import TutorialsHero from '@/components/public/TutorialsHero'
import TutorialsNav from '@/components/public/TutorialsNav'
import TutorialSectionBlock from '@/components/public/TutorialSectionBlock'
import Footer from '@/components/public/Footer'

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const COPY = {
  es: {
    title: 'Tutoriales — Agenda Capoeiragem',
    eyebrow: 'Guía paso a paso',
    heroTitle: 'Aprende a usar la app, desde el primer día',
    heroSubtitle: 'Todo lo que necesitas saber para sacarle el máximo provecho a Agenda Capoeiragem, sea que recién estés empezando o que gestiones tu propio núcleo.',
    sections: [
      {
        id: 'primeros-pasos',
        title: 'Primeros pasos',
        intro: 'Lo esencial para comenzar a usar la app en minutos.',
        mockups: ['home'],
        steps: [
          { t: 'Instala la app o la PWA', d: 'Descárgala desde Google Play o ábrela directamente desde el navegador como app web — funciona igual en ambos casos.' },
          { t: 'Crea tu cuenta y completa tu perfil', d: 'Regístrate con tu correo, elige tu idioma y agrega tu nombre, apodo y datos de contacto.' },
          { t: 'Encuentra y únete a tu núcleo o grupo', d: 'Busca tu núcleo en el mapa global o pídele a tu educador el código de tu grupo para vincular tu cuenta.' },
        ],
      },
      {
        id: 'alumnos-y-viajeros',
        title: 'Para alumnos y viajeros',
        intro: 'Encuentra tu comunidad, en casa o de viaje.',
        mockups: ['map', 'event'],
        steps: [
          { t: 'Explora el mapa global', d: 'Descubre núcleos, grupos y educadores por ciudad o país, con horarios y datos de contacto de cada lugar.' },
          { t: 'Revisa tu perfil y tu historial', d: 'Consulta tu corda actual, tu grupo y la red de núcleos donde has entrenado.' },
          { t: 'Confirma tu interés en eventos', d: 'Descubre rodas, talleres y batizados cercanos, y marca tu asistencia o interés desde el calendario.' },
          { t: 'Recibe notificaciones', d: 'Mantente al día con avisos de tu educador y novedades de tu comunidad en tiempo real.' },
        ],
      },
      {
        id: 'para-educadores',
        title: 'Para educadores',
        intro: 'Las herramientas para gestionar tu núcleo desde el celular.',
        mockups: ['attendance', 'finances'],
        steps: [
          { t: 'Pasa lista por horario', d: 'Selecciona la sesión del día y marca la asistencia de cada alumno con un toque; el registro queda sincronizado en la nube.' },
          { t: 'Configura tu sistema de graduación', d: 'Define la jerarquía de cordas de tu grupo y a partir de qué nivel un alumno se considera educador.' },
          { t: 'Administra la tesorería', d: 'Registra mensualidades y pagos por clase en distintas monedas, y revisa quién está al día y quién tiene pagos pendientes.' },
          { t: 'Crea y gestiona eventos', d: 'Organiza batizados y rodas, fija su ubicación en el mapa, sube el póster y asigna co-organizadores.' },
        ],
      },
      {
        id: 'funciones-avanzadas',
        title: 'Funciones avanzadas',
        intro: 'Saca el máximo provecho una vez que ya conoces lo básico.',
        mockups: ['kpi'],
        steps: [
          { t: 'Revisa tu dashboard de KPIs', d: 'Visualiza alumnos activos, retención mensual y la salud financiera de tu núcleo en un solo lugar.' },
          { t: 'Exporta reportes', d: 'Genera reportes de asistencia y finanzas en PDF y CSV para compartir o respaldar tu información.' },
          { t: 'Registra tu núcleo en el mapa global', d: 'Haz que tu núcleo sea visible para cualquier persona que busque dónde entrenar en tu ciudad.' },
        ],
      },
    ],
  },
  pt: {
    title: 'Tutoriais — Agenda Capoeiragem',
    eyebrow: 'Guia passo a passo',
    heroTitle: 'Aprenda a usar o app, desde o primeiro dia',
    heroSubtitle: 'Tudo o que você precisa saber para aproveitar ao máximo o Agenda Capoeiragem, seja você um aluno iniciante ou esteja gerenciando seu próprio núcleo.',
    sections: [
      {
        id: 'primeiros-passos',
        title: 'Primeiros passos',
        intro: 'O essencial para começar a usar o app em minutos.',
        mockups: ['home'],
        steps: [
          { t: 'Instale o app ou o PWA', d: 'Baixe na Google Play ou abra diretamente pelo navegador como app web — funciona igual nos dois casos.' },
          { t: 'Crie sua conta e complete seu perfil', d: 'Cadastre-se com seu e-mail, escolha seu idioma e adicione seu nome, apelido e dados de contato.' },
          { t: 'Encontre e entre no seu núcleo ou grupo', d: 'Busque seu núcleo no mapa global ou peça ao seu educador o código do seu grupo para vincular sua conta.' },
        ],
      },
      {
        id: 'alunos-e-viajantes',
        title: 'Para alunos e viajantes',
        intro: 'Encontre sua comunidade, em casa ou viajando.',
        mockups: ['map', 'event'],
        steps: [
          { t: 'Explore o mapa global', d: 'Descubra núcleos, grupos e educadores por cidade ou país, com horários e dados de contato de cada local.' },
          { t: 'Veja seu perfil e seu histórico', d: 'Consulte sua corda atual, seu grupo e a rede de núcleos onde já treinou.' },
          { t: 'Confirme seu interesse em eventos', d: 'Descubra rodas, oficinas e batizados próximos, e marque sua presença ou interesse no calendário.' },
          { t: 'Receba notificações', d: 'Fique por dentro dos avisos do seu educador e das novidades da sua comunidade em tempo real.' },
        ],
      },
      {
        id: 'para-educadores',
        title: 'Para educadores',
        intro: 'As ferramentas para gerenciar seu núcleo direto do celular.',
        mockups: ['attendance', 'finances'],
        steps: [
          { t: 'Faça a chamada por horário', d: 'Selecione a sessão do dia e marque a presença de cada aluno com um toque; o registro fica sincronizado na nuvem.' },
          { t: 'Configure seu sistema de graduação', d: 'Defina a hierarquia de cordas do seu grupo e a partir de qual nível um aluno é considerado educador.' },
          { t: 'Administre a tesouraria', d: 'Registre mensalidades e pagamentos por aula em diferentes moedas, e veja quem está em dia e quem tem pagamentos pendentes.' },
          { t: 'Crie e gerencie eventos', d: 'Organize batizados e rodas, marque a localização no mapa, envie o pôster e atribua co-organizadores.' },
        ],
      },
      {
        id: 'funcoes-avancadas',
        title: 'Funções avançadas',
        intro: 'Aproveite ainda mais depois de dominar o básico.',
        mockups: ['kpi'],
        steps: [
          { t: 'Veja seu painel de KPIs', d: 'Visualize alunos ativos, retenção mensal e a saúde financeira do seu núcleo em um só lugar.' },
          { t: 'Exporte relatórios', d: 'Gere relatórios de presença e finanças em PDF e CSV para compartilhar ou guardar.' },
          { t: 'Cadastre seu núcleo no mapa global', d: 'Torne seu núcleo visível para qualquer pessoa que procure onde treinar na sua cidade.' },
        ],
      },
    ],
  },
  en: {
    title: 'Tutorials — Agenda Capoeiragem',
    eyebrow: 'Step-by-step guide',
    heroTitle: 'Learn to use the app, from day one',
    heroSubtitle: "Everything you need to get the most out of Agenda Capoeiragem, whether you're just getting started or running your own school.",
    sections: [
      {
        id: 'getting-started',
        title: 'Getting started',
        intro: 'The essentials to get up and running in minutes.',
        mockups: ['home'],
        steps: [
          { t: 'Install the app or the PWA', d: 'Download it from Google Play or open it directly from your browser as a web app — both work the same way.' },
          { t: 'Create your account and complete your profile', d: 'Sign up with your email, choose your language, and add your name, nickname, and contact details.' },
          { t: 'Find and join your school or group', d: "Search for your school on the global map, or ask your educator for your group's code to link your account." },
        ],
      },
      {
        id: 'students-and-travelers',
        title: 'For students and travelers',
        intro: 'Find your community, at home or while traveling.',
        mockups: ['map', 'event'],
        steps: [
          { t: 'Explore the global map', d: 'Discover schools, groups, and educators by city or country, with schedules and contact details for each location.' },
          { t: 'Check your profile and history', d: "View your current belt, your group, and the network of schools where you've trained." },
          { t: 'Confirm your interest in events', d: 'Discover nearby rodas, workshops, and batizados, and mark your attendance or interest from the calendar.' },
          { t: 'Get notifications', d: 'Stay up to date with messages from your educator and news from your community in real time.' },
        ],
      },
      {
        id: 'for-educators',
        title: 'For educators',
        intro: 'The tools to run your school from your phone.',
        mockups: ['attendance', 'finances'],
        steps: [
          { t: 'Take attendance by session', d: "Select the day's session and mark each student's attendance with a tap; the record syncs to the cloud." },
          { t: 'Set up your graduation system', d: "Define your group's belt hierarchy and the level at which a student becomes an educator." },
          { t: 'Manage your treasury', d: "Log monthly fees and per-class payments in different currencies, and see who's up to date and who has pending payments." },
          { t: 'Create and manage events', d: 'Organize batizados and rodas, pin their location on the map, upload the poster, and assign co-organizers.' },
        ],
      },
      {
        id: 'advanced-features',
        title: 'Advanced features',
        intro: 'Get even more out of the app once you know the basics.',
        mockups: ['kpi'],
        steps: [
          { t: 'Check your KPI dashboard', d: "View active students, monthly retention, and your school's financial health in one place." },
          { t: 'Export reports', d: 'Generate attendance and financial reports in PDF and CSV to share or back up your data.' },
          { t: 'Register your school on the global map', d: 'Make your school visible to anyone looking for a place to train in your city.' },
        ],
      },
    ],
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
    alternates: { canonical: getLocalizedPath(locale, 'tutoriales'), languages: getLanguageAlternates('tutoriales') },
    openGraph: { title: formatPageTitle(copy.title), description: getSiteDescription(locale), url: getLocalizedPath(locale, 'tutoriales'), type: 'website' },
  }
}

export default async function TutorialsPage({ params }: Props) {
  const { locale } = await params
  const c = getCopy(locale)

  return (
    <main className="min-h-screen bg-bg selection:bg-accent/20 overflow-x-hidden">
      <TutorialsHero copy={c} />

      <div className="page-shell pb-24 lg:pb-32">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          <TutorialsNav sections={c.sections.map((s) => ({ id: s.id, title: s.title }))} />

          <div className="divide-y divide-border">
            {c.sections.map((section, i) => (
              <TutorialSectionBlock
                key={section.id}
                id={section.id}
                index={i + 1}
                title={section.title}
                intro={section.intro}
                steps={section.steps}
                mockups={section.mockups as any}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </main>
  )
}
