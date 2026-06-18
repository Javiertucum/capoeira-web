import type { Metadata } from 'next'
import Link from 'next/link'
import {
  formatPageTitle,
  getLocalizedUrl,
  getOgImageUrl,
  getOgLocale,
  buildBreadcrumbSchema,
  SITE_NAME,
} from '@/lib/site'
import Footer from '@/components/public/Footer'

export const TRAVELERS_SLUG_BY_LOCALE = {
  es: 'capoeira-para-viajeros',
  pt: 'capoeira-para-viajantes',
  en: 'capoeira-for-travelers',
  fr: 'capoeira-pour-voyageurs',
} as const

type Locale = keyof typeof TRAVELERS_SLUG_BY_LOCALE

type FaqItem = { q: string; a: string }
type StepItem = { title: string; text: string }

type TravelersCopy = {
  title: string
  description: string
  h1: string
  subtitle: string
  intro: string[]
  ctaLabel: string
  howToTitle: string
  steps: StepItem[]
  etiquetteTitle: string
  etiquette: string[]
  faqTitle: string
  faq: FaqItem[]
  breadcrumbHome: string
  breadcrumbCurrent: string
}

const COPY: Record<Locale, TravelersCopy> = {
  es: {
    title: 'Capoeira para Viajeros — Entrena en Cualquier País del Mundo',
    description:
      '¿Viajas y quieres seguir entrenando capoeira? Encuentra grupos verificados en cualquier ciudad del mundo. Directorio global de academias, horarios y contacto directo.',
    h1: 'Capoeira para Viajeros',
    subtitle: 'Entrena donde sea. La capoeira no tiene fronteras.',
    intro: [
      'La capoeira es uno de los pocos artes marciales con una comunidad verdaderamente global. En casi cualquier ciudad del mundo existe un grupo que entrena, una roda que suena, un mestre que enseña. Agenda Capoeiragem es el directorio global que conecta a capoeiristas viajeros con grupos locales — sin importar el país, el idioma o el nivel.',
      'Ya sea que vayas a Tokio por negocios, que pases un mes en Berlín o que recorras Sudamérica, puedes buscar en el mapa, ver los horarios y contactar al grupo antes de llegar. La capoeira es una comunidad: siempre hay una puerta abierta.',
    ],
    ctaLabel: 'Buscar grupos en el mapa →',
    howToTitle: '¿Cómo encontrar un grupo en tu destino?',
    steps: [
      { title: 'Busca tu destino en el mapa', text: 'Usa el directorio global de Agenda Capoeiragem. Escribe la ciudad o el país donde vas a viajar y verás todos los grupos registrados con sus ubicaciones.' },
      { title: 'Revisa horarios y niveles', text: 'Cada grupo muestra sus días y horarios de entrenamiento. Algunos grupos tienen clases para todos los niveles, otros son más avanzados. Verifica que el horario sea compatible con tu visita.' },
      { title: 'Contacta al grupo antes de llegar', text: 'La mayoría de los grupos tienen WhatsApp o Instagram. Preséntate, di que eres capoeirista y que estarás en la ciudad. En la capoeira, los visitantes son siempre bienvenidos.' },
      { title: 'Llega con actitud de estudiante', text: 'Aunque seas avanzado, llega con humildad. Cada grupo tiene su propia forma de trabajar, su linaje y sus tradiciones. Observar antes de proponer siempre es bien recibido.' },
    ],
    etiquetteTitle: 'Etiqueta en academias visitantes',
    etiquette: [
      'Preséntate siempre al mestre o responsable del grupo antes de entrenar',
      'Menciona tu linaje y con quién aprendes — esto crea confianza inmediata',
      'Respeta el ritual del grupo: cada academia tiene su forma de abrir la roda',
      'Si no hablas el idioma local, la capoeira habla por ti — el jogo es universal',
      'Una pequeña contribución económica (si el grupo lo sugiere) es siempre apreciada',
    ],
    faqTitle: 'Preguntas frecuentes',
    faq: [
      { q: '¿Necesito experiencia previa para unirme a un grupo visitante?', a: 'No necesariamente. Muchos grupos reciben tanto a principiantes como a capoeiristas con experiencia. Lo más importante es comunicarlo al contactar al grupo para que te orienten sobre la clase más adecuada para tu nivel.' },
      { q: '¿Debo avisar antes de ir a una academia?', a: 'Sí, siempre es recomendable contactar antes. Un mensaje de WhatsApp o Instagram es suficiente. Presentarte con anticipación muestra respeto y permite al grupo prepararse para recibirte bien.' },
      { q: '¿Cuánto cuesta una clase como visitante?', a: 'Varía por grupo. Algunos no cobran nada a los visitantes como muestra de solidaridad capoeirista. Otros solicitan una contribución simbólica. Consulta directamente con el grupo al hacer contacto.' },
      { q: '¿Qué pasa si el grupo habla otro idioma?', a: 'La capoeira tiene su propio lenguaje universal — el movimiento, la música y el jogo se entienden sin palabras. Los comandos básicos en portugués son reconocidos en todo el mundo. Con una sonrisa y actitud abierta, el idioma rara vez es un obstáculo.' },
      { q: '¿Cómo sé si un grupo es serio y de calidad?', a: 'En Agenda Capoeiragem, los grupos son verificados y sus educadores tienen perfil público con su linaje y trayectoria. Puedes ver los horarios reales y el historial del grupo antes de contactar.' },
    ],
    breadcrumbHome: 'Inicio',
    breadcrumbCurrent: 'Capoeira para Viajeros',
  },
  pt: {
    title: 'Capoeira para Viajantes — Treine em Qualquer País do Mundo',
    description:
      'Viajando e quer continuar treinando capoeira? Encontre grupos verificados em qualquer cidade do mundo. Diretório global com horários e contato direto.',
    h1: 'Capoeira para Viajantes',
    subtitle: 'Treine onde estiver. A capoeira não tem fronteiras.',
    intro: [
      'A capoeira é uma das poucas artes marciais com uma comunidade verdadeiramente global. Em quase qualquer cidade do mundo existe um grupo treinando, uma roda tocando, um mestre ensinando. Agenda Capoeiragem é o diretório global que conecta capoeiristas viajantes com grupos locais — sem importar o país, o idioma ou o nível.',
      'Seja em Tóquio a trabalho, um mês em Berlim ou percorrendo a América Latina, você pode buscar no mapa, ver os horários e contatar o grupo antes de chegar. A capoeira é uma comunidade: sempre há uma porta aberta.',
    ],
    ctaLabel: 'Buscar grupos no mapa →',
    howToTitle: 'Como encontrar um grupo no seu destino?',
    steps: [
      { title: 'Busque seu destino no mapa', text: 'Use o diretório global da Agenda Capoeiragem. Digite a cidade ou o país para onde vai viajar e veja todos os grupos registrados com suas localizações.' },
      { title: 'Verifique horários e níveis', text: 'Cada grupo mostra seus dias e horários de treino. Alguns têm aulas para todos os níveis, outros são mais avançados. Confirme que o horário é compatível com sua visita.' },
      { title: 'Entre em contato antes de chegar', text: 'A maioria dos grupos tem WhatsApp ou Instagram. Se apresente, diga que é capoeirista e que estará na cidade. Na capoeira, visitantes são sempre bem-vindos.' },
      { title: 'Chegue com atitude de estudante', text: 'Mesmo sendo avançado, chegue com humildade. Cada grupo tem sua própria forma de trabalhar, seu axé e suas tradições. Observar antes de propor é sempre bem visto.' },
    ],
    etiquetteTitle: 'Etiqueta em academias visitantes',
    etiquette: [
      'Apresente-se sempre ao mestre ou responsável do grupo antes de treinar',
      'Mencione seu apelido, sua graduação e com quem aprende — cria confiança imediata',
      'Respeite o ritual do grupo: cada academia tem sua forma de abrir a roda',
      'Se não fala o idioma local, a capoeira fala por você — o jogo é universal',
      'Uma pequena contribuição financeira (se o grupo sugerir) é sempre apreciada',
    ],
    faqTitle: 'Perguntas frequentes',
    faq: [
      { q: 'Preciso de experiência para participar de um grupo visitante?', a: 'Não necessariamente. Muitos grupos recebem tanto iniciantes quanto capoeiristas experientes. O mais importante é comunicar isso ao entrar em contato para que te orientem sobre a aula mais adequada para o seu nível.' },
      { q: 'Devo avisar antes de ir a uma academia?', a: 'Sim, sempre é recomendável entrar em contato antes. Uma mensagem de WhatsApp ou Instagram é suficiente. Se apresentar com antecedência demonstra respeito e permite que o grupo se prepare para te receber bem.' },
      { q: 'Quanto custa uma aula como visitante?', a: 'Varia por grupo. Alguns não cobram nada dos visitantes como forma de solidariedade capoeirista. Outros pedem uma contribuição simbólica. Consulte diretamente o grupo ao fazer contato.' },
      { q: 'E se o grupo falar outro idioma?', a: 'A capoeira tem sua própria linguagem universal — o movimento, a música e o jogo se entendem sem palavras. Os fundamentos em português são reconhecidos no mundo todo. Com um sorriso e atitude aberta, o idioma raramente é um obstáculo.' },
      { q: 'Como saber se um grupo é sério e de qualidade?', a: 'Na Agenda Capoeiragem, os grupos são verificados e seus educadores têm perfil público com sua linhagem e trajetória. Você pode ver os horários reais e o histórico do grupo antes de entrar em contato.' },
    ],
    breadcrumbHome: 'Início',
    breadcrumbCurrent: 'Capoeira para Viajantes',
  },
  en: {
    title: 'Capoeira for Travelers — Train Anywhere in the World',
    description:
      'Traveling and want to keep training capoeira? Find verified groups in any city worldwide. Global directory with schedules and direct contact.',
    h1: 'Capoeira for Travelers',
    subtitle: 'Train wherever you go. Capoeira has no borders.',
    intro: [
      "Capoeira is one of the few martial arts with a truly global community. In almost any city in the world, there is a group training, a roda playing, a teacher teaching. Agenda Capoeiragem is the global directory that connects traveling capoeiristas with local groups — regardless of country, language, or level.",
      "Whether you're in Tokyo for business, spending a month in Berlin, or backpacking through South America, you can search the map, check schedules, and contact the group before you arrive. Capoeira is a community: there is always an open door.",
    ],
    ctaLabel: 'Find groups on the map →',
    howToTitle: 'How to find a capoeira group in your destination?',
    steps: [
      { title: 'Search your destination on the map', text: "Use the Agenda Capoeiragem global directory. Type the city or country you're traveling to and see all registered groups with their locations." },
      { title: 'Check schedules and levels', text: 'Each group shows their training days and times. Some groups have classes for all levels, others are more advanced. Make sure the schedule works with your visit.' },
      { title: 'Contact the group before you arrive', text: "Most groups have WhatsApp or Instagram. Introduce yourself, mention you train capoeira and that you'll be in the city. In capoeira, visitors are always welcome." },
      { title: "Arrive with a student's mindset", text: "Even if you're advanced, arrive with humility. Each group has its own way of working, its lineage and traditions. Observing before suggesting is always appreciated." },
    ],
    etiquetteTitle: 'Etiquette at visiting academies',
    etiquette: [
      'Always introduce yourself to the mestre or group leader before training',
      'Mention your capoeira name, graduation and who you train with — this builds trust',
      "Respect the group's rituals: each academy has its own way of opening the roda",
      "If you don't speak the local language, capoeira speaks for you — the jogo is universal",
      'A small financial contribution (if the group suggests it) is always appreciated',
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'Do I need experience to join a visiting group?', a: 'Not necessarily. Many groups welcome both beginners and experienced capoeiristas. The most important thing is to communicate your level when reaching out so they can guide you to the most suitable class.' },
      { q: 'Should I notify the group before showing up?', a: "Yes, it's always recommended to reach out first. A WhatsApp or Instagram message is enough. Introducing yourself in advance shows respect and allows the group to prepare to welcome you properly." },
      { q: 'How much does a visitor class cost?', a: 'It varies by group. Some charge nothing for visitors as a gesture of capoeira solidarity. Others ask for a symbolic contribution. Ask the group directly when you make contact.' },
      { q: 'What if the group speaks a different language?', a: 'Capoeira has its own universal language — movement, music and the jogo are understood without words. Basic Portuguese commands are recognized worldwide. With a smile and an open attitude, language is rarely a barrier.' },
      { q: 'How do I know if a group is serious and reputable?', a: "On Agenda Capoeiragem, groups are verified and their educators have public profiles showing their lineage and background. You can see real schedules and the group's history before reaching out." },
    ],
    breadcrumbHome: 'Home',
    breadcrumbCurrent: 'Capoeira for Travelers',
  },
  fr: {
    title: 'Capoeira pour Voyageurs — Entraînez-vous Partout dans le Monde',
    description:
      "En voyage et vous voulez continuer la capoeira ? Trouvez des groupes vérifiés dans n'importe quelle ville du monde. Annuaire global avec horaires et contact direct.",
    h1: 'Capoeira pour Voyageurs',
    subtitle: "Entraînez-vous où que vous soyez. La capoeira n'a pas de frontières.",
    intro: [
      "La capoeira est l'un des rares arts martiaux avec une communauté véritablement mondiale. Dans presque n'importe quelle ville du monde, il existe un groupe qui s'entraîne, une roda qui joue, un maître qui enseigne. Agenda Capoeiragem est l'annuaire mondial qui connecte les capoeiristes voyageurs avec les groupes locaux — peu importe le pays, la langue ou le niveau.",
      "Que vous soyez à Tokyo pour le travail, un mois à Berlin ou en voyage en Amérique du Sud, vous pouvez chercher sur la carte, voir les horaires et contacter le groupe avant d'arriver. La capoeira est une communauté : il y a toujours une porte ouverte.",
    ],
    ctaLabel: 'Trouver des groupes sur la carte →',
    howToTitle: 'Comment trouver un groupe dans votre destination ?',
    steps: [
      { title: 'Cherchez votre destination sur la carte', text: "Utilisez l'annuaire mondial d'Agenda Capoeiragem. Tapez la ville ou le pays où vous voyagez et voyez tous les groupes enregistrés avec leurs emplacements." },
      { title: 'Vérifiez les horaires et les niveaux', text: "Chaque groupe affiche ses jours et horaires d'entraînement. Certains ont des cours pour tous les niveaux, d'autres sont plus avancés. Vérifiez que l'horaire correspond à votre visite." },
      { title: "Contactez le groupe avant d'arriver", text: 'La plupart des groupes ont WhatsApp ou Instagram. Présentez-vous, dites que vous pratiquez la capoeira et que vous serez dans la ville. En capoeira, les visiteurs sont toujours les bienvenus.' },
      { title: "Arrivez avec l'attitude d'un étudiant", text: "Même si vous êtes avancé, arrivez avec humilité. Chaque groupe a sa propre façon de travailler, son lignage et ses traditions. Observer avant de proposer est toujours bien accueilli." },
    ],
    etiquetteTitle: 'Étiquette dans les académies visiteuses',
    etiquette: [
      'Présentez-vous toujours au maître ou au responsable du groupe avant de vous entraîner',
      'Mentionnez votre nom de capoeira, votre grade et votre professeur — cela crée de la confiance',
      "Respectez les rituels du groupe : chaque académie a sa façon d'ouvrir la roda",
      'Si vous ne parlez pas la langue locale, la capoeira parle pour vous — le jogo est universel',
      'Une petite contribution financière (si le groupe le suggère) est toujours appréciée',
    ],
    faqTitle: 'Questions fréquentes',
    faq: [
      { q: "Faut-il avoir de l'expérience pour rejoindre un groupe en visite ?", a: "Pas nécessairement. Beaucoup de groupes accueillent aussi bien les débutants que les capoeiristes expérimentés. L'important est de le communiquer lors du premier contact pour qu'ils vous orientent vers la classe la plus adaptée." },
      { q: 'Faut-il prévenir avant de se présenter à une académie ?', a: 'Oui, il est toujours recommandé de prendre contact à l\'avance. Un message WhatsApp ou Instagram suffit. Se présenter à l\'avance montre du respect et permet au groupe de se préparer à bien vous accueillir.' },
      { q: "Combien coûte un cours en tant que visiteur ?", a: "Cela varie selon les groupes. Certains ne font rien payer aux visiteurs par solidarité capoeiriste. D'autres demandent une contribution symbolique. Renseignez-vous directement auprès du groupe lors de votre prise de contact." },
      { q: 'Et si le groupe parle une autre langue ?', a: 'La capoeira a son propre langage universel — le mouvement, la musique et le jogo se comprennent sans mots. Les commandes de base en portugais sont reconnues dans le monde entier. Avec un sourire et une attitude ouverte, la langue est rarement un obstacle.' },
      { q: 'Comment savoir si un groupe est sérieux et de qualité ?', a: 'Sur Agenda Capoeiragem, les groupes sont vérifiés et leurs éducateurs ont un profil public avec leur lignage et leur parcours. Vous pouvez voir les horaires réels et l\'historique du groupe avant de les contacter.' },
    ],
    breadcrumbHome: 'Accueil',
    breadcrumbCurrent: 'Capoeira pour Voyageurs',
  },
}

