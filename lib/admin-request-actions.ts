import 'server-only'

import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import type { AdminRequestType } from '@/lib/admin-queries'

export type AdminRequestDecision = 'approve' | 'reject'

function ensurePendingStatus(
  data: FirebaseFirestore.DocumentData | undefined,
  requestType: AdminRequestType,
  requestId: string
) {
  if (!data) {
    throw new Error(`Request ${requestType}/${requestId} not found`)
  }

  if (data.status !== 'pending') {
    throw new Error(`Request ${requestType}/${requestId} is no longer pending`)
  }
}

async function respondToGroupJoinRequest(
  requestId: string,
  decision: AdminRequestDecision
) {
  const ref = adminDb.collection('group_requests').doc(requestId)
  const snap = await ref.get()
  const data = snap.data()
  ensurePendingStatus(data, 'group_requests', requestId)

  await ref.update({
    status: decision === 'approve' ? 'accepted' : 'rejected',
    updatedAt: FieldValue.serverTimestamp(),
  })
}

async function respondToNucleoRequest(
  requestId: string,
  decision: AdminRequestDecision
) {
  const ref = adminDb.collection('nucleo_requests').doc(requestId)
  const snap = await ref.get()
  const data = snap.data()
  ensurePendingStatus(data, 'nucleo_requests', requestId)

  await ref.update({
    status: decision === 'approve' ? 'accepted' : 'rejected',
    updatedAt: FieldValue.serverTimestamp(),
  })
}

async function respondToEducatorRequest(
  requestId: string,
  decision: AdminRequestDecision
) {
  const ref = adminDb.collection('educatorRequests').doc(requestId)
  const snap = await ref.get()
  const data = snap.data()
  ensurePendingStatus(data, 'educatorRequests', requestId)

  if (decision === 'reject') {
    await ref.update({
      status: 'declined',
      updatedAt: FieldValue.serverTimestamp(),
    })
    return
  }

  const fromUserId = `${data?.fromUserId ?? ''}`.trim()
  const toUserId = `${data?.toUserId ?? ''}`.trim()
  if (!fromUserId || !toUserId) {
    throw new Error('Educator request is missing user references')
  }

  const batch = adminDb.batch()
  const timestamp = FieldValue.serverTimestamp()

  batch.update(ref, {
    status: 'accepted',
    updatedAt: timestamp,
  })

  batch.set(
    adminDb.collection('users').doc(fromUserId),
    {
      supervisorIds: [toUserId],
      updatedAt: timestamp,
    },
    { merge: true }
  )

  batch.set(
    adminDb.collection('usersPublic').doc(fromUserId),
    {
      supervisorIds: [toUserId],
      updatedAt: timestamp,
    },
    { merge: true }
  )

  const otherPending = await adminDb
    .collection('educatorRequests')
    .where('fromUserId', '==', fromUserId)
    .where('status', '==', 'pending')
    .get()

  otherPending.docs.forEach((doc) => {
    if (doc.id !== requestId) {
      batch.update(doc.ref, {
        status: 'declined',
        updatedAt: timestamp,
      })
    }
  })

  await batch.commit()
}

async function respondToNucleoTransitionRequest(
  requestId: string,
  decision: AdminRequestDecision
) {
  const ref = adminDb.collection('nucleo_transition_requests').doc(requestId)
  const snap = await ref.get()
  const data = snap.data()
  ensurePendingStatus(data, 'nucleo_transition_requests', requestId)

  if (decision === 'reject') {
    await ref.delete()
    return
  }

  const uid = `${data?.userId ?? ''}`.trim()
  const newGroupId = `${data?.newGroupId ?? ''}`.trim()
  const newNucleoId = `${data?.newNucleoId ?? ''}`.trim()
  if (!uid || !newGroupId || !newNucleoId) {
    throw new Error('Transition request is incomplete')
  }

  const userRef = adminDb.collection('users').doc(uid)
  const userPublicRef = adminDb.collection('usersPublic').doc(uid)
  const [userSnap] = await Promise.all([userRef.get(), userPublicRef.get()])
  if (!userSnap.exists) {
    throw new Error(`User ${uid} not found`)
  }

  const userData = userSnap.data() as Record<string, unknown>
  const previousGroupId = typeof userData.groupId === 'string' ? userData.groupId : null
  const currentNucleoIds = Array.isArray(userData.nucleoIds)
    ? userData.nucleoIds.filter((value): value is string => typeof value === 'string')
    : []
  const joiningNewGroup = previousGroupId !== newGroupId
  const nextNucleoIds = joiningNewGroup
    ? [newNucleoId]
    : Array.from(new Set([...currentNucleoIds, newNucleoId]))

  const batch = adminDb.batch()
  const timestamp = FieldValue.serverTimestamp()

  batch.set(
    userRef,
    {
      groupId: newGroupId,
      nucleoIds: nextNucleoIds,
      updatedAt: timestamp,
    },
    { merge: true }
  )

  batch.set(
    userPublicRef,
    {
      groupId: newGroupId,
      nucleoIds: nextNucleoIds,
      updatedAt: timestamp,
    },
    { merge: true }
  )

  if (joiningNewGroup) {
    if (previousGroupId) {
      batch.set(
        adminDb.collection('groups').doc(previousGroupId),
        {
          memberCount: FieldValue.increment(-1),
          updatedAt: timestamp,
        },
        { merge: true }
      )
    }

    batch.set(
      adminDb.collection('groups').doc(newGroupId),
      {
        memberCount: FieldValue.increment(1),
        updatedAt: timestamp,
      },
      { merge: true }
    )
  }

  batch.delete(ref)

  const relatedPending = await adminDb
    .collection('nucleo_transition_requests')
    .where('userId', '==', uid)
    .where('newGroupId', '==', newGroupId)
    .where('status', '==', 'pending')
    .get()

  relatedPending.docs.forEach((doc) => {
    if (doc.id !== requestId) {
      batch.delete(doc.ref)
    }
  })

  await batch.commit()
}

export async function applyAdminRequestDecision(
  requestType: AdminRequestType,
  requestId: string,
  decision: AdminRequestDecision
) {
  switch (requestType) {
    case 'group_requests':
      await respondToGroupJoinRequest(requestId, decision)
      return
    case 'nucleo_requests':
      await respondToNucleoRequest(requestId, decision)
      return
    case 'educatorRequests':
      await respondToEducatorRequest(requestId, decision)
      return
    case 'nucleo_transition_requests':
      await respondToNucleoTransitionRequest(requestId, decision)
      return
    default:
      throw new Error(`Unsupported request type: ${requestType}`)
  }
}
