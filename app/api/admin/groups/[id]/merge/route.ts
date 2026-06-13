import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { copyNucleoToGroup, reassignGroupMembers, notifyGroupAdmins } from '@/lib/admin-group-merge'
import { FieldValue } from 'firebase-admin/firestore'

type Params = { params: Promise<{ id: string }> }

/**
 * Merges the group `id` (the duplicate) into `targetGroupId`: moves its nucleos
 * (with sessions/payments) and members, then deletes the duplicate group.
 */
export async function POST(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id: sourceGroupId } = await params
  const body = await request.json().catch(() => ({})) as { targetGroupId?: string }
  const targetGroupId = typeof body.targetGroupId === 'string' ? body.targetGroupId : ''
  if (!targetGroupId) return NextResponse.json({ error: 'targetGroupId requerido' }, { status: 400 })
  if (targetGroupId === sourceGroupId) return NextResponse.json({ error: 'Los grupos deben ser distintos' }, { status: 400 })

  const sourceRef = adminDb.collection('groups').doc(sourceGroupId)
  const targetRef = adminDb.collection('groups').doc(targetGroupId)
  const [sourceDoc, targetDoc] = await Promise.all([sourceRef.get(), targetRef.get()])
  if (!sourceDoc.exists) return NextResponse.json({ error: 'Grupo origen no encontrado' }, { status: 404 })
  if (!targetDoc.exists) return NextResponse.json({ error: 'Grupo destino no encontrado' }, { status: 404 })

  const sourceName = (sourceDoc.data()?.name as string | undefined) ?? sourceGroupId
  const targetName = (targetDoc.data()?.name as string | undefined) ?? targetGroupId

  try {
    const nucleosSnap = await sourceRef.collection('nucleos').get()
    const nucleoIdMap = new Map<string, string>()
    for (const nucleoDoc of nucleosSnap.docs) {
      const newId = await copyNucleoToGroup(nucleoDoc.ref, targetGroupId)
      nucleoIdMap.set(nucleoDoc.id, newId)
    }

    const movedMembers = await reassignGroupMembers(sourceGroupId, targetGroupId, nucleoIdMap)

    const memberCountSnap = await adminDb.collection('usersPublic').where('groupId', '==', targetGroupId).get()
    await targetRef.set({ memberCount: memberCountSnap.size, updatedAt: FieldValue.serverTimestamp() }, { merge: true })

    await adminDb.recursiveDelete(sourceRef)

    const notified = await notifyGroupAdmins(
      [sourceDoc.data() ?? {}, targetDoc.data() ?? {}],
      'Grupos combinados',
      `El grupo "${sourceName}" fue combinado con "${targetName}". Sus nucleos y miembros se movieron a "${targetName}".`,
      authResult.uid,
    )

    await writeAdminAuditLog({
      actorUid: authResult.uid,
      action: 'group.merge',
      entity: { type: 'group', id: targetGroupId, path: `groups/${targetGroupId}` },
      summary: `Merged group "${sourceName}" (${sourceGroupId}) into "${targetName}" (${targetGroupId})`,
      metadata: { sourceGroupId, targetGroupId, movedNucleos: nucleosSnap.size, movedMembers, notifiedAdmins: notified.length },
    })

    return NextResponse.json({ ok: true, movedNucleos: nucleosSnap.size, movedMembers, notifiedAdmins: notified.length })
  } catch (error) {
    console.error('[API/Groups/Merge/POST] error:', error)
    await writeAdminAuditLog({
      actorUid: authResult.uid,
      action: 'group.merge',
      status: 'error',
      entity: { type: 'group', id: sourceGroupId, path: `groups/${sourceGroupId}` },
      summary: `Failed to merge group "${sourceGroupId}" into "${targetGroupId}"`,
      errorMessage: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ error: 'Error al combinar grupos' }, { status: 500 })
  }
}
