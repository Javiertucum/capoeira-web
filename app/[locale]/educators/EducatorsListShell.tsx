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
    heading: 'Educadores',
    searchLabel: 'Busca por nombre, país o grupo',
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

      const normalized = deferredQuery.trim().toLowerCase()
      const results = initialEducators.filter((e) => createHaystack(e).includes(normalized))

      return (
        <div className="px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-20">
          <div className="mx-auto max-w-[1280px]">
            {/* Header simplificado */}
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
          </div>

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
    )
}
