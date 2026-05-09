'use client'

import { useMemo, useState } from 'react'
import type { AdminEntityOption, AdminEntityType } from '@/lib/admin-queries'

export const ENTITY_TYPE_LABELS: Record<AdminEntityType, string> = {
  user: 'Usuario',
  group: 'Grupo',
  nucleo: 'Nucleo',
  event: 'Evento',
}

export function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function entitySearchText(option: AdminEntityOption): string {
  return normalizeSearch(
    [option.label, option.description, option.id, option.groupId, ENTITY_TYPE_LABELS[option.type]]
      .filter(Boolean)
      .join(' ')
  )
}

export function EntityBadge({ type }: { type: AdminEntityType }) {
  return (
    <span className="rounded-full border border-border bg-card px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
      {ENTITY_TYPE_LABELS[type]}
    </span>
  )
}

interface EntitySearchInputProps {
  label: string
  value: string
  options: AdminEntityOption[]
  placeholder: string
  emptyLabel?: string
  onChange: (value: string) => void
}

export default function EntitySearchInput({
  label,
  value,
  options,
  placeholder,
  emptyLabel = 'Sin seleccion',
  onChange,
}: EntitySearchInputProps) {
  const selected = options.find((option) => option.id === value)
  const selectedLabel = selected?.label || value || ''
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const normalizedQuery = normalizeSearch(query)
  const results = useMemo(() => {
    const pool = normalizedQuery
      ? options.filter((option) => entitySearchText(option).includes(normalizedQuery))
      : options
    return pool.slice(0, 8)
  }, [normalizedQuery, options])
  const inputClass =
    'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/35'
  const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted'

  return (
    <div className="relative">
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={open ? query : selectedLabel}
          onFocus={() => {
            setQuery('')
            setOpen(true)
          }}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onBlur={() => window.setTimeout(() => setOpen(false), 140)}
          placeholder={placeholder}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded-2xl border border-border bg-surface px-4 text-xs font-semibold text-text-muted transition-colors hover:text-text"
          >
            Limpiar
          </button>
        ) : null}
      </div>
      {selected ? (
        <p className="mt-2 text-xs text-text-muted">
          {selected.description ? `${selected.description} - ` : ''}
          <span className="font-mono">{selected.id}</span>
        </p>
      ) : value ? (
        <p className="mt-2 text-xs text-text-muted">
          ID sin nombre encontrado: <span className="font-mono">{value}</span>
        </p>
      ) : (
        <p className="mt-2 text-xs text-text-muted">{emptyLabel}</p>
      )}
      {open ? (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-xl">
          {results.length > 0 ? (
            results.map((option) => (
              <button
                key={`${option.type}-${option.groupId || 'root'}-${option.id}`}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option.id)
                  setQuery('')
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-surface"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-text">{option.label}</span>
                  <span className="block truncate text-xs text-text-muted">
                    {option.description || option.id}
                  </span>
                </span>
                <EntityBadge type={option.type} />
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-sm text-text-muted">No hay resultados.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
