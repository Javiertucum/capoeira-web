'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminNucleoMember, AdminScholarship } from '@/lib/admin-queries'
import EntitySearchInput from '@/components/admin/EntitySearchInput'
import { inputClass, labelClass, sectionClass } from '@/components/admin/adminFormStyles'

interface Props {
  groupId: string
  nucleoId: string
  scholarships: AdminScholarship[]
  members: AdminNucleoMember[]
}

const PRESETS = [25, 50, 75, 100]

function memberLabel(member: AdminNucleoMember) {
  const fullName = `${member.name} ${member.surname}`.trim()
  return member.nickname ? `${fullName} (${member.nickname})` : fullName || member.uid
}

export default function ScholarshipsSection({ groupId, nucleoId, scholarships, members }: Props) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [participantToAdd, setParticipantToAdd] = useState('')
  const [discountPercent, setDiscountPercent] = useState(50)
  const [permanent, setPermanent] = useState(true)
  const [endMonth, setEndMonth] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  const memberById = useMemo(() => new Map(members.map((member) => [member.uid, member])), [members])
  const scholarshipIds = useMemo(() => new Set(scholarships.map((s) => s.participantId)), [scholarships])
  const availableOptions = useMemo(
    () =>
      members
        .filter((member) => !scholarshipIds.has(member.uid) || member.uid === editingId)
        .map((member) => ({ id: member.uid, type: 'user' as const, label: memberLabel(member) })),
    [members, scholarshipIds, editingId]
  )

  function resetForm() {
    setCreating(false)
    setEditingId(null)
    setParticipantToAdd('')
    setDiscountPercent(50)
    setPermanent(true)
    setEndMonth('')
    setNote('')
  }

  function startCreate() {
    resetForm()
    setCreating(true)
  }

  function startEdit(scholarship: AdminScholarship) {
    setCreating(true)
    setEditingId(scholarship.participantId)
    setParticipantToAdd(scholarship.participantId)
    setDiscountPercent(scholarship.discountPercent)
    setPermanent(scholarship.permanent)
    setEndMonth(scholarship.endMonth ?? '')
    setNote(scholarship.note ?? '')
    setMessage(null)
  }

  async function handleSave() {
    if (!participantToAdd) return
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch(
        `/api/admin/nucleos/${groupId}/${nucleoId}/scholarships/${participantToAdd}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isGuest: false,
            discountPercent,
            permanent,
            endMonth: permanent ? null : endMonth || null,
            note: note || null,
          }),
        }
      )

      if (!res.ok) throw new Error('Error al guardar la beca')

      setMessage({ type: 'ok', text: 'Beca guardada correctamente' })
      resetForm()
      router.refresh()
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Error desconocido' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(participantId: string) {
    if (!confirm('¿Eliminar esta beca?')) return
    setDeletingId(participantId)
    try {
      const res = await fetch(`/api/admin/nucleos/${groupId}/${nucleoId}/scholarships/${participantId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Error al eliminar la beca')
      router.refresh()
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Error al eliminar' })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className={sectionClass}>
      {message ? (
        <div
          className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${
            message.type === 'ok'
              ? 'border-accent/20 bg-accent/10 text-accent'
              : 'border-danger/20 bg-danger/10 text-danger'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text">Becas</h3>
          <p className="mt-1 text-sm text-text-muted">Descuentos asignados por alumno.</p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:text-text"
          >
            Agregar beca
          </button>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {scholarships.length === 0 && !creating ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/55 px-4 py-6 text-sm text-text-muted">
            Este nucleo no tiene becas registradas.
          </div>
        ) : null}

        {scholarships.map((scholarship) =>
          editingId === scholarship.participantId ? null : (
            <div
              key={scholarship.participantId}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/75 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-semibold text-text">
                  {memberById.get(scholarship.participantId)
                    ? memberLabel(memberById.get(scholarship.participantId)!)
                    : scholarship.participantId}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {scholarship.discountPercent}% ·{' '}
                  {scholarship.permanent ? 'Permanente' : `Hasta ${scholarship.endMonth ?? 'sin definir'}`}
                  {scholarship.note ? ` · ${scholarship.note}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(scholarship)}
                  className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary transition-colors hover:text-text"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(scholarship.participantId)}
                  disabled={deletingId === scholarship.participantId}
                  className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/14 disabled:opacity-50"
                >
                  {deletingId === scholarship.participantId ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          )
        )}

        {creating && (
          <div className="space-y-4 rounded-2xl border border-accent/25 bg-surface/75 p-4">
            <EntitySearchInput
              label="Alumno"
              value={participantToAdd}
              options={availableOptions}
              placeholder="Busca por nombre o apodo"
              emptyLabel="Selecciona un alumno."
              onChange={setParticipantToAdd}
            />

            <div>
              <label className={labelClass}>Descuento</label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDiscountPercent(preset)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                      discountPercent === preset
                        ? 'border-accent bg-accent/14 text-accent'
                        : 'border-border bg-surface text-text-secondary hover:text-text'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
                <input
                  className={`${inputClass} max-w-[120px]`}
                  type="number"
                  min={0}
                  max={100}
                  value={discountPercent}
                  onChange={(event) => setDiscountPercent(Number(event.target.value))}
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer rounded-2xl border border-border bg-surface px-4 py-3">
              <input
                type="checkbox"
                checked={permanent}
                onChange={(event) => setPermanent(event.target.checked)}
                className="h-5 w-5 accent-accent rounded-lg"
              />
              <span className="text-sm font-semibold text-text">Beca permanente</span>
            </label>

            {!permanent && (
              <div>
                <label className={labelClass}>Vigente hasta</label>
                <input
                  type="month"
                  className={inputClass}
                  value={endMonth}
                  onChange={(event) => setEndMonth(event.target.value)}
                />
              </div>
            )}

            <div>
              <label className={labelClass}>Nota (opcional)</label>
              <input
                className={inputClass}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Ej: beca familiar"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-secondary transition-colors hover:text-text"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !participantToAdd}
                className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-92 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar beca'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
