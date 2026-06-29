import { MetadataRoute } from 'next'
import { getLanguageAlternateUrls, getLocalizedUrl } from '@/lib/site'
import { getAllGroups, getAllEducators, getAllNucleos, getAllLocationSlugs } from '@/lib/queries'
import { getTravelersPath, getTravelersLanguageAlternateUrls } from '@/lib/travelers-content'
import { slugify } from '@/lib/slugify'

const LOCALES = ['es', 'pt', 'en', 'fr', 'de', 'it']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/about', '/privacy', '/terms', '/tutoriales'].flatMap((path) =>
    LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, path),
      lastModified: new Date(),
      changeFrequency: path === '' ? ('daily' as const) : path === '/tutoriales' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1.0 : path === '/tutoriales' ? 0.8 : 0.5,
      alternates: { languages: getLanguageAlternateUrls(path) },
    }))
  )

  const [groups, allEducators, nucleos, locationSlugs] = await Promise.all([
    getAllGroups().catch(() => []),
    getAllEducators().catch(() => []),
    getAllNucleos().catch(() => []),
    getAllLocationSlugs().catch(() => []),
  ])

  // Mantener fuera del sitemap las paginas que marcamos noindex (ver
  // [ciudadSlug]/page.tsx y educadores/[uid]/page.tsx) — un sitemap con
  // URLs noindex es una senal de calidad inconsistente para los crawlers.
  const educators = allEducators.filter((e) => (e.bio?.trim().length ?? 0) >= 20)

  const cityNucleoCounts = new Map<string, number>()
  for (const n of nucleos) {
    if (!n.country || !n.city) continue
    const key = `${slugify(n.country)}/${slugify(n.city)}`
    cityNucleoCounts.set(key, (cityNucleoCounts.get(key) ?? 0) + 1)
  }

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

  const locationRoutes = locationSlugs
    .filter(({ citySlug, countrySlug }) =>
      !citySlug || (cityNucleoCounts.get(`${countrySlug}/${citySlug}`) ?? 0) >= 2
    )
    .flatMap(({ countrySlug, citySlug }) => {
      const path = citySlug ? `/capoeira/${countrySlug}/${citySlug}` : `/capoeira/${countrySlug}`
      return LOCALES.map((locale) => ({
        url: getLocalizedUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: citySlug ? 1.0 : 0.9,
        alternates: { languages: getLanguageAlternateUrls(path) },
      }))
    })

  const travelersRoutes = LOCALES.map((locale) => ({
    url: getLocalizedUrl(locale, getTravelersPath(locale)),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: { languages: getTravelersLanguageAlternateUrls() },
  }))

  return [...staticRoutes, ...travelersRoutes, ...locationRoutes, ...groupRoutes, ...educatorRoutes, ...nucleoRoutes]
}
