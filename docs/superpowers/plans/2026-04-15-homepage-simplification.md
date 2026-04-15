# Homepage Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la página de inicio actual (compleja, con múltiples secciones editoriales) por una página de directorio mínima: buscador centrado, stats del directorio y tres botones de acción, sin scroll.

**Architecture:** Dos archivos se modifican. `app/[locale]/page.tsx` se reescribe completamente — elimina 7 secciones y deja solo el hero + footer. `components/public/Nav.tsx` pierde el botón "App Preview" en escritorio y en el menú móvil. No se crean archivos nuevos.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, next-intl

---

## Archivos que cambian

| Archivo | Acción |
|---|---|
| `app/[locale]/page.tsx` | Reescribir completo |
| `components/public/Nav.tsx` | Eliminar botón App Preview (líneas ~132–137 desktop, ~221–226 móvil) |

> **Sin suite de tests:** El proyecto no tiene tests automatizados de UI. La verificación en cada tarea es visual — arrancar el servidor de desarrollo y comprobar en el navegador.

---

## Task 1: Eliminar el botón "App Preview" del Nav

**Files:**
- Modify: `components/public/Nav.tsx`

- [ ] **Step 1: Verificar el estado actual en el navegador**

  Arrancar el dev server si no está corriendo:
  ```bash
  npm run dev
  ```
  Abrir `http://localhost:3000/es`. Confirmar que el botón verde "Ver App" aparece en la esquina superior derecha del nav (escritorio) y también dentro del menú hamburguesa (móvil).

- [ ] **Step 2: Eliminar el botón del nav en escritorio**

  En `components/public/Nav.tsx`, eliminar el bloque completo (líneas ~132–137):

  ```tsx
  // ELIMINAR este bloque:
  <Link
    href={`/${locale}/app`}
    className="hidden h-10 items-center justify-center rounded-full bg-accent px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:inline-flex"
  >
    {t('appPreview')}
  </Link>
  ```

  El resultado: el `div` con `className="flex items-center gap-2 sm:gap-3"` debe quedar solo con el selector de idioma y el botón hamburguesa.

- [ ] **Step 3: Eliminar el botón del menú móvil**

  En el mismo archivo, dentro del menú móvil (líneas ~221–226), eliminar:

  ```tsx
  // ELIMINAR este bloque:
  <Link
    href={`/${locale}/app`}
    className="inline-flex h-10 w-full items-center justify-center rounded-full bg-accent px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition-opacity hover:opacity-92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
  >
    {t('downloadApp')}
  </Link>
  ```

  El bloque `div` que lo contiene (el que tiene el selector de idioma + este botón) ahora queda solo con el selector de idioma. Si ese `div` wrapper queda vacío o innecesario, eliminarlo también.

- [ ] **Step 4: Verificar en el navegador**

  Recargar `http://localhost:3000/es`. Comprobar:
  - El botón verde "Ver App" ya no aparece en el nav de escritorio
  - Al abrir el menú hamburguesa en móvil (o reducir el ancho de ventana), el botón verde "Descargar App" ya no aparece
  - Los tres links (Mapa · Educadores · Grupos) y el selector de idioma siguen funcionando
  - El menú móvil sigue abriendo y cerrando correctamente

- [ ] **Step 5: Commit**

  ```bash
  git add components/public/Nav.tsx
  git commit -m "feat: remove App Preview button from nav"
  ```

---

## Task 2: Reescribir la página de inicio

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Verificar el estado actual**

  En `http://localhost:3000/es` confirmar que la página actual tiene: hero con dos columnas, panel con bullet points, stats bar separada, categorías, educadores destacados, sección CTA con mockup de teléfono.

