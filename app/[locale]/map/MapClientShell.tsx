'use client'

import { useDeferredValue, useEffect, useMemo, useState, useTransition, type FormEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import MapView from '@/components/public/MapView'
import NucleoListItem from '@/components/public/NucleoListItem'
import GroupCard from '@/components/public/GroupCard'
import AdInFeed from '@/components/ads/AdInFeed'
import type { MapNucleo, Group } from '@/lib/types'

type Props = Readonly<{
  locale: string
  initialNucleos: MapNucleo[]
  initialGroups: Group[]
  initialQuery: string
  initialFilter: string
  dataUnavailable: boolean
}>

type FilterValue = 'nucleos' | 'groups'
type MobileView = 'list' | 'map'

type LocaleCopy = {
  eyebrow: string
  intro: string
  helper: string
  searchLabel: string
  searchButton: string
  emptyTitle: string
  emptyBody: string
  unavailableTitle: string
  unavailableBody: string
  groupsHint: string
  listTitle: string
  mapTitle: string
  listTab: string
  mapTab: string
  focusIdle: string
  focusPrefix: string
  summaryLabel: string
}

const FILTERS: FilterValue[] = ['nucleos', 'groups']

const COPY: Record<string, LocaleCopy> = {
  es: {
    eyebrow: 'Directorio público',
    intro: 'Busca núcleos y grupos, cambia de foco y usa la vista que mejor funcione para ti en cada pantalla.',
    helper: 'En móvil la lista va primero. El mapa aparece cuando lo necesitas.',
    searchLabel: 'Busca en el directorio',
    searchButton: 'Buscar',
    emptyTitle: 'Sin resultados para esta búsqueda',
    emptyBody: 'Prueba otra ciudad, grupo o país para ampliar la exploración.',
    unavailableTitle: 'Directorio no disponible por ahora',
    unavailableBody: 'Todavía no pudimos leer Firestore con las credenciales actuales, así que dejamos la interfaz lista para cuando el acceso quede conectado.',
    groupsHint: 'Cada grupo abre una vista de comunidad y el mapa muestra sus núcleos relacionados.',
    listTitle: 'Resultados',
    mapTitle: 'Mapa activo',
    listTab: 'Lista',
    mapTab: 'Mapa',
    focusIdle: 'Selecciona un grupo para centrar sus núcleos en el mapa.',
    focusPrefix: 'Mapa vinculado a',
    summaryLabel: 'visibles ahora',
  },
  pt: {
    eyebrow: 'Diretório público',
    intro: 'Busque núcleos e grupos, mude o foco e use a vista que fizer mais sentido para você em cada tela.',
    helper: 'No móvel a lista vem primeiro. O mapa aparece quando você precisa.',
    searchLabel: 'Busque no diretório',
    searchButton: 'Buscar',
    emptyTitle: 'Nenhum resultado para esta busca',
    emptyBody: 'Tente outra cidade, grupo ou país para ampliar a exploração.',
    unavailableTitle: 'Diretório indisponível no momento',
    unavailableBody: 'Ainda não foi possível ler o Firestore com as credenciais atuais, então deixamos a interface pronta para quando o acesso estiver conectado.',
    groupsHint: 'Cada grupo abre uma vista de comunidade e o mapa mostra seus núcleos relacionados.',
    listTitle: 'Resultados',
    mapTitle: 'Mapa ativo',
    listTab: 'Lista',
    mapTab: 'Mapa',
    focusIdle: 'Selecione um grupo para centralizar seus núcleos no mapa.',
    focusPrefix: 'Mapa vinculado a',
    summaryLabel: 'visíveis agora',
  },
  en: {
    eyebrow: 'Public directory',
    intro: 'Search nucleos and groups, change the focus, and use the view that works best for each screen size.',
    helper: 'On mobile, the list comes first. The map is one tap away when you need it.',
    searchLabel: 'Search the directory',
    searchButton: 'Search',
    emptyTitle: 'No results for this search',
    emptyBody: 'Try another city, group, or country to widen the search.',
    unavailableTitle: 'Directory temporarily unavailable',
    unavailableBody: 'Firestore could not be reached with the current credentials yet, so the interface is ready and waiting for live data.',
    groupsHint: 'Each group opens a community view and the map shows its related nucleos.',
    listTitle: 'Results',
    mapTitle: 'Live map',
    listTab: 'List',
    mapTab: 'Map',
    focusIdle: 'Select a group to center its related nucleos on the map.',
    focusPrefix: 'Map linked to',
    summaryLabel: 'visible now',
  },
}

function getCopy(locale: string) {
  return COPY[locale] ?? COPY.en
}

function sanitizeFilter(value: string): FilterValue {
  return FILTERS.includes(value as FilterValue) ? (value as FilterValue) : 'nucleos'
}

function createSearchHaystack(item: MapNucleo | Group) {
  if ('representedCountries' in item) {
    return [item.name, ...(item.representedCountries ?? []), ...(item.representedCities ?? [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  }

  const nucleo = item as MapNucleo

  return [nucleo.name, nucleo.groupName, nucleo.city, nucleo.country, nucleo.address]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function getEntityId(item: MapNucleo | Group) {
  return item.id
}

function getEntityName(item: MapNucleo | Group) {
  return item.name
}

export default function MapClientShell({
  locale,
  initialNucleos,
  initialGroups,
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
  const [mobileView, setMobileView] = useState<MobileView>('list')
  const deferredQuery = useDeferredValue(query)

  const searchResults = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    if (filter === 'groups') {
      const results = normalizedQuery
        ? initialGroups.filter((group) => createSearchHaystack(group).includes(normalizedQuery))
        : initialGroups

      return results.sort((left, right) => left.name.localeCompare(right.name))
    }

    const results = normalizedQuery
      ? initialNucleos.filter((nucleo) => createSearchHaystack(nucleo).includes(normalizedQuery))
      : initialNucleos

    return results.sort((left, right) => left.name.localeCompare(right.name))
  }, [deferredQuery, filter, initialGroups, initialNucleos])

  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (searchResults.length > 0 && !activeId) {
      setActiveId(getEntityId(searchResults[0]))
    }
  }, [searchResults, activeId])

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
    setActiveId(null)
    setMobileView('list')
    syncUrl(query, nextFilter)
  }

  const mapNucleos = useMemo(() => {
    if (!activeId) return filter === 'nucleos' ? (searchResults as MapNucleo[]) : initialNucleos

    if (filter === 'groups') {
      return initialNucleos.filter((nucleo) => nucleo.groupId === activeId)
    }

    return searchResults as MapNucleo[]
  }, [activeId, filter, initialNucleos, searchResults])

  const hint = filter === 'groups' ? copy.groupsHint : null
  const activeEntity = searchResults.find((item) => getEntityId(item) === activeId) ?? null
  const filterCounts = {
    nucleos: initialNucleos.length,
    groups: initialGroups.length,
  }

  return (
    <div className="pb-16 pt-8 lg:pb-20">
      <div className="page-shell">
        <section className="relative overflow-hidden rounded-[30px] border border-border bg-card px-6 py-7 shadow-sm sm:px-8 sm:py-8">
          <div
            aria-hidden="true"
            className="absolute right-[-90px] top-[-90px] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(217,84,43,0.06)_0%,rgba(217,84,43,0)_72%)]"
          />
          <div
            aria-hidden="true"
            className="absolute left-[-70px] bottom-[-80px] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(201,154,58,0.07)_0%,rgba(201,154,58,0)_72%)]"
          />

          <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-accent-ink" style={{ fontFamily: 'var(--font-mono)' }}>
                {copy.eyebrow}
              </p>
              <h1 className="mt-4 text-[clamp(34px,5vw,58px)] leading-[0.96] tracking-[-0.03em] text-text">
                {t('title')}
              </h1>
              <p className="page-copy-measure mt-4 text-sm leading-7 text-text-secondary">
                {copy.intro}
              </p>
              <p className="mt-2 text-sm leading-7 text-text-muted">{copy.helper}</p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
                <div className="flex flex-col gap-3 lg:flex-row">
                  <label className="flex min-w-0 flex-1 items-center gap-4 rounded-[24px] border border-border bg-card px-4 py-4 transition-all focus-within:border-accent/35 focus-within:ring-2 focus-within:ring-accent/30 focus-within:ring-offset-2 focus-within:ring-offset-bg">
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-[16px] border border-accent/20 bg-accent-soft text-accent"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
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
                        placeholder={t('searchPlaceholder')}
                        aria-label={t('searchPlaceholder')}
                        className="mt-1 block w-full min-w-0 bg-transparent text-base text-text outline-none placeholder:text-text-muted"
                      />
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="inline-flex h-[68px] cursor-pointer items-center justify-center rounded-[24px] bg-accent px-6 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    {isPending ? `${copy.searchButton}...` : copy.searchButton}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((item) => {
                    const labels: Record<FilterValue, string> = {
                      nucleos: t('filterNucleos'),
                      groups: t('filterGroups'),
                    }

                    const isActive = item === filter

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleFilterChange(item)}
                        className={`cursor-pointer rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                          isActive
                            ? 'border-text bg-text text-bg'
                            : 'border-border bg-card text-text-secondary hover:border-text/20 hover:text-text'
                        }`}
                      >
                        {`${labels[item]} (${filterCounts[item]})`}
                      </button>
                    )
                  })}
                </div>
              </form>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {FILTERS.map((item) => {
                const labels: Record<FilterValue, string> = {
                  nucleos: t('filterNucleos'),
                  groups: t('filterGroups'),
                }

                return (
                  <div
                    key={item}
                    className="rounded-[24px] border border-border bg-card px-4 py-4"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                      {labels[item]}
                    </p>
                    <p className="mt-3 text-[28px] font-semibold leading-none tracking-[-0.04em] text-text">
                      {filterCounts[item].toLocaleString()}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">{copy.summaryLabel}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {hint ? (
          <div className="mt-5 rounded-[22px] border border-accent/20 bg-accent-soft/40 px-5 py-4 text-sm leading-7 text-text-secondary">
            {hint as string}
          </div>
        ) : null}

        <div className="mt-5 lg:hidden">
          <div className="flex rounded-full border border-border bg-card p-1">
            {(['list', 'map'] as MobileView[]).map((view) => {
              const isActive = view === mobileView

              return (
                <button
                  key={view}
                  type="button"
                  onClick={() => setMobileView(view)}
                  className={`flex-1 rounded-full px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                    isActive
                      ? 'bg-text text-bg'
                      : 'text-text-secondary'
                  }`}
                >
                  {view === 'list' ? copy.listTab : copy.mapTab}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(360px,460px)_minmax(0,1fr)] 2xl:grid-cols-[minmax(420px,500px)_minmax(0,1fr)]">
          <section
            className={`${mobileView === 'list' ? 'block' : 'hidden'} rounded-[26px] border border-border bg-card p-5 shadow-sm lg:block`}
          >
            <div className="flex items-end justify-between gap-4 border-b border-border px-2 pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                  {copy.listTitle}
                </p>
                <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-text">
                  {t('results', { count: searchResults.length })}
                </h2>
              </div>
            </div>

            {dataUnavailable ? (
              <div className="mt-4 rounded-[20px] border border-dashed border-border bg-surface-muted px-4 py-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-text">
                  {copy.unavailableTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{copy.unavailableBody}</p>
              </div>
            ) : null}

            <div className="mt-4 flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1 lg:max-h-[calc(100svh-230px)]">
              {searchResults.length > 0 ? (
                searchResults.map((item, index) => {
                  const showAd = index > 0 && index % 4 === 0

                  if (filter === 'groups') {
                    const group = item as Group
                    return (
                      <div key={group.id}>
                        {showAd && <AdInFeed />}
                        <div onClick={() => setActiveId(group.id)} className="cursor-pointer">
                          <GroupCard group={group} locale={locale} />
                        </div>
                      </div>
                    )
                  }

                  const nucleo = item as MapNucleo
                  return (
                    <div key={nucleo.id}>
                      {showAd && <AdInFeed />}
                      <NucleoListItem
                        nucleo={nucleo}
                        isActive={nucleo.id === activeId}
                        onSelect={setActiveId}
                      />
                    </div>
                  )
                })
              ) : (
                <div className="rounded-[22px] border border-dashed border-border bg-surface-muted px-5 py-10 text-center">
                  <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-accent/20 bg-accent-soft text-accent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.5-3.5" />
                      <path d="M15 7l-8 8M7 7l8 8" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold tracking-[0.01em] text-text">
                    {t('emptyTitle')}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    {t('emptyBody')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      handleFilterChange(filter)
                    }}
                    className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-border bg-surface px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    {t('clearSearch')}
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className={`${mobileView === 'map' ? 'block' : 'hidden'} lg:block`}>
            <div className="lg:sticky lg:top-[94px]">
              <div className="mb-3 flex items-end justify-between gap-4 px-1">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                    {copy.mapTitle}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {mapNucleos.length > 0 ? t('results', { count: mapNucleos.length }) : copy.emptyBody}
                  </p>
                </div>
              </div>

              {filter !== 'nucleos' ? (
                <div className="mb-4 rounded-[20px] border border-border bg-card px-4 py-4 text-sm leading-7 text-text-secondary">
                  {activeEntity
                    ? `${copy.focusPrefix} ${getEntityName(activeEntity)}`
                    : copy.focusIdle}
                </div>
              ) : null}

              <MapView nucleos={mapNucleos} activeNucleoId={activeId} onSelect={setActiveId} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
