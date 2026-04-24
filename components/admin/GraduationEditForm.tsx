'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
}

type Props = {
  level: GraduationLevel
  locale: string
}

export default function GraduationEditForm({ level, locale }: Props) {
  const router = useRouter()
  const [name, setName] = useState(level.name)
  const [order, setOrder] = useState(String(level.order))
  const [colorsRaw, setColorsRaw] = useState(level.colors.join(', '))
  const [category, setCategory] = useState(level.category ?? '')
  const [isEducator, setIsEducator] = useState(level.isEducator ?? false)
  const [isSpecial, setIsSpecial] = useState(level.isSpecial ?? false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewColors = colorsRaw
    .split(',')
    .map((c) => c.trim())
    .filter((c) => /^#[0-9a-fA-F]{3,6}$/.test(c))

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const colors = colorsRaw
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0)

      const response = await fetch(`/api/admin/graduations/${level.groupId}/${level.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          order: Number(order) || 0,
          colors,
          category: category.trim() || null,
          isEducator,
          isSpecial,
        }),
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
    if (!confirm(`¿Eliminar "${level.name}"? Esta acción no se puede deshacer.`)) return
    setDeleting(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/graduations/${level.groupId}/${level.id}`, {
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
          <CordaVisual colors={previewColors.length > 0 ? previewColors : level.colors} width={120} height={18} />
          <div>
            <p className="text-xs text-text-muted">Vista previa de la corda</p>
            {previewColors.length === 0 && colorsRaw.trim() !== '' && (
              <p className="mt-0.5 text-xs text-warning">Formato inválido — usa códigos hex (#RRGGBB)</p>
            )}
          </div>
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
              Colores (hex separados por coma)
            </label>
            <input
              type="text"
              value={colorsRaw}
              onChange={(e) => setColorsRaw(e.target.value)}
              placeholder="#FFFFFF, #000000, #84c97a"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-accent/40"
            />
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
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting || saving}
          className="rounded-xl border border-danger/20 bg-danger/8 px-5 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger/14 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? 'Eliminando...' : 'Eliminar nivel'}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || deleting || !name.trim()}
          className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
