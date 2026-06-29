'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Nav() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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
  ]

  function isActive(key: string) {
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
            <div className="mt-4 flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </>
      )}
    </>
  )
}
