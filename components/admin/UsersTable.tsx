'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { AdminUser } from '@/lib/admin-queries'
import { computeOnboardingProgress } from '@/lib/admin-queries'
import AdminDeleteButton from '@/components/admin/AdminDeleteButton'
import Badge from '@/components/ui/Badge'

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

interface Props {
  users: AdminUser[]
  locale: string
}

export default function UsersTable({ users, locale }: Props) {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'educator' | 'admin'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all')

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeText(query)
    return users.filter((user) => {
      if (roleFilter !== 'all' && user.role !== roleFilter) return false
      if (statusFilter === 'active' && user.disabled) return false
      if (statusFilter === 'blocked' && !user.disabled) return false
      if (!normalizedQuery) return true
      const searchable = normalizeText(
        [user.name, user.surname, user.nickname, user.email].filter(Boolean).join(' ')
      )
      return searchable.includes(normalizedQuery)
    })
  }, [users, query, roleFilter, statusFilter])

  const selectClass =
    'rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-accent/35'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          className="min-w-[220px] flex-1 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-colors focus:border-accent/35"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, apodo o email..."
        />
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
        <select
          className={selectClass}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="blocked">Bloqueados</option>
        </select>
        <span className="flex items-center rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-text-secondary">
          {filtered.length} de {users.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface/30">
                {['Nombre', 'Email', 'Rol', 'País', 'Perfil', 'Estado', 'Acciones'].map((h) => (
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
              {filtered.map((user) => (
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
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
