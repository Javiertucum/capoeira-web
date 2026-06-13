import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { mergeNucleoSubcollections, reassignGroupMembers, notifyGroupAdmins } from '@/lib/admin-group-merge'
import { FieldValue } from 'firebase-admin/firestore'

type Params = { params: Promise<{ id: string }> }

/**
 * Converts the group `id` (a duplicate) into a nucleo of `targetGroupId`: creates a new
 * nucleo in the target group from the source group's info, moves its existing nucleos'
 * sessions/payments into that nucleo, reassigns members, then deletes the source group.
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

  const sourceData = sourceDoc.data() ?? {}
  const sourceName = (sourceData.name as string | undefined) ?? sourceGroupId
  const targetName = (targetDoc.data()?.name as string | undefined) ?? targetGroupId

  try {
    const newNucleoRef = targetRef.collection('nucleos').doc()
    await newNucleoRef.set({
      groupId: targetGroupId,
      name: sourceName,
      country: (sourceData.representedCountries as string[] | undefined)?.[0] ?? null,
      city: (sourceData.representedCities as string[] | undefined)?.[0] ?? null,
      coEducatorIds: [],
    })

    const sourceNucleosSnap = await sourceRef.collection('nucleos').get()
    const nucleoIdMap = new Map<string, string>()
    for (const nucleoDoc of sourceNucleosSnap.docs) {
      await mergeNucleoSubcollections(nucleoDoc.ref, newNucleoRef, nucleoDoc.id)
      nucleoIdMap.set(nucleoDoc.id, newNucleoRef.id)
    }

    const movedMembers = await reassignGroupMembers(sourceGroupId, targetGroupId, nucleoIdMap, newNucleoRef.id)

    const memberCountSnap = await adminDb.collection('usersPublic').where('groupId', '==', targetGroupId).get()
    await targetRef.set({ memberCount: memberCountSnap.size, updatedAt: FieldValue.serverTimestamp() }, { merge: true })

    await adminDb.recursiveDelete(sourceRef)

    const notified = await notifyGroupAdmins(
      [sourceData, targetDoc.data() ?? {}],
      'Grupo convertido en nucleo',
      `El grupo "${sourceName}" fue convertido en un nucleo de "${targetName}".`,
      authResult.uid,
    )

    await writeAdminAuditLog({
      actorUid: authResult.uid,
      action: 'group.convertToNucleo',
      entity: { type: 'group', id: targetGroupId, path: `groups/${targetGroupId}/nucleos/${newNucleoRef.id}` },
      summary: `Converted group "${sourceName}" (${sourceGroupId}) into nucleo "${newNucleoRef.id}" of "${targetName}" (${targetGroupId})`,
      metadata: { sourceGroupId, targetGroupId, newNucleoId: newNucleoRef.id, movedMembers, notifiedAdmins: notified.length },
    })

    return NextResponse.json({ ok: true, nucleoId: newNucleoRef.id, movedMembers, notifiedAdmins: notified.length })
  } catch (error) {
    console.error('[API/Groups/ConvertToNucleo/POST] error:', error)
    await writeAdminAuditLog({
      actorUid: authResult.uid,
      action: 'group.convertToNucleo',
      status: 'error',
      entity: { type: 'group', id: sourceGroupId, path: `groups/${sourceGroupId}` },
      summary: `Failed to convert group "${sourceGroupId}" into a nucleo of "${targetGroupId}"`,
      errorMessage: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ error: 'Error al convertir el grupo en nucleo' }, { status: 500 })
  }
}
