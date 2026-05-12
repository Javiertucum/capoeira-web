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
  status?: string
}

type Group = { id: string; name: string }
type Nucleo = { id: string; name: string; groupId: string }
type UserResult = { uid: string; displayName: string; email: string; photoURL: string | null }

type ContentItem = { id: string; title: string; subtitle: string | null }

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
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const [selectedNucleoIds, setSelectedNucleoIds] = useState<string[]>([])
  const [noGroup, setNoGroup] = useState(false)
  const [adminsOnly, setAdminsOnly] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<UserResult[]>([])

  // Scheduling
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledAt, setScheduledAt] = useState('')

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
    adminsOnly,
    userIds: selectedUsers.map((u) => u.uid),
  }), [roles, countries, plans, selectedGroupIds, selectedNucleoIds, noGroup, adminsOnly, selectedUsers])

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
    if (isScheduled && !scheduledAt) {
      alert('Por favor selecciona una fecha de programación.')
      return
    }
    if (adminsOnly && selectedGroupIds.length === 0 && selectedNucleoIds.length === 0) {
      alert('Selecciona al menos un grupo o un núcleo para enviar solo a sus admins/responsables.')
      return
    }

    setSending(true)
    setResult(null)

    const segment = buildSegment()
    const payload: Record<string, unknown> = {
      title: title.trim(),
      body: body.trim(),
      ...segment,
    }

    if (isScheduled) {
      payload.scheduledAt = new Date(scheduledAt).toISOString()
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
      const data = await response.json().catch(() => null) as SendResult | null
      if (!response.ok) {
        setResult({
          ok: false,
          error: data?.error ?? `Error ${response.status} al procesar la notificación`,
          errors: data?.errors,
        })
        return
      }
      if (!data) {
        setResult({ ok: false, error: 'La API respondió sin JSON válido' })
        return
      }
      setResult(data)
      if (data.ok) {
        if (!isScheduled) {
          setTitle('')
          setBody('')
        }
        setScreen('')
        setContentItem(null)
        router.refresh()
      }
    } catch {
      setResult({ ok: false, error: 'Error de red al enviar' })
    } finally {
      setSending(false)
    }
  }

  const canSend = title.trim() && body.trim() && !sending

  return (
    <div className="rounded-[22px] border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-text">Crear notificación push</h3>
          <p className="text-sm text-text-muted">
            Configura el mensaje, segmento y momento de envío.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-surface p-1 border border-border">
          <button 
            onClick={() => setIsScheduled(false)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${!isScheduled ? 'bg-accent text-[#081019] shadow-sm' : 'text-text-muted hover:text-text'}`}
          >
            Inmediato
          </button>
          <button 
            onClick={() => setIsScheduled(true)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${isScheduled ? 'bg-accent text-[#081019] shadow-sm' : 'text-text-muted hover:text-text'}`}
          >
            Programado
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="md:col-span-2">
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
          <div className="md:col-span-2">
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

          {/* Scheduling Date */}
          {isScheduled && (
            <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                Fecha y hora de envío
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent/40"
              />
              <p className="mt-2 text-[10px] text-warning font-medium">
                * Nota: Requiere un proceso de cron configurado para procesar envíos futuros.
              </p>
            </div>
          )}
        </div>

        <div className="h-px bg-border my-2" />

        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Segmentación de audiencia</h4>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={adminsOnly} 
              onChange={e => setAdminsOnly(e.target.checked)}
              className="w-4 h-4 rounded border-border text-accent focus:ring-accent bg-surface"
            />
            <span className="text-xs font-bold text-text-secondary group-hover:text-text transition-colors">Sólo Admins/Educadores Responsables</span>
          </label>
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
            Países (códigos ISO)
          </label>
          <input
            type="text"
            value={countries}
            onChange={(e) => setCountries(e.target.value)}
            placeholder="ES, AR, BR, MX"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent/40"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Plan de suscripción
          </label>
          <div className="flex flex-wrap gap-2">
            {([
              { value: 'free', label: 'Free' },
              { value: 'premium', label: 'Premium' },
            ] as const).map((plan) => (
              <button
                key={plan.value}
                type="button"
                onClick={() => setPlans(toggleItem(plans, plan.value))}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                  plans.includes(plan.value)
                    ? 'border-accent/30 bg-accent/12 text-accent'
                    : 'border-border bg-surface text-text-secondary'
                }`}
              >
                {plan.label}
              </button>
            ))}
          </div>
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
              Núcleos específicos
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
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
                  {nucleo.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Individual users */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Usuarios específicos
          </label>
          <UserSearchCombobox
            selected={selectedUsers}
            onAdd={(user) => setSelectedUsers((prev) => [...prev, user])}
            onRemove={(uid) => setSelectedUsers((prev) => prev.filter((u) => u.uid !== uid))}
          />
        </div>

        {/* Estimate */}
        {estimate !== null && !isScheduled && (
          <p className="text-xs text-text-muted bg-surface/50 p-3 rounded-xl border border-border">
            Audiencia estimada:{' '}
            <span className="font-semibold text-text">~{estimate} dispositivos activos</span>
          </p>
        )}

        {adminsOnly && selectedGroupIds.length === 0 && selectedNucleoIds.length === 0 && (
          <p className="rounded-xl border border-warning/20 bg-warning/10 p-3 text-xs text-warning">
            El modo de admins requiere seleccionar al menos un grupo o núcleo.
          </p>
        )}

        {/* Deep link */}
        <div className="h-px bg-border my-2" />
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Pantalla de destino (Deep Link)
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
        <div className="flex items-center gap-4 pt-4">
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-[#081019] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100 shadow-lg shadow-accent/20"
          >
            {sending ? 'Procesando...' : isScheduled ? 'Programar Envío' : 'Enviar Ahora'}
          </button>
          {sending && (
            <span className="text-xs text-text-muted animate-pulse">
              {isScheduled ? 'Guardando programación...' : 'Buscando tokens FCM y enviando...'}
            </span>
          )}
        </div>

        {result && (
          <div
            className={`rounded-xl border px-6 py-4 text-sm font-medium shadow-sm animate-in zoom-in-95 duration-200 ${
              result.ok
                ? 'border-accent/20 bg-accent/8 text-accent'
                : 'border-danger/20 bg-danger/8 text-danger'
            }`}
          >
            <div className="flex items-center gap-2">
              {result.ok ? (
                <>
                  <span className="text-lg">✓</span>
                  <span>
                    {result.status === 'scheduled' 
                      ? 'Notificación programada correctamente.' 
                      : `Enviado a ${result.sent}/${result.targeted} dispositivos.`}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-lg">✕</span>
                  <span>{result.error}</span>
                </>
              )}
            </div>
            
            {result.ok && !isScheduled && (result.failed ?? 0) > 0 && (
              <p className="mt-1 text-xs opacity-80 pl-6">
                {result.failed} fallidos{(result.purged ?? 0) > 0 ? ` · ${result.purged} tokens vencidos eliminados` : ''}
              </p>
            )}

            {result.errors && result.errors.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs opacity-80 pl-6 list-disc">
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
