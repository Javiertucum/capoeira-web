import { useTranslations } from 'next-intl'
import type { StatsData } from '@/lib/types'

type Props = Readonly<{
  locale: string
  stats: StatsData
}>

const META = {
  es: [
    'espacios de entrenamiento visibles',
    'comunidades y organizaciones registradas',
    'perfiles publicos listos para descubrir',
    'paises presentes en el directorio',
  ],
  pt: [
    'espacos de treino visiveis',
    'comunidades e organizacoes registradas',
    'perfis publicos prontos para descobrir',
    'paises presentes no diretorio',
  ],
  en: [
    'training locations visible right now',
    'registered communities and organizations',
    'public profiles ready to discover',
    'countries represented in the directory',
  ],
} as const

export default function StatsBar({ locale, stats }: Props) {
  const t = useTranslations('stats')
  const meta = META[locale as keyof typeof META] ?? META.en

  const items = [
    { value: stats.nucleos, label: t('nucleos'), caption: meta[0] },
    { value: stats.groups, label: t('groups'), caption: meta[1] },
    { value: stats.educators, label: t('educators'), caption: meta[2] },
    { value: stats.countries, label: t('countries'), caption: meta[3] },
  ]

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[22px] border border-border bg-card px-5 py-5 shadow-sm"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted">
            {item.label}
          </p>
          <div className="mt-4 text-[clamp(34px,5vw,46px)] font-semibold leading-none tracking-[-0.04em] text-text">
            {item.value.toLocaleString()}
          </div>
          <p className="mt-3 max-w-[26ch] text-sm leading-6 text-text-secondary">
            {item.caption}
          </p>
        </div>
      ))}
    </div>
  )
}
