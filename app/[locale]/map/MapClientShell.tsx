'use client'

import { useDeferredValue, useEffect, useMemo, useState, useTransition, type FormEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import MapView from '@/components/public/MapView'
import NucleoListItem from '@/components/public/NucleoListItem'
import type { MapNucleo } from '@/lib/types'

type Props = Readonly<{
  locale: string
  initialNucleos: MapNucleo[]
  initialQuery: string
  initialFilter: string
  dataUnavailable: boolean
}>

type FilterValue = 'nucleos' | 'groups' | 'educators'

type LocaleCopy = {
  searchButton: string
  intro: string
  emptyTitle: string
  emptyBody: string
  unavailableTitle: string
  unavailableBody: string
  groupsHint: string
  educatorsHint: string
  listTitle: string
  mapTitle: string
}

const FILTERS: FilterValue[] = ['nucleos', 'groups', 'educators']

const COPY: Record<string, LocaleCopy> = {
  es: {
    searchButton: 'Buscar',
    intro: 'Explora nucleos activos, cambia el foco del directorio y centra el mapa en segundos.',
    emptyTitle: 'Sin resultados para tu busqueda',
    emptyBody: 'Prueba otra ciudad, grupo o pais para ampliar la exploracion.',
    unavailableTitle: 'Directorio no disponible por ahora',
    unavailableBody: 'Todavia no pudimos leer Firestore con las credenciales actuales, asi que mostramos la interfaz lista para cuando el acceso quede conectado.',
    groupsHint: 'La vista de grupos seguira creciendo. Por ahora te mostramos los nucleos asociados a cada comunidad.',
    educatorsHint: 'La vista de educadores seguira creciendo. Por ahora te mostramos los espacios de entrenamiento vinculados al directorio.',
    listTitle: 'Resultados',
    mapTitle: 'Mapa activo',
  },
  pt: {
    searchButton: 'Buscar',
    intro: 'Explore nucleos ativos, mude o foco do diretorio e centralize o mapa em segundos.',
    emptyTitle: 'Nenhum resultado para sua busca',
    emptyBody: 'Tente outra cidade, grupo ou pais para ampliar a exploracao.',
    unavailableTitle: 'Diretorio indisponivel no momento',
    unavailableBody: 'Ainda nao foi possivel ler o Firestore com as credenciais atuais, entao mostramos a interface pronta para quando o acesso estiver conectado.',
    groupsHint: 'A vista de grupos vai crescer em breve. Por enquanto mostramos os nucleos ligados a cada comunidade.',
    educatorsHint: 'A vista de educadores vai crescer em breve. Por enquanto mostramos os espacos de treino ligados ao diretorio.',
    listTitle: 'Resultados',
    mapTitle: 'Mapa ativo',
  },
  en: {
    searchButton: 'Search',
    intro: 'Explore active nucleos, shift the directory focus, and re-center the map in seconds.',
    emptyTitle: 'No results for this search',
    emptyBody: 'Try another city, group, or country to widen the search.',
    unavailableTitle: 'Directory temporarily unavailable',
    unavailableBody: 'Firestore could not be reached with the current credentials yet, so the interface is ready and waiting for live data.',
    groupsHint: 'The groups view is still growing. For now we are showing the nucleos tied to each community.',
    educatorsHint: 'The educators view is still growing. For now we are showing the training locations tied to the directory.',
    listTitle: 'Results',
    mapTitle: 'Active map',
  },
}

function getCopy(locale: string) {
  return COPY[locale] ?? COPY.en
}

function sanitizeFilter(value: string): FilterValue {
  return FILTERS.includes(value as FilterValue) ? (value as FilterValue) : 'nucleos'
}

function createSearchHaystack(nucleo: MapNucleo) {
  return [
    nucleo.name,
    nucleo.groupName,
    nucleo.city,
    nucleo.country,
    nucleo.address,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export default function MapClientShell({
  locale,
  initialNucleos,
  initialQuery,
  initialFilter,
  dataUnavailable,
}: Props) {
  const t = useTranslations('map')
  const copy = getCopy(locale)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(initialQuery)
  const [filter, setFilter] = useState<FilterValue>(sanitizeFilter(initialFilter))
  const deferredQuery = useDeferredValue(query)

  const filteredNucleos = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()
    const results = normalizedQuery
      ? initialNucleos.filter((nucleo) => createSearchHaystack(nucleo).includes(normalizedQuery))
      : initialNucleos

    return [...results].sort((left, right) => {
      if (filter === 'groups') {
        return left.groupName.localeCompare(right.groupName) || left.name.localeCompare(right.name)
      }

      return left.name.localeCompare(right.name)
    })
  }, [deferredQuery, filter, initialNucleos])

  const [activeNucleoId, setActiveNucleoId] = useState<string | null>(filteredNucleos[0]?.id ?? null)

  useEffect(() => {
    if (filteredNucleos.length === 0) {
      setActiveNucleoId(null)
      return
    }

    if (!activeNucleoId || !filteredNucleos.some((nucleo) => nucleo.id === activeNucleoId)) {
      setActiveNucleoId(filteredNucleos[0].id)
    }
  }, [activeNucleoId, filteredNucleos])

  function syncUrl(nextQuery: string, nextFilter: FilterValue) {
    const params = new URLSearchParams(searchParams.toString())

    if (nextQuery.trim()) {
      params.set('q', nextQuery.trim())
    } else {
      params.delete('q')
    }

    if (nextFilter === 'nucleos') {
      params.delete('filter')
    } else {
      params.set('filter', nextFilter)
    }

    const nextUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname

    startTransition(() => {
      router.replace(nextUrl, { scroll: false })
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    syncUrl(query, filter)
  }

  function handleFilterChange(nextFilter: FilterValue) {
    setFilter(nextFilter)
    syncUrl(query, nextFilter)
  }

  const hint =
    filter === 'groups'
      ? copy.groupsHint
      : filter === 'educators'
        ? copy.educatorsHint
        : null

  return (
    <div className="px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-20">
      <div className="mx-auto max-w-[1280px]">
        <section className="relative overflow-hidden rounded-[28px] border border-border bg-card px-6 py-7 shadow-[0_24px_80px_var(--shadow)] sm:px-8 sm:py-8">
          <div
            aria-hidden="true"
            className="absolute right-[-70px] top-[-70px] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(102,187,106,0.16)_0%,rgba(102,187,106,0)_72%)]"
          />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-[640px]">
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent">
                Agenda Capoeiragem
              </p>
              <h1 className="mt-3 text-[clamp(32px,5vw,52px)] font-semibold leading-[0.98] tracking-[-0.05em] text-text">
                {t('title')}
              </h1>
              <p className="mt-4 max-w-[58ch] text-sm leading-7 text-text-secondary">
                {copy.intro}
              </p>
            </div>

            <div className="min-w-0 xl:max-w-[520px] xl:flex-1">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 lg:flex-row">
                  <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[16px] border border-border bg-surface px-4 py-3 focus-within:border-accent/40">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_6px_rgba(102,187,106,0.12)]"
                    />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={t('searchPlaceholder')}
                      aria-label={t('searchPlaceholder')}
                      className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
                    />
                  </label>

                  <button
                    type="submit"
                    className="inline-flex h-[52px] items-center justify-center rounded-[16px] bg-accent px-6 text-sm font-semibold tracking-[0.08em] text-[#08110C] transition-opacity hover:opacity-90"
                  >
                    {isPending ? `${copy.searchButton}...` : copy.searchButton}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((item) => {
                    const labels = {
                      nucleos: t('filterNucleos'),
                      groups: t('filterGroups'),
                      educators: t('filterEducators'),
                    }

                    const isActive = item === filter

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleFilterChange(item)}
                        className={`rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                          isActive
                            ? 'border-accent/35 bg-[rgba(102,187,106,0.14)] text-accent'
                            : 'border-border bg-surface text-text-muted hover:text-text'
                        }`}
                      >
                        {labels[item]}
                      </button>
                    )
                  })}
                </div>
              </form>
            </div>
          </div>
        </section>

        {hint ? (
          <div className="mt-5 rounded-[18px] border border-accent/20 bg-[rgba(102,187,106,0.08)] px-5 py-4 text-sm leading-7 text-text-secondary">
            {hint}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
          <section className="order-2 rounded-[26px] border border-border bg-card/92 p-4 shadow-[0_18px_60px_var(--shadow)] lg:order-1">
            <div className="flex items-end justify-between gap-4 border-b border-border px-2 pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-text-muted">
                  {copy.listTitle}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[0.01em] text-text">
                  {t('results', { count: filteredNucleos.length })}
                </h2>
              </div>
            </div>

            {dataUnavailable ? (
              <div className="mt-4 rounded-[20px] border border-dashed border-border bg-surface-muted/80 px-4 py-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-text">
                  {copy.unavailableTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{copy.unavailableBody}</p>
              </div>
            ) : null}

            <div className="mt-4 flex max-h-[520px] flex-col gap-3 overflow-y-auto pr-1 lg:max-h-[calc(100svh-240px)]">
              {filteredNucleos.length > 0 ? (
                filteredNucleos.map((nucleo) => (
                  <NucleoListItem
                    key={nucleo.id}
                    nucleo={nucleo}
                    isActive={nucleo.id === activeNucleoId}
                    onSelect={setActiveNucleoId}
                  />
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-border bg-surface-muted/80 px-5 py-8 text-center">
                  <h3 className="text-lg font-semibold tracking-[0.01em] text-text">
                    {copy.emptyTitle}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">{copy.emptyBody}</p>
                </div>
              )}
            </div>
          </section>

          <section className="order-1 lg:order-2">
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-text-muted">
                  {copy.mapTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {filteredNucleos.length > 0
                    ? t('results', { count: filteredNucleos.length })
                    : copy.emptyBody}
                </p>
              </div>
            </div>

            <MapView
              nucleos={filteredNucleos}
              activeNucleoId={activeNucleoId}
              onSelect={setActiveNucleoId}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
