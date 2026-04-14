import Image from 'next/image'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import type { PublicUserProfile } from '@/lib/types'

type Props = Readonly<{
  educator: PublicUserProfile
  locale: string
}>

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

function getInitials(educator: PublicUserProfile) {
  return [educator.name?.[0], educator.surname?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || 'AC'
}

function normalizeSocialHref(platform: string, value: string) {
  if (platform === 'whatsapp') {
    const digits = value.replace(/\D/g, '')
    if (digits) {
      return `https://wa.me/${digits}`
    }
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  return `https://${value}`
}

export default function EducatorCard({ educator, locale }: Props) {
  const displayName = getDisplayName(educator)
  const initials = getInitials(educator)
  const socials = Object.entries(educator.socialLinks ?? {})
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string' && Boolean(entry[1]))
    .slice(0, 3)

  return (
    <article className="group overflow-hidden rounded-[22px] border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-accent/35">
      <Link href={`/${locale}/educator/${educator.uid}`} className="block">
        <div className="relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,#202633_0%,#161B24_100%)] px-5 pb-5 pt-6">
          <div
            aria-hidden="true"
            className="absolute right-[-24px] top-[-10px] h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(102,187,106,0.22)_0%,rgba(102,187,106,0)_72%)]"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-accent/20 bg-[rgba(102,187,106,0.12)]">
                {educator.avatarUrl ? (
                  <Image
                    src={educator.avatarUrl}
                    alt={displayName}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold tracking-[0.12em] text-accent">
                    {initials}
                  </span>
                )}
              </div>

              <div>
                <p className="text-lg font-semibold tracking-[0.01em] text-text">
                  {displayName}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {educator.country ? <Badge variant="accent">{educator.country}</Badge> : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-5">
          {educator.bio?.trim() ? (
            <p className="min-h-12 text-sm leading-6 text-text-secondary">
              {educator.bio.trim()}
            </p>
          ) : null}
        </div>
      </Link>

      {socials.length > 0 ? (
        <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
          {socials.map(([platform, value]) => (
            <a
              key={platform}
              href={normalizeSocialHref(platform, value)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-text-muted transition-colors hover:border-accent/30 hover:text-text"
            >
              {SOCIAL_LABELS[platform] ?? platform.slice(0, 3).toUpperCase()}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  )
}
