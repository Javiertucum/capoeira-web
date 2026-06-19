import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getOgLocale, SITE_NAME } from '@/lib/site'

type Props = Readonly<{
  params: Promise<{ locale: string }>
}>

type LegalSection = { heading: string; body: string }

type LegalCopy = {
  title: string
  heading: string
  updated?: string
  intro: string
  sections?: LegalSection[]
  back: string
}

const COPY = {
  es: {
    title: 'Términos',
    heading: 'Términos de servicio',
    updated: 'Última actualización: Junio 2026',
    intro:
      'Estos términos aplican tanto a la app móvil/web Agenda Capoeiragem como a este sitio (agendacapoeiragem.com). Al usar cualquiera de los dos, aceptas estos términos.',
    sections: [
      {
        heading: '1. Qué es el servicio',
        body:
          'Agenda Capoeiragem es una app y directorio web para la comunidad de capoeira: descubrir eventos, grupos y núcleos, gestionar asistencia y pagos de tu núcleo, y seguir tu graduación.',
      },
      {
        heading: '2. Cuentas y contenido',
        body:
          'Eres responsable de la información que publicas (eventos, perfil, comentarios) y de mantener tu cuenta segura. No publiques contenido falso, ofensivo o que infrinja derechos de terceros. Nos reservamos el derecho de eliminar contenido o suspender cuentas que incumplan estos términos.',
      },
      {
        heading: '3. Eventos y pagos entre usuarios',
        body:
          'Los eventos y pagos de núcleo son creados y gestionados por los propios usuarios (educadores/organizadores). No somos parte de esas transacciones ni garantizamos la exactitud de la información publicada por terceros; verifica siempre los detalles con el organizador.',
      },
      {
        heading: '4. Suscripciones premium',
        body:
          'Las funciones premium se gestionan mediante suscripción a través de las tiendas de aplicaciones (Google Play/App Store) y RevenueCat, sujetas a los términos de pago de esas plataformas.',
      },
      {
        heading: '5. Anuncios',
        body: 'La app y el sitio pueden mostrar anuncios de terceros (Google AdMob/AdSense) para sostener el servicio.',
      },
      {
        heading: '6. Disponibilidad y cambios',
        body:
          'Podemos modificar, suspender o discontinuar funciones del servicio en cualquier momento, e iremos actualizando estos términos cuando corresponda.',
      },
      {
        heading: '7. Contacto',
        body: 'Para consultas sobre estos términos, escríbenos a agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Volver al inicio',
  },
  pt: {
    title: 'Termos',
    heading: 'Termos de serviço',
    updated: 'Última atualização: junho de 2026',
    intro:
      'Estes termos se aplicam tanto ao app Agenda Capoeiragem (móvel/web) quanto a este site (agendacapoeiragem.com). Ao usar qualquer um dos dois, você aceita estes termos.',
    sections: [
      {
        heading: '1. O que é o serviço',
        body:
          'Agenda Capoeiragem é um app e diretório web para a comunidade de capoeira: descobrir eventos, grupos e núcleos, gerenciar presença e pagamentos do seu núcleo, e acompanhar sua graduação.',
      },
      {
        heading: '2. Contas e conteúdo',
        body:
          'Você é responsável pelas informações que publica (eventos, perfil, comentários) e por manter sua conta segura. Não publique conteúdo falso, ofensivo ou que infrinja direitos de terceiros. Reservamo-nos o direito de remover conteúdo ou suspender contas que violem estes termos.',
      },
      {
        heading: '3. Eventos e pagamentos entre usuários',
        body:
          'Eventos e pagamentos de núcleo são criados e gerenciados pelos próprios usuários (educadores/organizadores). Não somos parte dessas transações nem garantimos a exatidão das informações publicadas por terceiros; sempre verifique os detalhes com o organizador.',
      },
      {
        heading: '4. Assinaturas premium',
        body:
          'Os recursos premium são gerenciados por assinatura através das lojas de aplicativos (Google Play/App Store) e RevenueCat, sujeitos aos termos de pagamento dessas plataformas.',
      },
      {
        heading: '5. Anúncios',
        body: 'O app e o site podem exibir anúncios de terceiros (Google AdMob/AdSense) para sustentar o serviço.',
      },
      {
        heading: '6. Disponibilidade e alterações',
        body:
          'Podemos modificar, suspender ou descontinuar recursos do serviço em qualquer momento, e atualizaremos estes termos quando necessário.',
      },
      {
        heading: '7. Contato',
        body: 'Para dúvidas sobre estes termos, escreva para agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Voltar ao início',
  },
  en: {
    title: 'Terms',
    heading: 'Terms of service',
    updated: 'Last updated: June 2026',
    intro:
      'These terms apply to both the Agenda Capoeiragem app (mobile/web) and this site (agendacapoeiragem.com). By using either, you agree to these terms.',
    sections: [
      {
        heading: '1. What the service is',
        body:
          'Agenda Capoeiragem is an app and web directory for the capoeira community: discover events, groups, and núcleos, manage your núcleo\'s attendance and payments, and track your graduation.',
      },
      {
        heading: '2. Accounts and content',
        body:
          'You are responsible for the information you post (events, profile, comments) and for keeping your account secure. Do not post false, offensive content, or content that infringes third-party rights. We reserve the right to remove content or suspend accounts that violate these terms.',
      },
      {
        heading: '3. Events and payments between users',
        body:
          'Events and núcleo payments are created and managed by users themselves (educators/organizers). We are not a party to those transactions and do not guarantee the accuracy of information posted by third parties; always verify details with the organizer.',
      },
      {
        heading: '4. Premium subscriptions',
        body:
          'Premium features are managed via subscription through the app stores (Google Play/App Store) and RevenueCat, subject to those platforms\' payment terms.',
      },
      {
        heading: '5. Advertising',
        body: 'The app and site may display third-party ads (Google AdMob/AdSense) to help sustain the service.',
      },
      {
        heading: '6. Availability and changes',
        body:
          'We may modify, suspend, or discontinue service features at any time, and we will update these terms as needed.',
      },
      {
        heading: '7. Contact',
        body: 'For questions about these terms, email us at agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Back to home',
  },
  fr: {
    title: 'Conditions',
    heading: 'Conditions d\'utilisation',
    updated: 'Dernière mise à jour : juin 2026',
    intro:
      'Ces conditions s\'appliquent à l\'application Agenda Capoeiragem (mobile/web) ainsi qu\'à ce site (agendacapoeiragem.com). En utilisant l\'un ou l\'autre, vous acceptez ces conditions.',
    sections: [
      {
        heading: '1. Description du service',
        body:
          'Agenda Capoeiragem est une application et un annuaire web pour la communauté de capoeira : découvrir des événements, des groupes et des núcleos, gérer la présence et les paiements de votre núcleo, et suivre votre graduation.',
      },
      {
        heading: '2. Comptes et contenu',
        body:
          'Vous êtes responsable des informations que vous publiez (événements, profil, commentaires) et de la sécurité de votre compte. Ne publiez pas de contenu faux, offensant ou portant atteinte aux droits de tiers. Nous nous réservons le droit de supprimer du contenu ou de suspendre des comptes qui enfreignent ces conditions.',
      },
      {
        heading: '3. Événements et paiements entre utilisateurs',
        body:
          'Les événements et les paiements de núcleo sont créés et gérés par les utilisateurs eux-mêmes (éducateurs/organisateurs). Nous ne sommes pas partie à ces transactions et ne garantissons pas l\'exactitude des informations publiées par des tiers ; vérifiez toujours les détails avec l\'organisateur.',
      },
      {
        heading: '4. Abonnements premium',
        body:
          'Les fonctionnalités premium sont gérées par abonnement via les magasins d\'applications (Google Play/App Store) et RevenueCat, soumis aux conditions de paiement de ces plateformes.',
      },
      {
        heading: '5. Publicité',
        body: 'L\'application et le site peuvent afficher des publicités tierces (Google AdMob/AdSense) pour soutenir le service.',
      },
      {
        heading: '6. Disponibilité et modifications',
        body:
          'Nous pouvons modifier, suspendre ou interrompre des fonctionnalités du service à tout moment, et nous mettrons à jour ces conditions en conséquence.',
      },
      {
        heading: '7. Contact',
        body: 'Pour toute question sur ces conditions, écrivez-nous à agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Retour à l\'accueil',
  },
  de: {
    title: 'AGB',
    heading: 'Nutzungsbedingungen',
    updated: 'Letzte Aktualisierung: Juni 2026',
    intro:
      'Diese Bedingungen gelten sowohl für die App Agenda Capoeiragem (mobil/web) als auch für diese Website (agendacapoeiragem.com). Durch die Nutzung einer der beiden stimmst du diesen Bedingungen zu.',
    sections: [
      {
        heading: '1. Was der Dienst ist',
        body:
          'Agenda Capoeiragem ist eine App und ein Webverzeichnis für die Capoeira-Community: Events, Gruppen und Núcleos entdecken, Anwesenheit und Zahlungen deines Núcleos verwalten und deine Graduierung verfolgen.',
      },
      {
        heading: '2. Konten und Inhalte',
        body:
          'Du bist für die Informationen verantwortlich, die du veröffentlichst (Events, Profil, Kommentare), und für die Sicherheit deines Kontos. Veröffentliche keine falschen, beleidigenden Inhalte oder Inhalte, die Rechte Dritter verletzen. Wir behalten uns das Recht vor, Inhalte zu entfernen oder Konten zu sperren, die gegen diese Bedingungen verstoßen.',
      },
      {
        heading: '3. Events und Zahlungen zwischen Nutzern',
        body:
          'Events und Núcleo-Zahlungen werden von den Nutzern selbst erstellt und verwaltet (Lehrer/Organisatoren). Wir sind nicht Vertragspartei dieser Transaktionen und garantieren nicht die Richtigkeit von Informationen, die von Dritten veröffentlicht werden; prüfe Details immer mit dem Organisator.',
      },
      {
        heading: '4. Premium-Abonnements',
        body:
          'Premium-Funktionen werden über ein Abonnement in den App-Stores (Google Play/App Store) und RevenueCat verwaltet, vorbehaltlich der Zahlungsbedingungen dieser Plattformen.',
      },
      {
        heading: '5. Werbung',
        body: 'Die App und die Website können Werbung von Dritten (Google AdMob/AdSense) anzeigen, um den Dienst zu unterstützen.',
      },
      {
        heading: '6. Verfügbarkeit und Änderungen',
        body:
          'Wir können Funktionen des Dienstes jederzeit ändern, aussetzen oder einstellen und werden diese Bedingungen entsprechend aktualisieren.',
      },
      {
        heading: '7. Kontakt',
        body: 'Bei Fragen zu diesen Bedingungen schreibe uns an agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Zurück zur Startseite',
  },
  it: {
    title: 'Termini',
    heading: 'Termini di servizio',
    updated: 'Ultimo aggiornamento: giugno 2026',
    intro:
      'Questi termini si applicano sia all\'app Agenda Capoeiragem (mobile/web) che a questo sito (agendacapoeiragem.com). Utilizzando uno dei due, accetti questi termini.',
    sections: [
      {
        heading: '1. Cos\'è il servizio',
        body:
          'Agenda Capoeiragem è un\'app e una directory web per la comunità di capoeira: scoprire eventi, gruppi e núcleos, gestire presenze e pagamenti del tuo núcleo e seguire la tua graduazione.',
      },
      {
        heading: '2. Account e contenuti',
        body:
          'Sei responsabile delle informazioni che pubblichi (eventi, profilo, commenti) e della sicurezza del tuo account. Non pubblicare contenuti falsi, offensivi o che violino i diritti di terzi. Ci riserviamo il diritto di rimuovere contenuti o sospendere account che violano questi termini.',
      },
      {
        heading: '3. Eventi e pagamenti tra utenti',
        body:
          'Eventi e pagamenti del núcleo sono creati e gestiti dagli stessi utenti (educatori/organizzatori). Non siamo parte di queste transazioni e non garantiamo l\'esattezza delle informazioni pubblicate da terzi; verifica sempre i dettagli con l\'organizzatore.',
      },
      {
        heading: '4. Abbonamenti premium',
        body:
          'Le funzionalità premium sono gestite tramite abbonamento attraverso gli store delle app (Google Play/App Store) e RevenueCat, soggette ai termini di pagamento di tali piattaforme.',
      },
      {
        heading: '5. Pubblicità',
        body: 'L\'app e il sito possono mostrare pubblicità di terzi (Google AdMob/AdSense) per sostenere il servizio.',
      },
      {
        heading: '6. Disponibilità e modifiche',
        body:
          'Possiamo modificare, sospendere o interrompere funzionalità del servizio in qualsiasi momento e aggiorneremo questi termini di conseguenza.',
      },
      {
        heading: '7. Contatto',
        body: 'Per domande su questi termini, scrivici a agendacapoeiragem@gmail.com.',
      },
    ],
    back: 'Torna alla home',
  },
} satisfies Record<string, LegalCopy>

function getCopy(locale: string): LegalCopy {
  return COPY[locale as keyof typeof COPY] ?? COPY.es
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const copy = getCopy(locale)

  return {
    title: copy.title,
    description: copy.intro,
    robots: copy.sections ? undefined : { index: false, follow: true },
    alternates: {
      canonical: getLocalizedPath(locale, '/terms'),
      languages: getLanguageAlternates('/terms'),
    },
    openGraph: {
      title: formatPageTitle(copy.title),
      description: copy.intro,
      url: getLocalizedPath(locale, '/terms'),
      type: 'website',
      locale: getOgLocale(locale),
      siteName: SITE_NAME,
    },
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  const copy = getCopy(locale)

  return (
    <section className="px-5 pb-20 pt-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[760px] rounded-[28px] border border-border bg-card px-6 py-8 shadow-[0_24px_80px_var(--shadow)] sm:px-8 sm:py-10">
        <h1 className="text-[clamp(30px,5vw,44px)] font-semibold tracking-[-0.04em] text-text">
          {copy.heading}
        </h1>
        {copy.updated && <p className="mt-2 text-xs text-text-secondary/70">{copy.updated}</p>}
        <p className="mt-5 text-base leading-8 text-text-secondary">{copy.intro}</p>

        {copy.sections?.map((section) => (
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
