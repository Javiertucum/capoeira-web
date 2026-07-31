import { getAdminUsers } from '@/lib/admin-queries'
import type { AdminUser } from '@/lib/admin-queries'
import AdminTopbar from '@/components/admin/AdminTopbar'
import UsersTable from '@/components/admin/UsersTable'

type Props = { params: Promise<{ locale: string }> }

export default async function UsersPage({ params }: Props) {
  const { locale } = await params
  let users: AdminUser[] = []
  try {
    users = await getAdminUsers(500)
  } catch (error) {
    console.error('[UsersPage] failed to fetch users', error)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section="Usuarios" />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text">Gestión de Usuarios</h1>
          <p className="mt-1 text-sm text-text-muted">
            Administra todas las cuentas de la plataforma.
          </p>
        </div>
        <UsersTable users={users} locale={locale} />
      </div>
    </div>
  )
}
