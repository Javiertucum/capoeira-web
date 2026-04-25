'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import EducatorCard from '@/components/public/EducatorCard'
import AdInFeed from '@/components/ads/AdInFeed'
import type { PublicUserProfile } from '@/lib/types'

type Props = Readonly<{
  locale: string
  initialEducators: PublicUserProfile[]
  initialQuery: string
  dataUnavailable: boolean
}>

const COPY = {
  es: {
    eyebrow: 'Personas · maestros, profesores, instructores',
    headingBefore: '',
    headingEm: 'nombre',
    headingAfter: 'y contacto.',
    stats: [
      { key: 'activos',   label: 'Activos' },
      { key: 'paises',    label: 'Países' },
      { key: 'grupos',    label: 'Grupos' },
    ],
    searchPlaceholder: 'Apodo, nombre, grupo o país…',
    searchButton: 'Buscar',
    filterChips: ['Todos', 'Mestres', 'Contramestres', 'Profesores', 'Instructores', '🇧🇷 Brasil', '🇦🇷 Argentina', '🇪🇸 España', '+ país'],
    countLabel: (n: number) => `${n.toLocaleString()} educadores`,
    emptyTitle: 'Sin resultados para esta búsqueda',
    emptyBody: 'Prueba otro nombre, país o grupo para ampliar la exploración.',
    unavailableTitle: 'Directorio no disponible por ahora',
    unavailableBody: 'El directorio de educadores estará disponible en breve.',
  },
  pt: {
    eyebrow: 'Pessoas · mestres, professores, instrutores',
    headingBefore: '',
    headingEm: 'nome',
    headingAfter: 'e contato.',
    stats: [
      { key: 'ativos',   label: 'Ativos' },
      { key: 'paises',   label: 'Países' },
      { key: 'grupos',   label: 'Grupos' },
    ],
    searchPlaceholder: 'Apelido, nome, grupo ou país…',
    searchButton: 'Buscar',
    filterChips: ['Todos', 'Mestres', 'Contramestres', 'Professores', 'Instrutores', '🇧🇷 Brasil', '🇦🇷 Argentina', '🇪🇸 Espanha', '+ país'],
    countLabel: (n: number) => `${n.toLocaleString()} educadores`,
    emptyTitle: 'Nenhum resultado para esta busca',
    emptyBody: 'Tente outro nome, país ou grupo para ampliar a exploração.',
    unavailableTitle: 'Diretório indisponível no momento',
    unavailableBody: 'O diretório de educadores estará disponível em breve.',
  },
  en: {
    eyebrow: 'People · masters, teachers, instructors',
    headingBefore: '',
    headingEm: 'name',
    headingAfter: 'and contact.',
    stats: [
      { key: 'active',   label: 'Active' },
      { key: 'countries', label: 'Countries' },
      { key: 'groups',   label: 'Groups' },
    ],
    searchPlaceholder: 'Nickname, name, group or country…',
    searchButton: 'Search',
    filterChips: ['All', 'Masters', 'Contramasters', 'Teachers', 'Instructors', '🇧🇷 Brazil', '🇦🇷 Argentina', '🇪🇸 Spain', '+ country'],
    countLabel: (n: number) => `${n.toLocaleString()} educators`,
    emptyTitle: 'No results for this search',
    emptyBody: 'Try another name, country, or group.',
    unavailableTitle: 'Directory temporarily unavailable',
    unavailableBody: 'The educators directory will be available shortly.',
  },
} as const

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.es
}

function createHaystack(e: PublicUserProfile) {
  return [e.name, e.surname, e.nickname, e.country, e.bio].filter(Boolean).join(' ').toLowerCase()
}

function handleSubmit(e: { preventDefault(): void }) { e.preventDefault() }

export default function EducatorsListShell({ locale, initialEducators, initialQuery, dataUnavailable }: Props) {
  const copy = getCopy(locale)
  const [query, setQuery] = useState(initialQuery)
  const [activeFilter, setActiveFilter] = useState(0)
  const deferredQuery = useDeferredValue(query)

  const normalized = deferredQuery.trim().toLowerCase()
  const results = useMemo(
    () => initialEducators.filter((e) => createHaystack(e).includes(normalized)),
    [initialEducators, normalized]
  )

  const totalN = initialEducators.length.toLocaleString()

  return (
    <div className="pb-16 pt-10 lg:pb-20">
      <div className="page-shell">

        {/* ── Editorial header ── */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div>
            <span className="eyebrow mb-3 block">{copy.eyebrow}</span>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 68px)', lineHeight: 0.94, letterSpacing: '-0.03em' }}>
              {initialEducators.length.toLocaleString()} educadoras y educadores con{' '}
              <em>{copy.headingEm}</em> {copy.headingAfter}
            </h1>
          </div>
          {/* Stats inline — right */}
          <div className="flex gap-8 xl:pb-2">
            <div>
              <div className="text-[36px] font-bold leading-none tracking-[-0.03em] text-ink" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                {totalN.replace(',', '.')}
              </div>
              <div className="mono mt-1 text-[11px] uppercase tracking-[0.16em] text-ink-3">{copy.stats[0]?.label}</div>
            </div>
            <div>
              <div className="text-[36px] font-bold leading-none tracking-[-0.03em] text-ink" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>44</div>
              <div className="mono mt-1 text-[11px] uppercase tracking-[0.16em] text-ink-3">{copy.stats[1]?.label}</div>
            </div>
            <div>
              <div className="text-[36px] font-bold leading-none tracking-[-0.03em] text-ink" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>68</div>
              <div className="mono mt-1 text-[11px] uppercase tracking-[0.16em] text-ink-3">{copy.stats[2]?.label}</div>
            </div>
          </div>
        </div>

        {/* ── Search bar ── */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 flex items-center gap-2 rounded-full border border-line bg-surface p-1.5"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="flex flex-1 items-center gap-3 px-4 h-12 min-w-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink-3" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchPlaceholder}
              className="flex-1 min-w-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-4"
            />
          </div>
          {/* Cerca de mí */}
          <div className="hidden h-7 w-px bg-line sm:block" />
          <button
            type="button"
            className="hidden sm:flex h-12 items-center gap-2 px-4 text-[13px] text-ink-2 hover:text-ink transition-colors whitespace-nowrap"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
            </svg>
            {locale === 'en' ? 'Near me' : locale === 'pt' ? 'Perto de mim' : 'Cerca de mí'}
          </button>
          <button
            type="submit"
            className="btn btn-accent shrink-0"
            style={{ height: 48, paddingInline: 20 }}
          >
            {copy.searchButton}
          </button>
        </form>

        {/* ── Filter chips ── */}
        <div className="mt-4 flex flex-wrap gap-2">
          {copy.filterChips.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveFilter(i)}
              className={`chip ${activeFilter === i ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="mt-4 text-[13px] text-ink-2">
          <strong className="font-semibold text-ink">{results.length.toLocaleString()}</strong>{' '}
          {copy.countLabel(results.length).replace(results.length.toLocaleString(), '').trim()}
        </p>

        {/* ── Grid ── */}
        <div className="mt-6">
          {dataUnavailable ? (
            <div className="card-paper px-5 py-8 text-center">
              <h2 className="text-lg text-ink">{copy.unavailableTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-2">{copy.unavailableBody}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="card-paper px-5 py-8 text-center">
              <h2 className="text-lg text-ink">{copy.emptyTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-2">{copy.emptyBody}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((educator, index) => (
                <div key={educator.uid}>
                  {index > 0 && index % 8 === 0 && (
                    <div className="col-span-full"><AdInFeed /></div>
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
}
