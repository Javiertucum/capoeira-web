'use client'

import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import { useLocale } from 'next-intl'
import type { MapNucleo } from '@/lib/types'

type Props = Readonly<{
  nucleos: MapNucleo[]
  activeNucleoId: string | null
  onSelect: (id: string) => void
}>

type MapMarker = {
  id: string
  name: string
  groupName: string
  city?: string | null
  country?: string | null
  lat: number
  lng: number
}

type LocaleCopy = {
  loadingLabel: string
  missingKeyTitle: string
  missingKeyBody: string
  loadErrorTitle: string
  loadErrorBody: string
  noCoordinatesTitle: string
  noCoordinatesBody: string
}

const FALLBACK_CENTER = { lat: -14.235, lng: -51.9253 }

const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0f141c' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#c6c0b3' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f141c' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#27303d' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#8e8a80' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1c2431' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#131922' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1a212d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a2230' }] },
]

const COPY: Record<string, LocaleCopy> = {
  es: {
    loadingLabel: 'Cargando mapa',
    missingKeyTitle: 'Mapa no disponible',
    missingKeyBody: 'Agrega la API key de Google Maps para activar la vista interactiva.',
    loadErrorTitle: 'No pudimos cargar el mapa',
    loadErrorBody: 'La lista sigue disponible mientras resolvemos la conexion con Google Maps.',
    noCoordinatesTitle: 'Sin coordenadas publicas',
    noCoordinatesBody: 'Los nucleos apareceran en el mapa apenas tengan ubicacion georreferenciada.',
  },
  pt: {
    loadingLabel: 'Carregando mapa',
    missingKeyTitle: 'Mapa indisponivel',
    missingKeyBody: 'Adicione a chave da API do Google Maps para ativar a vista interativa.',
    loadErrorTitle: 'Nao foi possivel carregar o mapa',
    loadErrorBody: 'A lista continua disponivel enquanto resolvemos a conexao com o Google Maps.',
    noCoordinatesTitle: 'Sem coordenadas publicas',
    noCoordinatesBody: 'Os nucleos aparecerao no mapa assim que tiverem localizacao georreferenciada.',
  },
  en: {
    loadingLabel: 'Loading map',
    missingKeyTitle: 'Map unavailable',
    missingKeyBody: 'Add the Google Maps API key to enable the interactive map view.',
    loadErrorTitle: 'We could not load the map',
    loadErrorBody: 'The list is still available while the Google Maps connection is sorted out.',
    noCoordinatesTitle: 'No public coordinates yet',
    noCoordinatesBody: 'Nucleos will appear on the map as soon as they have geocoded locations.',
  },
}

function getCopy(locale: string) {
  return COPY[locale] ?? COPY.en
}

function hasValidCoordinates(nucleo: MapNucleo) {
  return (
    typeof nucleo.latitude === 'number' &&
    Number.isFinite(nucleo.latitude) &&
    typeof nucleo.longitude === 'number' &&
    Number.isFinite(nucleo.longitude)
  )
}

function toMarkers(nucleos: MapNucleo[]): MapMarker[] {
  return nucleos
    .filter(hasValidCoordinates)
    .map((nucleo) => ({
      id: nucleo.id,
      name: nucleo.name,
      groupName: nucleo.groupName,
      city: nucleo.city,
      country: nucleo.country,
      lat: nucleo.latitude as number,
      lng: nucleo.longitude as number,
    }))
}

function createMarkerIcon(isActive: boolean) {
  const fill = isActive ? '#66BB6A' : '#F3F1EA'
  const size = isActive ? 30 : 24
  const radius = isActive ? 11 : 8
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="${fill}" stroke="#10131A" stroke-width="3" />
    </svg>
  `.trim()

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
  }
}

function MapFallback({
  title,
  body,
  accent,
}: Readonly<{ title: string; body: string; accent?: string }>) {
  return (
    <div className="flex h-[420px] items-center justify-center rounded-[26px] border border-border bg-[linear-gradient(180deg,rgba(24,29,38,0.98)_0%,rgba(16,19,26,0.98)_100%)] p-6 shadow-[0_22px_70px_var(--shadow)] lg:h-[calc(100svh-170px)]">
      <div className="max-w-[420px] text-center">
        <div className="mb-4 text-[11px] uppercase tracking-[0.3em] text-accent">
          {accent ?? 'Agenda Capoeiragem'}
        </div>
        <h3 className="text-[28px] font-semibold tracking-[-0.04em] text-text">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-text-secondary">{body}</p>
      </div>
    </div>
  )
}

function LoadedMapView({
  apiKey,
  copy,
  markers,
  activeNucleoId,
  onSelect,
}: Readonly<{
  apiKey: string
  copy: LocaleCopy
  markers: MapMarker[]
  activeNucleoId: string | null
  onSelect: (id: string) => void
}>) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'agenda-capoeiragem-map',
    googleMapsApiKey: apiKey,
  })

  const activeMarker = markers.find((marker) => marker.id === activeNucleoId) ?? markers[0] ?? null
  const center = activeMarker
    ? { lat: activeMarker.lat, lng: activeMarker.lng }
    : FALLBACK_CENTER

  if (loadError) {
    return <MapFallback title={copy.loadErrorTitle} body={copy.loadErrorBody} accent="Google Maps" />
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-[26px] border border-border bg-card/80 p-6 shadow-[0_22px_70px_var(--shadow)] lg:h-[calc(100svh-170px)]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-[spin_1.6s_linear_infinite] rounded-full border-2 border-accent/20 border-t-accent" />
          <p className="mt-4 text-sm uppercase tracking-[0.24em] text-text-muted">
            {copy.loadingLabel}
          </p>
        </div>
      </div>
    )
  }

  if (markers.length === 0) {
    return <MapFallback title={copy.noCoordinatesTitle} body={copy.noCoordinatesBody} accent="Map data" />
  }

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-border shadow-[0_22px_70px_var(--shadow)]">
      <GoogleMap
        mapContainerClassName="h-[420px] w-full lg:h-[calc(100svh-170px)]"
        center={center}
        zoom={activeMarker ? 10 : 3}
        options={{
          disableDefaultUI: true,
          clickableIcons: false,
          styles: DARK_MAP_STYLES,
          zoomControl: true,
          minZoom: 2,
          maxZoom: 16,
        }}
      >
        {markers.map((marker) => (
          <MarkerF
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={`${marker.name} | ${marker.groupName}`}
            onClick={() => onSelect(marker.id)}
            icon={createMarkerIcon(marker.id === activeMarker?.id)}
          />
        ))}
      </GoogleMap>

      {activeMarker ? (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-[18px] border border-border/80 bg-[rgba(16,19,26,0.88)] px-4 py-3 backdrop-blur">
          <p className="text-[10px] uppercase tracking-[0.24em] text-accent">{activeMarker.groupName}</p>
          <p className="mt-2 text-sm font-semibold text-text">{activeMarker.name}</p>
          <p className="mt-1 text-sm text-text-secondary">
            {[activeMarker.city, activeMarker.country].filter(Boolean).join(', ')}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default function MapView({ nucleos, activeNucleoId, onSelect }: Props) {
  const locale = useLocale()
  const copy = getCopy(locale)
  const markers = toMarkers(nucleos)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey || apiKey.startsWith('FILL_')) {
    return <MapFallback title={copy.missingKeyTitle} body={copy.missingKeyBody} accent="Google Maps" />
  }

  return (
    <LoadedMapView
      apiKey={apiKey}
      copy={copy}
      markers={markers}
      activeNucleoId={activeNucleoId}
      onSelect={onSelect}
    />
  )
}
