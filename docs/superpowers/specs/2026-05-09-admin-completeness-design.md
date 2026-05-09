# Admin Completeness & Code Quality — Design Spec

**Date:** 2026-05-09  
**Status:** Approved  
**Scope:** Admin panel edit completeness, UI polish, code quality

---

## Context

The capoeira-web admin panel already has functional CRUD for Users, Groups, Nucleos, Events, Bug Reports, and Graduations. This spec closes the remaining gaps:

1. Settings page is a static mock with no real functionality
2. GroupEditForm is missing adminUserIds / coAdminIds management
3. NucleoEditForm uses raw text fields for educator IDs instead of entity search
4. Users list has no search or filter capability
5. Several files use `any` types and inconsistent styling

---

## Section 1 — Shared EntitySearchInput Component

**File:** `components/admin/EntitySearchInput.tsx`

Extract the locally-defined `EntitySearchInput` and `EntityBadge` components from `components/admin/EventEditForm.tsx` into a standalone shared module.

**Exports:**
- `EntitySearchInput` — searchable single-entity picker with dropdown, clear button, and selected entity description
- `EntityBadge` — type chip (user / group / nucleo / event)
- `normalizeSearch(value: string): string` — accent-stripped lowercase for matching
- `entitySearchText(option: AdminEntityOption): string` — full searchable text for an entity option

**Behavior (unchanged from current):**
- Shows up to 8 results filtered by the search query
- On blur closes after 140ms (allows click to register)
- Displays selected entity label + description below the input
- Shows a "Limpiar" button when a value is selected

**EventEditForm change:** Replace the local definitions with imports from the new shared module. Zero behavior change.

---

## Section 2 — Settings Page with Real API

### API Route: `/api/admin/settings`

**File:** `app/api/admin/settings/route.ts`

- `GET` — reads `adminSettings/global` from Firestore, returns `{ appVersion, statusLabel, betaRegistrationOpen }`
- `PATCH` — validates and writes those same fields to Firestore with `updatedAt` server timestamp
- Both endpoints protected by `requireAdmin`

**Firestore doc:** `adminSettings/global`  
Fields: `appVersion: string`, `statusLabel: string`, `betaRegistrationOpen: boolean`, `updatedAt: Timestamp`

### Settings Page

**File:** `app/[locale]/admin/(protected)/settings/page.tsx`

Convert to an async Server Component that fetches current settings and passes them as props to a Client Component `SettingsForm`.

**`SettingsForm` client component** (`components/admin/SettingsForm.tsx`):
- Controlled state for all three fields
- Toggle switch for `betaRegistrationOpen` (styled, functional)
- Save button calls `PATCH /api/admin/settings`
- Success/error message feedback

**Remove:** The static "Funciones de la Plataforma" table (marketing content, not DB-driven). The integrations section stays as a read-only status display.

---

## Section 3 — GroupEditForm: Admin Users Management

**File:** `components/admin/GroupEditForm.tsx`

### New fields added to the form:

**`adminUserIds` (main admins):**
- Uses `EntitySearchInput` with user-only options
- Shows current admins as a removable list (same pattern as EventEditForm's co-organizers)
- Add button enabled only when a user is selected and not already in the list

**`coAdminIds` (co-admins):**
- Same pattern as above

**Delete button:**
- Added to the group edit page (currently missing — only exists on the list)
- Calls `DELETE /api/admin/groups/${group.id}` and redirects to `/admin/groups`

### Page change (`app/[locale]/admin/(protected)/groups/[id]/page.tsx`):
- Pass `entityOptions` (from `getAdminEntityOptions()`) down to `GroupEditForm`

### Type fix:
- `group` prop typed as a concrete interface instead of `any`

---

## Section 4 — NucleoEditForm: Entity Pickers for Educators

**File:** `components/admin/NucleoEditForm.tsx`

### Replace raw text fields:

**`responsibleEducatorId`:**  
Replace `<input type="text" placeholder="uid del educador" />` with `EntitySearchInput` filtered to `type === 'user'` options. Shows the selected user's name and description below.

**`coEducatorIds`:**  
Replace comma-separated text input with a multi-select list pattern:
- `EntitySearchInput` for searching and selecting a user
- "Agregar" button adds selected user to the list
- Each co-educator shown as a row with "Quitar" button
- Internal state: `string[]` of UIDs (same as `coOrganizerIds` in EventEditForm)

### Page change (`app/[locale]/admin/(protected)/nucleos/[groupId]/[id]/page.tsx`):
- Fetch and pass `entityOptions` from `getAdminEntityOptions()` to `NucleoEditForm`

---

## Section 5 — Users List: Search & Filters

### New client component: `components/admin/UsersTable.tsx`

The server page (`app/[locale]/admin/(protected)/users/page.tsx`) stays a Server Component. The table is extracted to `UsersTable` as a Client Component.

**Filter state (local, no extra Firestore queries):**
- `query: string` — searches name, surname, nickname, email (normalized, accent-stripped)
- `roleFilter: 'all' | 'student' | 'educator' | 'admin'`
- `statusFilter: 'all' | 'active' | 'blocked'`

**UI:**
- Search input + two select dropdowns in a filter bar above the table
- Shows count of filtered vs total users
- Existing table structure preserved, just filtered

---

## Section 6 — Code Quality

**Type fixes:**
- `GroupEditForm.tsx`: `group: any` → concrete `AdminGroup` interface (extracted from `getGroupWithNucleos` return type or defined inline)
- `app/[locale]/admin/(protected)/users/page.tsx`: `any[]` → `AdminUser[]`
- `app/[locale]/admin/(protected)/groups/page.tsx`: `any[]` → `Group[]` (from lib/types)

**Style consistency:**
- `GroupEditForm.tsx` uses slightly different `inputClass` / `labelClass` than NucleoEditForm and EventEditForm
- Align to the pattern used in NucleoEditForm/EventEditForm: `rounded-2xl` inputs, `tracking-[0.18em]` labels

---

## Implementation Order

1. Extract `EntitySearchInput` to shared component (unblocks everything else)
2. Settings API route + SettingsForm component + page update
3. GroupEditForm: admin users + type fix + delete button + page update
4. NucleoEditForm: educator pickers + page update
5. UsersTable client component with filters
6. Code quality pass (type fixes, style consistency)

---

## Out of Scope

- Attendance and Class Payments edit (data originates from mobile app, read-only is correct)
- "Funciones de la Plataforma" as CMS (marketing content managed in code)
- Firestore pagination (client-side filter on 100 users is sufficient for current scale)
- Landing page changes
