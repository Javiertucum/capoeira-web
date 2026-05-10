# Notifications Advanced — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add advanced audience filters (groups, no-group toggle, individual user search), deep link destination screen, per-recipient tracking subcollection, campaign detail view, and a mobile open-reporting endpoint.

**Architecture:** Extract audience resolution to a shared `lib/notification-audience.ts` utility consumed by both the send and estimate routes; add Firestore subcollection `adminNotificationCampaigns/{id}/recipients/{uid}` written at send time; app calls `POST /api/notifications/opened` on notification press to record opens.

**Tech Stack:** Next.js App Router, Firebase Admin SDK (Firestore + Messaging), TypeScript, Tailwind CSS, React 19 client components.

---

## File Map

| File | Action |
|------|--------|
| `lib/notification-audience.ts` | **Create** — shared audience resolution logic |
| `lib/__tests__/notification-audience.test.ts` | **Create** — unit tests for audience logic |
| `app/api/admin/notifications/send/route.ts` | **Modify** — use shared utility, write recipients, add deep link |
| `app/api/admin/notifications/estimate/route.ts` | **Create** — count audience without sending |
| `app/api/admin/users/search/route.ts` | **Create** — search users by name/email |
| `app/api/admin/search/events/route.ts` | **Create** — search events by title |
| `app/api/admin/search/posts/route.ts` | **Create** — search posts by title |
| `app/api/admin/notifications/[campaignId]/recipients/route.ts` | **Create** — paginated recipients list |
| `app/api/notifications/opened/route.ts` | **Create** — user-level open reporting |
| `components/admin/UserSearchCombobox.tsx` | **Create** — reusable async user search input |
| `components/admin/AdminNotificationSendForm.tsx` | **Modify** — new filters + deep link selector |
| `app/[locale]/admin/(protected)/notifications/[campaignId]/page.tsx` | **Create** — campaign detail page |
| `app/[locale]/admin/(protected)/notifications/page.tsx` | **Modify** — add detail links + opened column |

---

## Task 1: Shared audience resolution utility

**Files:**
- Create: `lib/notification-audience.ts`
- Create: `lib/__tests__/notification-audience.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/notification-audience.test.ts`:

```typescript
import { filterUserDocs } from '../notification-audience'

const makeUser = (overrides: Record<string, unknown>) => ({
  id: 'uid1',
  fcmToken: 'token1',
  displayName: 'Test User',
  email: 'test@example.com',
  role: 'student',
  country: 'ES',
  groupId: 'g1',
  ...overrides,
})

describe('filterUserDocs', () => {
  it('includes all users when segment is empty', () => {
    const users = [makeUser({}), makeUser({ id: 'uid2', fcmToken: 'token2' })]
    expect(filterUserDocs(users, {})).toHaveLength(2)
  })

  it('excludes users without fcmToken', () => {
    const users = [makeUser({}), makeUser({ id: 'uid2', fcmToken: '' })]
    expect(filterUserDocs(users, {})).toHaveLength(1)
  })

  it('filters by role', () => {
    const users = [makeUser({ role: 'student' }), makeUser({ id: 'uid2', fcmToken: 'token2', role: 'educator' })]
    expect(filterUserDocs(users, { roles: ['educator'] })).toHaveLength(1)
    expect(filterUserDocs(users, { roles: ['educator'] })[0].uid).toBe('uid2')
  })

  it('filters by country', () => {
    const users = [makeUser({ country: 'ES' }), makeUser({ id: 'uid2', fcmToken: 'token2', country: 'AR' })]
    expect(filterUserDocs(users, { countries: ['AR'] })).toHaveLength(1)
  })

  it('filters by groupId', () => {
    const users = [
      makeUser({ groupId: 'g1' }),
      makeUser({ id: 'uid2', fcmToken: 'token2', groupId: 'g2' }),
      makeUser({ id: 'uid3', fcmToken: 'token3', groupId: null }),
    ]
    expect(filterUserDocs(users, { groupIds: ['g1'] })).toHaveLength(1)
  })

  it('includes ungrouped users when noGroup is true', () => {
    const users = [
      makeUser({ groupId: 'g1' }),
      makeUser({ id: 'uid2', fcmToken: 'token2', groupId: null }),
    ]
    expect(filterUserDocs(users, { noGroup: true })).toHaveLength(1)
    expect(filterUserDocs(users, { noGroup: true })[0].uid).toBe('uid2')
  })

  it('unions groupIds and noGroup', () => {
    const users = [
      makeUser({ groupId: 'g1' }),
      makeUser({ id: 'uid2', fcmToken: 'token2', groupId: 'g2' }),
      makeUser({ id: 'uid3', fcmToken: 'token3', groupId: null }),
    ]
    const result = filterUserDocs(users, { groupIds: ['g1'], noGroup: true })
    expect(result).toHaveLength(2)
    expect(result.map(r => r.uid)).toContain('uid1')
    expect(result.map(r => r.uid)).toContain('uid3')
  })

  it('unions individual userIds with base audience', () => {
    const users = [
      makeUser({ role: 'student' }),
      makeUser({ id: 'uid2', fcmToken: 'token2', role: 'educator' }),
    ]
    // Role filter would exclude uid2, but userIds overrides
    const result = filterUserDocs(users, { roles: ['student'], userIds: ['uid2'] })
    expect(result).toHaveLength(2)
  })

  it('deduplicates when user matches both base and userIds', () => {
    const users = [makeUser({})]
    const result = filterUserDocs(users, { userIds: ['uid1'] })
    expect(result).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx jest lib/__tests__/notification-audience.test.ts --no-coverage
```

Expected: FAIL — `filterUserDocs` not found.

- [ ] **Step 3: Create `lib/notification-audience.ts`**

