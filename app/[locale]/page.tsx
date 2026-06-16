import type { Metadata } from 'next'
import { formatPageTitle, getLanguageAlternates, getLocalizedPath, getSiteDescription } from '@/lib/site'
import DirectorySplit, { type DirectoryEducator } from '@/components/public/DirectorySplit'
import Footer from '@/components/public/Footer'
import type { Group, MapNucleo } from '@/lib/types'

export const revalidate = 60

type Props = Readonly<{ params: Promise<{ locale: string }> }>

const SITE_TITLE = 'Agenda Capoeiragem'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: SITE_TITLE,
    description: getSiteDescription(locale),
    alternates: { canonical: getLocalizedPath(locale, ''), languages: getLanguageAlternates('') },
    openGraph: { title: formatPageTitle(SITE_TITLE), description: getSiteDescription(locale), url: getLocalizedPath(locale, ''), type: 'website' },
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
  } catch {}

  return (
    <main className="min-h-screen bg-bg selection:bg-accent/20 overflow-x-hidden">
      <DirectorySplit locale={locale} stats={stats} nucleos={nucleos} groups={groups} educators={educators} />
      <Footer locale={locale} />
    </main>
  )
}
