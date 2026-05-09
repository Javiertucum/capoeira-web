# Admin Completeness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close all admin panel gaps — shared entity picker, functional settings, group admin users management, nucleo educator pickers, and user search/filters — while improving code quality.

**Architecture:** Extract shared UI components first (EntitySearchInput), then update each admin module to use them. Settings gets a new Firestore-backed API. All changes follow the existing PATCH/DELETE pattern of other admin modules.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, Firebase Admin SDK (Firestore), React client components for interactive forms.

---

## File Map

**Create:**
- `components/admin/EntitySearchInput.tsx` — shared entity search picker (extracted from EventEditForm)
- `app/api/admin/settings/route.ts` — GET/PATCH for `adminSettings/global` Firestore doc
- `components/admin/SettingsForm.tsx` — client component for settings form
- `components/admin/UsersTable.tsx` — client component with search + filter for users list

**Modify:**
- `components/admin/EventEditForm.tsx` — replace local EntitySearchInput/EntityBadge with imports
- `components/admin/GroupEditForm.tsx` — add adminUserIds/coAdminIds pickers, delete button, remove `any` type
- `components/admin/NucleoEditForm.tsx` — replace raw text educator fields with entity pickers
- `app/[locale]/admin/(protected)/settings/page.tsx` — fetch real data, render SettingsForm
- `app/[locale]/admin/(protected)/groups/[id]/page.tsx` — pass entityOptions to GroupEditForm
- `app/[locale]/admin/(protected)/nucleos/[groupId]/[id]/page.tsx` — pass entityOptions to NucleoEditForm
- `app/[locale]/admin/(protected)/users/page.tsx` — use UsersTable component, remove `any[]`

---

## Task 1: Extract shared EntitySearchInput component

**Files:**
- Create: `components/admin/EntitySearchInput.tsx`
- Modify: `components/admin/EventEditForm.tsx` (lines 36-41, 128-252)

- [ ] **Step 1: Create `components/admin/EntitySearchInput.tsx`**

```tsx
import { useMemo, useState } from 'react'
import type { AdminEntityOption, AdminEntityType } from '@/lib/admin-queries'

export const ENTITY_TYPE_LABELS: Record<AdminEntityType, string> = {
  user: 'Usuario',
  group: 'Grupo',
  nucleo: 'Nucleo',
  event: 'Evento',
}

export function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function entitySearchText(option: AdminEntityOption): string {
  return normalizeSearch(
    [option.label, option.description, option.id, option.groupId, ENTITY_TYPE_LABELS[option.type]]
      .filter(Boolean)
      .join(' ')
  )
}

export function EntityBadge({ type }: { type: AdminEntityType }) {
  return (
    <span className="rounded-full border border-border bg-card px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
      {ENTITY_TYPE_LABELS[type]}
    </span>
  )
}

interface EntitySearchInputProps {
  label: string
  value: string
  options: AdminEntityOption[]
  placeholder: string
  emptyLabel?: string
  onChange: (value: string) => void
}

export default function EntitySearchInput({
  label,
  value,
  options,
  placeholder,
  emptyLabel = 'Sin seleccion',
  onChange,
}: EntitySearchInputProps) {
  const selected = options.find((option) => option.id === value)
  const selectedLabel = selected?.label || value || ''
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const normalizedQuery = normalizeSearch(query)
  const results = useMemo(() => {
    const pool = normalizedQuery
      ? options.filter((option) => entitySearchText(option).includes(normalizedQuery))
      : options
    return pool.slice(0, 8)
  }, [normalizedQuery, options])
  const inputClass =
    'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/35'
  const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted'

  return (
    <div className="relative">
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={open ? query : selectedLabel}
          onFocus={() => {
            setQuery('')
            setOpen(true)
          }}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onBlur={() => window.setTimeout(() => setOpen(false), 140)}
          placeholder={placeholder}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded-2xl border border-border bg-surface px-4 text-xs font-semibold text-text-muted transition-colors hover:text-text"
          >
            Limpiar
          </button>
        ) : null}
      </div>
      {selected ? (
        <p className="mt-2 text-xs text-text-muted">
          {selected.description ? `${selected.description} - ` : ''}
          <span className="font-mono">{selected.id}</span>
        </p>
      ) : value ? (
        <p className="mt-2 text-xs text-text-muted">
          ID sin nombre encontrado: <span className="font-mono">{value}</span>
        </p>
      ) : (
        <p className="mt-2 text-xs text-text-muted">{emptyLabel}</p>
      )}
      {open ? (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-xl">
          {results.length > 0 ? (
            results.map((option) => (
              <button
                key={`${option.type}-${option.groupId || 'root'}-${option.id}`}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option.id)
                  setQuery('')
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-surface"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-text">{option.label}</span>
                  <span className="block truncate text-xs text-text-muted">
                    {option.description || option.id}
                  </span>
                </span>
                <EntityBadge type={option.type} />
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-sm text-text-muted">No hay resultados.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 2: Update EventEditForm.tsx — replace local definitions with imports**

At the top of `components/admin/EventEditForm.tsx`, the file currently defines `ENTITY_TYPE_LABELS`, `normalizeSearch`, `entitySearchText`, `EntityBadge`, and `EntitySearchInput` locally (around lines 36-252).

Replace those local definitions. Add these imports after the existing imports at the top of the file:

```tsx
import EntitySearchInput, {
  ENTITY_TYPE_LABELS,
  EntityBadge,
  normalizeSearch,
  entitySearchText,
} from '@/components/admin/EntitySearchInput'
```

Then delete the local definitions of `ENTITY_TYPE_LABELS` (const at ~line 36), `normalizeSearch` (~line 128), `entitySearchText` (~line 134), `EntityBadge` (~line 143), and `EntitySearchInput` (~line 151). Keep `EntityLookup` — it stays local.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd capoeira-web && npx tsc --noEmit
```

