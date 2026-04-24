import { getAuth } from 'firebase-admin/auth'
import { getApps } from 'firebase-admin/app'
import { adminDb } from './firebase-admin'

type FirestoreRecord = Record<string, unknown>

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null
}

function asRecord(value: unknown): FirestoreRecord | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as FirestoreRecord)
    : null
}

function toIsoString(value: unknown): string | null {
  if (!value) return null

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === 'string') {
    const timestamp = new Date(value)
    return Number.isNaN(timestamp.getTime()) ? null : timestamp.toISOString()
  }

  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as { toDate?: unknown }).toDate === 'function'
  ) {
    return ((value as { toDate: () => Date }).toDate()).toISOString()
  }

  return null
}

function toSortTimestamp(value: unknown): number {
  const iso = toIsoString(value)
  if (!iso) return 0
  const timestamp = new Date(iso).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

function mapSchedules(value: unknown): AdminNucleo['schedules'] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const schedule = item as Record<string, unknown>
      const dayOfWeek = asNumber(schedule.dayOfWeek)
      const startTime = asString(schedule.startTime)
      const endTime = asString(schedule.endTime)

      if (dayOfWeek === null || !startTime || !endTime) {
        return null
      }

      return { dayOfWeek, startTime, endTime }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

function mapEventLocations(value: unknown): AdminEvent['locations'] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const location = item as FirestoreRecord

      return {
        name: asString(location.name) ?? '',
        address: asString(location.address) ?? '',
        latitude: asNumber(location.latitude) ?? 0,
        longitude: asNumber(location.longitude) ?? 0,
        date: toIsoString(location.date),
        endTime: toIsoString(location.endTime),
        description: asString(location.description) ?? '',
        country: asString(location.country),
        city: asString(location.city),
        isOnline: asBoolean(location.isOnline) ?? false,
        onlineLink: asString(location.onlineLink),
        locationTBC: asBoolean(location.locationTBC) ?? false,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

function mapEventPaymentMethods(value: unknown): AdminEvent['paymentMethods'] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const method = item as FirestoreRecord
      const type = asString(method.type)

      if (!type) return null

      return {
        type,
        label: asString(method.label) ?? '',
        value: asString(method.value) ?? '',
        instructions: asString(method.instructions) ?? '',
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

function mapAdminNucleo(
  groupId: string,
  groupName: string,
  nucleoId: string,
  data: FirestoreRecord
): AdminNucleo {
  return {
    id: nucleoId,
    groupId,
    groupName,
    name: asString(data.name) ?? '',
    country: asString(data.country),
    city: asString(data.city),
    address: asString(data.address),
    latitude: asNumber(data.latitude),
    longitude: asNumber(data.longitude),
    responsibleEducatorId: asString(data.responsibleEducatorId),
    coEducatorIds: asStringArray(data.coEducatorIds),
    schedules: mapSchedules(data.schedules),
  }
}

export interface AdminUser {
  uid: string
  email: string | undefined
  disabled: boolean
  name: string
  surname: string
  nickname?: string | null
  role: 'student' | 'educator' | 'admin'
  groupId?: string | null
  nucleoIds?: string[]
  graduationLevelId?: string | null
  bio?: string | null
  country?: string | null
  avatarUrl?: string | null
  socialLinks?: {
    instagram?: string | null
    facebook?: string | null
    whatsapp?: string | null
    youtube?: string | null
    tiktok?: string | null
    website?: string | null
  }
  setupComplete?: boolean
  adminPanelAccess?: boolean
  createdAt?: string | null
}

export interface AdminEvent {
  id: string
  title?: string | null
  description?: string | null
  startDate: string | null
  endDate?: string | null
  category?: string | null
  groupId?: string | null
  createdBy: string
  goingCount?: number
  interestedCount?: number
  locations?: Array<{
    name: string
    address: string
    latitude: number
    longitude: number
    date: string | null
    endTime?: string | null
    description: string
    country?: string | null
    city?: string | null
    isOnline?: boolean
    onlineLink?: string | null
    locationTBC?: boolean
  }>
  coOrganizerIds?: string[]
  showOrganizerGroups?: boolean
  posterUrls?: string[]
  recurrence?: string | null
  recurrenceEndDate?: string | null
  price?: number
  currency?: string | null
  paymentMethods?: Array<{
    type: string
    label: string
    value: string
    instructions?: string
  }>
  createdAt?: string | null
  updatedAt?: string | null
}

export type AdminEntityType = 'user' | 'group' | 'nucleo' | 'event'

export interface AdminEntityOption {
  id: string
  type: AdminEntityType
  label: string
  description?: string
  groupId?: string
}

export interface AdminNucleo {
  id: string
  groupId: string
  groupName: string
  name: string
  country?: string | null
  city?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  responsibleEducatorId?: string | null
  coEducatorIds?: string[]
  schedules?: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
  }>
}

export interface BugReport {
  id: string
  userId: string
  userEmail: string
  appVersion: string
  platform: 'ios' | 'android'
  description: string
  screenshotUrl?: string | null
  status: 'open' | 'reviewing' | 'closed'
  adminNote?: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface DashboardStats {
  totalUsers: number
  totalGroups: number
  totalNucleos: number
  openBugReports: number
  pendingRequests: number
  newUsersThisWeek: number
}

export type AdminRequestType =
  | 'group_requests'
  | 'nucleo_requests'
  | 'educatorRequests'
  | 'nucleo_transition_requests'

export interface AdminPendingRequest {
  id: string
  requestType: AdminRequestType
  typeLabel: string
  requesterId: string
  requesterName: string
  subject: string
  context: string
  createdAt: string | null
}

export interface AdminPendingRequestStats {
  totalPending: number
  groupJoinPending: number
  nucleoJoinPending: number
  educatorPending: number
  transitionPending: number
}

export type AdminSubscriptionPlan = 'free' | 'premium'

export interface AdminSubscriptionRow {
  uid: string
  email?: string
  name: string
  role: 'student' | 'educator' | 'admin'
  country?: string | null
  groupId?: string | null
  plan: AdminSubscriptionPlan
  isPremium: boolean
  source?: string | null
  eventType?: string | null
  premiumSince?: string | null
  expiresAt?: string | null
  updatedAt?: string | null
  lastVerifiedAt?: string | null
}

export interface AdminSubscriptionStats {
  totalUsers: number
  premiumUsers: number
  freeUsers: number
  staleSubscriptions: number
  lastVerifiedAt: string | null
}

export type AdminModerationEntityType = 'user' | 'group' | 'nucleo' | 'event'
export type AdminModerationState = 'visible' | 'hidden' | 'suspended'

export interface AdminModerationEntity {
  id: string
  type: AdminModerationEntityType
  label: string
  description: string
  state: AdminModerationState
  reason?: string | null
  note?: string | null
  groupId?: string | null
  updatedAt?: string | null
}

export interface AdminModerationStats {
  total: number
  visible: number
  hidden: number
  suspended: number
}

export interface AdminFeaturedContentRow {
  id: string
  entityId: string
  entityType: AdminEntityType
  label: string
  description?: string
  groupId?: string
  active: boolean
  order: number
  updatedAt?: string | null
}

export interface AdminGraduationLevelRow {
  id: string
  groupId: string
  groupName: string
  name: string
  order: number
  colors: string[]
  category?: string | null
  isEducator?: boolean
  isSpecial?: boolean
  memberCount: number
}

export interface AdminAttendanceSessionRow {
  id: string
  groupId: string
  groupName: string
  nucleoId: string
  nucleoName: string
  date: string | null
  attendees: number
  absentees: number
  createdBy: string
}

export interface AdminClassPaymentRow {
  id: string
  groupId: string
  groupName: string
  nucleoId: string
  nucleoName: string
  userId: string
  month: string
  status: 'paid' | 'pending' | 'free'
  amount?: number | null
  billingMode?: string | null
  reportedByStudent: boolean
  confirmedByEducator: boolean
  updatedAt: string | null
}

export interface AdminOperationJobRow {
  id: string
  title: string
  status: string
  type?: string | null
  createdBy?: string | null
  createdAt: string | null
  updatedAt: string | null
  metadata?: Record<string, unknown>
}

export interface AdminFinanceSnapshotRow {
  id: string
  provider: string
  kind: 'income' | 'cost'
  amount: number
  currency: string
  period: string
  status: string
  updatedAt: string | null
  source?: string | null
}

type PendingRequestSource = Readonly<{
  collection: AdminRequestType
  statusField?: 'status'
  pendingValue?: 'pending'
}>

// These collection names are defined by the mobile app data layer. We keep the
// admin shell badge pinned to the real request sources instead of guessing.
const PENDING_REQUEST_SOURCES: PendingRequestSource[] = [
  { collection: 'group_requests', statusField: 'status', pendingValue: 'pending' },
  { collection: 'nucleo_requests', statusField: 'status', pendingValue: 'pending' },
  { collection: 'educatorRequests', statusField: 'status', pendingValue: 'pending' },
  { collection: 'nucleo_transition_requests', statusField: 'status', pendingValue: 'pending' },
] as const

const REQUEST_TYPE_LABELS: Record<AdminRequestType, string> = {
  group_requests: 'Ingreso a grupo',
  nucleo_requests: 'Ingreso a nucleo',
  educatorRequests: 'Relacion de educador',
  nucleo_transition_requests: 'Transicion de nucleo',
}

function joinNonEmpty(parts: Array<string | null | undefined>, separator = ' '): string {
  return parts.filter((part): part is string => Boolean(part?.trim())).join(separator)
}

function userDisplayName(data: FirestoreRecord): string {
  const fullName = joinNonEmpty([asString(data.name), asString(data.surname)])
  const nickname = asString(data.nickname)
  if (fullName && nickname) return `${fullName} (${nickname})`
  return fullName || nickname || ''
}

function getModerationState(data: FirestoreRecord): {
  state: AdminModerationState
  reason?: string | null
  note?: string | null
  updatedAt?: string | null
} {
  const moderation = asRecord(data.moderation)
  const rawState = asString(moderation?.state)
  const state: AdminModerationState =
    rawState === 'hidden' || rawState === 'suspended' ? rawState : 'visible'

  return {
    state,
    reason: asString(moderation?.reason),
    note: asString(moderation?.note),
    updatedAt: toIsoString(moderation?.updatedAt),
  }
}

async function countPendingRequestSource(source: PendingRequestSource): Promise<number> {
  try {
    let query = adminDb.collection(source.collection) as FirebaseFirestore.Query

    if (source.statusField && source.pendingValue) {
      query = query.where(source.statusField, '==', source.pendingValue)
    }

    const aggregate = await query.count().get()
    return aggregate.data().count
  } catch (error) {
    console.error('[countPendingRequestSource] failed', source.collection, error)
    return 0
  }
}

async function getPendingRequestCount(): Promise<number> {
  const counts = await Promise.all(PENDING_REQUEST_SOURCES.map(countPendingRequestSource))
  return counts.reduce((sum, count) => sum + count, 0)
}

async function getGroupsNameMap(groupIds: string[]): Promise<Map<string, string>> {
  const uniqueGroupIds = Array.from(new Set(groupIds.filter(Boolean)))
  if (uniqueGroupIds.length === 0) {
    return new Map()
  }

  const entries = await Promise.all(
    uniqueGroupIds.map(async (groupId) => {
      try {
        const doc = await adminDb.collection('groups').doc(groupId).get()
        const name = asString(doc.data()?.name)
        return [groupId, name ?? groupId] as const
      } catch {
        return [groupId, groupId] as const
      }
    })
  )

  return new Map(entries)
}

async function getUsersNameMap(userIds: string[]): Promise<Map<string, string>> {
  const uniqueUserIds = Array.from(new Set(userIds.filter(Boolean)))
  if (uniqueUserIds.length === 0) {
    return new Map()
  }

  const entries = await Promise.all(
    uniqueUserIds.map(async (uid) => {
      try {
        const doc = await adminDb.collection('usersPublic').doc(uid).get()
        const data = doc.data() as FirestoreRecord | undefined
        return [uid, userDisplayName(data ?? {}) || uid] as const
      } catch {
        return [uid, uid] as const
      }
    })
  )

  return new Map(entries)
}

function sortRequestsByCreatedAt(
  left: AdminPendingRequest,
  right: AdminPendingRequest
): number {
  return toSortTimestamp(right.createdAt) - toSortTimestamp(left.createdAt)
}

export async function getPendingAdminRequestStats(): Promise<AdminPendingRequestStats> {
  const [groupJoinPending, nucleoJoinPending, educatorPending, transitionPending] =
    await Promise.all(PENDING_REQUEST_SOURCES.map(countPendingRequestSource))

  return {
    totalPending: groupJoinPending + nucleoJoinPending + educatorPending + transitionPending,
    groupJoinPending,
    nucleoJoinPending,
    educatorPending,
    transitionPending,
  }
}

export async function getPendingAdminRequests(limitPerType = 40): Promise<AdminPendingRequest[]> {
  const [groupJoinSnap, nucleoSnap, educatorSnap, transitionSnap] = await Promise.all([
    adminDb
      .collection('group_requests')
      .where('status', '==', 'pending')
      .limit(limitPerType)
      .get()
      .catch(() => ({ docs: [] as FirebaseFirestore.QueryDocumentSnapshot[] })),
    adminDb
      .collection('nucleo_requests')
      .where('status', '==', 'pending')
      .limit(limitPerType)
      .get()
      .catch(() => ({ docs: [] as FirebaseFirestore.QueryDocumentSnapshot[] })),
    adminDb
      .collection('educatorRequests')
      .where('status', '==', 'pending')
      .limit(limitPerType)
      .get()
      .catch(() => ({ docs: [] as FirebaseFirestore.QueryDocumentSnapshot[] })),
    adminDb
      .collection('nucleo_transition_requests')
      .where('status', '==', 'pending')
      .limit(limitPerType)
      .get()
      .catch(() => ({ docs: [] as FirebaseFirestore.QueryDocumentSnapshot[] })),
  ])

  const groupIds = [
    ...groupJoinSnap.docs.map((doc) => asString((doc.data() as FirestoreRecord).groupId) ?? ''),
    ...nucleoSnap.docs.map((doc) => asString((doc.data() as FirestoreRecord).groupId) ?? ''),
    ...educatorSnap.docs.map((doc) => asString((doc.data() as FirestoreRecord).groupId) ?? ''),
    ...transitionSnap.docs.flatMap((doc) => {
      const data = doc.data() as FirestoreRecord
      return [asString(data.oldGroupId) ?? '', asString(data.newGroupId) ?? '']
    }),
  ]

  const transitionUserIds = transitionSnap.docs.map(
    (doc) => asString((doc.data() as FirestoreRecord).userId) ?? ''
  )

  const [groupNames, transitionUserNames] = await Promise.all([
    getGroupsNameMap(groupIds),
    getUsersNameMap(transitionUserIds),
  ])

  const groupJoinRequests = groupJoinSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const groupId = asString(data.groupId) ?? ''
    const transferCount = Array.isArray(data.nucleosToTransfer) ? data.nucleosToTransfer.length : 0

    return {
      id: doc.id,
      requestType: 'group_requests' as const,
      typeLabel: REQUEST_TYPE_LABELS.group_requests,
      requesterId: asString(data.userId) ?? '',
      requesterName: asString(data.userName) ?? asString(data.userId) ?? doc.id,
      subject: groupNames.get(groupId) ?? groupId ?? 'Grupo sin nombre',
      context:
        transferCount > 0
          ? `${transferCount} nucleos listos para transferir si se aprueba`
          : 'Solicitud directa de ingreso al grupo',
      createdAt: toIsoString(data.createdAt),
    }
  })

  const nucleoRequests = nucleoSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const groupId = asString(data.groupId) ?? ''
    const nucleoName = asString(data.nucleoName) ?? asString(data.nucleoId) ?? 'Nucleo'

    return {
      id: doc.id,
      requestType: 'nucleo_requests' as const,
      typeLabel: REQUEST_TYPE_LABELS.nucleo_requests,
      requesterId: asString(data.userId) ?? '',
      requesterName: asString(data.userName) ?? asString(data.userId) ?? doc.id,
      subject: nucleoName,
      context: `Grupo ${groupNames.get(groupId) ?? groupId}`,
      createdAt: toIsoString(data.createdAt),
    }
  })

  const educatorRequests = educatorSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const groupId = asString(data.groupId) ?? ''

    return {
      id: doc.id,
      requestType: 'educatorRequests' as const,
      typeLabel: REQUEST_TYPE_LABELS.educatorRequests,
      requesterId: asString(data.fromUserId) ?? '',
      requesterName: asString(data.fromUserName) ?? asString(data.fromUserId) ?? doc.id,
      subject: asString(data.toUserName) ?? asString(data.toUserId) ?? 'Educador',
      context: `Grupo ${groupNames.get(groupId) ?? groupId}`,
      createdAt: toIsoString(data.createdAt),
    }
  })

  const transitionRequests = transitionSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const oldGroupId = asString(data.oldGroupId) ?? ''
    const newGroupId = asString(data.newGroupId) ?? ''
    const requesterId = asString(data.userId) ?? ''
    const requesterName = transitionUserNames.get(requesterId) ?? requesterId ?? doc.id
    const educatorName = asString(data.educatorName) ?? asString(data.educatorId) ?? 'Educador'

    return {
      id: doc.id,
      requestType: 'nucleo_transition_requests' as const,
      typeLabel: REQUEST_TYPE_LABELS.nucleo_transition_requests,
      requesterId,
      requesterName,
      subject: asString(data.nucleoName) ?? 'Nucleo',
      context: `${groupNames.get(oldGroupId) ?? oldGroupId} -> ${groupNames.get(newGroupId) ?? newGroupId} · Educador ${educatorName}`,
      createdAt: toIsoString(data.createdAt),
    }
  })

  return [...groupJoinRequests, ...nucleoRequests, ...educatorRequests, ...transitionRequests].sort(
    sortRequestsByCreatedAt
  )
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const [usersSnap, groupsSnap, nucleosSnap, bugsSnap, pendingRequests] = await Promise.all([
    adminDb.collection('usersPublic').get().catch(() => ({ docs: [], size: 0 })),
    adminDb.collection('groups').get().catch(() => ({ docs: [], size: 0 })),
    adminDb.collectionGroup('nucleos').get().catch(() => ({ docs: [], size: 0 })),
    adminDb.collection('bugReports').where('status', '==', 'open').get().catch(() => ({ docs: [], size: 0 })),
    getPendingRequestCount(),
  ])

  const newUsersThisWeek = usersSnap.docs.filter((doc) => {
    const createdAt = toIsoString((doc.data() as FirestoreRecord).createdAt)
    if (!createdAt) return false
    return new Date(createdAt) >= weekAgo
  }).length

  return {
    totalUsers: usersSnap.size,
    totalGroups: groupsSnap.size,
    totalNucleos: nucleosSnap.size,
    openBugReports: bugsSnap.size,
    pendingRequests,
    newUsersThisWeek,
  }
}

