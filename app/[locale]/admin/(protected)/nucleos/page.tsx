import Link from 'next/link'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import { getAdminNucleos } from '@/lib/admin-queries'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminNucleosPage({ params }: Props) {
  const { locale } = await params
  const nucleos = await getAdminNucleos().catch(() => [])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminTopbar section="Nucleos" />

      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-text sm:text-3xl">
              Gestion de nucleos
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Administra todos los espacios de entrenamiento desde un solo lugar.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-text-secondary">
            {nucleos.length} nucleos
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-surface/35">
                  {['Nucleo', 'Grupo', 'Ubicacion', 'Mapa', 'Horarios', ''].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {nucleos.map((nucleo) => (
                  <tr key={`${nucleo.groupId}-${nucleo.id}`} className="hover:bg-surface/25">
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-text">{nucleo.name}</div>
                      <div className="mt-1 text-xs text-text-muted">{nucleo.id}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-secondary">{nucleo.groupName}</td>
                    <td className="px-4 py-4 text-sm text-text-secondary">
                      {[nucleo.city, nucleo.country].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={nucleo.latitude != null && nucleo.longitude != null ? 'accent' : 'muted'}>
                        {nucleo.latitude != null && nucleo.longitude != null ? 'Con coordenadas' : 'Pendiente'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-secondary">
                      {nucleo.schedules?.length ?? 0}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/${locale}/admin/nucleos/${nucleo.groupId}/${nucleo.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent/30"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}

                {nucleos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-text-muted">
                      No hay nucleos disponibles.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
