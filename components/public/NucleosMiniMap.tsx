'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import type { MapMarker, MapPopup } from '@/components/public/map/MapView'
import type { MapNucleo } from '@/lib/types'

const MapView = dynamic(() => import('@/components/public/map/MapView'), {
  ssr: false,
  loading: () => <div className="mt-4 h-[280px] w-full animate-pulse rounded-2xl border border-border bg-surface-muted" />,
})

export default function NucleosMiniMap({
  nucleos,
  locale,
  seeContactLabel,
}: {
  nucleos: MapNucleo[]
  locale: string
  seeContactLabel: string
}) {
  const t = useTranslations('map')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mapEngaged, setMapEngaged] = useState(false)

  const mappable = useMemo(
    () => nucleos.filter((n) => typeof n.latitude === 'number' && typeof n.longitude === 'number'),
    [nucleos]
  )

  const center = useMemo((): [number, number] => {
    if (mappable.length === 0) return [0, 0]
    const sum = mappable.reduce(
      (acc, n) => ({ lat: acc.lat + (n.latitude ?? 0), lng: acc.lng + (n.longitude ?? 0) }),
      { lat: 0, lng: 0 }
    )
    return [sum.lng / mappable.length, sum.lat / mappable.length]
  }, [mappable])

  const markers: MapMarker[] = useMemo(
    () => mappable.map((n) => ({ id: n.id, lng: n.longitude as number, lat: n.latitude as number, variant: 'nucleo' as const })),
    [mappable]
  )

  const selected = mappable.find((n) => n.id === selectedId) ?? null

  const popup: MapPopup | null = useMemo(() => {
    if (!selected) return null
    return {
      id: selected.id,
      html: `
        <div style="min-width:160px;font-size:0.875rem">
          <p style="font-weight:700;color:var(--color-ink)">${selected.name}</p>
          <p style="margin-top:4px;font-size:0.75rem;color:var(--color-text-secondary)">${[selected.city, selected.country].filter(Boolean).join(', ')}</p>
          <a href="/${locale}/nucleos/${selected.groupId}/${selected.id}" style="margin-top:8px;display:inline-flex;align-items:center;gap:4px;font-size:0.75rem;font-weight:700;color:var(--color-accent-ink)">${seeContactLabel}</a>
        </div>
      `,
    }
  }, [selected, locale, seeContactLabel])

  if (mappable.length === 0) return null

  if (!mapEngaged) {
    return (
      <button
        type="button"
        onClick={() => setMapEngaged(true)}
        className="group relative mt-4 flex h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-[linear-gradient(135deg,var(--surface-muted),var(--surface))]"
      >
        <span className="flex flex-col items-center gap-2 rounded-2xl bg-card px-5 py-4 text-center shadow-soft transition-transform duration-150 ease-[var(--ease-out)] group-hover:scale-[1.03]">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-white">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C7.582 2 4 5.582 4 10c0 6 8 12 8 12s8-6 8-12c0-4.418-3.582-8-8-8Z" fill="currentColor" />
              <circle cx="12" cy="10" r="3" fill="white" />
            </svg>
          </span>
          <span className="text-sm font-bold text-ink">{t('activateMap')}</span>
          <span className="text-xs text-text-secondary">{t('activateMapHint', { count: mappable.length })}</span>
        </span>
      </button>
    )
  }

  return (
    <MapView
      className="mt-4 h-[280px] w-full overflow-hidden rounded-2xl border border-border"
      center={center}
      zoom={mappable.length > 1 ? 2 : 5}
      markers={markers}
      selectedId={selectedId}
      onMarkerClick={setSelectedId}
      popup={popup}
      onPopupClose={() => setSelectedId(null)}
    />
  )
}
