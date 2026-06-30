'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserSearchCombobox from './UserSearchCombobox'

type SendResult = {
  ok: boolean
  targeted?: number
  sent?: number
  failed?: number
  purged?: number
  error?: string
  errors?: string[]
}

type Group = { id: string; name: string }
type Nucleo = { id: string; name: string; groupId: string; groupName: string }
type UserResult = { uid: string; displayName: string; email: string; photoURL: string | null }

type ContentItem = { id: string; title: string; subtitle: string | null }

const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español' },
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
] as const

const SCREEN_OPTIONS = [
  { value: '', label: 'Sin destino específico' },
  { value: 'home', label: 'Inicio' },
  { value: 'events', label: 'Eventos (lista)' },
  { value: 'feed', label: 'Noticias / Feed' },
  { value: 'profile', label: 'Mi perfil' },
  { value: 'event', label: 'Evento concreto', needsContent: true, endpoint: '/api/admin/search/events' },
  { value: 'post', label: 'Post / noticia', needsContent: true, endpoint: '/api/admin/search/posts' },
  { value: 'userProfile', label: 'Perfil de usuario', needsContent: true, endpoint: '/api/admin/users/search' },
] as const

type ScreenValue = typeof SCREEN_OPTIONS[number]['value']

type Props = {
  groups: Group[]
  nucleos: Nucleo[]
}

export default function AdminNotificationSendForm({ groups, nucleos }: Props) {
  const router = useRouter()
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

  // Deep link
  const [screen, setScreen] = useState<ScreenValue>('')
  const [contentItem, setContentItem] = useState<ContentItem | null>(null)
  const [contentQuery, setContentQuery] = useState('')
  const [contentResults, setContentResults] = useState<ContentItem[]>([])
  const [contentOpen, setContentOpen] = useState(false)
  const contentDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Estimate
  const [estimate, setEstimate] = useState<number | null>(null)
  const estimateDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)

  const currentScreenOption = SCREEN_OPTIONS.find((o) => o.value === screen)
  const needsContent = currentScreenOption && 'needsContent' in currentScreenOption && currentScreenOption.needsContent

  function toggleItem<T extends string>(list: T[], item: T): T[] {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
  }

  function toggleGroup(id: string) {
    setSelectedGroupIds((prev) => toggleItem(prev, id))
  }

  function toggleNucleo(id: string) {
    setSelectedNucleoIds((prev) => toggleItem(prev, id))
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
  }), [roles, countries, plans, selectedGroupIds, selectedNucleoIds, noGroup, selectedUsers, languages])

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

  // Content search for deep link
  useEffect(() => {
    if (!needsContent || contentQuery.length < 2) {
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
  }, [contentQuery, screen, needsContent, currentScreenOption])

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
  }

  async function handleSend() {
    if (!title.trim() || !body.trim()) return
    setSending(true)
    setResult(null)

    const segment = buildSegment()
    const payload: Record<string, unknown> = {
      title: title.trim(),
      body: body.trim(),
      ...segment,
    }

    if (screen) {
      payload.screen = screen
      if (contentItem) {
        payload.entityId = contentItem.id
        payload.entityType = screen
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
        setSelectedUsers([])
        setSelectedGroupIds([])
        setSelectedNucleoIds([])
        setNoGroup(false)
        setLanguages([])
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
        Se enviará inmediatamente a los dispositivos del segmento seleccionado.
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
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Rol
          </label>
          <div className="flex flex-wrap gap-2">
            {(['student', 'educator'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoles(toggleItem(roles, role))}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                  roles.includes(role)
                    ? 'border-accent/30 bg-accent/12 text-accent'
                    : 'border-border bg-surface text-text-secondary'
                }`}
              >
                {role === 'student' ? 'Alumnos' : 'Educadores'}
              </button>
            ))}
          </div>
        </div>

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
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Plan
          </label>
          <div className="flex flex-wrap gap-2">
            {(['free', 'premium'] as const).map((plan) => (
              <button
                key={plan}
                type="button"
                onClick={() => setPlans(toggleItem(plans, plan))}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                  plans.includes(plan)
                    ? 'border-accent/30 bg-accent/12 text-accent'
                    : 'border-border bg-surface text-text-secondary'
                }`}
              >
                {plan === 'free' ? 'Plan gratuito' : 'Plan premium'}
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Idioma del dispositivo (vacío = todos)
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => setLanguages(toggleItem(languages, lang.value))}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                  languages.includes(lang.value)
                    ? 'border-accent/30 bg-accent/12 text-accent'
                    : 'border-border bg-surface text-text-secondary'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          {languages.length > 0 && (
            <p className="mt-1.5 text-xs text-text-muted">
              Solo se enviará a usuarios cuyo idioma de dispositivo esté sincronizado y coincida.
            </p>
          )}
        </div>

        {/* Groups */}
        {groups.length > 0 && (
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Grupos
            </label>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                    selectedGroupIds.includes(group.id)
                      ? 'border-accent/30 bg-accent/12 text-accent'
                      : 'border-border bg-surface text-text-secondary'
                  }`}
                >
                  {group.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setNoGroup((v) => !v)}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                  noGroup
                    ? 'border-warning/30 bg-warning/10 text-warning'
                    : 'border-border bg-surface text-text-secondary'
                }`}
              >
                Sin grupo
              </button>
            </div>
          </div>
        )}

        {/* Nucleos */}
        {nucleos.length > 0 && (
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Núcleos
            </label>
            <div className="flex flex-wrap gap-2">
              {nucleos.map((nucleo) => (
                <button
                  key={nucleo.id}
                  type="button"
                  onClick={() => toggleNucleo(nucleo.id)}
                  className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                    selectedNucleoIds.includes(nucleo.id)
                      ? 'border-accent/30 bg-accent/12 text-accent'
                      : 'border-border bg-surface text-text-secondary'
                  }`}
                >
                  {nucleo.groupName} · {nucleo.name}
                </button>
              ))}
            </div>
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

          {needsContent && (
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

        {/* Send button */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? 'Enviando...' : 'Enviar notificación'}
          </button>
          {sending && (
            <span className="text-xs text-text-muted">Buscando tokens FCM y enviando...</span>
          )}
        </div>

        {result && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              result.ok && (result.sent ?? 0) > 0
                ? 'border-accent/20 bg-accent/8 text-accent'
                : 'border-danger/20 bg-danger/8 text-danger'
            }`}
          >
            {result.ok
              ? `Enviado a ${result.sent}/${result.targeted} dispositivos · ${result.failed} fallidos${(result.purged ?? 0) > 0 ? ` · ${result.purged} tokens vencidos eliminados` : ''}`
              : result.error}
            {result.errors && result.errors.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs opacity-80">
                {result.errors.map((e, i) => <li key={i}>· {e}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
