'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, type FormEvent } from 'react'

const QUICK_LINKS = {
  es: [
    { href: '/map', label: 'Explorar nucleos' },
    { href: '/map?filter=groups', label: 'Ver grupos' },
    { href: '/map?filter=educators', label: 'Conocer educadores' },
  ],
  pt: [
    { href: '/map', label: 'Explorar nucleos' },
    { href: '/map?filter=groups', label: 'Ver grupos' },
    { href: '/map?filter=educators', label: 'Conhecer educadores' },
  ],
  en: [
    { href: '/map', label: 'Explore nucleos' },
    { href: '/map?filter=groups', label: 'Browse groups' },
    { href: '/map?filter=educators', label: 'Meet educators' },
  ],
} as const

const SEARCH_META = {
  es: {
    label: 'Buscar por ciudad, pais o grupo',
  },
  pt: {
    label: 'Buscar por cidade, pais ou grupo',
  },
  en: {
    label: 'Search by city, country, or group',
  },
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
  const meta = SEARCH_META[locale as keyof typeof SEARCH_META] ?? SEARCH_META.en

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[760px] rounded-[30px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.96))] p-3 shadow-[0_28px_80px_var(--shadow)] backdrop-blur-xl"
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_170px]">
        <label className="flex min-w-0 items-center gap-4 rounded-[24px] border border-border bg-surface/80 px-4 py-4 transition-colors focus-within:border-accent/35">
          <span
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[16px] border border-accent/20 bg-[rgba(121,207,114,0.12)] text-accent"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
              {meta.label}
            </span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="mt-1 block w-full min-w-0 bg-transparent text-base text-text outline-none placeholder:text-text-muted"
            />
          </span>
        </label>

        <button
          type="submit"
          className="inline-flex h-[68px] cursor-pointer items-center justify-center rounded-[24px] bg-accent px-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#081019] transition-transform hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline-none"
        >
          {t('searchButton')}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={`/${locale}${link.href}`}
            className="inline-flex items-center rounded-full border border-border bg-card/85 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-accent/25 hover:text-text"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </form>
  )
}
