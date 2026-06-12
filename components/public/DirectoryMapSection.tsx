'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { GoogleMap, MarkerF, InfoWindowF, useJsApiLoader } from '@react-google-maps/api'
import { normalizeSocialLink } from '@/lib/social-links'
import type { Group, MapNucleo, PublicUserProfile } from '@/lib/types'

export type DirectoryEducator = PublicUserProfile & {
  groupName?: string | null
  graduationName?: string | null
}

type Tab = 'nucleos' | 'groups' | 'educators'

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' }
const DEFAULT_CENTER = { lat: 10, lng: -20 }

const SOCIAL_PLATFORMS = ['instagram', 'facebook', 'whatsapp', 'youtube', 'tiktok', 'website'] as const

function SocialIcon({ platform }: { platform: typeof SOCIAL_PLATFORMS[number] }) {
  switch (platform) {
    case 'instagram':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'facebook':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-4-1L3 21l1.3-3.9a8.38 8.38 0 0 1-1.2-4.5 8.5 8.5 0 1 1 17.9-1.1z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="3" />
          <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2v12.5a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 2a5 5 0 0 0 5 5" />
        </svg>
      )
    case 'website':
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
        </svg>
      )
  }
}

function ContactLinks({ socialLinks }: { socialLinks?: PublicUserProfile['socialLinks'] }) {
  if (!socialLinks) return null
  const links = SOCIAL_PLATFORMS
    .map((platform) => ({ platform, href: normalizeSocialLink(platform, socialLinks[platform]) }))
    .filter((l): l is { platform: typeof SOCIAL_PLATFORMS[number]; href: string } => Boolean(l.href))

  if (links.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {links.map((l) => (
        <a
          key={l.platform}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="grid h-7 w-7 place-items-center rounded-full border border-border bg-white text-text-secondary transition-colors duration-150 hover:border-accent hover:text-accent-ink"
          aria-label={l.platform}
        >
          <SocialIcon platform={l.platform} />
        </a>
      ))}
    </div>
  )
}

function Avatar({ name, surname, avatarUrl }: { name: string; surname: string; avatarUrl?: string | null }) {
  const initials = `${name?.[0] ?? ''}${surname?.[0] ?? ''}`.toUpperCase()
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={`${name} ${surname}`}
        className="h-12 w-12 shrink-0 rounded-full border border-border object-cover"
      />
    )
  }
  return (
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-surface text-sm font-bold text-text-secondary">
      {initials || '?'}
    </div>
  )
}

