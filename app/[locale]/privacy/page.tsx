import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath } from '@/lib/site'

type Props = Readonly<{
  params: Promise<{ locale: string }>
}>

const COPY = {
  es: {
    title: 'Privacidad',
    heading: 'Politica de privacidad en preparacion',
    body:
      'Estamos preparando una version publica y completa de esta pagina. Por ahora, el directorio web muestra informacion compartida por la comunidad y esta seccion sera actualizada antes del lanzamiento definitivo.',
    back: 'Volver al inicio',
  },
  pt: {
    title: 'Privacidade',
    heading: 'Politica de privacidade em preparacao',
    body:
      'Estamos preparando uma versao publica e completa desta pagina. Por enquanto, o diretorio web mostra informacoes compartilhadas pela comunidade e esta secao sera atualizada antes do lancamento definitivo.',
    back: 'Voltar ao inicio',
  },
  en: {
    title: 'Privacy',
    heading: 'Privacy page in preparation',
    body:
      'We are preparing a complete public version of this page. For now, the web directory shows information shared by the community, and this section will be updated before the final launch.',
    back: 'Back to home',
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
      canonical: getLocalizedPath(locale, '/privacy'),
      languages: getLanguageAlternates('/privacy'),
    },
    openGraph: {
      title: formatPageTitle(copy.title),
      description: copy.heading,
      url: getLocalizedPath(locale, '/privacy'),
      type: 'website',
    },
  }
}

export default async function PrivacyPage({ params }: Props) {
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
