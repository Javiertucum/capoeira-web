import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { sendPushToUser } from '@/lib/notification-send'
import { FieldValue } from 'firebase-admin/firestore'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id: groupId } = await params
  const body = await request.json().catch(() => ({})) as { userId?: string }
  const userId = typeof body.userId === 'string' ? body.userId : ''
  if (!userId) return NextResponse.json({ error: 'userId requerido' }, { status: 400 })

  const [groupDoc, userDoc] = await Promise.all([
    adminDb.collection('groups').doc(groupId).get(),
    adminDb.collection('users').doc(userId).get(),
  ])
  if (!groupDoc.exists) return NextResponse.json({ error: 'Grupo no encontrado' }, { status: 404 })
  const groupName = (groupDoc.data()?.name as string | undefined) ?? groupId
  const previousGroupId = userDoc.data()?.groupId as string | undefined

  const update = { groupId, updatedAt: FieldValue.serverTimestamp() }
  const batch = adminDb.batch()
  batch.set(adminDb.collection('users').doc(userId), update, { merge: true })
  batch.set(adminDb.collection('usersPublic').doc(userId), update, { merge: true })

  if (previousGroupId !== groupId) {
    if (previousGroupId) {
      batch.set(
        adminDb.collection('groups').doc(previousGroupId),
        { memberCount: FieldValue.increment(-1), updatedAt: FieldValue.serverTimestamp() },
        { merge: true },
      )
    }
    batch.set(
      adminDb.collection('groups').doc(groupId),
      { memberCount: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    )
  }

  try {
    await batch.commit()
  } catch (error) {
    console.error('[API/Groups/Members/POST] error:', error)
    return NextResponse.json({ error: 'Error al agregar miembro' }, { status: 500 })
  }

  const notified = await sendPushToUser(
    userId,
    'Te uniste a un nuevo grupo',
    `Ahora formas parte de ${groupName}.`,
    { screen: 'profile' },
  ).catch(() => false)

  await writeAdminAuditLog({
    actorUid: authResult.uid,
    action: 'group.member.add',
    entity: { type: 'group', id: groupId, path: `groups/${groupId}` },
    summary: `Added user ${userId} to group "${groupName}"`,
    metadata: { userId, notified },
  })

  return NextResponse.json({ ok: true, notified })
}
