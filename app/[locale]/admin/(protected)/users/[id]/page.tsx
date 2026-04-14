import { notFound } from 'next/navigation'
import { getAdminUserById } from '@/lib/admin-queries'
import AdminTopbar from '@/components/admin/AdminTopbar'
import UserEditForm from '@/components/admin/UserEditForm'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string; id: string }> }

export default async function UserEditPage({ params }: Props) {
  const { locale, id } = await params
  let user = null
  try {
    user = await getAdminUserById(id)
  } catch (error) {
    console.error('[UserEditPage] failed to fetch user', error)
  }
  
  if (!user) notFound()

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopbar section={`Usuarios / ${user.name} ${user.surname}`} />
      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        <Link 
          href={`/${locale}/admin/users`} 
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted transition-colors hover:text-accent no-underline"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a Usuarios
        </Link>

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text">
              {user.name} {user.surname}
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              ID: <code className="text-[10px] bg-surface-muted px-1.5 py-0.5 rounded">{user.uid}</code>
              {user.email && <span className="ml-3 font-medium text-text-secondary">{user.email}</span>}
            </p>
          </div>
          <div className="flex gap-3">
             <div className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest border
                ${user.disabled ? 'bg-danger/15 text-danger border-danger/20' : 'bg-accent/15 text-accent border-accent/20'}`}>
                {user.disabled ? 'Bloqueado' : 'Acceso Activo'}
             </div>
          </div>
        </div>

        <UserEditForm user={user} locale={locale} />
      </div>
    </div>
  )
}