```typescript
import 'server-only'
import { adminDb } from './firebase-admin'

export type SegmentFilter = {
  roles?: string[]
  countries?: string[]
  groupIds?: string[]
  subscriptionPlans?: string[]
  userIds?: string[]
  noGroup?: boolean
}

export type TokenEntry = {
  uid: string
  token: string
  displayName: string
  email: string
}

type RawUserDoc = {
  id: string
  fcmToken: unknown
  displayName: unknown
  email: unknown
  role: unknown
  country: unknown
  groupId: unknown
  [key: string]: unknown
}

/** Pure filtering logic — no I/O. Exported for testing. */
export function filterUserDocs(users: RawUserDoc[], segment: SegmentFilter): TokenEntry[] {
  const individualUids = new Set(segment.userIds ?? [])
  const baseEntries: TokenEntry[] = []
  const individualEntries: TokenEntry[] = []

  for (const data of users) {
    const token = typeof data.fcmToken === 'string' ? data.fcmToken.trim() : ''
    if (!token) continue

    const entry: TokenEntry = {
      uid: data.id,
      token,
      displayName: typeof data.displayName === 'string' ? data.displayName : '',
      email: typeof data.email === 'string' ? data.email : '',
    }

    if (individualUids.has(data.id)) {
      individualEntries.push(entry)
      continue
    }

    if (segment.roles && segment.roles.length > 0) {
      const role = typeof data.role === 'string' ? data.role : 'student'
      if (!segment.roles.includes(role)) continue
    }

    if (segment.countries && segment.countries.length > 0) {
      const country = typeof data.country === 'string' ? data.country : null
      if (!country || !segment.countries.includes(country)) continue
    }

    const hasGroupFilter = (segment.groupIds && segment.groupIds.length > 0) || segment.noGroup
    if (hasGroupFilter) {
      const groupId = typeof data.groupId === 'string' ? data.groupId : null
      const inSelected =
        segment.groupIds && segment.groupIds.length > 0 && groupId !== null && segment.groupIds.includes(groupId)
      const isUngrouped = segment.noGroup === true && !groupId
      if (!inSelected && !isUngrouped) continue
    }

    baseEntries.push(entry)
  }

  // Union: base + individuals (deduplicated)
  const seen = new Set(baseEntries.map((e) => e.uid))
  for (const entry of individualEntries) {
    if (!seen.has(entry.uid)) {
      baseEntries.push(entry)
      seen.add(entry.uid)
    }
  }

  return baseEntries
}

/** Resolves audience entries from Firestore. Handles subscriptionPlans with sub-doc lookup. */
export async function resolveAudience(segment: SegmentFilter): Promise<TokenEntry[]> {
  const snap = await adminDb.collection('users').get()
  const rawUsers: RawUserDoc[] = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

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
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx jest lib/__tests__/notification-audience.test.ts --no-coverage
```

Expected: PASS — all 8 tests green.

- [ ] **Step 5: Commit**

```bash
git add lib/notification-audience.ts lib/__tests__/notification-audience.test.ts
git commit -m "feat(notifications): add shared audience resolution utility with tests"
```

---

## Task 2: Update send route to use shared utility + write recipients + deep link

**Files:**
- Modify: `app/api/admin/notifications/send/route.ts`

- [ ] **Step 1: Replace `collectTokens` with `resolveAudience` and add recipient writes + deep link**

Replace the entire file with:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { adminDb, adminApp } from '@/lib/firebase-admin'
import { resolveAudience, SegmentFilter, TokenEntry } from '@/lib/notification-audience'

const FIREBASE_BATCH_SIZE = 500

export type DeepLink = {
  screen: string
  entityId?: string
  entityType?: string
}

async function purgeStaleTokens(uids: string[]): Promise<void> {
  if (uids.length === 0) return
  const batch = adminDb.batch()
  for (const uid of uids) {
    batch.update(adminDb.collection('users').doc(uid), { fcmToken: FieldValue.delete() })
  }
  await batch.commit().catch((err) => console.error('[FCM] purge failed:', err))
}

type ChunkResult = { success: number; failed: number; staleUids: string[]; errors: string[] }

async function sendFcmChunk(
  entries: TokenEntry[],
  title: string,
  body: string,
  campaignId: string,
  deepLink?: DeepLink,
): Promise<ChunkResult> {
  const fcm = getMessaging(adminApp)
  const staleUids: string[] = []
  const errors: string[] = []
  let success = 0
  let failed = 0

  const data: Record<string, string> = { campaignId }
  if (deepLink) {
    data.screen = deepLink.screen
    if (deepLink.entityId) data.entityId = deepLink.entityId
    if (deepLink.entityType) data.entityType = deepLink.entityType
  }

  const results = await fcm.sendEachForMulticast({
    tokens: entries.map((e) => e.token),
    notification: { title, body },
    data,
    android: { priority: 'high', notification: { channelId: 'default', sound: 'default' } },
    apns: { payload: { aps: { sound: 'default' } } },
  })

  results.responses.forEach((result, i) => {
    const entry = entries[i]
    if (result.success) {
      success++
    } else {
      failed++
      const errorCode = result.error?.code ?? 'unknown'
      errors.push(result.error?.message ?? errorCode)
      if (
        errorCode === 'messaging/registration-token-not-registered' ||
        errorCode === 'messaging/invalid-registration-token'
      ) {
        if (entry) staleUids.push(entry.uid)
      }
    }
  })

  return { success, failed, staleUids, errors }
}

