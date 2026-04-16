'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminEvent } from '@/lib/admin-queries'

interface Props {
  event: AdminEvent
  locale: string
}

type AdminEventLocation = NonNullable<AdminEvent['locations']>[number]
type AdminPaymentMethod = NonNullable<AdminEvent['paymentMethods']>[number]

type LocationForm = {
  name: string
  address: string
  latitude: string
  longitude: string
  date: string
  endTime: string
  originalDateIso: string | null
  originalEndTimeIso: string | null
  description: string
  country: string
  city: string
  isOnline: boolean
  onlineLink: string
  locationTBC: boolean
}

const PAYMENT_TYPES = ['transfer', 'paymentLink', 'pix', 'registrationForm']
const RECURRENCE_TYPES = ['none', 'weekly', 'biweekly', 'monthly']

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function isValidDate(date: Date): boolean {
  return Number.isFinite(date.getTime())
}

function isUtcMidnight(date: Date): boolean {
  return (
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0
  )
}

function formatDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return ''

  const date = new Date(iso)
  if (!isValidDate(date)) return ''

  // Legacy admin date-only writes were stored as midnight UTC. Showing those
  // with UTC parts prevents the one-day-back visual shift in local timezones.
  if (isUtcMidnight(date)) {
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function datetimeLocalToIso(value: string, originalIso?: string | null): string | null {
  if (!value) return null
  if (originalIso && value === formatDatetimeLocal(originalIso)) return originalIso

  const date = new Date(value)
  return isValidDate(date) ? date.toISOString() : null
}

function locationToForm(location: AdminEventLocation): LocationForm {
  return {
    name: location.name || '',
    address: location.address || '',
    latitude: String(location.latitude ?? 0),
    longitude: String(location.longitude ?? 0),
    date: formatDatetimeLocal(location.date),
    endTime: formatDatetimeLocal(location.endTime),
    originalDateIso: location.date,
    originalEndTimeIso: location.endTime ?? null,
    description: location.description || '',
    country: location.country || '',
    city: location.city || '',
    isOnline: location.isOnline ?? false,
    onlineLink: location.onlineLink || '',
    locationTBC: location.locationTBC ?? false,
  }
}

function newLocation(startDate: string): LocationForm {
  return {
    name: '',
    address: '',
    latitude: '0',
    longitude: '0',
    date: startDate,
    endTime: '',
    originalDateIso: null,
    originalEndTimeIso: null,
    description: '',
    country: '',
    city: '',
    isOnline: false,
    onlineLink: '',
    locationTBC: false,
  }
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function EventEditForm({ event, locale }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: event.title || '',
    description: event.description || '',
    category: event.category || '',
    startDate: formatDatetimeLocal(event.startDate),
    endDate: formatDatetimeLocal(event.endDate),
    recurrence: event.recurrence || 'none',
    recurrenceEndDate: formatDatetimeLocal(event.recurrenceEndDate),
    groupId: event.groupId || '',
    price: String(event.price ?? 0),
    currency: event.currency || 'CLP',
    showOrganizerGroups: event.showOrganizerGroups ?? true,
    posterUrlsText: (event.posterUrls || []).join('\n'),
    coOrganizerIdsText: (event.coOrganizerIds || []).join('\n'),
  })
  const [locations, setLocations] = useState<LocationForm[]>(
    (event.locations || []).map(locationToForm)
  )
  const [paymentMethods, setPaymentMethods] = useState<AdminPaymentMethod[]>(
    event.paymentMethods || []
  )
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function setLocation<K extends keyof LocationForm>(index: number, key: K, value: LocationForm[K]) {
    setLocations((current) =>
      current.map((location, itemIndex) =>
        itemIndex === index ? { ...location, [key]: value } : location
      )
    )
  }

  function setPaymentMethod<K extends keyof AdminPaymentMethod>(
    index: number,
    key: K,
    value: AdminPaymentMethod[K]
  ) {
    setPaymentMethods((current) =>
      current.map((method, itemIndex) => (itemIndex === index ? { ...method, [key]: value } : method))
    )
  }

  function addLocation() {
    setLocations((current) => [...current, newLocation(form.startDate)])
  }

  function removeLocation(index: number) {
    setLocations((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  function addPaymentMethod() {
    setPaymentMethods((current) => [
      ...current,
      { type: 'transfer', label: '', value: '', instructions: '' },
    ])
  }

  function removePaymentMethod(index: number) {
    setPaymentMethods((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          groupId: form.groupId || null,
          startDate: datetimeLocalToIso(form.startDate, event.startDate),
          endDate: datetimeLocalToIso(form.endDate, event.endDate),
          recurrence: form.recurrence === 'none' ? null : form.recurrence,
          recurrenceEndDate: datetimeLocalToIso(form.recurrenceEndDate, event.recurrenceEndDate),
          price: Number.parseFloat(form.price) || 0,
          currency: form.currency || 'CLP',
          showOrganizerGroups: form.showOrganizerGroups,
          posterUrls: splitLines(form.posterUrlsText),
          coOrganizerIds: splitLines(form.coOrganizerIdsText),
          locations: locations.map((location) => ({
            name: location.name,
            address: location.address,
            latitude: Number.parseFloat(location.latitude) || 0,
            longitude: Number.parseFloat(location.longitude) || 0,
            date: datetimeLocalToIso(location.date, location.originalDateIso),
            endTime: datetimeLocalToIso(location.endTime, location.originalEndTimeIso),
            description: location.description,
            country: location.country,
            city: location.city,
            isOnline: location.isOnline,
            onlineLink: location.onlineLink,
            locationTBC: location.locationTBC,
          })),
          paymentMethods,
        }),
      })

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error || 'Error al guardar')
      }

      setMessage({ type: 'ok', text: 'Evento actualizado correctamente' })
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
    if (!confirm('Eliminar este evento permanentemente?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      router.push(`/${locale}/admin/events`)
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
        <h3 className="text-sm font-semibold text-text">Detalles del evento</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Titulo</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(event) => set('title', event.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Inicio con hora</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.startDate}
              onChange={(event) => set('startDate', event.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Fin con hora</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.endDate}
              onChange={(event) => set('endDate', event.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Categoria</label>
            <input
              className={inputClass}
              value={form.category}
              onChange={(event) => set('category', event.target.value)}
              placeholder="encuentro, roda, taller..."
            />
          </div>

          <div>
            <label className={labelClass}>Grupo relacionado</label>
            <input
              className={inputClass}
              value={form.groupId}
              onChange={(event) => set('groupId', event.target.value)}
              placeholder="groupId opcional"
            />
          </div>

          <div>
            <label className={labelClass}>Precio</label>
            <input
              type="number"
              min="0"
              step="1"
              className={inputClass}
              value={form.price}
              onChange={(event) => set('price', event.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Moneda</label>
            <input
              className={inputClass}
              value={form.currency}
              onChange={(event) => set('currency', event.target.value.toUpperCase())}
              placeholder="CLP"
            />
          </div>

          <div>
            <label className={labelClass}>Recurrencia</label>
            <select
              className={inputClass}
              value={form.recurrence}
              onChange={(event) => set('recurrence', event.target.value)}
            >
              {RECURRENCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Fin de recurrencia</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.recurrenceEndDate}
              onChange={(event) => set('recurrenceEndDate', event.target.value)}
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text md:col-span-2">
            <input
              type="checkbox"
              checked={form.showOrganizerGroups}
              onChange={(event) => set('showOrganizerGroups', event.target.checked)}
            />
            Mostrar grupos de organizadores
          </label>

          <div className="md:col-span-2">
            <label className={labelClass}>Descripcion</label>
            <textarea
              className={`${inputClass} min-h-[150px] resize-y`}
              value={form.description}
              onChange={(event) => set('description', event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-text">Cronograma y ubicaciones</h3>
            <p className="mt-1 text-xs text-text-muted">Edita cada bloque creado por el usuario.</p>
          </div>
          <button
            type="button"
            onClick={addLocation}
            className="rounded-xl border border-accent/30 px-4 py-2 text-xs font-semibold text-accent"
          >
            Agregar bloque
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {locations.map((location, index) => (
            <div key={index} className="rounded-2xl border border-border bg-surface p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Bloque {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeLocation(index)}
                  className="text-xs font-semibold text-danger"
                >
                  Quitar
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Fecha y hora inicio</label>
                  <input
                    type="datetime-local"
                    className={inputClass}
                    value={location.date}
                    onChange={(event) => setLocation(index, 'date', event.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Fecha y hora fin</label>
                  <input
                    type="datetime-local"
                    className={inputClass}
                    value={location.endTime}
                    onChange={(event) => setLocation(index, 'endTime', event.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Actividad / nombre del bloque</label>
                  <input
                    className={inputClass}
                    value={location.name}
                    onChange={(event) => setLocation(index, 'name', event.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Pais</label>
                  <input
                    className={inputClass}
                    value={location.country}
                    onChange={(event) => setLocation(index, 'country', event.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Ciudad</label>
                  <input
                    className={inputClass}
                    value={location.city}
                    onChange={(event) => setLocation(index, 'city', event.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Direccion</label>
                  <input
                    className={inputClass}
                    value={location.address}
                    onChange={(event) => setLocation(index, 'address', event.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Latitud</label>
                  <input
                    type="number"
                    step="any"
                    className={inputClass}
                    value={location.latitude}
                    onChange={(event) => setLocation(index, 'latitude', event.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Longitud</label>
                  <input
                    type="number"
                    step="any"
                    className={inputClass}
                    value={location.longitude}
                    onChange={(event) => setLocation(index, 'longitude', event.target.value)}
                  />
                </div>
                <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-text">
                  <input
                    type="checkbox"
                    checked={location.isOnline}
                    onChange={(event) => setLocation(index, 'isOnline', event.target.checked)}
                  />
                  Evento online
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-text">
                  <input
                    type="checkbox"
                    checked={location.locationTBC}
                    onChange={(event) => setLocation(index, 'locationTBC', event.target.checked)}
                  />
                  Ubicacion por confirmar
                </label>
                <div className="md:col-span-2">
                  <label className={labelClass}>Enlace online</label>
                  <input
                    className={inputClass}
                    value={location.onlineLink}
                    onChange={(event) => setLocation(index, 'onlineLink', event.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Descripcion del bloque</label>
                  <textarea
                    className={`${inputClass} min-h-[96px] resize-y`}
                    value={location.description}
                    onChange={(event) => setLocation(index, 'description', event.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          {locations.length === 0 ? (
            <p className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-muted">
              Este evento no tiene bloques de ubicacion. Puedes agregar uno desde aqui.
            </p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-text">Medios de pago</h3>
          <button
            type="button"
            onClick={addPaymentMethod}
            className="rounded-xl border border-accent/30 px-4 py-2 text-xs font-semibold text-accent"
          >
            Agregar metodo
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {paymentMethods.map((method, index) => (
            <div key={index} className="rounded-2xl border border-border bg-surface p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Metodo {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removePaymentMethod(index)}
                  className="text-xs font-semibold text-danger"
                >
                  Quitar
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Tipo</label>
                  <select
                    className={inputClass}
                    value={method.type}
                    onChange={(event) => setPaymentMethod(index, 'type', event.target.value)}
                  >
                    {PAYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Etiqueta</label>
                  <input
                    className={inputClass}
                    value={method.label}
                    onChange={(event) => setPaymentMethod(index, 'label', event.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Valor / enlace / datos</label>
                  <textarea
                    className={`${inputClass} min-h-[96px] resize-y`}
                    value={method.value}
                    onChange={(event) => setPaymentMethod(index, 'value', event.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Instrucciones</label>
                  <textarea
                    className={`${inputClass} min-h-[80px] resize-y`}
                    value={method.instructions || ''}
                    onChange={(event) => setPaymentMethod(index, 'instructions', event.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold text-text">Multimedia y organizadores</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Poster URLs (una por linea)</label>
            <textarea
              className={`${inputClass} min-h-[130px] resize-y`}
              value={form.posterUrlsText}
              onChange={(event) => set('posterUrlsText', event.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Coorganizadores UID (uno por linea)</label>
            <textarea
              className={`${inputClass} min-h-[130px] resize-y`}
              value={form.coOrganizerIdsText}
              onChange={(event) => set('coOrganizerIdsText', event.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center justify-center rounded-xl border border-danger/30 bg-danger/10 px-5 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/14 disabled:opacity-50"
        >
          {deleting ? 'Eliminando...' : 'Eliminar evento'}
        </button>

        <button
          type="button"
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
