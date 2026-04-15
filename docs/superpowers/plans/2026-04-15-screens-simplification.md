# Screens Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make 4 screens (educators list, educator profile, group profile, nucleo detail) visually consistent with the simplified home: no editorial text, direct data, fix nested `<main>` bug, remove decorative fixed gradients.

**Architecture:** Pure UI changes — remove/reorder JSX, no data or logic changes. Each task is one file. Tasks are independent and can be done in any order.

**Tech Stack:** Next.js App Router (server + client components), Tailwind CSS, TypeScript

---

### Task 1: Simplify educators list header

**Files:**
- Modify: `app/[locale]/educators/EducatorsListShell.tsx`

#### What changes

Remove the big card-style header (`<section className="relative overflow-hidden rounded-[30px]...">`) with its decorative radial gradients, eyebrow text, intro paragraph, and the separate count panel on the right.

Replace with a lean header: h1 → search form → inline count.

Also trim `COPY` (remove unused `eyebrow`, `intro`, `resultsLabel` keys).

- [ ] **Step 1: Update the COPY object** — remove `eyebrow`, `intro`, `resultsLabel` from all three locales

Replace lines 16–56 with:

```typescript
const COPY = {
  es: {
    heading: 'Educadores',
    searchLabel: 'Busca por nombre, país o grupo',
    searchButton: 'Buscar',
    summaryLabel: 'educadores',
    emptyTitle: 'Sin resultados para esta búsqueda',
    emptyBody: 'Prueba otro nombre, país o grupo para ampliar la exploración.',
    unavailableTitle: 'Directorio no disponible por ahora',
    unavailableBody: 'El directorio de educadores estará disponible en breve.',
  },
  pt: {
    heading: 'Educadores',
    searchLabel: 'Busque por nome, país ou grupo',
    searchButton: 'Buscar',
    summaryLabel: 'educadores',
    emptyTitle: 'Nenhum resultado para esta busca',
    emptyBody: 'Tente outro nome, país ou grupo para ampliar a exploração.',
    unavailableTitle: 'Diretório indisponível no momento',
    unavailableBody: 'O diretório de educadores estará disponível em breve.',
  },
  en: {
    heading: 'Educators',
    searchLabel: 'Search by name, country, or group',
    searchButton: 'Search',
    summaryLabel: 'educators',
    emptyTitle: 'No results for this search',
    emptyBody: 'Try another name, country, or group to widen the search.',
    unavailableTitle: 'Directory temporarily unavailable',
    unavailableBody: 'The educator directory will be available shortly.',
  },
} as const
```

- [ ] **Step 2: Replace the JSX return** — swap the entire `return (...)` with the new layout

```tsx
  return (
    <div className="px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-20">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[clamp(28px,4vw,48px)] font-semibold leading-[0.96] tracking-[-0.05em] text-text">
            {copy.heading}
          </h1>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-4 rounded-[24px] border border-border bg-surface/80 px-4 py-4 transition-all focus-within:border-accent/35 focus-within:ring-2 focus-within:ring-accent/70 focus-within:ring-offset-2 focus-within:ring-offset-bg">
              <span
                aria-hidden="true"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-[16px] border border-accent/20 bg-[rgba(121,207,114,0.12)] text-accent"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                  {copy.searchLabel}
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="..."
                  aria-label={copy.searchLabel}
                  className="mt-1 block w-full min-w-0 bg-transparent text-base text-text outline-none placeholder:text-text-muted"
                />
              </span>
            </label>
            <button
              type="submit"
              className="inline-flex h-[68px] cursor-pointer items-center justify-center rounded-[24px] bg-accent px-6 text-sm font-semibold uppercase tracking-[0.18em] text-black transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {isPending ? `${copy.searchButton}...` : copy.searchButton}
            </button>
          </form>

          <p className="mt-3 text-sm text-text-secondary">
            <strong className="font-semibold text-text">{initialEducators.length.toLocaleString()}</strong>{' '}
            {copy.summaryLabel}
          </p>
        </div>

        {/* Results grid */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-4 px-1">
            <p className="text-sm text-text-secondary">
              {results.length} {copy.summaryLabel}
            </p>
          </div>

          {dataUnavailable ? (
            <div className="rounded-[22px] border border-dashed border-border bg-surface-muted/80 px-5 py-8 text-center">
              <h2 className="text-lg font-semibold text-text">{copy.unavailableTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{copy.unavailableBody}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-border bg-surface-muted/80 px-5 py-8 text-center">
              <h2 className="text-lg font-semibold text-text">{copy.emptyTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{copy.emptyBody}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((educator, index) => (
                <div key={educator.uid}>
                  {index > 0 && index % 8 === 0 && (
                    <div className="col-span-full">
                      <AdInFeed />
                    </div>
                  )}
                  <EducatorCard educator={educator} locale={locale} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
```