export async function getAdminUsers(limit = 50): Promise<AdminUser[]> {
  const snap = await adminDb.collection('usersPublic').limit(limit).get()
  const adminAuth = getAuth(getApps()[0])

  return Promise.all(
    snap.docs.map(async (doc) => {
      const [privateDoc, authUser] = await Promise.allSettled([
        adminDb.collection('users').doc(doc.id).get(),
        adminAuth.getUser(doc.id),
      ])

      const publicData = doc.data() as FirestoreRecord
      const privateData =
        privateDoc.status === 'fulfilled' ? ((privateDoc.value.data() as FirestoreRecord | undefined) ?? {}) : {}

      const email = authUser.status === 'fulfilled' ? authUser.value.email : undefined
      const disabled = authUser.status === 'fulfilled' ? authUser.value.disabled : false
      const roleValue = asString(publicData.role) ?? asString(privateData.role) ?? 'student'
      const role = roleValue === 'educator' || roleValue === 'admin' ? roleValue : 'student'
      const adminPanelAccess =
        privateData.adminPanelAccess === true ||
        publicData.adminPanelAccess === true ||
        privateData.isAdmin === true ||
        publicData.isAdmin === true ||
        role === 'admin'

      return {
        uid: doc.id,
        email,
        disabled,
        name: asString(publicData.name) ?? asString(privateData.name) ?? '',
        surname: asString(publicData.surname) ?? asString(privateData.surname) ?? '',
        nickname: asString(publicData.nickname) ?? asString(privateData.nickname),
        role,
        groupId: asString(publicData.groupId) ?? asString(privateData.groupId),
        nucleoIds: asStringArray(publicData.nucleoIds ?? privateData.nucleoIds),
        graduationLevelId:
          asString(publicData.graduationLevelId) ?? asString(privateData.graduationLevelId),
        bio: asString(publicData.bio) ?? asString(privateData.bio),
        country: asString(publicData.country) ?? asString(privateData.country),
        avatarUrl: asString(publicData.avatarUrl) ?? asString(privateData.avatarUrl),
        socialLinks: (publicData.socialLinks ?? privateData.socialLinks ?? {}) as AdminUser['socialLinks'],
        setupComplete: publicData.setupComplete === true || privateData.setupComplete === true,
        adminPanelAccess,
        createdAt: toIsoString(publicData.createdAt ?? privateData.createdAt),
      }
    })
  )
}

