import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'

type Params = {
  params: Promise<{ groupId: string; id: string; turmaId: string }>
}

function parseStringArray(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId, id: nucleoId, turmaId } = await params
  const body = await request.json().catch(() => ({}))

  try {
    const ref = adminDb
      .collection('groups')
      .doc(groupId)
      .collection('nucleos')
      .doc(nucleoId)
      .collection('turmas')
      .doc(turmaId)

    // guestMemberIds[] es escrito unicamente por la app movil (alumnos sin cuenta) —
    // el panel web nunca lo edita, asi que nunca se incluye en este update.
    await ref.update({
      name: typeof body.name === 'string' ? body.name : '',
      scheduleKeys: parseStringArray(body.scheduleKeys),
      memberIds: parseStringArray(body.memberIds),
      billingOptionId: typeof body.billingOptionId === 'string' && body.billingOptionId ? body.billingOptionId : null,
      responsibleEducatorId:
        typeof body.responsibleEducatorId === 'string' && body.responsibleEducatorId
          ? body.responsibleEducatorId
          : null,
      assistantEducatorIds: parseStringArray(body.assistantEducatorIds),
      updatedAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Nucleos/Turmas/PATCH] error:', error)
    return NextResponse.json({ error: 'Error al actualizar la turma' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId, id: nucleoId, turmaId } = await params

  try {
    await adminDb
      .collection('groups')
      .doc(groupId)
      .collection('nucleos')
      .doc(nucleoId)
      .collection('turmas')
      .doc(turmaId)
      .delete()

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Nucleos/Turmas/DELETE] error:', error)
    return NextResponse.json({ error: 'Error al eliminar la turma' }, { status: 500 })
  }
}