- [ ] **Step 3: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | grep EducatorsListShell
```

Expected: no output (no errors in this file).

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/educators/EducatorsListShell.tsx
git commit -m "feat: simplify educators list header — remove editorial card, add lean h1+search+count"
```

---

### Task 2: Simplify educator profile page

**Files:**
- Modify: `app/[locale]/educator/[id]/page.tsx`

#### What changes

1. Fix nested `<main>` bug: change `<main className="relative mx-auto ...">` → `<div ...>`
2. Remove the fixed radial gradient `<div>` (decorative background)
3. Remove the big primary CTA button (WhatsApp / Instagram full-width)
4. Move social links section **before** nucleos in the right column, and remove its `<h2>` heading
5. Remove the now-unused variables: `CONTACT_LABELS`, `contactLabel`, `primaryContactHref`, `primaryContactLabel`

- [ ] **Step 1: Remove fixed gradient + change `<main>` → `<div>`**

Find this block (lines 127–132):

```tsx
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_top,rgba(102,187,106,0.12),transparent_70%)] pointer-events-none"
      />

      <main className="relative mx-auto max-w-[900px] px-5 py-10 sm:px-8 lg:px-12">
```

Replace with:

```tsx
      <div className="relative mx-auto max-w-[900px] px-5 py-10 sm:px-8 lg:px-12">
```

Also find the closing `</main>` near the end of the component (line 397) and change it to `</div>`.

- [ ] **Step 2: Remove unused CTA variables** — remove these 4 lines from the component body (around lines 100–109):

```typescript
  const CONTACT_LABELS: Record<string, string> = { es: 'Contactar', pt: 'Contatar', en: 'Contact' }
  const contactLabel = CONTACT_LABELS[locale] ?? CONTACT_LABELS.en
  const primaryContactHref = sl.whatsapp
    ? `https://wa.me/${sl.whatsapp.replace(/\D/g, '')}`
    : sl.instagram
      ? `https://instagram.com/${sl.instagram.replace('@', '')}`
      : sl.website
        ? (sl.website.startsWith('http') ? sl.website : `https://${sl.website}`)
        : null
  const primaryContactLabel = sl.whatsapp ? 'WhatsApp' : sl.instagram ? 'Instagram' : t('website')