export async function getAdminUserById(uid: string): Promise<AdminUser | null> {
  const [userDoc, publicDoc] = await Promise.all([
    adminDb.collection('users').doc(uid).get(),
    adminDb.collection('usersPublic').doc(uid).get(),
  ])

  if (!userDoc.exists && !publicDoc.exists) {
    return null
  }

  const adminAuth = getAuth(getApps()[0])
  const privateData = (userDoc.data() as FirestoreRecord | undefined) ?? {}
  const publicData = (publicDoc.data() as FirestoreRecord | undefined) ?? {}

  let email: string | undefined
  let disabled = false
  try {
    const authUser = await adminAuth.getUser(uid)
    email = authUser.email
    disabled = authUser.disabled
  } catch {}

  const roleValue = asString(publicData.role) ?? asString(privateData.role) ?? 'student'
  const role = roleValue === 'educator' || roleValue === 'admin' ? roleValue : 'student'
  const adminPanelAccess =
    privateData.adminPanelAccess === true ||
    publicData.adminPanelAccess === true ||
    privateData.isAdmin === true ||
    publicData.isAdmin === true ||
    role === 'admin'

  return {
    uid,
    email,
    disabled,
    name: asString(publicData.name) ?? asString(privateData.name) ?? '',
    surname: asString(publicData.surname) ?? asString(privateData.surname) ?? '',
    nickname: asString(publicData.nickname) ?? asString(privateData.nickname),
    role,
    groupId: asString(publicData.groupId) ?? asString(privateData.groupId),
    nucleoIds: asStringArray(publicData.nucleoIds ?? privateData.nucleoIds),
    graduationLevelId:
      asString(publicData.graduationLevelId) ?? asString(privateData.graduationLevelId),
    bio: asString(publicData.bio) ?? asString(privateData.bio),
    country: asString(publicData.country) ?? asString(privateData.country),
    avatarUrl: asString(publicData.avatarUrl) ?? asString(privateData.avatarUrl),
    socialLinks: (publicData.socialLinks ?? privateData.socialLinks ?? {}) as AdminUser['socialLinks'],
    setupComplete: publicData.setupComplete === true || privateData.setupComplete === true,
    adminPanelAccess,
    createdAt: toIsoString(publicData.createdAt ?? privateData.createdAt),
  }
}

