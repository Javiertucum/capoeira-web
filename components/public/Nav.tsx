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
  ]

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors ${
          scrolled || menuOpen
            ? 'border-border bg-[rgba(11,17,23,0.94)] backdrop-blur-lg'
            : 'border-transparent bg-[rgba(11,17,23,0.78)] backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link
            href={`/${locale}`}
            className="flex min-w-0 items-center gap-3 rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-accent/20 bg-accent/10 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              AC
            </span>

            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.24em] text-text-muted">
                Capoeira Directory
              </span>
              <span className="block truncate text-[15px] font-semibold text-text">
                Agenda Capoeiragem
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const isMapRoute = pathname === `/${locale}/map`
              const isActive =
                link.key === 'educators'
                  ? pathname === `/${locale}/educators` || pathname.startsWith(`/${locale}/educator/`)
                  : link.key === 'nucleos'
                    ? isMapRoute && !currentFilter
                    : isMapRoute && currentFilter === link.key

              return (
                <div key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                      isActive
                        ? 'bg-card text-text'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    {link.label}
                  </Link>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden rounded-full border border-border bg-card px-1 py-1 sm:flex">
              {LOCALES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => switchLocale(item)}
                  className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                    item === locale ? 'bg-surface text-text' : 'text-text-muted hover:text-text'
                  }`}
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
            className="fixed inset-0 z-40 bg-[rgba(5,9,15,0.45)] xl:hidden"
          />

          <div className="fixed inset-x-4 top-[84px] z-50 rounded-[26px] border border-border bg-bg p-5 shadow-[0_20px_48px_var(--shadow)] xl:hidden">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Navegacion
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {links.map((link) => {
                const isMapRoute = pathname === `/${locale}/map`
                const isActive =
                  link.key === 'educators'
                    ? pathname === `/${locale}/educators` || pathname.startsWith(`/${locale}/educator/`)
                    : link.key === 'nucleos'
                      ? isMapRoute && !currentFilter
                      : isMapRoute && currentFilter === link.key

                return (
                  <div key={link.href} className="relative">
                    <Link
                      href={link.href}
                      className={`flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${isActive ? 'text-text' : 'text-text-secondary hover:text-text'}`}
                    >
                      {link.label}
                    </Link>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 rounded-[22px] border border-border bg-card p-3">
              <div className="mb-3 flex rounded-full border border-border bg-surface-muted/80 p-1">
                {LOCALES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => switchLocale(item)}
                    className={`flex-1 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                      item === locale ? 'bg-surface text-text' : 'text-text-muted hover:text-text'
                    }`}
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