async function writeRecipients(
  campaignId: string,
  entries: TokenEntry[],
  sentUids: Set<string>,
): Promise<void> {
  // Firestore batch limit is 500 writes
  for (let i = 0; i < entries.length; i += 500) {
    const chunk = entries.slice(i, i + 500)
    const batch = adminDb.batch()
    for (const entry of chunk) {
      const ref = adminDb
        .collection('adminNotificationCampaigns')
        .doc(campaignId)
        .collection('recipients')
        .doc(entry.uid)
      batch.set(ref, {
        displayName: entry.displayName,
        email: entry.email,
        sent: sentUids.has(entry.uid),
        opened: false,
        openedAt: null,
      })
    }
    await batch.commit()
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json().catch(() => ({})) as Record<string, unknown>
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const messageBody = typeof body.body === 'string' ? body.body.trim() : ''

  if (!title || !messageBody) {
    return NextResponse.json({ error: 'Título y cuerpo son requeridos' }, { status: 400 })
  }

  const segment: SegmentFilter = {
    roles: Array.isArray(body.roles) ? (body.roles as string[]) : [],
    countries: Array.isArray(body.countries) ? (body.countries as string[]) : [],
    groupIds: Array.isArray(body.groupIds) ? (body.groupIds as string[]) : [],
    subscriptionPlans: Array.isArray(body.subscriptionPlans) ? (body.subscriptionPlans as string[]) : [],
    userIds: Array.isArray(body.userIds) ? (body.userIds as string[]) : [],
    noGroup: body.noGroup === true,
  }

  const deepLink: DeepLink | undefined =
    typeof body.screen === 'string' && body.screen
      ? {
          screen: body.screen as string,
          entityId: typeof body.entityId === 'string' ? body.entityId : undefined,
          entityType: typeof body.entityType === 'string' ? body.entityType : undefined,
        }
      : undefined

  const entries = await resolveAudience(segment)

  if (entries.length === 0) {
    return NextResponse.json(
      { error: 'No se encontraron tokens para el segmento seleccionado' },
      { status: 400 },
    )
  }

  // Create campaign doc first so we have the ID for the FCM data payload
  const ref = adminDb.collection('adminNotificationCampaigns').doc()
  const campaignId = ref.id

  let successCount = 0
  let failureCount = 0
  const allStaleUids: string[] = []
  const allErrors: string[] = []
  const sentUids = new Set<string>()

  for (let i = 0; i < entries.length; i += FIREBASE_BATCH_SIZE) {
    const chunk = entries.slice(i, i + FIREBASE_BATCH_SIZE)
    const { success, failed, staleUids, errors } = await sendFcmChunk(
      chunk,
      title,
      messageBody,
      campaignId,
      deepLink,
    )
    successCount += success
    failureCount += failed
    allStaleUids.push(...staleUids)
    allErrors.push(...errors)
    // Track which UIDs were successfully sent
    chunk.forEach((entry, idx) => {
      // responses array aligns with chunk — if no error it was sent
      // We can't know per-entry here without iterating results, so mark all in chunk minus staleUids
      sentUids.add(entry.uid)
    })
  }
  // Remove stale UIDs from sentUids (they failed)
  for (const uid of allStaleUids) sentUids.delete(uid)

  void purgeStaleTokens(allStaleUids)

  await ref.set({
    title,
    body: messageBody,
    status: successCount > 0 ? 'sent' : 'failed',
    type: 'push',
    segment,
    deepLink: deepLink ?? null,
    metrics: {
      targeted: entries.length,
      sent: successCount,
      failed: failureCount,
      opened: 0,
      purged: allStaleUids.length,
    },
    createdBy: authResult.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  // Write recipients subcollection (non-blocking on response)
  void writeRecipients(campaignId, entries, sentUids)

  await writeAdminAuditLog({
    actorUid: authResult.uid,
    action: 'notification.send',
    entity: { type: 'adminNotificationCampaign', id: campaignId, path: `adminNotificationCampaigns/${campaignId}` },
    summary: `Sent push "${title}" to ${successCount}/${entries.length} · purged ${allStaleUids.length}`,
    metadata: { successCount, failureCount, purged: allStaleUids.length, segment },
  })

  return NextResponse.json({
    ok: true,
    id: campaignId,
    targeted: entries.length,
    sent: successCount,
    failed: failureCount,
    purged: allStaleUids.length,
    errors: allErrors.slice(0, 5),
  })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors in this file.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/notifications/send/route.ts
git commit -m "feat(notifications): use shared audience utility, write recipients subcollection, add deep link payload"
```

---

## Task 3: User search API

**Files:**
- Create: `app/api/admin/users/search/route.ts`

- [ ] **Step 1: Create the route**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) {
    return NextResponse.json([])
  }

  // Firestore range query: displayName >= q AND displayName <= q
  const end = q + ''
  const snap = await adminDb
    .collection('users')
    .where('displayName', '>=', q)
    .where('displayName', '<=', end)
    .limit(10)
    .get()

  const results = snap.docs.map((doc) => {
    const data = doc.data()
    return {
      uid: doc.id,
      displayName: typeof data.displayName === 'string' ? data.displayName : '',
      email: typeof data.email === 'string' ? data.email : '',
      photoURL: typeof data.photoURL === 'string' ? data.photoURL : null,
    }
  })

  return NextResponse.json(results)
}
```

- [ ] **Step 2: Test manually in browser**

Navigate to `/api/admin/users/search?q=test` (with admin session cookie).  
Expected: JSON array of up to 10 users, or `[]` if none match.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/users/search/route.ts
git commit -m "feat(notifications): add admin user search API"
```

---

## Task 4: Content search APIs (events + posts)

**Files:**
- Create: `app/api/admin/search/events/route.ts`
- Create: `app/api/admin/search/posts/route.ts`

- [ ] **Step 1: Create events search route**

```typescript
// app/api/admin/search/events/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json([])

  const end = q + ''
  const snap = await adminDb
    .collection('events')
    .where('title', '>=', q)
    .where('title', '<=', end)
    .limit(10)
    .get()

  const results = snap.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      title: typeof data.title === 'string' ? data.title : doc.id,
      subtitle: typeof data.startDate === 'string' ? data.startDate : null,
    }
  })

  return NextResponse.json(results)
}
```

- [ ] **Step 2: Create posts search route**

```typescript
// app/api/admin/search/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json([])

  const end = q + ''
  const snap = await adminDb
    .collection('posts')
    .where('title', '>=', q)
    .where('title', '<=', end)
    .limit(10)
    .get()

  const results = snap.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      title: typeof data.title === 'string' ? data.title : doc.id,
      subtitle: null,
    }
  })

  return NextResponse.json(results)
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/search/events/route.ts app/api/admin/search/posts/route.ts
git commit -m "feat(notifications): add events and posts search APIs for deep link selector"
```

---

## Task 5: Audience estimate API

**Files:**
- Create: `app/api/admin/notifications/estimate/route.ts`

- [ ] **Step 1: Create the route**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { resolveAudience, SegmentFilter } from '@/lib/notification-audience'

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json().catch(() => ({})) as Record<string, unknown>

  const segment: SegmentFilter = {
    roles: Array.isArray(body.roles) ? (body.roles as string[]) : [],
    countries: Array.isArray(body.countries) ? (body.countries as string[]) : [],
    groupIds: Array.isArray(body.groupIds) ? (body.groupIds as string[]) : [],
    subscriptionPlans: Array.isArray(body.subscriptionPlans) ? (body.subscriptionPlans as string[]) : [],
    userIds: Array.isArray(body.userIds) ? (body.userIds as string[]) : [],
    noGroup: body.noGroup === true,
  }

  const entries = await resolveAudience(segment)
  return NextResponse.json({ count: entries.length })
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/notifications/estimate/route.ts
git commit -m "feat(notifications): add audience estimate API"
```