export async function getAdminSubscriptions(limit = 250): Promise<{
  rows: AdminSubscriptionRow[]
  stats: AdminSubscriptionStats
}> {
  const usersSnap = await adminDb.collection('usersPublic').limit(limit).get()
  const adminAuth = getAuth(getApps()[0])
  const staleBefore = Date.now() - 1000 * 60 * 60 * 24 * 7

  const rows = await Promise.all(
    usersSnap.docs.map(async (doc): Promise<AdminSubscriptionRow> => {
      const [subscriptionDoc, authUser] = await Promise.allSettled([
        adminDb.collection('users').doc(doc.id).collection('subscription').doc('current').get(),
        adminAuth.getUser(doc.id),
      ])

      const publicData = doc.data() as FirestoreRecord
      const subscriptionData =
        subscriptionDoc.status === 'fulfilled'
          ? ((subscriptionDoc.value.data() as FirestoreRecord | undefined) ?? {})
          : {}
      const roleValue = asString(publicData.role) ?? 'student'
      const role = roleValue === 'educator' || roleValue === 'admin' ? roleValue : 'student'
      const plan = asString(subscriptionData.plan) === 'premium' ? 'premium' : 'free'

      return {
        uid: doc.id,
        email: authUser.status === 'fulfilled' ? authUser.value.email : undefined,
        name: userDisplayName(publicData) || doc.id,
        role,
        country: asString(publicData.country),
        groupId: asString(publicData.groupId),
        plan,
        isPremium: plan === 'premium',
        source: asString(subscriptionData.source),
        eventType: asString(subscriptionData.eventType),
        premiumSince: toIsoString(subscriptionData.premiumSince),
        expiresAt: toIsoString(subscriptionData.expiresAt),
        updatedAt: toIsoString(subscriptionData.updatedAt),
        lastVerifiedAt: toIsoString(subscriptionData.lastVerifiedAt),
      }
    })
  )

  const premiumUsers = rows.filter((row) => row.isPremium).length
  const lastVerifiedTimes = rows
    .map((row) => (row.lastVerifiedAt ? new Date(row.lastVerifiedAt).getTime() : 0))
    .filter((value) => Number.isFinite(value) && value > 0)
  const lastVerifiedAt =
    lastVerifiedTimes.length > 0 ? new Date(Math.max(...lastVerifiedTimes)).toISOString() : null
  const staleSubscriptions = rows.filter((row) => {
    if (!row.lastVerifiedAt) return true
    return new Date(row.lastVerifiedAt).getTime() < staleBefore
  }).length

  return {
    rows: rows.sort((left, right) => {
      if (left.isPremium !== right.isPremium) return left.isPremium ? -1 : 1
      return toSortTimestamp(right.lastVerifiedAt) - toSortTimestamp(left.lastVerifiedAt)
    }),
    stats: {
      totalUsers: rows.length,
      premiumUsers,
      freeUsers: rows.length - premiumUsers,
      staleSubscriptions,
      lastVerifiedAt,
    },
  }
}

