'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminEntityOption, AdminNucleo } from '@/lib/admin-queries'
import EntitySearchInput from '@/components/admin/EntitySearchInput'

interface Props {
  nucleo: AdminNucleo
  locale: string
  entityOptions: AdminEntityOption[]
}

type Schedule = {
  dayOfWeek: number
  startTime: string
  endTime: string
}

const DAY_OPTIONS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miercoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sabado' },
]

export default function NucleoEditForm({ nucleo, locale, entityOptions }: Props) {
  const router = useRouter()
  const userOptions = useMemo(
    () => entityOptions.filter((o) => o.type === 'user'),
    [entityOptions]
  )

  const [form, setForm] = useState({
    name: nucleo.name,
    city: nucleo.city ?? '',
    country: nucleo.country ?? '',
    address: nucleo.address ?? '',
    latitude: nucleo.latitude?.toString() ?? '',
    longitude: nucleo.longitude?.toString() ?? '',
  })
  const [responsibleEducatorId, setResponsibleEducatorId] = useState(
    nucleo.responsibleEducatorId ?? ''
  )
  const [coEducatorIds, setCoEducatorIds] = useState<string[]>(nucleo.coEducatorIds ?? [])
  const [coEducatorToAdd, setCoEducatorToAdd] = useState('')
  const [schedules, setSchedules] = useState<Schedule[]>(nucleo.schedules ?? [])
  const [billing, setBilling] = useState({
    classesAreFree: nucleo.classesAreFree ?? false,
    billingMode: nucleo.billingMode ?? 'monthly',
    monthlyFee: nucleo.monthlyFee?.toString() ?? '',
    classFee: nucleo.classFee?.toString() ?? '',
    classesPerPackage: nucleo.classesPerPackage?.toString() ?? '',
    currency: nucleo.currency ?? '',
    paymentDueDay: nucleo.paymentDueDay?.toString() ?? '',
    showFeeAmount: nucleo.showFeeAmount ?? true,
  })

  function setBillingField<K extends keyof typeof billing>(key: K, value: (typeof billing)[K]) {
    setBilling((current) => ({ ...current, [key]: value }))
  }
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateSchedule(index: number, key: keyof Schedule, value: string | number) {
    setSchedules((current) =>
      current.map((schedule, scheduleIndex) =>
        scheduleIndex === index ? { ...schedule, [key]: value } : schedule
      )
    )
  }

  function addSchedule() {
    setSchedules((current) => [
      ...current,
      { dayOfWeek: 1, startTime: '19:00', endTime: '20:30' },
    ])
  }

  function removeSchedule(index: number) {
    setSchedules((current) => current.filter((_, scheduleIndex) => scheduleIndex !== index))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/nucleos/${nucleo.groupId}/${nucleo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          city: form.city || null,
          country: form.country || null,
          address: form.address || null,
          latitude: form.latitude ? Number(form.latitude) : null,
          longitude: form.longitude ? Number(form.longitude) : null,
          responsibleEducatorId: responsibleEducatorId || null,
          coEducatorIds,
          schedules,
          classesAreFree: billing.classesAreFree,
          billingMode: billing.billingMode,
          monthlyFee: billing.monthlyFee ? Number(billing.monthlyFee) : null,
          classFee: billing.classFee ? Number(billing.classFee) : null,
          classesPerPackage: billing.classesPerPackage ? Number(billing.classesPerPackage) : null,
          currency: billing.currency || null,
          paymentDueDay: billing.paymentDueDay ? Number(billing.paymentDueDay) : null,
          showFeeAmount: billing.showFeeAmount,
        }),
      })

      if (!res.ok) {
        throw new Error('Error al guardar el nucleo')
      }

      setMessage({ type: 'ok', text: 'Nucleo actualizado correctamente' })
      router.refresh()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este nucleo permanentemente?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/nucleos/${nucleo.groupId}/${nucleo.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Error al eliminar el nucleo')
      }

      router.push(`/${locale}/admin/nucleos`)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error al eliminar',
      })
      setDeleting(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/35'
  const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted'
  const sectionClass = 'rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6'

  return (
    <div className="space-y-6">
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

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Datos del nucleo</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Nombre</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(event) => set('name', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Ciudad</label>
            <input
              className={inputClass}
              value={form.city}
              onChange={(event) => set('city', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Pais</label>
            <input
              className={inputClass}
              value={form.country}
              onChange={(event) => set('country', event.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Direccion</label>
            <input
              className={inputClass}
              value={form.address}
              onChange={(event) => set('address', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Latitud</label>
            <input
              className={inputClass}
              value={form.latitude}
              onChange={(event) => set('latitude', event.target.value)}
              inputMode="decimal"
            />
          </div>
          <div>
            <label className={labelClass}>Longitud</label>
            <input
              className={inputClass}
              value={form.longitude}
              onChange={(event) => set('longitude', event.target.value)}
              inputMode="decimal"
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Educadores</h3>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <EntitySearchInput
              label="Educador responsable"
              value={responsibleEducatorId}
              options={userOptions}
              placeholder="Busca por nombre o apodo"
              emptyLabel="Sin educador responsable asignado."
              onChange={setResponsibleEducatorId}
            />
          </div>
          <div>
            <EntitySearchInput
              label="Agregar co-educador"
              value={coEducatorToAdd}
              options={userOptions}
              placeholder="Busca por nombre o apodo"
              emptyLabel="Selecciona un usuario para agregar."
              onChange={setCoEducatorToAdd}
            />
            <button
              type="button"
              disabled={!coEducatorToAdd || coEducatorIds.includes(coEducatorToAdd)}
              onClick={() => {
                setCoEducatorIds((ids) => [...ids, coEducatorToAdd])
                setCoEducatorToAdd('')
              }}
              className="mt-3 rounded-xl border border-accent/30 px-4 py-2 text-xs font-semibold text-accent transition-opacity disabled:opacity-40"
            >
              Agregar co-educador
            </button>
            <div className="mt-4 space-y-2">
              {coEducatorIds.length > 0 ? (
                coEducatorIds.map((id) => {
                  const option = userOptions.find((o) => o.id === id)
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text">
                          {option?.label || id}
                        </p>
                        <p className="truncate font-mono text-[10px] text-text-muted">{id}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setCoEducatorIds((ids) => ids.filter((x) => x !== id))
                        }
                        className="text-xs font-semibold text-danger"
                      >
                        Quitar
                      </button>
                    </div>
                  )
                })
              ) : (
                <p className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-muted">
                  Sin co-educadores registrados.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text">Horarios</h3>
            <p className="mt-1 text-sm text-text-muted">Edita los bloques visibles en la ficha publica.</p>
          </div>
          <button
            type="button"
            onClick={addSchedule}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:text-text"
          >
            Agregar horario
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {schedules.length > 0 ? (
            schedules.map((schedule, index) => (
              <div
                key={`${schedule.dayOfWeek}-${schedule.startTime}-${index}`}
                className="grid gap-3 rounded-2xl border border-border bg-surface/75 p-4 md:grid-cols-[1fr_140px_140px_auto]"
              >
                <select
                  className={inputClass}
                  value={schedule.dayOfWeek}
                  onChange={(event) =>
                    updateSchedule(index, 'dayOfWeek', Number(event.target.value))
                  }
                >
                  {DAY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  className={inputClass}
                  value={schedule.startTime}
                  onChange={(event) => updateSchedule(index, 'startTime', event.target.value)}
                />
                <input
                  type="time"
                  className={inputClass}
                  value={schedule.endTime}
                  onChange={(event) => updateSchedule(index, 'endTime', event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeSchedule(index)}
                  className="inline-flex items-center justify-center rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/14"
                >
                  Quitar
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface/55 px-4 py-6 text-sm text-text-muted">
              Este nucleo no tiene horarios cargados todavia.
            </div>
          )}
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Configuracion de pagos</h3>
        <p className="mt-1 text-sm text-text-muted">
          Controla como se cobran las clases de este nucleo y que ven los alumnos.
        </p>

        <label className="mt-5 flex items-center gap-3 cursor-pointer rounded-2xl border border-border bg-surface px-4 py-3">
          <input
            type="checkbox"
            checked={billing.classesAreFree}
            onChange={(event) => setBillingField('classesAreFree', event.target.checked)}
            className="h-5 w-5 accent-accent rounded-lg"
          />
          <span className="text-sm font-semibold text-text">Las clases son gratuitas</span>
        </label>

        {!billing.classesAreFree && (
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelClass}>Modalidad de cobro</label>
              <select
                className={inputClass}
                value={billing.billingMode}
                onChange={(event) => setBillingField('billingMode', event.target.value)}
              >
                <option value="monthly">Mensual</option>
                <option value="classPack">Pack de clases</option>
                <option value="perClass">Por clase</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                {billing.billingMode === 'classPack' ? 'Valor del pack' : 'Precio mensual'}
              </label>
              <input
                className={inputClass}
                value={billing.monthlyFee}
                onChange={(event) => setBillingField('monthlyFee', event.target.value)}
                inputMode="decimal"
                placeholder="Ej: 30"
              />
            </div>
            <div>
              <label className={labelClass}>Precio por clase suelta</label>
              <input
                className={inputClass}
                value={billing.classFee}
                onChange={(event) => setBillingField('classFee', event.target.value)}
                inputMode="decimal"
                placeholder="Ej: 8"
              />
            </div>
            <div>
              <label className={labelClass}>Clases por pack</label>
              <input
                className={inputClass}
                value={billing.classesPerPackage}
                onChange={(event) => setBillingField('classesPerPackage', event.target.value)}
                inputMode="numeric"
                placeholder="Ej: 8"
              />
            </div>
            <div>
              <label className={labelClass}>Moneda</label>
              <input
                className={inputClass}
                value={billing.currency}
                onChange={(event) => setBillingField('currency', event.target.value)}
                placeholder="Ej: EUR"
              />
            </div>
            <div>
              <label className={labelClass}>Dia limite de pago (1-31)</label>
              <input
                className={inputClass}
                value={billing.paymentDueDay}
                onChange={(event) => setBillingField('paymentDueDay', event.target.value)}
                inputMode="numeric"
                placeholder="Ej: 10"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer rounded-2xl border border-border bg-surface px-4 py-3 w-full">
                <input
                  type="checkbox"
                  checked={billing.showFeeAmount}
                  onChange={(event) => setBillingField('showFeeAmount', event.target.checked)}
                  className="h-5 w-5 accent-accent rounded-lg"
                />
                <span className="text-sm font-semibold text-text">Mostrar el precio a los alumnos</span>
              </label>
            </div>
          </div>
        )}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center justify-center rounded-xl border border-danger/30 bg-danger/10 px-5 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/14 disabled:opacity-50"
        >
          {deleting ? 'Eliminando...' : 'Eliminar nucleo'}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-92 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
