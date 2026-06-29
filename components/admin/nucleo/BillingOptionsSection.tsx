'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminNucleo, AdminNucleoBillingOption } from '@/lib/admin-queries'
import { inputClass, labelClass, sectionClass } from '@/components/admin/adminFormStyles'
import ScheduleKeyPicker from './ScheduleKeyPicker'

interface Props {
  groupId: string
  nucleoId: string
  billingOptions: AdminNucleoBillingOption[]
  schedules: AdminNucleo['schedules']
}

type Mode = AdminNucleoBillingOption['mode']

const MODE_LABELS: Record<Mode, string> = {
  free: 'Gratis',
  monthly: 'Mensual',
  perClass: 'Por clase',
  classPack: 'Pack de clases',
}

function buildOptionId(mode: Mode, existingCount: number) {
  return `${mode}-${Date.now()}-${existingCount + 1}`
}

function optionLabel(option: AdminNucleoBillingOption) {
  const parts = [option.name, MODE_LABELS[option.mode]]
  if (option.mode === 'monthly' && option.monthlyFee != null) parts.push(`$${option.monthlyFee}/mes`)
  if (option.mode === 'perClass' && option.classFee != null) parts.push(`$${option.classFee}/clase`)
  if (option.mode === 'classPack' && option.monthlyFee != null) {
    parts.push(`$${option.monthlyFee} (${option.classesPerPackage ?? '?'} clases)`)
  }
  return parts.join(' · ')
}

export default function BillingOptionsSection({ groupId, nucleoId, billingOptions, schedules }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(billingOptions.length > 0)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [mode, setMode] = useState<Mode>('monthly')
  const [scheduleKeys, setScheduleKeys] = useState<string[]>([])
  const [monthlyFee, setMonthlyFee] = useState('')
  const [classFee, setClassFee] = useState('')
  const [classesPerPackage, setClassesPerPackage] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  async function persist(next: AdminNucleoBillingOption[]) {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/nucleos/${groupId}/${nucleoId}/billing-options`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billingOptions: next }),
      })
      if (!res.ok) throw new Error('Error al guardar las modalidades')
      setMessage({ type: 'ok', text: 'Modalidades guardadas correctamente' })
      router.refresh()
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Error desconocido' })
    } finally {
      setSaving(false)
    }
  }

  function resetForm() {
    setAdding(false)
    setName('')
    setMode('monthly')
    setScheduleKeys([])
    setMonthlyFee('')
    setClassFee('')
    setClassesPerPackage('')
  }

  async function handleAdd() {
    if (!name.trim()) return
    const newOption: AdminNucleoBillingOption = {
      id: buildOptionId(mode, billingOptions.length),
      name: name.trim(),
      mode,
      scheduleKeys,
      monthlyFee: (mode === 'monthly' || mode === 'classPack') && monthlyFee ? Number(monthlyFee) : null,
      classFee: (mode === 'perClass' || mode === 'classPack') && classFee ? Number(classFee) : null,
      classesPerPackage: mode === 'classPack' && classesPerPackage ? Number(classesPerPackage) : null,
      isDefault: billingOptions.length === 0,
    }
    await persist([...billingOptions, newOption])
    resetForm()
  }

  async function handleSetDefault(id: string) {
    const next = billingOptions.map((option) => ({ ...option, isDefault: option.id === id }))
    await persist(next)
  }

  async function handleRemove(id: string) {
    if (!confirm('¿Eliminar esta modalidad de cobro?')) return
    const wasDefault = billingOptions.find((option) => option.id === id)?.isDefault
    const remaining = billingOptions.filter((option) => option.id !== id)
    if (wasDefault && remaining.length > 0) {
      remaining[0] = { ...remaining[0], isDefault: true }
    }
    await persist(remaining)
  }

  return (
    <section className={sectionClass}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-text">Modalidades avanzadas de cobro</h3>
          <p className="mt-1 text-sm text-text-muted">
            Opcional — agrega multiples modalidades de pago segun horario. Si no la configuras, se usa la
            configuracion simple de arriba.
          </p>
        </div>
        <span className="text-xs font-semibold text-accent">{open ? 'Ocultar' : 'Configurar'}</span>
      </button>

      {open && (
        <div className="mt-5 space-y-4">
          {message ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                message.type === 'ok'
                  ? 'border-accent/20 bg-accent/10 text-accent'
                  : 'border-danger/20 bg-danger/10 text-danger'
              }`}
            >
              {message.text}
            </div>
          ) : null}

          {billingOptions.length === 0 && !adding ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface/55 px-4 py-6 text-sm text-text-muted">
              Sin modalidades avanzadas configuradas.
            </div>
          ) : null}

          {billingOptions.map((option) => (
            <div
              key={option.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/75 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-semibold text-text">
                  {optionLabel(option)}
                  {option.isDefault ? ' · Por defecto' : ''}
                </p>
                {option.scheduleKeys && option.scheduleKeys.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {option.scheduleKeys.map((key) => (
                      <span
                        key={key}
                        className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-semibold text-text-muted"
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-text-muted">Todos los horarios</p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                {!option.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(option.id)}
                    disabled={saving}
                    className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary transition-colors hover:text-text disabled:opacity-50"
                  >
                    Marcar por defecto
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(option.id)}
                  disabled={saving}
                  className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/14 disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {!adding ? (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:text-text"
            >
              Agregar modalidad
            </button>
          ) : (
            <div className="space-y-4 rounded-2xl border border-accent/25 bg-surface/75 p-4">
              <div>
                <label className={labelClass}>Nombre</label>
                <input
                  className={inputClass}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ej: Pack mañanas"
                />
              </div>

              <div>
                <label className={labelClass}>Modalidad</label>
                <select className={inputClass} value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
                  <option value="monthly">Mensual</option>
                  <option value="perClass">Por clase</option>
                  <option value="classPack">Pack de clases</option>
                  <option value="free">Gratis</option>
                </select>
              </div>

              {(mode === 'monthly' || mode === 'classPack') && (
                <div>
                  <label className={labelClass}>{mode === 'classPack' ? 'Valor del pack' : 'Precio mensual'}</label>
                  <input
                    className={inputClass}
                    inputMode="decimal"
                    value={monthlyFee}
                    onChange={(event) => setMonthlyFee(event.target.value)}
                  />
                </div>
              )}

              {(mode === 'perClass' || mode === 'classPack') && (
                <div>
                  <label className={labelClass}>Precio por clase</label>
                  <input
                    className={inputClass}
                    inputMode="decimal"
                    value={classFee}
                    onChange={(event) => setClassFee(event.target.value)}
                  />
                </div>
              )}

              {mode === 'classPack' && (
                <div>
                  <label className={labelClass}>Clases por pack</label>
                  <input
                    className={inputClass}
                    inputMode="numeric"
                    value={classesPerPackage}
                    onChange={(event) => setClassesPerPackage(event.target.value)}
                  />
                </div>
              )}

              <div>
                <label className={labelClass}>Horarios que cubre (opcional, vacio = todos)</label>
                <ScheduleKeyPicker schedules={schedules} selectedKeys={scheduleKeys} onChange={setScheduleKeys} />
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
                  onClick={handleAdd}
                  disabled={saving || !name.trim()}
                  className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-92 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Agregar y guardar'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