export async function getAdminModerationEntities(limit = 500): Promise<{
  rows: AdminModerationEntity[]
  stats: AdminModerationStats
}> {
  const [usersSnap, groupsSnap, nucleosSnap, eventsSnap] = await Promise.all([
    adminDb.collection('usersPublic').limit(limit).get().catch(() => ({ docs: [] })),
    adminDb.collection('groups').limit(limit).get().catch(() => ({ docs: [] })),
    adminDb.collectionGroup('nucleos').limit(limit).get().catch(() => ({ docs: [] })),
    adminDb.collection('events').limit(limit).get().catch(() => ({ docs: [] })),
  ])

  const groups = groupsSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const moderation = getModerationState(data)
    return {
      id: doc.id,
      type: 'group' as const,
      label: asString(data.name) ?? doc.id,
      description: joinNonEmpty([asString(data.graduationSystemName), asString(data.city), asString(data.country)], ' - '),
      ...moderation,
    }
  })
  const groupNames = new Map(groups.map((group) => [group.id, group.label] as const))

  const users = usersSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const moderation = getModerationState(data)
    const groupId = asString(data.groupId)
    return {
      id: doc.id,
      type: 'user' as const,
      label: userDisplayName(data) || doc.id,
      description: joinNonEmpty([asString(data.role), asString(data.country), groupId ? groupNames.get(groupId) ?? groupId : undefined], ' - '),
      groupId,
      ...moderation,
    }
  })

  const nucleos = nucleosSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const groupId = doc.ref.parent.parent?.id ?? ''
    const moderation = getModerationState(data)
    return {
      id: doc.id,
      type: 'nucleo' as const,
      label: asString(data.name) ?? doc.id,
      description: joinNonEmpty([groupNames.get(groupId) ?? groupId, asString(data.city), asString(data.country)], ' - '),
      groupId,
      ...moderation,
    }
  })

  const events = eventsSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const moderation = getModerationState(data)
    const groupId = asString(data.groupId)
    return {
      id: doc.id,
      type: 'event' as const,
      label: asString(data.title) ?? doc.id,
      description: joinNonEmpty([asString(data.category), groupId ? groupNames.get(groupId) ?? groupId : undefined], ' - '),
      groupId,
      ...moderation,
    }
  })

  const rows = [...users, ...groups, ...nucleos, ...events].sort((left, right) => {
    if (left.state !== right.state) return left.state.localeCompare(right.state)
    return left.label.localeCompare(right.label)
  })

  return {
    rows,
    stats: {
      total: rows.length,
      visible: rows.filter((row) => row.state === 'visible').length,
      hidden: rows.filter((row) => row.state === 'hidden').length,
      suspended: rows.filter((row) => row.state === 'suspended').length,
    },
  }
}

export async function getAdminFeaturedContentRows(): Promise<AdminFeaturedContentRow[]> {
  const [options, featuredSnap] = await Promise.all([
    getAdminEntityOptions(),
    adminDb.collection('adminFeaturedContent').get().catch(() => ({ docs: [] })),
  ])
  const featuredByKey = new Map(
    featuredSnap.docs.map((doc) => [doc.id, doc.data() as FirestoreRecord] as const)
  )

  return options.map((option) => {
    const key = `${option.type}_${option.id}`
    const featured = featuredByKey.get(key)
    return {
      id: key,
      entityId: option.id,
      entityType: option.type,
      label: option.label,
      description: option.description,
      groupId: option.groupId,
      active: featured?.active === true,
      order: asNumber(featured?.order) ?? 999,
      updatedAt: toIsoString(featured?.updatedAt),
    }
  }).sort((left, right) => {
    if (left.active !== right.active) return left.active ? -1 : 1
    return left.order - right.order || left.label.localeCompare(right.label)
  })
}

