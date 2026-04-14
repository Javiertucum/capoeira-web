export const SITE_NAME = 'Agenda Capoeiragem'
export const DEFAULT_SITE_URL = 'https://www.agendacapoeiragem.com'

const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim()

export const SITE_URL = (rawBaseUrl && rawBaseUrl.length > 0 ? rawBaseUrl : DEFAULT_SITE_URL).replace(/\/$/, '')

export const SITE_DESCRIPTIONS = {
  es: 'Encuentra nucleos, grupos y educadores de capoeira en todo el mundo.',
  pt: 'Encontre nucleos, grupos e educadores de capoeira em todo o mundo.',
  en: 'Find capoeira nucleos, groups, and educators around the world.',
} as const

export const DEFAULT_LOCALE = 'es'

export function getSiteDescription(locale: string) {
  return SITE_DESCRIPTIONS[locale as keyof typeof SITE_DESCRIPTIONS] ?? SITE_DESCRIPTIONS[DEFAULT_LOCALE]
}

export function getLocalizedPath(locale: string, path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const finalPath = normalizedPath === '/' ? '' : normalizedPath
  return `/${locale}${finalPath}`
}

export function getLocalizedUrl(locale: string, path = '') {
  return `${SITE_URL}${getLocalizedPath(locale, path)}`
}

export function getLanguageAlternates(path = '') {
  return {
    es: getLocalizedPath('es', path),
    pt: getLocalizedPath('pt', path),
    en: getLocalizedPath('en', path),
  }
}

export function getLanguageAlternateUrls(path = '') {
  return {
    es: getLocalizedUrl('es', path),
    pt: getLocalizedUrl('pt', path),
    en: getLocalizedUrl('en', path),
  }
}

export function formatPageTitle(title: string) {
  return `${title} | ${SITE_NAME}`
}
