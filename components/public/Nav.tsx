'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useEffectEvent, useState } from 'react'
import { routing } from '@/i18n/routing'

const LOCALES = routing.locales

type Locale = (typeof routing.locales)[number]

function getLocalizedPathname(pathname: string, nextLocale: Locale) {
  const segments = pathname.split('/')

  if (segments.length > 1 && LOCALES.includes(segments[1] as Locale)) {
    segments[1] = nextLocale
    return segments.join('/')
  }

  return `/${nextLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

export default function Nav() {
  const t = useTranslations('nav')
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const syncScrollState = useEffectEvent(() => {
    setScrolled(window.scrollY > 8)
  })

  useEffect(() => {
    syncScrollState()
    window.addEventListener('scroll', syncScrollState, { passive: true })
    return () => window.removeEventListener('scroll', syncScrollState)
  }, [syncScrollState])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  function switchLocale(nextLocale: Locale) {
    const nextPathname = getLocalizedPathname(pathname, nextLocale)
    const search = searchParams.toString()
    router.replace(search ? `${nextPathname}?${search}` : nextPathname)
  }

  const currentFilter = searchParams.get('filter')
  const links = [
    { href: `/${locale}/map`, label: t('map'), key: 'nucleos' },
    { href: `/${locale}/map?filter=groups`, label: t('groups'), key: 'groups' },
    { href: `/${locale}/educators`, label: t('educators'), key: 'educators' },
    { href: `/${locale}/app`, label: 'App', key: 'app' },
  ]

  function isActive(key: string) {
    if (key === 'educators') return pathname === `/${locale}/educators` || pathname.startsWith(`/${locale}/educator/`)
    if (key === 'app') return pathname === `/${locale}/app`
    const isMapRoute = pathname === `/${locale}/map`
    if (key === 'nucleos') return isMapRoute && !currentFilter
    return isMapRoute && currentFilter === key
  }

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${
          scrolled || menuOpen
            ? 'border-border bg-[color-mix(in_srgb,#F4EFE6_94%,transparent)] backdrop-blur-lg'
            : 'border-border-soft bg-[color-mix(in_srgb,#F4EFE6_88%,transparent)] backdrop-blur-md'
        }`}
      >
        <div className="page-shell flex h-[72px] items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex min-w-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-text text-bg text-[15px]"
              style={{ fontFamily: 'var(--font-display)', lineHeight: 1 }}
            >
              a<span style={{ color: 'var(--accent)', marginLeft: '-1px' }}>·</span>c
            </span>
            <span className="min-w-0 hidden sm:block">
              <span
                className="block text-[9px] uppercase tracking-[0.18em] text-text-muted"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Capoeira Directory
              </span>
              <span
                className="block text-[16px] text-text"
                style={{ fontFamily: 'var(--font-display)', lineHeight: 1.1 }}
              >
                Agenda Capoeiragem
              </span>
            </span>
          </Link>

          {/* Desktop pill nav */}
          <div className="hidden items-center lg:flex rounded-full border border-border bg-card px-1 py-1 gap-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                  isActive(link.key)
                    ? 'bg-text text-bg'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: locale switcher + hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden rounded-full border border-border bg-card px-1 py-1 sm:flex">
              {LOCALES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => switchLocale(item)}
                  className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                    item === locale ? 'bg-text text-bg' : 'text-text-muted hover:text-text'
                  }`}
                  style={{ fontFamily: 'var(--font-mono)' }}
                  aria-pressed={item === locale}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg lg:hidden"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 top-0.5 h-px w-5 bg-current transition-all ${
                    menuOpen ? 'translate-y-[6px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity ${
                    menuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-[13px] h-px w-5 bg-current transition-all ${
                    menuOpen ? '-translate-y-[6px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-[rgba(26,24,20,0.25)] xl:hidden"
          />

          <div className="fixed inset-x-4 top-[84px] z-50 rounded-[26px] border border-border bg-bg p-5 shadow-[var(--shadow-lg)] xl:hidden">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-ink"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Navegación
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between rounded-[18px] border border-border bg-card px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                    isActive(link.key) ? 'text-text border-text/30 bg-text/5' : 'text-text-secondary hover:text-text'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-5 rounded-[22px] border border-border bg-card p-3">
              <div className="flex rounded-full border border-border bg-surface-muted p-1">
                {LOCALES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => switchLocale(item)}
                    className={`flex-1 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                      item === locale ? 'bg-text text-bg' : 'text-text-muted hover:text-text'
                    }`}
                    style={{ fontFamily: 'var(--font-mono)' }}
                    aria-pressed={item === locale}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}
