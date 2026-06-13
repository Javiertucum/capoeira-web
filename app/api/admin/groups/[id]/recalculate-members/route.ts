import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { FieldValue } from 'firebase-admin/firestore'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id: groupId } = await params

  const groupRef = adminDb.collection('groups').doc(groupId)
  const [groupDoc, membersSnap] = await Promise.all([
    groupRef.get(),
    adminDb.collection('usersPublic').where('groupId', '==', groupId).get(),
  ])
  if (!groupDoc.exists) return NextResponse.json({ error: 'Grupo no encontrado' }, { status: 404 })

  const previousCount = (groupDoc.data()?.memberCount as number | undefined) ?? 0
  const realCount = membersSnap.size

  await groupRef.set({ memberCount: realCount, updatedAt: FieldValue.serverTimestamp() }, { merge: true })

  await writeAdminAuditLog({
    actorUid: authResult.uid,
    action: 'group.members.recalculate',
    entity: { type: 'group', id: groupId, path: `groups/${groupId}` },
    summary: `Recalculated memberCount for group "${groupId}": ${previousCount} -> ${realCount}`,
    metadata: { previousCount, realCount },
  })

  return NextResponse.json({ ok: true, previousCount, memberCount: realCount })
}
