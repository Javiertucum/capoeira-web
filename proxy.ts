import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE } from './lib/auth/session'
import { DEFAULT_SITE_URL } from './lib/site'

const intlMiddleware = createMiddleware(routing)
const canonicalHost = new URL(DEFAULT_SITE_URL).host

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host')

  if (host === 'agendacapoeiragem.com') {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    url.host = canonicalHost
    return NextResponse.redirect(url, 308)
  }

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
  matcher: ['/((?!api|trpc|_next|_vercel|og|.*\\..*).*)'],
}
