import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'

type Params = {
  params: Promise<{ groupId: string; id: string; participantId: string }>
}

function parseNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export async function PUT(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId, id: nucleoId, participantId } = await params
  const body = await request.json().catch(() => ({}))

  const discountPercent = parseNumber(body.discountPercent) ?? 0
  if (discountPercent < 0 || discountPercent > 100) {
    return NextResponse.json({ error: 'El descuento debe estar entre 0 y 100' }, { status: 400 })
  }

  try {
    const ref = adminDb
      .collection('groups')
      .doc(groupId)
      .collection('nucleos')
      .doc(nucleoId)
      .collection('scholarships')
      .doc(participantId)

    const existing = await ref.get()
    const existingData = existing.data()

    await ref.set(
      {
        isGuest: typeof body.isGuest === 'boolean' ? body.isGuest : false,
        discountPercent,
        permanent: typeof body.permanent === 'boolean' ? body.permanent : false,
        startMonth: typeof body.startMonth === 'string' && body.startMonth ? body.startMonth : null,
        endMonth: typeof body.endMonth === 'string' && body.endMonth ? body.endMonth : null,
        note: typeof body.note === 'string' && body.note ? body.note : null,
        createdBy: existing.exists ? existingData?.createdBy ?? authResult.uid : authResult.uid,
        createdAt: existing.exists ? existingData?.createdAt ?? FieldValue.serverTimestamp() : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: false }
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Nucleos/Scholarships/PUT] error:', error)
    return NextResponse.json({ error: 'Error al guardar la beca' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId, id: nucleoId, participantId } = await params

  try {
    await adminDb
      .collection('groups')
      .doc(groupId)
      .collection('nucleos')
      .doc(nucleoId)
      .collection('scholarships')
      .doc(participantId)
      .delete()

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Nucleos/Scholarships/DELETE] error:', error)
    return NextResponse.json({ error: 'Error al eliminar la beca' }, { status: 500 })
  }
}
