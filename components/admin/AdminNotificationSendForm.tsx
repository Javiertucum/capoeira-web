'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import UserSearchCombobox from './UserSearchCombobox'
import MultiSelectDropdown from './MultiSelectDropdown'

type SendResult = {
  ok: boolean
  id?: string
  scheduled?: boolean
  scheduledAt?: string
  targeted?: number
  sent?: number
  failed?: number
  purged?: number
  error?: string
  errors?: string[]
}

type RecipientRow = {
  uid: string
  displayName: string
  email: string
  sent: boolean
  opened: boolean
  openedAt: string | null
}

type Group = { id: string; name: string }
type Nucleo = { id: string; name: string; groupId: string; groupName: string }
type UserResult = { uid: string; displayName: string; email: string; photoURL: string | null }

type ContentItem = { id: string; title: string; subtitle: string | null }

const NO_GROUP_VALUE = '__no_group__'

const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español' },
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
] as const

const ROLE_OPTIONS = [
  { value: 'student', label: 'Alumnos' },
  { value: 'educator', label: 'Educadores' },
]

const PLAN_OPTIONS = [
  { value: 'free', label: 'Plan gratuito' },
  { value: 'premium', label: 'Plan premium' },
]

// Pantallas reales de la app móvil (expo-router) — ver lib/notifications/notificationRouting.ts
const SCREEN_OPTIONS = [
  { value: '', label: 'Sin destino específico' },
  { value: 'home', label: 'Inicio' },
  { value: 'events', label: 'Eventos (lista)' },
  { value: 'groups', label: 'Grupos (lista)' },
  { value: 'profile', label: 'Mi perfil' },
  { value: 'event', label: 'Evento concreto', needsSearch: true, endpoint: '/api/admin/search/events' },
  { value: 'group', label: 'Grupo concreto', needsGroupPicker: true },
  { value: 'nucleo', label: 'Núcleo concreto', needsNucleoPicker: true },
  { value: 'userProfile', label: 'Perfil de usuario', needsSearch: true, endpoint: '/api/admin/users/search' },
  { value: 'custom', label: 'Link personalizado', needsCustomLink: true },
] as const

type ScreenValue = typeof SCREEN_OPTIONS[number]['value']

type AppVersionStat = { version: string; count: number }

type Props = {
  groups: Group[]
  nucleos: Nucleo[]
  appVersions: AppVersionStat[]
}