export function getTravelersCopy(locale: string): TravelersCopy {
  return COPY[(locale as Locale)] ?? COPY.en
}

export function getTravelersPath(locale: string) {
  const slug = TRAVELERS_SLUG_BY_LOCALE[(locale as Locale)] ?? TRAVELERS_SLUG_BY_LOCALE.en
  return `/${slug}`
}

/** Unlike getLanguageAlternateUrls, each locale here has its own translated slug. */
export function getTravelersLanguageAlternateUrls() {
  return {
    es: getLocalizedUrl('es', getTravelersPath('es')),
    pt: getLocalizedUrl('pt', getTravelersPath('pt')),
    en: getLocalizedUrl('en', getTravelersPath('en')),
    fr: getLocalizedUrl('fr', getTravelersPath('fr')),
    'x-default': getLocalizedUrl('en', getTravelersPath('en')),
  }
}

export function buildTravelersMetadata(locale: Locale): Metadata {
  const c = getTravelersCopy(locale)
  const path = getTravelersPath(locale)
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: getLocalizedUrl(locale, path), languages: getTravelersLanguageAlternateUrls() },
    openGraph: {
      title: formatPageTitle(c.title),
      description: c.description,
      url: getLocalizedUrl(locale, path),
      type: 'website',
      locale: getOgLocale(locale),
      siteName: SITE_NAME,
      images: [{ url: getOgImageUrl({ title: c.h1, type: 'default' }), width: 1200, height: 630, alt: c.h1 }],
    },
  }
}

