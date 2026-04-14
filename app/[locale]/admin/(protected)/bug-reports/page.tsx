import { getBugReports } from '@/lib/admin-queries'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export default async function BugReportsPage({ params }: Props) {
  const { locale } = await params
  let bugs: any[] = []
  try {
    bugs = await getBugReports()
  } catch (error) {
    console.error('[BugReportsPage] failed to fetch bugs', error)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopbar section="Bug Reports" />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Soporte Técnico</h1>
            <p className="mt-1 text-sm text-text-muted">Revisa y gestiona los reportes de error enviados desde la app.</p>
          </div>
          <div className="flex gap-4">
             <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-text-secondary">
               {bugs.filter(b => b.status === 'open').length} abiertos
             </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface/30">
                  {['Estado', 'Descripción', 'Usuario', 'Versión', 'Plataforma', ''].map(h => (
                    <th key={h} className="text-left text-[10px] tracking-[0.2em] uppercase text-text-muted px-6 py-4 border-b border-border font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bugs.map(bug => (
                  <tr key={bug.id} className="hover:bg-surface/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shadow-sm
                          ${bug.status === 'open' ? 'bg-danger' : bug.status === 'reviewing' ? 'bg-warning' : 'bg-accent'}`}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text">
                          {bug.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text max-w-[300px] truncate">{bug.description}</div>
                      <div className="text-[10px] text-text-muted mt-1 uppercase tracking-tight">
                        {bug.createdAt ? new Date(bug.createdAt).toLocaleString(locale) : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary">
                      {bug.userEmail}
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary font-mono">
                      v{bug.appVersion}
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant="accent">{bug.platform}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/${locale}/admin/bug-reports/${bug.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-surface px-4 text-xs font-bold text-accent transition-all hover:bg-accent/10 hover:border-accent/30 no-underline"
                      >
                        Revisar
                      </Link>
                    </td>
                  </tr>
                ))}
                {bugs.length === 0 && (
                   <tr>
                     <td colSpan={6} className="px-6 py-12 text-center text-sm text-text-muted italic">
                        No hay reportes de error registrados.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
