import { redirect } from 'next/navigation'
import { getSessionUid } from '@/lib/auth/session'
import { getDashboardStats } from '@/lib/admin-queries'
import AdminSidebar from '@/components/admin/AdminSidebar'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params
  const uid = await getSessionUid()
  
  if (!uid) {
    redirect(`/${locale}/admin/login`)
  }

  // Fetch initial stats for the sidebar (e.g., bug reports count)
  let stats = { openBugReports: 0 }
  try {
    stats = await getDashboardStats()
  } catch (error) {
    console.error('[AdminLayout] failed to fetch dashboard stats', error)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar locale={locale} openBugReports={stats.openBugReports} />
        <div className="flex-1 flex flex-col overflow-hidden bg-surface-muted/30">
          {children}
        </div>
      </div>
    </div>
  )
}
