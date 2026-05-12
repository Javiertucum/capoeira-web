'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminEntityOption } from '@/lib/admin-queries'
import EntitySearchInput from './EntitySearchInput'

interface Props {
  locale: string
  onClose: () => void
  groupOptions: AdminEntityOption[]
}

export default function CreateNucleoModal({ locale, onClose, groupOptions }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [groupId, setGroupId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    if (!name.trim() || !groupId) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/nucleos/${groupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!res.ok) throw new Error('Error al crear núcleo')
      const data = await res.json()
      router.push(`/${locale}/admin/nucleos/${groupId}/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[28px] border border-border bg-card p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-text mb-2">Crear nuevo núcleo</h3>
        <p className="text-sm text-text-muted mb-6">Selecciona el grupo y ponle nombre a la sede.</p>
        
        <div className="space-y-4">
          <div>
            <EntitySearchInput
              label="Grupo de Pertenencia"
              value={groupId}
              options={groupOptions}
              placeholder="Busca el grupo..."
              onChange={setGroupId}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Nombre del Núcleo</label>
            <input 
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-accent/40 transition-colors"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Núcleo Centro"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-danger">{error}</p>
          )}

          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-bold text-text-secondary hover:bg-surface transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleCreate}
              disabled={saving || !name.trim() || !groupId}
              className="flex-1 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-[#081019] shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
            >
              {saving ? 'Creando...' : 'Crear y Editar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