Expected: no errors related to the moved types.

- [ ] **Step 4: Commit**

```bash
git add components/admin/EntitySearchInput.tsx components/admin/EventEditForm.tsx
git commit -m "refactor(admin): extract EntitySearchInput to shared component"
```

---

## Task 2: Settings API route

**Files:**
- Create: `app/api/admin/settings/route.ts`

- [ ] **Step 1: Create `app/api/admin/settings/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { FieldValue } from 'firebase-admin/firestore'

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const doc = await adminDb.collection('adminSettings').doc('global').get()
    const data = doc.data() ?? {}
    return NextResponse.json({
      appVersion: typeof data.appVersion === 'string' ? data.appVersion : '1.0.0',
      statusLabel: typeof data.statusLabel === 'string' ? data.statusLabel : 'Beta cerrada',
      betaRegistrationOpen: data.betaRegistrationOpen === true,
    })
  } catch {
    return NextResponse.json({ error: 'Error al leer configuración' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json() as Record<string, unknown>
    const { appVersion, statusLabel, betaRegistrationOpen } = body

    if (typeof appVersion !== 'string' || typeof statusLabel !== 'string' || typeof betaRegistrationOpen !== 'boolean') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    await adminDb.collection('adminSettings').doc('global').set(
      { appVersion, statusLabel, betaRegistrationOpen, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al guardar configuración' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/settings/route.ts
git commit -m "feat(admin): add settings GET/PATCH API for adminSettings/global"
```

---

## Task 3: SettingsForm component + Settings page update

**Files:**
- Create: `components/admin/SettingsForm.tsx`
- Modify: `app/[locale]/admin/(protected)/settings/page.tsx`

- [ ] **Step 1: Create `components/admin/SettingsForm.tsx`**

