export const SITE_NAME = 'Agenda Capoeiragem'
export const DEFAULT_SITE_URL = 'https://www.agendacapoeiragem.com'

const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim()

export const SITE_URL = (rawBaseUrl && rawBaseUrl.length > 0 ? rawBaseUrl : DEFAULT_SITE_URL).replace(/\/$/, '')

export const SITE_DESCRIPTIONS = {
  es: 'Directorio global de capoeira: encuentra grupos, núcleos y educadores en todo el mundo. Descubre dónde entrenar, conoce a los maestros y conecta con la comunidad.',
  pt: 'Diretório global de capoeira: encontre grupos, núcleos e educadores em todo o mundo. Descubra onde treinar, conheça os mestres e conecte-se com a comunidade.',
  en: 'Global capoeira directory: find capoeira groups, training locations (nucleos), and educators worldwide. Discover where to train, meet the masters, and connect with the community.',
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

/** Build a full OG image URL for a given title/subtitle/type */
export function getOgImageUrl(params: {
  title?: string
  sub?: string
  type?: 'default' | 'educator' | 'group' | 'nucleo'
}) {
  const url = new URL(`${SITE_URL}/og`)
  if (params.title) url.searchParams.set('title', params.title)
  if (params.sub) url.searchParams.set('sub', params.sub)
  if (params.type) url.searchParams.set('type', params.type)
  return url.toString()
}

// ─── JSON-LD structured data builders ────────────────────────────────────────

export function buildOrganizationSchema(locale = 'es') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description: getSiteDescription(locale),
    sameAs: [
      'https://play.google.com/store/apps/details?id=com.agendacapoeiragem',
    ],
  }
}

export function buildWebSiteSchema(locale = 'es') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getLocalizedUrl(locale),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getLocalizedUrl(locale, '/map')}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildPersonSchema(params: {
  name: string
  url: string
  image?: string | null
  description?: string | null
  jobTitle?: string
  sameAs?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: params.name,
    url: params.url,
    ...(params.image ? { image: params.image } : {}),
    ...(params.description ? { description: params.description } : {}),
    jobTitle: params.jobTitle ?? 'Capoeira Educator',
    knowsAbout: 'Capoeira',
    ...(params.sameAs && params.sameAs.length > 0 ? { sameAs: params.sameAs } : {}),
  }
}

export function buildSportsOrganizationSchema(params: {
  name: string
  url: string
  logo?: string | null
  description?: string
  memberCount?: number
  country?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    sport: 'Capoeira',
    name: params.name,
    url: params.url,
    ...(params.logo ? { logo: params.logo } : {}),
    ...(params.description ? { description: params.description } : {}),
    ...(params.memberCount ? { numberOfEmployees: { '@type': 'QuantitativeValue', value: params.memberCount } } : {}),
    ...(params.country ? { address: { '@type': 'PostalAddress', addressCountry: params.country } } : {}),
  }
}

export function buildLocalBusinessSchema(params: {
  name: string
  url: string
  description?: string
  address?: string | null
  city?: string | null
  country?: string | null
  latitude?: number
  longitude?: number
  schedules?: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
  educatorName?: string
}) {
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const SCHEMA_DAYS = [
    'https://schema.org/Sunday',
    'https://schema.org/Monday',
    'https://schema.org/Tuesday',
    'https://schema.org/Wednesday',
    'https://schema.org/Thursday',
    'https://schema.org/Friday',
    'https://schema.org/Saturday',
  ]

  const openingHoursSpec = params.schedules?.map((s) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: SCHEMA_DAYS[s.dayOfWeek] ?? DAY_NAMES[s.dayOfWeek],
    opens: s.startTime,
    closes: s.endTime,
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: params.name,
    url: params.url,
    description: params.description ?? `Núcleo de capoeira — ${params.name}`,
    ...(params.address || params.city || params.country
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(params.address ? { streetAddress: params.address } : {}),
            ...(params.city ? { addressLocality: params.city } : {}),
            ...(params.country ? { addressCountry: params.country } : {}),
          },
        }
      : {}),
    ...(params.latitude && params.longitude
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: params.latitude,
            longitude: params.longitude,
          },
        }
      : {}),
    ...(openingHoursSpec && openingHoursSpec.length > 0
      ? { openingHoursSpecification: openingHoursSpec }
      : {}),
    ...(params.educatorName
      ? { employee: { '@type': 'Person', name: params.educatorName } }
      : {}),
    sport: 'Capoeira',
  }
}
