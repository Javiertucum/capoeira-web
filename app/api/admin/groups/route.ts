import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json()
  const { name } = body

  if (!name) {
    return NextResponse.json({ error: 'El nombre del grupo es requerido' }, { status: 400 })
  }

  try {
    const docRef = await adminDb.collection('groups').add({
      ...body,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    return NextResponse.json({ ok: true, id: docRef.id })
  } catch (error) {
    console.error('[API/Groups/POST] error:', error)
    return NextResponse.json({ error: 'Error al crear el grupo' }, { status: 500 })
  }
}