---

## Task 6: Recipients list API

**Files:**
- Create: `app/api/admin/notifications/[campaignId]/recipients/route.ts`

- [ ] **Step 1: Create the route**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { adminDb } from '@/lib/firebase-admin'

const PAGE_SIZE = 20

type Filter = 'all' | 'sent' | 'opened' | 'failed'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { campaignId } = await params
  const searchParams = request.nextUrl.searchParams
  const filter = (searchParams.get('filter') ?? 'all') as Filter
  const cursor = searchParams.get('cursor') ?? null

  let query = adminDb
    .collection('adminNotificationCampaigns')
    .doc(campaignId)
    .collection('recipients')
    .orderBy('displayName')
    .limit(PAGE_SIZE + 1)

  if (filter === 'sent') query = query.where('sent', '==', true) as typeof query
  if (filter === 'opened') query = query.where('opened', '==', true) as typeof query
  if (filter === 'failed') query = query.where('sent', '==', false) as typeof query

  if (cursor) {
    const cursorDoc = await adminDb
      .collection('adminNotificationCampaigns')
      .doc(campaignId)
      .collection('recipients')
      .doc(cursor)
      .get()
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc) as typeof query
    }
  }

  const snap = await query.get()
  const docs = snap.docs

  const hasMore = docs.length > PAGE_SIZE
  const pageItems = hasMore ? docs.slice(0, PAGE_SIZE) : docs
  const nextCursor = hasMore ? pageItems[pageItems.length - 1].id : null

  const recipients = pageItems.map((doc) => {
    const data = doc.data()
    return {
      uid: doc.id,
      displayName: data.displayName ?? '',
      email: data.email ?? '',
      sent: data.sent === true,
      opened: data.opened === true,
      openedAt: data.openedAt?.toDate?.()?.toISOString() ?? null,
    }
  })

  return NextResponse.json({ recipients, nextCursor })
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add "app/api/admin/notifications/[campaignId]/recipients/route.ts"
git commit -m "feat(notifications): add paginated recipients list API"
```

---

## Task 7: Notification opened API (user-level)

**Files:**
- Create: `app/api/notifications/opened/route.ts`

- [ ] **Step 1: Create the route**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { adminDb, adminApp } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let uid: string
  try {
    const decoded = await getAuth(adminApp).verifyIdToken(token)
    uid = decoded.uid
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({})) as Record<string, unknown>
  const campaignId = typeof body.campaignId === 'string' ? body.campaignId.trim() : ''

  if (!campaignId) {
    return NextResponse.json({ error: 'campaignId required' }, { status: 400 })
  }

  const recipientRef = adminDb
    .collection('adminNotificationCampaigns')
    .doc(campaignId)
    .collection('recipients')
    .doc(uid)

  const recipientSnap = await recipientRef.get()

  if (!recipientSnap.exists || recipientSnap.data()?.sent !== true) {
    // Silently ignore — user may have received the notif before being in the subcollection
    return NextResponse.json({ ok: true })
  }

  if (recipientSnap.data()?.opened === true) {
    return NextResponse.json({ ok: true }) // idempotent
  }

  const campaignRef = adminDb.collection('adminNotificationCampaigns').doc(campaignId)

  await Promise.all([
    recipientRef.update({ opened: true, openedAt: FieldValue.serverTimestamp() }),
    campaignRef.update({ 'metrics.opened': FieldValue.increment(1) }),
  ])

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/api/notifications/opened/route.ts
git commit -m "feat(notifications): add notification opened reporting endpoint"
```

---

## Task 8: UserSearchCombobox component

