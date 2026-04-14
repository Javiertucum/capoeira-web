import { MetadataRoute } from 'next'
import { getAllGroups } from '@/lib/queries'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://capoeira.app'
const LOCALES = ['es', 'pt', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let groups: any[] = []
  try {
    groups = await getAllGroups()
  } catch (error) {
    console.error('Sitemap: Failed to fetch groups', error)
  }

  const staticRoutes = ['', '/map'].flatMap(path =>
    LOCALES.map(locale => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    }))
  )

  const groupRoutes = groups.flatMap(group =>
    LOCALES.map(locale => ({
      url: `${BASE_URL}/${locale}/group/${group.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  )

  return [...staticRoutes, ...groupRoutes]
}
