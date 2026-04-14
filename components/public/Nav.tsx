'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)

    onScroll()
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  function switchLocale(nextLocale: Locale) {
    const nextPathname = getLocalizedPathname(pathname, nextLocale)
    const search = searchParams.toString()

    router.replace(search ? `${nextPathname}?${search}` : nextPathname)
  }

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex h-[60px] items-center justify-between border-b px-5 transition-colors duration-200 sm:px-8 lg:px-12 ${
          scrolled || menuOpen
            ? 'border-border bg-[rgba(16,19,26,0.97)] backdrop-blur-[16px]'
            : 'border-transparent bg-transparent'
        }`}
      >
        <Link
          href={`/${locale}`}
          className="text-sm font-semibold tracking-[0.14em] text-text"
        >
          AGENDA<span className="text-accent">.</span>CAPOEIRAGEM
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link
            href={`/${locale}/map`}
            className="text-[13px] text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-text"
          >
            {t('map')}
          </Link>
          <Link
            href={`/${locale}/map?filter=groups`}
            className="text-[13px] text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-text"
          >
            {t('groups')}
          </Link>
          <Link
            href={`/${locale}/map?filter=educators`}
            className="text-[13px] text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:text-text"
          >
            {t('educators')}
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center rounded-sm border border-border px-2 py-1">
            {LOCALES.map((item, index) => (
              <span key={item} className="flex items-center">
                <button
                  type="button"
                  onClick={() => switchLocale(item)}
                  className={`cursor-pointer text-[11px] tracking-wider transition-colors focus-visible:outline-none ${
                    item === locale ? 'text-accent' : 'text-text-muted hover:text-text'
                  }`}
                  aria-pressed={item === locale}
                >
                  {item.toUpperCase()}
                </button>
                {index < LOCALES.length - 1 ? (
                  <span className="mx-1 text-[11px] text-border">/</span>
                ) : null}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="hidden cursor-pointer rounded-sm bg-accent px-3 py-1.5 text-[12px] font-medium text-[#08110C] transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:opacity-85 sm:px-4 md:inline-flex"
          >
            {t('downloadApp')}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-8 w-8 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-md transition-colors hover:bg-surface focus-visible:outline-none md:hidden"
          >
            <span
              className={`h-px w-5 bg-text-secondary transition-all duration-200 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
            />
            <span
              className={`h-px w-5 bg-text-secondary transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`h-px w-5 bg-text-secondary transition-all duration-200 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-x-0 top-[60px] z-40 border-b border-border bg-[rgba(16,19,26,0.97)] px-5 py-5 backdrop-blur-[16px] sm:px-8 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href={`/${locale}/map`}
              className="rounded-lg px-3 py-3 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text"
            >
              {t('map')}
            </Link>
            <Link
              href={`/${locale}/map?filter=groups`}
              className="rounded-lg px-3 py-3 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text"
            >
              {t('groups')}
            </Link>
            <Link
              href={`/${locale}/map?filter=educators`}
              className="rounded-lg px-3 py-3 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text"
            >
              {t('educators')}
            </Link>
            <div className="mt-3 border-t border-border pt-3">
              <button
                type="button"
                className="w-full cursor-pointer rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-[#08110C] transition-opacity hover:opacity-90"
              >
                {t('downloadApp')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
