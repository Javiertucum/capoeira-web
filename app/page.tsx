import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

function parseAcceptLanguage(header: string): string[] {
  return header
    .split(',')
    .map((part) => {
      const [langPart, qPart] = part.trim().split(';')
      const quality = qPart?.split('=')[1]
      return {
        locale: langPart.toLowerCase(),
        weight: quality ? Number(quality) : 1,
      }
    })
    .filter(({ locale }) => locale.length > 0)
    .sort((a, b) => b.weight - a.weight)
    .map(({ locale }) => locale)
}

function getPreferredLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return routing.defaultLocale

  const requestedLocales = parseAcceptLanguage(acceptLanguage)
  for (const requested of requestedLocales) {
    const baseLocale = requested.split('-')[0]
    if (routing.locales.includes(baseLocale as (typeof routing.locales)[number])) {
      return baseLocale
    }
  }

  return routing.defaultLocale
}

export default async function Home() {
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language')
  const locale = getPreferredLocale(acceptLanguage)
  redirect(`/${locale}`)
}
