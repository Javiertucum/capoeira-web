import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json()
  const { title } = body

  if (!title) {
    return NextResponse.json({ error: 'El título del evento es requerido' }, { status: 400 })
  }

  try {
    const docRef = await adminDb.collection('events').add({
      ...body,
      createdBy: authResult.uid,
      goingCount: 0,
      interestedCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    return NextResponse.json({ ok: true, id: docRef.id })
  } catch (error) {
    console.error('[API/Events/POST] error:', error)
    return NextResponse.json({ error: 'Error al crear el evento' }, { status: 500 })
  }
}
