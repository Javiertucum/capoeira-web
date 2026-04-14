import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminTopbar from '@/components/admin/AdminTopbar'
import BugReportEditForm from '@/components/admin/BugReportEditForm'
import { getBugReportById } from '@/lib/admin-queries'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export default async function AdminBugReportDetailPage({ params }: Props) {
  const { locale, id } = await params
  const report = await getBugReportById(id).catch(() => null)

  if (!report) {
    notFound()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminTopbar section={`Bug Reports / ${report.id}`} />

      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <Link
          href={`/${locale}/admin/bug-reports`}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted transition-colors hover:text-accent"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a soporte
        </Link>

        <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              Reporte de usuario
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-text">Detalle del bug</h1>
            <p className="mt-4 text-sm leading-7 text-text-secondary">{report.description}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface/70 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Usuario</p>
                <p className="mt-2 text-sm font-semibold text-text">{report.userEmail || report.userId}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Version</p>
                <p className="mt-2 text-sm font-semibold text-text">v{report.appVersion || '—'}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Plataforma</p>
                <p className="mt-2 text-sm font-semibold capitalize text-text">{report.platform}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Creado</p>
                <p className="mt-2 text-sm font-semibold text-text">
                  {report.createdAt ? new Date(report.createdAt).toLocaleString(locale) : '—'}
                </p>
              </div>
            </div>

            {report.screenshotUrl ? (
              <a
                href={report.screenshotUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-accent transition-colors hover:text-text"
              >
                Abrir screenshot
              </a>
            ) : null}
          </section>

          <BugReportEditForm report={report} />
        </div>
      </div>
    </div>
  )
}
