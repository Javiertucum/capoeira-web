import 'server-only'
import { adminDb } from './firebase-admin'
import { type RawUserDoc, type SegmentFilter, type TokenEntry, filterUserDocs } from './notification-audience-filter'

async function resolveAdminAudienceUids(segment: SegmentFilter): Promise<string[]> {
  const adminUids = new Set<string>()

  if (segment.groupIds && segment.groupIds.length > 0) {
    const groupDocs = await Promise.all(
      segment.groupIds.map((groupId) => adminDb.collection('groups').doc(groupId).get().catch(() => null))
    )

    for (const groupDoc of groupDocs) {
      const data = groupDoc?.data()
      const admins = Array.isArray(data?.adminUserIds) ? data.adminUserIds : []
      const coAdmins = Array.isArray(data?.coAdminIds) ? data.coAdminIds : []
      admins.forEach((uid) => {
        if (typeof uid === 'string') adminUids.add(uid)
      })
      coAdmins.forEach((uid) => {
        if (typeof uid === 'string') adminUids.add(uid)
      })
    }
  }

  if (segment.nucleoIds && segment.nucleoIds.length > 0) {
    const nucleosSnap = await adminDb.collectionGroup('nucleos').get()
    for (const doc of nucleosSnap.docs) {
      if (!segment.nucleoIds.includes(doc.id)) continue
      const data = doc.data()
      if (typeof data.responsibleEducatorId === 'string') {
        adminUids.add(data.responsibleEducatorId)
      }
      if (Array.isArray(data.coEducatorIds)) {
        data.coEducatorIds.forEach((uid: unknown) => {
          if (typeof uid === 'string') adminUids.add(uid)
        })
      }
    }
  }

  return Array.from(adminUids)
}

/** Resolves audience entries from Firestore. Handles subscriptionPlans with sub-doc lookup and admin resolving. */
export async function resolveAudience(segment: SegmentFilter): Promise<TokenEntry[]> {
  const snap = await adminDb.collection('users').get()
  const rawUsers = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as RawUserDoc[]
  const adminUids = segment.adminsOnly ? await resolveAdminAudienceUids(segment) : []
  let candidates = filterUserDocs(rawUsers, {
    ...segment,
    subscriptionPlans: [],
    adminUids,
  })

  // Subscription plan requires sub-doc lookup.
  const needsPlanFilter = segment.subscriptionPlans && segment.subscriptionPlans.length > 0
  if (needsPlanFilter) {
    const filtered: TokenEntry[] = []
    for (const entry of candidates) {
      const subDoc = await adminDb
        .collection('users')
        .doc(entry.uid)
        .collection('subscription')
        .doc('current')
        .get()
        .catch(() => null)
      const plan = subDoc?.data()?.plan === 'premium' ? 'premium' : 'free'
      if (segment.subscriptionPlans!.includes(plan)) filtered.push(entry)
    }
    candidates = filtered
  }

  return candidates
}

// Re-export types for convenience
export type { SegmentFilter, TokenEntry } from './notification-audience-filter'
