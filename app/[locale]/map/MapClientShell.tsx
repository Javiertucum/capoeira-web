'use client'

import { useDeferredValue, useEffect, useMemo, useState, useTransition, type FormEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import MapView from '@/components/public/MapView'
import NucleoListItem from '@/components/public/NucleoListItem'
import EducatorCard from '@/components/public/EducatorCard'
import GroupCard from '@/components/public/GroupCard'
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
    intro: 'Explora núcleos activos, cambia el foco del directorio y centra el mapa en segundos.',
    emptyTitle: 'Sin resultados para tu búsqueda',
    emptyBody: 'Prueba otra ciudad, grupo o país para ampliar la exploración.',
    unavailableTitle: 'Directorio no disponible por ahora',
    unavailableBody: 'Todavía no pudimos leer Firestore con las credenciales actuales, así que mostramos la interfaz lista para cuando el acceso quede conectado.',
    groupsHint: 'Explora las comunidades y organizaciones de capoeira registradas.',
    educatorsHint: 'Maestros, profesores e instructores de todo el mundo.',
    listTitle: 'Resultados',
    mapTitle: 'Mapa activo',
  },
  pt: {
    searchButton: 'Buscar',
    intro: 'Explore núcleos ativos, mude o foco do diretório e centralize o mapa em segundos.',
    emptyTitle: 'Nenhum resultado para sua busca',
    emptyBody: 'Tente outra cidade, grupo ou país para ampliar a exploração.',
    unavailableTitle: 'Diretório indisponível no momento',
    unavailableBody: 'Ainda não foi possível ler o Firestore com as credenciais atuais, então mostramos a interface pronta para quando o acesso estiver conectado.',
    groupsHint: 'Explore as comunidades e organizações de capoeira registradas.',
    educatorsHint: 'Mestres, professores e instrutores de todo o mundo.',
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
    groupsHint: 'Explore registered capoeira communities and organizations.',
    educatorsHint: 'Masters, professors, and instructors from around the world.',
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

function createSearchHaystack(item: MapNucleo | PublicUserProfile | Group) {
  if ('nickname' in item) {
    // Educator: PublicUserProfile
    return [item.name, item.surname, item.nickname, item.country, item.bio].filter(Boolean).join(' ').toLowerCase()
  }
  
  if ('representedCountries' in item) {
    // Group
    return [item.name, ...(item.representedCountries ?? []), ...(item.representedCities ?? [])].filter(Boolean).join(' ').toLowerCase()
  }

  // Nucleo: MapNucleo
  const n = item as MapNucleo
  return [n.name, n.groupName, n.city, n.country, n.address].filter(Boolean).join(' ').toLowerCase()
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
  const deferredQuery = useDeferredValue(query)

  const searchResults = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()
    
    if (filter === 'educators') {
      const results = normalizedQuery
        ? initialEducators.filter(e => createSearchHaystack(e).includes(normalizedQuery))
        : initialEducators
      return results.sort((a, b) => (a.nickname || a.name).localeCompare(b.nickname || b.name))
    }
    
    if (filter === 'groups') {
      const results = normalizedQuery
        ? initialGroups.filter(g => createSearchHaystack(g).includes(normalizedQuery))
        : initialGroups
      return results.sort((a, b) => a.name.localeCompare(b.name))
    }

    const results = normalizedQuery
      ? initialNucleos.filter((n) => createSearchHaystack(n).includes(normalizedQuery))
      : initialNucleos
    return results.sort((a, b) => a.name.localeCompare(b.name))
  }, [deferredQuery, filter, initialEducators, initialGroups, initialNucleos])

  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (searchResults.length > 0 && !activeId) {
      const first = searchResults[0]
      setActiveId('uid' in first ? first.uid : first.id)
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
    syncUrl(query, nextFilter)
  }

  // The map always shows nucleos. If we filtered by group or educator, 
  // we might want to show only the nucleos related to that selected entity.
  const mapNucleos = useMemo(() => {
    if (!activeId) return initialNucleos
    
    if (filter === 'educators') {
      return initialNucleos.filter(n => n.responsibleEducatorId === activeId || n.coEducatorIds?.includes(activeId))
    }
    
    if (filter === 'groups') {
      return initialNucleos.filter(n => n.groupId === activeId)
    }
    
    return searchResults as MapNucleo[]
  }, [activeId, filter, initialNucleos, searchResults])

  const hint = copy[`${filter}Hint` as keyof LocaleCopy] || null

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
                    className="inline-flex h-[52px] cursor-pointer items-center justify-center rounded-[16px] bg-accent px-6 text-sm font-semibold tracking-[0.08em] text-[#08110C] transition-opacity hover:opacity-90 focus-visible:outline-none"
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
                            ? 'border-accent/35 bg-[rgba(102,187,106,0.14)] text-accent'
                            : 'border-border bg-surface text-text-muted hover:border-border hover:text-text'
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
            {hint as string}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
          <section className="order-2 rounded-[26px] border border-border bg-card p-4 shadow-[0_18px_60px_var(--shadow)] lg:order-1">
            <div className="flex items-end justify-between gap-4 border-b border-border px-2 pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-text-muted">
                  {copy.listTitle}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[0.01em] text-text">
                  {searchResults.length} {t('results' as any) || 'Resultados'}
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
              {searchResults.length > 0 ? (
                searchResults.map((item) => {
                  if (filter === 'educators') {
                    const e = item as PublicUserProfile
                    return (
                      <div key={e.uid} onClick={() => setActiveId(e.uid)} className="cursor-pointer">
                        <EducatorCard educator={e} locale={locale} />
                      </div>
                    )
                  }
                  if (filter === 'groups') {
                    const g = item as Group
                    return (
                      <div key={g.id} onClick={() => setActiveId(g.id)} className="cursor-pointer">
                        <GroupCard group={g} locale={locale} />
                      </div>
                    )
                  }
                  const n = item as MapNucleo
                  return (
                    <NucleoListItem
                      key={n.id}
                      nucleo={n}
                      isActive={n.id === activeId}
                      onSelect={setActiveId}
                    />
                  )
                })
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
                  {mapNucleos.length > 0
                    ? `${mapNucleos.length} ${t('results' as any) || 'Nucleos'}`
                    : copy.emptyBody}
                </p>
              </div>
            </div>

            <MapView
              nucleos={mapNucleos}
              activeNucleoId={activeId}
              onSelect={setActiveId}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
