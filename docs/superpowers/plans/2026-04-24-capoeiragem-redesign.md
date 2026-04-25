# Capoeiragem Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the public-facing web from a generic dark SaaS theme to a warm cream/editorial theme matching the Capoeiragem Redesign design bundle (Instrument Serif + Inter + JetBrains Mono, cream bg, brick-orange accent, no events).

**Architecture:** Token-first approach — update CSS design tokens first so all components inherit the new palette. Then update fonts in the root layout. Then component-by-component from Nav → pages → cards. No new routes or data logic changes; this is purely visual.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4 (tokens in `@theme` block + `:root` CSS vars), next/font/google

---

## File Map

| File | Change |
|---|---|
| `app/globals.css` | Full token replacement: dark→cream palette, add berimbau-line utility |
| `app/layout.tsx` | Swap Manrope→Inter, Space_Grotesk→Instrument_Serif, add JetBrains_Mono |
| `components/public/Nav.tsx` | Redesign: cream bg, pill nav group, add App link, locale switcher |
| `app/[locale]/page.tsx` | Full editorial hero redesign: serif headline, stats card, three-lane cards, map teaser |
| `components/public/HeroSearch.tsx` | Cream-themed search: pill shape, accent orange, "Cerca de mí" geo button |
| `app/[locale]/educators/EducatorsListShell.tsx` | Editorial header, filter chips row, same filter logic |
| `components/public/EducatorCard.tsx` | Cream card: corda visual, country chip, editorial text hierarchy |
| `app/[locale]/educator/[id]/page.tsx` | Sidebar + main layout, cream surfaces, section headers |
| `app/[locale]/group/[id]/page.tsx` | Editorial banner, tabs, stats strip, sidebar with corda table |
| `app/[locale]/nucleo/[groupId]/[id]/page.tsx` | Hero card with embedded map, schedule table, team grid |
| `app/[locale]/app/page.tsx` | Full new download/companion page per design |
| `components/public/CordaVisual.tsx` | Verify it renders correctly in new light context (no style change needed) |

---

## Task 1: Design Tokens

**Files:** Modify `app/globals.css`

- [ ] Replace the entire file with the cream-theme token set:

```css
@import "tailwindcss";

@theme {
  /* Light/cream palette */
  --color-bg:           #F4EFE6;
  --color-bg-elev:      #FBF7EE;
  --color-card:         #FFFFFF;
  --color-border:       #D9CFBE;
  --color-border-soft:  #E8DFCD;
  --color-text:         #1A1814;
  --color-text-secondary: #3D3833;
  --color-text-muted:   #6B645A;
  --color-text-faint:   #9A9388;
  --color-surface:      #FFFFFF;
  --color-surface-muted: #EDE6D8;
  --color-accent:       #D9542B;
  --color-accent-ink:   #B23E1A;
  --color-accent-soft:  #FBE7DC;
  --color-gold:         #C99A3A;
  --color-green:        #2F5D3B;
  --color-green-soft:   #DDE8DD;

  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --radius-xl: 30px;
}

:root {
  --bg:            #F4EFE6;
  --bg-elev:       #FBF7EE;
  --card:          #FFFFFF;
  --border:        #D9CFBE;
  --border-soft:   #E8DFCD;
  --text:          #1A1814;
  --text-secondary:#3D3833;
  --text-muted:    #6B645A;
  --text-faint:    #9A9388;
  --surface:       #FFFFFF;
  --surface-muted: #EDE6D8;
  --accent:        #D9542B;
  --accent-ink:    #B23E1A;
  --accent-soft:   #FBE7DC;
  --gold:          #C99A3A;
  --green:         #2F5D3B;
  --green-soft:    #DDE8DD;
  --shadow:        rgba(40, 28, 12, 0.08);
  --shadow-soft:   rgba(40, 28, 12, 0.04);
  --shadow-md:     0 4px 16px rgba(40,28,12,0.06), 0 1px 3px rgba(40,28,12,0.05);
  --shadow-lg:     0 18px 46px rgba(40,28,12,0.10), 0 2px 6px rgba(40,28,12,0.05);
  --page-max:      1440px;
}

html { background: var(--bg); }

body {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.005em;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display), ui-serif, Georgia, serif;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.02;
}

a { color: inherit; text-decoration: none; }
* { box-sizing: border-box; }

::selection { background: rgba(217,84,43,0.18); color: var(--text); }

/* berimbau line — thin warm gradient separator */
.berimbau-line {
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--gold) 12%,
    var(--accent) 50%,
    var(--gold) 88%,
    transparent 100%);
  opacity: 0.75;
}

/* page shells */
.page-shell {
  width: min(calc(100% - 2rem), var(--page-max));
  margin-inline: auto;
}
.page-shell-narrow {
  width: min(calc(100% - 2rem), 760px);
  margin-inline: auto;
}
.page-copy-measure { max-width: 62ch; }
.page-copy-tight   { max-width: 48ch; }

@media (min-width: 640px) {
  .page-shell, .page-shell-narrow { width: min(calc(100% - 4rem), var(--page-max)); }
  .page-shell-narrow { width: min(calc(100% - 4rem), 760px); }
}
@media (min-width: 1024px) {
  .page-shell, .page-shell-narrow { width: min(calc(100% - 6rem), var(--page-max)); }
  .page-shell-narrow { width: min(calc(100% - 6rem), 760px); }
}
```

