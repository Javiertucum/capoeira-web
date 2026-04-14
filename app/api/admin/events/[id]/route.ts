import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { FieldValue } from 'firebase-admin/firestore'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  const body = await request.json()

  try {
    await adminDb.collection('events').doc(id).update({
      ...body,
      updatedAt: FieldValue.serverTimestamp(),
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Events/PATCH] error:', error)
    return NextResponse.json({ error: 'Error al actualizar evento' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params

  try {
    await adminDb.collection('events').doc(id).delete()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Events/DELETE] error:', error)
    return NextResponse.json({ error: 'Error al eliminar evento' }, { status: 500 })
  }
}
