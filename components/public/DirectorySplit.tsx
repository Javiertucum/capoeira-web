'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import MapView, { type MapMarker, type MapViewHandle, type MapPopup } from '@/components/public/map/MapView'
import Modal from '@/components/public/Modal'
import { normalizeSocialLink } from '@/lib/social-links'
import { haversineDistanceKm } from '@/lib/geo'
import CountryFlag from '@/components/public/CountryFlag'
import { getDayShort } from '@/lib/day-short'
import type { Group, MapNucleo, PublicUserProfile } from '@/lib/types'

export type DirectoryEducator = PublicUserProfile & {
  groupName?: string | null
  graduationName?: string | null
}

type Tab = 'nucleos' | 'groups' | 'educators'

const DEFAULT_CENTER: [number, number] = [-20, 10]

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
          className="grid h-7 w-7 place-items-center rounded-full border border-border bg-white text-[#4C463C]! transition-colors duration-150 hover:border-accent hover:text-accent-ink"
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
        className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"
      />
    )
  }
  return (
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-surface text-sm font-bold text-text-secondary">
      {initials || '?'}
    </div>
  )
}

export default function DirectorySplit({
  locale,
  stats,
  nucleos,
  groups,
  educators,
}: {
  locale: string
  stats: { educators: number; nucleos: number; groups: number; countries: number }
  nucleos: MapNucleo[]
  groups: Group[]
  educators: DirectoryEducator[]
}) {
  const t = useTranslations('map')
  const tHero = useTranslations('hero')
  const tStats = useTranslations('stats')
  const tProfile = useTranslations('profile')

  const [tab, setTab] = useState<Tab>('groups')
  const [query, setQuery] = useState('')
  const [selectedNucleoId, setSelectedNucleoId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'denied'>('idle')
  const [contactNucleo, setContactNucleo] = useState<MapNucleo | null>(null)
  const mapRef = useRef<MapViewHandle>(null)
  const dayShort = getDayShort(locale)

  const normalizedQuery = query.trim().toLowerCase()

  function matches(...values: Array<string | null | undefined>) {
    if (!normalizedQuery) return true
    return values.some((v) => v?.toLowerCase().includes(normalizedQuery))
  }

  const filteredNucleos = useMemo(() => {
    const result = nucleos.filter((n) => matches(n.name, n.city, n.country, n.groupName))
    if (!userLocation) return result
    return [...result].sort((a, b) => {
      const da = typeof a.latitude === 'number' && typeof a.longitude === 'number'
        ? haversineDistanceKm({ lat: userLocation[1], lng: userLocation[0] }, { lat: a.latitude, lng: a.longitude })
        : Infinity
      const db = typeof b.latitude === 'number' && typeof b.longitude === 'number'
        ? haversineDistanceKm({ lat: userLocation[1], lng: userLocation[0] }, { lat: b.latitude, lng: b.longitude })
        : Infinity
      return da - db
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nucleos, normalizedQuery, userLocation])

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

  const center = useMemo((): [number, number] => {
    if (mappableNucleos.length === 0) return DEFAULT_CENTER
    const sum = mappableNucleos.reduce(
      (acc, n) => ({ lat: acc.lat + (n.latitude ?? 0), lng: acc.lng + (n.longitude ?? 0) }),
      { lat: 0, lng: 0 }
    )
    return [sum.lng / mappableNucleos.length, sum.lat / mappableNucleos.length]
  }, [mappableNucleos])

  const selectedNucleo = mappableNucleos.find((n) => n.id === selectedNucleoId) ?? null

  const mapCenter: [number, number] = selectedNucleo
    ? [selectedNucleo.longitude as number, selectedNucleo.latitude as number]
    : userLocation ?? center
  const mapZoom = selectedNucleo ? 12 : userLocation ? 10 : mappableNucleos.length > 0 ? 2 : 1

  const mapMarkers: MapMarker[] = useMemo(() => {
    const items: MapMarker[] = mappableNucleos.map((n) => ({
      id: n.id,
      lng: n.longitude as number,
      lat: n.latitude as number,
      variant: 'nucleo',
    }))
    if (userLocation) {
      items.push({ id: '__user__', lng: userLocation[0], lat: userLocation[1], variant: 'user' })
    }
    return items
  }, [mappableNucleos, userLocation])

  const mapPopup: MapPopup | null = useMemo(() => {
    if (!selectedNucleo) return null
    return {
      id: selectedNucleo.id,
      html: `
        <div style="min-width:180px;font-size:0.875rem">
          <p style="font-weight:700;color:var(--color-ink)">${selectedNucleo.name}</p>
          <p style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--color-accent-ink)">${selectedNucleo.groupName}</p>
          <p style="margin-top:4px;font-size:0.75rem;color:var(--color-text-secondary)">${[selectedNucleo.city, selectedNucleo.country].filter(Boolean).join(', ')}</p>
          <a href="/${locale}/nucleos/${selectedNucleo.groupId}/${selectedNucleo.id}" style="margin-top:8px;display:inline-flex;align-items:center;gap:4px;font-size:0.75rem;font-weight:700;color:var(--color-accent-ink)">${t('seeContact')}</a>
        </div>
      `,
    }
  }, [selectedNucleo, locale, t])

  function handleNearMe() {
    if (!('geolocation' in navigator)) {
      setLocationStatus('denied')
      return
    }
    setLocationStatus('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: [number, number] = [pos.coords.longitude, pos.coords.latitude]
        setUserLocation(next)
        setSelectedNucleoId(null)
        setLocationStatus('idle')
        mapRef.current?.flyTo({ center: next, zoom: 10 })
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const resultCount = tab === 'nucleos' ? filteredNucleos.length : tab === 'groups' ? filteredGroups.length : filteredEducators.length

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: 'groups', label: t('filterGroups') },
    { key: 'nucleos', label: t('filterNucleos') },
    { key: 'educators', label: t('filterEducators') },
  ]

  return (
    <section id="directorio" className="scroll-mt-[72px] bg-bg pt-[72px] lg:flex lg:h-screen lg:flex-col lg:overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 border-b border-border px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Title + stats */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
            <h1
              className="font-black text-ink leading-[0.98] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(22px, 2.4vw, 30px)' }}
            >
              {tHero('eyebrow')}
            </h1>
            <div className="flex items-center gap-3 text-xs font-bold text-text-secondary">
              <span><span className="text-ink">{stats.nucleos}</span> {tStats('nucleos').toLowerCase()}</span>
              <span className="text-border">·</span>
              <span><span className="text-ink">{stats.groups}</span> {tStats('groups').toLowerCase()}</span>
              <span className="text-border">·</span>
              <span><span className="text-ink">{stats.educators}</span> {tStats('educators').toLowerCase()}</span>
              <span className="text-border">·</span>
              <span><span className="text-ink">{stats.countries}</span> {tStats('countries').toLowerCase()}</span>
            </div>
          </div>

          {/* Tabs + search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1">
              {tabs.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors duration-150 ease-[var(--ease-out)] ${
                    tab === item.key ? 'bg-ink text-bg' : 'text-text-secondary hover:text-ink'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-[260px]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="h-10 w-full rounded-full border border-border bg-card px-4 pr-9 text-sm text-ink placeholder:text-text-muted focus:border-accent focus:outline-none"
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

            <button
              type="button"
              onClick={handleNearMe}
              disabled={locationStatus === 'locating'}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-bold text-ink transition-colors duration-150 ease-[var(--ease-out)] hover:border-accent disabled:opacity-60"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
              {locationStatus === 'locating' ? t('locating') : t('nearMe')}
            </button>

            <span className="mono shrink-0 text-[11px] uppercase tracking-[0.14em] text-text-muted">
              {t('results', { count: resultCount })}
            </span>
          </div>

          {locationStatus === 'denied' && (
            <p className="text-xs font-medium text-red-500">{t('locationDenied')}</p>
          )}
        </div>
      </div>

      {/* Body: map + list */}
      <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden">
        {/* Map */}
        <div className="order-1 h-[45vh] shrink-0 lg:order-2 lg:h-auto lg:w-[50%]">
          <MapView
            ref={mapRef}
            className="h-full w-full"
            center={mapCenter}
            zoom={mapZoom}
            markers={mapMarkers}
            selectedId={selectedNucleoId}
            onMarkerClick={setSelectedNucleoId}
            popup={mapPopup}
            onPopupClose={() => setSelectedNucleoId(null)}
          />
        </div>

        {/* List */}
        <div className="order-2 space-y-3 p-4 sm:p-5 lg:order-1 lg:w-[50%] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-border">
          {tab === 'nucleos' &&
            (filteredNucleos.length > 0 ? (
              filteredNucleos.map((nucleo) => (
                <div
                  key={nucleo.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedNucleoId(nucleo.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedNucleoId(nucleo.id)
                  }}
                  className={`block w-full cursor-pointer rounded-2xl border bg-card p-4 text-left transition-colors duration-150 ease-[var(--ease-out)] hover:border-accent ${
                    selectedNucleoId === nucleo.id ? 'border-accent shadow-[0_0_0_1px_var(--accent)]' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {nucleo.groupLogoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={nucleo.groupLogoUrl} alt={nucleo.groupName} className="h-9 w-9 shrink-0 rounded-xl border border-border object-cover" />
                      ) : (
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-surface text-xs font-bold text-text-secondary">
                          {nucleo.groupName?.[0]?.toUpperCase() ?? '?'}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-ink">
                          {nucleo.name}
                          <CountryFlag country={nucleo.country} className="ml-2" />
                        </p>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">{nucleo.groupName}</p>
                      </div>
                    </div>
                    {nucleo.schedules && nucleo.schedules.length > 0 && (
                      <span className="chip acc shrink-0 text-[10px]">{nucleo.schedules.length} {tProfile('schedules').toLowerCase()}</span>
                    )}
                  </div>
                  {(nucleo.city || nucleo.country) && (
                    <p className="mt-2 text-sm text-text-secondary">
                      {[nucleo.city, nucleo.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {nucleo.address && <p className="mt-1 text-xs text-text-muted">{nucleo.address}</p>}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setContactNucleo(nucleo)
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-accent-ink hover:underline"
                  >
                    {t('seeContact')}
                  </button>
                </div>
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
                      <img src={group.logoUrl} alt={group.name} className="h-11 w-11 shrink-0 rounded-2xl border border-border object-cover" />
                    ) : (
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border bg-surface text-sm font-bold text-text-secondary">
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
                      {(educator.graduationName || educator.groupName) && (
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">
                          {[educator.graduationName, educator.groupName].filter(Boolean).join(' · ')}
                        </p>
                      )}
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
      </div>

      {contactNucleo && (
        <Modal open={!!contactNucleo} onClose={() => setContactNucleo(null)} title={contactNucleo.name}>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-ink">
              {contactNucleo.groupName}
              <CountryFlag country={contactNucleo.country} className="ml-2" />
            </p>
            {(contactNucleo.address || contactNucleo.city || contactNucleo.country) && (
              <p className="text-sm text-text-secondary">
                {[contactNucleo.address, contactNucleo.city, contactNucleo.country].filter(Boolean).join(', ')}
              </p>
            )}
            {contactNucleo.schedules && contactNucleo.schedules.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {[...contactNucleo.schedules]
                  .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
                  .map((s, i) => (
                    <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-surface px-3 py-2">
                      <span className="rounded-full bg-card px-2.5 py-0.5 text-xs font-bold text-text-secondary">
                        {dayShort[s.dayOfWeek] ?? s.dayOfWeek}
                      </span>
                      <span className="text-sm text-text-secondary">{s.startTime} – {s.endTime}</span>
                    </div>
                  ))}
              </div>
            )}
            <Link
              href={`/${locale}/nucleos/${contactNucleo.groupId}/${contactNucleo.id}`}
              className="inline-flex items-center gap-1 text-sm font-bold text-accent-ink hover:underline"
            >
              {tProfile('viewProfile')} →
            </Link>
          </div>
        </Modal>
      )}
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
