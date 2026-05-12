import { getAllGroups } from '@/lib/queries'
import AdminGroupsPageClient from '@/components/admin/AdminGroupsPageClient'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminGroupsPage({ params }: Props) {
  const { locale } = await params
  let groups: any[] = []
  try {
    groups = await getAllGroups({ includeHidden: true })
  } catch (error) {
    console.error('[AdminGroupsPage] failed to fetch groups', error)
  }

  return <AdminGroupsPageClient groups={groups} locale={locale} />
}
