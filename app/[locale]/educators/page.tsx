import type { Metadata } from 'next'
import { getLanguageAlternates, getLocalizedUrl, getOgImageUrl } from '@/lib/site'
import type { PublicUserProfile } from '@/lib/types'
import EducatorsListShell from './EducatorsListShell'

export const revalidate = 300

type Props = Readonly<{
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}>

const META_TITLES = {
  es: 'Educadores de Capoeira — Directorio Global',
  pt: 'Educadores de Capoeira — Diretório Global',
  en: 'Capoeira Educators — Global Directory',
} as const

const META_DESCRIPTIONS = {
  es: 'Conoce educadores de capoeira de todo el mundo. Encuentra maestros y profesores con su contacto, biografía y espacios de entrenamiento.',
  pt: 'Conheça educadores de capoeira de todo o mundo. Encontre mestres e professores com contato, biografia e espaços de treino.',
  en: 'Discover capoeira educators worldwide. Find masters and teachers with their contact info, bio, and training locations.',
} as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const title = META_TITLES[locale as keyof typeof META_TITLES] ?? META_TITLES.es
  const description =
    META_DESCRIPTIONS[locale as keyof typeof META_DESCRIPTIONS] ?? META_DESCRIPTIONS.es
  const ogImage = getOgImageUrl({ title: 'Capoeira Educators', sub: description.slice(0, 90) })

  return {
    title,
    description,
    alternates: {
      canonical: getLocalizedUrl(locale, '/educators'),
      languages: getLanguageAlternates('/educators'),
    },
    openGraph: {
      title,
      description,
      url: getLocalizedUrl(locale, '/educators'),
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function EducatorsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const resolved = await searchParams
  const initialQuery = Array.isArray(resolved.q) ? (resolved.q[0] ?? '') : (resolved.q ?? '')

  let educators: PublicUserProfile[] = []
  let dataUnavailable = false
  let stats = { countries: 0, groups: 0 }

  try {
    const { getAllEducators, getStats } = await import('@/lib/queries')
    const [edRes, statsRes] = await Promise.all([
      getAllEducators(),
      getStats().catch(() => ({ countries: 0, groups: 0 }))
    ])
    educators = edRes
    stats = { countries: statsRes.countries, groups: statsRes.groups }
  } catch (error) {
    dataUnavailable = true
    if (process.env.NODE_ENV === 'development') {
      console.error('Educators data unavailable.', error)
    }
  }

  return (
    <EducatorsListShell
      locale={locale}
      initialEducators={educators}
      initialQuery={initialQuery}
      dataUnavailable={dataUnavailable}
      stats={stats}
    />
  )
}
