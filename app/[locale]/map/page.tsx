import MapClientShell from './MapClientShell'
import type { MapNucleo } from '@/lib/types'

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

  let nucleos: MapNucleo[] = []
  let dataUnavailable = false

  try {
    const { getAllNucleos } = await import('@/lib/queries')
    nucleos = await getAllNucleos()
  } catch (error) {
    dataUnavailable = true
    console.error('Map directory unavailable, rendering empty fallback.', error)
  }

  return (
    <MapClientShell
      locale={locale}
      initialNucleos={nucleos}
      initialQuery={readParam(resolvedSearchParams.q)}
      initialFilter={readParam(resolvedSearchParams.filter)}
      dataUnavailable={dataUnavailable}
    />
  )
}
