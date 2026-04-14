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
      {items.map((item, index) => (
        <div
          key={item.label}
          className="relative overflow-hidden rounded-[24px] border border-border bg-[linear-gradient(180deg,rgba(17,26,38,0.95),rgba(10,18,27,0.98))] px-5 py-5 shadow-[0_18px_48px_var(--shadow-soft)]"
        >
          <div
            aria-hidden="true"
            className={`absolute right-[-26px] top-[-30px] h-24 w-24 rounded-full ${
              index % 2 === 0
                ? 'bg-[radial-gradient(circle,rgba(121,207,114,0.18)_0%,rgba(121,207,114,0)_72%)]'
                : 'bg-[radial-gradient(circle,rgba(216,173,99,0.18)_0%,rgba(216,173,99,0)_72%)]'
            }`}
          />

          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted">
              {item.label}
            </p>
            <div className="mt-4 text-[clamp(34px,5vw,48px)] font-semibold leading-none tracking-[-0.05em] text-text">
              {item.value.toLocaleString()}
            </div>
            <p className="mt-4 max-w-[26ch] text-sm leading-6 text-text-secondary">
              {item.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
