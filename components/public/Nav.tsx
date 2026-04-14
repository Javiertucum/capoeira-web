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
    setScrolled(window.scrollY > 14)
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
    { href: `/${locale}/map?filter=educators`, label: t('educators'), key: 'educators' },
  ]

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled || menuOpen
            ? 'border-border bg-[rgba(8,16,25,0.88)] shadow-[0_16px_48px_var(--shadow-soft)] backdrop-blur-xl'
            : 'border-transparent bg-[rgba(8,16,25,0.45)] backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex h-[74px] w-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link href={`/${locale}`} className="group flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[16px] border border-accent/20 bg-[linear-gradient(180deg,rgba(121,207,114,0.18),rgba(121,207,114,0.06))] text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
              AC
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.34em] text-text-muted">
                Global Directory
              </span>
              <span className="block truncate text-[15px] font-semibold tracking-[0.02em] text-text">
                Agenda Capoeiragem
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 xl:flex">
            {links.map((link) => {
              const isMapRoute = pathname === `/${locale}/map`
              const isActive =
                link.key === 'nucleos'
                  ? isMapRoute && !currentFilter
                  : isMapRoute && currentFilter === link.key

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    isActive
                      ? 'bg-[rgba(121,207,114,0.14)] text-accent'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden rounded-full border border-border bg-card/70 p-1 sm:flex">
              {LOCALES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => switchLocale(item)}
                  className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors ${
                    item === locale
                      ? 'bg-[rgba(121,207,114,0.14)] text-accent'
                      : 'text-text-muted hover:text-text'
                  }`}
                  aria-pressed={item === locale}
                >
                  {item}
                </button>
              ))}
            </div>

            <Link
              href={`/${locale}/app`}
              className="hidden h-11 items-center justify-center rounded-full bg-accent px-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#081019] transition-transform hover:-translate-y-0.5 hover:opacity-95 md:inline-flex"
            >
              {t('downloadApp')}
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card/70 text-text transition-colors hover:border-accent/25 hover:text-accent xl:hidden"
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
            className="fixed inset-0 z-40 bg-[rgba(5,9,15,0.52)] backdrop-blur-sm xl:hidden"
          />

          <div className="fixed inset-x-4 top-[86px] z-50 rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.98),rgba(11,18,27,0.98))] p-5 shadow-[0_28px_80px_var(--shadow)] xl:hidden">
            <p className="text-[10px] uppercase tracking-[0.32em] text-accent">
              Agenda Capoeiragem
            </p>
            <p className="mt-3 max-w-[24ch] text-[15px] leading-6 text-text-secondary">
              Explore grupos, educadores y nucleos desde una sola navegacion.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-[18px] border border-transparent bg-surface/75 px-4 py-3 text-sm font-semibold text-text-secondary transition-colors hover:border-accent/20 hover:text-text"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-5 rounded-[20px] border border-border bg-card/80 p-3">
              <div className="mb-3 flex rounded-full border border-border bg-surface-muted/80 p-1">
                {LOCALES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => switchLocale(item)}
                    className={`flex-1 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors ${
                      item === locale
                        ? 'bg-[rgba(121,207,114,0.14)] text-accent'
                        : 'text-text-muted hover:text-text'
                    }`}
                    aria-pressed={item === locale}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <Link
                href={`/${locale}/app`}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-accent px-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#081019] transition-transform hover:-translate-y-0.5"
              >
                {t('downloadApp')}
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}
