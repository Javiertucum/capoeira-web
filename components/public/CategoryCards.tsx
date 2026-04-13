import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { StatsData } from '@/lib/types'

type Props = Readonly<{
  locale: string
  stats: StatsData
}>

export default function CategoryCards({ locale, stats }: Props) {
  const t = useTranslations('categories')

  const cards = [
    {
      key: 'nucleos',
      href: `/${locale}/map`,
      name: t('nucleos.name'),
      description: t('nucleos.desc'),
      count: stats.nucleos,
      monogram: 'NU',
    },
    {
      key: 'groups',
      href: `/${locale}/map?filter=groups`,
      name: t('groups.name'),
      description: t('groups.desc'),
      count: stats.groups,
      monogram: 'GR',
    },
    {
      key: 'educators',
      href: `/${locale}/map?filter=educators`,
      name: t('educators.name'),
      description: t('educators.desc'),
      count: stats.educators,
      monogram: 'ED',
    },
  ] as const

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.key}
          href={card.href}
          className="group relative overflow-hidden rounded-[22px] border border-border bg-card px-6 py-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:bg-[#1b2230]"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          <div
            aria-hidden="true"
            className="absolute right-[-28px] top-[-28px] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(102,187,106,0.18)_0%,rgba(102,187,106,0)_72%)]"
          />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-accent/20 bg-[rgba(102,187,106,0.12)] text-[11px] font-semibold tracking-[0.2em] text-accent">
              {card.monogram}
            </div>
            <div className="text-right">
              <div className="text-[28px] font-semibold leading-none tracking-[-0.03em] text-text">
                {card.count.toLocaleString()}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-text-muted">
                {card.name}
              </div>
            </div>
          </div>

          <div className="relative mt-10">
            <h3 className="text-xl font-semibold tracking-[0.02em] text-text">
              {card.name}
            </h3>
            <p className="mt-3 max-w-[32ch] text-sm leading-6 text-text-secondary">
              {card.description}
            </p>
          </div>

          <div className="relative mt-8 text-[11px] font-semibold uppercase tracking-[0.26em] text-accent">
            {t('explore')}
          </div>
        </Link>
      ))}
    </div>
  )
}
