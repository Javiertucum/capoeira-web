# Admin Foundation Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared admin shell for the expanded capoeira admin panel: grouped navigation, reusable page primitives, an upgraded dashboard, and placeholder entry pages for the newly approved admin sections.

**Architecture:** Keep the existing App Router structure under `app/[locale]/admin/(protected)` and continue using server components for pages plus client components only where interaction is required. Centralize shell data in `lib/admin-queries.ts`, create small reusable admin UI primitives in `components/admin/`, and let new pages reuse the same page header/stat/empty-state building blocks.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Firebase Admin SDK / Firestore.

---

### Task 1: Expand Admin Shell Data

**Files:**
- Modify: `lib/admin-queries.ts`
- Test: `npm run build`

- [ ] Add a dedicated shell summary type for sidebar badges and the top-level dashboard counts:
  - `pendingRequests`
  - `openBugReports`
  - `totalUsers`
  - `totalGroups`
  - `totalNucleos`
  - `newUsersThisWeek`
- [ ] Keep `getDashboardStats()` as the shell summary entry point so existing pages do not break while the new shell lands.
- [ ] Fetch `pendingRequests` defensively from the request collections that exist in Firestore and fall back to `0` if a collection is absent.
- [ ] Run `npm run build` and confirm the project still compiles.

### Task 2: Build Shared Admin Shell Components

**Files:**
- Create: `components/admin/AdminPageHeader.tsx`
- Create: `components/admin/AdminStatCard.tsx`
- Create: `components/admin/AdminSectionCard.tsx`
- Create: `components/admin/AdminEmptyState.tsx`
- Modify: `components/admin/AdminSidebar.tsx`
- Modify: `components/admin/AdminTopbar.tsx`
- Modify: `app/[locale]/admin/(protected)/layout.tsx`
- Test: `npm run build`

- [ ] Create `AdminPageHeader` for title, eyebrow, description, and optional action slot.
- [ ] Create `AdminStatCard` for compact KPI tiles used across dashboard and new module pages.
- [ ] Create `AdminSectionCard` for boxed content regions with optional header actions.
- [ ] Create `AdminEmptyState` for placeholder pages so empty screens look deliberate instead of unfinished.
- [ ] Redesign `AdminSidebar` to group routes into:
  - `General`
  - `Personas`
  - `Capoeira`
  - `Contenido`
  - `Sistema`
  - `Soporte`
- [ ] Add links for:
  - `Dashboard`
  - `Usuarios`
  - `Grupos`
  - `Nucleos`
  - `Eventos`
  - `Solicitudes`
  - `Suscripciones`
  - `Graduaciones`
  - `Asistencia`
  - `Pagos de clases`
  - `Contenido destacado`
  - `Moderacion`
  - `Mapa global`
  - `Finanzas`
  - `Notificaciones`
  - `Exportar datos`
  - `Bug reports`
- [ ] Show `pendingRequests` and `openBugReports` badges in the sidebar when the values are greater than `0`.
- [ ] Update `AdminTopbar` to show the current section with a short helper line and keep logout behavior unchanged.
- [ ] Update the protected admin layout to pass the new shell summary down to the sidebar.
- [ ] Run `npm run build` and fix any server/client boundary issues.

### Task 3: Refresh Dashboard Around Shared Primitives

**Files:**
- Modify: `app/[locale]/admin/(protected)/dashboard/page.tsx`
- Test: `npm run build`

- [ ] Replace the handwritten dashboard heading and cards with `AdminPageHeader`, `AdminStatCard`, and `AdminSectionCard`.
- [ ] Preserve the existing data sources:
  - `getDashboardStats()`
  - `getAdminUsers(5)`
  - `getBugReports()`
  - `getAdminEvents(5)`
- [ ] Keep the recent users, recent bug reports, and recent events blocks, but make them visually consistent with the new shell.
- [ ] Make sure empty data states use readable text without mojibake or broken characters.
- [ ] Run `npm run build`.

### Task 4: Add Initial Pages For New Admin Sections

**Files:**
- Create: `app/[locale]/admin/(protected)/requests/page.tsx`
- Create: `app/[locale]/admin/(protected)/subscriptions/page.tsx`
- Create: `app/[locale]/admin/(protected)/graduations/page.tsx`
- Create: `app/[locale]/admin/(protected)/attendance/page.tsx`
- Create: `app/[locale]/admin/(protected)/class-payments/page.tsx`
- Create: `app/[locale]/admin/(protected)/featured-content/page.tsx`
- Create: `app/[locale]/admin/(protected)/moderation/page.tsx`
- Create: `app/[locale]/admin/(protected)/global-map/page.tsx`
- Create: `app/[locale]/admin/(protected)/finances/page.tsx`
- Create: `app/[locale]/admin/(protected)/notifications/page.tsx`
- Create: `app/[locale]/admin/(protected)/exports/page.tsx`
- Test: `npm run build`

- [ ] Create each page as a server component with:
  - locale-aware routing params
  - `AdminTopbar`
  - `AdminPageHeader`
  - one or more `AdminStatCard` placeholders where the module needs quick metrics
  - `AdminEmptyState` copy describing what the future module will manage
- [ ] Keep the copy specific to the approved brief so the structure already matches the intended admin IA.
- [ ] Ensure each page renders under the new sidebar route without runtime errors.
- [ ] Run `npm run build`.

### Task 5: Verification

**Files:**
- Review only

- [ ] Run `git diff --stat` to confirm only the shell-foundation files changed.
- [ ] Run `npm run build` one last time.
- [ ] Capture any remaining gaps for the next subsystem plans:
  - moderation workflows
  - exports/API routes
  - financial integrations
  - notifications sender
