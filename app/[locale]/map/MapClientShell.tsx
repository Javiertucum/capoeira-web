'use client'

import { useDeferredValue, useEffect, useMemo, useState, useTransition, type FormEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import MapView from '@/components/public/MapView'
import NucleoListItem from '@/components/public/NucleoListItem'
import EducatorCard from '@/components/public/EducatorCard'
import GroupCard from '@/components/public/GroupCard'
import AdInFeed from '@/components/ads/AdInFeed'
import type { MapNucleo, PublicUserProfile, Group } from '@/lib/types'

type Props = Readonly<{
  locale: string
  initialNucleos: MapNucleo[]
  initialEducators: PublicUserProfile[]
  initialGroups: Group[]
  initialQuery: string
  initialFilter: string
  dataUnavailable: boolean
}>

type FilterValue = 'nucleos' | 'groups' | 'educators'
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
  educatorsHint: string
  listTitle: string
  mapTitle: string
  listTab: string
  mapTab: string
  focusIdle: string
  focusPrefix: string
  summaryLabel: string
}

const FILTERS: FilterValue[] = ['nucleos', 'groups', 'educators']

const COPY: Record<string, LocaleCopy> = {
  es: {
    eyebrow: 'Directorio publico',
    intro: 'Busca, cambia de foco y usa la vista que mejor funcione para ti en cada pantalla.',
    helper: 'En movil la lista va primero. El mapa aparece cuando lo necesitas.',
    searchLabel: 'Busca en el directorio',
    searchButton: 'Buscar',
    emptyTitle: 'Sin resultados para esta busqueda',
    emptyBody: 'Prueba otra ciudad, grupo o pais para ampliar la exploracion.',
    unavailableTitle: 'Directorio no disponible por ahora',
    unavailableBody: 'Todavia no pudimos leer Firestore con las credenciales actuales, asi que dejamos la interfaz lista para cuando el acceso quede conectado.',
    groupsHint: 'Cada grupo abre una vista de comunidad y el mapa muestra sus nucleos relacionados.',
    educatorsHint: 'Cada educador abre sus espacios de entrenamiento y los vincula con el mapa.',
    listTitle: 'Resultados',
    mapTitle: 'Mapa activo',
    listTab: 'Lista',
    mapTab: 'Mapa',
    focusIdle: 'Selecciona un grupo o educador para centrar sus nucleos en el mapa.',
    focusPrefix: 'Mapa vinculado a',
    summaryLabel: 'visibles ahora',
  },
  pt: {
    eyebrow: 'Diretorio publico',
    intro: 'Busque, mude o foco e use a vista que fizer mais sentido para voce em cada tela.',
    helper: 'No movel a lista vem primeiro. O mapa aparece quando voce precisa.',
    searchLabel: 'Busque no diretorio',
    searchButton: 'Buscar',
    emptyTitle: 'Nenhum resultado para esta busca',
    emptyBody: 'Tente outra cidade, grupo ou pais para ampliar a exploracao.',
    unavailableTitle: 'Diretorio indisponivel no momento',
    unavailableBody: 'Ainda nao foi possivel ler o Firestore com as credenciais atuais, entao deixamos a interface pronta para quando o acesso estiver conectado.',
    groupsHint: 'Cada grupo abre uma vista de comunidade e o mapa mostra seus nucleos relacionados.',
    educatorsHint: 'Cada educador abre seus espacos de treino e os vincula ao mapa.',
    listTitle: 'Resultados',
    mapTitle: 'Mapa ativo',
    listTab: 'Lista',
    mapTab: 'Mapa',
    focusIdle: 'Selecione um grupo ou educador para centralizar seus nucleos no mapa.',
    focusPrefix: 'Mapa vinculado a',
    summaryLabel: 'visiveis agora',
  },
  en: {
    eyebrow: 'Public directory',
    intro: 'Search, change the focus, and use the view that works best for each screen size.',
    helper: 'On mobile, the list comes first. The map is one tap away when you need it.',
    searchLabel: 'Search the directory',
    searchButton: 'Search',
    emptyTitle: 'No results for this search',
    emptyBody: 'Try another city, group, or country to widen the search.',
    unavailableTitle: 'Directory temporarily unavailable',
    unavailableBody: 'Firestore could not be reached with the current credentials yet, so the interface is ready and waiting for live data.',
    groupsHint: 'Each group opens a community view and the map shows its related nucleos.',
    educatorsHint: 'Each educator opens their training locations and links them to the map.',
    listTitle: 'Results',
    mapTitle: 'Live map',
    listTab: 'List',
    mapTab: 'Map',
    focusIdle: 'Select a group or educator to center their related nucleos on the map.',
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

function createSearchHaystack(item: MapNucleo | PublicUserProfile | Group) {
  if ('nickname' in item) {
    return [item.name, item.surname, item.nickname, item.country, item.bio]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  }

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

function getEntityId(item: MapNucleo | PublicUserProfile | Group) {
  return 'uid' in item ? item.uid : item.id
}

function getEntityName(item: MapNucleo | PublicUserProfile | Group) {
  if ('nickname' in item) {
    return item.nickname?.trim() || [item.name, item.surname].filter(Boolean).join(' ').trim() || item.uid
  }

  return item.name
}

export default function MapClientShell({
  locale,
  initialNucleos,
  initialEducators,
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

    if (filter === 'educators') {
      const results = normalizedQuery
        ? initialEducators.filter((educator) => createSearchHaystack(educator).includes(normalizedQuery))
        : initialEducators

      return results.sort((left, right) =>
        (left.nickname || left.name).localeCompare(right.nickname || right.name)
      )
    }

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
  }, [deferredQuery, filter, initialEducators, initialGroups, initialNucleos])

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

    if (filter === 'educators') {
      return initialNucleos.filter(
        (nucleo) =>
          nucleo.responsibleEducatorId === activeId || nucleo.coEducatorIds?.includes(activeId)
      )
    }

    if (filter === 'groups') {
      return initialNucleos.filter((nucleo) => nucleo.groupId === activeId)
    }

    return searchResults as MapNucleo[]
  }, [activeId, filter, initialNucleos, searchResults])

  const hint = copy[`${filter}Hint` as keyof LocaleCopy] || null
  const activeEntity = searchResults.find((item) => getEntityId(item) === activeId) ?? null
  const filterCounts = {
    nucleos: initialNucleos.length,
    groups: initialGroups.length,
    educators: initialEducators.length,
  }

  return (
    <div className="px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-20">
      <div className="mx-auto max-w-[1280px]">
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
                {t('title')}
              </h1>
              <p className="mt-4 max-w-[58ch] text-sm leading-7 text-text-secondary">
                {copy.intro}
              </p>
              <p className="mt-2 text-sm leading-7 text-text-muted">{copy.helper}</p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
                <div className="flex flex-col gap-3 lg:flex-row">
                  <label className="flex min-w-0 flex-1 items-center gap-4 rounded-[24px] border border-border bg-surface/80 px-4 py-4 focus-within:border-accent/35">
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-[16px] border border-accent/20 bg-[rgba(121,207,114,0.12)] text-accent"
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
                    className="inline-flex h-[68px] cursor-pointer items-center justify-center rounded-[24px] bg-accent px-6 text-sm font-semibold uppercase tracking-[0.18em] text-black transition-transform hover:-translate-y-0.5 focus-visible:outline-none"
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
                        className={`cursor-pointer rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:outline-none ${
                          isActive
                            ? 'border-accent/30 bg-[rgba(121,207,114,0.14)] text-accent'
                            : 'border-border bg-card/85 text-text-secondary hover:border-accent/18 hover:text-text'
                        }`}
                      >
                        {`${labels[item]} (${filterCounts[item]})`}
                      </button>
                    )
                  })}
                </div>
              </form>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {FILTERS.map((item) => {
                const labels = {
                  nucleos: t('filterNucleos'),
                  groups: t('filterGroups'),
                  educators: t('filterEducators'),
                }

                return (
                  <div
                    key={item}
                    className="rounded-[24px] border border-border bg-card/80 px-4 py-4"
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
          <div className="mt-5 rounded-[22px] border border-accent/20 bg-[rgba(121,207,114,0.08)] px-5 py-4 text-sm leading-7 text-text-secondary">
            {hint as string}
          </div>
        ) : null}

        <div className="mt-5 lg:hidden">
          <div className="flex rounded-full border border-border bg-card/80 p-1">
            {(['list', 'map'] as MobileView[]).map((view) => {
              const isActive = view === mobileView

              return (
                <button
                  key={view}
                  type="button"
                  onClick={() => setMobileView(view)}
                  className={`flex-1 rounded-full px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                    isActive
                      ? 'bg-[rgba(121,207,114,0.14)] text-accent'
                      : 'text-text-secondary'
                  }`}
                >
                  {view === 'list' ? copy.listTab : copy.mapTab}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[430px_minmax(0,1fr)]">
          <section
            className={`${mobileView === 'list' ? 'block' : 'hidden'} rounded-[26px] border border-border bg-card p-4 shadow-sm lg:block`}
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
              <div className="mt-4 rounded-[20px] border border-dashed border-border bg-surface-muted/80 px-4 py-5">
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

                  if (filter === 'educators') {
                    const educator = item as PublicUserProfile
                    return (
                      <div key={educator.uid}>
                        {showAd && <AdInFeed />}
                        <div onClick={() => setActiveId(educator.uid)} className="cursor-pointer">
                          <EducatorCard educator={educator} locale={locale} />
                        </div>
                      </div>
                    )
                  }

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
                <div className="rounded-[22px] border border-dashed border-border bg-surface-muted/80 px-5 py-8 text-center">
                  <h3 className="text-lg font-semibold tracking-[0.01em] text-text">
                    {copy.emptyTitle}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">{copy.emptyBody}</p>
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
                <div className="mb-4 rounded-[20px] border border-border bg-card/80 px-4 py-4 text-sm leading-7 text-text-secondary">
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
