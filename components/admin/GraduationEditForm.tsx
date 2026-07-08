'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CordaColorPicker from '@/components/admin/CordaColorPicker'
import CordaVisual from '@/components/public/CordaVisual'

type GraduationLevel = {
  id: string
  groupId: string
  groupName: string
  name: string
  order: number
  colors: string[]
  category?: string | null
  isEducator?: boolean
  isSpecial?: boolean
  tipColorLeft?: string | null
  tipColorRight?: string | null
  midColorLeft?: string | null
  midColorRight?: string | null
}

type Props = {
  /** Nivel existente (editar) o null para crear uno nuevo. */
  level: GraduationLevel | null
  groupId: string
  locale: string
}

/** Selector opcional de un color: checkbox para activar + paleta de la app en singleMode. */
function OptionalColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string | null
  onChange: (value: string | null) => void
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <label className="flex cursor-pointer items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={value !== null}
            onChange={(e) => onChange(e.target.checked ? '#FFD700' : null)}
            className="h-4 w-4 accent-accent"
          />
          <span className="text-sm text-text">{label}</span>
        </span>
        {value !== null && (
          <span className="h-6 w-10 rounded border border-border" style={{ backgroundColor: value }} />
        )}
      </label>
      {value !== null && (
        <div className="mt-3">
          <CordaColorPicker
            selectedColors={[value]}
            onColorsChange={(cols) => onChange(cols[0] ?? null)}
            singleMode
          />
        </div>
      )}
    </div>
  )
}

export default function GraduationEditForm({ level, groupId, locale }: Props) {
  const router = useRouter()
  const isCreate = level === null
  const [name, setName] = useState(level?.name ?? '')
  const [order, setOrder] = useState(String(level?.order ?? 1))
  const [colors, setColors] = useState<string[]>(level?.colors ?? [])
  const [category, setCategory] = useState(level?.category ?? '')
  const [isEducator, setIsEducator] = useState(level?.isEducator ?? false)
  const [isSpecial, setIsSpecial] = useState(level?.isSpecial ?? false)
  const [tipColorLeft, setTipColorLeft] = useState<string | null>(level?.tipColorLeft ?? null)
  const [tipColorRight, setTipColorRight] = useState<string | null>(level?.tipColorRight ?? null)
  const [midColorLeft, setMidColorLeft] = useState<string | null>(level?.midColorLeft ?? null)
  const [midColorRight, setMidColorRight] = useState<string | null>(level?.midColorRight ?? null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function buildPayload() {
    return {
      name: name.trim(),
      order: Number(order) || 0,
      colors,
      category: category.trim() || null,
      isEducator,
      isSpecial,
      tipColorLeft,
      tipColorRight,
      midColorLeft,
      midColorRight,
    }
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const url = isCreate
        ? `/api/admin/graduations/${groupId}`
        : `/api/admin/graduations/${groupId}/${level.id}`
      const response = await fetch(url, {
        method: isCreate ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      })
      const data = await response.json() as { ok: boolean; error?: string }
      if (data.ok) {
        router.push(`/${locale}/admin/graduations`)
        router.refresh()
      } else {
        setError(data.error ?? 'Error al guardar')
      }
    } catch {
      setError('Error de red al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (isCreate) return
    if (!confirm(`¿Eliminar "${level.name}"? Esta acción no se puede deshacer.`)) return
    setDeleting(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/graduations/${groupId}/${level.id}`, {
        method: 'DELETE',
      })
      const data = await response.json() as { ok: boolean; error?: string }
      if (data.ok) {
        router.push(`/${locale}/admin/graduations`)
        router.refresh()
      } else {
        setError(data.error ?? 'Error al eliminar')
      }
    } catch {
      setError('Error de red al eliminar')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[22px] border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <CordaVisual
            colors={colors}
            tipColorLeft={tipColorLeft}
            tipColorRight={tipColorRight}
            midColorLeft={midColorLeft}
            midColorRight={midColorRight}
            width={160}
            height={20}
          />
          <p className="text-xs text-text-muted">Vista previa de la corda</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Nombre del nivel
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/40"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Orden
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/40"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Categoría (opcional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="infantil, adulto..."
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-accent/40"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Colores de la corda
            </label>
            <CordaColorPicker selectedColors={colors} onColorsChange={setColors} />
          </div>

          <div className="sm:col-span-2">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Puntas pintadas (extremos de la corda)
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <OptionalColorField label="Punta izquierda" value={tipColorLeft} onChange={setTipColorLeft} />
              <OptionalColorField label="Punta derecha" value={tipColorRight} onChange={setTipColorRight} />
            </div>
          </div>

          <div className="sm:col-span-2">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Franjas intermedias (entre la punta y el centro)
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <OptionalColorField label="Franja izquierda" value={midColorLeft} onChange={setMidColorLeft} />
              <OptionalColorField label="Franja derecha" value={midColorRight} onChange={setMidColorRight} />
            </div>
          </div>

          <div className="flex items-center gap-6 sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isEducator}
                onChange={(e) => setIsEducator(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sm text-text">Nivel de educador</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isSpecial}
                onChange={(e) => setIsSpecial(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sm text-text">Nivel especial</span>
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger/8 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        {isCreate ? <span /> : (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="rounded-xl border border-danger/20 bg-danger/8 px-5 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger/14 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? 'Eliminando...' : 'Eliminar nivel'}
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || deleting || !name.trim() || colors.length === 0}
          className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Guardando...' : isCreate ? 'Crear nivel' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