export async function getAdminEvents(limit = 50): Promise<AdminEvent[]> {
  const snap = await adminDb.collection('events').limit(limit).get()

  return snap.docs
    .map((doc) => {
      const data = doc.data() as FirestoreRecord
      return {
        id: doc.id,
        title: asString(data.title),
        description: asString(data.description),
        startDate: toIsoString(data.startDate),
        endDate: toIsoString(data.endDate),
        category: asString(data.category),
        groupId: asString(data.groupId),
        createdBy: asString(data.createdBy) ?? '',
        goingCount: asNumber(data.goingCount) ?? 0,
        interestedCount: asNumber(data.interestedCount) ?? 0,
        locations: mapEventLocations(data.locations),
        coOrganizerIds: asStringArray(data.coOrganizerIds),
        showOrganizerGroups: asBoolean(data.showOrganizerGroups) ?? true,
        posterUrls: asStringArray(data.posterUrls),
        recurrence: asString(data.recurrence),
        recurrenceEndDate: toIsoString(data.recurrenceEndDate),
        price: asNumber(data.price) ?? 0,
        currency: asString(data.currency),
        paymentMethods: mapEventPaymentMethods(data.paymentMethods),
        createdAt: toIsoString(data.createdAt),
        updatedAt: toIsoString(data.updatedAt),
      }
    })
    .sort((left, right) => toSortTimestamp(right.startDate) - toSortTimestamp(left.startDate))
}

export async function getAdminEventById(id: string): Promise<AdminEvent | null> {
  const doc = await adminDb.collection('events').doc(id).get()
  if (!doc.exists) return null

  const data = doc.data() as FirestoreRecord
  return {
    id: doc.id,
    title: asString(data.title),
    description: asString(data.description),
    startDate: toIsoString(data.startDate),
    endDate: toIsoString(data.endDate),
    category: asString(data.category),
    groupId: asString(data.groupId),
    createdBy: asString(data.createdBy) ?? '',
    goingCount: asNumber(data.goingCount) ?? 0,
    interestedCount: asNumber(data.interestedCount) ?? 0,
    locations: mapEventLocations(data.locations),
    coOrganizerIds: asStringArray(data.coOrganizerIds),
    showOrganizerGroups: asBoolean(data.showOrganizerGroups) ?? true,
    posterUrls: asStringArray(data.posterUrls),
    recurrence: asString(data.recurrence),
    recurrenceEndDate: toIsoString(data.recurrenceEndDate),
    price: asNumber(data.price) ?? 0,
    currency: asString(data.currency),
    paymentMethods: mapEventPaymentMethods(data.paymentMethods),
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  }
}

export async function getAdminEntityOptions(): Promise<AdminEntityOption[]> {
  const [usersSnap, groupsSnap, nucleosSnap, eventsSnap] = await Promise.all([
    adminDb.collection('usersPublic').limit(500).get().catch(() => ({ docs: [] })),
    adminDb.collection('groups').get().catch(() => ({ docs: [] })),
    adminDb.collectionGroup('nucleos').get().catch(() => ({ docs: [] })),
    adminDb.collection('events').limit(300).get().catch(() => ({ docs: [] })),
  ])

  const groups = groupsSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const label = asString(data.name) ?? doc.id
    return {
      id: doc.id,
      type: 'group' as const,
      label,
      description: joinNonEmpty(
        [asString(data.graduationSystemName), asStringArray(data.representedCountries)?.join(', ')],
        ' - '
      ),
    }
  })

  const groupNames = new Map(groups.map((group) => [group.id, group.label] as const))

  const users = usersSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const groupId = asString(data.groupId) ?? undefined
    const role = asString(data.role)
    return {
      id: doc.id,
      type: 'user' as const,
      label: userDisplayName(data) || doc.id,
      description: joinNonEmpty([role, groupId ? groupNames.get(groupId) ?? groupId : undefined], ' - '),
      groupId,
    }
  })

  const nucleos = nucleosSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const groupId = doc.ref.parent.parent?.id ?? ''
    const groupName = groupNames.get(groupId) ?? groupId
    return {
      id: doc.id,
      type: 'nucleo' as const,
      label: asString(data.name) ?? doc.id,
      description: joinNonEmpty([groupName, asString(data.city), asString(data.country)], ' - '),
      groupId,
    }
  })

  const events = eventsSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const groupId = asString(data.groupId) ?? undefined
    return {
      id: doc.id,
      type: 'event' as const,
      label: asString(data.title) ?? doc.id,
      description: joinNonEmpty([asString(data.category), groupId ? groupNames.get(groupId) ?? groupId : undefined], ' - '),
      groupId,
    }
  })

  return [...users, ...groups, ...nucleos, ...events].sort((left, right) =>
    left.label.localeCompare(right.label)
  )
}

export async function getBugReports(limit = 100): Promise<BugReport[]> {
  const snap = await adminDb.collection('bugReports').limit(limit).get()

  return snap.docs
    .map((doc) => {
      const data = doc.data() as FirestoreRecord
      return {
        id: doc.id,
        userId: asString(data.userId) ?? '',
        userEmail: asString(data.userEmail) ?? '',
        appVersion: asString(data.appVersion) ?? '',
        platform: (asString(data.platform) === 'ios' ? 'ios' : 'android') as 'ios' | 'android',
        description: asString(data.description) ?? '',
        screenshotUrl: asString(data.screenshotUrl),
        status: (asString(data.status) as BugReport['status']) ?? 'open',
        adminNote: asString(data.adminNote),
        createdAt: toIsoString(data.createdAt),
        updatedAt: toIsoString(data.updatedAt),
      }
    })
    .sort((left, right) => toSortTimestamp(right.createdAt) - toSortTimestamp(left.createdAt))
}

export async function getBugReportById(id: string): Promise<BugReport | null> {
  const doc = await adminDb.collection('bugReports').doc(id).get()
  if (!doc.exists) return null

  const data = doc.data() as FirestoreRecord
  return {
    id: doc.id,
    userId: asString(data.userId) ?? '',
    userEmail: asString(data.userEmail) ?? '',
    appVersion: asString(data.appVersion) ?? '',
    platform: (asString(data.platform) === 'ios' ? 'ios' : 'android') as 'ios' | 'android',
    description: asString(data.description) ?? '',
    screenshotUrl: asString(data.screenshotUrl),
    status: (asString(data.status) as BugReport['status']) ?? 'open',
    adminNote: asString(data.adminNote),
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  }
}

