'use client'

import { useEffect, useRef, useState } from 'react'

export type MultiSelectOption = { value: string; label: string }

type Props = {
  label: string
  options: MultiSelectOption[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

/** Reusable dropdown for multi-select filters (role, plan, language, groups, nucleos). */
export default function MultiSelectDropdown({ label, options, selected, onChange, placeholder = 'Todos' }: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  const selectedLabels = options.filter((o) => selected.includes(o.value)).map((o) => o.label)
  const summary =
    selectedLabels.length === 0
      ? placeholder
      : selectedLabels.length <= 2
        ? selectedLabels.join(', ')
        : `${selectedLabels.length} seleccionados`

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm text-text outline-none transition-colors focus:border-accent/40"
      >
        <span className={selectedLabels.length === 0 ? 'text-text-muted' : ''}>{summary}</span>
        <span className="text-text-muted">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => toggle(opt.value)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-surface/60"
              >
                <span className="text-text">{opt.label}</span>
                {selected.includes(opt.value) && <span className="text-accent">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
