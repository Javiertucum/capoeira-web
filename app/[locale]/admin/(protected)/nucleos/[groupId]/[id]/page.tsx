import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminTopbar from '@/components/admin/AdminTopbar'
import NucleoEditForm from '@/components/admin/NucleoEditForm'
import { getAdminNucleoById } from '@/lib/admin-queries'

type Props = {
  params: Promise<{ locale: string; groupId: string; id: string }>
}

export default async function AdminNucleoDetailPage({ params }: Props) {
  const { locale, groupId, id } = await params
  const nucleo = await getAdminNucleoById(groupId, id).catch(() => null)

  if (!nucleo) {
    notFound()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminTopbar section={`Nucleos / ${nucleo.name}`} />

      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <Link
          href={`/${locale}/admin/nucleos`}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted transition-colors hover:text-accent"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a nucleos
        </Link>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
              {nucleo.groupName}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-text sm:text-3xl">
              {nucleo.name}
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              {[nucleo.city, nucleo.country].filter(Boolean).join(', ') || 'Sin ubicacion visible'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Horarios</p>
              <p className="mt-2 text-xl font-semibold text-text">{nucleo.schedules?.length ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Mapa</p>
              <p className="mt-2 text-sm font-semibold text-text">
                {nucleo.latitude != null && nucleo.longitude != null ? 'Listo' : 'Pendiente'}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Educador</p>
              <p className="mt-2 text-sm font-semibold text-text">
                {nucleo.responsibleEducatorId || 'Sin asignar'}
              </p>
            </div>
          </div>
        </div>

        <NucleoEditForm nucleo={nucleo} locale={locale} />
      </div>
    </div>
  )
}
