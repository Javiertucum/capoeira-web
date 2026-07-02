'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

export type MapMarker = {
  id: string
  lng: number
  lat: number
  variant?: 'nucleo' | 'user'
  logoUrl?: string | null
  label?: string | null
}

export type MapPopup = {
  id: string
  html: string
}

export type MapViewHandle = {
  flyTo: (opts: { center: [number, number]; zoom?: number }) => void
}

function isDarkMode() {
  return document.documentElement.classList.contains('dark')
}

const PIN_SVG = `
  <svg viewBox="0 0 24 32" width="30" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 8 12 20 12 20s12-12 12-20C24 5.373 18.627 0 12 0Z" fill="var(--accent)" stroke="white" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="4.5" fill="white"/>
  </svg>
`

function createMarkerElement(variant: MapMarker['variant'], logoUrl?: string | null, label?: string | null) {
  const wrapper = document.createElement('div')

  if (variant === 'user') {
    const inner = document.createElement('div')
    inner.className = 'h-4 w-4 rounded-full border-2 border-white bg-accent shadow-[0_0_0_4px_color-mix(in_oklch,var(--accent)_25%,transparent)]'
    wrapper.appendChild(inner)
    return wrapper
  }

  if (logoUrl) {
    const inner = document.createElement('div')
    inner.className = 'flex cursor-pointer flex-col items-center drop-shadow-md transition-transform duration-150 origin-bottom'

    const badge = document.createElement('div')
    badge.className = 'h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm'
    const img = document.createElement('img')
    img.src = logoUrl
    img.alt = label ?? ''
    img.loading = 'lazy'
    img.className = 'h-full w-full object-cover'
    badge.appendChild(img)

    const tail = document.createElement('div')
    tail.className = 'mt-[-3px] h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 border-white bg-white'
    tail.style.marginTop = '-6px'
    tail.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%)'

    inner.appendChild(badge)
    inner.appendChild(tail)
    wrapper.appendChild(inner)
    return wrapper
  }

  const inner = document.createElement('div')
  inner.className = 'flex h-10 w-[30px] cursor-pointer items-start justify-center drop-shadow-md transition-transform duration-150 origin-bottom'
  inner.innerHTML = PIN_SVG
  wrapper.appendChild(inner)
  return wrapper
}

const MapView = forwardRef<MapViewHandle, {
  center: [number, number]
  zoom: number
  markers: MapMarker[]
  selectedId?: string | null
  onMarkerClick?: (id: string) => void
  popup?: MapPopup | null
  onPopupClose?: () => void
  className?: string
}>(function MapView({ center, zoom, markers, selectedId, onMarkerClick, popup, onPopupClose, className }, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map())
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const onMarkerClickRef = useRef(onMarkerClick)
  onMarkerClickRef.current = onMarkerClick
  const onPopupCloseRef = useRef(onPopupClose)
  onPopupCloseRef.current = onPopupClose

  useImperativeHandle(ref, () => ({
    flyTo: (opts) => {
      mapRef.current?.flyTo({ center: opts.center, zoom: opts.zoom })
    },
  }))

  // Init map + theme observer
  useEffect(() => {
    if (!containerRef.current) return

    try {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: isDarkMode() ? DARK_STYLE : LIGHT_STYLE,
        center,
        zoom,
        attributionControl: { compact: true },
      })
      mapRef.current = map
    } catch (error) {
      console.error('[MapView] Failed to initialize map:', error)
      return
    }

    const observer = new MutationObserver(() => {
      if (mapRef.current) {
        mapRef.current.setStyle(isDarkMode() ? DARK_STYLE : LIGHT_STYLE)
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const resizeObserver = new ResizeObserver(() => mapRef.current?.resize())
    resizeObserver.observe(containerRef.current)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current.clear()
      popupRef.current?.remove()
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync markers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const nextIds = new Set(markers.map((m) => m.id))
    for (const [id, marker] of markersRef.current) {
      if (!nextIds.has(id)) {
        marker.remove()
        markersRef.current.delete(id)
      }
    }

    for (const m of markers) {
      let marker = markersRef.current.get(m.id)
      if (!marker) {
        const el = createMarkerElement(m.variant, m.logoUrl, m.label)
        marker = new maplibregl.Marker({ element: el, anchor: m.variant === 'user' ? 'center' : 'bottom' })
          .setLngLat([m.lng, m.lat])
          .addTo(map)
        if (m.variant !== 'user') {
          el.addEventListener('click', () => onMarkerClickRef.current?.(m.id))
        }
        markersRef.current.set(m.id, marker)
      } else {
        marker.setLngLat([m.lng, m.lat])
      }

      const el = marker.getElement()
      el.style.zIndex = selectedId === m.id ? '10' : '1'
      const inner = el.firstElementChild as HTMLElement | null
      if (inner) inner.style.transform = selectedId === m.id ? 'scale(1.2)' : ''
    }
  }, [markers, selectedId])

  // Fly to center/zoom changes
  useEffect(() => {
    mapRef.current?.flyTo({ center, zoom })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom])

  // Sync popup
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    popupRef.current?.remove()
    popupRef.current = null

    if (!popup) return

    const marker = markersRef.current.get(popup.id)
    if (!marker) return

    const p = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: 16 })
      .setLngLat(marker.getLngLat())
      .setHTML(popup.html)
      .addTo(map)


    p.on('close', () => onPopupCloseRef.current?.())
    popupRef.current = p

    return () => {
      p.remove()
    }
  }, [popup])

  return <div ref={containerRef} className={className} />
})

export default MapView
