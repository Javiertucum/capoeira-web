'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
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
  },
  pt: {
    showOnMap: 'Ver no mapa',
    groupLabel: 'Grupo',
    noLocation: 'Localizacao pendente',
    noAddress: 'Endereco pendente',
    coordinatesReady: 'Com coordenadas',
    coordinatesMissing: 'Sem coordenadas',
    schedulePrefix: 'Horarios',
  },
  en: {
    showOnMap: 'Show on map',
    groupLabel: 'Group',
    noLocation: 'Location pending',
    noAddress: 'Address pending',
    coordinatesReady: 'Has coordinates',
    coordinatesMissing: 'Coordinates pending',
    schedulePrefix: 'Schedule',
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

  return (
    <article
      className={`rounded-[22px] border transition-all duration-200 ${
        isActive
          ? 'border-accent/60 bg-[linear-gradient(180deg,rgba(32,38,51,0.98)_0%,rgba(24,29,38,0.98)_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.22)]'
          : 'border-border bg-card/92 hover:border-accent/35 hover:bg-[#1b2230]'
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect?.(nucleo.id)}
        className="flex w-full flex-col gap-4 px-5 py-5 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-text-muted">
              <span>{copy.groupLabel}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="truncate text-text-secondary">
                {nucleo.groupName || 'Agenda'}
              </span>
            </div>

            <h3 className="mt-3 text-lg font-semibold leading-tight tracking-[0.01em] text-text">
              {nucleo.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {getLocation(nucleo, copy)}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
              isActive
                ? 'border-accent/30 bg-[rgba(102,187,106,0.14)] text-accent'
                : 'border-border bg-surface text-text-muted'
            }`}
          >
            {copy.showOnMap}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-sm leading-6 text-text-secondary">
            {nucleo.address?.trim() || copy.noAddress}
          </p>

          {scheduleSummary ? (
            <p className="text-xs leading-5 text-text-muted">{scheduleSummary}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-text-muted">
              {hasCoordinates ? copy.coordinatesReady : copy.coordinatesMissing}
            </span>

            {nucleo.city ? (
              <span className="rounded-full border border-border/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-text-secondary">
                {nucleo.city}
              </span>
            ) : null}
          </div>

          <Link
            href={`/${locale}/group/${nucleo.groupId}`}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent transition-opacity hover:opacity-75"
          >
            {copy.groupLabel}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </button>
    </article>
  )
}
