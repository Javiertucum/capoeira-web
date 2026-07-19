import { NextRequest, NextResponse } from 'next/server'
import { createSessionCookie, SESSION_COOKIE, verifyAdminIdToken } from '@/lib/auth/session'
import { posthogServer } from '@/lib/posthog-server'

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()
    if (!idToken) {
      return NextResponse.json({ error: 'idToken requerido' }, { status: 400 })
    }

    const adminUid = await verifyAdminIdToken(idToken)
    const sessionCookie = await createSessionCookie(idToken)

    posthogServer.capture({
      distinctId: adminUid,
      event: 'admin_session_created',
    })

    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[login/route] error:', error)

    if (error instanceof Error && error.message === 'Not admin') {
      return NextResponse.json({ error: 'Not admin' }, { status: 403 })
    }

    return NextResponse.json({ error: 'Credenciales invalidas' }, { status: 401 })
  }
}
