import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { getDashboardStats } from '@/lib/admin-queries'
import { getSessionUid } from '@/lib/auth/session'

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

  let stats = {
    openBugReports: 0,
    pendingRequests: 0,
  }
  try {
    stats = await getDashboardStats()
  } catch (error) {
    console.error('[AdminLayout] failed to fetch dashboard stats', error)
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar
        locale={locale}
        openBugReports={stats.openBugReports}
        pendingRequests={stats.pendingRequests}
      />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-surface-muted/20">
        {children}
      </div>
    </div>
  )
}
