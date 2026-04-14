import Image from 'next/image'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import type { Group } from '@/lib/types'

type Props = {
  group: Group
  locale: string
}

const COPY = {
  es: {
    members: 'miembros',
    countries: 'países',
    cities: 'ciudades',
    open: 'Abrir grupo',
    label: 'Comunidad',
    empty: 'Perfil público de comunidad listo para crecer.',
  },
  pt: {
    members: 'membros',
    countries: 'países',
    cities: 'cidades',
    open: 'Abrir grupo',
    label: 'Comunidade',
    empty: 'Perfil público da comunidade pronto para crescer.',
  },
  en: {
    members: 'members',
    countries: 'countries',
    cities: 'cities',
    open: 'Open group',
    label: 'Community',
    empty: 'Public community profile ready to grow.',
  },
} as const

export default function GroupCard({ group, locale }: Props) {
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.en
  const countries = group.representedCountries?.length ?? 0
  const cities = group.representedCities?.length ?? 0

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card transition-colors duration-200 hover:border-accent/24">
      <Link href={`/${locale}/group/${group.id}`} className="flex h-full flex-col">
        <div className="border-b border-border px-5 pb-5 pt-6">
          <div className="flex items-start gap-4">
            <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-border bg-surface shadow-sm">
              {group.logoUrl ? (
                <Image
                  src={group.logoUrl}
                  alt={group.name}
                  fill
                  sizes="72px"
                  className="object-contain p-3"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-text-muted">
                  {group.name[0]}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
                {copy.label}
              </p>
              <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-text">
                {group.name}
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {group.graduationSystemName ? (
                  <Badge variant="accent">{copy.label + ' · ' + group.graduationSystemName}</Badge>
                ) : null}
                {group.memberCount ? <Badge>{`${group.memberCount} ${copy.members}`}</Badge> : null}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 py-5">
          <p className="text-sm leading-7 text-text-secondary">
            {group.representedCountries && group.representedCountries.length > 0
              ? group.representedCountries.join(' | ')
              : copy.empty}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {countries > 0 ? <Badge>{`${countries} ${copy.countries}`}</Badge> : null}
            {cities > 0 ? <Badge>{`${cities} ${copy.cities}`}</Badge> : null}
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              {group.memberCount ?? 0} {copy.members}
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
      </Link>
    </article>
  )
}
