import type { Metadata } from 'next'
import { formatPageTitle, getLanguageAlternates, getLanguageAlternateUrls, getLocalizedPath, getLocalizedUrl, getOgImageUrl, getOgLocale, getSiteDescription, SITE_NAME, buildItemListSchema } from '@/lib/site'
import DirectorySplit, { type DirectoryEducator } from '@/components/public/DirectorySplit'
import Footer from '@/components/public/Footer'
import type { Group, MapNucleo } from '@/lib/types'

export const revalidate = 60

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const HOME_TITLES: Record<string, string> = {
  es: 'Directorio Global de Capoeira',
  pt: 'Diretório Global de Capoeira',
  en: 'Global Capoeira Directory',
  fr: 'Annuaire mondial de la capoeira',
  de: 'Globales Capoeira-Verzeichnis',
  it: 'Directory Globale della Capoeira',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const title = HOME_TITLES[locale] ?? HOME_TITLES.es
  const description = getSiteDescription(locale)
  return {
    title,
    description,
    keywords: [
      'capoeira', 'clases de capoeira', 'grupos de capoeira', 'directorio capoeira',
      'dónde aprender capoeira', 'mestre capoeira', 'capoeira classes near me',
      'find capoeira group', 'capoeira training', 'capoeira instructor',
      'capoeira escola', 'capoeira angola', 'capoeira regional', 'maculelê',
      'berimbau', 'jogo da capoeira', 'capoeira mundial',
    ],
    alternates: { canonical: getLocalizedUrl(locale, ''), languages: getLanguageAlternateUrls('') },
    openGraph: {
      title: formatPageTitle(title),
      description,
      url: getLocalizedUrl(locale, ''),
      type: 'website',
      locale: getOgLocale(locale),
      siteName: SITE_NAME,
      images: [{ url: getOgImageUrl({ title, sub: 'Agenda Capoeiragem', type: 'default' }), width: 1200, height: 630, alt: title }],
    },
  }
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params

  let stats = { educators: 0, nucleos: 0, groups: 0, countries: 0 }
  let nucleos: MapNucleo[] = []
  let groups: Group[] = []
  let educators: DirectoryEducator[] = []
  try {
    const { getStats, getAllNucleos, getAllGroups, getAllEducators, getGraduationLevelNamesByGroup } = await import('@/lib/queries')
    const [s, allNucleos, allGroups, allEducators] = await Promise.all([
      getStats(),
      getAllNucleos(),
      getAllGroups(),
      getAllEducators(),
    ])
    stats = { educators: s.educators, nucleos: s.nucleos, groups: s.groups, countries: s.countries }
    nucleos = allNucleos
    groups = allGroups

    const groupNameById = new Map(allGroups.map((g) => [g.id, g.name]))
    const gradNamesByGroup = await getGraduationLevelNamesByGroup(
      allEducators.map((e) => e.groupId).filter((id): id is string => Boolean(id))
    )

    const educatorUidsWithMappedNucleo = new Set<string>()
    for (const n of allNucleos) {
      if (typeof n.latitude === 'number' && typeof n.longitude === 'number') {
        if (n.responsibleEducatorId) educatorUidsWithMappedNucleo.add(n.responsibleEducatorId)
        for (const uid of n.coEducatorIds ?? []) educatorUidsWithMappedNucleo.add(uid)
      }
    }

    educators = allEducators
      .filter((e) => educatorUidsWithMappedNucleo.has(e.uid))
      .map((e) => ({
        ...e,
        groupName: e.groupId ? groupNameById.get(e.groupId) ?? null : null,
        graduationName:
          e.groupId && e.graduationLevelId
            ? gradNamesByGroup.get(e.groupId)?.get(e.graduationLevelId) ?? null
            : null,
      }))
  } catch (error) {
    console.error('[LandingPage] Failed to load directory data:', error)
    // Return with empty arrays - partial render is better than crashing
  }

  const itemListSchema = groups.length > 0
    ? buildItemListSchema(groups.map((g) => ({
        name: g.name,
        url: getLocalizedUrl(locale, `/grupos/${g.id}`),
        description: g.description ?? undefined,
      })))
    : null

  return (
    <main className="min-h-screen bg-bg selection:bg-accent/20 overflow-x-hidden">
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <DirectorySplit locale={locale} stats={stats} nucleos={nucleos} groups={groups} educators={educators} />
      <Footer locale={locale} />
    </main>
  )
}
