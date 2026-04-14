import { MetadataRoute } from 'next'
import { getAllEducators, getAllGroups, getAllNucleos } from '@/lib/queries'
import { getLanguageAlternateUrls, getLocalizedUrl } from '@/lib/site'

const LOCALES = ['es', 'pt', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let groups: Awaited<ReturnType<typeof getAllGroups>> = []
  let educators: Awaited<ReturnType<typeof getAllEducators>> = []
  let nucleos: Awaited<ReturnType<typeof getAllNucleos>> = []

  try {
    ;[groups, educators, nucleos] = await Promise.all([
      getAllGroups(),
      getAllEducators(),
      getAllNucleos(),
    ])
  } catch (error) {
    console.error('Sitemap: Failed to fetch public entities', error)
  }

  const staticRoutes = ['', '/map'].flatMap((path) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, path),
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: path === '' ? 1.0 : 0.9,
      alternates: { languages: getLanguageAlternateUrls(path) },
    }))
  )

  const groupRoutes = groups.flatMap((group) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, `/group/${group.id}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: { languages: getLanguageAlternateUrls(`/group/${group.id}`) },
    }))
  )

  const educatorRoutes = educators.flatMap((educator) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, `/educator/${educator.uid}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: { languages: getLanguageAlternateUrls(`/educator/${educator.uid}`) },
    }))
  )

  const nucleoRoutes = nucleos.flatMap((nucleo) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, `/nucleo/${nucleo.groupId}/${nucleo.id}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: { languages: getLanguageAlternateUrls(`/nucleo/${nucleo.groupId}/${nucleo.id}`) },
    }))
  )

  return [...staticRoutes, ...groupRoutes, ...educatorRoutes, ...nucleoRoutes]
}
