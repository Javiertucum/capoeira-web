import Link from 'next/link'
import type { Group } from '@/lib/types'

type Props = {
  group: Group
  locale: string
}

export default function GroupCard({ group, locale }: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[22px] border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_8px_32px_rgba(0,0,0,0.28)]">
      <Link href={`/${locale}/group/${group.id}`} className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            {group.logoUrl ? (
              <img
                src={group.logoUrl}
                alt={group.name}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-contain p-2"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-text-muted">
                {group.name[0]}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold text-text transition-colors group-hover:text-accent">
              {group.name}
            </h3>
            <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-text-muted">
              {group.memberCount ?? 0} members
            </p>
          </div>
        </div>

        {group.representedCountries && group.representedCountries.length > 0 && (
          <p className="mt-4 truncate text-xs leading-5 text-text-secondary">
            {group.representedCountries.join(' · ')}
          </p>
        )}
      </Link>
    </article>
  )
}
