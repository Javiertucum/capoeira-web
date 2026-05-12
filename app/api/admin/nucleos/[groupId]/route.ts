import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { FieldValue } from 'firebase-admin/firestore'

type Params = { params: Promise<{ groupId: string }> }

export async function POST(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId } = await params
  const body = await request.json()
  const { name } = body

  if (!name) {
    return NextResponse.json({ error: 'El nombre del núcleo es requerido' }, { status: 400 })
  }

  try {
    const docRef = await adminDb
      .collection('groups')
      .doc(groupId)
      .collection('nucleos')
      .add({
        ...body,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })
    return NextResponse.json({ ok: true, id: docRef.id })
  } catch (error) {
    console.error('[API/Nucleos/POST] error:', error)
    return NextResponse.json({ error: 'Error al crear el núcleo' }, { status: 500 })
  }
}
