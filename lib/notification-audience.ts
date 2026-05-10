import 'server-only'
import { adminDb } from './firebase-admin'
import { type RawUserDoc, type SegmentFilter, type TokenEntry, filterUserDocs } from './notification-audience-filter'

/** Resolves audience entries from Firestore. Handles subscriptionPlans with sub-doc lookup. */
export async function resolveAudience(segment: SegmentFilter): Promise<TokenEntry[]> {
  const snap = await adminDb.collection('users').get()
  const rawUsers = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as RawUserDoc[]

  // Split subscription plan filtering out (requires sub-doc read) from the rest
  const needsPlanFilter = segment.subscriptionPlans && segment.subscriptionPlans.length > 0

  let candidates = filterUserDocs(rawUsers, { ...segment, subscriptionPlans: [] })

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
