import { adminDb } from './firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { getApps } from 'firebase-admin/app'

export interface AdminUser {
  uid: string
  email: string | undefined
  disabled: boolean
  name: string
  surname: string
  nickname?: string | null
  role: 'student' | 'educator'
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
  createdAt?: string
}

export interface AdminEvent {
  id: string
  title?: string | null
  startDate: string
  endDate?: string | null
  category?: string | null
  groupId?: string | null
  createdBy: string
  goingCount?: number
  interestedCount?: number
  createdAt?: string
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
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalUsers: number
  totalGroups: number
  totalNucleos: number
  openBugReports: number
  newUsersThisWeek: number
}

/** Stats para el dashboard */
export async function getDashboardStats(): Promise<DashboardStats> {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  // Use a try-catch for each part to handle missing collections
  const [usersSnap, groupsSnap, nucleosSnap, bugsSnap] = await Promise.all([
    adminDb.collection('usersPublic').get().catch(() => ({ docs: [], size: 0 })),
    adminDb.collection('groups').get().catch(() => ({ docs: [], size: 0 })),
    adminDb.collectionGroup('nucleos').get().catch(() => ({ docs: [], size: 0 })),
    adminDb.collection('bugReports').where('status', '==', 'open').get().catch(() => ({ docs: [], size: 0 })),
  ])

  const newUsersThisWeek = usersSnap.docs.filter(d => {
    const data = d.data() as any
    const createdAt = data.createdAt?.toDate?.()
    return createdAt && createdAt >= weekAgo
  }).length

  return {
    totalUsers:      usersSnap.size,
    totalGroups:     groupsSnap.size,
    totalNucleos:    nucleosSnap.size,
    openBugReports:  bugsSnap.size,
    newUsersThisWeek,
  }
}

/** Lista de usuarios (lee de usersPublic + Firebase Auth) */
export async function getAdminUsers(limit = 50): Promise<AdminUser[]> {
  const snap = await adminDb.collection('usersPublic').limit(limit).get()
  const adminAuth = getAuth(getApps()[0])

  return Promise.all(snap.docs.map(async doc => {
    const data = doc.data() as any
    let email: string | undefined
    let disabled = false
    try {
      const authUser = await adminAuth.getUser(doc.id)
      email    = authUser.email
      disabled = authUser.disabled
    } catch {}
    return {
      uid:      doc.id,
      email,
      disabled,
      name:     data.name ?? '',
      surname:  data.surname ?? '',
      nickname: data.nickname ?? null,
      role:     data.role ?? 'student',
      groupId:  data.groupId ?? null,
      nucleoIds: data.nucleoIds ?? [],
      graduationLevelId: data.graduationLevelId ?? null,
      bio:      data.bio ?? null,
      country:  data.country ?? null,
      avatarUrl: data.avatarUrl ?? null,
      socialLinks: data.socialLinks ?? {},
      setupComplete: data.setupComplete ?? false,
    } satisfies AdminUser
  }))
}

/** Perfil completo de un usuario (para edición) */
export async function getAdminUserById(uid: string): Promise<AdminUser | null> {
  const [userDoc, publicDoc] = await Promise.all([
    adminDb.collection('users').doc(uid).get(),
    adminDb.collection('usersPublic').doc(uid).get(),
  ])
  if (!userDoc.exists && !publicDoc.exists) return null

  const adminAuth = getAuth(getApps()[0])
  let email: string | undefined
  let disabled = false
  try {
    const authUser = await adminAuth.getUser(uid)
    email    = authUser.email
    disabled = authUser.disabled
  } catch {}

  const data = { ...(publicDoc.data() || {}), ...(userDoc.data() || {}) } as any
  return {
    uid,
    email,
    disabled,
    name:     data.name ?? '',
    surname:  data.surname ?? '',
    nickname: data.nickname ?? null,
    role:     data.role ?? 'student',
    groupId:  data.groupId ?? null,
    nucleoIds: data.nucleoIds ?? [],
    graduationLevelId: data.graduationLevelId ?? null,
    bio:      data.bio ?? null,
    country:  data.country ?? null,
    avatarUrl: data.avatarUrl ?? null,
    socialLinks: data.socialLinks ?? {},
    setupComplete: data.setupComplete ?? false,
  } satisfies AdminUser
}

/** Lista de eventos */
export async function getAdminEvents(limit = 50): Promise<AdminEvent[]> {
  const snap = await adminDb.collection('events').orderBy('startDate', 'desc').limit(limit).get()
  return snap.docs.map(doc => {
    const data = doc.data() as any
    return {
      id:             doc.id,
      title:          data.title ?? null,
      startDate:      data.startDate?.toDate?.()?.toISOString() ?? '',
      endDate:        data.endDate?.toDate?.()?.toISOString() ?? null,
      category:       data.category ?? null,
      groupId:        data.groupId ?? null,
      createdBy:      data.createdBy ?? '',
      goingCount:     data.goingCount ?? 0,
      interestedCount: data.interestedCount ?? 0,
    }
  })
}

/** Lista de bug reports */
export async function getBugReports(): Promise<BugReport[]> {
  const snap = await adminDb.collection('bugReports').orderBy('createdAt', 'desc').limit(100).get()
  return snap.docs.map(doc => {
    const data = doc.data() as any
    return {
      id:           doc.id,
      userId:       data.userId ?? '',
      userEmail:    data.userEmail ?? '',
      appVersion:   data.appVersion ?? '',
      platform:     data.platform ?? 'android',
      description:  data.description ?? '',
      screenshotUrl: data.screenshotUrl ?? null,
      status:       data.status ?? 'open',
      adminNote:    data.adminNote ?? null,
      createdAt:    data.createdAt?.toDate?.()?.toISOString() ?? '',
      updatedAt:    data.updatedAt?.toDate?.()?.toISOString() ?? '',
    }
  })
}
