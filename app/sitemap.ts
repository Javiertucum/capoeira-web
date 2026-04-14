import { MetadataRoute } from 'next'
import { getAllEducators, getAllGroups } from '@/lib/queries'
import { getLanguageAlternateUrls, getLocalizedUrl } from '@/lib/site'

const LOCALES = ['es', 'pt', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let groups: any[] = []
  let educators: any[] = []
  try {
    ;[groups, educators] = await Promise.all([getAllGroups(), getAllEducators()])
  } catch (error) {
    console.error('Sitemap: Failed to fetch public entities', error)
  }

  const staticRoutes = ['', '/map', '/app'].flatMap((path) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, path),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
      alternates: {
        languages: getLanguageAlternateUrls(path),
      },
    }))
  )

  const groupRoutes = groups.flatMap((group) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, `/group/${group.id}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: {
        languages: getLanguageAlternateUrls(`/group/${group.id}`),
      },
    }))
  )

  const educatorRoutes = educators.flatMap((educator) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, `/educator/${educator.uid}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: {
        languages: getLanguageAlternateUrls(`/educator/${educator.uid}`),
      },
    }))
  )

  return [...staticRoutes, ...groupRoutes, ...educatorRoutes]
}
