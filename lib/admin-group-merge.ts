import 'server-only'

import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { sendPushToUser } from '@/lib/notification-send'

/** Subcollections that live under groups/{groupId}/nucleos/{nucleoId} and must travel with the nucleo. */
const NUCLEO_SUBCOLLECTIONS = ['sessions', 'payments']

/**
 * Copies every document of a nucleo (and its sessions/payments subcollections) into a new
 * nucleo document under a different group. Returns the new nucleo id.
 */
export async function copyNucleoToGroup(
  sourceNucleoRef: FirebaseFirestore.DocumentReference,
  targetGroupId: string,
): Promise<string> {
  const sourceSnap = await sourceNucleoRef.get()
  const targetRef = adminDb.collection('groups').doc(targetGroupId).collection('nucleos').doc()
  await targetRef.set({ ...sourceSnap.data(), groupId: targetGroupId })

  for (const sub of NUCLEO_SUBCOLLECTIONS) {
    const docsSnap = await sourceNucleoRef.collection(sub).get()
    if (docsSnap.empty) continue
    let batch = adminDb.batch()
    let count = 0
    for (const doc of docsSnap.docs) {
      batch.set(targetRef.collection(sub).doc(doc.id), doc.data())
      count += 1
      if (count >= 400) {
        await batch.commit()
        batch = adminDb.batch()
        count = 0
      }
    }
    if (count > 0) await batch.commit()
  }

  return targetRef.id
}

/**
 * Copies the sessions/payments subcollections of a source nucleo into an existing
 * target nucleo document, prefixing doc ids to avoid collisions when merging multiple sources.
 */
export async function mergeNucleoSubcollections(
  sourceNucleoRef: FirebaseFirestore.DocumentReference,
  targetNucleoRef: FirebaseFirestore.DocumentReference,
  idPrefix: string,
): Promise<void> {
  for (const sub of NUCLEO_SUBCOLLECTIONS) {
    const docsSnap = await sourceNucleoRef.collection(sub).get()
    if (docsSnap.empty) continue
    let batch = adminDb.batch()
    let count = 0
    for (const doc of docsSnap.docs) {
      batch.set(targetNucleoRef.collection(sub).doc(`${idPrefix}_${doc.id}`), doc.data())
      count += 1
      if (count >= 400) {
        await batch.commit()
        batch = adminDb.batch()
        count = 0
      }
    }
    if (count > 0) await batch.commit()
  }
}

/**
 * Reassigns every member (users + usersPublic) of `sourceGroupId` to `targetGroupId`.
 * If `nucleoIdMap` is provided, any nucleoIds entries matching old nucleo ids are remapped
 * to their new ids in the target group.
 */
export async function reassignGroupMembers(
  sourceGroupId: string,
  targetGroupId: string,
  nucleoIdMap?: Map<string, string>,
  ensureNucleoId?: string,
): Promise<number> {
  const snap = await adminDb.collection('usersPublic').where('groupId', '==', sourceGroupId).get()

  let batch = adminDb.batch()
  let count = 0
  for (const doc of snap.docs) {
    const data = doc.data()
    const nucleoIds: string[] = Array.isArray(data.nucleoIds) ? data.nucleoIds : []
    let remappedNucleoIds = nucleoIdMap
      ? nucleoIds.map((id) => nucleoIdMap.get(id) ?? id)
      : nucleoIds
    if (ensureNucleoId && !remappedNucleoIds.includes(ensureNucleoId)) {
      remappedNucleoIds = [...remappedNucleoIds, ensureNucleoId]
    }

    const update = {
      groupId: targetGroupId,
      nucleoIds: remappedNucleoIds,
      updatedAt: FieldValue.serverTimestamp(),
    }
    batch.set(adminDb.collection('usersPublic').doc(doc.id), update, { merge: true })
    batch.set(adminDb.collection('users').doc(doc.id), update, { merge: true })
    count += 1
    if (count >= 200) {
      await batch.commit()
      batch = adminDb.batch()
      count = 0
    }
  }
  if (count > 0) await batch.commit()

  return snap.size
}

/** Sends a push notification to every admin/co-admin of the given groups, deduped, skipping `excludeUid`. */
export async function notifyGroupAdmins(
  groups: Array<{ adminUserIds?: string[]; coAdminIds?: string[] }>,
  title: string,
  body: string,
  excludeUid?: string,
): Promise<string[]> {
  const uids = new Set<string>()
  for (const group of groups) {
    for (const uid of group.adminUserIds ?? []) uids.add(uid)
    for (const uid of group.coAdminIds ?? []) uids.add(uid)
  }
  if (excludeUid) uids.delete(excludeUid)

  const notified: string[] = []
  for (const uid of uids) {
    const ok = await sendPushToUser(uid, title, body, { screen: 'admin' }).catch(() => false)
    if (ok) notified.push(uid)
  }
  return notified
}
