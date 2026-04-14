import Image from 'next/image'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
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
    profileLabel: 'Perfil público',
  },
  pt: {
    role: 'Educador',
    locations: 'espacos',
    links: 'links',
    open: 'Abrir perfil',
    empty: 'Perfil público pronto para completar.',
    profileLabel: 'Perfil público',
  },
  en: {
    role: 'Educator',
    locations: 'locations',
    links: 'links',
    open: 'Open profile',
    empty: 'Public profile ready to be filled in.',
    profileLabel: 'Public profile',
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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card transition-colors duration-200 hover:border-accent/24">
      <Link
        href={`/${locale}/educator/${educator.uid}`}
        className="absolute inset-0 z-0"
        aria-label={displayName}
      />
      <div className="flex h-full flex-col pointer-events-none">
        <div className="border-b border-border px-5 pb-5 pt-6">
          <div className="flex items-start gap-4">
            <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-accent/20 bg-[rgba(121,207,114,0.14)]">
              {educator.avatarUrl ? (
                <Image
                  src={educator.avatarUrl}
                  alt={displayName}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              ) : (
                <span className="text-lg font-semibold uppercase tracking-[0.14em] text-accent">
                  {initials}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">{copy.role}</Badge>
                {educator.country ? <Badge>{educator.country}</Badge> : null}
              </div>

              <h3 className="mt-4 truncate text-[22px] font-semibold tracking-[-0.03em] text-text">
                {displayName}
              </h3>

              {educator.nickname && fullName ? (
                <p className="mt-1 truncate text-sm text-text-muted">{fullName}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-text-muted">
            {copy.profileLabel}
          </p>
          <p className="mt-3 overflow-hidden text-sm leading-7 text-text-secondary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {educator.bio?.trim() || copy.empty}
          </p>

          <div className="relative z-10 mt-5 flex flex-wrap gap-2 pointer-events-auto">
            {typeof educator.nucleoIds?.length === 'number' && educator.nucleoIds.length > 0 ? (
              <Badge>{`${educator.nucleoIds.length} ${copy.locations}`}</Badge>
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
                  className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
                  onClick={(e) => e.stopPropagation()}
                >
                  {SOCIAL_LABELS[platform] ?? platform.slice(0, 3).toUpperCase()}
                </a>
              )
            })}
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              {socials.length} {copy.links}
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              {copy.open}
              <svg
                width="14"
                height="14"
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
