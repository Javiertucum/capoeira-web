import { MetadataRoute } from 'next'
import { getLanguageAlternateUrls, getLocalizedUrl } from '@/lib/site'
import { getAllGroups, getAllEducators, getAllNucleos, getAllLocationSlugs } from '@/lib/queries'

const LOCALES = ['es', 'pt', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/privacy', '/terms', '/tutoriales'].flatMap((path) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, path),
      lastModified: new Date(),
      changeFrequency: path === '' ? ('daily' as const) : path === '/tutoriales' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1.0 : path === '/tutoriales' ? 0.8 : 0.5,
      alternates: { languages: getLanguageAlternateUrls(path) },
    }))
  )

  const [groups, educators, nucleos, locationSlugs] = await Promise.all([
    getAllGroups().catch(() => []),
    getAllEducators().catch(() => []),
    getAllNucleos().catch(() => []),
    getAllLocationSlugs().catch(() => []),
  ])

  const groupRoutes = groups.flatMap((group) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, `/grupos/${group.id}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: { languages: getLanguageAlternateUrls(`/grupos/${group.id}`) },
    }))
  )

  const educatorRoutes = educators.flatMap((educator) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, `/educadores/${educator.uid}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: { languages: getLanguageAlternateUrls(`/educadores/${educator.uid}`) },
    }))
  )

  const nucleoRoutes = nucleos.flatMap((nucleo) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, `/nucleos/${nucleo.groupId}/${nucleo.id}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: { languages: getLanguageAlternateUrls(`/nucleos/${nucleo.groupId}/${nucleo.id}`) },
    }))
  )

  const locationRoutes = locationSlugs.flatMap(({ countrySlug, citySlug }) => {
    const path = citySlug ? `/capoeira/${countrySlug}/${citySlug}` : `/capoeira/${countrySlug}`
    return LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, path),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: citySlug ? 1.0 : 0.9,
      alternates: { languages: getLanguageAlternateUrls(path) },
    }))
  })

  return [...staticRoutes, ...locationRoutes, ...groupRoutes, ...educatorRoutes, ...nucleoRoutes]
}
