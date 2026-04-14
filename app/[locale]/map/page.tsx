import type { Metadata } from 'next'
import MapClientShell from './MapClientShell'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath } from '@/lib/site'
import type { MapNucleo, PublicUserProfile, Group } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = Readonly<{
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}>

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

const META_TITLES = {
  es: 'Vista de mapa',
  pt: 'Vista do mapa',
  en: 'Map view',
} as const

const META_DESCRIPTIONS = {
  es: 'Explora nucleos, grupos y educadores de capoeira desde el mapa publico.',
  pt: 'Explore nucleos, grupos e educadores de capoeira pelo mapa publico.',
  en: 'Explore capoeira nucleos, groups, and educators from the public map.',
} as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const title = META_TITLES[locale as keyof typeof META_TITLES] ?? META_TITLES.es
  const description =
    META_DESCRIPTIONS[locale as keyof typeof META_DESCRIPTIONS] ?? META_DESCRIPTIONS.es

  return {
    title,
    description,
    alternates: {
      canonical: getLocalizedPath(locale, '/map'),
      languages: getLanguageAlternates('/map'),
    },
    openGraph: {
      title: formatPageTitle(title),
      description,
      url: getLocalizedPath(locale, '/map'),
      type: 'website',
    },
  }
}

export default async function MapPage({ params, searchParams }: Props) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams

  let groups: Group[] = []
  let educators: PublicUserProfile[] = []
  let nucleos: MapNucleo[] = []
  let dataUnavailable = false

  try {
    const { getAllNucleos, getAllEducators, getAllGroups } = await import('@/lib/queries')
    const results = await Promise.allSettled([
      getAllNucleos(),
      getAllEducators(),
      getAllGroups(),
    ])

    nucleos = results[0].status === 'fulfilled' ? results[0].value : []
    educators = results[1].status === 'fulfilled' ? results[1].value : []
    groups = results[2].status === 'fulfilled' ? results[2].value : []

    if (results.every((result) => result.status === 'rejected')) {
      dataUnavailable = true
    }
  } catch (error) {
    dataUnavailable = true
    console.error('Data directory unavailable, rendering empty fallback.', error)
  }

  return (
    <MapClientShell
      locale={locale}
      initialNucleos={nucleos}
      initialEducators={educators}
      initialGroups={groups}
      initialQuery={readParam(resolvedSearchParams.q)}
      initialFilter={readParam(resolvedSearchParams.filter)}
      dataUnavailable={dataUnavailable}
    />
  )
}