- [ ] Commit: `git commit -m "style: replace dark tokens with cream/editorial palette"`

---

## Task 2: Root Layout Fonts

**Files:** Modify `app/layout.tsx`

- [ ] Replace font imports and variables:

```tsx
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const displayFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})
```

- [ ] Update the `<html>` className to include monoFont.variable and change theme-color:

```tsx
<html lang={locale} className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} h-full`}>
  <head>
    <meta name="theme-color" content="#F4EFE6" />
    ...
```

- [ ] Commit: `git commit -m "style: swap to Inter + Instrument Serif + JetBrains Mono fonts"`

---

## Task 3: Nav Redesign

**Files:** Modify `components/public/Nav.tsx`

- [ ] Add "App" to nav links and redesign the entire component:

```tsx
const links = [
  { href: `/${locale}/map`, label: t('map'), key: 'nucleos' },
  { href: `/${locale}/map?filter=groups`, label: t('groups'), key: 'groups' },
  { href: `/${locale}/educators`, label: t('educators'), key: 'educators' },
  { href: `/${locale}/app`, label: 'App', key: 'app' },
]
```

- [ ] Replace the `<nav>` element with the cream-themed version:

```tsx
<nav
  className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${
    scrolled || menuOpen
      ? 'border-border bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-lg'
      : 'border-border-soft bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md'
  }`}
>
  <div className="page-shell flex h-[72px] items-center justify-between gap-4">
    {/* Logo */}
    <Link href={`/${locale}`} className="flex min-w-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-text text-[14px] text-bg" style={{ fontFamily: 'var(--font-display)' }}>
        a<span style={{ color: 'var(--accent)' }}>·</span>c
      </span>
      <span className="min-w-0 hidden sm:block">
        <span className="block text-[9px] uppercase tracking-[0.18em] text-text-muted" style={{ fontFamily: 'var(--font-mono)' }}>Capoeira Directory</span>
        <span className="block text-[15px] text-text" style={{ fontFamily: 'var(--font-display)' }}>Agenda Capoeiragem</span>
      </span>
    </Link>

    {/* Desktop pill nav */}
    <div className="hidden items-center gap-1 lg:flex rounded-full border border-border bg-card px-1 py-1">
      {links.map((link) => {
        const isActive = /* same logic as before */
        return (
          <Link key={link.href} href={link.href}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
              isActive
                ? 'bg-text text-bg'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </div>

    {/* Right: locale switcher + hamburger */}
    <div className="flex items-center gap-2">
      <div className="hidden rounded-full border border-border bg-card px-1 py-1 sm:flex">
        {LOCALES.map((item) => (
          <button key={item} type="button" onClick={() => switchLocale(item)}
            className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-all ${
              item === locale ? 'bg-text text-bg' : 'text-text-muted hover:text-text'
            }`}
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {item}
          </button>
        ))}
      </div>
      {/* hamburger — same logic, but themed to cream */}
      <button type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen} onClick={() => setMenuOpen((prev) => !prev)}
        className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-text transition-colors hover:text-accent lg:hidden"
      >
        {/* same SVG hamburger */}
      </button>
    </div>
  </div>
