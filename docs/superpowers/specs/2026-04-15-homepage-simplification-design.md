# Homepage Simplification Design

**Date:** 2026-04-15
**Status:** Approved

## Problem

The current homepage is too complex for a directory. It includes an editorial hero with two columns, a bullet-point panel, stats bar, category cards, featured educators grid, an app CTA section with phone mockup, and ads. This creates friction for users who just want to find a nucleo, group, or educator.

## Goal

Redesign the homepage to function as a real directory entry point: search-first, minimal, no scroll, immediately actionable.

## Design

### Layout structure

```
NAV: Logo · Mapa · Educadores · Grupos · [ES/PT/EN]

─────────────────────────────────────────────────

  Agenda Capoeiragem
  Directorio global de capoeira

  [ 🔍  Ciudad, país, grupo...         ]

  842 Núcleos  ·  64 Grupos  ·  1.2k Educadores

  [ Ver mapa ]  [ Educadores ]  [ Grupos ]

─────────────────────────────────────────────────

FOOTER: © 2026 · Privacy · Terms
```

### Hero section (`app/[locale]/page.tsx`)

- Small brand label: "Agenda Capoeiragem" (uppercase, accent color, `<p>` tag)
- `<h1>`: "Agenda Capoeiragem" or the localized site name — kept for SEO, visually de-emphasized (smaller than current)
- Subtitle: localized one-liner — "Directorio global de capoeira" / "Diretório global de capoeira" / "Global capoeira directory"
- `HeroSearch` component (existing, unchanged)
- Stats row: `{nucleos} Núcleos · {groups} Grupos · {educators} Educadores` — numbers from Firestore via `getStats()`, same as current
- Three action buttons:
  - Primary (accent): "Ver mapa" → `/{locale}/map`
  - Secondary (outline): "Educadores" → `/{locale}/educators`
  - Secondary (outline): "Grupos" → `/{locale}/map?filter=groups`

No sections below the hero. No scroll. Footer immediately follows.

### Nav (`components/public/Nav.tsx`)

Remove the "App Preview" button (`/{locale}/app` CTA). Keep:
- Logo/brand link
- Three nav links: Mapa · Educadores · Grupos
- Language switcher (ES / PT / EN)
- Mobile hamburger menu (same links, no app button)

### What is removed from `page.tsx`

| Component/Section | Removed |
|---|---|
| Two-column hero grid with panel | ✓ |
| `StatsBar` (separate section) | ✓ — stats inline in hero |
| `CategoryCards` section | ✓ |
| Featured educators grid | ✓ |
| CTA section (phone mockup) | ✓ |
| `AdDisplay` | ✓ |
| `SectionLabel`, `EducatorCard` imports | ✓ |

### What is kept

- `HeroSearch` component — unchanged
- `getStats()` query — used for the inline stats row
- JSON-LD structured data (`buildWebSiteSchema`) — keep in page
- `generateMetadata` — keep, simplify copy
- Footer — unchanged
- All i18n/locale plumbing — unchanged

### Metadata

Keep `generateMetadata`. Simplify `META_TITLES` and `META_DESCRIPTIONS` to match the new minimal copy. Remove `LANDING_COPY` object (no longer needed — hero copy is short enough to inline or put in messages).

### i18n messages

The hero copy ("Ver mapa", "Educadores", "Grupos", stats labels) should use existing `messages/{locale}.json` keys where possible. Add minimal new keys only if needed.

## Out of scope

- Changes to map page, educator pages, group pages, nucleo pages
- Changes to HeroSearch behavior
- Changes to footer content
- SEO/sitemap changes
- Any new features
