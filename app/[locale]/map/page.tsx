import type { Metadata } from 'next'
import MapClientShell from './MapClientShell'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getLocalizedUrl, getOgImageUrl } from '@/lib/site'
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
  es: 'Mapa de Capoeira — Núcleos, Grupos y Educadores',
  pt: 'Mapa de Capoeira — Núcleos, Grupos e Educadores',
  en: 'Capoeira Map — Nucleos, Groups & Educators',
} as const

const META_DESCRIPTIONS = {
  es: 'Explora el mapa global de capoeira: encuentra núcleos de entrenamiento, grupos y educadores cerca de ti. Busca por ciudad, país o región.',
  pt: 'Explore o mapa global de capoeira: encontre núcleos de treino, grupos e educadores perto de você. Busque por cidade, país ou região.',
  en: 'Explore the global capoeira map: find training nucleos, groups, and educators near you. Search by city, country, or region.',
} as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const title = META_TITLES[locale as keyof typeof META_TITLES] ?? META_TITLES.es
  const description =
    META_DESCRIPTIONS[locale as keyof typeof META_DESCRIPTIONS] ?? META_DESCRIPTIONS.es

  const ogImage = getOgImageUrl({ title: 'Capoeira Map', sub: description.slice(0, 90) })

  return {
    title,
    description,
    alternates: {
      canonical: getLocalizedUrl(locale, '/map'),
      languages: getLanguageAlternates('/map'),
    },
    openGraph: {
      title,
      description,
      url: getLocalizedUrl(locale, '/map'),
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
