'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminNucleo, AdminNucleoBillingOption, AdminNucleoMember, AdminTurma } from '@/lib/admin-queries'
import EntitySearchInput from '@/components/admin/EntitySearchInput'
import { inputClass, labelClass, sectionClass } from '@/components/admin/adminFormStyles'
import ScheduleKeyPicker, { getScheduleKey } from './ScheduleKeyPicker'

interface Props {
  groupId: string
  nucleoId: string
  turmas: AdminTurma[]
  schedules: AdminNucleo['schedules']
  members: AdminNucleoMember[]
  billingOptions: AdminNucleoBillingOption[]
}

type DraftTurma = {
  name: string
  scheduleKeys: string[]
  memberIds: string[]
  billingOptionId: string
  responsibleEducatorId: string
  assistantEducatorIds: string[]
}

const EMPTY_DRAFT: DraftTurma = {
  name: '',
  scheduleKeys: [],
  memberIds: [],
  billingOptionId: '',
  responsibleEducatorId: '',
  assistantEducatorIds: [],
}

function memberLabel(member: AdminNucleoMember) {
  const fullName = `${member.name} ${member.surname}`.trim()
  return member.nickname ? `${fullName} (${member.nickname})` : fullName || member.uid
}

function membersToOptions(members: AdminNucleoMember[]) {
  return members.map((member) => ({
    id: member.uid,
    type: 'user' as const,
    label: memberLabel(member),
    description: member.role === 'educator' ? 'Educador' : undefined,
  }))
}

