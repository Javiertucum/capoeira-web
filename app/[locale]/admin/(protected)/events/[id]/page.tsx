import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminTopbar from '@/components/admin/AdminTopbar'
import EventEditForm from '@/components/admin/EventEditForm'
import { getAdminEntityOptions, getAdminEventById } from '@/lib/admin-queries'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function AdminEventDetailPage({ params }: Props) {
  const { locale, id } = await params
  const [event, entityOptions] = await Promise.all([
    getAdminEventById(id).catch(() => null),
    getAdminEntityOptions().catch(() => []),
  ])

  if (!event) {
    notFound()
  }

  const userOptions = entityOptions.filter((option) => option.type === 'user')
  const creator = userOptions.find((option) => option.id === event.createdBy)
  const creatorLabel = creator?.label || event.createdBy || 'sin registro'

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminTopbar section={`Eventos / ${event.title || 'Sin titulo'}`} />

      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <Link
          href={`/${locale}/admin/events`}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted transition-colors hover:text-accent"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a eventos
        </Link>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-text sm:text-3xl">
              {event.title || 'Evento sin titulo'}
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Creado por <span className="text-text-secondary">{creatorLabel}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Going</p>
              <p className="mt-2 text-xl font-semibold text-text">{event.goingCount ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Interested</p>
              <p className="mt-2 text-xl font-semibold text-text">{event.interestedCount ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Inicio</p>
              <p className="mt-2 text-sm font-semibold text-text">
                {event.startDate ? new Date(event.startDate).toLocaleDateString(locale) : '—'}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Categoria</p>
              <p className="mt-2 text-sm font-semibold text-text">{event.category || '—'}</p>
            </div>
          </div>
        </div>

        <EventEditForm event={event} locale={locale} entityOptions={entityOptions} />
      </div>
    </div>
  )
}
