import { getAuth } from 'firebase-admin/auth'
import { cookies } from 'next/headers'
import { adminApp } from '@/lib/firebase-admin'
import { hasAdminAccess } from './admin-access'

const SESSION_COOKIE = '__session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

export async function createSessionCookie(idToken: string): Promise<string> {
  const adminAuth = getAuth(adminApp)
  return adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION_MS,
  })
}

export async function verifyAdminIdToken(idToken: string): Promise<string> {
  const adminAuth = getAuth(adminApp)
  const decoded = await adminAuth.verifyIdToken(idToken, true)
  const allowed = await hasAdminAccess(decoded.uid)

  if (!allowed) {
    throw new Error('Not admin')
  }

  return decoded.uid
}

export async function verifySessionCookie(cookie: string): Promise<string> {
  const adminAuth = getAuth(adminApp)
  const decoded = await adminAuth.verifySessionCookie(cookie, true)
  const allowed = await hasAdminAccess(decoded.uid)

  if (!allowed) {
    throw new Error('Not admin')
  }

  return decoded.uid
}

export async function getSessionUid(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(SESSION_COOKIE)?.value
    if (!cookie) return null
    return await verifySessionCookie(cookie)
  } catch {
    return null
  }
}

export { SESSION_COOKIE }
