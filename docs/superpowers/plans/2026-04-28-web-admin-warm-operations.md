# Web Admin Warm Operations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Warm Operations visual system to `capoeira-web` admin first, while adding reusable advanced edit controls so the admin can modify the platform data completely.

**Architecture:** Keep the existing Next.js App Router admin structure. Add shared admin design primitives and a reusable advanced JSON editor, then migrate shell, dashboard, tables and edit forms to those primitives. API routes remain the mutation boundary; form updates extend existing PATCH payloads rather than bypassing server validation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4 `@theme`, Firebase Admin SDK, Firebase Auth session cookies.

---

## File Structure

Create:

- `components/admin/AdminButton.tsx` - shared button styles for primary, secondary, danger and ghost actions.
- `components/admin/AdminField.tsx` - shared label, input, textarea and select wrappers.
- `components/admin/AdminStatusChip.tsx` - semantic status chip for paid, pending, blocked, open, danger and neutral states.
- `components/admin/AdminDataTable.tsx` - desktop table wrapper plus mobile card fallback slot.
- `components/admin/AdminAdvancedJsonEditor.tsx` - advanced raw JSON field editor with validation and confirmation.
- `components/admin/adminStyles.ts` - shared className constants for Warm Operations.

Modify:

- `app/globals.css` - reduce admin radii, add Warm Operations admin utility classes and align admin accent to the app green.
- `components/admin/AdminSidebar.tsx` - make sidebar warmer, denser and less decorative.
- `components/admin/AdminTopbar.tsx` - switch from dark topbar to warm sticky operational bar.
- `components/admin/AdminPageHeader.tsx` - compact page headers and metric/action area.
- `components/admin/AdminStatCard.tsx` - compact metric cards with smaller radius.
- `components/admin/AdminSectionCard.tsx` - lower radius and table-friendly content density.
- `components/admin/UserEditForm.tsx` - split into Warm Operations sections, include advanced technical fields.
- `components/admin/GroupEditForm.tsx` - add admin/co-admin, threshold, member count and advanced JSON fields.
- `components/admin/NucleoEditForm.tsx` - add billing/co-educator fields and advanced JSON fields.
- `components/admin/EventEditForm.tsx` - align style and expose advanced event fields.
- `components/admin/BugReportEditForm.tsx` - align style and expose status/internal note workflow.
- `app/[locale]/admin/(protected)/dashboard/page.tsx` - use compact header and metric cards.
- `app/[locale]/admin/(protected)/users/page.tsx` - use `AdminDataTable` and `AdminStatusChip`.
- `app/[locale]/admin/(protected)/groups/page.tsx` - use `AdminDataTable` and richer row actions.
- `app/[locale]/admin/(protected)/nucleos/page.tsx` - use `AdminDataTable`.
- `app/[locale]/admin/(protected)/events/page.tsx` - use `AdminDataTable`.
- `app/[locale]/admin/(protected)/bug-reports/page.tsx` - use `AdminDataTable` and status chips.
- `lib/admin-queries.ts` - expose raw data snapshots for advanced editor where needed.
- `app/api/admin/users/[id]/route.ts` - accept validated advanced fields for users.
- `app/api/admin/groups/[id]/route.ts` - accept validated advanced fields for groups.
- `app/api/admin/nucleos/[groupId]/[id]/route.ts` - accept validated advanced fields for nucleos.
- `app/api/admin/events/[id]/route.ts` - accept validated advanced fields for events.

Verification:

- `npx tsc --noEmit`
- `npm run build`
- Browser desktop: `/es/admin/dashboard`, `/es/admin/users`, `/es/admin/groups`, `/es/admin/nucleos`, `/es/admin/events`, `/es/admin/bug-reports`
- Browser mobile widths for the same pages.

---

## Task 1: Warm Operations Tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Update admin color/radius tokens**

In `app/globals.css`, update the accent and admin-focused radius values:

