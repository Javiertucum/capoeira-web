'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminEntityOption } from '@/lib/admin-queries'
import type { Group } from '@/lib/types'
import EntitySearchInput from '@/components/admin/EntitySearchInput'

interface Props {
  group: Group
  locale: string
  entityOptions: AdminEntityOption[]
}

export default function GroupEditForm({ group, locale, entityOptions }: Props) {
  const router = useRouter()
  const userOptions = useMemo(
    () => entityOptions.filter((o) => o.type === 'user'),
    [entityOptions]
  )

  const [form, setForm] = useState({
    name: group.name,
    description: group.description || '',
    graduationSystemName: group.graduationSystemName || '',
    logoUrl: group.logoUrl || '',
    representedCountries: group.representedCountries?.join(', ') || '',
    representedCities: group.representedCities?.join(', ') || '',
    educatorThresholdOrder: group.educatorThresholdOrder?.toString() || '',
  })
  const [adminUserIds, setAdminUserIds] = useState<string[]>(group.adminUserIds ?? [])
  const [coAdminIds, setCoAdminIds] = useState<string[]>(group.coAdminIds ?? [])
  const [adminToAdd, setAdminToAdd] = useState('')
  const [coAdminToAdd, setCoAdminToAdd] = useState('')
  const [memberToAdd, setMemberToAdd] = useState('')
  const [addingMember, setAddingMember] = useState(false)
  const [recalculating, setRecalculating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const body = {
        ...form,
        representedCountries: form.representedCountries
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        representedCities: form.representedCities
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        educatorThresholdOrder: form.educatorThresholdOrder
          ? Number(form.educatorThresholdOrder)
          : null,
        adminUserIds,
        coAdminIds,
      }
      const res = await fetch(`/api/admin/groups/${group.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Error al guardar')
      setMessage({ type: 'ok', text: 'Grupo actualizado correctamente' })
      router.refresh()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error desconocido',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleAddMember() {
    if (!memberToAdd) return
    setAddingMember(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/groups/${group.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberToAdd }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Error al agregar miembro')
      setMessage({
        type: 'ok',
        text: data.notified
          ? 'Usuario agregado al grupo y notificado correctamente'
          : 'Usuario agregado al grupo (no se pudo enviar la notificacion push)',
      })
      setMemberToAdd('')
      router.refresh()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al agregar miembro',
      })
    } finally {
      setAddingMember(false)
    }
  }

  async function handleRecalculateMembers() {
    setRecalculating(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/groups/${group.id}/recalculate-members`, {
        method: 'POST',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Error al recalcular miembros')
      setMessage({
        type: 'ok',
        text: `Contador de miembros actualizado: ${data.previousCount} -> ${data.memberCount}`,
      })
      router.refresh()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al recalcular miembros',
      })
    } finally {
      setRecalculating(false)
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        `¿Eliminar permanentemente el grupo "${group.name}"? Esta acción no se puede deshacer.`
      )
    )
      return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/groups/${group.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      router.push(`/${locale}/admin/groups`)
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al eliminar',
      })
      setDeleting(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/35'
  const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted'
  const sectionClass = 'rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6'

  function renderUserList(ids: string[], onRemove: (id: string) => void) {
    if (ids.length === 0) {
      return (
        <p className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-muted">
          Sin usuarios asignados.
        </p>
      )
    }
    return (
      <div className="space-y-2">
        {ids.map((id) => {
          const option = userOptions.find((o) => o.id === id)
          return (
            <div
              key={id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text">{option?.label || id}</p>
                <p className="truncate font-mono text-[10px] text-text-muted">{id}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(id)}
                className="text-xs font-semibold text-danger"
              >
                Quitar
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            message.type === 'ok'
              ? 'border-accent/20 bg-accent/10 text-accent'
              : 'border-danger/20 bg-danger/10 text-danger'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Información General</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Nombre del Grupo</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Sistema de Graduación</label>
            <input
              className={inputClass}
              value={form.graduationSystemName}
              onChange={(e) => set('graduationSystemName', e.target.value)}
              placeholder="Ej: Cordas Abadá-Capoeira"
            />
          </div>
          <div>
            <label className={labelClass}>Orden mínimo para ser educador</label>
            <input
              className={inputClass}
              value={form.educatorThresholdOrder}
              onChange={(e) => set('educatorThresholdOrder', e.target.value)}
              inputMode="numeric"
              placeholder="Ej: 5"
            />
            <p className="mt-2 text-xs text-text-muted">
              A partir de qué orden de graduación un alumno se considera elegible para ser educador.
            </p>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Descripción / Historia</label>
            <textarea
              className={`${inputClass} min-h-[120px] resize-y`}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe el origen y filosofía del grupo..."
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Identidad Visual</h3>
        <div className="mt-5 flex items-end gap-4">
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-white p-2">
            {form.logoUrl ? (
              <img src={form.logoUrl} className="h-full w-full object-contain" alt="preview" loading="lazy" decoding="async" />
            ) : null}
          </div>
          <div className="flex-1">
            <label className={labelClass}>Logo URL</label>
            <input
              className={inputClass}
              value={form.logoUrl}
              onChange={(e) => set('logoUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Ubicaciones Representadas</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Países (separados por coma)</label>
            <input
              className={inputClass}
              value={form.representedCountries}
              onChange={(e) => set('representedCountries', e.target.value)}
              placeholder="Brasil, España, Portugal..."
            />
          </div>
          <div>
            <label className={labelClass}>Ciudades (separados por coma)</label>
            <input
              className={inputClass}
              value={form.representedCities}
              onChange={(e) => set('representedCities', e.target.value)}
              placeholder="Madrid, Barcelona, Lisboa..."
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Agregar miembro al grupo</h3>
        <p className="mt-1 text-xs text-text-muted">
          Asigna un usuario a este grupo. Recibira una notificacion push avisandole.
        </p>
        <div className="mt-5">
          <EntitySearchInput
            label="Buscar usuario"
            value={memberToAdd}
            options={userOptions}
            placeholder="Busca por nombre, apodo o correo"
            emptyLabel="Selecciona un usuario para agregar."
            onChange={setMemberToAdd}
          />
          <button
            type="button"
            disabled={!memberToAdd || addingMember}
            onClick={handleAddMember}
            className="mt-3 rounded-xl border border-accent/30 px-4 py-2 text-xs font-semibold text-accent transition-opacity disabled:opacity-40"
          >
            {addingMember ? 'Agregando...' : 'Agregar al grupo y notificar'}
          </button>
        </div>
        <div className="mt-5 border-t border-border pt-5">
          <p className="text-xs text-text-muted">
            Contador actual de miembros: <span className="font-semibold text-text">{group.memberCount ?? 0}</span>.
            Si no coincide con la cantidad real, recalculalo aqui.
          </p>
          <button
            type="button"
            disabled={recalculating}
            onClick={handleRecalculateMembers}
            className="mt-3 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text-secondary transition-opacity hover:border-accent/30 disabled:opacity-40"
          >
            {recalculating ? 'Recalculando...' : 'Recalcular contador de miembros'}
          </button>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Administradores del Grupo</h3>
        <p className="mt-1 text-xs text-text-muted">
          Usuarios con acceso de administrador y co-administrador sobre este grupo.
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              Admins principales
            </p>
            <EntitySearchInput
              label="Buscar usuario"
              value={adminToAdd}
              options={userOptions}
              placeholder="Busca por nombre, apodo o correo"
              emptyLabel="Selecciona un usuario para agregar."
              onChange={setAdminToAdd}
            />
            <button
              type="button"
              disabled={!adminToAdd || adminUserIds.includes(adminToAdd)}
              onClick={() => {
                setAdminUserIds((ids) => [...ids, adminToAdd])
                setAdminToAdd('')
              }}
              className="mt-3 rounded-xl border border-accent/30 px-4 py-2 text-xs font-semibold text-accent transition-opacity disabled:opacity-40"
            >
              Agregar admin
            </button>
            <div className="mt-4">
              {renderUserList(adminUserIds, (id) =>
                setAdminUserIds((ids) => ids.filter((x) => x !== id))
              )}
            </div>
          </div>
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              Co-admins
            </p>
            <EntitySearchInput
              label="Buscar usuario"
              value={coAdminToAdd}
              options={userOptions}
              placeholder="Busca por nombre, apodo o correo"
              emptyLabel="Selecciona un usuario para agregar."
              onChange={setCoAdminToAdd}
            />
            <button
              type="button"
              disabled={!coAdminToAdd || coAdminIds.includes(coAdminToAdd)}
              onClick={() => {
                setCoAdminIds((ids) => [...ids, coAdminToAdd])
                setCoAdminToAdd('')
              }}
              className="mt-3 rounded-xl border border-accent/30 px-4 py-2 text-xs font-semibold text-accent transition-opacity disabled:opacity-40"
            >
              Agregar co-admin
            </button>
            <div className="mt-4">
              {renderUserList(coAdminIds, (id) =>
                setCoAdminIds((ids) => ids.filter((x) => x !== id))
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center justify-center rounded-xl border border-danger/30 bg-danger/10 px-5 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/14 disabled:opacity-50"
        >
          {deleting ? 'Eliminando...' : 'Eliminar grupo'}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-92 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
