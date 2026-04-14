import { notFound } from 'next/navigation'
import { getGroupWithNucleos } from '@/lib/queries'
import AdminTopbar from '@/components/admin/AdminTopbar'
import GroupEditForm from '@/components/admin/GroupEditForm'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import NucleoListItem from '@/components/public/NucleoListItem'

type Props = { params: Promise<{ locale: string; id: string }> }

export default async function GroupAdminPage({ params }: Props) {
  const { locale, id } = await params
  const data = await getGroupWithNucleos(id)
  
  if (!data) notFound()
  const { group, nucleos } = data

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopbar section={`Grupos / ${group.name}`} />
      <div className="flex-1 overflow-y-auto p-6 lg:p-10">
        <Link 
          href={`/${locale}/admin/groups`} 
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted transition-colors hover:text-accent no-underline"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a Grupos
        </Link>

        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl border border-border bg-white flex-shrink-0 p-3 shadow-sm">
                {group.logoUrl ? (
                  <img src={group.logoUrl} className="h-full w-full object-contain" alt="logo" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-text-muted">
                    {group.name[0]}
                  </div>
                )}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-text">
                {group.name}
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Admin ID: <code className="text-[10px] bg-surface-muted px-1.5 py-0.5 rounded">{group.id}</code>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
             <Badge variant="accent">{nucleos.length} Núcleos Activos</Badge>
             <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Ultima Sync: {new Date().toLocaleDateString(locale)}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
           <div className="space-y-12">
              <section>
                 <h2 className="text-lg font-bold text-text mb-6">Configuración del Grupo</h2>
                 <GroupEditForm group={group} locale={locale} />
              </section>
           </div>

           <aside className="space-y-8">
              <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                 <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-6">Núcleos de Entrenamiento</h3>
                 <div className="space-y-4">
                    {nucleos.map((n: any) => (
                      <div key={n.id} className="group relative rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent/40">
                         <div className="text-sm font-bold text-text">{n.name}</div>
                         <div className="mt-1 text-xs text-text-muted">{n.city}, {n.country}</div>
                         <div className="mt-3 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{n.type}</span>
                            <Link href={`/${locale}/group/${group.id}`} className="text-[10px] font-bold text-text-muted hover:text-text">Ver Público</Link>
                         </div>
                      </div>
                    ))}
                    {nucleos.length === 0 && (
                      <div className="text-center py-6 text-sm text-text-muted italic">
                        No hay núcleos asociados.
                      </div>
                    )}
                 </div>
              </section>

              <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                 <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-6">Estadísticas</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-text-muted">Miembros Declarados</span>
                       <span className="font-bold text-text">{group.memberCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-text-muted">Ciudades</span>
                       <span className="font-bold text-text">{group.representedCities?.length || 0}</span>
                    </div>
                 </div>
              </section>
           </aside>
        </div>
      </div>
    </div>
  )
}
