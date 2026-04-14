import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { FieldValue } from 'firebase-admin/firestore'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  const { status, adminNote } = await request.json()

  const validStatuses = ['open', 'reviewing', 'closed']
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() }
  if (status)    update.status    = status
  if (adminNote !== undefined) update.adminNote = adminNote

  try {
    await adminDb.collection('bugReports').doc(id).update(update)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/BugReports/PATCH] error:', error)
    return NextResponse.json({ error: 'Error al actualizar reporte' }, { status: 500 })
  }
}
