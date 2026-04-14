'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import type { KeyboardEvent } from 'react'
import type { MapNucleo } from '@/lib/types'

type Props = Readonly<{
  nucleo: MapNucleo
  isActive: boolean
  onSelect?: (id: string) => void
}>

type LocaleCopy = {
  showOnMap: string
  groupLabel: string
  noLocation: string
  noAddress: string
  coordinatesReady: string
  coordinatesMissing: string
  schedulePrefix: string
  trainingSpot: string
  openGroup: string
  viewDetail: string
}

const COPY: Record<string, LocaleCopy> = {
  es: {
    showOnMap: 'Ver en mapa',
    groupLabel: 'Grupo',
    noLocation: 'Ubicacion pendiente',
    noAddress: 'Direccion pendiente',
    coordinatesReady: 'Con coordenadas',
    coordinatesMissing: 'Sin coordenadas',
    schedulePrefix: 'Horarios',
    trainingSpot: 'Espacio de treino',
    openGroup: 'Abrir grupo',
    viewDetail: 'Ver detalle',
  },
  pt: {
    showOnMap: 'Ver no mapa',
    groupLabel: 'Grupo',
    noLocation: 'Localizacao pendente',
    noAddress: 'Endereco pendente',
    coordinatesReady: 'Com coordenadas',
    coordinatesMissing: 'Sem coordenadas',
    schedulePrefix: 'Horarios',
    trainingSpot: 'Espaco de treino',
    openGroup: 'Abrir grupo',
    viewDetail: 'Ver detalhe',
  },
  en: {
    showOnMap: 'Show on map',
    groupLabel: 'Group',
    noLocation: 'Location pending',
    noAddress: 'Address pending',
    coordinatesReady: 'Has coordinates',
    coordinatesMissing: 'Coordinates pending',
    schedulePrefix: 'Schedule',
    trainingSpot: 'Training spot',
    openGroup: 'Open group',
    viewDetail: 'View detail',
  },
}

function getCopy(locale: string) {
  return COPY[locale] ?? COPY.en
}

function getLocation(nucleo: MapNucleo, copy: LocaleCopy) {
  const parts = [nucleo.city, nucleo.country].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : copy.noLocation
}

function getWeekdayLabel(locale: string, dayOfWeek: number) {
  const baseDate = new Date(Date.UTC(2024, 0, 7 + dayOfWeek))
  return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(baseDate)
}

function getScheduleSummary(locale: string, nucleo: MapNucleo, copy: LocaleCopy) {
  if (!nucleo.schedules || nucleo.schedules.length === 0) {
    return null
  }

  const preview = nucleo.schedules
    .slice(0, 2)
    .map(
      (schedule) =>
        `${getWeekdayLabel(locale, schedule.dayOfWeek)} ${schedule.startTime}-${schedule.endTime}`
    )
    .join(' | ')

  const overflow = nucleo.schedules.length > 2 ? ' +' : ''

  return `${copy.schedulePrefix}: ${preview}${overflow}`
}

export default function NucleoListItem({ nucleo, isActive, onSelect }: Props) {
  const locale = useLocale()
  const copy = getCopy(locale)
  const hasCoordinates =
    typeof nucleo.latitude === 'number' && typeof nucleo.longitude === 'number'
  const scheduleSummary = getScheduleSummary(locale, nucleo, copy)
  const isInteractive = typeof onSelect === 'function'

  function handleActivate() {
    onSelect?.(nucleo.id)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isInteractive) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect?.(nucleo.id)
    }
  }

  return (
    <article
      className={`overflow-hidden rounded-[26px] border transition-all duration-200 ${
        isActive
          ? 'border-accent/45 bg-surface shadow-sm'
          : 'border-border bg-card hover:border-accent/24'
      }`}
    >
      <div
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
        className={`px-5 py-5 text-left ${isInteractive ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-text-muted">
              <span>{copy.trainingSpot}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="truncate text-text-secondary">
                {nucleo.groupName || 'Agenda Capoeiragem'}
              </span>
            </div>

            <h3 className="mt-3 text-[22px] font-semibold leading-tight tracking-[-0.03em] text-text">
              {nucleo.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {getLocation(nucleo, copy)}
            </p>
          </div>

          {isInteractive ? (
            <span
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                isActive
                  ? 'border-accent/30 bg-[rgba(121,207,114,0.14)] text-accent'
                  : 'border-border bg-surface text-text-muted'
              }`}
            >
              {copy.showOnMap}
            </span>
          ) : null}
        </div>

        <p className="mt-5 text-sm leading-7 text-text-secondary">
          {nucleo.address?.trim() || copy.noAddress}
        </p>

        {scheduleSummary ? (
          <p className="mt-3 text-xs leading-6 text-text-muted">{scheduleSummary}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
            {hasCoordinates ? copy.coordinatesReady : copy.coordinatesMissing}
          </span>

          {nucleo.city ? (
            <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
              {nucleo.city}
            </span>
          ) : null}

          {nucleo.schedules && nucleo.schedules.length > 0 ? (
            <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
              {`${nucleo.schedules.length} ${copy.schedulePrefix}`}
            </span>
          ) : null}
        </div>
      </div>

      {nucleo.groupId ? (
        <div className="flex items-center justify-between border-t border-border/70 px-5 py-4">
          <Link
            href={`/${locale}/nucleo/${nucleo.groupId}/${nucleo.id}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:text-text"
          >
            {copy.viewDetail}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href={`/${locale}/group/${nucleo.groupId}`}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent transition-opacity hover:opacity-80"
          >
            {copy.openGroup}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ) : null}
    </article>
  )
}