export function TravelersPage({ locale }: { locale: Locale }) {
  const c = getTravelersCopy(locale)
  const path = getTravelersPath(locale)

  const breadcrumb = buildBreadcrumbSchema([
    { name: SITE_NAME, url: getLocalizedUrl(locale) },
    { name: c.breadcrumbCurrent, url: getLocalizedUrl(locale, path) },
  ])

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: c.howToTitle,
    step: c.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.text,
    })),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <main className="min-h-screen bg-bg py-16 lg:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="page-shell-narrow">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm font-bold text-accent-ink hover:underline">
          ← {c.breadcrumbHome}
        </Link>

        <h1 className="mt-4 font-black text-ink leading-tight tracking-tight" style={{ fontSize: 'clamp(28px, 5vw, 52px)' }}>
          {c.h1}
        </h1>
        <p className="mt-2 text-lg font-bold text-text-secondary">{c.subtitle}</p>

        {c.intro.map((p, i) => (
          <p key={i} className="mt-4 max-w-[70ch] text-base leading-relaxed text-text-secondary">
            {p}
          </p>
        ))}

        <Link href={`/${locale}/#directorio`} className="btn btn-primary btn-lg mt-6 inline-flex">
          {c.ctaLabel}
        </Link>

        <div className="mt-12">
          <h2 className="font-black text-ink" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>
            {c.howToTitle}
          </h2>
          <ol className="mt-6 space-y-5">
            {c.steps.map((step, i) => (
              <li key={i} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-bold text-ink">{i + 1}. {step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12">
          <h2 className="font-black text-ink" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>
            {c.etiquetteTitle}
          </h2>
          <ul className="mt-6 space-y-3">
            {c.etiquette.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                <span className="text-accent-ink">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          <h2 className="font-black text-ink" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>
            {c.faqTitle}
          </h2>
          <div className="mt-6 space-y-5">
            {c.faq.map((item, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-bold text-ink">{item.q}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </main>
  )
}