```css
@theme {
  --color-accent:        #2E7D32;
  --color-accent-ink:    #1B5E20;
  --color-accent-soft:   #2E7D3220;
  --color-green:         #2E7D32;
  --color-green-soft:    #2E7D3218;

  --radius-xs:  6px;
  --radius-sm:  8px;
  --radius-md:  12px;
  --radius-lg:  16px;
  --radius-xl:  20px;
  --radius-2xl: 24px;
}

:root {
  --accent:          #2E7D32;
  --accent-ink:      #1B5E20;
  --accent-soft:     #2E7D3220;
  --green:           #2E7D32;
  --green-soft:      #2E7D3218;
  --admin-panel:     #FFFDF8;
  --admin-panel-soft:#F1E8D9;
  --admin-border:    #E2D9C8;
}
```

- [ ] **Step 2: Add admin utility classes**

Append this block near the existing card/button helpers:

```css
.admin-shell {
  background: var(--bg);
  color: var(--text);
}

.admin-panel {
  background: var(--admin-panel);
  border: 1px solid var(--admin-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.admin-panel-soft {
  background: var(--admin-panel-soft);
  border: 1px solid var(--admin-border);
}

.admin-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.admin-input {
  width: 100%;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 10px 12px;
  font-size: 13px;
  outline: none;
}

.admin-input:focus {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
}

.admin-table td {
  font-size: 13px;
  color: var(--text-secondary);
  padding: 11px 12px;
  border-bottom: 1px solid var(--border-soft);
  vertical-align: middle;
}

.admin-table tr:hover td {
  background: color-mix(in srgb, var(--surface-muted) 54%, transparent);
}
```

- [ ] **Step 3: Verify CSS compiles**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "style: add warm operations admin tokens"
```

---

## Task 2: Shared Admin Primitives

**Files:**
- Create: `components/admin/adminStyles.ts`
- Create: `components/admin/AdminButton.tsx`
- Create: `components/admin/AdminField.tsx`
- Create: `components/admin/AdminStatusChip.tsx`
- Create: `components/admin/AdminDataTable.tsx`

- [ ] **Step 1: Create `components/admin/adminStyles.ts`**

```ts
export const adminStyles = {
  panel: 'admin-panel',
  sectionHeader:
    'flex flex-col gap-2 border-b border-border bg-surface-muted/45 px-4 py-4 sm:flex-row sm:items-start sm:justify-between',
  sectionBody: 'px-4 py-4 sm:px-5',
  label: 'admin-label mb-2 block',
  input: 'admin-input',
  muted: 'text-sm leading-6 text-text-muted',
  rowActions: 'flex flex-wrap items-center gap-2',
} as const
```

- [ ] **Step 2: Create `components/admin/AdminButton.tsx`**

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'border-accent bg-accent text-white hover:opacity-90',
  secondary: 'border-border bg-card text-text hover:border-accent/35',
  ghost: 'border-transparent bg-transparent text-text-secondary hover:bg-surface-muted',
  danger: 'border-danger/30 bg-danger/10 text-danger hover:bg-danger/15',
}

export default function AdminButton({
  variant = 'secondary',
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-sm border px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 3: Create `components/admin/AdminField.tsx`**

```tsx
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

type BaseProps = {
  label: string
  helper?: string
  children: ReactNode
}

function FieldShell({ label, helper, children }: BaseProps) {
  return (
    <label className="block">
      <span className="admin-label mb-2 block">{label}</span>
      {children}
      {helper ? <span className="mt-1 block text-xs leading-5 text-text-muted">{helper}</span> : null}
    </label>
  )
}

export function AdminTextField({
  label,
  helper,
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; helper?: string }) {
  return (
    <FieldShell label={label} helper={helper}>
      <input className={`admin-input ${className}`.trim()} {...props} />
    </FieldShell>
  )
}

