import 'server-only'

import { adminDb } from '@/lib/firebase-admin'

function getConfiguredAdminUids() {
  const values = [process.env.ADMIN_UID, process.env.ADMIN_UIDS]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean)

  return new Set(values)
}

function hasAdminFlag(data: Record<string, unknown> | undefined) {
  if (!data) return false

  return (
    data.adminPanelAccess === true ||
    data.isAdmin === true ||
    data.role === 'admin'
  )
}

export async function hasAdminAccess(uid: string): Promise<boolean> {
  if (!uid) return false

  const configuredAdmins = getConfiguredAdminUids()
  if (configuredAdmins.has(uid)) {
    return true
  }

  const [userDoc, publicDoc, adminGroupSnap, coAdminGroupSnap] = await Promise.allSettled([
    adminDb.collection('users').doc(uid).get(),
    adminDb.collection('usersPublic').doc(uid).get(),
    adminDb.collection('groups').where('adminUserIds', 'array-contains', uid).limit(1).get(),
    adminDb.collection('groups').where('coAdminIds', 'array-contains', uid).limit(1).get(),
  ])

  if (userDoc.status === 'fulfilled' && hasAdminFlag(userDoc.value.data() as Record<string, unknown> | undefined)) {
    return true
  }

  if (publicDoc.status === 'fulfilled' && hasAdminFlag(publicDoc.value.data() as Record<string, unknown> | undefined)) {
    return true
  }

  if (adminGroupSnap.status === 'fulfilled' && !adminGroupSnap.value.empty) {
    return true
  }

  if (coAdminGroupSnap.status === 'fulfilled' && !coAdminGroupSnap.value.empty) {
    return true
  }

  return false
}
