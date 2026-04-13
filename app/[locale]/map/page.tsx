import MapClientShell from './MapClientShell'
import type { MapNucleo, PublicUserProfile, Group } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = Readonly<{
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}>

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
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
      getAllGroups()
    ])
    
    nucleos = results[0].status === 'fulfilled' ? results[0].value : []
    educators = results[1].status === 'fulfilled' ? results[1].value : []
    groups = results[2].status === 'fulfilled' ? results[2].value : []
    
    if (results.every(r => r.status === 'rejected')) {
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
