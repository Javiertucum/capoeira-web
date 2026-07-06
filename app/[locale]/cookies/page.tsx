import type { Metadata } from 'next'
import Link from 'next/link'
import ManageConsentButton from '@/components/public/ManageConsentButton'
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
    title: 'Cookies',
    heading: 'Política de cookies',
    updated: 'Última actualización: Julio 2026',
    intro:
      'Este sitio usa un número mínimo de cookies. Las cookies de analítica solo se activan si las aceptas en el banner de consentimiento; puedes cambiar tu decisión en cualquier momento desde esta página.',
    sections: [
      {
        heading: '1. Cookies estrictamente necesarias',
        body:
          'cookie_consent: guarda tu decisión sobre las cookies de analítica (aceptar/rechazar) durante 12 meses. __session: cookie de sesión del panel de administración; solo se crea si inicias sesión como administrador y expira a los 7 días. Estas cookies no requieren consentimiento porque son necesarias para el funcionamiento del sitio.',
      },
      {
        heading: '2. Cookies de analítica (opcionales)',
        body:
          'Si aceptas, Google Analytics 4 crea cookies (_ga, _ga_*) para medir de forma agregada cómo se usa el sitio (páginas visitadas, país, tipo de dispositivo). Duran hasta 13 meses. Si las rechazas, no se crea ninguna cookie de analítica y el sitio funciona exactamente igual.',
      },
      {
        heading: '3. Cómo revocar tu consentimiento',
        body:
          'Usa el botón de abajo para borrar tu decisión y volver a mostrar el banner. También puedes eliminar las cookies desde la configuración de tu navegador.',
      },
    ],
    back: 'Volver al inicio',
  },
  pt: {
    title: 'Cookies',
    heading: 'Política de cookies',
    updated: 'Última atualização: julho de 2026',
    intro:
      'Este site usa um número mínimo de cookies. Os cookies de análise só são ativados se você os aceitar no banner de consentimento; você pode mudar sua decisão a qualquer momento nesta página.',
    sections: [
      {
        heading: '1. Cookies estritamente necessários',
        body:
          'cookie_consent: guarda sua decisão sobre os cookies de análise (aceitar/recusar) por 12 meses. __session: cookie de sessão do painel de administração; só é criado se você entrar como administrador e expira em 7 dias. Esses cookies não exigem consentimento porque são necessários para o funcionamento do site.',
      },
      {
        heading: '2. Cookies de análise (opcionais)',
        body:
          'Se você aceitar, o Google Analytics 4 cria cookies (_ga, _ga_*) para medir de forma agregada como o site é usado (páginas visitadas, país, tipo de dispositivo). Duram até 13 meses. Se você recusar, nenhum cookie de análise é criado e o site funciona exatamente igual.',
      },
      {
        heading: '3. Como revogar seu consentimento',
        body:
          'Use o botão abaixo para apagar sua decisão e mostrar o banner novamente. Você também pode excluir os cookies nas configurações do navegador.',
      },
    ],
    back: 'Voltar ao início',
  },
  en: {
    title: 'Cookies',
    heading: 'Cookie policy',
    updated: 'Last updated: July 2026',
    intro:
      'This site uses a minimal number of cookies. Analytics cookies are only set if you accept them in the consent banner; you can change your decision at any time from this page.',
    sections: [
      {
        heading: '1. Strictly necessary cookies',
        body:
          'cookie_consent: stores your decision about analytics cookies (accept/reject) for 12 months. __session: admin panel session cookie; it is only created if you sign in as an administrator and expires after 7 days. These cookies do not require consent because they are necessary for the site to work.',
      },
      {
        heading: '2. Analytics cookies (optional)',
        body:
          'If you accept, Google Analytics 4 sets cookies (_ga, _ga_*) to measure in aggregate how the site is used (pages visited, country, device type). They last up to 13 months. If you reject them, no analytics cookies are set and the site works exactly the same.',
      },
      {
        heading: '3. How to withdraw your consent',
        body:
          'Use the button below to clear your decision and show the banner again. You can also delete cookies from your browser settings.',
      },
    ],
    back: 'Back to home',
  },
  fr: {
    title: 'Cookies',
    heading: 'Politique de cookies',
    updated: 'Dernière mise à jour : juillet 2026',
    intro:
      "Ce site utilise un nombre minimal de cookies. Les cookies d'analyse ne sont activés que si vous les acceptez dans le bandeau de consentement ; vous pouvez changer votre décision à tout moment depuis cette page.",
    sections: [
      {
        heading: '1. Cookies strictement nécessaires',
        body:
          "cookie_consent : enregistre votre décision concernant les cookies d'analyse (accepter/refuser) pendant 12 mois. __session : cookie de session du panneau d'administration ; il n'est créé que si vous vous connectez en tant qu'administrateur et expire après 7 jours. Ces cookies ne nécessitent pas de consentement car ils sont indispensables au fonctionnement du site.",
      },
      {
        heading: "2. Cookies d'analyse (facultatifs)",
        body:
          "Si vous acceptez, Google Analytics 4 dépose des cookies (_ga, _ga_*) pour mesurer de manière agrégée l'utilisation du site (pages visitées, pays, type d'appareil). Ils durent jusqu'à 13 mois. Si vous refusez, aucun cookie d'analyse n'est déposé et le site fonctionne exactement de la même manière.",
      },
      {
        heading: '3. Comment retirer votre consentement',
        body:
          'Utilisez le bouton ci-dessous pour effacer votre décision et afficher à nouveau le bandeau. Vous pouvez aussi supprimer les cookies dans les paramètres de votre navigateur.',
      },
    ],
    back: "Retour à l'accueil",
  },
  de: {
    title: 'Cookies',
    heading: 'Cookie-Richtlinie',
    updated: 'Letzte Aktualisierung: Juli 2026',
    intro:
      'Diese Website verwendet nur wenige Cookies. Analyse-Cookies werden nur gesetzt, wenn du sie im Einwilligungsbanner akzeptierst; du kannst deine Entscheidung jederzeit auf dieser Seite ändern.',
    sections: [
      {
        heading: '1. Unbedingt erforderliche Cookies',
        body:
          'cookie_consent: speichert deine Entscheidung zu Analyse-Cookies (akzeptieren/ablehnen) für 12 Monate. __session: Sitzungscookie des Admin-Bereichs; es wird nur erstellt, wenn du dich als Administrator anmeldest, und läuft nach 7 Tagen ab. Diese Cookies erfordern keine Einwilligung, da sie für den Betrieb der Website notwendig sind.',
      },
      {
        heading: '2. Analyse-Cookies (optional)',
        body:
          'Wenn du zustimmst, setzt Google Analytics 4 Cookies (_ga, _ga_*), um aggregiert zu messen, wie die Website genutzt wird (besuchte Seiten, Land, Gerätetyp). Sie sind bis zu 13 Monate gültig. Wenn du ablehnst, werden keine Analyse-Cookies gesetzt und die Website funktioniert genauso.',
      },
      {
        heading: '3. Einwilligung widerrufen',
        body:
          'Nutze den Button unten, um deine Entscheidung zu löschen und das Banner erneut anzuzeigen. Du kannst Cookies auch in den Einstellungen deines Browsers löschen.',
      },
    ],
    back: 'Zurück zur Startseite',
  },
  it: {
    title: 'Cookie',
    heading: 'Informativa sui cookie',
    updated: 'Ultimo aggiornamento: luglio 2026',
    intro:
      'Questo sito utilizza un numero minimo di cookie. I cookie di analisi vengono attivati solo se li accetti nel banner di consenso; puoi cambiare la tua decisione in qualsiasi momento da questa pagina.',
    sections: [
      {
        heading: '1. Cookie strettamente necessari',
        body:
          'cookie_consent: memorizza la tua decisione sui cookie di analisi (accetta/rifiuta) per 12 mesi. __session: cookie di sessione del pannello di amministrazione; viene creato solo se accedi come amministratore e scade dopo 7 giorni. Questi cookie non richiedono consenso perché sono necessari al funzionamento del sito.',
      },
      {
        heading: '2. Cookie di analisi (opzionali)',
        body:
          'Se accetti, Google Analytics 4 imposta cookie (_ga, _ga_*) per misurare in forma aggregata come viene usato il sito (pagine visitate, paese, tipo di dispositivo). Durano fino a 13 mesi. Se li rifiuti, nessun cookie di analisi viene impostato e il sito funziona esattamente allo stesso modo.',
      },
      {
        heading: '3. Come revocare il consenso',
        body:
          'Usa il pulsante qui sotto per cancellare la tua decisione e mostrare di nuovo il banner. Puoi anche eliminare i cookie dalle impostazioni del tuo browser.',
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
    alternates: {
      canonical: getLocalizedPath(locale, '/cookies'),
      languages: getLanguageAlternates('/cookies'),
    },
    openGraph: {
      title: formatPageTitle(copy.title),
      description: copy.intro,
      url: getLocalizedPath(locale, '/cookies'),
      type: 'website',
      locale: getOgLocale(locale),
      siteName: SITE_NAME,
    },
  }
}

export default async function CookiesPage({ params }: Props) {
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

        <ManageConsentButton locale={locale} />

        <div className="mt-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center rounded-[14px] border border-border px-6 py-3 text-sm font-semibold tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/35 hover:text-text"
          >
            {copy.back}
          </Link>
        </div>
      </div>
    </section>
  )
}