```tsx
'use client'

import { useState } from 'react'

interface SettingsValues {
  appVersion: string
  statusLabel: string
  betaRegistrationOpen: boolean
}

interface Props {
  initial: SettingsValues
}

export default function SettingsForm({ initial }: Props) {
  const [form, setForm] = useState<SettingsValues>(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  function set<K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? 'Error al guardar')
      }
      setMessage({ type: 'ok', text: 'Configuración guardada correctamente' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error desconocido' })
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/35'
  const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted'
  const sectionClass = 'rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6'

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
        <h3 className="text-sm font-semibold text-text">Versión y Estado</h3>
        <p className="mt-1 text-xs text-text-muted">
          Controla lo que los usuarios ven en la landing page respecto al estado de la app.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Versión de la App</label>
            <input
              className={inputClass}
              value={form.appVersion}
              onChange={(e) => set('appVersion', e.target.value)}
              placeholder="2.6.0"
            />
          </div>
          <div>
            <label className={labelClass}>Etiqueta de Estado</label>
            <input
              className={inputClass}
              value={form.statusLabel}
              onChange={(e) => set('statusLabel', e.target.value)}
              placeholder="Beta cerrada"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3">
              <div
                role="switch"
                aria-checked={form.betaRegistrationOpen}
                onClick={() => set('betaRegistrationOpen', !form.betaRegistrationOpen)}
                className={`relative h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors ${
                  form.betaRegistrationOpen ? 'bg-accent' : 'bg-border'
                }`}
              >
                <div
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    form.betaRegistrationOpen ? 'left-6' : 'left-1'
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Registro de Beta Abierto</p>
                <p className="text-xs text-text-muted">
                  Permite que nuevos usuarios se inscriban desde la web.
                </p>
              </div>
            </label>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Integraciones</h3>
        <p className="mt-1 text-xs text-text-muted">Servicios externos conectados a la plataforma.</p>
        <div className="mt-5 space-y-3">
          {[
            { name: 'Firebase Admin', status: 'Conectado' },
            { name: 'Google Play Console', status: 'Conectado' },
            { name: 'Postmark Email', status: 'Conectado' },
          ].map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3"
            >
              <p className="text-sm font-semibold text-text">{s.name}</p>
              <span className="text-xs font-bold text-accent">{s.status}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace `app/[locale]/admin/(protected)/settings/page.tsx` entirely**

```tsx
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTopbar from '@/components/admin/AdminTopbar'
import SettingsForm from '@/components/admin/SettingsForm'
import { adminDb } from '@/lib/firebase-admin'

async function getSettings() {
  try {
    const doc = await adminDb.collection('adminSettings').doc('global').get()
    const data = doc.data() ?? {}
    return {
      appVersion: typeof data.appVersion === 'string' ? data.appVersion : '1.0.0',
      statusLabel: typeof data.statusLabel === 'string' ? data.statusLabel : 'Beta cerrada',
      betaRegistrationOpen: data.betaRegistrationOpen === true,
    }
  } catch {
    return { appVersion: '1.0.0', statusLabel: 'Beta cerrada', betaRegistrationOpen: false }
  }
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar
        section="Sistema"
        description="Configuración global de la plataforma."
      />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader
            eyebrow="Configuración"
            title="Ajustes de la Plataforma"
            description="Versión de la app, estado de beta y servicios conectados."
          />
          <SettingsForm initial={settings} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/admin/SettingsForm.tsx "app/[locale]/admin/(protected)/settings/page.tsx"
git commit -m "feat(admin): functional settings page with real Firestore backend"
```

---

## Task 4: GroupEditForm — admin users management, delete, type fix

**Files:**
- Modify: `components/admin/GroupEditForm.tsx`
- Modify: `app/[locale]/admin/(protected)/groups/[id]/page.tsx`

- [ ] **Step 1: Replace `components/admin/GroupEditForm.tsx` entirely**

```tsx
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminEntityOption } from '@/lib/admin-queries'
import type { Group } from '@/lib/types'
import EntitySearchInput from '@/components/admin/EntitySearchInput'

interface AdminGroup extends Group {
  description?: string | null
}

