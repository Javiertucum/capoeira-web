'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

const LOCALES = ['es', 'pt', 'en'] as const

type Locale = (typeof LOCALES)[number]

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)

    onScroll()
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function switchLocale(nextLocale: Locale) {
    const nextPathname = getLocalizedPathname(pathname, nextLocale)
    const search = searchParams.toString()

    router.replace(search ? `${nextPathname}?${search}` : nextPathname)
  }

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 flex h-[60px] items-center justify-between border-b px-5 transition-colors duration-200 sm:px-8 lg:px-12 ${
        scrolled
          ? 'border-border bg-[rgba(16,19,26,0.95)] backdrop-blur-[16px]'
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
          className="text-[13px] text-text-muted transition-colors hover:text-text"
        >
          {t('map')}
        </Link>
        <Link
          href={`/${locale}`}
          className="text-[13px] text-text-muted transition-colors hover:text-text"
        >
          {t('groups')}
        </Link>
        <Link
          href={`/${locale}`}
          className="text-[13px] text-text-muted transition-colors hover:text-text"
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
                className={`cursor-pointer text-[11px] tracking-wider transition-colors ${
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
          className="rounded-sm bg-accent px-3 py-1.5 text-[12px] font-medium text-[#08110C] transition-opacity hover:opacity-85 sm:px-4"
        >
          {t('downloadApp')}
        </button>
      </div>
    </nav>
  )
}
