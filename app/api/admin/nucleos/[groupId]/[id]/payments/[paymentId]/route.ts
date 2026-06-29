import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'

type Params = {
  params: Promise<{ groupId: string; id: string; paymentId: string }>
}

function parseNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId, id: nucleoId, paymentId } = await params
  const body = await request.json().catch(() => ({}))

  const status = body.status === 'paid' || body.status === 'pending' || body.status === 'free' ? body.status : 'pending'

  try {
    const ref = adminDb
      .collection('groups')
      .doc(groupId)
      .collection('nucleos')
      .doc(nucleoId)
      .collection('payments')
      .doc(paymentId)

    const existing = await ref.get()
    const existingData = existing.data()

    const update: Record<string, unknown> = {
      userId: typeof body.userId === 'string' ? body.userId : existingData?.userId ?? '',
      month: typeof body.month === 'string' ? body.month : existingData?.month ?? '',
      status,
      amount: parseNumber(body.amount),
      discountAmount: parseNumber(body.discountAmount),
      discountPercent: parseNumber(body.discountPercent),
      billingOptionId: typeof body.billingOptionId === 'string' && body.billingOptionId ? body.billingOptionId : null,
      billingOptionName:
        typeof body.billingOptionName === 'string' && body.billingOptionName ? body.billingOptionName : null,
      billingMode: typeof body.billingMode === 'string' && body.billingMode ? body.billingMode : null,
      turmaId: typeof body.turmaId === 'string' && body.turmaId ? body.turmaId : null,
      paidAt: status === 'paid' ? FieldValue.serverTimestamp() : null,
      notes: typeof body.notes === 'string' && body.notes ? body.notes : null,
      // El panel web es un override de admin: siempre confirma, sin replicar el
      // flujo reportedByStudent/studentReportedAmount de la app.
      confirmedByEducator: true,
      updatedAt: FieldValue.serverTimestamp(),
      deleted: false,
    }

    if (!existing.exists) {
      update.reportedByStudent = false
      update.createdAt = FieldValue.serverTimestamp()
    }

    await ref.set(update, { merge: true })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Nucleos/Payments/PATCH] error:', error)
    return NextResponse.json({ error: 'Error al guardar el pago' }, { status: 500 })
  }
}
