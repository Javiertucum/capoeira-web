'use client'

import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, type FormEvent } from 'react'

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

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[640px] rounded-[18px] border border-border bg-card/90 p-2 shadow-[0_24px_70px_var(--shadow)] backdrop-blur"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[14px] border border-transparent bg-surface/80 px-4 py-3 transition-colors focus-within:border-accent/40">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_6px_rgba(102,187,106,0.12)]"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
          />
        </label>

        <button
          type="submit"
          className="inline-flex h-[52px] items-center justify-center rounded-[14px] bg-accent px-6 text-sm font-semibold tracking-[0.08em] text-[#08110C] transition-all hover:opacity-90"
        >
          {t('searchButton')}
        </button>
      </div>
    </form>
  )
}