export function AdminTextArea({
  label,
  helper,
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; helper?: string }) {
  return (
    <FieldShell label={label} helper={helper}>
      <textarea className={`admin-input min-h-28 resize-y ${className}`.trim()} {...props} />
    </FieldShell>
  )
}

export function AdminSelectField({
  label,
  helper,
  className = '',
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; helper?: string }) {
  return (
    <FieldShell label={label} helper={helper}>
      <select className={`admin-input ${className}`.trim()} {...props}>
        {children}
      </select>
    </FieldShell>
  )
}
```

- [ ] **Step 4: Create `components/admin/AdminStatusChip.tsx`**

```tsx
import type { ReactNode } from 'react'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent'

type Props = {
  tone?: Tone
  children: ReactNode
}

const tones: Record<Tone, string> = {
  neutral: 'border-border bg-surface text-text-secondary',
  success: 'border-green/20 bg-green/10 text-green',
  warning: 'border-warning/25 bg-warning/12 text-warning',
  danger: 'border-danger/25 bg-danger/10 text-danger',
  accent: 'border-accent/25 bg-accent/10 text-accent',
}

export default function AdminStatusChip({ tone = 'neutral', children }: Props) {
  return (
    <span className={`inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}
```

- [ ] **Step 5: Create `components/admin/AdminDataTable.tsx`**

```tsx
import type { ReactNode } from 'react'

type Column = {
  key: string
  label: string
}

type Props = {
  columns: Column[]
  children: ReactNode
  mobileCards?: ReactNode
  empty?: ReactNode
}

export default function AdminDataTable({ columns, children, mobileCards, empty }: Props) {
  return (
    <div className="admin-panel overflow-hidden">
      <div className="hidden overflow-x-auto lg:block">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children || empty}</tbody>
        </table>
      </div>
      <div className="space-y-3 p-3 lg:hidden">
        {mobileCards || empty}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Verify primitives compile**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 7: Commit**

```bash
git add components/admin/adminStyles.ts components/admin/AdminButton.tsx components/admin/AdminField.tsx components/admin/AdminStatusChip.tsx components/admin/AdminDataTable.tsx
git commit -m "feat: add warm operations admin primitives"
```

---

## Task 3: Admin Shell Warm Operations

**Files:**
- Modify: `components/admin/AdminSidebar.tsx`
- Modify: `components/admin/AdminTopbar.tsx`
- Modify: `components/admin/AdminPageHeader.tsx`
- Modify: `components/admin/AdminStatCard.tsx`
- Modify: `components/admin/AdminSectionCard.tsx`
- Modify: `app/[locale]/admin/(protected)/layout.tsx`

- [ ] **Step 1: Update protected layout shell class**

In `app/[locale]/admin/(protected)/layout.tsx`, make the root wrapper use `admin-shell`:

```tsx
return (
  <div className="admin-shell flex min-h-screen">
    <AdminSidebar
      locale={locale}
      openBugReports={openBugReports}
      pendingRequests={pendingRequests}
    />
    <main className="min-w-0 flex-1 pb-20 xl:pb-0">{children}</main>
  </div>
)
```

- [ ] **Step 2: Update `AdminTopbar` to warm sticky bar**

Replace its `return` with:

```tsx
return (
  <header className="sticky top-0 z-30 border-b border-border bg-bg-elev/92 backdrop-blur-lg">
    <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="admin-label text-accent">Admin panel</p>
          <p className="mt-1 truncate text-sm font-bold text-text sm:text-base">{section}</p>
          {description ? (
            <p className="mt-1 text-xs text-text-muted sm:text-sm">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary">
            Sesion activa
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-sm border border-border bg-card px-3 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-danger/30 hover:text-danger"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </div>
  </header>
)
```

- [ ] **Step 3: Update sidebar density**

In `AdminSidebar.tsx`, change the desktop `aside` class to:

```tsx
<aside className="hidden w-[260px] shrink-0 border-r border-border bg-bg-elev xl:block">
```

Change the intro card class to:

```tsx
<div className="mb-6 rounded-md border border-border bg-card px-4 py-4 shadow-sm">
```

Change link class active/inactive branches to:

```tsx
active
  ? 'border-accent/20 bg-accent/10 text-accent'
  : 'border-transparent text-text-secondary hover:border-border hover:bg-surface-muted hover:text-text'
```

Use `rounded-sm` on links instead of `rounded-[20px]`.

- [ ] **Step 4: Update header/stat/section cards**

Apply these class changes:

`AdminPageHeader.tsx` title:

```tsx
<h1 className="mt-2 text-2xl font-extrabold tracking-normal text-text sm:text-3xl">
```

`AdminStatCard.tsx` wrapper:

```tsx
<div className="rounded-md border border-border bg-card px-4 py-4 shadow-sm">
```

`AdminSectionCard.tsx` wrapper:

```tsx
className={`overflow-hidden rounded-md border border-border bg-card shadow-sm ${className}`.trim()}
```

- [ ] **Step 5: Verify**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 6: Commit**

```bash
git add 'app/[locale]/admin/(protected)/layout.tsx' components/admin/AdminSidebar.tsx components/admin/AdminTopbar.tsx components/admin/AdminPageHeader.tsx components/admin/AdminStatCard.tsx components/admin/AdminSectionCard.tsx
git commit -m "style: apply warm operations admin shell"
```

---

## Task 4: Advanced JSON Editor

**Files:**
- Create: `components/admin/AdminAdvancedJsonEditor.tsx`

- [ ] **Step 1: Create advanced editor component**

```tsx
'use client'

import { useMemo, useState } from 'react'
import AdminButton from './AdminButton'

type Props = {
  label: string
  value: Record<string, unknown>
  onChange: (value: Record<string, unknown>) => void
  warning?: string
}

export default function AdminAdvancedJsonEditor({
  label,
  value,
  onChange,
  warning = 'Editar JSON avanzado puede desincronizar campos derivados. Guarda solo cambios que entiendas.',
}: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(() => JSON.stringify(value, null, 2))
  const [error, setError] = useState<string | null>(null)

  const hasChanges = useMemo(() => draft !== JSON.stringify(value, null, 2), [draft, value])

  function applyDraft() {
    setError(null)
    try {
      const parsed = JSON.parse(draft)
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setError('El JSON debe ser un objeto.')
        return
      }
      if (!confirm('Confirmar aplicacion de campos tecnicos avanzados.')) return
      onChange(parsed as Record<string, unknown>)
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON invalido')
    }
  }

  return (
    <section className="rounded-md border border-warning/30 bg-warning/8">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
      >
        <span>
          <span className="block text-sm font-bold text-text">{label}</span>
          <span className="mt-1 block text-xs leading-5 text-text-muted">{warning}</span>
        </span>
        <span className="text-xs font-bold text-warning">{open ? 'Cerrar' : 'Abrir'}</span>
      </button>
      {open ? (
        <div className="border-t border-warning/20 p-4">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            spellCheck={false}
            className="min-h-72 w-full rounded-sm border border-border bg-card px-3 py-3 font-mono text-xs leading-5 text-text outline-none focus:border-warning/50"
          />
          {error ? <p className="mt-2 text-xs font-semibold text-danger">{error}</p> : null}
          <div className="mt-3 flex justify-end">
            <AdminButton type="button" variant="danger" disabled={!hasChanges} onClick={applyDraft}>
              Aplicar JSON avanzado
            </AdminButton>
          </div>
        </div>
      ) : null}
    </section>
  )
}
```

- [ ] **Step 2: Verify**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add components/admin/AdminAdvancedJsonEditor.tsx
git commit -m "feat: add advanced admin JSON editor"
```

---

## Task 5: Raw Admin Data Mapping

**Files:**
- Modify: `lib/admin-queries.ts`

- [ ] **Step 1: Add raw field to admin interfaces**

Add `raw: Record<string, unknown>` to these interfaces:

```ts
export interface AdminUser {
  uid: string
  raw: Record<string, unknown>
  email: string | undefined
  disabled: boolean
  name: string
  surname: string
  nickname?: string | null
  role: 'student' | 'educator' | 'admin'
  groupId?: string | null
  nucleoIds?: string[]
  graduationLevelId?: string | null
  bio?: string | null
  country?: string | null
  avatarUrl?: string | null
  socialLinks?: {
    instagram?: string | null
    facebook?: string | null
    whatsapp?: string | null
    youtube?: string | null
    tiktok?: string | null
    website?: string | null
  }
  setupComplete?: boolean
  adminPanelAccess?: boolean
  createdAt?: string | null
}

export interface AdminNucleo {
  id: string
  raw: Record<string, unknown>
  groupId: string
  groupName: string
  name: string
  country?: string | null
  city?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  responsibleEducatorId?: string | null
  coEducatorIds?: string[]
  schedules?: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
}
```

Add `raw: Record<string, unknown>` to `AdminEvent`, `BugReport`, `AdminGraduationLevelRow`, `AdminAttendanceSessionRow`, and `AdminClassPaymentRow` using the same pattern.

- [ ] **Step 2: Return raw data in mappers**

Update `mapAdminNucleo` to include `raw`:

```ts
function mapAdminNucleo(
  groupId: string,
  groupName: string,
  nucleoId: string,
  data: FirestoreRecord
): AdminNucleo {
  return {
    id: nucleoId,
    raw: data,
    groupId,
    groupName,
    name: asString(data.name) ?? '',
    country: asString(data.country),
    city: asString(data.city),
    address: asString(data.address),
    latitude: asNumber(data.latitude),
    longitude: asNumber(data.longitude),
    responsibleEducatorId: asString(data.responsibleEducatorId),
    coEducatorIds: asStringArray(data.coEducatorIds),
    schedules: mapSchedules(data.schedules),
  }
}
```

For every object returned from Firestore in `getAdminUsers`, `getAdminUserById`, `getAdminGroups`, `getAdminGroupById`, `getAdminEvents`, `getAdminEventById`, `getBugReports`, `getBugReportById`, `getAdminGraduationRows`, `getAdminAttendanceRows`, and `getAdminClassPaymentRows`, include:

```ts
raw: data,
```

- [ ] **Step 3: Verify**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0. If TypeScript reports a missing `raw` property, add `raw: data` to that mapper.

- [ ] **Step 4: Commit**

```bash
git add lib/admin-queries.ts
git commit -m "feat: expose raw admin records for advanced editing"
```

---

## Task 6: User Edit Form Full Control

**Files:**
- Modify: `components/admin/UserEditForm.tsx`
- Modify: `app/api/admin/users/[id]/route.ts`

- [ ] **Step 1: Replace local style constants with primitives**

Import:

```tsx
import AdminAdvancedJsonEditor from './AdminAdvancedJsonEditor'
import AdminButton from './AdminButton'
import { AdminSelectField, AdminTextArea, AdminTextField } from './AdminField'
```

Remove `inputClass` and `labelClass`.

- [ ] **Step 2: Add advanced state**

Inside the component after `form` state:

```tsx
const [advanced, setAdvanced] = useState<Record<string, unknown>>(user.raw ?? {})
```

- [ ] **Step 3: Extend save payload**

In `handleSave`, add:

```ts
advanced,
```

to the `body` object:

```ts
const body = {
  name: form.name,
  surname: form.surname,
  nickname: form.nickname || null,
  nameLower: form.name.toLowerCase(),
  surnameLower: form.surname.toLowerCase(),
  nicknameLower: form.nickname?.toLowerCase() || null,
  email: form.email,
  role: form.role,
  groupId: form.groupId || null,
  bio: form.bio || null,
  country: form.country || null,
  disabled: form.disabled,
  adminPanelAccess: form.adminPanelAccess,
  socialLinks: {
    instagram: form.instagram || null,
    facebook: form.facebook || null,
    whatsapp: form.whatsapp || null,
    website: form.website || null,
    youtube: form.youtube || null,
    tiktok: form.tiktok || null,
  },
  advanced,
}
```

- [ ] **Step 4: Add advanced section before save buttons**

```tsx
<AdminAdvancedJsonEditor
  label="Campos tecnicos del usuario"
  value={advanced}
  onChange={setAdvanced}
/>
```

- [ ] **Step 5: Update API route advanced merge**

In `app/api/admin/users/[id]/route.ts`, read `advanced` from request body:

```ts
const { advanced, disabled, email, ...profileUpdates } = await request.json()
```

Before writing `users/{id}`, build:

```ts
const safeAdvanced =
  advanced && typeof advanced === 'object' && !Array.isArray(advanced)
    ? (advanced as Record<string, unknown>)
    : {}

const userUpdate = {
  ...safeAdvanced,
  ...profileUpdates,
  updatedAt: FieldValue.serverTimestamp(),
}
```

Use `userUpdate` for the private user document. Keep the public mirror restricted to public-safe profile fields.

- [ ] **Step 6: Verify**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 7: Commit**

```bash
git add components/admin/UserEditForm.tsx app/api/admin/users/[id]/route.ts
git commit -m "feat: add full-control advanced user editing"
```

---

## Task 7: Group, Nucleo and Event Full Control

**Files:**
- Modify: `components/admin/GroupEditForm.tsx`
- Modify: `components/admin/NucleoEditForm.tsx`
- Modify: `components/admin/EventEditForm.tsx`
- Modify: `app/api/admin/groups/[id]/route.ts`
- Modify: `app/api/admin/nucleos/[groupId]/[id]/route.ts`
- Modify: `app/api/admin/events/[id]/route.ts`

- [ ] **Step 1: Add advanced editor to `GroupEditForm`**

Import:

```tsx
import AdminAdvancedJsonEditor from './AdminAdvancedJsonEditor'
import AdminButton from './AdminButton'
import { AdminTextArea, AdminTextField } from './AdminField'
```

Add state:

```tsx
const [advanced, setAdvanced] = useState<Record<string, unknown>>(group.raw ?? {})
```

Add fields to `form`:

```ts
adminUserIds: group.adminUserIds?.join(', ') || '',
coAdminIds: group.coAdminIds?.join(', ') || '',
educatorThresholdOrder: group.educatorThresholdOrder?.toString() ?? '0',
memberCount: group.memberCount?.toString() ?? '0',
```

Add to save body:

```ts
adminUserIds: form.adminUserIds.split(',').map((s: string) => s.trim()).filter(Boolean),
coAdminIds: form.coAdminIds.split(',').map((s: string) => s.trim()).filter(Boolean),
educatorThresholdOrder: Number(form.educatorThresholdOrder || 0),
memberCount: Number(form.memberCount || 0),
advanced,
```

Render `AdminAdvancedJsonEditor` before save actions.

- [ ] **Step 2: Add billing and advanced editor to `NucleoEditForm`**

Add fields to `form`:

```ts
classesAreFree: nucleo.raw?.classesAreFree === true,
billingMode: typeof nucleo.raw?.billingMode === 'string' ? nucleo.raw.billingMode : 'free',
monthlyFee: typeof nucleo.raw?.monthlyFee === 'number' ? String(nucleo.raw.monthlyFee) : '',
classFee: typeof nucleo.raw?.classFee === 'number' ? String(nucleo.raw.classFee) : '',
classesPerPackage: typeof nucleo.raw?.classesPerPackage === 'number' ? String(nucleo.raw.classesPerPackage) : '',
currency: typeof nucleo.raw?.currency === 'string' ? nucleo.raw.currency : '',
paymentDueDay: typeof nucleo.raw?.paymentDueDay === 'number' ? String(nucleo.raw.paymentDueDay) : '',
```

Add advanced state:

```tsx
const [advanced, setAdvanced] = useState<Record<string, unknown>>(nucleo.raw ?? {})
```

Add to save body:

```ts
classesAreFree: form.classesAreFree,
billingMode: form.billingMode,
monthlyFee: form.monthlyFee ? Number(form.monthlyFee) : null,
classFee: form.classFee ? Number(form.classFee) : null,
classesPerPackage: form.classesPerPackage ? Number(form.classesPerPackage) : null,
currency: form.currency || null,
paymentDueDay: form.paymentDueDay ? Number(form.paymentDueDay) : null,
advanced,
```

Render billing fields and the advanced editor.

- [ ] **Step 3: Add advanced editor to `EventEditForm`**

Add state:

```tsx
const [advanced, setAdvanced] = useState<Record<string, unknown>>(event.raw ?? {})
```

Add to save body:

```ts
advanced,
```

Render:

```tsx
<AdminAdvancedJsonEditor
  label="Campos tecnicos del evento"
  value={advanced}
  onChange={setAdvanced}
/>
```

- [ ] **Step 4: Merge advanced payload in group/nucleo/event API routes**

In each PATCH route, parse:

```ts
const { advanced, ...updates } = await request.json()
const safeAdvanced =
  advanced && typeof advanced === 'object' && !Array.isArray(advanced)
    ? (advanced as Record<string, unknown>)
    : {}
```

Then update Firestore with:

```ts
await ref.update({
  ...safeAdvanced,
  ...updates,
  updatedAt: FieldValue.serverTimestamp(),
})
```

Use the existing route-specific document reference name. Keep existing delete behavior unchanged.

- [ ] **Step 5: Verify**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 6: Commit**

```bash
git add components/admin/GroupEditForm.tsx components/admin/NucleoEditForm.tsx components/admin/EventEditForm.tsx app/api/admin/groups/[id]/route.ts app/api/admin/nucleos/[groupId]/[id]/route.ts app/api/admin/events/[id]/route.ts
git commit -m "feat: add full-control editing for admin records"
```

---

## Task 8: Admin Lists as Warm Operations Tables

**Files:**
- Modify: `app/[locale]/admin/(protected)/users/page.tsx`
- Modify: `app/[locale]/admin/(protected)/groups/page.tsx`
- Modify: `app/[locale]/admin/(protected)/nucleos/page.tsx`
- Modify: `app/[locale]/admin/(protected)/events/page.tsx`
- Modify: `app/[locale]/admin/(protected)/bug-reports/page.tsx`

- [ ] **Step 1: Migrate users list to `AdminDataTable`**

Use this table shape:

```tsx
<AdminDataTable
  columns={[
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rol' },
    { key: 'group', label: 'Grupo' },
    { key: 'status', label: 'Estado' },
    { key: 'actions', label: '' },
  ]}
>
  {users.map((user) => (
    <tr key={user.uid}>
      <td className="font-semibold text-text">{user.name} {user.surname}</td>
      <td>{user.email ?? '-'}</td>
      <td>{user.role}</td>
      <td>{user.groupId ?? '-'}</td>
      <td>
        <AdminStatusChip tone={user.disabled ? 'danger' : 'success'}>
          {user.disabled ? 'Bloqueado' : 'Activo'}
        </AdminStatusChip>
      </td>
      <td>
        <Link className="text-sm font-semibold text-accent" href={`/${locale}/admin/users/${user.uid}`}>
          Editar
        </Link>
      </td>
    </tr>
  ))}
</AdminDataTable>
```

- [ ] **Step 2: Migrate groups/nucleos/events/bug reports**

Use the same `AdminDataTable` pattern:

Groups columns:

```ts
[
  { key: 'name', label: 'Grupo' },
  { key: 'system', label: 'Graduacion' },
  { key: 'members', label: 'Miembros' },
  { key: 'countries', label: 'Paises' },
  { key: 'actions', label: '' },
]
```

Nucleos columns:

```ts
[
  { key: 'name', label: 'Nucleo' },
  { key: 'group', label: 'Grupo' },
  { key: 'location', label: 'Ubicacion' },
  { key: 'educator', label: 'Responsable' },
  { key: 'actions', label: '' },
]
```

Events columns:

```ts
[
  { key: 'title', label: 'Evento' },
  { key: 'date', label: 'Fecha' },
  { key: 'category', label: 'Categoria' },
  { key: 'group', label: 'Grupo' },
  { key: 'actions', label: '' },
]
```

Bug reports columns:

```ts
[
  { key: 'report', label: 'Reporte' },
  { key: 'user', label: 'Usuario' },
  { key: 'platform', label: 'Plataforma' },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: '' },
]
```

Use `AdminStatusChip` for status-like cells.

- [ ] **Step 3: Verify**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 4: Commit**

```bash
git add 'app/[locale]/admin/(protected)/users/page.tsx' 'app/[locale]/admin/(protected)/groups/page.tsx' 'app/[locale]/admin/(protected)/nucleos/page.tsx' 'app/[locale]/admin/(protected)/events/page.tsx' 'app/[locale]/admin/(protected)/bug-reports/page.tsx'
git commit -m "style: migrate admin lists to warm operations tables"
```

---

## Task 9: Browser Verification

**Files:**
- No code changes unless verification finds defects.

- [ ] **Step 1: Run production checks**

Run:

```bash
npx tsc --noEmit
npm run build
```

Expected: both commands exit 0.

- [ ] **Step 2: Start dev server**

Run:

```bash
npm run dev
```

Expected: Next dev server starts on `http://localhost:3000` or another free port.

- [ ] **Step 3: Verify desktop pages**

Open these pages at desktop width:

```text
/es/admin/dashboard
/es/admin/users
/es/admin/groups
/es/admin/nucleos
/es/admin/events
/es/admin/bug-reports
```

Expected:

- Warm light admin surfaces.
- Sidebar remains fixed and readable.
- Topbar is warm, not dark.
- Tables are compact and scannable.
- Status chips are visible and not decorative blocks.
- Edit links remain reachable.

- [ ] **Step 4: Verify mobile pages**

At mobile width, verify:

- Bottom/mobile nav remains usable.
- Admin tables do not force unreadable horizontal-only workflows.
- Primary edit actions remain reachable.

- [ ] **Step 5: Verify full-control edit forms**

Open one user, one group, one nucleo and one event edit page. Expected:

- Main form fields render.
- Advanced JSON section opens.
- Invalid JSON shows an error.
- Valid JSON asks for confirmation before applying.
- Save button remains visible after the advanced section.

- [ ] **Step 6: Commit verification fixes**

If defects were fixed:

```bash
git add <changed-files>
git commit -m "fix: polish warm operations admin verification issues"
```

If no defects were found, no commit is needed.

---

## Self-Review

Spec coverage:

- Warm app-aligned palette: Task 1.
- Admin shell and layout: Task 3.
- Shared primitives: Task 2.
- Dense tables and mobile fallback: Task 8.
- Full administrative modification: Tasks 4, 5, 6, and 7.
- Validation and confirmation for technical edits: Task 4.
- Browser and build verification: Task 9.

Placeholder scan:

- No `TBD`, `TODO`, or open-ended implementation placeholders are used.
- Each task has exact file paths, concrete code snippets, commands and expected outcomes.

Type consistency:

- `raw: Record<string, unknown>` is introduced before the forms consume `record.raw`.
- `advanced` payload is used consistently by forms and PATCH routes.
- Shared components use stable prop names: `variant`, `label`, `helper`, `tone`, `columns`.
