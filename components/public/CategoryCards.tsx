import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { StatsData } from '@/lib/types'

type Props = Readonly<{
  locale: string
  stats: StatsData
}>

const COPY = {
  es: {
    countLabel: 'Conteo visible',
    laneLabel: 'Entrada del directorio',
  },
  pt: {
    countLabel: 'Contagem visivel',
    laneLabel: 'Entrada do diretorio',
  },
  en: {
    countLabel: 'Live count',
    laneLabel: 'Directory lane',
  },
} as const

export default function CategoryCards({ locale, stats }: Props) {
  const t = useTranslations('categories')
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.en

  const cards = [
    {
      key: 'nucleos',
      href: `/${locale}/map`,
      name: t('nucleos.name'),
      description: t('nucleos.desc'),
      count: stats.nucleos,
      monogram: 'NU',
      tone: 'bg-[radial-gradient(circle_at_top_right,rgba(121,207,114,0.18),transparent_46%)]',
    },
    {
      key: 'groups',
      href: `/${locale}/map?filter=groups`,
      name: t('groups.name'),
      description: t('groups.desc'),
      count: stats.groups,
      monogram: 'GR',
      tone: 'bg-[radial-gradient(circle_at_top_right,rgba(216,173,99,0.18),transparent_48%)]',
    },
    {
      key: 'educators',
      href: `/${locale}/map?filter=educators`,
      name: t('educators.name'),
      description: t('educators.desc'),
      count: stats.educators,
      monogram: 'ED',
      tone: 'bg-[radial-gradient(circle_at_top_right,rgba(121,207,114,0.16),transparent_42%)]',
    },
  ] as const

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.key}
          href={card.href}
          className="group relative overflow-hidden rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.96),rgba(10,18,27,0.98))] p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-accent/30"
        >
          <div aria-hidden="true" className={`absolute inset-0 ${card.tone}`} />
          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-[18px] border border-border bg-surface/80 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                {card.monogram}
              </div>

              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-muted">
                  {copy.countLabel}
                </p>
                <p className="mt-2 text-[32px] font-semibold leading-none tracking-[-0.04em] text-text">
                  {card.count.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">
                {copy.laneLabel}
              </p>
              <h3 className="mt-3 text-[28px] font-semibold leading-[1.02] tracking-[-0.04em] text-text">
                {card.name}
              </h3>
              <p className="mt-4 max-w-[34ch] text-sm leading-7 text-text-secondary">
                {card.description}
              </p>
            </div>

            <div className="mt-auto pt-8">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                {t('explore')}
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
      ))}
    </div>
  )
}
