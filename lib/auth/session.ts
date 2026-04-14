import { getAuth } from 'firebase-admin/auth'
import { getApps } from 'firebase-admin/app'
import { cookies } from 'next/headers'

const SESSION_COOKIE = '__session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 1 semana

/** Crea session cookie a partir de un ID token de Firebase */
export async function createSessionCookie(idToken: string): Promise<string> {
  const adminAuth = getAuth(getApps()[0])
  return adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION_MS,
  })
}

/** Verifica la session cookie y devuelve el UID. Lanza si inválida. */
export async function verifySessionCookie(cookie: string): Promise<string> {
  const adminAuth = getAuth(getApps()[0])
  const decoded = await adminAuth.verifySessionCookie(cookie, true)
  const adminUid = process.env.ADMIN_UID!
  if (decoded.uid !== adminUid) throw new Error('Not admin')
  return decoded.uid
}

/** Lee la session cookie del request actual (server-side) */
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
