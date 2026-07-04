'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import type { MapMarker, MapPopup } from '@/components/public/map/MapView'
import type { MapNucleo } from '@/lib/types'
import { escapeHtml } from '@/lib/site'

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
  const [selectedId, setSelectedId] = useState<string | null>(null)

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
    () =>
      mappable.map((n) => ({
        id: n.id,
        lng: n.longitude as number,
        lat: n.latitude as number,
        variant: 'nucleo' as const,
        logoUrl: n.groupLogoUrl,
        label: n.groupName,
      })),
    [mappable]
  )

  const selected = mappable.find((n) => n.id === selectedId) ?? null

  const popup: MapPopup | null = useMemo(() => {
    if (!selected) return null
    const safeName = escapeHtml(selected.name)
    const safeLocation = escapeHtml([selected.city, selected.country].filter(Boolean).join(', '))
    return {
      id: selected.id,
      html: `
        <div style="min-width:160px;font-size:0.875rem">
          <p style="font-weight:700;color:var(--color-ink)">${safeName}</p>
          <p style="margin-top:4px;font-size:0.75rem;color:var(--color-text-secondary)">${safeLocation}</p>
          <a href="/${locale}/nucleos/${selected.groupId}/${selected.id}" style="margin-top:8px;display:inline-flex;align-items:center;gap:4px;font-size:0.75rem;font-weight:700;color:var(--color-accent-ink)">${escapeHtml(seeContactLabel)}</a>
        </div>
      `,
    }
  }, [selected, locale, seeContactLabel])

  if (mappable.length === 0) return null

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
