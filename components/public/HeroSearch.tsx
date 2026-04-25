'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, type FormEvent } from 'react'

const QUICK_LINKS = {
  es: [
    { label: 'Buenos Aires',     n: 22,  href: '/map?q=Buenos+Aires' },
    { label: 'Madrid',           n: 18,  href: '/map?q=Madrid' },
    { label: 'São Paulo',        n: 41,  href: '/map?q=S%C3%A3o+Paulo' },
    { label: 'Ciudad de México', n: 14,  href: '/map?q=M%C3%A9xico' },
    { label: 'Berlín',           n: 9,   href: '/map?q=Berl%C3%ADn' },
    { label: 'Infantil',         n: 76,  href: '/map?q=Infantil' },
    { label: 'Roda abierta',     n: 38,  href: '/map?q=Roda' },
  ],
  pt: [
    { label: 'Salvador',     n: 17,  href: '/map?q=Salvador' },
    { label: 'São Paulo',    n: 41,  href: '/map?q=S%C3%A3o+Paulo' },
    { label: 'Rio de Janeiro', n: 23, href: '/map?q=Rio' },
    { label: 'Brasília',     n: 8,   href: '/map?q=Bras%C3%ADlia' },
    { label: 'Infantil',     n: 76,  href: '/map?q=Infantil' },
  ],
  en: [
    { label: 'Buenos Aires', n: 22,  href: '/map?q=Buenos+Aires' },
    { label: 'Madrid',       n: 18,  href: '/map?q=Madrid' },
    { label: 'São Paulo',    n: 41,  href: '/map?q=S%C3%A3o+Paulo' },
    { label: 'Berlin',       n: 9,   href: '/map?q=Berlin' },
    { label: 'Kids classes', n: 76,  href: '/map?q=Infantil' },
  ],
} as const

export default function HeroSearch() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/${locale}/map?q=${encodeURIComponent(q)}` : `/${locale}/map`)
  }

  const links = QUICK_LINKS[locale as keyof typeof QUICK_LINKS] ?? QUICK_LINKS.en
  const nearLabel = locale === 'pt' ? 'Perto de mim' : locale === 'en' ? 'Near me' : 'Cerca de mí'
  const atajoLabel = locale === 'pt' ? 'Atalhos' : locale === 'en' ? 'Shortcuts' : 'Atajos'

  return (
    <div>
      {/* Pill search bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full border border-line bg-surface p-1.5"
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        {/* Input */}
        <div className="flex flex-1 items-center gap-3 px-5 h-14 min-w-0">
          <svg
            width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round"
            className="shrink-0 text-ink-3" aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="flex-1 min-w-0 bg-transparent text-[17px] text-ink outline-none placeholder:text-ink-4"
          />
        </div>

        {/* Cerca de mí — desktop */}
        <div className="hidden h-8 w-px bg-line sm:block" />
        <button
          type="button"
          onClick={() => router.push(`/${locale}/map`)}
          className="hidden sm:flex h-14 items-center gap-2 px-5 text-[14px] text-ink-2 hover:text-ink transition-colors whitespace-nowrap"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {nearLabel}
        </button>

        {/* CTA Buscar */}
        <button
          type="submit"
          className="btn btn-accent btn-lg shrink-0"
          style={{ height: 56, paddingInline: 26 }}
        >
          {t('searchButton')}
        </button>
      </form>

      {/* Chips de atajos */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mono mr-1 text-[11px] uppercase tracking-[0.16em] text-ink-3">
          {atajoLabel}
        </span>
        {links.map((c) => (
          <Link
            key={c.label}
            href={`/${locale}${c.href}`}
            className="chip"
          >
            {c.label}
            <span className="text-ink-4 text-[11px]">{c.n}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