export async function getAdminNucleos(): Promise<AdminNucleo[]> {
  const [nucleosSnap, groupsSnap] = await Promise.all([
    adminDb.collectionGroup('nucleos').get(),
    adminDb.collection('groups').get(),
  ])

  const groupNames = new Map(
    groupsSnap.docs.map((doc) => [doc.id, asString(doc.data().name) ?? doc.id] as const)
  )

  return nucleosSnap.docs
    .map((doc) => {
      const groupId = doc.ref.parent.parent?.id ?? ''
      const groupName = groupNames.get(groupId) ?? groupId
      return mapAdminNucleo(groupId, groupName, doc.id, doc.data() as FirestoreRecord)
    })
    .sort((left, right) => left.name.localeCompare(right.name))
}

export async function getAdminNucleoById(
  groupId: string,
  nucleoId: string
): Promise<AdminNucleo | null> {
  const [groupDoc, nucleoDoc] = await Promise.all([
    adminDb.collection('groups').doc(groupId).get(),
    adminDb.collection('groups').doc(groupId).collection('nucleos').doc(nucleoId).get(),
  ])

  if (!groupDoc.exists || !nucleoDoc.exists) {
    return null
  }

  const groupName = asString(groupDoc.data()?.name) ?? groupId
  return mapAdminNucleo(groupId, groupName, nucleoDoc.id, nucleoDoc.data() as FirestoreRecord)
}

export async function getAdminGraduationRows(): Promise<AdminGraduationLevelRow[]> {
  const [groupsSnap, levelsSnap, usersSnap] = await Promise.all([
    adminDb.collection('groups').get().catch(() => ({ docs: [] })),
    adminDb.collectionGroup('graduationLevels').get().catch(() => ({ docs: [] })),
    adminDb.collection('usersPublic').get().catch(() => ({ docs: [] })),
  ])

  const groupNames = new Map(
    groupsSnap.docs.map((doc) => [doc.id, asString(doc.data().name) ?? doc.id] as const)
  )
  const membersByGroupLevel = new Map<string, number>()
  usersSnap.docs.forEach((doc) => {
    const data = doc.data() as FirestoreRecord
    const groupId = asString(data.groupId)
    const levelId = asString(data.graduationLevelId)
    if (!groupId || !levelId) return
    const key = `${groupId}:${levelId}`
    membersByGroupLevel.set(key, (membersByGroupLevel.get(key) ?? 0) + 1)
  })

  return levelsSnap.docs
    .map((doc) => {
      const data = doc.data() as FirestoreRecord
      const groupId = doc.ref.parent.parent?.id ?? ''
      const colors = Array.isArray(data.colors)
        ? data.colors.filter((color): color is string => typeof color === 'string')
        : []
      return {
        id: doc.id,
        groupId,
        groupName: groupNames.get(groupId) ?? groupId,
        name: asString(data.name) ?? doc.id,
        order: asNumber(data.order) ?? 0,
        colors,
        category: asString(data.category),
        isEducator: asBoolean(data.isEducator) ?? false,
        isSpecial: asBoolean(data.isSpecial) ?? false,
        memberCount: membersByGroupLevel.get(`${groupId}:${doc.id}`) ?? 0,
      }
    })
    .sort((left, right) => left.groupName.localeCompare(right.groupName) || left.order - right.order)
}

export async function getAdminAttendanceRows(limit = 250): Promise<AdminAttendanceSessionRow[]> {
  const [sessionsSnap, groupsSnap, nucleosSnap] = await Promise.all([
    adminDb.collectionGroup('sessions').limit(limit).get().catch(() => ({ docs: [] })),
    adminDb.collection('groups').get().catch(() => ({ docs: [] })),
    adminDb.collectionGroup('nucleos').get().catch(() => ({ docs: [] })),
  ])

  const groupNames = new Map(
    groupsSnap.docs.map((doc) => [doc.id, asString(doc.data().name) ?? doc.id] as const)
  )
  const nucleoNames = new Map(
    nucleosSnap.docs.map((doc) => {
      const groupId = doc.ref.parent.parent?.id ?? ''
      return [`${groupId}:${doc.id}`, asString(doc.data().name) ?? doc.id] as const
    })
  )

  return sessionsSnap.docs
    .map((doc) => {
      const data = doc.data() as FirestoreRecord
      const nucleoRef = doc.ref.parent.parent
      const groupId = nucleoRef?.parent.parent?.id ?? ''
      const nucleoId = nucleoRef?.id ?? ''
      return {
        id: doc.id,
        groupId,
        groupName: groupNames.get(groupId) ?? groupId,
        nucleoId,
        nucleoName: nucleoNames.get(`${groupId}:${nucleoId}`) ?? nucleoId,
        date: toIsoString(data.date),
        attendees: Array.isArray(data.attendees) ? data.attendees.length : 0,
        absentees: Array.isArray(data.absentees) ? data.absentees.length : 0,
        createdBy: asString(data.createdBy) ?? '',
      }
    })
    .sort((left, right) => toSortTimestamp(right.date) - toSortTimestamp(left.date))
}

