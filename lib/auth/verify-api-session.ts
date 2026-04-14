import { NextRequest, NextResponse } from 'next/server'
import { verifySessionCookie, SESSION_COOKIE } from './session'

export async function requireAdmin(
  request: NextRequest
): Promise<{ uid: string } | NextResponse> {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value
  if (!cookie) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }
  try {
    const uid = await verifySessionCookie(cookie)
    return { uid }
  } catch (error) {
    console.error('[requireAdmin] session verification failed', error)
    return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
  }
}
