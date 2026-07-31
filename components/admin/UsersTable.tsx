'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { AdminUser } from '@/lib/admin-queries'
import { computeOnboardingProgress } from '@/lib/user-utils'
import { compareVersions } from '@/lib/notification-audience-filter'
import AdminDeleteButton from '@/components/admin/AdminDeleteButton'
import Badge from '@/components/ui/Badge'

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function formatDate(value?: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatLastSignIn(value?: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface Props {
  users: AdminUser[]
  locale: string
}

export default function UsersTable({ users, locale }: Props) {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'educator' | 'admin'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all')
  const [versionFilter, setVersionFilter] = useState<string>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'lastSignIn' | 'version'>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Extract available distinct versions and platforms
  const availableVersions = useMemo(() => {
    const set = new Set<string>()
    for (const u of users) {
      if (u.appVersion) set.add(u.appVersion)
    }
    return Array.from(set).sort((a, b) => compareVersions(b, a))
  }, [users])

  const availablePlatforms = useMemo(() => {
    const set = new Set<string>()
    for (const u of users) {
      if (u.appPlatform) set.add(u.appPlatform)
    }
    return Array.from(set).sort()
  }, [users])

  const filteredAndSorted = useMemo(() => {
    const normalizedQuery = normalizeText(query)

    const filtered = users.filter((user) => {
      if (roleFilter !== 'all' && user.role !== roleFilter) return false
      if (statusFilter === 'active' && user.disabled) return false
      if (statusFilter === 'blocked' && !user.disabled) return false

      if (versionFilter !== 'all') {
        if (versionFilter === 'no_version') {
          if (user.appVersion) return false
        } else if (user.appVersion !== versionFilter) {
          return false
        }
      }

      if (platformFilter !== 'all') {
        if (platformFilter === 'no_platform') {
          if (user.appPlatform) return false
        } else if (user.appPlatform !== platformFilter) {
          return false
        }
      }

      if (!normalizedQuery) return true

      const searchable = normalizeText(
        [user.name, user.surname, user.nickname, user.email, user.appVersion, user.country]
          .filter(Boolean)
          .join(' ')
      )
      return searchable.includes(normalizedQuery)
    })

    return filtered.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'name') {
        const nameA = `${a.name} ${a.surname}`.trim() || a.nickname || ''
        const nameB = `${b.name} ${b.surname}`.trim() || b.nickname || ''
        cmp = nameA.localeCompare(nameB, 'es', { sensitivity: 'base' })
      } else if (sortBy === 'createdAt') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        cmp = timeA - timeB
      } else if (sortBy === 'lastSignIn') {
        const dateA = a.lastOpenAt ?? a.lastSignInTime
        const dateB = b.lastOpenAt ?? b.lastSignInTime
        const timeA = dateA ? new Date(dateA).getTime() : 0
        const timeB = dateB ? new Date(dateB).getTime() : 0
        cmp = timeA - timeB
      } else if (sortBy === 'version') {
        const vA = a.appVersion || ''
        const vB = b.appVersion || ''
        cmp = compareVersions(vA, vB)
      }

      return sortDirection === 'asc' ? cmp : -cmp
    })
  }, [users, query, roleFilter, statusFilter, versionFilter, platformFilter, sortBy, sortDirection])

  const selectClass =
    'rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-accent/35'

  return (
    <div className="space-y-4">
      {/* Controles de búsqueda, filtros y ordenamiento */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="min-w-[220px] flex-1 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-accent/35"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, apodo, email o versión..."
        />

        {/* Filtro por Rol */}
        <select
          className={selectClass}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
        >
          <option value="all">Todos los roles</option>
          <option value="student">Estudiante</option>
          <option value="educator">Educador</option>
          <option value="admin">Admin</option>
        </select>

        {/* Filtro por Estado */}
        <select
          className={selectClass}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="blocked">Bloqueados</option>
        </select>

        {/* Filtro por Versión de App */}
        <select
          className={selectClass}
          value={versionFilter}
          onChange={(e) => setVersionFilter(e.target.value)}
        >
          <option value="all">Todas las versiones</option>
          <option value="no_version">Sin versión</option>
          {availableVersions.map((ver) => (
            <option key={ver} value={ver}>
              Versión {ver}
            </option>
          ))}
        </select>

        {/* Filtro por Plataforma */}
        {availablePlatforms.length > 0 ? (
          <select
            className={selectClass}
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            <option value="all">Todas las plataformas</option>
            <option value="no_platform">Sin plataforma</option>
            {availablePlatforms.map((plat) => (
              <option key={plat} value={plat}>
                {plat}
              </option>
            ))}
          </select>
        ) : null}

        {/* Criterio de Ordenamiento */}
        <select
          className={selectClass}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        >
          <option value="createdAt">Ordenar por Fecha de Registro</option>
          <option value="name">Ordenar por Nombre Alfabético</option>
          <option value="lastSignIn">Ordenar por Última Conexión</option>
          <option value="version">Ordenar por Versión de App</option>
        </select>

        {/* Toggle Dirección de Orden */}
        <button
          type="button"
          onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
          aria-label={`Orden ${sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}`}
          title={`Orden actual: ${sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}`}
          className="flex h-10 items-center justify-center gap-1.5 rounded-2xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-text transition-colors hover:border-accent/40"
        >
          <span>{sortDirection === 'asc' ? '▲ Asc' : '▼ Desc'}</span>
        </button>

        {/* Contador */}
        <span className="flex items-center rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-text-secondary">
          {filteredAndSorted.length} de {users.length}
        </span>
      </div>

      {/* Tabla de Usuarios */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface/30">
                {[
                  'Nombre',
                  'Email',
                  'Rol',
                  'País',
                  'Perfil',
                  'App / Plataforma',
                  'Fecha Registro',
                  'Última conexión',
                  'Estado',
                  'Acciones',
                ].map((h) => (
                  <th
                    key={h}
                    className="border-b border-border px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAndSorted.map((user) => (
                <tr key={user.uid} className="transition-colors hover:bg-surface/40">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-text">
                      {user.name} {user.surname}
                    </div>
                    {user.nickname ? (
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        &ldquo;{user.nickname}&rdquo;
                      </div>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-text-secondary">
                    {user.email ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-xs capitalize text-text-secondary">{user.role}</td>
                  <td className="px-6 py-4 text-xs text-text-secondary">{user.country || '—'}</td>
                  <td className="px-6 py-4">
                    {(() => {
                      const progress = computeOnboardingProgress(user)
                      return (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border">
                            <div
                              className={`h-full rounded-full transition-all ${
                                progress === 100 ? 'bg-accent' : progress >= 60 ? 'bg-warning' : 'bg-danger/60'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold tabular-nums text-text-muted">{progress}%</span>
                        </div>
                      )
                    })()}
                  </td>
                  <td className="px-6 py-4 text-xs text-text-secondary">
                    {user.appVersion ? (
                      <span className="tabular-nums font-semibold text-text">
                        {user.appVersion}
                        {user.appPlatform ? (
                          <span className="ml-1 text-[11px] font-normal text-text-muted">
                            ({user.appPlatform})
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs tabular-nums text-text-secondary">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-xs tabular-nums text-text-secondary">
                    {formatLastSignIn(user.lastOpenAt ?? user.lastSignInTime)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.disabled ? 'danger' : 'accent'}>
                      {user.disabled ? 'Bloqueado' : 'Activo'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${locale}/admin/users/${user.uid}`}
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-surface px-4 text-xs font-bold text-accent no-underline transition-all hover:border-accent/30 hover:bg-accent/10"
                      >
                        Editar
                      </Link>
                      <AdminDeleteButton
                        endpoint={`/api/admin/users/${user.uid}`}
                        confirmMessage={`¿Eliminar permanentemente a ${user.name} ${user.surname}? Esta acción no se puede deshacer.`}
                        label="Eliminar"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-10 text-center text-sm italic text-text-muted"
                  >
                    No hay usuarios que coincidan con los filtros.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
