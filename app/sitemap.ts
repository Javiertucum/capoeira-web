import { MetadataRoute } from 'next'
import { getLanguageAlternateUrls, getLocalizedUrl } from '@/lib/site'

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

  return [...staticRoutes]
}
