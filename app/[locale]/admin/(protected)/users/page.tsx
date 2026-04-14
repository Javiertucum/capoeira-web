import { getAdminUsers } from '@/lib/admin-queries'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export default async function UsersPage({ params }: Props) {
  const { locale } = await params
  let users: any[] = []
  try {
    users = await getAdminUsers(100)
  } catch (error) {
    console.error('[UsersPage] failed to fetch users', error)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopbar section="Usuarios" />
      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Gestión de Usuarios</h1>
            <p className="mt-1 text-sm text-text-muted">Administra todas las cuentas de la plataforma.</p>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-text-secondary">
            {users.length} usuarios
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface/30">
                  {['Nombre', 'Email', 'Rol', 'País', 'Estado', ''].map(h => (
                    <th key={h} className="text-left text-[10px] tracking-[0.2em] uppercase text-text-muted px-6 py-4 border-b border-border font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map(user => (
                  <tr key={user.uid} className="hover:bg-surface/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text">
                        {user.name} {user.surname}
                      </div>
                      {user.nickname && (
                        <div className="text-[10px] uppercase tracking-wider text-text-muted font-bold mt-1">
                          "{user.nickname}"
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary font-medium">{user.email ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-text-secondary capitalize">{user.role}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary">{user.country || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={user.disabled ? 'danger' : 'accent'}>
                        {user.disabled ? 'Bloqueado' : 'Activo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/${locale}/admin/users/${user.uid}`}
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-surface px-4 text-xs font-bold text-accent transition-all hover:bg-accent/10 hover:border-accent/30 no-underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
