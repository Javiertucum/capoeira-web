import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { TravelersPage, buildTravelersMetadata, getTravelersPath } from '@/lib/travelers-content'

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const CANONICAL_LOCALE = 'it' as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (locale !== CANONICAL_LOCALE) return {}
  return buildTravelersMetadata(CANONICAL_LOCALE)
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  if (locale !== CANONICAL_LOCALE) {
    permanentRedirect(`/${locale}${getTravelersPath(locale)}`)
  }
  return <TravelersPage locale={CANONICAL_LOCALE} />
}
