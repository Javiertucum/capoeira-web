'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, type FormEvent } from 'react'

const QUICK_LINKS = {
  es: [
    { href: '/map', label: 'Buenos Aires' },
    { href: '/map', label: 'Madrid' },
    { href: '/map', label: 'São Paulo' },
    { href: '/map', label: 'Ciudad de México' },
    { href: '/educators', label: 'Conocer educadores' },
    { href: '/map?filter=groups', label: 'Ver grupos' },
  ],
  pt: [
    { href: '/map', label: 'Salvador' },
    { href: '/map', label: 'Rio de Janeiro' },
    { href: '/map', label: 'São Paulo' },
    { href: '/educators', label: 'Conhecer educadores' },
    { href: '/map?filter=groups', label: 'Ver grupos' },
  ],
  en: [
    { href: '/map', label: 'Buenos Aires' },
    { href: '/map', label: 'Madrid' },
    { href: '/map', label: 'São Paulo' },
    { href: '/educators', label: 'Meet educators' },
    { href: '/map?filter=groups', label: 'Browse groups' },
  ],
} as const

export default function HeroSearch() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      router.push(`/${locale}/map`)
      return
    }
    router.push(`/${locale}/map?q=${encodeURIComponent(trimmedQuery)}`)
  }

  const links = QUICK_LINKS[locale as keyof typeof QUICK_LINKS] ?? QUICK_LINKS.en
  const nearMeLabel = locale === 'pt' ? 'Perto de mim' : locale === 'en' ? 'Near me' : 'Cerca de mí'

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-2"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        {/* Search input */}
        <div className="flex flex-1 items-center gap-3 px-4 h-14 min-w-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="shrink-0 text-text-muted"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="flex-1 min-w-0 bg-transparent text-[17px] text-text outline-none placeholder:text-text-muted"
          />
        </div>

        {/* Geo button (desktop) */}
        <div className="hidden h-8 w-px bg-border sm:block" />
        <button
          type="button"
          onClick={() => router.push(`/${locale}/map`)}
          className="hidden sm:flex items-center gap-2 h-14 px-4 text-[14px] text-text-muted hover:text-text transition-colors whitespace-nowrap"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {nearMeLabel}
        </button>

        {/* Submit */}
        <button
          type="submit"
          className="h-14 shrink-0 rounded-full bg-accent px-7 text-[14px] font-medium text-white transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {t('searchButton')}
        </button>
      </form>

      {/* Quick-link chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className="mr-1 text-[10px] uppercase tracking-[0.18em] text-text-faint"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {locale === 'en' ? 'Shortcuts' : locale === 'pt' ? 'Atalhos' : 'Atajos'}
        </span>
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.label}`}
            href={`/${locale}${link.href}`}
            className="inline-flex h-8 items-center rounded-full border border-border bg-card px-3 text-[12px] text-text-muted transition-colors hover:border-text/20 hover:text-text"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
