'use client'

import { useMemo, useState } from 'react'
import type { AdminNucleoMember, AdminPayment } from '@/lib/admin-queries'
import { sectionClass } from '@/components/admin/adminFormStyles'
import PaymentRow from './PaymentRow'

interface Props {
  groupId: string
  nucleoId: string
  payments: AdminPayment[]
  members: AdminNucleoMember[]
  initialMonths: string[]
}

function monthLabel(month: string) {
  const [year, monthNum] = month.split('-')
  const date = new Date(Number(year), Number(monthNum) - 1, 1)
  return date.toLocaleDateString('es', { month: 'long', year: 'numeric' })
}

function shiftMonth(month: string, delta: number): string {
  const [year, monthNum] = month.split('-').map(Number)
  const date = new Date(year, monthNum - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export default function PaymentsSection({ groupId, nucleoId, payments, members, initialMonths }: Props) {
  const [allPayments, setAllPayments] = useState<AdminPayment[]>(payments)
  const [availableMonths, setAvailableMonths] = useState<string[]>(initialMonths)
  const [selectedMonth, setSelectedMonth] = useState(initialMonths[0] ?? '')
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const paymentByUser = useMemo(() => {
    const map = new Map<string, AdminPayment>()
    allPayments.filter((p) => p.month === selectedMonth).forEach((p) => map.set(p.userId, p))
    return map
  }, [allPayments, selectedMonth])

  async function loadOlderMonth() {
    const oldest = availableMonths[availableMonths.length - 1]
    if (!oldest) return
    const olderMonth = shiftMonth(oldest, -1)

    setLoadingOlder(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/nucleos/${groupId}/${nucleoId}/payments?months=${olderMonth}`
      )
      if (!res.ok) throw new Error('Error al cargar el mes anterior')
      const data = await res.json()
      setAllPayments((current) => [...current, ...(data.payments ?? [])])
      setAvailableMonths((current) => [...current, olderMonth])
      setSelectedMonth(olderMonth)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoadingOlder(false)
    }
  }

  return (
    <section className={sectionClass}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text">Pagos</h3>
          <p className="mt-1 text-sm text-text-muted">
            Registro de pagos por alumno. El panel actua como override de admin: cualquier
            guardado queda confirmado.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableMonths.map((month) => (
            <button
              key={month}
              type="button"
              onClick={() => setSelectedMonth(month)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                selectedMonth === month
                  ? 'border-accent bg-accent/14 text-accent'
                  : 'border-border bg-surface text-text-secondary hover:text-text'
              }`}
            >
              {monthLabel(month)}
            </button>
          ))}
          <button
            type="button"
            onClick={loadOlderMonth}
            disabled={loadingOlder}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:text-text disabled:opacity-50"
          >
            {loadingOlder ? 'Cargando...' : 'Cargar mes anterior'}
          </button>
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      <div className="mt-5 space-y-3">
        {members.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/55 px-4 py-6 text-sm text-text-muted">
            Este nucleo no tiene miembros con cuenta todavia.
          </div>
        ) : (
          members.map((member) => (
            <PaymentRow
              key={`${member.uid}-${selectedMonth}`}
              groupId={groupId}
              nucleoId={nucleoId}
              month={selectedMonth}
              member={member}
              payment={paymentByUser.get(member.uid)}
            />
          ))
        )}
      </div>
    </section>
  )
}