export default function TurmasSection({ groupId, nucleoId, turmas, schedules, members, billingOptions }: Props) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [draft, setDraft] = useState<DraftTurma>(EMPTY_DRAFT)
  const [memberToAdd, setMemberToAdd] = useState('')
  const [assistantToAdd, setAssistantToAdd] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  const memberById = useMemo(() => new Map(members.map((member) => [member.uid, member])), [members])
  const memberOptions = useMemo(() => membersToOptions(members), [members])
  const educatorOptions = useMemo(
    () => membersToOptions(members.filter((member) => member.role === 'educator' || member.role === 'admin')),
    [members]
  )

  function startCreate() {
    setEditingId('new')
    setDraft(EMPTY_DRAFT)
    setMessage(null)
  }

  function startEdit(turma: AdminTurma) {
    setEditingId(turma.id)
    setDraft({
      name: turma.name,
      scheduleKeys: turma.scheduleKeys,
      memberIds: turma.memberIds,
      billingOptionId: turma.billingOptionId ?? '',
      responsibleEducatorId: turma.responsibleEducatorId ?? '',
      assistantEducatorIds: turma.assistantEducatorIds ?? [],
    })
    setMessage(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
    setMemberToAdd('')
    setAssistantToAdd('')
  }

  async function handleSave() {
    if (!editingId) return
    setSaving(true)
    setMessage(null)

    const isNew = editingId === 'new'
    const url = isNew
      ? `/api/admin/nucleos/${groupId}/${nucleoId}/turmas`
      : `/api/admin/nucleos/${groupId}/${nucleoId}/turmas/${editingId}`

    try {
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name,
          scheduleKeys: draft.scheduleKeys,
          memberIds: draft.memberIds,
          billingOptionId: draft.billingOptionId || null,
          responsibleEducatorId: draft.responsibleEducatorId || null,
          assistantEducatorIds: draft.assistantEducatorIds,
        }),
      })

      if (!res.ok) throw new Error('Error al guardar la turma')

      setMessage({ type: 'ok', text: 'Turma guardada correctamente' })
      cancelEdit()
      router.refresh()
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Error desconocido' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(turmaId: string) {
    if (!confirm('¿Eliminar esta turma permanentemente?')) return
    setDeletingId(turmaId)
    try {
      const res = await fetch(`/api/admin/nucleos/${groupId}/${nucleoId}/turmas/${turmaId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Error al eliminar la turma')
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
          <h3 className="text-sm font-semibold text-text">Turmas</h3>
          <p className="mt-1 text-sm text-text-muted">Subgrupos del nucleo agrupados por horario.</p>
        </div>
        {editingId === null && (
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:text-text"
          >
            Agregar turma
          </button>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {turmas.length === 0 && editingId === null ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/55 px-4 py-6 text-sm text-text-muted">
            Este nucleo no tiene turmas todavia.
          </div>
        ) : null}

        {turmas.map((turma) =>
          editingId === turma.id ? null : (
            <div
              key={turma.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/75 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-semibold text-text">{turma.name}</p>
                <p className="mt-1 text-xs text-text-muted">
                  {turma.memberIds.length} miembro(s)
                  {turma.guestMemberIds.length > 0 ? ` + ${turma.guestMemberIds.length} sin cuenta` : ''}
                  {turma.responsibleEducatorId
                    ? ` · Educador: ${
                        memberById.get(turma.responsibleEducatorId)
                          ? memberLabel(memberById.get(turma.responsibleEducatorId)!)
                          : turma.responsibleEducatorId
                      }`
                    : ''}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {turma.scheduleKeys.map((key) => (
                    <span
                      key={key}
                      className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-semibold text-text-muted"
                    >
                      {key}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(turma)}
                  className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary transition-colors hover:text-text"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(turma.id)}
                  disabled={deletingId === turma.id}
                  className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/14 disabled:opacity-50"
                >
                  {deletingId === turma.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          )
        )}

        {editingId !== null && (
          <div className="space-y-4 rounded-2xl border border-accent/25 bg-surface/75 p-4">
            <div>
              <label className={labelClass}>Nombre</label>
              <input
                className={inputClass}
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder="Ej: Adultos noche"
              />
            </div>

            <div>
              <label className={labelClass}>Horarios cubiertos</label>
              <ScheduleKeyPicker
                schedules={schedules}
                selectedKeys={draft.scheduleKeys}
                onChange={(keys) => setDraft((current) => ({ ...current, scheduleKeys: keys }))}
              />
            </div>

            {billingOptions.length > 0 && (
              <div>
                <label className={labelClass}>Modalidad de cobro</label>
                <select
                  className={inputClass}
                  value={draft.billingOptionId}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, billingOptionId: event.target.value }))
                  }
                >
                  <option value="">Usar configuracion general del nucleo</option>
                  {billingOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <EntitySearchInput
                label="Educador responsable"
                value={draft.responsibleEducatorId}
                options={educatorOptions}
                placeholder="Busca por nombre o apodo"
                emptyLabel="Sin educador responsable asignado."
                onChange={(value) => setDraft((current) => ({ ...current, responsibleEducatorId: value }))}
              />

              <div>
                <EntitySearchInput
                  label="Agregar educador asistente"
                  value={assistantToAdd}
                  options={educatorOptions.filter((option) => !draft.assistantEducatorIds.includes(option.id))}
                  placeholder="Busca por nombre o apodo"
                  emptyLabel="Selecciona un educador para agregar."
                  onChange={setAssistantToAdd}
                />
                <button
                  type="button"
                  disabled={!assistantToAdd || draft.assistantEducatorIds.includes(assistantToAdd)}
                  onClick={() => {
                    setDraft((current) => ({
                      ...current,
                      assistantEducatorIds: [...current.assistantEducatorIds, assistantToAdd],
                    }))
                    setAssistantToAdd('')
                  }}
                  className="mt-3 rounded-xl border border-accent/30 px-4 py-2 text-xs font-semibold text-accent transition-opacity disabled:opacity-40"
                >
                  Agregar asistente
                </button>
                {draft.assistantEducatorIds.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {draft.assistantEducatorIds.map((id) => (
                      <span
                        key={id}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text"
                      >
                        {memberById.get(id) ? memberLabel(memberById.get(id)!) : id}
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((current) => ({
                              ...current,
                              assistantEducatorIds: current.assistantEducatorIds.filter((x) => x !== id),
                            }))
                          }
                          className="text-danger"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <EntitySearchInput
                label="Agregar miembro"
                value={memberToAdd}
                options={memberOptions.filter((option) => !draft.memberIds.includes(option.id))}
                placeholder="Busca por nombre o apodo"
                emptyLabel="Selecciona un miembro para agregar."
                onChange={setMemberToAdd}
              />
              <button
                type="button"
                disabled={!memberToAdd || draft.memberIds.includes(memberToAdd)}
                onClick={() => {
                  setDraft((current) => ({ ...current, memberIds: [...current.memberIds, memberToAdd] }))
                  setMemberToAdd('')
                }}
                className="mt-3 rounded-xl border border-accent/30 px-4 py-2 text-xs font-semibold text-accent transition-opacity disabled:opacity-40"
              >
                Agregar miembro
              </button>
              <div className="mt-3 flex flex-wrap gap-2">
                {draft.memberIds.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text"
                  >
                    {memberById.get(id) ? memberLabel(memberById.get(id)!) : id}
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          memberIds: current.memberIds.filter((x) => x !== id),
                        }))
                      }
                      className="text-danger"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-secondary transition-colors hover:text-text"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !draft.name.trim()}
                className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-92 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar turma'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
