import 'server-only'

import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import type { AdminModerationEntityType, AdminModerationState } from '@/lib/admin-queries'

export type AdminModerationDecision = 'hide' | 'suspend' | 'restore'

function nextStateForDecision(
  entityType: AdminModerationEntityType,
  decision: AdminModerationDecision
): AdminModerationState {
  if (decision === 'restore') return 'visible'
  if (decision === 'suspend' && entityType === 'user') return 'suspended'
  return 'hidden'
}

export async function applyAdminModerationDecision(params: {
  actorUid: string
  entityType: AdminModerationEntityType
  entityId: string
  decision: AdminModerationDecision
  groupId?: string
  reason?: string
  note?: string
}) {
  const { actorUid, entityType, entityId, decision, groupId, reason, note } = params
  const state = nextStateForDecision(entityType, decision)
  const moderation = {
    state,
    reason: reason?.trim() || null,
    note: note?.trim() || null,
    updatedBy: actorUid,
    updatedAt: FieldValue.serverTimestamp(),
  }

  const batch = adminDb.batch()

  if (entityType === 'user') {
    batch.set(adminDb.collection('users').doc(entityId), { moderation, updatedAt: FieldValue.serverTimestamp() }, { merge: true })
    batch.set(adminDb.collection('usersPublic').doc(entityId), { moderation, updatedAt: FieldValue.serverTimestamp() }, { merge: true })
  } else if (entityType === 'group') {
    batch.set(adminDb.collection('groups').doc(entityId), { moderation, updatedAt: FieldValue.serverTimestamp() }, { merge: true })
  } else if (entityType === 'event') {
    batch.set(adminDb.collection('events').doc(entityId), { moderation, updatedAt: FieldValue.serverTimestamp() }, { merge: true })
  } else if (entityType === 'nucleo') {
    if (!groupId) {
      throw new Error('groupId is required to moderate a nucleo')
    }
    batch.set(
      adminDb.collection('groups').doc(groupId).collection('nucleos').doc(entityId),
      { moderation, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    )
  } else {
    throw new Error(`Unsupported moderation entity type: ${entityType}`)
  }

  await batch.commit()

  await adminDb.collection('adminModerationCases').add({
    entityType,
    entityId,
    groupId: groupId ?? null,
    decision,
    state,
    reason: moderation.reason,
    note: moderation.note,
    actorUid,
    status: 'closed',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  return { state }
}