export default function AdminNotificationSendForm({ groups, nucleos, appVersions }: Props) {
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  // Audience
  const [roles, setRoles] = useState<string[]>([])
  const [countries, setCountries] = useState('')
  const [plans, setPlans] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const [selectedNucleoIds, setSelectedNucleoIds] = useState<string[]>([])
  const [noGroup, setNoGroup] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<UserResult[]>([])
  const [selectedAppVersions, setSelectedAppVersions] = useState<string[]>([])

  // Deep link
  const [screen, setScreen] = useState<ScreenValue>('')
  const [contentItem, setContentItem] = useState<ContentItem | null>(null)
  const [contentQuery, setContentQuery] = useState('')
  const [contentResults, setContentResults] = useState<ContentItem[]>([])
  const [contentOpen, setContentOpen] = useState(false)
  const [customLink, setCustomLink] = useState('')
  const contentDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Schedule
  const [scheduledAt, setScheduledAt] = useState('')

  // Estimate
  const [estimate, setEstimate] = useState<number | null>(null)
  const estimateDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)
  const [recipients, setRecipients] = useState<RecipientRow[]>([])
  const [loadingRecipients, setLoadingRecipients] = useState(false)

  const currentScreenOption = SCREEN_OPTIONS.find((o) => o.value === screen)
  const needsSearch = currentScreenOption && 'needsSearch' in currentScreenOption && currentScreenOption.needsSearch
  const needsGroupPicker = screen === 'group'
  const needsNucleoPicker = screen === 'nucleo'
  const needsCustomLink = screen === 'custom'
  const isScheduling = scheduledAt.trim() !== ''

  function toggleItem<T extends string>(list: T[], item: T): T[] {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
  }

  function handleGroupDropdownChange(values: string[]) {
    setNoGroup(values.includes(NO_GROUP_VALUE))
    setSelectedGroupIds(values.filter((v) => v !== NO_GROUP_VALUE))
  }

  // Audience estimate
  const buildSegment = useCallback(() => ({
    roles,
    countries: countries.split(',').map((c) => c.trim()).filter(Boolean),
    subscriptionPlans: plans,
    groupIds: selectedGroupIds,
    nucleoIds: selectedNucleoIds,
    noGroup,
    userIds: selectedUsers.map((u) => u.uid),
    languages,
    ...(selectedAppVersions.length > 0 && { appVersions: selectedAppVersions }),
  }), [roles, countries, plans, selectedGroupIds, selectedNucleoIds, noGroup, selectedUsers, languages, selectedAppVersions])

  useEffect(() => {
    if (estimateDebounce.current) clearTimeout(estimateDebounce.current)
    estimateDebounce.current = setTimeout(async () => {
      const segment = buildSegment()
      const res = await fetch('/api/admin/notifications/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segment),
      }).catch(() => null)
      if (res?.ok) {
        const data = await res.json() as { count: number }
        setEstimate(data.count)
      }
    }, 500)
  }, [buildSegment])

  // Content search for deep link (event / userProfile only — group/nucleo use a plain dropdown)
  useEffect(() => {
    if (!needsSearch || contentQuery.length < 2) {
      setContentResults([])
      setContentOpen(false)
      return
    }
    if (contentDebounce.current) clearTimeout(contentDebounce.current)
    contentDebounce.current = setTimeout(async () => {
      const endpoint = (currentScreenOption as { endpoint: string }).endpoint
      const res = await fetch(`${endpoint}?q=${encodeURIComponent(contentQuery)}`).catch(() => null)
      if (res?.ok) {
        const data = await res.json() as { id: string; title?: string; displayName?: string; subtitle?: string | null }[]
        setContentResults(data.map((d) => ({
          id: d.id ?? (d as { uid?: string }).uid ?? '',
          title: d.title ?? d.displayName ?? d.id,
          subtitle: d.subtitle ?? null,
        })))
        setContentOpen(true)
      }
    }, 300)
  }, [contentQuery, needsSearch, currentScreenOption])

  function selectContentItem(item: ContentItem) {
    setContentItem(item)
    setContentQuery('')
    setContentResults([])
    setContentOpen(false)
  }

  function handleScreenChange(value: ScreenValue) {
    setScreen(value)
    setContentItem(null)
    setContentQuery('')
    setContentResults([])
    setCustomLink('')
  }

  async function loadRecipients(campaignId: string) {
    setLoadingRecipients(true)
    try {
      const res = await fetch(`/api/admin/notifications/${campaignId}/recipients?filter=all`)
      if (res.ok) {
        const data = (await res.json()) as { recipients: RecipientRow[] }
        setRecipients(data.recipients)
      }
    } finally {
      setLoadingRecipients(false)
    }
  }

  async function handleSend() {
    if (!title.trim() || !body.trim()) return
    setSending(true)
    setResult(null)
    setRecipients([])

    const segment = buildSegment()
    const payload: Record<string, unknown> = {
      title: title.trim(),
      body: body.trim(),
      ...segment,
    }

    if (screen) {
      payload.screen = screen
      if (needsCustomLink) {
        payload.entityId = customLink.trim()
        payload.entityType = 'custom'
      } else if (contentItem) {
        payload.entityId = contentItem.id
        payload.entityType = screen
      }
    }

    if (isScheduling) {
      const date = new Date(scheduledAt)
      if (!Number.isNaN(date.getTime())) {
        payload.scheduledAt = date.toISOString()
      }
    }

    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      let data: SendResult
      try {
        data = (await response.json()) as SendResult
      } catch {
        throw new Error(
          response.ok
            ? 'Respuesta invalida del servidor'
            : `Error del servidor (HTTP ${response.status}). La notificacion puede haberse enviado igualmente.`
        )
      }
      setResult(data)
      if (data.ok) {
        setTitle('')
        setBody('')
        setScreen('')
        setContentItem(null)
        setCustomLink('')
        setSelectedUsers([])
        setSelectedGroupIds([])
        setSelectedNucleoIds([])
        setNoGroup(false)
        setLanguages([])
        setSelectedAppVersions([])
        setScheduledAt('')
        if (!data.scheduled && data.id) {
          void loadRecipients(data.id)
        }
        router.refresh()
      }
    } catch (err) {
      setResult({ ok: false, error: err instanceof Error ? err.message : 'Error de red al enviar' })
    } finally {
      setSending(false)
    }
  }

  const canSend = title.trim() && body.trim() && !sending

  return (
    <div className="rounded-[22px] border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-1 text-base font-semibold text-text">Enviar notificación push</h3>
      <p className="mb-6 text-sm text-text-muted">
        Se enviará inmediatamente (o a la hora programada) a los dispositivos del segmento seleccionado.
      </p>

      <div className="flex flex-col gap-5">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la notificación"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-accent/40"
          />
        </div>

        {/* Body */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Mensaje
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Cuerpo del mensaje..."
            className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-accent/40"
          />
        </div>

        {/* Roles */}
        <MultiSelectDropdown label="Rol" options={ROLE_OPTIONS} selected={roles} onChange={setRoles} />

        {/* Countries */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Países (códigos separados por coma, vacío = todos)
          </label>
          <input
            type="text"
            value={countries}
            onChange={(e) => setCountries(e.target.value)}
            placeholder="ES, AR, BR, MX"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent/40"
          />
        </div>

        {/* Plans */}
        <MultiSelectDropdown label="Plan" options={PLAN_OPTIONS} selected={plans} onChange={setPlans} />

        {/* Languages */}
        <div>
          <MultiSelectDropdown
            label="Idioma del dispositivo (vacío = todos)"
            options={LANGUAGE_OPTIONS.map((l) => ({ value: l.value, label: l.label }))}
            selected={languages}
            onChange={setLanguages}
          />
          {languages.length > 0 && (
            <p className="mt-1.5 text-xs text-text-muted">
              Solo se enviará a usuarios cuyo idioma de dispositivo esté sincronizado y coincida.
            </p>
          )}
        </div>

        {/* App version */}
        {appVersions.length > 0 && (
          <div>
            <MultiSelectDropdown
              label="Versión de app (opcional)"
              options={appVersions.map((v) => ({ value: v.version, label: `${v.version} · ${v.count} usuarios` }))}
              selected={selectedAppVersions}
              onChange={setSelectedAppVersions}
              placeholder="Todas las versiones"
            />
            {selectedAppVersions.length > 0 && (
              <p className="mt-1.5 text-xs text-text-muted">
                Solo llega a dispositivos que ya reportaron una de las versiones seleccionadas (se registra al abrir
                la app).
              </p>
            )}
          </div>
        )}

        {/* Groups */}
        {groups.length > 0 && (
          <MultiSelectDropdown
            label="Grupos"
            options={[...groups.map((g) => ({ value: g.id, label: g.name })), { value: NO_GROUP_VALUE, label: 'Sin grupo' }]}
            selected={[...selectedGroupIds, ...(noGroup ? [NO_GROUP_VALUE] : [])]}
            onChange={handleGroupDropdownChange}
          />
        )}

        {/* Nucleos */}
        {nucleos.length > 0 && (
          <div>
            <MultiSelectDropdown
              label="Núcleos"
              options={nucleos.map((n) => ({ value: n.id, label: `${n.groupName} · ${n.name}` }))}
              selected={selectedNucleoIds}
              onChange={setSelectedNucleoIds}
            />
            {selectedNucleoIds.length > 0 && (
              <p className="mt-1.5 text-xs text-text-muted">
                Solo se enviará a los miembros de los núcleos seleccionados (independiente de los grupos marcados arriba).
              </p>
            )}
          </div>
        )}

        {/* Individual users */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Usuarios individuales
          </label>
          <UserSearchCombobox
            selected={selectedUsers}
            onAdd={(user) => setSelectedUsers((prev) => [...prev, user])}
            onRemove={(uid) => setSelectedUsers((prev) => prev.filter((u) => u.uid !== uid))}
          />
        </div>

        {/* Estimate */}
        {estimate !== null && (
          <p className="text-xs text-text-muted">
            Audiencia estimada:{' '}
            <span className="font-semibold text-text">~{estimate} usuarios</span>
          </p>
        )}

        {/* Deep link */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Pantalla de destino
          </label>
          <select
            value={screen}
            onChange={(e) => handleScreenChange(e.target.value as ScreenValue)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent/40"
          >
            {SCREEN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {needsCustomLink && (
            <input
              type="text"
              value={customLink}
              onChange={(e) => setCustomLink(e.target.value)}
              placeholder="/event/abc123 o https://agendacapoeiragem.com/..."
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent/40"
            />
          )}

          {needsGroupPicker && (
            <select
              value={contentItem?.id ?? ''}
              onChange={(e) => {
                const g = groups.find((x) => x.id === e.target.value)
                setContentItem(g ? { id: g.id, title: g.name, subtitle: null } : null)
              }}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent/40"
            >
              <option value="">Selecciona un grupo...</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          )}

          {needsNucleoPicker && (
            <select
              value={contentItem?.id ?? ''}
              onChange={(e) => {
                const n = nucleos.find((x) => x.id === e.target.value)
                setContentItem(n ? { id: n.id, title: `${n.groupName} · ${n.name}`, subtitle: null } : null)
              }}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent/40"
            >
              <option value="">Selecciona un núcleo...</option>
              {nucleos.map((n) => (
                <option key={n.id} value={n.id}>{n.groupName} · {n.name}</option>
              ))}
            </select>
          )}

          {needsSearch && (
            <div className="relative mt-2">
              {contentItem ? (
                <div className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/10 px-4 py-2">
                  <span className="text-sm font-semibold text-accent">{contentItem.title}</span>
                  <button
                    type="button"
                    onClick={() => setContentItem(null)}
                    className="text-xs opacity-60 hover:opacity-100"
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={contentQuery}
                    onChange={(e) => setContentQuery(e.target.value)}
                    onBlur={() => setTimeout(() => setContentOpen(false), 150)}
                    onFocus={() => contentResults.length > 0 && setContentOpen(true)}
                    placeholder="Buscar contenido..."
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent/40"
                  />
                  {contentOpen && contentResults.length > 0 && (
                    <ul className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg">
                      {contentResults.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseDown={() => selectContentItem(item)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-surface/60"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-text">{item.title}</p>
                              {item.subtitle && (
                                <p className="truncate text-xs text-text-muted">{item.subtitle}</p>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Schedule */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Programar envío (opcional)
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent/40"
          />
          {isScheduling && (
            <p className="mt-1.5 text-xs text-text-muted">
              Se enviará automáticamente en la fecha y hora elegidas. Déjalo vacío para enviar de inmediato.
            </p>
          )}
        </div>

        {/* Send button */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending
              ? (isScheduling ? 'Programando...' : 'Enviando...')
              : (isScheduling ? 'Programar notificación' : 'Enviar notificación')}
          </button>
          {sending && (
            <span className="text-xs text-text-muted">Buscando tokens FCM y enviando...</span>
          )}
        </div>

        {result && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              result.ok
                ? 'border-accent/20 bg-accent/8 text-accent'
                : 'border-danger/20 bg-danger/8 text-danger'
            }`}
          >
            {result.ok
              ? result.scheduled
                ? `Notificación programada para ${result.scheduledAt ? new Date(result.scheduledAt).toLocaleString(params.locale) : ''}.`
                : `Enviado a ${result.sent}/${result.targeted} dispositivos · ${result.failed} fallidos${(result.purged ?? 0) > 0 ? ` · ${result.purged} tokens vencidos eliminados` : ''}`
              : result.error}
            {result.errors && result.errors.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs opacity-80">
                {result.errors.map((e, i) => <li key={i}>· {e}</li>)}
              </ul>
            )}
          </div>
        )}

        {/* Recipients list (who received / who opened) */}
        {result?.ok && !result.scheduled && result.id && (
          <div className="rounded-xl border border-border bg-surface/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-text">Destinatarios</h4>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => result.id && loadRecipients(result.id)}
                  disabled={loadingRecipients}
                  className="text-xs font-semibold text-accent hover:underline disabled:opacity-50"
                >
                  {loadingRecipients ? 'Actualizando...' : 'Actualizar aperturas'}
                </button>
                <Link
                  href={`/${params.locale}/admin/notifications/${result.id}`}
                  className="text-xs font-semibold text-text-secondary hover:text-text hover:underline"
                >
                  Ver detalle completo
                </Link>
              </div>
            </div>

            {recipients.length === 0 ? (
              <p className="text-xs text-text-muted">
                {loadingRecipients ? 'Cargando destinatarios...' : 'No hay destinatarios registrados todavía.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse">
                  <thead>
                    <tr>
                      {['Usuario', 'Email', 'Recibida', 'Abierta'].map((h) => (
                        <th key={h} className="border-b border-border px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recipients.map((r) => (
                      <tr key={r.uid}>
                        <td className="px-3 py-2 text-sm text-text">{r.displayName || 'Sin nombre'}</td>
                        <td className="px-3 py-2 text-xs text-text-secondary">{r.email || '—'}</td>
                        <td className="px-3 py-2 text-sm">{r.sent ? <span className="text-accent">✓</span> : <span className="text-danger">✗</span>}</td>
                        <td className="px-3 py-2 text-sm">{r.opened ? <span className="text-accent">✓</span> : <span className="text-text-muted">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recipients.length >= 20 && (
                  <p className="mt-2 text-xs text-text-muted">
                    Mostrando los primeros {recipients.length}. Usa &quot;Ver detalle completo&quot; para paginar.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
