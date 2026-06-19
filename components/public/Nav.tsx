'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { routing } from '@/i18n/routing'
import ThemeToggle from './ThemeToggle'

const LOCALES = routing.locales
type Locale = (typeof routing.locales)[number]

const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  pt: 'Português',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
}

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
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const syncScrollState = useEffectEvent(() => {
    setScrolled(window.scrollY > 8)
  })

  useEffect(() => {
    syncScrollState()
    window.addEventListener('scroll', syncScrollState, { passive: true })
    return () => window.removeEventListener('scroll', syncScrollState)
  }, [syncScrollState])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkTheme(document.documentElement.classList.contains('dark'))
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) {
      hamburgerRef.current?.focus()
      return
    }
    const drawer = drawerRef.current
    if (!drawer) return
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    focusable[0]?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { setMenuOpen(false); return }
      if (e.key !== 'Tab') return
      const items = Array.from(focusable)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  function switchLocale(nextLocale: Locale) {
    const nextPathname = getLocalizedPathname(pathname, nextLocale)
    const search = searchParams.toString()
    router.replace(search ? `${nextPathname}?${search}` : nextPathname)
  }

  // Homepage is now light (beige) by default in the vanguard design
  const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`
  const isAdmin = pathname.includes('/admin')
  const isDark = !isHomepage // Most other pages (like admin) might be dark or default

  if (isAdmin) return null
  
  const navBg = scrolled || menuOpen 
    ? 'glass border-bg/10 shadow-soft' 
    : 'bg-transparent border-transparent'

  const textColor = 'text-ink'
  const mutedTextColor = 'text-ink/60'
  const faintTextColor = 'text-ink/30'

  const links = [
    { href: isHomepage ? '#directorio' : `/${locale}/#directorio`, label: t('map'), key: 'map' },
    { href: `/${locale}/tutoriales`, label: t('tutorials'), key: 'tutorials' },
    { href: `/${locale}/admin`, label: 'Admin', key: 'admin' },
  ]

  function isActive(key: string) {
    if (key === 'admin') return pathname.includes('/admin')
    if (key === 'app') return pathname.startsWith(`/${locale}/app`)
    if (key === 'tutorials') return pathname.startsWith(`/${locale}/tutoriales`)
    return false
  }

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-200 ease-[var(--ease-out)] border-b backdrop-blur-[12px] ${navBg}`}
      >
        <div className="page-shell flex h-[72px] items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex-shrink-0 group"
          >
            <Image
              src="/images/logo.png"
              alt="Agenda Capoeiragem"
              width={40}
              height={40}
              className="shrink-0 rounded-2xl transition-transform duration-200 ease-[var(--ease-out)] group-hover:scale-[1.05]"
              priority
            />
            <span className="flex flex-col justify-center min-w-0 whitespace-nowrap overflow-hidden">
              <span
                className={`block text-[16px] sm:text-[18px] truncate text-ink`}
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
                  style={isActive(link.key) ? { color: 'var(--color-bg)' } : undefined}
                  className={`rounded-full px-[18px] py-2 text-[14px] font-bold transition-colors duration-150 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive(link.key)
                      ? 'bg-ink'
                      : 'text-ink/60 hover:text-ink hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: download CTA + locale + hamburger */}
          <div className="flex items-center gap-4">

            {/* Download app — desktop CTA */}
            <Link
              href={`/${locale}/app`}
              style={isActive('app') ? { color: 'var(--color-bg)' } : undefined}
              className={`hidden lg:inline-flex items-center rounded-full px-5 py-2.5 text-[13px] font-bold transition-colors duration-150 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive('app') ? 'bg-ink' : 'bg-accent-solid text-white hover:opacity-90'
              }`}
            >
              {t('downloadApp')}
            </Link>

            {/* Locale switcher — desktop */}
            <div className="relative hidden sm:flex">
              <select
                aria-label="Idioma"
                value={locale}
                onChange={(e) => switchLocale(e.target.value as Locale)}
                style={{
                  colorScheme: isDarkTheme ? 'dark' : 'light',
                  backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.96)',
                  color: isDarkTheme ? '#F8FAFC' : '#0F172A',
                  borderColor: isDarkTheme ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.12)',
                }}
                className="mono h-[34px] appearance-none rounded-full border bg-transparent pl-3 pr-7 text-[11px] uppercase tracking-[0.1em] transition-colors duration-150 ease-[var(--ease-out)] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {LOCALES.map((item) => (
                  <option key={item} value={item}>
                    {item.toUpperCase()} · {LOCALE_NAMES[item]}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-ink/40 dark:text-white/40"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Theme toggle */}
            <ThemeToggle className="hidden sm:flex" />

            {/* Hamburger — mobile */}
            <button
              ref={hamburgerRef}
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setMenuOpen((p) => !p)}
              className={`grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-white/50 text-ink backdrop-blur-md transition-[background-color,border-color,color] duration-200 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden active:scale-95`}
            >
              <span className="relative block h-4 w-5">
                <span className={`absolute left-0 top-0.5 h-px w-5 transition-transform duration-200 ease-[var(--ease-out)] ${menuOpen ? 'translate-y-[6px] rotate-45' : ''} bg-current`} />
                <span className={`absolute left-0 top-[7px] h-px w-5 transition-opacity duration-200 ease-[var(--ease-out)] ${menuOpen ? 'opacity-0' : ''} bg-current`} />
                <span className={`absolute left-0 top-[13px] h-px w-5 transition-transform duration-200 ease-[var(--ease-out)] ${menuOpen ? '-translate-y-[6px] -rotate-45' : ''} bg-current`} />
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
          <div
            ref={drawerRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navegación principal"
            className="fixed inset-x-4 top-[84px] z-50 rounded-[22px] border border-line bg-bg p-5 lg:hidden"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            <p className="eyebrow acc mb-4">Navegación</p>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between rounded-[16px] border border-line bg-surface px-4 py-3 text-sm font-medium transition-colors duration-150 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98] ${
                    isActive(link.key) ? 'border-ink/20 bg-ink/5 text-ink' : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={`/${locale}/app`}
                className="flex items-center justify-between rounded-[16px] bg-accent-solid px-4 py-3 text-sm font-bold text-white transition-opacity duration-150 ease-[var(--ease-out)] active:scale-[0.98]"
              >
                {t('downloadApp')}
              </Link>
            </div>
            {/* Locale switcher mobile */}
            <div className="mt-4 flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  aria-label="Idioma"
                  value={locale}
                  onChange={(e) => switchLocale(e.target.value as Locale)}
                  style={{
                    backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.96)',
                    color: isDarkTheme ? '#F8FAFC' : '#0F172A',
                    borderColor: isDarkTheme ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.12)',
                  }}
                  className="mono h-10 w-full appearance-none rounded-full border bg-white/95 pl-4 pr-8 text-[11px] uppercase tracking-[0.12em] transition-colors duration-150 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {LOCALES.map((item) => (
                    <option key={item} value={item}>
                      {item.toUpperCase()} · {LOCALE_NAMES[item]}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-3 dark:text-white/40"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </>
      )}
    </>
  )
}
