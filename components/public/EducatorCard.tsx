import Image from 'next/image'
import Link from 'next/link'
import CordaVisual from '@/components/public/CordaVisual'
import { normalizeSocialLink } from '@/lib/social-links'
import type { PublicUserProfile } from '@/lib/types'

type Props = Readonly<{
  educator: PublicUserProfile
  locale: string
}>

const COPY = {
  es: { open: 'Ver perfil', emptyBio: 'Perfil público listo para completar.', verified: 'Verificado' },
  pt: { open: 'Ver perfil', emptyBio: 'Perfil público pronto para completar.', verified: 'Verificado' },
  en: { open: 'View profile', emptyBio: 'Public profile ready to fill in.', verified: 'Verified' },
} as const

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'IG', facebook: 'FB', whatsapp: 'WA',
  youtube: 'YT', tiktok: 'TK', website: 'WEB',
}

function getDisplayName(e: PublicUserProfile) {
  const full = [e.name, e.surname].filter(Boolean).join(' ').trim()
  return e.nickname?.trim() || full || e.uid
}
function getFullName(e: PublicUserProfile) {
  return [e.name, e.surname].filter(Boolean).join(' ').trim()
}
function getInitials(e: PublicUserProfile) {
  return [e.name?.[0], e.surname?.[0]].filter(Boolean).join('').toUpperCase() || 'AC'
}

export default function EducatorCard({ educator, locale }: Props) {
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.en
  const displayName = getDisplayName(educator)
  const fullName    = getFullName(educator)
  const initials    = getInitials(educator)
  const socials = Object.entries(educator.socialLinks ?? {})
    .filter((e): e is [string, string] => typeof e[1] === 'string' && Boolean(e[1]))
    .slice(0, 3)

  const hasVerified = Boolean(educator.educatorEligible)

  return (
    <article className="card group relative flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Invisible full-card link */}
      <Link
        href={`/${locale}/educator/${educator.uid}`}
        className="absolute inset-0 z-0"
        aria-label={displayName}
      />

      {/* ── Portrait ── */}
      <div className="img-ph relative" style={{ height: 200 }}>
        {educator.avatarUrl ? (
          <Image
            src={educator.avatarUrl}
            alt={displayName}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <span className="pointer-events-none select-none">
            {initials}
          </span>
        )}
        {/* Country chip */}
        {educator.country && (
          <div className="absolute top-3 right-3 z-10">
            <span className="chip sm bg-surface/90 border-line/60">
              {educator.country}
            </span>
          </div>
        )}
        {/* Corda at bottom */}
        {/* We show corda only if graduation info is available via CordaVisual */}
      </div>

      {/* ── Body ── */}
      <div className="pointer-events-none flex flex-1 flex-col p-4">
        {/* Role eyebrow */}
        <span className="eyebrow text-[10px]">
          {educator.role === 'educator' ? (locale === 'en' ? 'Educator' : 'Educador') : 'Aluno'}
        </span>

        {/* Name */}
        <h3 className="mt-1 text-[19px] font-semibold leading-tight tracking-[-0.02em] text-ink" style={{ fontFamily: 'var(--font-body)' }}>
          {displayName}
        </h3>
        {educator.nickname && fullName && (
          <p className="mt-0.5 truncate text-[12px] text-ink-3">{fullName}</p>
        )}

        {/* Location */}
        {educator.country && (
          <p className="mt-1 text-[12px] text-ink-3">{educator.country}</p>
        )}

        {/* Corda placeholder — shown when no graduation data */}
        <div className="mt-3">
          <div
            className="corda"
            style={{ '--c1': '#E5D7B0', '--c2': '#A07843', '--tip': '#1A1814', width: 80 } as React.CSSProperties}
          />
        </div>

        {/* Socials + verified */}
        <div className="pointer-events-auto relative z-10 mt-3 flex flex-wrap items-center gap-1.5">
          {hasVerified && (
            <span className="chip sm green">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg>
              {copy.verified}
            </span>
          )}
          {socials.map(([platform, value]) => {
            const href = normalizeSocialLink(platform as Parameters<typeof normalizeSocialLink>[0], value)
            if (!href) return null
            return (
              <a
                key={platform}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="chip sm"
              >
                {SOCIAL_LABELS[platform] ?? platform.slice(0, 3).toUpperCase()}
              </a>
            )
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-line-soft pt-3 mt-4">
          <span className="eyebrow text-[10px]">
            {socials.length} {locale === 'en' ? 'links' : 'enlaces'}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-ink">
            {copy.open}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true" className="translate-x-0 transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  )
}
