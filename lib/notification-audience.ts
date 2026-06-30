import 'server-only'
import { adminDb } from './firebase-admin'
import { type RawUserDoc, type SegmentFilter, type TokenEntry, filterUserDocs } from './notification-audience-filter'

/** Resolves audience entries from Firestore. Handles subscriptionPlans with sub-doc lookup. */
// Limit the transferred payload to only the fields the filter/notification logic needs —
// the users collection carries far more (profile data, history, etc.) that would otherwise
// be shipped over the wire on every send and push the request close to client/proxy timeouts.
const AUDIENCE_FIELDS = ['fcmToken', 'displayName', 'email', 'role', 'country', 'groupId', 'nucleoIds', 'language'] as const

export async function resolveAudience(segment: SegmentFilter): Promise<TokenEntry[]> {
  const snap = await adminDb.collection('users').select(...AUDIENCE_FIELDS).get()
  const rawUsers = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as RawUserDoc[]

  // Split subscription plan filtering out (requires sub-doc read) from the rest
  const needsPlanFilter = segment.subscriptionPlans && segment.subscriptionPlans.length > 0

  let candidates = filterUserDocs(rawUsers, { ...segment, subscriptionPlans: [] })

  if (needsPlanFilter) {
    const plans = await Promise.all(
      candidates.map((entry) =>
        adminDb
          .collection('users')
          .doc(entry.uid)
          .collection('subscription')
          .doc('current')
          .get()
          .catch(() => null),
      ),
    )
    candidates = candidates.filter((_, i) => {
      const plan = plans[i]?.data()?.plan === 'premium' ? 'premium' : 'free'
      return segment.subscriptionPlans!.includes(plan)
    })
  }

  return candidates
}

// Re-export types for convenience
export type { SegmentFilter, TokenEntry } from './notification-audience-filter'
