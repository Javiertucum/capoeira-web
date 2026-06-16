import { MetadataRoute } from 'next'
import { getLanguageAlternateUrls, getLocalizedUrl } from '@/lib/site'
import { getAllGroups, getAllEducators } from '@/lib/queries'

const LOCALES = ['es', 'pt', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/privacy', '/terms'].flatMap((path) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, path),
      lastModified: new Date(),
      changeFrequency: path === '' ? ('daily' as const) : ('monthly' as const),
      priority: path === '' ? 1.0 : 0.5,
      alternates: { languages: getLanguageAlternateUrls(path) },
    }))
  )

  const [groups, educators] = await Promise.all([
    getAllGroups().catch(() => []),
    getAllEducators().catch(() => []),
  ])

  const groupRoutes = groups.flatMap((group) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, `/grupos/${group.id}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: { languages: getLanguageAlternateUrls(`/grupos/${group.id}`) },
    }))
  )

  const educatorRoutes = educators.flatMap((educator) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, `/educadores/${educator.uid}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: { languages: getLanguageAlternateUrls(`/educadores/${educator.uid}`) },
    }))
  )

  return [...staticRoutes, ...groupRoutes, ...educatorRoutes]
}