export async function getAdminClassPaymentRows(limit = 300): Promise<AdminClassPaymentRow[]> {
  const [paymentsSnap, groupsSnap, nucleosSnap] = await Promise.all([
    adminDb.collectionGroup('payments').limit(limit).get().catch(() => ({ docs: [] })),
    adminDb.collection('groups').get().catch(() => ({ docs: [] })),
    adminDb.collectionGroup('nucleos').get().catch(() => ({ docs: [] })),
  ])

  const groupNames = new Map(
    groupsSnap.docs.map((doc) => [doc.id, asString(doc.data().name) ?? doc.id] as const)
  )
  const nucleoNames = new Map(
    nucleosSnap.docs.map((doc) => {
      const groupId = doc.ref.parent.parent?.id ?? ''
      return [`${groupId}:${doc.id}`, asString(doc.data().name) ?? doc.id] as const
    })
  )

  return paymentsSnap.docs
    .map((doc) => {
      const data = doc.data() as FirestoreRecord
      const nucleoRef = doc.ref.parent.parent
      const groupId = nucleoRef?.parent.parent?.id ?? ''
      const nucleoId = nucleoRef?.id ?? ''
      const rawStatus = asString(data.status)
      const status: AdminClassPaymentRow['status'] =
        rawStatus === 'paid' || rawStatus === 'free' ? rawStatus : 'pending'
      return {
        id: doc.id,
        groupId,
        groupName: groupNames.get(groupId) ?? groupId,
        nucleoId,
        nucleoName: nucleoNames.get(`${groupId}:${nucleoId}`) ?? nucleoId,
        userId: asString(data.userId) ?? '',
        month: asString(data.month) ?? '',
        status,
        amount: asNumber(data.amount),
        billingMode: asString(data.billingMode),
        reportedByStudent: asBoolean(data.reportedByStudent) ?? false,
        confirmedByEducator: asBoolean(data.confirmedByEducator) ?? false,
        updatedAt: toIsoString(data.updatedAt),
      }
    })
    .sort((left, right) => left.month.localeCompare(right.month) * -1)
}

export async function getAdminOperationJobs(collectionName: 'adminNotificationCampaigns' | 'adminExportJobs'): Promise<AdminOperationJobRow[]> {
  const snap = await adminDb.collection(collectionName).limit(200).get().catch(() => ({ docs: [] }))
  return snap.docs
    .map((doc) => {
      const data = doc.data() as FirestoreRecord
      return {
        id: doc.id,
        title: asString(data.title) ?? asString(data.name) ?? doc.id,
        status: asString(data.status) ?? 'draft',
        type: asString(data.type),
        createdBy: asString(data.createdBy),
        createdAt: toIsoString(data.createdAt),
        updatedAt: toIsoString(data.updatedAt),
        metadata: asRecord(data.metadata) ?? {},
      }
    })
    .sort((left, right) => toSortTimestamp(right.createdAt) - toSortTimestamp(left.createdAt))
}

export async function getAdminFinanceSnapshotRows(): Promise<AdminFinanceSnapshotRow[]> {
  const [snapshotsSnap, manualCostsSnap] = await Promise.all([
    adminDb.collection('adminFinanceSnapshots').get().catch(() => ({ docs: [] })),
    adminDb.collection('adminFinanceManualCosts').get().catch(() => ({ docs: [] })),
  ])

  const snapshots = snapshotsSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    const kind = asString(data.kind)
    return {
      id: doc.id,
      provider: asString(data.provider) ?? doc.id,
      kind: kind === 'cost' ? 'cost' as const : 'income' as const,
      amount: asNumber(data.amount) ?? 0,
      currency: asString(data.currency) ?? 'USD',
      period: asString(data.period) ?? '',
      status: asString(data.status) ?? 'stale',
      updatedAt: toIsoString(data.updatedAt),
      source: asString(data.source),
    }
  })

  const manualCosts = manualCostsSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    return {
      id: doc.id,
      provider: asString(data.provider) ?? 'Manual',
      kind: 'cost' as const,
      amount: asNumber(data.amount) ?? 0,
      currency: asString(data.currency) ?? 'USD',
      period: asString(data.period) ?? '',
      status: 'manual',
      updatedAt: toIsoString(data.updatedAt ?? data.createdAt),
      source: 'manual',
    }
  })

  return [...snapshots, ...manualCosts].sort((left, right) => left.provider.localeCompare(right.provider))
}

export async function getAdminGroupsForExport(): Promise<Array<{
  id: string
  name: string
  country: string | null
  memberCount: number
  nucleoCount: number
}>> {
  const [groupsSnap, usersSnap, nucleosSnap] = await Promise.all([
    adminDb.collection('groups').get().catch(() => ({ docs: [] })),
    adminDb.collection('usersPublic').get().catch(() => ({ docs: [] })),
    adminDb.collectionGroup('nucleos').get().catch(() => ({ docs: [] })),
  ])

  const membersByGroup = new Map<string, number>()
  usersSnap.docs.forEach((doc) => {
    const groupId = asString((doc.data() as FirestoreRecord).groupId)
    if (groupId) membersByGroup.set(groupId, (membersByGroup.get(groupId) ?? 0) + 1)
  })

  const nucleosByGroup = new Map<string, number>()
  nucleosSnap.docs.forEach((doc) => {
    const groupId = doc.ref.parent.parent?.id ?? ''
    if (groupId) nucleosByGroup.set(groupId, (nucleosByGroup.get(groupId) ?? 0) + 1)
  })

  return groupsSnap.docs.map((doc) => {
    const data = doc.data() as FirestoreRecord
    return {
      id: doc.id,
      name: asString(data.name) ?? doc.id,
      country: asString(data.country),
      memberCount: membersByGroup.get(doc.id) ?? 0,
      nucleoCount: nucleosByGroup.get(doc.id) ?? 0,
    }
  })
}

export async function getAdminUsersForExport(limit = 2000): Promise<Array<{
  uid: string
  name: string
  email: string
  role: string
  country: string | null
  groupId: string | null
  plan: string
  createdAt: string | null
}>> {
  const adminAuth = getAuth(getApps()[0])
  const snap = await adminDb.collection('usersPublic').limit(limit).get()

  return Promise.all(
    snap.docs.map(async (doc) => {
      const data = doc.data() as FirestoreRecord
      const [subscriptionDoc, authUser] = await Promise.allSettled([
        adminDb.collection('users').doc(doc.id).collection('subscription').doc('current').get(),
        adminAuth.getUser(doc.id),
      ])
      const subscriptionData =
        subscriptionDoc.status === 'fulfilled'
          ? ((subscriptionDoc.value.data() as FirestoreRecord | undefined) ?? {})
          : {}
      const email = authUser.status === 'fulfilled' ? (authUser.value.email ?? '') : ''
      const plan = asString(subscriptionData.plan) === 'premium' ? 'premium' : 'free'

      return {
        uid: doc.id,
        name: userDisplayName(data) || doc.id,
        email,
        role: asString(data.role) ?? 'student',
        country: asString(data.country),
        groupId: asString(data.groupId),
        plan,
        createdAt: toIsoString(data.createdAt),
      }
    })
  )
}