- [ ] **Step 2: Reemplazar el contenido de `page.tsx`**

  Reemplazar el contenido completo de `app/[locale]/page.tsx` con:

  ```tsx
  import { getTranslations } from 'next-intl/server'
  import type { Metadata } from 'next'
  import Link from 'next/link'
  import HeroSearch from '@/components/public/HeroSearch'
  import { getLanguageAlternates, getLocalizedUrl, getSiteDescription, getOgImageUrl, buildWebSiteSchema } from '@/lib/site'
  import type { StatsData } from '@/lib/types'

  export const revalidate = 300

  type Props = Readonly<{
    params: Promise<{ locale: string }>
  }>

  const EMPTY_STATS: StatsData = {
    nucleos: 0,
    groups: 0,
    educators: 0,
    countries: 0,
  }

  const META_TITLES = {
    es: 'Directorio de Capoeira — Grupos, Núcleos y Educadores en el Mundo',
    pt: 'Diretório de Capoeira — Grupos, Núcleos e Educadores no Mundo',
    en: 'Capoeira Directory — Groups, Nucleos & Educators Worldwide',
  } as const

  const META_DESCRIPTIONS = {
    es: 'Encuentra grupos de capoeira, núcleos de entrenamiento y educadores en todo el mundo.',
    pt: 'Encontre grupos de capoeira, núcleos de treino e educadores em todo o mundo.',
    en: 'Find capoeira groups, training nucleos, and educators worldwide.',
  } as const

  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const title = META_TITLES[locale as keyof typeof META_TITLES] ?? META_TITLES.es
    const description = META_DESCRIPTIONS[locale as keyof typeof META_DESCRIPTIONS] ?? getSiteDescription(locale)
    const ogImage = getOgImageUrl({ title: 'Agenda Capoeiragem', sub: description.slice(0, 80) })

    return {
      title,
      description,
      alternates: {
        canonical: getLocalizedUrl(locale),
        languages: getLanguageAlternates(),
      },
      openGraph: {
        title,
        description,
        url: getLocalizedUrl(locale),
        type: 'website',
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    }
  }

  export default async function LandingPage({ params }: Props) {
    const { locale } = await params

    const [tHero, tStats, tNav, tFooter] = await Promise.all([
      getTranslations({ locale, namespace: 'hero' }),
      getTranslations({ locale, namespace: 'stats' }),
      getTranslations({ locale, namespace: 'nav' }),
      getTranslations({ locale, namespace: 'footer' }),
    ])

    let stats = EMPTY_STATS
    try {
      const { getStats } = await import('@/lib/queries')
      stats = await getStats()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Stats unavailable', error)
    }

    const webSiteSchema = buildWebSiteSchema(locale)

    return (
      <div className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />

        <main className="flex flex-1 flex-col items-center justify-center px-5 py-16 sm:px-8">
          <div className="w-full max-w-[560px] text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
              Agenda Capoeiragem
            </p>

            <h1 className="mt-3 text-[clamp(28px,5vw,40px)] font-semibold leading-[1.1] tracking-[-0.04em] text-text">
              {tHero('eyebrow')}
            </h1>

            <div className="mt-8">
              <HeroSearch />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-text-secondary">
              <span>
                <strong className="font-semibold text-text">{stats.nucleos.toLocaleString()}</strong>{' '}
                {tStats('nucleos')}
              </span>
              <span className="text-border" aria-hidden="true">·</span>
              <span>
                <strong className="font-semibold text-text">{stats.groups.toLocaleString()}</strong>{' '}
                {tStats('groups')}
              </span>
              <span className="text-border" aria-hidden="true">·</span>
              <span>
                <strong className="font-semibold text-text">{stats.educators.toLocaleString()}</strong>{' '}
                {tStats('educators')}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}/map`}
                className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-black transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {tNav('map')}
              </Link>
              <Link
                href={`/${locale}/educators`}
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card/60 px-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-text-secondary transition-all hover:border-accent/25 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {tNav('educators')}
              </Link>
              <Link
                href={`/${locale}/map?filter=groups`}
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card/60 px-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-text-secondary transition-all hover:border-accent/25 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {tNav('groups')}
              </Link>
            </div>
          </div>
        </main>

        <footer className="border-t border-border px-5 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[460px]">
              <span className="text-[12px] font-semibold uppercase tracking-[0.24em] text-accent">
                Agenda Capoeiragem
              </span>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                {tFooter('credits')}
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm text-text-muted md:items-end">
              <span>{`© 2026 | ${tFooter('credits')}`}</span>
              <div className="flex gap-5 text-[11px] font-semibold uppercase tracking-[0.18em]">
                <Link href={`/${locale}/privacy`} className="transition-colors hover:text-text">
                  {tFooter('privacy')}
                </Link>
                <Link href={`/${locale}/terms`} className="transition-colors hover:text-text">
                  {tFooter('terms')}
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }
  ```

- [ ] **Step 3: Verificar que no haya errores de TypeScript**

  ```bash
  npx tsc --noEmit
  ```
  Esperado: sin errores.

- [ ] **Step 4: Verificar en el navegador**

  Recargar `http://localhost:3000/es`. Comprobar:
  - La página muestra: label "Agenda Capoeiragem" (verde pequeño) → `<h1>` con el texto del directorio → barra de búsqueda → fila de stats (números reales) → tres botones (Mapa · Educadores · Grupos)
  - No hay secciones debajo — solo el footer
  - El botón "Mapa" (verde) lleva a `/es/map`
  - El botón "Educadores" lleva a `/es/educators`
  - El botón "Grupos" lleva a `/es/map?filter=groups`
  - Repetir en `/pt` y `/en` — los textos cambian según el idioma
  - En móvil (reducir ventana a ~375px): los tres botones se apilan correctamente, la fila de stats hace wrap sin romperse

- [ ] **Step 5: Commit**

  ```bash
  git add app/[locale]/page.tsx
  git commit -m "feat: rewrite homepage as minimal search-first directory"
  ```

---

## Checklist de verificación final

Después de ambas tareas, recorrer esta lista antes de dar por terminado:

- [ ] Nav: botón "Ver App" / "Descargar App" ya no aparece en ningún breakpoint
- [ ] Homepage: no hay scroll más allá del hero
- [ ] Homepage: los números de stats son reales (vienen de Firestore), no ceros
- [ ] Homepage: los tres botones funcionan y llevan a la página correcta
- [ ] Homepage: funciona en ES, PT y EN
- [ ] TypeScript: `npx tsc --noEmit` sin errores
- [ ] Las demás páginas (mapa, educadores, grupos, perfiles) no están afectadas