```

- [ ] **Step 3: Remove the primary CTA button block** — find and delete lines 222–235:

```tsx
            {/* Primary contact CTA */}
            {primaryContactHref && (
              <a
                href={primaryContactHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-3 rounded-[20px] bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-black transition-transform hover:-translate-y-0.5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                {contactLabel} — {primaryContactLabel}
              </a>
            )}
```

- [ ] **Step 4: Reorder right column** — The right column currently has: Bio → Social links → Nucleos. Change it to: Social links (no h2) → Nucleos → Bio.

Replace the entire `{/* Right Column */}` div content with the new order:

```tsx
          {/* Right Column */}
          <div className="flex-1 space-y-10">
            {/* Social links — first, no section title */}
            {(sl.instagram || sl.whatsapp || sl.facebook || sl.youtube || sl.tiktok || sl.website) && (
              <div className="flex flex-wrap gap-3">
                {sl.whatsapp && (
                  <a
                    href={`https://wa.me/${sl.whatsapp.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-semibold text-text-secondary transition-all hover:border-[#25D366]/40 hover:bg-[#25D366]/5 hover:text-text"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                    WhatsApp
                  </a>
                )}
                {sl.instagram && (
                  <a
                    href={`https://instagram.com/${sl.instagram.replace('@', '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-semibold text-text-secondary transition-all hover:border-[#E4405F]/40 hover:bg-[#E4405F]/5 hover:text-text"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" /></svg>
                    Instagram
                  </a>
                )}
                {sl.facebook && (
                  <a
                    href={`https://facebook.com/${sl.facebook.replace('@', '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 text-sm text-text-secondary transition-all hover:border-[#1877F2]/40 hover:text-text"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                    Facebook
                  </a>
                )}
                {sl.youtube && (
                  <a
                    href={`https://youtube.com/@${sl.youtube.replace('@', '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 text-sm text-text-secondary transition-all hover:border-[#FF0000]/40 hover:text-text"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
                    YouTube
                  </a>
                )}
                {sl.tiktok && (
                  <a
                    href={`https://tiktok.com/@${sl.tiktok.replace('@', '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 text-sm text-text-secondary transition-all hover:border-border hover:text-text"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
                    TikTok
                  </a>
                )}
                {sl.website && (
                  <a
                    href={sl.website.startsWith('http') ? sl.website : `https://${sl.website}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 text-sm text-text-secondary transition-all hover:border-accent/40 hover:text-text"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                    {t('website')}
                  </a>
                )}
              </div>
            )}

            {/* Nucleos with schedules */}
            {nucleos.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-text">{t('nucleos')}</h2>
                <div className="mt-6 flex flex-col gap-4">
                  {nucleos.map((nucleo) => {
                    const VIEW_LABEL: Record<string, string> = { es: 'Ver núcleo', pt: 'Ver núcleo', en: 'View nucleo' }
                    const WHATSAPP_LABEL: Record<string, string> = { es: 'Contacto WhatsApp', pt: 'Contato WhatsApp', en: 'WhatsApp contact' }
                    return (
                      <div key={nucleo.id} className="rounded-[22px] border border-border bg-card/40 p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            {nucleo.groupName && (
                              <p className="text-[10px] uppercase tracking-[0.22em] text-text-muted">
                                {nucleo.groupName}
                              </p>
                            )}
                            <h3 className="mt-1 text-base font-semibold text-text">{nucleo.name}</h3>
                            {(nucleo.city || nucleo.country) && (
                              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-text-secondary">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="shrink-0 opacity-60">
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                  <circle cx="12" cy="9" r="2.5" />
                                </svg>
                                {[nucleo.city, nucleo.country].filter(Boolean).join(', ')}
                              </p>
                            )}
                            {nucleo.address && (
                              <p className="mt-1 flex items-start gap-1.5 text-xs text-text-muted">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="mt-0.5 shrink-0 opacity-50">
                                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                                </svg>
                                {nucleo.address}
                              </p>
                            )}
                          </div>
                          <Link
                            href={`/${locale}/nucleo/${nucleo.groupId}/${nucleo.id}`}
                            className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent/15"
                          >
                            {VIEW_LABEL[locale] ?? VIEW_LABEL.en}
                          </Link>
                        </div>

                        {/* Schedules */}
                        {nucleo.schedules && nucleo.schedules.length > 0 && (
                          <div className="mt-4 border-t border-border/50 pt-4">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted">
                              {t('schedules')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {nucleo.schedules.map((s, i) => (
                                <span key={i} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
                                  {getDay(locale, s.dayOfWeek)} {s.startTime}–{s.endTime}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* WhatsApp contact for this nucleo */}
                        {sl.whatsapp && (
                          <div className="mt-4 border-t border-border/50 pt-4">
                            <a
                              href={`https://wa.me/${sl.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, vi el núcleo "${nucleo.name}" en Agenda Capoeiragem y me gustaría saber más.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[rgba(37,211,102,0.08)] px-4 py-2 text-xs font-semibold text-[#25D366] transition-colors hover:bg-[rgba(37,211,102,0.14)]"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                              {WHATSAPP_LABEL[locale] ?? WHATSAPP_LABEL.en}
                            </a>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Bio — last */}
            <section>
              <h2 className="text-xl font-semibold text-text">{t('bio')}</h2>
              <div className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-text-secondary">
                {educator.bio || t('unspecified')}
              </div>
            </section>
          </div>
```

- [ ] **Step 5: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | grep "educator/\[id\]"
```

Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add "app/[locale]/educator/[id]/page.tsx"
git commit -m "feat: simplify educator profile — fix main tag, remove gradient, reorder social→nucleos→bio"
```

---

### Task 3: Clean group profile page

**Files:**
- Modify: `app/[locale]/group/[id]/page.tsx`

#### What changes

1. Remove `COPY` object (lines 20–33) — the `eyebrow` and `summary` editorial strings
2. Remove `getCopy` function (lines 35–37)
3. Remove `const copy = getCopy(locale)` from component body (line 167)
4. Remove `{copy.eyebrow}` from JSX (lines 257–259)
5. Remove `{copy.summary}` from JSX (lines 263–265)
6. Remove the fixed radial gradient `<div>` (lines 214–217)
7. Change `<main ...>` → `<div ...>` (line 219) and its closing tag

- [ ] **Step 1: Remove the COPY object and getCopy function** — delete lines 20–37:

```typescript
const COPY = {
  es: {
    eyebrow: 'Perfil público del grupo',
    summary: 'Una vista más clara para entender el tamaño, el alcance y los espacios activos de la comunidad.',
  },
  pt: {
    eyebrow: 'Perfil público do grupo',
    summary: 'Uma visão mais clara para entender o tamanho, o alcance e os espaços ativos da comunidade.',
  },
  en: {
    eyebrow: 'Public group profile',
    summary: 'A clearer view of the scale, reach, and active training spaces behind this community.',
  },
} as const

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.en
}
```

- [ ] **Step 2: Remove `const copy = getCopy(locale)` from GroupPage** — delete line 167:

```typescript
  const copy = getCopy(locale)
```

- [ ] **Step 3: Remove fixed gradient + change `<main>` → `<div>`** — find these lines in the return (around lines 214–219):

```tsx
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(216,173,99,0.12),transparent_68%)] pointer-events-none"
      />

      <main className="relative mx-auto max-w-[1180px] px-5 py-10 sm:px-8 lg:px-12">
```

Replace with:

```tsx
      <div className="relative mx-auto max-w-[1180px] px-5 py-10 sm:px-8 lg:px-12">
```

Also change the closing `</main>` at the end to `</div>`.

- [ ] **Step 4: Remove `{copy.eyebrow}` from JSX** — find and delete these 3 lines inside the header section (around lines 257–259):

```tsx
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                {copy.eyebrow}
              </p>
```

- [ ] **Step 5: Remove `{copy.summary}` from JSX** — find and delete these 3 lines (around lines 263–265):

```tsx
              <p className="mt-5 max-w-[58ch] text-base leading-8 text-text-secondary">
                {copy.summary}
              </p>
```

- [ ] **Step 6: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | grep "group/\[id\]"
```

Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add "app/[locale]/group/[id]/page.tsx"
git commit -m "feat: clean group profile — remove COPY editorial, fix main tag, remove gradient"
```

---

### Task 4: Fix nucleo detail page

**Files:**
- Modify: `app/[locale]/nucleo/[groupId]/[id]/page.tsx`

#### What changes

1. Remove the fixed radial gradient `<div>` (lines 121–124)
2. Change `<main ...>` → `<div ...>` (line 126) and its closing tag

No content changes — this page has no editorial text, just structural fixes.

- [ ] **Step 1: Remove fixed gradient + change `<main>` → `<div>`** — find these lines in the return (lines 121–126):

```tsx
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_top,rgba(102,187,106,0.10),transparent_70%)] pointer-events-none"
      />

      <main className="relative mx-auto max-w-[900px] px-5 py-10 sm:px-8 lg:px-12">
```

Replace with:

```tsx
      <div className="relative mx-auto max-w-[900px] px-5 py-10 sm:px-8 lg:px-12">
```

Also change the closing `</main>` near the end (line 368) to `</div>`.

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | grep "nucleo/\[groupId\]"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add "app/[locale]/nucleo/[groupId]/[id]/page.tsx"
git commit -m "feat: fix nucleo detail page — remove fixed gradient, fix nested main tag"
```

---

## Self-review

**Spec coverage:**

| Spec requirement | Task |
|---|---|
| Educators list: remove editorial `<section>` card (eyebrow, intro, count panel, gradients) | Task 1 |
| Educators list: h1 + search + inline count | Task 1 |
| Educator profile: fix `<main>` → `<div>` | Task 2 |
| Educator profile: remove fixed gradient | Task 2 |
| Educator profile: remove big CTA button | Task 2 |
| Educator profile: social links first (no title), then nucleos, then bio | Task 2 |
| Group profile: remove COPY (eyebrow + summary) | Task 3 |
| Group profile: fix `<main>` → `<div>` | Task 3 |
| Group profile: remove fixed gradient | Task 3 |
| Nucleo detail: fix `<main>` → `<div>` | Task 4 |
| Nucleo detail: remove fixed gradient | Task 4 |

All spec requirements covered. No data/logic changes, no changes to `EducatorCard`, `CordaVisual`, `NucleoListItem` — all out of scope per spec.

**Placeholder scan:** No TBDs, no incomplete steps. Every code change is shown in full.

**Type consistency:** No new types introduced. All variables, props, and method calls match existing code.
