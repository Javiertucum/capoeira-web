'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type SendResult = {
  ok: boolean
  targeted?: number
  sent?: number
  failed?: number
  error?: string
}

type AudienceType = 'all' | 'roles' | 'countries' | 'plans'

export default function AdminNotificationSendForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audienceType, setAudienceType] = useState<AudienceType>('all')
  const [roles, setRoles] = useState<string[]>([])
  const [countries, setCountries] = useState('')
  const [plans, setPlans] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)

  function toggleItem<T extends string>(list: T[], item: T): T[] {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
  }

  async function handleSend() {
    if (!title.trim() || !body.trim()) return
    setSending(true)
    setResult(null)

    const segment: Record<string, unknown> = {}
    if (audienceType === 'roles' && roles.length > 0) segment.roles = roles
    if (audienceType === 'countries' && countries.trim()) {
      segment.countries = countries.split(',').map((c) => c.trim()).filter(Boolean)
    }
    if (audienceType === 'plans' && plans.length > 0) segment.subscriptionPlans = plans

    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), ...segment }),
      })
      const data = (await response.json()) as SendResult
      setResult(data)
      if (data.ok) {
        setTitle('')
        setBody('')
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
      <h3 className="mb-1 text-base font-semibold text-text">Enviar notificación push</h3>
      <p className="mb-6 text-sm text-text-muted">
        Se enviará inmediatamente a los dispositivos del segmento seleccionado.
      </p>

      <div className="flex flex-col gap-5">
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

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Audiencia
          </label>
          <div className="flex flex-wrap gap-2">
            {([
              { id: 'all', label: 'Todos' },
              { id: 'roles', label: 'Por rol' },
              { id: 'countries', label: 'Por país' },
              { id: 'plans', label: 'Por plan' },
            ] as { id: AudienceType; label: string }[]).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAudienceType(opt.id)}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                  audienceType === opt.id
                    ? 'border-accent/30 bg-accent/12 text-accent'
                    : 'border-border bg-surface text-text-secondary hover:text-text'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {audienceType === 'roles' && (
          <div>
            <p className="mb-2 text-xs text-text-muted">Selecciona uno o más roles:</p>
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
        )}

        {audienceType === 'countries' && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Códigos de país (separados por coma)
            </label>
            <input
              type="text"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              placeholder="ES, AR, BR, MX"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent/40"
            />
          </div>
        )}

        {audienceType === 'plans' && (
          <div>
            <p className="mb-2 text-xs text-text-muted">Selecciona uno o más planes:</p>
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
        )}

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
              result.ok
                ? 'border-accent/20 bg-accent/8 text-accent'
                : 'border-danger/20 bg-danger/8 text-danger'
            }`}
          >
            {result.ok
              ? `Enviado a ${result.sent}/${result.targeted} dispositivos · ${result.failed} fallidos`
              : result.error}
          </div>
        )}
      </div>
    </div>
  )
}
