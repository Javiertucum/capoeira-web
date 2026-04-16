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
  newUsersThisWeek: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const [usersSnap, groupsSnap, nucleosSnap, bugsSnap] = await Promise.all([
    adminDb.collection('usersPublic').get().catch(() => ({ docs: [], size: 0 })),
    adminDb.collection('groups').get().catch(() => ({ docs: [], size: 0 })),
    adminDb.collectionGroup('nucleos').get().catch(() => ({ docs: [], size: 0 })),
    adminDb.collection('bugReports').where('status', '==', 'open').get().catch(() => ({ docs: [], size: 0 })),
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
