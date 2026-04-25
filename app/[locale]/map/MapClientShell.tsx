'use client'

import { useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react'
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

  function handleSubmit(event: { preventDefault(): void }) {
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

  /* Labels por locale */
  const filterLabels: Record<FilterValue, string> = {
    nucleos: t('filterNucleos'),
    groups: t('filterGroups'),
  }
  const nearLabel = locale === 'en' ? 'Near me' : locale === 'pt' ? 'Perto de mim' : 'Cerca de mí'
  const filtrosLabel = locale === 'en' ? 'Filters' : 'Filtros'
  const titleText = locale === 'en' ? 'Capoeira map of the world' : locale === 'pt' ? 'Mapa da capoeira no mundo' : 'Mapa de la capoeira en el mundo'

  return (
    <div className="flex min-h-screen flex-col pb-16">
      {/* ── Header compacto ── */}
      <div className="border-b border-line-soft px-5 pb-4 pt-8 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          {/* Title + stats */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow acc block mb-2">{copy.eyebrow}</span>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {titleText}
              </h1>
            </div>
            <div className="flex gap-6 sm:pb-1">
              {([
                { n: filterCounts.nucleos, l: filterLabels.nucleos },
                { n: filterCounts.groups,  l: filterLabels.groups },
                { n: 44, l: locale === 'en' ? 'Countries' : 'Países' },
              ] as { n: number; l: string }[]).map(({ n, l }) => (
                <div key={l}>
                  <div className="text-[32px] font-bold leading-none tracking-[-0.03em] text-ink" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                    {n}
                  </div>
                  <div className="mono mt-1 text-[11px] uppercase tracking-[0.14em] text-ink-3">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search + near + buscar + filtros */}
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
              className="flex flex-1 items-center gap-2 rounded-full border border-line bg-surface p-1.5"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex flex-1 items-center gap-3 px-4 h-11 min-w-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink-3" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  aria-label={t('searchPlaceholder')}
                  className="flex-1 min-w-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-4"
                />
              </div>
              <div className="hidden h-6 w-px bg-line sm:block" />
              <button
                type="button"
                onClick={() => setQuery('')}
                className="hidden sm:flex h-11 items-center gap-2 px-4 text-[13px] text-ink-2 hover:text-ink transition-colors whitespace-nowrap"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
                </svg>
                {nearLabel}
              </button>
              <button
                type="submit"
                className="btn btn-accent shrink-0"
                style={{ height: 44, paddingInline: 20 }}
              >
                {isPending ? '…' : copy.searchButton}
              </button>
            </div>
            {/* Filtros button */}
            <button
              type="button"
              className="btn btn-ghost shrink-0"
              style={{ height: 44 }}
            >
              {filtrosLabel}
              {query.trim() && (
                <span className="chip acc sm ml-1">
                  {query.trim()}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setQuery(''); syncUrl('', filter) }}
                    className="ml-1 opacity-60 hover:opacity-100"
                    aria-label="Quitar filtro"
                  >×</button>
                </span>
              )}
            </button>
          </form>

          {/* Chips row: tipo | activos × | extra */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Tipo chips */}
            <button
              type="button"
              onClick={() => handleFilterChange('nucleos')}
              className={`chip ${filter === 'nucleos' ? 'active' : ''}`}
            >
              {filterLabels.nucleos}
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('groups')}
              className={`chip ${filter === 'groups' ? 'active' : ''}`}
            >
              {filterLabels.groups}
            </button>

            {/* Separador */}
            {query.trim() && <span className="h-5 w-px bg-line mx-1" />}

            {/* Active query chip con × */}
            {query.trim() && (
              <span className="chip acc">
                {query.trim()}
                <button
                  type="button"
                  onClick={() => { setQuery(''); syncUrl('', filter) }}
                  className="ml-1 opacity-70 hover:opacity-100 leading-none"
                  aria-label="Quitar filtro de búsqueda"
                >×</button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Hint grupos ── */}
      {hint && (
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-16">
          <div className="mt-4 rounded-[16px] border border-accent/20 bg-accent-soft/40 px-4 py-3 text-[13px] text-ink-2">
            {hint}
          </div>
        </div>
      )}

      {/* ── Mobile: toggle lista/mapa ── */}
      <div className="mx-auto w-full max-w-[1280px] mt-4 px-5 sm:px-8 lg:hidden lg:px-16">
        <div className="flex rounded-full border border-line bg-surface p-1">
          {(['list', 'map'] as MobileView[]).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setMobileView(view)}
              className={`flex-1 rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                view === mobileView ? 'bg-ink text-bg' : 'text-ink-2'
              }`}
            >
              {view === 'list' ? copy.listTab : copy.mapTab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Split: lista + mapa ── */}
      <div className="mx-auto mt-5 w-full max-w-[1280px] flex-1 px-5 sm:px-8 lg:px-16">
        <div className="grid gap-5 lg:grid-cols-[minmax(340px,460px)_minmax(0,1fr)]">

          {/* Lista */}
          <section className={`${mobileView === 'list' ? 'block' : 'hidden'} lg:block`}>
            {/* Panel header */}
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <span className="eyebrow block">{copy.listTitle}</span>
                <h2 className="mt-1 text-[26px] text-ink">
                  {t('results', { count: searchResults.length })}
                </h2>
              </div>
              <select className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-ink-2 outline-none">
                <option>{locale === 'en' ? 'Nearest' : locale === 'pt' ? 'Mais próximo' : 'Más cercano'}</option>
                <option>A–Z</option>
              </select>
            </div>

            {dataUnavailable && (
              <div className="card-paper px-4 py-5 mb-3">
                <p className="text-sm font-semibold text-ink">{copy.unavailableTitle}</p>
                <p className="mt-2 text-sm text-ink-2">{copy.unavailableBody}</p>
              </div>
            )}

            <div className="flex max-h-[calc(100svh-280px)] flex-col gap-3 overflow-y-auto pr-1">
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
                      <NucleoListItem nucleo={nucleo} isActive={nucleo.id === activeId} onSelect={setActiveId} />
                    </div>
                  )
                })
              ) : (
                <div className="card-paper px-5 py-10 text-center">
                  <p className="text-sm font-semibold text-ink">{t('emptyTitle')}</p>
                  <p className="mt-2 text-sm text-ink-2">{t('emptyBody')}</p>
                  <button
                    type="button"
                    onClick={() => { setQuery(''); handleFilterChange(filter) }}
                    className="btn btn-ghost btn-sm mt-5"
                  >
                    {t('clearSearch')}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Mapa */}
          <section className={`${mobileView === 'map' ? 'block' : 'hidden'} lg:block`}>
            <div className="lg:sticky lg:top-[88px]">
              {filter !== 'nucleos' && (
                <div className="mb-3 rounded-[14px] border border-line bg-surface-muted px-4 py-3 text-[13px] text-ink-2">
                  {activeEntity
                    ? `${copy.focusPrefix} ${getEntityName(activeEntity)}`
                    : copy.focusIdle}
                </div>
              )}
              <MapView nucleos={mapNucleos} activeNucleoId={activeId} onSelect={setActiveId} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
