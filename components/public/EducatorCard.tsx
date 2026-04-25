import Image from 'next/image'
import Link from 'next/link'
import { normalizeSocialLink } from '@/lib/social-links'
import type { PublicUserProfile } from '@/lib/types'

type Props = Readonly<{
  educator: PublicUserProfile
  locale: string
}>

const COPY = {
  es: {
    role: 'Educador',
    locations: 'espacios',
    links: 'enlaces',
    open: 'Abrir perfil',
    empty: 'Perfil público listo para completar.',
  },
  pt: {
    role: 'Educador',
    locations: 'espaços',
    links: 'links',
    open: 'Abrir perfil',
    empty: 'Perfil público pronto para completar.',
  },
  en: {
    role: 'Educator',
    locations: 'locations',
    links: 'links',
    open: 'Open profile',
    empty: 'Public profile ready to be filled in.',
  },
} as const

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'IG',
  facebook: 'FB',
  whatsapp: 'WA',
  youtube: 'YT',
  tiktok: 'TK',
  website: 'WEB',
}

function getDisplayName(educator: PublicUserProfile) {
  const fullName = [educator.name, educator.surname].filter(Boolean).join(' ').trim()
  return educator.nickname?.trim() || fullName || educator.uid
}

function getFullName(educator: PublicUserProfile) {
  return [educator.name, educator.surname].filter(Boolean).join(' ').trim()
}

function getInitials(educator: PublicUserProfile) {
  return [educator.name?.[0], educator.surname?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || 'AC'
}

export default function EducatorCard({ educator, locale }: Props) {
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.en
  const displayName = getDisplayName(educator)
  const fullName = getFullName(educator)
  const initials = getInitials(educator)
  const socials = Object.entries(educator.socialLinks ?? {})
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string' && Boolean(entry[1]))
    .slice(0, 3)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-card transition-colors hover:border-text/20">
      <Link
        href={`/${locale}/educator/${educator.uid}`}
        className="absolute inset-0 z-0"
        aria-label={displayName}
      />
      <div className="pointer-events-none flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-border px-5 pb-5 pt-6">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-border bg-surface-muted">
              {educator.avatarUrl ? (
                <Image
                  src={educator.avatarUrl}
                  alt={displayName}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <span className="text-lg font-semibold uppercase tracking-[0.1em] text-text-muted">
                  {initials}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              {/* Country chip */}
              <div className="flex flex-wrap items-center gap-2">
                {educator.country ? (
                  <span className="inline-flex h-6 items-center rounded-full border border-border bg-surface-muted px-2.5 text-[11px] text-text-muted">
                    {educator.country}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-2 truncate text-[19px] font-semibold tracking-[-0.02em] text-text">
                {displayName}
              </h3>

              {educator.nickname && fullName ? (
                <p className="mt-0.5 truncate text-[12px] text-text-muted">{fullName}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col px-5 py-5">
          <p className="overflow-hidden text-sm leading-7 text-text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {educator.bio?.trim() || copy.empty}
          </p>

          {/* Social links */}
          <div className="relative z-10 mt-4 flex flex-wrap gap-2 pointer-events-auto">
            {typeof educator.nucleoIds?.length === 'number' && educator.nucleoIds.length > 0 ? (
              <span className="inline-flex h-6 items-center rounded-full border border-border bg-surface-muted px-2.5 text-[11px] text-text-muted">
                {educator.nucleoIds.length} {copy.locations}
              </span>
            ) : null}

            {socials.map(([platform, value]) => {
              const href = normalizeSocialLink(
                platform as Parameters<typeof normalizeSocialLink>[0],
                value
              )
              if (!href) return null
              return (
                <a
                  key={platform}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted transition-colors hover:text-text"
                >
                  {SOCIAL_LABELS[platform] ?? platform.slice(0, 3).toUpperCase()}
                </a>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
            <span
              className="text-[11px] uppercase tracking-[0.18em] text-text-faint"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {socials.length} {copy.links}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-accent-ink">
              {copy.open}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                aria-hidden="true"
                className="translate-x-0 transition-transform duration-200 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