export default function DirectoryMapSection({
  locale,
  nucleos,
  groups,
  educators,
}: {
  locale: string
  nucleos: MapNucleo[]
  groups: Group[]
  educators: DirectoryEducator[]
}) {
  const t = useTranslations('map')
  const tCat = useTranslations('categories')
  const tProfile = useTranslations('profile')

  const [tab, setTab] = useState<Tab>('nucleos')
  const [query, setQuery] = useState('')
  const [selectedNucleoId, setSelectedNucleoId] = useState<string | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: 'agenda-capoeiragem-directory-map',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  })

  const normalizedQuery = query.trim().toLowerCase()

  function matches(...values: Array<string | null | undefined>) {
    if (!normalizedQuery) return true
    return values.some((v) => v?.toLowerCase().includes(normalizedQuery))
  }

  const filteredNucleos = useMemo(
    () => nucleos.filter((n) => matches(n.name, n.city, n.country, n.groupName)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nucleos, normalizedQuery]
  )

  const filteredGroups = useMemo(
    () =>
      groups.filter((g) =>
        matches(g.name, g.description, ...(g.representedCountries ?? []), ...(g.representedCities ?? []))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups, normalizedQuery]
  )

  const filteredEducators = useMemo(
    () =>
      educators.filter((e) =>
        matches(e.name, e.surname, e.nickname, e.country, e.groupName, e.graduationName)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [educators, normalizedQuery]
  )

  const mappableNucleos = useMemo(
    () => filteredNucleos.filter((n) => typeof n.latitude === 'number' && typeof n.longitude === 'number'),
    [filteredNucleos]
  )

  const center = useMemo(() => {
    if (mappableNucleos.length === 0) return DEFAULT_CENTER
    const sum = mappableNucleos.reduce(
      (acc, n) => ({ lat: acc.lat + (n.latitude ?? 0), lng: acc.lng + (n.longitude ?? 0) }),
      { lat: 0, lng: 0 }
    )
    return { lat: sum.lat / mappableNucleos.length, lng: sum.lng / mappableNucleos.length }
  }, [mappableNucleos])

  const selectedNucleo = mappableNucleos.find((n) => n.id === selectedNucleoId) ?? null

  const resultCount = tab === 'nucleos' ? filteredNucleos.length : tab === 'groups' ? filteredGroups.length : filteredEducators.length

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: 'nucleos', label: t('filterNucleos') },
    { key: 'groups', label: t('filterGroups') },
    { key: 'educators', label: t('filterEducators') },
  ]

  return (
    <section id="directorio" className="border-t border-border bg-bg py-16 lg:py-24">
      <div className="page-shell">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="eyebrow acc">{t('title')}</p>
            <h2
              className="font-black text-ink leading-[0.98] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}
            >
              {tCat('title')}
            </h2>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-[320px]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="h-12 w-full rounded-2xl border border-border bg-card px-5 pr-10 text-sm text-ink placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={t('clearSearch')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-ink"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-colors duration-150 ease-[var(--ease-out)] ${
                tab === item.key ? 'bg-ink text-bg' : 'text-text-secondary hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
          <span className="mono px-4 text-[11px] uppercase tracking-[0.14em] text-text-muted">
            {t('results', { count: resultCount })}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* List */}
          <div className="order-2 max-h-[600px] space-y-3 overflow-y-auto pr-1 lg:order-1">
            {tab === 'nucleos' &&
              (filteredNucleos.length > 0 ? (
                filteredNucleos.map((nucleo) => (
                  <button
                    key={nucleo.id}
                    type="button"
                    onClick={() => setSelectedNucleoId(nucleo.id)}
                    className={`block w-full rounded-2xl border bg-card p-4 text-left transition-colors duration-150 ease-[var(--ease-out)] hover:border-accent ${
                      selectedNucleoId === nucleo.id ? 'border-accent shadow-[0_0_0_1px_var(--accent)]' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-ink">{nucleo.name}</p>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">{nucleo.groupName}</p>
                      </div>
                      {nucleo.schedules && nucleo.schedules.length > 0 && (
                        <span className="chip acc shrink-0 text-[10px]">{nucleo.schedules.length} {tProfile('schedules').toLowerCase()}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">
                      {[nucleo.city, nucleo.country].filter(Boolean).join(', ') || tProfile('unspecified')}
                    </p>
                    {nucleo.address && <p className="mt-1 text-xs text-text-muted">{nucleo.address}</p>}
                    <Link
                      href={`/${locale}/nucleos/${nucleo.groupId}/${nucleo.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-accent-ink hover:underline"
                    >
                      {t('seeContact')}
                    </Link>
                  </button>
                ))
              ) : (
                <EmptyState t={t} onClear={() => setQuery('')} hasQuery={Boolean(query)} />
              ))}

            {tab === 'groups' &&
              (filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <Link
                    key={group.id}
                    href={`/${locale}/grupos/${group.id}`}
                    className="block rounded-2xl border border-border bg-card p-4 transition-colors duration-150 ease-[var(--ease-out)] hover:border-accent"
                  >
                    <div className="flex items-start gap-3">
                      {group.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={group.logoUrl} alt={group.name} className="h-12 w-12 shrink-0 rounded-2xl border border-border object-cover" />
                      ) : (
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-border bg-surface text-sm font-bold text-text-secondary">
                          {group.name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-ink">{group.name}</p>
                        {group.graduationSystemName && (
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">{group.graduationSystemName}</p>
                        )}
                        {group.description && <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{group.description}</p>}
                      </div>
                    </div>
                    {(group.representedCountries?.length || group.representedCities?.length) ? (
                      <p className="mt-3 text-xs text-text-muted">
                        {[...(group.representedCities ?? []), ...(group.representedCountries ?? [])].join(' · ')}
                      </p>
                    ) : null}
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-accent-ink hover:underline">
                      {tProfile('viewProfile')}
                    </span>
                  </Link>
                ))
              ) : (
                <EmptyState t={t} onClear={() => setQuery('')} hasQuery={Boolean(query)} />
              ))}

            {tab === 'educators' &&
              (filteredEducators.length > 0 ? (
                filteredEducators.map((educator) => (
                  <Link
                    key={educator.uid}
                    href={`/${locale}/educadores/${educator.uid}`}
                    className="block rounded-2xl border border-border bg-card p-4 transition-colors duration-150 ease-[var(--ease-out)] hover:border-accent"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar name={educator.name} surname={educator.surname} avatarUrl={educator.avatarUrl} />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-ink">
                          {educator.name} {educator.surname}
                          {educator.nickname && <span className="text-text-muted"> · {educator.nickname}</span>}
                        </p>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">
                          {[educator.graduationName, educator.groupName].filter(Boolean).join(' · ') || tProfile('unspecified')}
                        </p>
                        {educator.bio && <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{educator.bio}</p>}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <ContactLinks socialLinks={educator.socialLinks} />
                          {educator.country && <span className="text-xs text-text-muted">{educator.country}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyState t={t} onClear={() => setQuery('')} hasQuery={Boolean(query)} />
              ))}
          </div>

          {/* Map */}
          <div className="order-1 h-[400px] overflow-hidden rounded-[28px] border border-border lg:order-2 lg:h-[600px]">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={selectedNucleo ? { lat: selectedNucleo.latitude as number, lng: selectedNucleo.longitude as number } : center}
                zoom={selectedNucleo ? 12 : mappableNucleos.length > 0 ? 2 : 1}
                options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
              >
                {mappableNucleos.map((nucleo) => (
                  <MarkerF
                    key={nucleo.id}
                    position={{ lat: nucleo.latitude as number, lng: nucleo.longitude as number }}
                    onClick={() => setSelectedNucleoId(nucleo.id)}
                  />
                ))}
                {selectedNucleo && (
                  <InfoWindowF
                    position={{ lat: selectedNucleo.latitude as number, lng: selectedNucleo.longitude as number }}
                    onCloseClick={() => setSelectedNucleoId(null)}
                  >
                    <div className="min-w-[180px] text-sm">
                      <p className="font-bold text-ink">{selectedNucleo.name}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">{selectedNucleo.groupName}</p>
                      <p className="mt-1 text-xs text-text-secondary">
                        {[selectedNucleo.city, selectedNucleo.country].filter(Boolean).join(', ')}
                      </p>
                      <Link
                        href={`/${locale}/nucleos/${selectedNucleo.groupId}/${selectedNucleo.id}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-accent-ink hover:underline"
                      >
                        {t('seeContact')}
                      </Link>
                    </div>
                  </InfoWindowF>
                )}
              </GoogleMap>
            ) : (
              <div className="grid h-full w-full place-items-center bg-surface text-sm text-text-muted">
                {t('title')}…
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function EmptyState({
  t,
  hasQuery,
  onClear,
}: {
  t: ReturnType<typeof useTranslations>
  hasQuery: boolean
  onClear: () => void
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
      <p className="font-bold text-ink">{t('emptyTitle')}</p>
      <p className="mt-1 text-sm text-text-secondary">{t('emptyBody')}</p>
      {hasQuery && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 rounded-full border border-border px-4 py-2 text-xs font-bold text-ink hover:border-accent"
        >
          {t('clearSearch')}
        </button>
      )}
    </div>
  )
}
