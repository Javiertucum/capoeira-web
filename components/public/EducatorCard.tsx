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

  return (
    <article className="card group relative flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl" style={{ borderRadius: 'var(--radius-xl)' }}>
      {/* Invisible full-card link */}
      <Link
        href={`/${locale}/educator/${educator.uid}`}
        className="absolute inset-0 z-10"
        aria-label={displayName}
      />

      {/* ── Portrait ── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted">
        {educator.avatarUrl ? (
          <Image
            src={educator.avatarUrl}
            alt={displayName}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl font-black text-ink-4 opacity-20">
            {initials}
          </div>
        )}
        
        {/* Role floating chip */}
        <div className="absolute bottom-4 left-4 z-20">
          <span className="chip acc font-black uppercase tracking-wider text-[9px] shadow-sm">
            {educator.role || (locale === 'en' ? 'Educator' : 'Educador')}
          </span>
        </div>

        {/* Country chip top-right */}
        {educator.country && (
          <div className="absolute top-4 right-4 z-20">
            <span className="chip sm bg-black/40 text-white border-white/20 backdrop-blur-md">
              {educator.country}
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col p-6">
        {/* Name */}
        <h3 className="text-[22px] font-black leading-tight tracking-[-0.03em] text-ink" style={{ fontFamily: 'var(--font-display)' }}>
          {displayName}
        </h3>
        
        {educator.nickname && fullName && (
          <p className="mt-1 truncate text-[13px] font-medium text-ink-3">{fullName}</p>
        )}

        {/* Action icons row */}
        <div className="mt-auto pt-6 flex items-center justify-between border-t border-line-soft/60">
          <div className="flex gap-2">
            {socials.map(([platform]) => (
              <div key={platform} className="h-2 w-2 rounded-full bg-accent-soft" title={platform} />
            ))}
          </div>
          <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-ink opacity-40 group-hover:opacity-100 group-hover:text-accent-ink transition-all">
            {copy.open}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="translate-x-0 transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  )
}
