import { useTranslations } from 'next-intl'
import type { StatsData } from '@/lib/types'

type Props = Readonly<{
  stats: StatsData
}>

export default function StatsBar({ stats }: Props) {
  const t = useTranslations('stats')

  const items = [
    { value: stats.nucleos, label: t('nucleos') },
    { value: stats.groups, label: t('groups') },
    { value: stats.educators, label: t('educators') },
    { value: stats.countries, label: t('countries') },
  ]

  return (
    <div className="grid w-full max-w-[980px] grid-cols-2 overflow-hidden rounded-[22px] border border-border bg-card/95 shadow-[0_24px_80px_var(--shadow)] md:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`relative px-5 py-6 text-center sm:px-7 ${
            index < items.length - 1 ? 'md:border-r md:border-border' : ''
          } ${index < 2 ? 'border-b border-border md:border-b-0' : ''}`}
        >
          <div className="mb-2 text-[clamp(28px,4vw,42px)] font-semibold leading-none tracking-[-0.03em] text-text">
            {item.value.toLocaleString()}
            {item.value > 0 ? (
              <span className="ml-1 align-top text-sm text-accent">+</span>
            ) : null}
          </div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-text-muted">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