interface Props {
  group: AdminGroup
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
  })
  const [adminUserIds, setAdminUserIds] = useState<string[]>(group.adminUserIds ?? [])
  const [coAdminIds, setCoAdminIds] = useState<string[]>(group.coAdminIds ?? [])
  const [adminToAdd, setAdminToAdd] = useState('')
  const [coAdminToAdd, setCoAdminToAdd] = useState('')
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
              <img src={form.logoUrl} className="h-full w-full object-contain" alt="preview" />
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
```

- [ ] **Step 2: Update `app/[locale]/admin/(protected)/groups/[id]/page.tsx` — add entityOptions**

Add `getAdminEntityOptions` to the imports and fetch it alongside the group data. Then pass it to `GroupEditForm`.

At the top of the file, add to the import from `@/lib/admin-queries`:

```tsx
import { getAdminEntityOptions } from '@/lib/admin-queries'
```

Inside `GroupAdminPage`, update the data fetching:

```tsx
const [data, entityOptions] = await Promise.all([
  getGroupWithNucleos(id, { includeHidden: true }).catch(() => null),
  getAdminEntityOptions().catch(() => []),
])

if (!data) notFound()

const { group, nucleos } = data
```

Then update the `<GroupEditForm>` usage:

```tsx
<GroupEditForm group={group} locale={locale} entityOptions={entityOptions} />
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/admin/GroupEditForm.tsx "app/[locale]/admin/(protected)/groups/[id]/page.tsx"
git commit -m "feat(admin): add admin users management and delete to GroupEditForm"
```

---

## Task 5: NucleoEditForm — educator entity pickers

**Files:**
- Modify: `components/admin/NucleoEditForm.tsx`
- Modify: `app/[locale]/admin/(protected)/nucleos/[groupId]/[id]/page.tsx`

- [ ] **Step 1: Replace `components/admin/NucleoEditForm.tsx` entirely**

```tsx
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminEntityOption, AdminNucleo } from '@/lib/admin-queries'
import EntitySearchInput from '@/components/admin/EntitySearchInput'

interface Props {
  nucleo: AdminNucleo
  locale: string
  entityOptions: AdminEntityOption[]
}

type Schedule = {
  dayOfWeek: number
  startTime: string
  endTime: string
}

const DAY_OPTIONS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miercoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sabado' },
]

