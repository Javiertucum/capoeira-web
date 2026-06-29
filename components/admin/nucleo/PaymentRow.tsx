'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminNucleoMember, AdminPayment } from '@/lib/admin-queries'
import { inputClass } from '@/components/admin/adminFormStyles'

interface Props {
  groupId: string
  nucleoId: string
  month: string
  member: AdminNucleoMember
  payment?: AdminPayment
}

type DiscountMode = 'amount' | 'percent'

export default function PaymentRow({ groupId, nucleoId, month, member, payment }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<AdminPayment['status']>(payment?.status ?? 'pending')
  const [amount, setAmount] = useState(payment?.amount != null ? String(payment.amount) : '')
  const [discountMode, setDiscountMode] = useState<DiscountMode>(
    payment?.discountPercent != null && payment.discountPercent > 0 ? 'percent' : 'amount'
  )
  const [discountAmount, setDiscountAmount] = useState(
    payment?.discountAmount != null ? String(payment.discountAmount) : ''
  )
  const [discountPercent, setDiscountPercent] = useState(
    payment?.discountPercent != null ? String(payment.discountPercent) : ''
  )
  const [notes, setNotes] = useState(payment?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const paymentId = payment?.id ?? `${member.uid}_${month}`
  const fullName = `${member.name} ${member.surname}`.trim() || member.uid

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/nucleos/${groupId}/${nucleoId}/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: member.uid,
          month,
          status,
          amount: amount === '' ? null : Number(amount),
          discountAmount: discountMode === 'amount' && discountAmount !== '' ? Number(discountAmount) : null,
          discountPercent: discountMode === 'percent' && discountPercent !== '' ? Number(discountPercent) : null,
          notes: notes || null,
        }),
      })
      if (!res.ok) throw new Error('Error al guardar el pago')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-surface/75 p-4 md:grid-cols-[1.2fr_repeat(4,1fr)_auto]">
      <div className="min-w-0">
        <p className="truncate font-semibold text-text">{fullName}</p>
        {payment?.reportedByStudent && payment.studentReportedAmount != null ? (
          <p className="mt-1 text-[11px] text-text-muted">
            Alumno reportó: ${payment.studentReportedAmount}
          </p>
        ) : null}
        {error ? <p className="mt-1 text-[11px] text-danger">{error}</p> : null}
      </div>

      <div className="flex gap-1">
        {(['pending', 'paid', 'free'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setStatus(option)}
            className={`flex-1 rounded-xl border px-2 py-2 text-[11px] font-semibold transition-colors ${
              status === option
                ? 'border-accent bg-accent/14 text-accent'
                : 'border-border bg-surface text-text-secondary hover:text-text'
            }`}
          >
            {option === 'pending' ? 'Pendiente' : option === 'paid' ? 'Pagado' : 'Gratis'}
          </button>
        ))}
      </div>

      <input
        className={inputClass}
        inputMode="decimal"
        placeholder="Monto"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />

      <div className="flex gap-2">
        <select
          className={`${inputClass} max-w-[90px]`}
          value={discountMode}
          onChange={(event) => setDiscountMode(event.target.value as DiscountMode)}
        >
          <option value="amount">$</option>
          <option value="percent">%</option>
        </select>
        <input
          className={inputClass}
          inputMode="decimal"
          placeholder="Descuento"
          value={discountMode === 'amount' ? discountAmount : discountPercent}
          onChange={(event) =>
            discountMode === 'amount'
              ? setDiscountAmount(event.target.value)
              : setDiscountPercent(event.target.value)
          }
        />
      </div>

      <input
        className={inputClass}
        placeholder="Notas"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-[#081019] transition-opacity hover:opacity-92 disabled:opacity-50"
      >
        {saving ? '...' : 'Guardar'}
      </button>
    </div>
  )
}
