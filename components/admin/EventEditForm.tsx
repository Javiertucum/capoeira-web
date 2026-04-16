'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminEntityOption, AdminEntityType, AdminEvent } from '@/lib/admin-queries'

interface Props {
  event: AdminEvent
  locale: string
  entityOptions: AdminEntityOption[]
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
const ENTITY_TYPE_LABELS: Record<AdminEntityType, string> = {
  user: 'Usuario',
  group: 'Grupo',
  nucleo: 'Nucleo',
  event: 'Evento',
}

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

function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function entitySearchText(option: AdminEntityOption): string {
  return normalizeSearch(
    [option.label, option.description, option.id, option.groupId, ENTITY_TYPE_LABELS[option.type]]
      .filter(Boolean)
      .join(' ')
  )
}

function EntityBadge({ type }: { type: AdminEntityType }) {
  return (
    <span className="rounded-full border border-border bg-card px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
      {ENTITY_TYPE_LABELS[type]}
    </span>
  )
}

function EntitySearchInput({
  label,
  value,
  options,
  placeholder,
  emptyLabel = 'Sin seleccion',
  onChange,
}: {
  label: string
  value: string
  options: AdminEntityOption[]
  placeholder: string
  emptyLabel?: string
  onChange: (value: string) => void
}) {
  const selected = options.find((option) => option.id === value)
  const selectedLabel = selected?.label || value || ''
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const normalizedQuery = normalizeSearch(query)
  const results = useMemo(() => {
    const pool = normalizedQuery
      ? options.filter((option) => entitySearchText(option).includes(normalizedQuery))
      : options
    return pool.slice(0, 8)
  }, [normalizedQuery, options])
  const inputClass =
    'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/35'
  const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted'

  return (
    <div className="relative">
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={open ? query : selectedLabel}
          onFocus={() => {
            setQuery('')
            setOpen(true)
          }}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onBlur={() => window.setTimeout(() => setOpen(false), 140)}
          placeholder={placeholder}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded-2xl border border-border bg-surface px-4 text-xs font-semibold text-text-muted transition-colors hover:text-text"
          >
            Limpiar
          </button>
        ) : null}
      </div>
      {selected ? (
        <p className="mt-2 text-xs text-text-muted">
          {selected.description ? `${selected.description} - ` : ''}
          <span className="font-mono">{selected.id}</span>
        </p>
      ) : value ? (
        <p className="mt-2 text-xs text-text-muted">
          ID sin nombre encontrado: <span className="font-mono">{value}</span>
        </p>
      ) : (
        <p className="mt-2 text-xs text-text-muted">{emptyLabel}</p>
      )}
      {open ? (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-xl">
          {results.length > 0 ? (
            results.map((option) => (
              <button
                key={`${option.type}-${option.groupId || 'root'}-${option.id}`}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option.id)
                  setQuery('')
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-surface"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-text">{option.label}</span>
                  <span className="block truncate text-xs text-text-muted">
                    {option.description || option.id}
                  </span>
                </span>
                <EntityBadge type={option.type} />
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-sm text-text-muted">No hay resultados.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}

function EntityLookup({ options }: { options: AdminEntityOption[] }) {
  const [query, setQuery] = useState('')
  const normalizedQuery = normalizeSearch(query)
  const results = useMemo(() => {
    if (!normalizedQuery) return options.slice(0, 10)
    return options.filter((option) => entitySearchText(option).includes(normalizedQuery)).slice(0, 12)
  }, [normalizedQuery, options])

  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
        Buscar referencias
      </label>
      <input
        className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/35"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Busca usuarios, grupos, nucleos o eventos"
      />
      <div className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-border bg-surface p-2">
        {results.map((option) => (
          <div
            key={`${option.type}-${option.groupId || 'root'}-${option.id}`}
            className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{option.label}</p>
              <p className="truncate text-xs text-text-muted">
                {option.description ? `${option.description} - ` : ''}
                <span className="font-mono">{option.id}</span>
              </p>
            </div>
            <EntityBadge type={option.type} />
          </div>
        ))}
        {results.length === 0 ? (
          <p className="px-3 py-4 text-sm text-text-muted">No hay resultados.</p>
        ) : null}
      </div>
    </div>
  )
}

export default function EventEditForm({ event, locale, entityOptions }: Props) {
  const router = useRouter()
  const groupOptions = useMemo(
    () => entityOptions.filter((option) => option.type === 'group'),
    [entityOptions]
  )
  const userOptions = useMemo(
    () => entityOptions.filter((option) => option.type === 'user'),
    [entityOptions]
  )
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
  })
  const [coOrganizerIds, setCoOrganizerIds] = useState<string[]>(event.coOrganizerIds || [])
  const [coOrganizerToAdd, setCoOrganizerToAdd] = useState('')
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
          coOrganizerIds,
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
            <EntitySearchInput
              label="Grupo relacionado"
              value={form.groupId}
              options={groupOptions}
              placeholder="Busca por nombre de grupo"
              onChange={(value) => set('groupId', value)}
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
            <EntitySearchInput
              label="Agregar coorganizador"
              value={coOrganizerToAdd}
              options={userOptions}
              placeholder="Busca por nombre, apodo o correo"
              emptyLabel="Selecciona un usuario y agregalo a la lista."
              onChange={(value) => setCoOrganizerToAdd(value)}
            />
            <button
              type="button"
              disabled={!coOrganizerToAdd || coOrganizerIds.includes(coOrganizerToAdd)}
              onClick={() => {
                setCoOrganizerIds((current) => [...current, coOrganizerToAdd])
                setCoOrganizerToAdd('')
              }}
              className="mt-3 rounded-xl border border-accent/30 px-4 py-2 text-xs font-semibold text-accent transition-opacity disabled:opacity-40"
            >
              Agregar coorganizador
            </button>
            <div className="mt-4 space-y-2">
              {coOrganizerIds.length > 0 ? (
                coOrganizerIds.map((id) => {
                  const option = userOptions.find((item) => item.id === id)
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text">{option?.label || id}</p>
                        <p className="truncate text-xs text-text-muted">
                          {option?.description ? `${option.description} - ` : ''}
                          <span className="font-mono">{id}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCoOrganizerIds((current) => current.filter((item) => item !== id))}
                        className="text-xs font-semibold text-danger"
                      >
                        Quitar
                      </button>
                    </div>
                  )
                })
              ) : (
                <p className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-muted">
                  Sin coorganizadores registrados.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <EntityLookup options={entityOptions} />
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