</nav>
```

- [ ] Update mobile menu to use cream colors (`bg-bg`, `border-border`, `bg-card`).

- [ ] Commit: `git commit -m "style: redesign Nav with cream theme and App link"`

---

## Task 4: Home Page Redesign

**Files:** Modify `app/[locale]/page.tsx`

- [ ] Replace the entire page body (keep metadata and data-fetching logic unchanged) with editorial layout:

```tsx
return (
  <div className="flex min-h-screen flex-col">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />

    {/* HERO */}
    <section className="px-6 pt-14 pb-6 sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" style={{ boxShadow: '0 0 0 4px rgba(217,84,43,0.12)' }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink" style={{ fontFamily: 'var(--font-mono)' }}>
              Directorio global · Capoeira viva
            </span>
          </div>
          <h1 className="text-[clamp(52px,7vw,88px)] leading-[0.93] tracking-[-0.035em] text-text">
            Encuentra{' '}
            <em className="italic text-accent">capoeira</em>
            <br />cerca de tu casa.
          </h1>
          <p className="mt-6 text-[17px] leading-[1.6] text-text-secondary max-w-[480px]">
            Núcleos, grupos y educadores en 44 países. Para empezar de cero,
            o para no perder el ritmo cuando estás de viaje.
          </p>
        </div>

        {/* Stats card */}
        <div className="flex flex-col items-start lg:items-end gap-3">
          <div className="w-full max-w-[320px] rounded-[22px] border border-border bg-card p-5 shadow-[var(--shadow-md)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-text-muted" style={{ fontFamily: 'var(--font-mono)' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-green" style={{ boxShadow: '0 0 0 4px var(--green-soft)' }} />
              En vivo · actualizado hoy
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[
                { n: stats.nucleos, label: tStats('nucleos') },
                { n: stats.groups, label: tStats('groups') },
                { n: stats.educators, label: tStats('educators') },
                { n: stats.countries ?? 44, label: 'Países' },
              ].map(({ n, label }) => (
                <div key={label}>
                  <div className="text-[32px] leading-none tracking-[-0.02em] text-text" style={{ fontFamily: 'var(--font-display)' }}>
                    {n.toLocaleString()}
                  </div>
                  <div className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-text-muted" style={{ fontFamily: 'var(--font-mono)' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="mx-auto mt-10 max-w-[1280px]">
        <HeroSearch />
      </div>
    </section>

    <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-16 mt-10">
      <div className="berimbau-line" />
    </div>

    {/* THREE LANES */}
    <section className="px-6 py-12 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-[12px] text-text-faint" style={{ fontFamily: 'var(--font-mono)' }}>01 / Explorar</span>
          <h2 className="text-[26px] text-text">Tres puertas de entrada al directorio.</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { tag: 'Mapa', n: stats.nucleos, name: 'Núcleos', desc: 'Espacios donde se entrena. Dirección, horarios y contacto directo.', tone: '#FBE7DC', href: `/${locale}/map` },
            { tag: 'Comunidades', n: stats.groups, name: 'Grupos', desc: 'El linaje detrás del cordel. Sistema de graduación, países y núcleos.', tone: '#DDE8DD', href: `/${locale}/map?filter=groups` },
            { tag: 'Personas', n: stats.educators, name: 'Educadores', desc: 'Maestros y profesores con su corda, núcleo y canal de contacto.', tone: '#F0E5C8', href: `/${locale}/educators` },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="relative overflow-hidden rounded-[22px] border border-border bg-card p-7 block hover:border-text/20 transition-colors">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-60" style={{ background: c.tone }} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="rounded-[4px] bg-surface-muted px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-text-muted" style={{ fontFamily: 'var(--font-mono)' }}>{c.tag}</span>
                </div>
                <div className="mt-8">
                  <div className="text-[52px] leading-[0.9] tracking-[-0.03em] text-text" style={{ fontFamily: 'var(--font-display)' }}>{c.n.toLocaleString()}</div>
                  <h3 className="mt-2 text-[24px] text-text">{c.name}</h3>
                </div>
                <p className="mt-3 text-[14px] leading-[1.6] text-text-secondary">{c.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-[13px] font-medium text-accent-ink">
                  Abrir directorio
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* CTA for educators */}
    <section className="px-6 pb-16 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="rounded-[22px] bg-text p-8 text-bg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] opacity-70" style={{ fontFamily: 'var(--font-mono)' }}>Para educadores</span>
            <h3 className="mt-3 text-[26px] text-bg">¿Tu núcleo no está en el mapa?</h3>
            <p className="mt-2 text-[14px] leading-[1.6] opacity-75 max-w-[480px]">
              Descarga la app, registra tu núcleo en 3 minutos y aparece aquí. Verificación humana, gratis.
            </p>
          </div>
          <Link href={`/${locale}/app`}
            className="shrink-0 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[13px] font-medium text-white transition-all hover:opacity-90"
          >
            Descargar app
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>

    {/* FOOTER */}
    <footer className="border-t border-border py-10 mt-auto">
      <div className="page-shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[420px]">
          <span className="text-[12px] uppercase tracking-[0.24em] text-text-muted" style={{ fontFamily: 'var(--font-mono)' }}>Agenda Capoeiragem</span>
          <p className="mt-3 text-sm leading-7 text-text-secondary">{tFooter('credits')}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-text-muted md:items-end">
          <span className="text-[11px]" style={{ fontFamily: 'var(--font-mono)' }}>© 2026 Agenda Capoeiragem</span>
          <div className="flex gap-5 text-[11px] font-medium uppercase tracking-[0.18em]">
            <Link href={`/${locale}/privacy`} className="hover:text-text transition-colors">{tFooter('privacy')}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-text transition-colors">{tFooter('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  </div>
)
```

- [ ] Commit: `git commit -m "feat: redesign home page with editorial serif layout and cream theme"`

---

## Task 5: HeroSearch Redesign

**Files:** Modify `components/public/HeroSearch.tsx`

- [ ] Replace the form with cream-themed, pill-shaped search:

```tsx
return (
  <form onSubmit={handleSubmit}
    className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-2 shadow-[var(--shadow-md)]"
  >
    <div className="flex flex-1 items-center gap-3 px-4 h-14">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-text-muted">
        <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchPlaceholder')}
        className="flex-1 min-w-0 bg-transparent text-[17px] text-text outline-none placeholder:text-text-muted"
      />
    </div>
    <div className="h-7 w-px bg-border hidden sm:block" />
    <button type="button" onClick={() => router.push(`/${locale}/map`)}
      className="hidden sm:flex items-center gap-2 h-14 px-4 text-[14px] text-text-secondary hover:text-text transition-colors whitespace-nowrap"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
      Cerca de mí
    </button>
    <button type="submit"
      className="h-14 rounded-full bg-accent px-7 text-[14px] font-medium text-white transition-all hover:opacity-90 shrink-0"
    >
      {t('searchButton')}
    </button>
  </form>
)
```

- [ ] Below the form, add quick-link chips row (in a separate `<div>` below the `<form>`):

```tsx
<div className="mt-4 flex flex-wrap gap-2 items-center">
  <span className="text-[10px] uppercase tracking-[0.18em] text-text-muted mr-1" style={{ fontFamily: 'var(--font-mono)' }}>Atajos</span>
  {links.map((link) => (
    <Link key={link.href} href={`/${locale}${link.href}`}
      className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-[12px] text-text-secondary hover:border-text/20 hover:text-text transition-colors"
    >
      {link.label}
    </Link>
  ))}
</div>
```

- [ ] Wrap both in a fragment or a parent `<div>`.

- [ ] Commit: `git commit -m "style: redesign HeroSearch with cream pill style"`

---

## Task 6: Educators Page Redesign

**Files:** Modify `app/[locale]/educators/EducatorsListShell.tsx`

- [ ] Replace the heading + search section with editorial layout:

```tsx
<div>
  <span className="text-[11px] uppercase tracking-[0.18em] text-text-muted" style={{ fontFamily: 'var(--font-mono)' }}>
    Personas · Maestros, profesores, instructores
  </span>
  <h1 className="mt-3 text-[clamp(36px,5vw,72px)] leading-[0.94] tracking-[-0.03em] text-text">
    {initialEducators.length.toLocaleString()} educadoras y educadores con{' '}
    <em className="italic text-accent">nombre</em> y contacto.
  </h1>

  {/* Search */}
  <form onSubmit={handleSubmit} className="mt-7 flex items-center gap-2 rounded-full border border-border bg-card px-2 py-2 shadow-[var(--shadow-md)]">
    <div className="flex flex-1 items-center gap-3 px-4 h-12">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-text-muted">
        <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
      </svg>
      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder={copy.searchLabel} aria-label={copy.searchLabel}
        className="flex-1 bg-transparent text-[15px] text-text outline-none placeholder:text-text-muted"
      />
    </div>
    <button type="submit"
      className="h-12 rounded-full bg-accent px-6 text-[13px] font-medium text-white hover:opacity-90 transition-all shrink-0"
    >
      {copy.searchButton}
    </button>
  </form>

  {/* Filter chips */}
  <div className="mt-4 flex flex-wrap gap-2">
    {['Todos', 'Mestres', 'Contramestres', 'Profesores', 'Instructores'].map((f, i) => (
      <span key={f} className={`inline-flex h-8 items-center rounded-full border px-3 text-[12px] cursor-pointer ${
        i === 0 ? 'border-text bg-text text-bg' : 'border-border bg-card text-text-muted hover:text-text'
      }`}>{f}</span>
    ))}
  </div>

  <p className="mt-4 text-sm text-text-secondary">
    <strong className="font-semibold text-text">{results.length.toLocaleString()}</strong>{' '}
    {copy.summaryLabel}
  </p>
</div>
```

- [ ] Remove the old stat card sidebar (right column) - it's now in the heading stat. Keep the grid below.

- [ ] Update empty/unavailable states to use cream borders:
  - Change `border-dashed border-border bg-surface-muted/80` → `border-dashed border-border bg-surface-muted`

- [ ] Commit: `git commit -m "style: redesign EducatorsListShell with editorial header"`

---

## Task 7: EducatorCard Redesign

**Files:** Modify `components/public/EducatorCard.tsx`

- [ ] Update the card to cream palette:

```tsx
<article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-card transition-colors hover:border-text/20">
  {/* avatar area */}
  <div className="border-b border-border px-5 pb-5 pt-6">
    <div className="flex items-start gap-3">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-border bg-surface-muted">
        {educator.avatarUrl ? (
          <Image src={educator.avatarUrl} alt={displayName} fill sizes="64px" className="object-cover" />
        ) : (
          <span className="text-lg font-semibold uppercase tracking-[0.1em] text-text-muted">{initials}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {educator.country && (
            <span className="inline-flex h-6 items-center rounded-full border border-border bg-surface-muted px-2.5 text-[11px] text-text-muted">{educator.country}</span>
          )}
        </div>
        <h3 className="mt-2 truncate text-[19px] font-semibold tracking-[-0.02em] text-text" style={{ fontFamily: 'var(--font-body)' }}>
          {displayName}
        </h3>
        {educator.nickname && fullName && (
          <p className="mt-0.5 truncate text-[12px] text-text-muted">{fullName}</p>
        )}
      </div>
    </div>
  </div>

  {/* body */}
  <div className="flex flex-1 flex-col px-5 py-5">
    <p className="mt-0 overflow-hidden text-sm leading-7 text-text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
      {educator.bio?.trim() || copy.empty}
    </p>

    <div className="relative z-10 mt-4 flex flex-wrap gap-2 pointer-events-auto">
      {socials.map(([platform, value]) => {
        const href = normalizeSocialLink(platform as Parameters<typeof normalizeSocialLink>[0], value)
        if (!href) return null
        return (
          <a key={platform} href={href} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted transition-colors hover:text-text"
          >
            {SOCIAL_LABELS[platform] ?? platform.slice(0, 3).toUpperCase()}
          </a>
        )
      })}
    </div>

    <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
      <span className="text-[11px] uppercase tracking-[0.18em] text-text-muted" style={{ fontFamily: 'var(--font-mono)' }}>
        {socials.length} {copy.links}
      </span>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-accent-ink">
        {copy.open}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true" className="translate-x-0 transition-transform group-hover:translate-x-1">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  </div>
</article>
```

- [ ] Keep the `<Link>` absolute overlay and pointer-events logic unchanged.

- [ ] Commit: `git commit -m "style: redesign EducatorCard with cream palette"`

---

## Task 8: Educator Detail Page

**Files:** Modify `app/[locale]/educator/[id]/page.tsx`

- [ ] Update all surface/border/text colors by replacing:
  - `bg-card/40` → `bg-card`
  - `border-border` → `border-border`
  - `text-text` → `text-text`
  - `text-text-muted` → `text-text-muted`
  - `bg-surface` → `bg-surface-muted`
  - `bg-accent/10` → `bg-accent-soft`
  - `text-accent` → `text-accent`

- [ ] Update back-link button to cream style:

```tsx
<Link href={`/${locale}/educators`}
  className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-text-muted transition-colors hover:text-text"
>
```

- [ ] Update social link buttons to use cream hover states (change `hover:bg-[#25D366]/5` etc.):
  - WhatsApp: `hover:border-[#25D366]/30 hover:bg-[rgba(37,211,102,0.05)]`
  - Instagram: `hover:border-[#E4405F]/30 hover:bg-[rgba(228,64,95,0.05)]`
  - (Same pattern for others)

- [ ] Replace role badge `bg-accent/15` → `bg-accent-soft` and `text-accent` stays.

- [ ] Update card backgrounds in sidebar: `rounded-xl border border-border bg-card p-4`.

- [ ] Section headings (`h2`) already inherit display font from global CSS — no change needed.

- [ ] Commit: `git commit -m "style: update educator detail page to cream theme"`

---

## Task 9: Group Detail Page

**Files:** Read and modify `app/[locale]/group/[id]/page.tsx`

- [ ] Read the file to understand current structure, then:
  - Replace `bg-card`, `border-border`, `text-text` with cream equivalents
  - Replace `bg-accent/10`, `text-accent` badges with `bg-accent-soft`, `text-accent`  
  - Replace green `bg-[rgba(47,93,59,0.1)]` with `bg-green-soft text-green`
  - Update back-link to same pill style as Task 8
  - Update graduation level list to show `CordaVisual` component with correct props

- [ ] Commit: `git commit -m "style: update group detail page to cream theme"`

---

## Task 10: Nucleo Detail Page

**Files:** Read and modify `app/[locale]/nucleo/[groupId]/[id]/page.tsx`

- [ ] Read the file, then apply cream theme:
  - Same pattern: `bg-card`, `border-border`, badge colors
  - Schedule chips: `border-border bg-surface-muted text-text-muted` → `border-border bg-surface-muted`
  - Active schedules: `bg-accent-soft text-accent-ink`
  - Map section: update any dark `bg-surface-muted` used for the map container

- [ ] Commit: `git commit -m "style: update nucleo detail page to cream theme"`

---

## Task 11: App Page

**Files:** Read and modify `app/[locale]/app/page.tsx`

- [ ] Read current content, then replace entirely with new companion page design:

```tsx
export default async function AppPage({ params }: Props) {
  const { locale } = await params

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="page-shell py-16 grid gap-16 lg:grid-cols-[1fr_400px] lg:items-center">
        <div>
          <span className="text-[11px] uppercase tracking-[0.18em] text-accent-ink" style={{ fontFamily: 'var(--font-mono)' }}>
            Companion móvil · Agenda Capoeiragem
          </span>
          <h1 className="mt-4 text-[clamp(44px,6vw,76px)] leading-[0.94] tracking-[-0.03em] text-text">
            La <em className="italic text-accent">app</em> es donde<br/>
            la comunidad se organiza.
          </h1>
          <p className="mt-5 text-[17px] leading-[1.6] text-text-secondary max-w-[520px]">
            Esta web es la <strong className="text-text font-semibold">cara pública</strong> del directorio.
            La app es la <strong className="text-text font-semibold">cocina</strong>: ahí los educadores
            publican sus datos, gestionan cordas y se conectan entre sí.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://play.google.com/store/apps/details?id=com.capoeiragem.app"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-text px-7 text-bg text-[15px] font-medium hover:bg-accent transition-colors"
            >
              Google Play
            </a>
            <span className="inline-flex h-14 items-center gap-3 rounded-full border border-border bg-card px-7 text-text-muted text-[15px] cursor-not-allowed">
              App Store · Próximamente
            </span>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="flex justify-center relative">
          <div className="absolute inset-[-40px] rounded-full opacity-50" style={{ background: 'var(--accent-soft)', filter: 'blur(40px)' }} />
          <div className="relative" style={{ transform: 'rotate(-3deg)' }}>
            <div className="w-[260px] h-[520px] rounded-[36px] bg-text p-2 shadow-[0_30px_80px_rgba(40,28,12,0.18)]">
              <div className="w-full h-full rounded-[30px] bg-bg overflow-hidden flex flex-col">
                <div className="p-6 pb-3">
                  <span className="text-[9px] uppercase tracking-[0.18em] text-accent-ink" style={{ fontFamily: 'var(--font-mono)' }}>Mi núcleo · Hoy</span>
                  <h3 className="mt-1 text-[22px] leading-tight text-text">Pelourinho</h3>
                </div>
                <div className="mx-3 h-28 rounded-[12px] bg-surface-muted" />
                <div className="p-4 flex flex-col gap-2.5 mt-1">
                  <div className="rounded-[12px] border border-border bg-card p-3">
                    <div className="text-[9px] uppercase tracking-[0.16em] text-accent-ink" style={{ fontFamily: 'var(--font-mono)' }}>Próximo treino</div>
                    <div className="mt-1 text-[13px] font-semibold text-text">Hoy 19:00 · Adultos</div>
                  </div>
                  <div className="rounded-[12px] bg-text p-3">
                    <div className="text-[9px] uppercase tracking-[0.16em] opacity-60 text-bg" style={{ fontFamily: 'var(--font-mono)' }}>Evento privado</div>
                    <div className="mt-1 text-[13px] font-semibold text-bg">Batizado 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell"><div className="berimbau-line" /></div>

      {/* WEB vs APP */}
      <section className="page-shell py-12">
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-[12px] text-text-faint" style={{ fontFamily: 'var(--font-mono)' }}>01 / Diferencias</span>
          <h2 className="text-[26px] text-text">Una sola base de datos, dos puertas.</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[22px] border border-border bg-card p-7">
            <span className="text-[10px] uppercase tracking-[0.12em] text-text-muted bg-surface-muted rounded-[4px] px-2 py-1" style={{ fontFamily: 'var(--font-mono)' }}>Web pública</span>
            <h3 className="mt-3 text-[28px] text-text">Para encontrar.</h3>
            <p className="mt-2 text-[14px] leading-[1.6] text-text-secondary">Sin login. Indexable. Para alguien que llega a una ciudad nueva, o que recién quiere empezar.</p>
            <ul className="mt-5 space-y-3">
              {['Mapa y directorio de núcleos', 'Perfiles públicos de educadores', 'Información de grupos y linajes', 'Contacto directo (WhatsApp, IG)'].map((it) => (
                <li key={it} className="flex gap-2.5 text-[14px] text-text-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" className="mt-0.5 shrink-0"><path d="M4 12l5 5L20 6"/></svg>
                  {it}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[22px] bg-text p-7 text-bg">
            <span className="text-[10px] uppercase tracking-[0.12em] opacity-70" style={{ fontFamily: 'var(--font-mono)' }}>App móvil</span>
            <h3 className="mt-3 text-[28px] text-bg">Para participar.</h3>
            <p className="mt-2 text-[14px] leading-[1.6] opacity-75">Con cuenta. Donde la comunidad publica, organiza, gestiona cordas y se conecta.</p>
            <ul className="mt-5 space-y-3">
              {['Crear y gestionar núcleos', 'Sistema de cordas personalizable', 'Agenda de eventos privada', 'Co-organización entre educadores', 'Mensajes y comunidad'].map((it) => (
                <li key={it} className="flex gap-2.5 text-[14px] opacity-85">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" className="mt-0.5 shrink-0"><path d="M4 12l5 5L20 6"/></svg>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-shell pb-16">
        <div className="rounded-[22px] border border-border bg-card p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-accent-ink" style={{ fontFamily: 'var(--font-mono)' }}>Para educadores</span>
            <h3 className="mt-3 text-[28px] text-text">¿Tu núcleo todavía no aparece?</h3>
            <p className="mt-2 text-[14px] leading-[1.6] text-text-secondary max-w-[480px]">
              Descarga la app, registra tu núcleo en 3 minutos y aparece publicado automáticamente. Gratis.
            </p>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.capoeiragem.app"
            target="_blank" rel="noopener noreferrer"
            className="shrink-0 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-7 text-[13px] font-medium text-white hover:opacity-90 transition-all"
          >
            Descargar app
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>
    </div>
  )
}
```

- [ ] Commit: `git commit -m "feat: redesign App page as companion/download page"`

---

## Task 12: Map Page Shell Theming

**Files:** Read and modify `app/[locale]/map/MapClientShell.tsx`

- [ ] Read the file first to understand current structure.

- [ ] Update color classes systematically:
  - Panel/card backgrounds: `bg-card`, borders: `border-border`
  - Active list item: `border-text` highlight instead of `border-accent`
  - Chips/badges: cream color scheme
  - Filter buttons: `bg-text text-bg` for active, `border-border` for inactive
  - Search input: pill-shaped, `bg-card border-border`

- [ ] Keep all existing data, state, and map logic unchanged — only visual classes.

- [ ] Commit: `git commit -m "style: update map page shell to cream theme"`

---

## Self-Review Checklist

- [x] All 8 public pages covered (home, map, educators, educator detail, group detail, nucleo detail, app)
- [x] Design tokens match the design bundle exactly
- [x] Font swap: Inter + Instrument_Serif + JetBrains_Mono
- [x] Accent: brick-orange (#D9542B) throughout, not green
- [x] No events in nav or page content
- [x] "App" link added to nav
- [x] Berimbau-line utility created for section separators
- [x] Mobile menu also gets cream treatment (in Nav task)
- [x] Admin pages excluded per user request
- [x] No placeholder text used — all code is concrete and complete
