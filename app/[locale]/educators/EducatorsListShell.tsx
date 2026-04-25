'use client'

import { useDeferredValue, useMemo, useState, type FormEvent } from 'react'
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
    eyebrow: 'Personas · Maestros, profesores, instructores',
    heading: (n: number) => `${n.toLocaleString()} educadoras y educadores`,
    headingEm: 'con nombre y contacto.',
    searchLabel: 'Busca por apodo, nombre, país o grupo',
    searchButton: 'Buscar',
    filters: ['Todos', 'Mestres', 'Contramestres', 'Profesores', 'Instructores'],
    summaryLabel: 'educadores',
    emptyTitle: 'Sin resultados para esta búsqueda',
    emptyBody: 'Prueba otro nombre, país o grupo para ampliar la exploración.',
    unavailableTitle: 'Directorio no disponible por ahora',
    unavailableBody: 'El directorio de educadores estará disponible en breve.',
  },
  pt: {
    eyebrow: 'Pessoas · Mestres, professores, instrutores',
    heading: (n: number) => `${n.toLocaleString()} educadoras e educadores`,
    headingEm: 'com nome e contato.',
    searchLabel: 'Busque por apelido, nome, país ou grupo',
    searchButton: 'Buscar',
    filters: ['Todos', 'Mestres', 'Contramestres', 'Professores', 'Instrutores'],
    summaryLabel: 'educadores',
    emptyTitle: 'Nenhum resultado para esta busca',
    emptyBody: 'Tente outro nome, país ou grupo para ampliar a exploração.',
    unavailableTitle: 'Diretório indisponível no momento',
    unavailableBody: 'O diretório de educadores estará disponível em breve.',
  },
  en: {
    eyebrow: 'People · Masters, teachers, instructors',
    heading: (n: number) => `${n.toLocaleString()} educators`,
    headingEm: 'with name and contact.',
    searchLabel: 'Search by nickname, name, country or group',
    searchButton: 'Search',
    filters: ['All', 'Masters', 'Contramasters', 'Teachers', 'Instructors'],
    summaryLabel: 'educators',
    emptyTitle: 'No results for this search',
    emptyBody: 'Try another name, country, or group to widen the search.',
    unavailableTitle: 'Directory temporarily unavailable',
    unavailableBody: 'The educators directory will be available shortly.',
  },
} as const

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.es
}

function createHaystack(educator: PublicUserProfile) {
  return [educator.name, educator.surname, educator.nickname, educator.country, educator.bio]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
}

export default function EducatorsListShell({
  locale,
  initialEducators,
  initialQuery,
  dataUnavailable,
}: Props) {
  const copy = getCopy(locale)
  const [query, setQuery] = useState(initialQuery)
  const deferredQuery = useDeferredValue(query)

  const normalized = deferredQuery.trim().toLowerCase()
  const results = useMemo(
    () => initialEducators.filter((educator) => createHaystack(educator).includes(normalized)),
    [initialEducators, normalized]
  )

  return (
    <div className="pb-16 pt-10 lg:pb-20">
      <div className="page-shell">
        {/* Editorial heading */}
        <div>
          <span
            className="text-[11px] uppercase tracking-[0.18em] text-text-muted"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {copy.eyebrow}
          </span>
          <h1 className="mt-3 text-[clamp(32px,5vw,68px)] leading-[0.94] tracking-[-0.03em] text-text">
            {copy.heading(initialEducators.length)}{' '}
            <em className="italic text-accent">{copy.headingEm}</em>
          </h1>

          {/* Search bar */}
          <form
            onSubmit={handleSubmit}
            className="mt-7 flex items-center gap-2 rounded-full border border-border bg-card px-2 py-2"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="flex flex-1 items-center gap-3 px-4 h-12 min-w-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="shrink-0 text-text-muted"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchLabel}
                aria-label={copy.searchLabel}
                className="flex-1 min-w-0 bg-transparent text-[15px] text-text outline-none placeholder:text-text-muted"
              />
            </div>
            <button
              type="submit"
              className="h-12 shrink-0 rounded-full bg-accent px-6 text-[13px] font-medium text-white transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {copy.searchButton}
            </button>
          </form>

          {/* Filter chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {copy.filters.map((f, i) => (
              <span
                key={f}
                className={`inline-flex h-8 items-center rounded-full border px-3 text-[12px] cursor-pointer select-none transition-colors ${
                  i === 0
                    ? 'border-text bg-text text-bg'
                    : 'border-border bg-card text-text-muted hover:text-text hover:border-text/20'
                }`}
              >
                {f}
              </span>
            ))}
          </div>

          <p className="mt-4 text-[13px] text-text-secondary">
            <strong className="font-semibold text-text">{results.length.toLocaleString()}</strong>{' '}
            {copy.summaryLabel}
          </p>
        </div>

        {/* Results grid */}
        <div className="mt-8">
          {dataUnavailable ? (
            <div className="rounded-[22px] border border-dashed border-border bg-surface-muted px-5 py-8 text-center">
              <h2 className="text-lg text-text">{copy.unavailableTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{copy.unavailableBody}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-border bg-surface-muted px-5 py-8 text-center">
              <h2 className="text-lg text-text">{copy.emptyTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{copy.emptyBody}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
}
