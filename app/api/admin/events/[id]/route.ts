import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { FieldValue } from 'firebase-admin/firestore'

type Params = { params: Promise<{ id: string }> }

function parseDate(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  const body = await request.json()

  const update = {
    title: typeof body.title === 'string' ? body.title : null,
    description: typeof body.description === 'string' ? body.description : null,
    category: typeof body.category === 'string' ? body.category : null,
    groupId: typeof body.groupId === 'string' ? body.groupId : null,
    startDate: parseDate(body.startDate),
    endDate: parseDate(body.endDate),
    updatedAt: FieldValue.serverTimestamp(),
  }

  try {
    await adminDb.collection('events').doc(id).update(update)
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
