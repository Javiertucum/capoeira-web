'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CordaColorPicker from '@/components/admin/CordaColorPicker'
import CordaVisual from '@/components/public/CordaVisual'

type GraduationCategory = 'adult' | 'infantil' | 'juvenil'

type GraduationLevel = {
  id: string
  groupId: string
  groupName: string
  name: string
  order: number
  colors: string[]
  category?: string | null
  isEducator?: boolean
  isEstagiario?: boolean
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

const CATEGORIES: { value: GraduationCategory; label: string }[] = [
  { value: 'adult', label: 'Adulto' },
  { value: 'infantil', label: 'Infantil' },
  { value: 'juvenil', label: 'Juvenil' },
]

/** Selector opcional de un color: checkbox para activar + paleta de la app en singleMode. */
function OptionalColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string | null
  onChange: (v: string | null) => void
}) {
  const HEX_COLORS = [
    '#FFFFFF', '#D4C9A8', '#E8D5B7', '#C5A882', '#8B6B3D', '#5C3D1E',
    '#000000', '#1A1A2E', '#16213E', '#0F3460',
    '#FFD700', '#FFA500', '#FF6B35', '#E74C3C', '#C0392B',
    '#2ECC71', '#27AE60', '#1ABC9C', '#16A085',
    '#3498DB', '#2980B9', '#9B59B6', '#8E44AD',
    '#F39C12', '#D35400', '#E67E22',
    '#BDC3C7', '#95A5A6', '#7F8C8D',
  ]

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
        {label}
      </label>
      {value ? (
        <div className="flex items-center gap-2">
          <span
            className="h-6 w-6 rounded-full border border-border"
            style={{ backgroundColor: value }}
          />
          <span className="text-xs text-text">{value}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-danger hover:underline"
          >
            Quitar
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {HEX_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              style={{ backgroundColor: c }}
              className="h-6 w-6 rounded-full border border-border transition-transform hover:scale-110"
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function GraduationEditForm({ level, groupId, locale }: Props) {
  const router = useRouter()
  const isCreate = level === null

  const [name, setName] = useState(level?.name ?? '')
  const [order, setOrder] = useState(String(level?.order ?? 0))
  const [colors, setColors] = useState<string[]>(level?.colors ?? [])
  // category es enum estricto; si el nivel existente tiene un valor fuera del rango, default 'adult'
  const initialCategory: GraduationCategory =
    (level?.category as GraduationCategory | undefined) &&
    ['adult', 'infantil', 'juvenil'].includes(level?.category ?? '')
      ? (level!.category as GraduationCategory)
      : 'adult'
  const [category, setCategory] = useState<GraduationCategory>(initialCategory)
  const [isEducator, setIsEducator] = useState(level?.isEducator ?? false)
  const [isEstagiario, setIsEstagiario] = useState(level?.isEstagiario ?? false)
  const [isSpecial, setIsSpecial] = useState(level?.isSpecial ?? false)
  const [tipColorLeft, setTipColorLeft] = useState<string | null>(level?.tipColorLeft ?? null)
  const [tipColorRight, setTipColorRight] = useState<string | null>(level?.tipColorRight ?? null)
  const [midColorLeft, setMidColorLeft] = useState<string | null>(level?.midColorLeft ?? null)
  const [midColorRight, setMidColorRight] = useState<string | null>(level?.midColorRight ?? null)
  // Solo en creacion: controla si se envia push al admin del grupo
  const [notifyAdmin, setNotifyAdmin] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function buildPayload() {
    const base = {
      name: name.trim(),
      order: Number(order) || 0,
      colors,
      category,
      isEducator,
      isEstagiario,
      isSpecial,
      tipColorLeft,
      tipColorRight,
      midColorLeft,
      midColorRight,
    }
    if (isCreate) {
      return { ...base, notify: notifyAdmin }
    }
    return base
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
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Categoría
            </p>
            <div className="flex gap-2">
              {CATEGORIES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  className={[
                    'flex-1 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors',
                    category === value
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-border bg-surface text-text-secondary hover:border-accent/30 hover:bg-accent/5',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
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

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-2">
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
                checked={isEstagiario}
                onChange={(e) => setIsEstagiario(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sm text-text">Estagiario</span>
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

          {/* Solo en creación: opción para controlar si se notifica al admin del grupo */}
          {isCreate && (
            <div className="sm:col-span-2">
              <div className="rounded-xl border border-border bg-surface/50 px-4 py-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notifyAdmin}
                    onChange={(e) => setNotifyAdmin(e.target.checked)}
                    className="h-4 w-4 accent-accent"
                  />
                  <div>
                    <span className="text-sm font-semibold text-text">Notificar al admin del grupo</span>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {notifyAdmin
                        ? 'El admin del grupo recibirá una push notification al guardar.'
                        : 'No se enviará notificación — útil si vas a crear varios niveles seguidos.'}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
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