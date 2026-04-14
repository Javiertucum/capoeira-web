'use client'

import { useDeferredValue, useMemo, useState, useTransition, type FormEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
    eyebrow: 'Directorio público',
    heading: 'Educadores',
    intro: 'Maestros y profesores de capoeira con perfiles públicos, contacto directo y núcleos de entrenamiento.',
    searchLabel: 'Busca por nombre, país o grupo',
    searchButton: 'Buscar',
    resultsLabel: 'Resultados',
    summaryLabel: 'educadores',
    emptyTitle: 'Sin resultados para esta búsqueda',
    emptyBody: 'Prueba otro nombre, país o grupo para ampliar la exploración.',
    unavailableTitle: 'Directorio no disponible por ahora',
    unavailableBody: 'El directorio de educadores estará disponible en breve.',
  },
  pt: {
    eyebrow: 'Diretório público',
    heading: 'Educadores',
    intro: 'Mestres e professores de capoeira com perfis públicos, contato direto e núcleos de treino.',
    searchLabel: 'Busque por nome, país ou grupo',
    searchButton: 'Buscar',
    resultsLabel: 'Resultados',
    summaryLabel: 'educadores',
    emptyTitle: 'Nenhum resultado para esta busca',
    emptyBody: 'Tente outro nome, país ou grupo para ampliar a exploração.',
    unavailableTitle: 'Diretório indisponível no momento',
    unavailableBody: 'O diretório de educadores estará disponível em breve.',
  },
  en: {
    eyebrow: 'Public directory',
    heading: 'Educators',
    intro: 'Capoeira masters and teachers with public profiles, direct contact, and training locations.',
    searchLabel: 'Search by name, country, or group',
    searchButton: 'Search',
    resultsLabel: 'Results',
    summaryLabel: 'educators',
    emptyTitle: 'No results for this search',
    emptyBody: 'Try another name, country, or group to widen the search.',
    unavailableTitle: 'Directory temporarily unavailable',
    unavailableBody: 'The educator directory will be available shortly.',
  },
} as const

function getCopy(locale: string) {
  return COPY[locale as keyof typeof COPY] ?? COPY.en
}

function createHaystack(educator: PublicUserProfile) {
  return [educator.name, educator.surname, educator.nickname, educator.country, educator.bio]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export default function EducatorsListShell({
  locale,
  initialEducators,
  initialQuery,
  dataUnavailable,
}: Props) {
  const copy = getCopy(locale)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(initialQuery)
  const deferredQuery = useDeferredValue(query)

  const results = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase()
    const filtered = normalized
      ? initialEducators.filter((e) => createHaystack(e).includes(normalized))
      : initialEducators
    return filtered.sort((a, b) =>
      (a.nickname || a.name || '').localeCompare(b.nickname || b.name || '')
    )
  }, [deferredQuery, initialEducators])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }
    const nextUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname
    startTransition(() => {
      router.replace(nextUrl, { scroll: false })
    })
  }

  return (
    <div className="px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-20">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <section className="relative overflow-hidden rounded-[30px] border border-border bg-card px-6 py-7 shadow-sm sm:px-8 sm:py-8">
          <div
            aria-hidden="true"
            className="absolute right-[-90px] top-[-90px] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(132,201,122,0.08)_0%,rgba(132,201,122,0)_72%)]"
          />
          <div
            aria-hidden="true"
            className="absolute left-[-70px] bottom-[-80px] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(208,162,96,0.08)_0%,rgba(208,162,96,0)_72%)]"
          />

          <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
                {copy.eyebrow}
              </p>
              <h1 className="mt-4 text-[clamp(34px,5vw,58px)] font-semibold leading-[0.96] tracking-[-0.06em] text-text">
                {copy.heading}
              </h1>
              <p className="mt-4 max-w-[58ch] text-sm leading-7 text-text-secondary">
                {copy.intro}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 lg:flex-row">
                <label className="flex min-w-0 flex-1 items-center gap-4 rounded-[24px] border border-border bg-surface/80 px-4 py-4 transition-all focus-within:border-accent/35 focus-within:ring-2 focus-within:ring-accent/70 focus-within:ring-offset-2 focus-within:ring-offset-card">
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
            </div>

            <div className="flex items-center justify-center rounded-[24px] border border-border bg-card/80 px-4 py-6 xl:flex-col xl:justify-start xl:pt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                {copy.summaryLabel}
              </p>
              <p className="mt-3 text-[48px] font-semibold leading-none tracking-[-0.04em] text-text">
                {initialEducators.length.toLocaleString()}
              </p>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{copy.resultsLabel}</p>
            </div>
          </div>
        </section>

        {/* Results grid */}
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
}
