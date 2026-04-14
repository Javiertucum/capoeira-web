import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE } from './lib/auth/session'

const intlMiddleware = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes (except login)
  const isAdminPath = pathname.match(/\/[a-z]{2}\/admin/) !== null
  const isLoginPath = pathname.includes('/admin/login')

  if (isAdminPath && !isLoginPath) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
    if (!sessionCookie) {
      const locale = pathname.split('/')[1] || 'es'
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url))
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
}