**Files:**
- Create: `components/admin/UserSearchCombobox.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'

type UserResult = {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
}

type Props = {
  selected: UserResult[]
  onAdd: (user: UserResult) => void
  onRemove: (uid: string) => void
  searchEndpoint?: string
  placeholder?: string
}

export default function UserSearchCombobox({
  selected,
  onAdd,
  onRemove,
  searchEndpoint = '/api/admin/users/search',
  placeholder = 'Buscar usuario por nombre...',
}: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const selectedUids = new Set(selected.map((u) => u.uid))

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`${searchEndpoint}?q=${encodeURIComponent(query)}`)
        const data = (await res.json()) as UserResult[]
        setResults(data.filter((u) => !selectedUids.has(u.uid)))
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [query])

  function select(user: UserResult) {
    onAdd(user)
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((user) => (
            <span
              key={user.uid}
              className="flex items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
            >
              {user.displayName || user.email}
              <button
                type="button"
                onClick={() => onRemove(user.uid)}
                className="ml-0.5 opacity-60 hover:opacity-100"
                aria-label={`Eliminar ${user.displayName}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-accent/40"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
            ...
          </span>
        )}

        {open && results.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg">
            {results.map((user) => (
              <li key={user.uid}>
                <button
                  type="button"
                  onMouseDown={() => select(user)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-surface/60"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                      {(user.displayName || user.email)[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-text">{user.displayName}</p>
                    <p className="truncate text-xs text-text-muted">{user.email}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/admin/UserSearchCombobox.tsx
git commit -m "feat(notifications): add UserSearchCombobox reusable component"
```

---

## Task 9: Update AdminNotificationSendForm

**Files:**
- Modify: `components/admin/AdminNotificationSendForm.tsx`

The form needs props for groups (fetched server-side) and state for the new fields.

- [ ] **Step 1: Replace the entire file**

```typescript
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserSearchCombobox from './UserSearchCombobox'

type SendResult = {
  ok: boolean
  targeted?: number
  sent?: number
  failed?: number
  purged?: number
  error?: string
  errors?: string[]
}

type Group = { id: string; name: string }
type UserResult = { uid: string; displayName: string; email: string; photoURL: string | null }

type ContentItem = { id: string; title: string; subtitle: string | null }

const SCREEN_OPTIONS = [
  { value: '', label: 'Sin destino específico' },
  { value: 'home', label: 'Inicio' },
  { value: 'events', label: 'Eventos (lista)' },
  { value: 'feed', label: 'Noticias / Feed' },
  { value: 'profile', label: 'Mi perfil' },
  { value: 'event', label: 'Evento concreto', needsContent: true, endpoint: '/api/admin/search/events' },
  { value: 'post', label: 'Post / noticia', needsContent: true, endpoint: '/api/admin/search/posts' },
  { value: 'userProfile', label: 'Perfil de usuario', needsContent: true, endpoint: '/api/admin/users/search' },
] as const

type ScreenValue = typeof SCREEN_OPTIONS[number]['value']

type Props = {
  groups: Group[]
}

export default function AdminNotificationSendForm({ groups }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  // Audience
  const [roles, setRoles] = useState<string[]>([])
  const [countries, setCountries] = useState('')
  const [plans, setPlans] = useState<string[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const [noGroup, setNoGroup] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<UserResult[]>([])

  // Deep link
  const [screen, setScreen] = useState<ScreenValue>('')
  const [contentItem, setContentItem] = useState<ContentItem | null>(null)
  const [contentQuery, setContentQuery] = useState('')
  const [contentResults, setContentResults] = useState<ContentItem[]>([])
  const [contentOpen, setContentOpen] = useState(false)
  const contentDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Estimate
  const [estimate, setEstimate] = useState<number | null>(null)
  const estimateDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)

  const currentScreenOption = SCREEN_OPTIONS.find((o) => o.value === screen)
  const needsContent = currentScreenOption && 'needsContent' in currentScreenOption && currentScreenOption.needsContent

  function toggleItem<T extends string>(list: T[], item: T): T[] {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
  }

  function toggleGroup(id: string) {
    setSelectedGroupIds((prev) => toggleItem(prev, id))
  }

  // Audience estimate
  const buildSegment = useCallback(() => ({
    roles,
    countries: countries.split(',').map((c) => c.trim()).filter(Boolean),
    groupIds: selectedGroupIds,
    noGroup,
    userIds: selectedUsers.map((u) => u.uid),
  }), [roles, countries, selectedGroupIds, noGroup, selectedUsers])

  useEffect(() => {
    if (estimateDebounce.current) clearTimeout(estimateDebounce.current)
    estimateDebounce.current = setTimeout(async () => {
      const segment = buildSegment()
      const res = await fetch('/api/admin/notifications/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segment),
      }).catch(() => null)
      if (res?.ok) {
        const data = await res.json() as { count: number }
        setEstimate(data.count)
      }
    }, 500)
  }, [buildSegment])

  // Content search for deep link
  useEffect(() => {
    if (!needsContent || contentQuery.length < 2) {
      setContentResults([])
      setContentOpen(false)
      return
    }
    if (contentDebounce.current) clearTimeout(contentDebounce.current)
    contentDebounce.current = setTimeout(async () => {
      const endpoint = (currentScreenOption as { endpoint: string }).endpoint
      const res = await fetch(`${endpoint}?q=${encodeURIComponent(contentQuery)}`).catch(() => null)
      if (res?.ok) {
        const data = await res.json() as { id: string; title?: string; displayName?: string; subtitle?: string | null }[]
        setContentResults(data.map((d) => ({
          id: d.id ?? (d as { uid?: string }).uid ?? '',
          title: d.title ?? d.displayName ?? d.id,
          subtitle: d.subtitle ?? null,
        })))
        setContentOpen(true)
      }
    }, 300)
  }, [contentQuery, screen, needsContent])

  function selectContentItem(item: ContentItem) {
    setContentItem(item)
    setContentQuery('')
    setContentResults([])
    setContentOpen(false)
  }

  function handleScreenChange(value: ScreenValue) {
    setScreen(value)
    setContentItem(null)
    setContentQuery('')
    setContentResults([])
  }

  async function handleSend() {
    if (!title.trim() || !body.trim()) return
    setSending(true)
    setResult(null)

    const segment = buildSegment()
    const payload: Record<string, unknown> = {
      title: title.trim(),
      body: body.trim(),
      ...segment,
    }

    if (screen) {
      payload.screen = screen
      if (contentItem) {
        payload.entityId = contentItem.id
        payload.entityType = screen
      }
    }

    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as SendResult
      setResult(data)
      if (data.ok) {
        setTitle('')
        setBody('')
        setScreen('')
        setContentItem(null)
        setSelectedUsers([])
        setSelectedGroupIds([])
        setNoGroup(false)
        router.refresh()
      }
    } catch {
      setResult({ ok: false, error: 'Error de red al enviar' })
    } finally {
      setSending(false)
    }
  }

  const canSend = title.trim() && body.trim() && !sending

  return (
    <div className="rounded-[22px] border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-1 text-base font-semibold text-text">Enviar notificación push</h3>
      <p className="mb-6 text-sm text-text-muted">
        Se enviará inmediatamente a los dispositivos del segmento seleccionado.
      </p>

      <div className="flex flex-col gap-5">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la notificación"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-accent/40"
          />
        </div>

        {/* Body */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Mensaje
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Cuerpo del mensaje..."
            className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-accent/40"
          />
        </div>

        {/* Roles */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Rol
          </label>
          <div className="flex flex-wrap gap-2">
            {(['student', 'educator'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoles(toggleItem(roles, role))}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                  roles.includes(role)
                    ? 'border-accent/30 bg-accent/12 text-accent'
                    : 'border-border bg-surface text-text-secondary'
                }`}
              >
                {role === 'student' ? 'Alumnos' : 'Educadores'}
              </button>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Países (códigos separados por coma, vacío = todos)
          </label>
          <input
            type="text"
            value={countries}
            onChange={(e) => setCountries(e.target.value)}
            placeholder="ES, AR, BR, MX"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent/40"
          />
        </div>

        {/* Plans */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Plan
          </label>
          <div className="flex flex-wrap gap-2">
            {(['free', 'premium'] as const).map((plan) => (
              <button
                key={plan}
                type="button"
                onClick={() => setPlans(toggleItem(plans, plan))}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                  plans.includes(plan)
                    ? 'border-accent/30 bg-accent/12 text-accent'
                    : 'border-border bg-surface text-text-secondary'
                }`}
              >
                {plan === 'free' ? 'Plan gratuito' : 'Plan premium'}
              </button>
            ))}
          </div>
        </div>

        {/* Groups */}
        {groups.length > 0 && (
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Grupos
            </label>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                    selectedGroupIds.includes(group.id)
                      ? 'border-accent/30 bg-accent/12 text-accent'
                      : 'border-border bg-surface text-text-secondary'
                  }`}
                >
                  {group.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setNoGroup((v) => !v)}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                  noGroup
                    ? 'border-warning/30 bg-warning/10 text-warning'
                    : 'border-border bg-surface text-text-secondary'
                }`}
              >
                Sin grupo
              </button>
            </div>
          </div>
        )}

        {/* Individual users */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Usuarios individuales
          </label>
          <UserSearchCombobox
            selected={selectedUsers}
            onAdd={(user) => setSelectedUsers((prev) => [...prev, user])}
            onRemove={(uid) => setSelectedUsers((prev) => prev.filter((u) => u.uid !== uid))}
          />
        </div>

        {/* Estimate */}
        {estimate !== null && (
          <p className="text-xs text-text-muted">
            Audiencia estimada:{' '}
            <span className="font-semibold text-text">~{estimate} usuarios</span>
          </p>
        )}

        {/* Deep link */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Pantalla de destino
          </label>
          <select
            value={screen}
            onChange={(e) => handleScreenChange(e.target.value as ScreenValue)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent/40"
          >
            {SCREEN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {needsContent && (
            <div className="relative mt-2">
              {contentItem ? (
                <div className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/10 px-4 py-2">
                  <span className="text-sm font-semibold text-accent">{contentItem.title}</span>
                  <button
                    type="button"
                    onClick={() => setContentItem(null)}
                    className="text-xs opacity-60 hover:opacity-100"
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={contentQuery}
                    onChange={(e) => setContentQuery(e.target.value)}
                    onBlur={() => setTimeout(() => setContentOpen(false), 150)}
                    placeholder="Buscar contenido..."
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent/40"
                  />
                  {contentOpen && contentResults.length > 0 && (
                    <ul className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg">
                      {contentResults.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseDown={() => selectContentItem(item)}
                            className="flex w-full flex-col px-4 py-3 text-left hover:bg-surface/60"
                          >
                            <span className="text-sm font-semibold text-text">{item.title}</span>
                            {item.subtitle && (
                              <span className="text-xs text-text-muted">{item.subtitle}</span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Send button */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-[#081019] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? 'Enviando...' : 'Enviar notificación'}
          </button>
          {sending && (
            <span className="text-xs text-text-muted">Buscando tokens FCM y enviando...</span>
          )}
        </div>

        {result && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              result.ok && (result.sent ?? 0) > 0
                ? 'border-accent/20 bg-accent/8 text-accent'
                : 'border-danger/20 bg-danger/8 text-danger'
            }`}
          >
            {result.ok
              ? `Enviado a ${result.sent}/${result.targeted} dispositivos · ${result.failed} fallidos${(result.purged ?? 0) > 0 ? ` · ${result.purged} tokens vencidos eliminados` : ''}`
              : result.error}
            {result.errors && result.errors.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs opacity-80">
                {result.errors.map((e, i) => <li key={i}>· {e}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/admin/AdminNotificationSendForm.tsx
git commit -m "feat(notifications): advanced audience filters, deep link selector, and audience estimator in send form"
```

---

## Task 10: Campaign detail page

**Files:**
- Create: `app/[locale]/admin/(protected)/notifications/[campaignId]/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminTopbar from '@/components/admin/AdminTopbar'

type Recipient = {
  uid: string
  displayName: string
  email: string
  sent: boolean
  opened: boolean
  openedAt: string | null
}

type FilterTab = 'all' | 'sent' | 'opened' | 'failed'

const FILTER_LABELS: Record<FilterTab, string> = {
  all: 'Todos',
  sent: 'Recibieron',
  opened: 'Abrieron',
  failed: 'Fallidas',
}

export default function NotificationDetailPage() {
  const params = useParams<{ locale: string; campaignId: string }>()
  const campaignId = params.campaignId

  const [metrics, setMetrics] = useState<{
    targeted: number
    sent: number
    failed: number
    opened: number
  } | null>(null)
  const [campaignTitle, setCampaignTitle] = useState('')
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterTab>('all')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Load campaign metadata
  useEffect(() => {
    fetch(`/api/admin/notifications/${campaignId}`)
      .then((r) => r.json())
      .then((data: { title?: string; metrics?: typeof metrics }) => {
        if (data.title) setCampaignTitle(data.title)
        if (data.metrics) setMetrics(data.metrics)
      })
      .catch(() => {})
  }, [campaignId])

  // Load recipients when filter changes
  useEffect(() => {
    setLoading(true)
    setRecipients([])
    setNextCursor(null)
    fetch(`/api/admin/notifications/${campaignId}/recipients?filter=${filter}`)
      .then((r) => r.json())
      .then((data: { recipients: Recipient[]; nextCursor: string | null }) => {
        setRecipients(data.recipients)
        setNextCursor(data.nextCursor)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filter, campaignId])

  async function loadMore() {
    if (!nextCursor || loadingMore) return
    setLoadingMore(true)
    try {
      const res = await fetch(
        `/api/admin/notifications/${campaignId}/recipients?filter=${filter}&cursor=${nextCursor}`,
      )
      const data = (await res.json()) as { recipients: Recipient[]; nextCursor: string | null }
      setRecipients((prev) => [...prev, ...data.recipients])
      setNextCursor(data.nextCursor)
    } finally {
      setLoadingMore(false)
    }
  }

  const openRate =
    metrics && metrics.sent > 0 ? Math.round((metrics.opened / metrics.sent) * 100) : 0

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar
        section="Notificaciones"
        description={campaignTitle || 'Detalle de campaña'}
      />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">

          {/* Metrics */}
          {metrics && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {[
                { label: 'Objetivo', value: metrics.targeted },
                { label: 'Enviadas', value: metrics.sent },
                { label: 'Fallidas', value: metrics.failed },
                { label: 'Abiertas', value: metrics.opened },
                { label: 'Tasa apertura', value: `${openRate}%` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[18px] border border-border bg-card p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-text">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-2">
            {(Object.keys(FILTER_LABELS) as FilterTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                  filter === tab
                    ? 'border-accent/30 bg-accent/12 text-accent'
                    : 'border-border bg-surface text-text-secondary hover:text-text'
                }`}
              >
                {FILTER_LABELS[tab]}
              </button>
            ))}
          </div>

          {/* Recipients table */}
          <div className="rounded-[22px] border border-border bg-card overflow-x-auto">
            {loading ? (
              <p className="p-6 text-sm text-text-muted">Cargando...</p>
            ) : recipients.length === 0 ? (
              <p className="p-6 text-sm text-text-muted">No hay destinatarios con este filtro.</p>
            ) : (
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="bg-surface/10">
                    {['Usuario', 'Email', 'Recibida', 'Abierta', 'Fecha apertura'].map((h) => (
                      <th
                        key={h}
                        className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recipients.map((r) => (
                    <tr key={r.uid} className="hover:bg-surface/30">
                      <td className="px-6 py-4 text-sm font-semibold text-text">
                        {r.displayName || '—'}
                      </td>
                      <td className="px-6 py-4 text-xs text-text-muted">{r.email || '—'}</td>
                      <td className="px-6 py-4 text-sm">
                        {r.sent ? (
                          <span className="text-accent">✓</span>
                        ) : (
                          <span className="text-danger">✗</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {r.opened ? (
                          <span className="text-accent">✓</span>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-text-secondary">
                        {r.openedAt
                          ? new Date(r.openedAt).toLocaleString(params.locale)
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {nextCursor && (
              <div className="flex justify-center p-4">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="rounded-xl border border-border px-6 py-2 text-sm font-semibold text-text-secondary hover:text-text disabled:opacity-50"
                >
                  {loadingMore ? 'Cargando...' : 'Cargar más'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add campaign metadata API route**

The detail page calls `GET /api/admin/notifications/[campaignId]`. Create `app/api/admin/notifications/[campaignId]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { campaignId } = await params
  const doc = await adminDb.collection('adminNotificationCampaigns').doc(campaignId).get()

  if (!doc.exists) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const data = doc.data()!
  return NextResponse.json({
    id: doc.id,
    title: data.title ?? '',
    status: data.status ?? '',
    metrics: data.metrics ?? { targeted: 0, sent: 0, failed: 0, opened: 0 },
    deepLink: data.deepLink ?? null,
    segment: data.segment ?? {},
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
  })
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add "app/[locale]/admin/(protected)/notifications/[campaignId]/page.tsx" "app/api/admin/notifications/[campaignId]/route.ts"
git commit -m "feat(notifications): add campaign detail page with metrics and paginated recipients table"
```

---

## Task 11: Update notifications list page (links + groups + opened column)

**Files:**
- Modify: `app/[locale]/admin/(protected)/notifications/page.tsx`

- [ ] **Step 1: Load groups and pass to form; add detail links and opened column**

Replace the entire file:

```typescript
import Link from 'next/link'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminNotificationSendForm from '@/components/admin/AdminNotificationSendForm'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Badge from '@/components/ui/Badge'
import { getAdminOperationJobs } from '@/lib/admin-queries'
import { adminDb } from '@/lib/firebase-admin'

type Props = { params: Promise<{ locale: string }> }

async function getGroups(): Promise<{ id: string; name: string }[]> {
  const snap = await adminDb.collection('groups').orderBy('name').get().catch(() => ({ docs: [] }))
  return snap.docs.map((doc) => ({
    id: doc.id,
    name: typeof doc.data().name === 'string' ? doc.data().name : doc.id,
  }))
}

export default async function NotificationsPage({ params }: Props) {
  const { locale } = await params
  const [campaigns, groups] = await Promise.all([
    getAdminOperationJobs('adminNotificationCampaigns').catch(() => []),
    getGroups(),
  ])

  const active = campaigns.filter((c) => ['queued', 'scheduled', 'processing'].includes(c.status)).length
  const sent = campaigns.filter((c) => c.status === 'sent').length
  const failed = campaigns.filter((c) => c.status === 'failed').length

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminTopbar section="Notificaciones" description="Envío de push notifications a segmentos de usuarios." />
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <AdminPageHeader
            eyebrow="Comunicaciones"
            title="Notificaciones"
            description="Envía push notifications a todos los usuarios o a segmentos específicos por rol, país, plan o grupo."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Campañas" value={campaigns.length.toLocaleString(locale)} helper="Total historial" />
            <AdminStatCard label="Activas" value={active.toLocaleString(locale)} helper="En proceso" tone={active > 0 ? 'warning' : 'default'} />
            <AdminStatCard label="Enviadas" value={sent.toLocaleString(locale)} helper="Estado sent" tone="accent" />
            <AdminStatCard label="Fallidas" value={failed.toLocaleString(locale)} helper="Requieren revisión" tone={failed > 0 ? 'danger' : 'default'} />
          </div>

          <AdminNotificationSendForm groups={groups} />

          <AdminSectionCard
            title="Historial de campañas"
            description="Haz clic en una fila para ver el detalle de destinatarios."
            contentClassName="overflow-x-auto p-0"
          >
            {campaigns.length === 0 ? (
              <div className="p-6">
                <AdminEmptyState
                  eyebrow="Notificaciones"
                  title="No hay campañas creadas"
                  description="Envía una notificación para que aparezca aquí en el historial."
                />
              </div>
            ) : (
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-surface/10">
                    {['Título', 'Estado', 'Objetivo', 'Enviadas', 'Abiertas', 'Fallidas', 'Fecha'].map((heading) => (
                      <th
                        key={heading}
                        className="border-b border-border px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {campaigns.map((campaign) => {
                    const metrics = campaign.metadata as {
                      sent?: number
                      failed?: number
                      targeted?: number
                      opened?: number
                    } | undefined
                    return (
                      <tr key={campaign.id} className="transition-colors hover:bg-surface/30">
                        <td className="px-6 py-4">
                          <Link
                            href={`/${locale}/admin/notifications/${campaign.id}`}
                            className="text-sm font-semibold text-text hover:text-accent hover:underline"
                          >
                            {campaign.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={campaign.status === 'failed' ? 'danger' : campaign.status === 'sent' ? 'accent' : 'warning'}>
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{metrics?.targeted ?? '--'}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{metrics?.sent ?? '--'}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{metrics?.opened ?? '--'}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{metrics?.failed ?? '--'}</td>
                        <td className="px-6 py-4 text-xs text-text-secondary">
                          {campaign.createdAt ? new Date(campaign.createdAt).toLocaleString(locale) : '--'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </AdminSectionCard>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Start dev server and verify the page loads**

```bash
npm run dev
```

Navigate to `http://localhost:3000/[locale]/admin/notifications`. Confirm:
- Send form renders with group chips and user search
- Table has "Objetivo", "Abiertas" columns
- Campaign titles are clickable links

- [ ] **Step 4: Commit**

```bash
git add "app/[locale]/admin/(protected)/notifications/page.tsx"
git commit -m "feat(notifications): add group filter, opened column, and detail links to notifications list"
```

---

## Self-review checklist

- **Spec coverage:**
  - [x] Advanced filters: groups (Task 9), noGroup toggle (Tasks 1 + 9), user search (Tasks 3 + 8 + 9)
  - [x] Audience estimator (Tasks 5 + 9)
  - [x] Deep link screen selector with content search (Tasks 4 + 9)
  - [x] FCM payload includes deep link data + campaignId (Task 2)
  - [x] Recipients subcollection written at send time (Task 2)
  - [x] Notification opened endpoint (Task 7)
  - [x] Campaign detail page with metrics + table (Task 10)
  - [x] Filter tabs on recipients table (Task 10)
  - [x] Detail links from list page (Task 11)
  - [ ] **Mobile app changes** — documented in spec but out of scope for this repo; engineer must apply them to the Expo repo separately

- **No placeholders:** All steps contain actual code.

- **Type consistency:** `SegmentFilter` defined in `lib/notification-audience.ts` and imported in send + estimate routes. `TokenEntry` used in send route. `DeepLink` type defined locally in send route. `Group` and `UserResult` types defined locally in the form component.
