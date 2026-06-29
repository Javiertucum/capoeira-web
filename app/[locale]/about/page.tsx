import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getOgLocale, SITE_NAME } from '@/lib/site'

type Props = Readonly<{
  params: Promise<{ locale: string }>
}>

type AboutSection = { heading: string; body: string }

type AboutCopy = {
  title: string
  heading: string
  intro: string
  sections: AboutSection[]
  back: string
}

const COPY = {
  es: {
    title: 'Sobre nosotros',
    heading: 'Sobre Agenda Capoeiragem',
    intro:
      'Agenda Capoeiragem nació desde adentro de la roda: la construimos capoeiristas que vivieron de cerca lo difícil que es administrar un núcleo con planillas sueltas, grupos de WhatsApp y cuadernos de asistencia.',
    sections: [
      {
        heading: 'Por qué existe',
        body:
          'Cualquier educador que dirige un núcleo conoce el problema: la asistencia se anota en papel, los pagos se persiguen por mensaje privado, y las graduaciones quedan en la memoria de quien las otorgó. Mientras tanto, un alumno que viaja no tiene forma simple de encontrar dónde entrenar en una ciudad nueva. Construimos Agenda Capoeiragem para resolver ambos lados del mismo problema.',
      },
      {
        heading: 'Qué hacemos',
        body:
          'Del lado de los educadores: una app para registrar asistencia, cobrar mensualidades o packs de clases, llevar el historial de graduaciones y organizar eventos — todo por núcleo, no genérico. Del lado de los alumnos y viajeros: un directorio público para descubrir grupos, rodas y batizados, sin depender de que alguien les pase un contacto.',
      },
      {
        heading: 'Quiénes estamos detrás',
        body:
          'Somos un equipo pequeño, no una corporación de software. Seguimos entrenando, seguimos en la roda, y construimos esta herramienta a partir de lo que nos faltó a nosotros como educadores y alumnos. El producto está en expansión activa: cada semana se suman núcleos y educadores reales a la plataforma.',
      },
      {
        heading: 'Nuestros valores',
        body:
          'Capoeira es tradición viva, no decoración. Construimos con respeto por esa raíz: la app sirve a la comunidad, no al revés. Priorizamos que la herramienta sea honesta y útil para quien efectivamente dirige un núcleo, por encima de cualquier métrica de crecimiento.',
      },
      {
        heading: 'Contacto',
        body: '¿Preguntas, sugerencias o querés que tu núcleo aparezca en el directorio? Escribinos a agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Volver al inicio',
  },
  pt: {
    title: 'Sobre nós',
    heading: 'Sobre a Agenda Capoeiragem',
    intro:
      'A Agenda Capoeiragem nasceu de dentro da roda: construímos por capoeiristas que viveram de perto a dificuldade de administrar um núcleo com planilhas soltas, grupos de WhatsApp e cadernos de presença.',
    sections: [
      {
        heading: 'Por que existe',
        body:
          'Qualquer educador que dirige um núcleo conhece o problema: a presença é anotada no papel, os pagamentos são cobrados por mensagem privada, e as graduações ficam apenas na memória de quem as concedeu. Enquanto isso, um aluno que viaja não tem forma simples de encontrar onde treinar numa cidade nova. Construímos a Agenda Capoeiragem para resolver os dois lados do mesmo problema.',
      },
      {
        heading: 'O que fazemos',
        body:
          'Do lado dos educadores: um app para registrar presença, cobrar mensalidades ou pacotes de aulas, manter o histórico de graduações e organizar eventos — tudo por núcleo, não genérico. Do lado dos alunos e viajantes: um diretório público para descobrir grupos, rodas e batizados, sem depender de alguém passar um contato.',
      },
      {
        heading: 'Quem está por trás',
        body:
          'Somos uma equipe pequena, não uma corporação de software. Continuamos treinando, continuamos na roda, e construímos esta ferramenta a partir do que nos faltou como educadores e alunos. O produto está em expansão ativa: toda semana novos núcleos e educadores reais se juntam à plataforma.',
      },
      {
        heading: 'Nossos valores',
        body:
          'Capoeira é tradição viva, não decoração. Construímos com respeito por essa raiz: o app serve à comunidade, não o contrário. Priorizamos que a ferramenta seja honesta e útil para quem de fato dirige um núcleo, acima de qualquer métrica de crescimento.',
      },
      {
        heading: 'Contato',
        body: 'Perguntas, sugestões ou quer que seu núcleo apareça no diretório? Escreva para agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Voltar ao início',
  },
  en: {
    title: 'About us',
    heading: 'About Agenda Capoeiragem',
    intro:
      'Agenda Capoeiragem was born inside the roda itself: built by capoeiristas who lived first-hand how hard it is to run a núcleo with loose spreadsheets, WhatsApp groups, and paper attendance sheets.',
    sections: [
      {
        heading: 'Why it exists',
        body:
          'Any educator running a núcleo knows the problem: attendance gets scribbled on paper, payments get chased over private messages, and graduation history lives only in the memory of whoever granted it. Meanwhile, a traveling student has no simple way to find where to train in a new city. We built Agenda Capoeiragem to solve both sides of the same problem.',
      },
      {
        heading: 'What we do',
        body:
          'For educators: an app to log attendance, charge monthly fees or class packs, keep graduation history, and organize events — all scoped per núcleo, not generic. For students and travelers: a public directory to discover groups, rodas, and batizados, without depending on someone passing along a contact.',
      },
      {
        heading: 'Who is behind it',
        body:
          'We are a small team, not a software corporation. We still train, we are still in the roda, and we built this tool out of what we ourselves were missing as educators and students. The product is actively growing: real núcleos and educators join the platform every week.',
      },
      {
        heading: 'Our values',
        body:
          'Capoeira is living tradition, not decoration. We build with respect for that root: the app serves the community, not the other way around. We prioritize the tool being honest and useful for whoever actually runs a núcleo, above any growth metric.',
      },
      {
        heading: 'Contact',
        body: 'Questions, suggestions, or want your núcleo listed in the directory? Email us at agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Back to home',
  },
  fr: {
    title: 'À propos',
    heading: 'À propos d\'Agenda Capoeiragem',
    intro:
      'Agenda Capoeiragem est née à l\'intérieur même de la roda : construite par des capoeiristes qui ont vécu de près la difficulté de gérer un núcleo avec des feuilles de calcul éparses, des groupes WhatsApp et des cahiers de présence.',
    sections: [
      {
        heading: 'Pourquoi elle existe',
        body:
          'Tout éducateur qui dirige un núcleo connaît le problème : la présence est notée sur papier, les paiements sont réclamés par message privé, et l\'historique des graduations ne vit que dans la mémoire de celui qui les a accordées. Pendant ce temps, un élève en voyage n\'a aucun moyen simple de trouver où s\'entraîner dans une nouvelle ville. Nous avons construit Agenda Capoeiragem pour résoudre les deux faces du même problème.',
      },
      {
        heading: 'Ce que nous faisons',
        body:
          'Côté éducateurs : une app pour enregistrer la présence, encaisser les cotisations ou forfaits de cours, conserver l\'historique des graduations et organiser des événements — tout par núcleo, pas générique. Côté élèves et voyageurs : un annuaire public pour découvrir des groupes, rodas et batizados, sans dépendre du bouche-à-oreille.',
      },
      {
        heading: 'Qui est derrière',
        body:
          'Nous sommes une petite équipe, pas une entreprise de logiciels. Nous continuons à nous entraîner, nous sommes toujours dans la roda, et nous avons construit cet outil à partir de ce qui nous manquait en tant qu\'éducateurs et élèves. Le produit est en croissance active : chaque semaine, de vrais núcleos et éducateurs rejoignent la plateforme.',
      },
      {
        heading: 'Nos valeurs',
        body:
          'La capoeira est une tradition vivante, pas une décoration. Nous construisons dans le respect de cette racine : l\'app sert la communauté, pas l\'inverse. Nous donnons la priorité à un outil honnête et utile pour qui dirige réellement un núcleo, avant toute métrique de croissance.',
      },
      {
        heading: 'Contact',
        body: 'Des questions, des suggestions, ou vous voulez que votre núcleo apparaisse dans l\'annuaire ? Écrivez-nous à agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Retour à l\'accueil',
  },
  de: {
    title: 'Über uns',
    heading: 'Über Agenda Capoeiragem',
    intro:
      'Agenda Capoeiragem entstand mitten in der Roda: gebaut von Capoeiristas, die selbst erlebt haben, wie schwer es ist, ein Núcleo mit losen Tabellen, WhatsApp-Gruppen und Anwesenheitsheften zu verwalten.',
    sections: [
      {
        heading: 'Warum es existiert',
        body:
          'Jeder Lehrer, der ein Núcleo leitet, kennt das Problem: Anwesenheit wird auf Papier notiert, Zahlungen werden per Privatnachricht eingefordert, und die Graduierungsgeschichte lebt nur im Gedächtnis desjenigen, der sie verliehen hat. Ein reisender Schüler hat unterdessen keine einfache Möglichkeit, in einer neuen Stadt einen Trainingsort zu finden. Wir haben Agenda Capoeiragem gebaut, um beide Seiten desselben Problems zu lösen.',
      },
      {
        heading: 'Was wir tun',
        body:
          'Für Lehrer: eine App, um Anwesenheit zu erfassen, Monatsbeiträge oder Kurspakete abzurechnen, die Graduierungsgeschichte zu führen und Events zu organisieren — alles pro Núcleo, nicht generisch. Für Schüler und Reisende: ein öffentliches Verzeichnis, um Gruppen, Rodas und Batizados zu entdecken, ohne auf einen Kontakt von jemandem angewiesen zu sein.',
      },
      {
        heading: 'Wer dahintersteht',
        body:
          'Wir sind ein kleines Team, kein Software-Konzern. Wir trainieren weiterhin, wir sind weiterhin in der Roda, und wir haben dieses Werkzeug aus dem gebaut, was uns selbst als Lehrer und Schüler gefehlt hat. Das Produkt wächst aktiv: jede Woche kommen echte Núcleos und Lehrer zur Plattform hinzu.',
      },
      {
        heading: 'Unsere Werte',
        body:
          'Capoeira ist lebende Tradition, keine Dekoration. Wir bauen mit Respekt für diese Wurzel: Die App dient der Community, nicht umgekehrt. Wir priorisieren, dass das Werkzeug ehrlich und nützlich für diejenigen ist, die tatsächlich ein Núcleo leiten — über jede Wachstumskennzahl hinaus.',
      },
      {
        heading: 'Kontakt',
        body: 'Fragen, Anregungen, oder soll dein Núcleo im Verzeichnis erscheinen? Schreib uns an agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Zurück zur Startseite',
  },
  it: {
    title: 'Chi siamo',
    heading: 'Chi è Agenda Capoeiragem',
    intro:
      'Agenda Capoeiragem è nata dentro la roda stessa: costruita da capoeiristi che hanno vissuto in prima persona quanto sia difficile gestire un núcleo con foglietti sparsi, gruppi WhatsApp e quaderni di presenza.',
    sections: [
      {
        heading: 'Perché esiste',
        body:
          'Qualsiasi educatore che dirige un núcleo conosce il problema: la presenza viene annotata su carta, i pagamenti vengono rincorsi con messaggi privati, e la storia delle graduazioni vive solo nella memoria di chi le ha concesse. Nel frattempo, uno studente in viaggio non ha un modo semplice per trovare dove allenarsi in una nuova città. Abbiamo costruito Agenda Capoeiragem per risolvere entrambi i lati dello stesso problema.',
      },
      {
        heading: 'Cosa facciamo',
        body:
          'Per gli educatori: un\'app per registrare le presenze, riscuotere quote mensili o pacchetti di lezioni, mantenere lo storico delle graduazioni e organizzare eventi — tutto per núcleo, non generico. Per studenti e viaggiatori: una directory pubblica per scoprire gruppi, rodas e batizados, senza dipendere dal passaparola.',
      },
      {
        heading: 'Chi c\'è dietro',
        body:
          'Siamo un piccolo team, non una corporazione software. Continuiamo ad allenarci, siamo ancora nella roda, e abbiamo costruito questo strumento a partire da ciò che mancava a noi come educatori e studenti. Il prodotto è in crescita attiva: ogni settimana nuovi núcleos ed educatori reali si uniscono alla piattaforma.',
      },
      {
        heading: 'I nostri valori',
        body:
          'La capoeira è tradizione viva, non decorazione. Costruiamo con rispetto per quella radice: l\'app serve la comunità, non il contrario. Diamo priorità a uno strumento onesto e utile per chi dirige davvero un núcleo, prima di qualsiasi metrica di crescita.',
      },
      {
        heading: 'Contatto',
        body: 'Domande, suggerimenti, o vuoi che il tuo núcleo appaia nella directory? Scrivici a agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Torna alla home',
  },
} satisfies Record<string, AboutCopy>

function getCopy(locale: string): AboutCopy {
  return COPY[locale as keyof typeof COPY] ?? COPY.es
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const copy = getCopy(locale)

  return {
    title: copy.title,
    description: copy.intro,
    alternates: {
      canonical: getLocalizedPath(locale, '/about'),
      languages: getLanguageAlternates('/about'),
    },
    openGraph: {
      title: formatPageTitle(copy.title),
      description: copy.intro,
      url: getLocalizedPath(locale, '/about'),
      type: 'website',
      locale: getOgLocale(locale),
      siteName: SITE_NAME,
    },
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const copy = getCopy(locale)

  return (
    <section className="px-5 pb-20 pt-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[760px] rounded-[28px] border border-border bg-card px-6 py-8 shadow-[0_24px_80px_var(--shadow)] sm:px-8 sm:py-10">
        <h1 className="text-[clamp(30px,5vw,44px)] font-semibold tracking-[-0.04em] text-text">
          {copy.heading}
        </h1>
        <p className="mt-5 text-base leading-8 text-text-secondary">{copy.intro}</p>

        {copy.sections.map((section) => (
          <div key={section.heading} className="mt-7">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-text">{section.heading}</h2>
            <p className="mt-2 text-base leading-8 text-text-secondary">{section.body}</p>
          </div>
        ))}

        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex items-center justify-center rounded-[14px] border border-border px-6 py-3 text-sm font-semibold tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/35 hover:text-text"
        >
          {copy.back}
        </Link>
      </div>
    </section>
  )
}
