import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getOgLocale, SITE_NAME } from '@/lib/site'

type Props = Readonly<{
  params: Promise<{ locale: string }>
}>

const COPY = {
  es: {
    title: 'Terminos',
    heading: 'Terminos del sitio en preparacion',
    body:
      'Estamos redactando una version publica de estos terminos para el directorio web. Mientras tanto, la experiencia publicada sigue enfocada en explorar perfiles, grupos y nucleos compartidos por la comunidad.',
    back: 'Volver al inicio',
  },
  pt: {
    title: 'Termos',
    heading: 'Termos do site em preparacao',
    body:
      'Estamos redigindo uma versao publica destes termos para o diretorio web. Enquanto isso, a experiencia publicada segue focada em explorar perfis, grupos e nucleos compartilhados pela comunidade.',
    back: 'Voltar ao inicio',
  },
  en: {
    title: 'Terms',
    heading: 'Site terms in preparation',
    body:
      'We are drafting a public version of these terms for the web directory. For now, the published experience remains focused on exploring profiles, groups, and nucleos shared by the community.',
    back: 'Back to home',
  },
  fr: {
    title: 'Conditions',
    heading: 'Conditions du site en préparation',
    body:
      'Nous rédigeons une version publique de ces conditions pour l\'annuaire web. En attendant, l\'expérience publiée reste centrée sur l\'exploration des profils, groupes et noyaux partagés par la communauté.',
    back: 'Retour à l\'accueil',
  },
  de: {
    title: 'AGB',
    heading: 'Nutzungsbedingungen der Website in Vorbereitung',
    body:
      'Wir erarbeiten eine öffentliche Version dieser Nutzungsbedingungen für das Webverzeichnis. Bis dahin konzentriert sich die veröffentlichte Erfahrung weiterhin darauf, Profile, Gruppen und Núcleos der Community zu erkunden.',
    back: 'Zurück zur Startseite',
  },
  it: {
    title: 'Termini',
    heading: 'Termini del sito in preparazione',
    body:
      'Stiamo redigendo una versione pubblica di questi termini per la directory web. Nel frattempo, l\'esperienza pubblicata resta focalizzata sull\'esplorazione di profili, gruppi e núcleos condivisi dalla comunità.',
    back: 'Torna alla home',
  },
} as const

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.es
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const copy = getCopy(locale)

  return {
    title: copy.title,
    description: copy.heading,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: getLocalizedPath(locale, '/terms'),
      languages: getLanguageAlternates('/terms'),
    },
    openGraph: {
      title: formatPageTitle(copy.title),
      description: copy.heading,
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
        <p className="mt-5 text-base leading-8 text-text-secondary">{copy.body}</p>
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
