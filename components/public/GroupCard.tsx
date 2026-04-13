import Image from 'next/image'
import Link from 'next/link'
import type { Group } from '@/lib/types'

type Props = {
  group: Group
  locale: string
}

export default function GroupCard({ group, locale }: Props) {
  return (
    <article className="group flex flex-col rounded-[22px] border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-accent/35">
      <Link href={`/${locale}/nucleos/${group.id}`} className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            {group.logoUrl ? (
              <Image
                src={group.logoUrl}
                alt={group.name}
                fill
                className="object-contain p-2"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-text-muted">
                {group.name[0]}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-text group-hover:text-accent transition-colors">
              {group.name}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-wider text-text-muted">
              {group.memberCount ?? 0} miembros
            </p>
          </div>
        </div>

        {group.representedCountries && group.representedCountries.length > 0 && (
          <p className="mt-4 truncate text-xs text-text-secondary">
            {group.representedCountries.join(', ')}
          </p>
        )}
      </Link>
    </article>
  )
}
