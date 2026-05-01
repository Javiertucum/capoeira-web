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

  // Homepage is now light (beige) by default in the vanguard design
  const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`
  const isDark = !isHomepage // Most other pages (like admin) might be dark or default
  
  const navBg = scrolled || menuOpen 
    ? 'glass border-bg/10 shadow-soft' 
    : 'bg-transparent border-transparent'

  const textColor = 'text-ink'
  const mutedTextColor = 'text-ink/60'
  const faintTextColor = 'text-ink/30'

  const links = [
    { href: isHomepage ? '#features' : `/${locale}/#features`, label: t('features'), key: 'features' },
    { href: isHomepage ? '#tutorials' : `/${locale}/#tutorials`, label: t('tutorials'), key: 'tutorials' },
    { href: `/${locale}/admin`, label: 'Admin', key: 'admin' },
  ]

  function isActive(key: string) {
    if (key === 'admin') return pathname.includes('/admin')
    return false
  }

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all border-b backdrop-blur-[12px] ${navBg}`}
      >
        <div className="page-shell flex h-[72px] items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex-shrink-0 group"
          >
            {/* Monograma a·c */}
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[18px] leading-none bg-ink text-bg transition-transform group-hover:scale-110`}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}
            >
              a<span style={{ color: 'var(--accent)' }}>·</span>c
            </span>
            <span className="flex flex-col justify-center min-w-0 whitespace-nowrap overflow-hidden">
              <span className={`eyebrow block truncate opacity-40`} style={{ fontSize: 9, letterSpacing: '0.2em' }}>
                Capoeira platform
              </span>
              <span
                className={`block text-[16px] sm:text-[18px] truncate text-[#10131A]`}
                style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}
              >
                Agenda Capoeiragem
              </span>
            </span>
          </Link>

          {/* Pill nav — desktop */}
          <div className="hidden items-center lg:flex">
            <div className={`flex items-center gap-1 rounded-full border px-1 py-1 border-ink/5 bg-ink/5`}>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-[18px] py-2 text-[14px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive(link.key)
                      ? 'bg-ink text-bg'
                      : 'text-ink/60 hover:text-ink hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: locale + hamburger */}
          <div className="flex items-center gap-4">

            {/* Locale switcher — desktop */}
            <div className={`hidden rounded-full border px-1 py-1 sm:flex border-ink/5 bg-ink/5`}>
              {LOCALES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => switchLocale(item)}
                  aria-pressed={item === locale}
                  className={`mono w-8 h-[30px] rounded-full text-[11px] uppercase tracking-[0.1em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    item === locale
                      ? 'bg-ink text-bg shadow-sm'
                      : 'text-ink/30 hover:text-ink'
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
              className={`grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-white/50 text-ink backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden`}
            >
              <span className="relative block h-4 w-5">
                <span className={`absolute left-0 top-0.5 h-px w-5 transition-all ${menuOpen ? 'translate-y-[6px] rotate-45' : ''} bg-current`} />
                <span className={`absolute left-0 top-[7px] h-px w-5 transition-opacity ${menuOpen ? 'opacity-0' : ''} bg-current`} />
                <span className={`absolute left-0 top-[13px] h-px w-5 transition-all ${menuOpen ? '-translate-y-[6px] -rotate-45' : ''} bg-current`} />
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
