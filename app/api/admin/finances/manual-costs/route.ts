import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { adminDb } from '@/lib/firebase-admin'

function currentPeriod() {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json().catch(() => ({}))
  const provider = typeof body.title === 'string' ? body.title.trim() : ''
  const amount = typeof body.amount === 'number' && Number.isFinite(body.amount) ? body.amount : null
  if (!provider || amount === null) {
    return NextResponse.json({ error: 'Proveedor y monto requeridos' }, { status: 400 })
  }

  const ref = adminDb.collection('adminFinanceManualCosts').doc()
  await ref.set({
    provider,
    amount,
    currency: 'USD',
    period: currentPeriod(),
    createdBy: authResult.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  await writeAdminAuditLog({
    actorUid: authResult.uid,
    action: 'finance.manual_cost.create',
    entity: { type: 'adminFinanceManualCost', id: ref.id, path: `adminFinanceManualCosts/${ref.id}` },
    summary: `Added manual finance cost ${provider}`,
    metadata: { amount, currency: 'USD' },
  })

  return NextResponse.json({ ok: true, id: ref.id })
}
