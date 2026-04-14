import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getSiteDescription } from '@/lib/site'

type Props = Readonly<{
  params: Promise<{ locale: string }>
}>

const COPY = {
  es: {
    title: 'App',
    eyebrow: 'Agenda Capoeiragem',
    heading: 'La app se está preparando sobre una web pública mucho más útil.',
    body:
      'Antes de publicar enlaces finales de descarga, estamos cerrando una experiencia web que ya ayude a descubrir comunidades, educadores y espacios de treino con claridad.',
    primary: 'Explorar el directorio',
    secondary: 'Volver al inicio',
    statusTitle: 'Estado actual',
    statusBody: 'La prioridad es que la web ya sirva como puerta de entrada confiable.',
    phoneTitle: 'Companion móvil',
    bullets: [
      'Búsqueda pública más clara',
      'Perfiles con más contexto',
      'Mapa y lista pensados para móvil',
    ],
  },
  pt: {
    title: 'App',
    eyebrow: 'Agenda Capoeiragem',
    heading: 'O app está sendo preparado sobre uma web pública muito mais útil.',
    body:
      'Antes de publicar os links finais de download, estamos fechando uma experiência web que já ajude a descobrir comunidades, educadores e espaços de treino com clareza.',
    primary: 'Explorar o diretório',
    secondary: 'Voltar ao início',
    statusTitle: 'Estado atual',
    statusBody: 'A prioridade é que a web já sirva como porta de entrada confiável.',
    phoneTitle: 'Companion móvel',
    bullets: [
      'Busca pública mais clara',
      'Perfis com mais contexto',
      'Mapa e lista pensados para móvel',
    ],
  },
  en: {
    title: 'App',
    eyebrow: 'Agenda Capoeiragem',
    heading: 'The app is being prepared on top of a much more useful public web experience.',
    body:
      'Before final store links are published, we are shaping a web experience that already helps people discover communities, educators, and training spots clearly.',
    primary: 'Explore the directory',
    secondary: 'Back to home',
    statusTitle: 'Current status',
    statusBody: 'The priority is for the web to already work as a trustworthy front door.',
    phoneTitle: 'Mobile companion',
    bullets: [
      'Clearer public search',
      'Profiles with more context',
      'Map and list designed for mobile',
    ],
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
    description: getSiteDescription(locale),
    alternates: {
      canonical: getLocalizedPath(locale, '/app'),
      languages: getLanguageAlternates('/app'),
    },
    openGraph: {
      title: formatPageTitle(copy.title),
      description: getSiteDescription(locale),
      url: getLocalizedPath(locale, '/app'),
      type: 'website',
    },
  }
}

export default async function AppPage({ params }: Props) {
  const { locale } = await params
  const copy = getCopy(locale)

  return (
    <section className="px-5 pb-20 pt-10 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1180px] gap-6 rounded-[34px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-6 shadow-[0_30px_90px_var(--shadow)] lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 text-[clamp(34px,6vw,62px)] font-semibold leading-[0.96] tracking-[-0.06em] text-text">
            {copy.heading}
          </h1>
          <p className="mt-5 max-w-[58ch] text-base leading-8 text-text-secondary">{copy.body}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            {copy.bullets.map((bullet) => (
              <span
                key={bullet}
                className="rounded-full border border-border bg-surface px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary"
              >
                {bullet}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/map`}
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#081019] transition-transform hover:-translate-y-0.5"
            >
              {copy.primary}
            </Link>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-accent/25 hover:text-text"
            >
              {copy.secondary}
            </Link>
          </div>
        </div>

        <div className="rounded-[30px] border border-border bg-[linear-gradient(180deg,rgba(23,34,49,0.98),rgba(12,20,30,0.98))] p-5">
          <div className="mx-auto max-w-[240px] rounded-[30px] border border-accent/16 bg-[linear-gradient(180deg,rgba(8,16,25,1),rgba(15,22,31,1))] p-4 shadow-[0_22px_60px_var(--shadow-soft)]">
            <div className="mx-auto h-1.5 w-16 rounded-full bg-border" />
            <div className="mt-5 rounded-[22px] border border-border bg-card/90 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                {copy.statusTitle}
              </p>
              <p className="mt-3 text-lg font-semibold text-text">{copy.phoneTitle}</p>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{copy.statusBody}</p>
              <div className="mt-5 space-y-3">
                {copy.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="rounded-[16px] border border-border bg-surface px-3 py-3 text-sm text-text-secondary"
                  >
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
