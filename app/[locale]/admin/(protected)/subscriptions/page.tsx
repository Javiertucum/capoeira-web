import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import { getAdminSubscriptions } from '@/lib/admin-queries'
import Link from 'next/link'

type Props = {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{
    plan?: string
    country?: string
    groupId?: string
  }>
}

function isKnownPlan(value: string | undefined): value is 'free' | 'premium' {
  return value === 'free' || value === 'premium'
}

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return '--'
  return new Date(value).toLocaleString(locale)
}

function filterLink(locale: string, plan?: 'free' | 'premium') {
  const suffix = plan ? `?plan=${plan}` : ''
  return `/${locale}/admin/subscriptions${suffix}`
}

export default async function SubscriptionsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const filters = (await searchParams) ?? {}
  const selectedPlan = isKnownPlan(filters.plan) ? filters.plan : undefined
  const selectedCountry = filters.country?.trim()
  const selectedGroupId = filters.groupId?.trim()

  const { rows, stats } = await getAdminSubscriptions().catch((error) => {
    console.error('[SubscriptionsPage] failed to fetch subscriptions', error)
    return {
      rows: [],
      stats: {
        totalUsers: 0,
        premiumUsers: 0,
        freeUsers: 0,
        staleSubscriptions: 0,
        lastVerifiedAt: null,
      },
    }
  })

  const filteredRows = rows.filter((row) => {
    if (selectedPlan && row.plan !== selectedPlan) return false
    if (selectedCountry && row.country !== selectedCountry) return false
    if (selectedGroupId && row.groupId !== selectedGroupId) return false
    return true
  })

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar
        section="Suscripciones"
        description="Estado real de RevenueCat sincronizado hacia Firestore."
      />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader
            eyebrow="Billing operativo"
            title="Suscripciones"
            description="Lectura consolidada de usuarios y su documento users/{uid}/subscription/current. La frescura del dato depende del webhook de RevenueCat y de las verificaciones hechas por la app."
            actions={
              <div className="flex flex-wrap gap-2">
                <Link
                  href={filterLink(locale)}
                  className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
                >
                  Todos
                </Link>
                <Link
                  href={filterLink(locale, 'premium')}
                  className="rounded-xl border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent/15"
                >
                  Premium
                </Link>
                <Link
                  href={filterLink(locale, 'free')}
                  className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
                >
                  Free
                </Link>
              </div>
            }
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <AdminStatCard
              label="Usuarios leidos"
              value={stats.totalUsers.toLocaleString(locale)}
              helper="Perfiles publicos incluidos en este corte"
            />
            <AdminStatCard
              label="Premium"
              value={stats.premiumUsers.toLocaleString(locale)}
              helper="Plan activo premium segun Firestore"
              tone="accent"
            />
            <AdminStatCard
              label="Free"
              value={stats.freeUsers.toLocaleString(locale)}
              helper="Usuarios sin entitlement premium"
            />
            <AdminStatCard
              label="Datos stale"
              value={stats.staleSubscriptions.toLocaleString(locale)}
              helper="Sin verificacion RevenueCat en los ultimos 7 dias"
              tone={stats.staleSubscriptions > 0 ? 'warning' : 'accent'}
            />
            <AdminStatCard
              label="Ultima verificacion"
              value={stats.lastVerifiedAt ? new Date(stats.lastVerifiedAt).toLocaleDateString(locale) : '--'}
              helper="lastVerifiedAt mas reciente detectado"
            />
          </div>

          <AdminSectionCard
            title="Usuarios y plan actual"
            description="La tabla prioriza cuentas premium, luego usuarios con verificacion reciente. Usa los links superiores para revisar planes."
            contentClassName="overflow-x-auto p-0"
          >
            {filteredRows.length === 0 ? (
              <div className="p-6">
                <AdminEmptyState
                  eyebrow="Suscripciones"
                  title="No hay usuarios para este filtro"
                  description="Cambia el filtro o espera a que el webhook de RevenueCat sincronice nuevos estados en Firestore."
                />
              </div>
            ) : (
              <table className="w-full min-w-[1040px] border-collapse">
                <thead>
                  <tr className="bg-surface/10">
                    {['Usuario', 'Plan', 'Rol', 'Pais', 'Grupo', 'Fuente', 'Verificacion', 'Vence'].map((heading) => (
                      <th
                        key={heading}
                        className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRows.map((row) => (
                    <tr key={row.uid} className="transition-colors hover:bg-surface/30">
                      <td className="px-6 py-4">
                        <Link
                          href={`/${locale}/admin/users/${row.uid}`}
                          className="text-sm font-semibold text-text transition-colors hover:text-accent"
                        >
                          {row.name}
                        </Link>
                        <div className="mt-1 text-xs text-text-muted">{row.email ?? row.uid}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={row.isPremium ? 'accent' : 'muted'}>
                          {row.plan}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs capitalize text-text-secondary">{row.role}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{row.country ?? '--'}</td>
                      <td className="px-6 py-4 text-xs text-text-secondary">{row.groupId ?? '--'}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-text-secondary">{row.source ?? 'firestore'}</div>
                        <div className="mt-1 text-[11px] text-text-muted">{row.eventType ?? '--'}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-text-secondary">
                        {formatDate(row.lastVerifiedAt, locale)}
                      </td>
                      <td className="px-6 py-4 text-xs text-text-secondary">
                        {formatDate(row.expiresAt, locale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </AdminSectionCard>
        </div>
      </div>
    </div>
  )
}