export default function NucleoEditForm({ nucleo, locale, entityOptions }: Props) {
  const router = useRouter()
  const userOptions = useMemo(
    () => entityOptions.filter((o) => o.type === 'user'),
    [entityOptions]
  )

  const [form, setForm] = useState({
    name: nucleo.name,
    city: nucleo.city ?? '',
    country: nucleo.country ?? '',
    address: nucleo.address ?? '',
    latitude: nucleo.latitude?.toString() ?? '',
    longitude: nucleo.longitude?.toString() ?? '',
  })
  const [responsibleEducatorId, setResponsibleEducatorId] = useState(
    nucleo.responsibleEducatorId ?? ''
  )
  const [coEducatorIds, setCoEducatorIds] = useState<string[]>(nucleo.coEducatorIds ?? [])
  const [coEducatorToAdd, setCoEducatorToAdd] = useState('')
  const [schedules, setSchedules] = useState<Schedule[]>(nucleo.schedules ?? [])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateSchedule(index: number, key: keyof Schedule, value: string | number) {
    setSchedules((current) =>
      current.map((schedule, scheduleIndex) =>
        scheduleIndex === index ? { ...schedule, [key]: value } : schedule
      )
    )
  }

  function addSchedule() {
    setSchedules((current) => [
      ...current,
      { dayOfWeek: 1, startTime: '19:00', endTime: '20:30' },
    ])
  }

  function removeSchedule(index: number) {
    setSchedules((current) => current.filter((_, scheduleIndex) => scheduleIndex !== index))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/nucleos/${nucleo.groupId}/${nucleo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          city: form.city || null,
          country: form.country || null,
          address: form.address || null,
          latitude: form.latitude ? Number(form.latitude) : null,
          longitude: form.longitude ? Number(form.longitude) : null,
          responsibleEducatorId: responsibleEducatorId || null,
          coEducatorIds,
          schedules,
        }),
      })

      if (!res.ok) {
        throw new Error('Error al guardar el nucleo')
      }

      setMessage({ type: 'ok', text: 'Nucleo actualizado correctamente' })
      router.refresh()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este nucleo permanentemente?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/nucleos/${nucleo.groupId}/${nucleo.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Error al eliminar el nucleo')
      }

      router.push(`/${locale}/admin/nucleos`)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al eliminar',
      })
      setDeleting(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/35'
  const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted'
  const sectionClass = 'rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6'

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
        <h3 className="text-sm font-semibold text-text">Datos del nucleo</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Nombre</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(event) => set('name', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Ciudad</label>
            <input
              className={inputClass}
              value={form.city}
              onChange={(event) => set('city', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Pais</label>
            <input
              className={inputClass}
              value={form.country}
              onChange={(event) => set('country', event.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Direccion</label>
            <input
              className={inputClass}
              value={form.address}
              onChange={(event) => set('address', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Latitud</label>
            <input
              className={inputClass}
              value={form.latitude}
              onChange={(event) => set('latitude', event.target.value)}
              inputMode="decimal"
            />
          </div>
          <div>
            <label className={labelClass}>Longitud</label>
            <input
              className={inputClass}
              value={form.longitude}
              onChange={(event) => set('longitude', event.target.value)}
              inputMode="decimal"
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Educadores</h3>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <EntitySearchInput
              label="Educador responsable"
              value={responsibleEducatorId}
              options={userOptions}
              placeholder="Busca por nombre o apodo"
              emptyLabel="Sin educador responsable asignado."
              onChange={setResponsibleEducatorId}
            />
          </div>
          <div>
            <EntitySearchInput
              label="Agregar co-educador"
              value={coEducatorToAdd}
              options={userOptions}
              placeholder="Busca por nombre o apodo"
              emptyLabel="Selecciona un usuario para agregar."
              onChange={setCoEducatorToAdd}
            />
            <button
              type="button"
              disabled={!coEducatorToAdd || coEducatorIds.includes(coEducatorToAdd)}
              onClick={() => {
                setCoEducatorIds((ids) => [...ids, coEducatorToAdd])
                setCoEducatorToAdd('')
              }}
              className="mt-3 rounded-xl border border-accent/30 px-4 py-2 text-xs font-semibold text-accent transition-opacity disabled:opacity-40"
            >
              Agregar co-educador
            </button>
            <div className="mt-4 space-y-2">
              {coEducatorIds.length > 0 ? (
                coEducatorIds.map((id) => {
                  const option = userOptions.find((o) => o.id === id)
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text">
                          {option?.label || id}
                        </p>
                        <p className="truncate font-mono text-[10px] text-text-muted">{id}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setCoEducatorIds((ids) => ids.filter((x) => x !== id))
                        }
                        className="text-xs font-semibold text-danger"
                      >
                        Quitar
                      </button>
                    </div>
                  )
                })
              ) : (
                <p className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-muted">
                  Sin co-educadores registrados.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text">Horarios</h3>
            <p className="mt-1 text-sm text-text-muted">Edita los bloques visibles en la ficha publica.</p>
          </div>
          <button
            type="button"
            onClick={addSchedule}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:text-text"
          >
            Agregar horario
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {schedules.length > 0 ? (
            schedules.map((schedule, index) => (
              <div
                key={`${schedule.dayOfWeek}-${schedule.startTime}-${index}`}
                className="grid gap-3 rounded-2xl border border-border bg-surface/75 p-4 md:grid-cols-[1fr_140px_140px_auto]"
              >
                <select
                  className={inputClass}
                  value={schedule.dayOfWeek}
                  onChange={(event) =>
                    updateSchedule(index, 'dayOfWeek', Number(event.target.value))
                  }
                >
                  {DAY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  className={inputClass}
                  value={schedule.startTime}
                  onChange={(event) => updateSchedule(index, 'startTime', event.target.value)}
                />
                <input
                  type="time"
                  className={inputClass}
                  value={schedule.endTime}
                  onChange={(event) => updateSchedule(index, 'endTime', event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeSchedule(index)}
                  className="inline-flex items-center justify-center rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/14"
                >
                  Quitar
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface/55 px-4 py-6 text-sm text-text-muted">
              Este nucleo no tiene horarios cargados todavia.
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center justify-center rounded-xl border border-danger/30 bg-danger/10 px-5 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/14 disabled:opacity-50"
        >
          {deleting ? 'Eliminando...' : 'Eliminar nucleo'}
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
```

- [ ] **Step 2: Update `app/[locale]/admin/(protected)/nucleos/[groupId]/[id]/page.tsx` — add entityOptions**

Add import at the top:

```tsx
import { getAdminEntityOptions, getAdminNucleoById } from '@/lib/admin-queries'
```

Update the data fetching inside `AdminNucleoDetailPage`:

```tsx
const [nucleo, entityOptions] = await Promise.all([
  getAdminNucleoById(groupId, id).catch(() => null),
  getAdminEntityOptions().catch(() => []),
])

if (!nucleo) {
  notFound()
}
```

Update the `<NucleoEditForm>` line:

```tsx
<NucleoEditForm nucleo={nucleo} locale={locale} entityOptions={entityOptions} />
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/admin/NucleoEditForm.tsx "app/[locale]/admin/(protected)/nucleos/[groupId]/[id]/page.tsx"
git commit -m "feat(admin): replace raw educator text fields with entity pickers in NucleoEditForm"
```

---

## Task 6: UsersTable with search and filters

**Files:**
- Create: `components/admin/UsersTable.tsx`
- Modify: `app/[locale]/admin/(protected)/users/page.tsx`

- [ ] **Step 1: Create `components/admin/UsersTable.tsx`**

```tsx
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { AdminUser } from '@/lib/admin-queries'
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
                {['Nombre', 'Email', 'Rol', 'País', 'Estado', 'Acciones'].map((h) => (
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
                    colSpan={6}
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
```

- [ ] **Step 2: Replace `app/[locale]/admin/(protected)/users/page.tsx` entirely**

```tsx
import { getAdminUsers } from '@/lib/admin-queries'
import type { AdminUser } from '@/lib/admin-queries'
import AdminTopbar from '@/components/admin/AdminTopbar'
import UsersTable from '@/components/admin/UsersTable'

type Props = { params: Promise<{ locale: string }> }

export default async function UsersPage({ params }: Props) {
  const { locale } = await params
  let users: AdminUser[] = []
  try {
    users = await getAdminUsers(100)
  } catch (error) {
    console.error('[UsersPage] failed to fetch users', error)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section="Usuarios" />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text">Gestión de Usuarios</h1>
          <p className="mt-1 text-sm text-text-muted">
            Administra todas las cuentas de la plataforma.
          </p>
        </div>
        <UsersTable users={users} locale={locale} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/admin/UsersTable.tsx "app/[locale]/admin/(protected)/users/page.tsx"
git commit -m "feat(admin): add search and filter to users list"
```

---

## Task 7: Code quality — remove remaining `any` types in GroupsPage

**Files:**
- Modify: `app/[locale]/admin/(protected)/groups/page.tsx`

- [ ] **Step 1: Replace `any[]` with `Group[]` in `groups/page.tsx`**

Add import at the top of the file:

```tsx
import type { Group } from '@/lib/types'
```

Change the variable declaration from:

```tsx
let groups: any[] = []
```

to:

```tsx
let groups: Group[] = []
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/[locale]/admin/(protected)/groups/page.tsx"
git commit -m "chore(admin): remove any[] type from groups page"
```

---

## Self-Review Checklist

- [x] **Spec §1 EntitySearchInput** — Task 1 extracts and exports the component
- [x] **Spec §2 Settings API** — Task 2 creates the route, Task 3 creates SettingsForm + updates page
- [x] **Spec §3 GroupEditForm** — Task 4 adds adminUserIds, coAdminIds, delete button, removes `any`
- [x] **Spec §4 NucleoEditForm** — Task 5 replaces raw text with EntitySearchInput pickers
- [x] **Spec §5 UsersTable** — Task 6 adds search + filter client component
- [x] **Spec §6 Code quality** — Task 7 cleans up `any[]` in GroupsPage; GroupEditForm and NucleoEditForm typed throughout

All type names are consistent across tasks. `AdminEntityOption` and `AdminUser` come from `@/lib/admin-queries`. `Group` comes from `@/lib/types`. No placeholders present.
