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

  useEffect(() => { setMenuOpen(false) }, [pathname])

  function switchLocale(nextLocale: Locale) {
    const nextPathname = getLocalizedPathname(pathname, nextLocale)
    const search = searchParams.toString()
    router.replace(search ? `${nextPathname}?${search}` : nextPathname)
  }

  const currentFilter = searchParams.get('filter')
  const links = [
    { href: `/${locale}/map`,              label: t('map'),       key: 'nucleos' },
    { href: `/${locale}/map?filter=groups`, label: t('groups'),   key: 'groups' },
    { href: `/${locale}/educators`,        label: t('educators'), key: 'educators' },
    { href: `/${locale}/app`,             label: 'App',          key: 'app' },
  ]

  function isActive(key: string) {
    if (key === 'educators') return pathname === `/${locale}/educators` || pathname.startsWith(`/${locale}/educator/`)
    if (key === 'app')       return pathname === `/${locale}/app`
    const isMapRoute = pathname === `/${locale}/map`
    if (key === 'nucleos')   return isMapRoute && !currentFilter
    return isMapRoute && currentFilter === key
  }

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all ${
          scrolled || menuOpen
            ? 'border-b border-line-soft bg-[color-mix(in_srgb,#F4EFE6_94%,transparent)] backdrop-blur-[10px]'
            : 'border-b border-transparent bg-[color-mix(in_srgb,#F4EFE6_88%,transparent)] backdrop-blur-[8px]'
        }`}
      >
        <div className="page-shell flex h-[72px] items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex min-w-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {/* Monograma a·c */}
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-ink text-[15px] leading-none text-bg"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              a<span style={{ color: 'var(--accent)' }}>·</span>c
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="eyebrow block" style={{ fontSize: 9, letterSpacing: '0.16em' }}>
                Capoeira directory
              </span>
              <span
                className="block text-[15px] text-ink"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}
              >
                Agenda Capoeiragem
              </span>
            </span>
          </Link>

          {/* Pill nav — desktop */}
          <div className="hidden items-center lg:flex">
            <div className="flex items-center gap-1 rounded-full border border-line bg-surface px-1 py-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-[14px] py-2 text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive(link.key)
                      ? 'bg-ink text-bg'
                      : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: ⌘K + locale + hamburger */}
          <div className="flex items-center gap-2">
            {/* ⌘K ghost button — desktop */}
            <button
              type="button"
              onClick={() => router.push(`/${locale}/map`)}
              className="btn btn-ghost btn-sm hidden items-center gap-3 lg:inline-flex"
              style={{ paddingLeft: 12, paddingRight: 10 }}
            >
              <span className="text-ink-3 text-[12px]">Buscar ciudad o grupo</span>
              <span
                className="mono rounded border border-line px-1.5 py-0.5 text-[10px] text-ink-3"
              >
                ⌘K
              </span>
            </button>

            {/* Locale switcher — desktop */}
            <div className="hidden rounded-full border border-line bg-surface px-1 py-1 sm:flex">
              {LOCALES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => switchLocale(item)}
                  aria-pressed={item === locale}
                  className={`mono w-8 h-[30px] rounded-full text-[11px] uppercase tracking-[0.1em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    item === locale ? 'bg-ink text-bg' : 'text-ink-3 hover:text-ink'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Hamburger — mobile */}
            <button
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((p) => !p)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
            >
              <span className="relative block h-4 w-5">
                <span className={`absolute left-0 top-0.5 h-px w-5 bg-current transition-all ${menuOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
                <span className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`absolute left-0 top-[13px] h-px w-5 bg-current transition-all ${menuOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Cerrar navegación"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-ink/20 lg:hidden"
          />
          <div className="fixed inset-x-4 top-[84px] z-50 rounded-[22px] border border-line bg-bg p-5 lg:hidden"
            style={{ boxShadow: 'var(--shadow-lg)' }}>
            <p className="eyebrow acc mb-4">Navegación</p>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between rounded-[16px] border border-line bg-surface px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive(link.key) ? 'border-ink/20 bg-ink/5 text-ink' : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {/* Locale switcher mobile */}
            <div className="mt-4 flex rounded-full border border-line bg-surface-muted p-1">
              {LOCALES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => switchLocale(item)}
                  aria-pressed={item === locale}
                  className={`mono flex-1 rounded-full py-2 text-[10px] uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    item === locale ? 'bg-ink text-bg' : 'text-ink-3 hover:text-ink'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
