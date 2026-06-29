import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'

type Params = {
  params: Promise<{ groupId: string; id: string }>
}

function parseStringArray(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

export async function POST(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId, id: nucleoId } = await params
  const body = await request.json().catch(() => ({}))

  try {
    const ref = adminDb
      .collection('groups')
      .doc(groupId)
      .collection('nucleos')
      .doc(nucleoId)
      .collection('turmas')
      .doc()

    await ref.set({
      name: typeof body.name === 'string' ? body.name : '',
      scheduleKeys: parseStringArray(body.scheduleKeys),
      memberIds: parseStringArray(body.memberIds),
      guestMemberIds: [],
      billingOptionId: typeof body.billingOptionId === 'string' && body.billingOptionId ? body.billingOptionId : null,
      responsibleEducatorId:
        typeof body.responsibleEducatorId === 'string' && body.responsibleEducatorId
          ? body.responsibleEducatorId
          : null,
      assistantEducatorIds: parseStringArray(body.assistantEducatorIds),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ ok: true, id: ref.id })
  } catch (error) {
    console.error('[API/Nucleos/Turmas/POST] error:', error)
    return NextResponse.json({ error: 'Error al crear la turma' }, { status: 500 })
  }
}
