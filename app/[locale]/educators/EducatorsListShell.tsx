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
    heading: 'Educadores',
    searchLabel: 'Busca por nombre, pais o grupo',
    searchButton: 'Buscar',
    summaryLabel: 'educadores',
    visibleLabel: 'visibles ahora',
    emptyTitle: 'Sin resultados para esta busqueda',
    emptyBody: 'Prueba otro nombre, pais o grupo para ampliar la exploracion.',
    unavailableTitle: 'Directorio no disponible por ahora',
    unavailableBody: 'El directorio de educadores estara disponible en breve.',
  },
  pt: {
    heading: 'Educadores',
    searchLabel: 'Busque por nome, pais ou grupo',
    searchButton: 'Buscar',
    summaryLabel: 'educadores',
    visibleLabel: 'visiveis agora',
    emptyTitle: 'Nenhum resultado para esta busca',
    emptyBody: 'Tente outro nome, pais ou grupo para ampliar a exploracao.',
    unavailableTitle: 'Diretorio indisponivel no momento',
    unavailableBody: 'O diretorio de educadores estara disponivel em breve.',
  },
  en: {
    heading: 'Educators',
    searchLabel: 'Search by name, country, or group',
    searchButton: 'Search',
    summaryLabel: 'educators',
    visibleLabel: 'visible now',
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
    <div className="pb-16 pt-8 lg:pb-20">
      <div className="page-shell">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
          <div>
            <h1 className="text-[clamp(28px,4vw,52px)] font-semibold leading-[0.96] tracking-[-0.05em] text-text">
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
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={copy.searchLabel}
                    aria-label={copy.searchLabel}
                    className="mt-1 block w-full min-w-0 bg-transparent text-base text-text outline-none placeholder:text-text-muted"
                  />
                </span>
              </label>
              <button
                type="submit"
                className="inline-flex h-[68px] cursor-pointer items-center justify-center rounded-[24px] bg-accent px-6 text-sm font-semibold uppercase tracking-[0.18em] text-black transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {copy.searchButton}
              </button>
            </form>

            <p className="mt-3 text-sm text-text-secondary">
              <strong className="font-semibold text-text">{initialEducators.length.toLocaleString()}</strong>{' '}
              {copy.summaryLabel}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[22px] border border-border bg-card/80 px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-muted">
                {copy.summaryLabel}
              </p>
              <p className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.04em] text-text">
                {initialEducators.length.toLocaleString()}
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-card/80 px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-muted">
                {copy.visibleLabel}
              </p>
              <p className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.04em] text-text">
                {results.length.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
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
