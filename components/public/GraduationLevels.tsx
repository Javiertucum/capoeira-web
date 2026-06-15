import CordaVisual from '@/components/public/CordaVisual'
import type { GraduationLevel } from '@/lib/types'

export default function GraduationLevels({
  levels,
  labels,
}: {
  levels: GraduationLevel[]
  labels: {
    title: string
    infantil: string
    juvenil: string
    estagiario: string
    adult: string
    general: string
  }
}) {
  if (levels.length === 0) return null

  const groups = [
    { key: 'infantil', label: labels.infantil, levels: levels.filter((l) => l.category === 'infantil' && !l.isEstagiario) },
    { key: 'juvenil', label: labels.juvenil, levels: levels.filter((l) => l.category === 'juvenil' && !l.isEstagiario) },
    { key: 'estagiario', label: labels.estagiario, levels: levels.filter((l) => l.isEstagiario) },
    { key: 'adult', label: labels.adult, levels: levels.filter((l) => l.category === 'adult' && !l.isEstagiario) },
    { key: 'general', label: labels.general, levels: levels.filter((l) => !l.category && !l.isEstagiario) },
  ].filter((g) => g.levels.length > 0)

  const content = (
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.key}>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">{g.label}</p>
          <div className="flex flex-wrap gap-2">
            {g.levels.map((level) => (
              <span
                key={level.id}
                className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-ink"
              >
                <CordaVisual colors={level.colors} tipColorLeft={level.tipColorLeft} tipColorRight={level.tipColorRight} />
                {level.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="mt-10 lg:mt-0">
      <details className="rounded-2xl border border-border bg-card p-4 lg:hidden" open={levels.length <= 6}>
        <summary className="eyebrow acc cursor-pointer">{labels.title}</summary>
        <div className="mt-4">{content}</div>
      </details>

      <div className="hidden lg:sticky lg:top-24 lg:block">
        <p className="eyebrow acc mb-3">{labels.title}</p>
        {content}
      </div>
    </div>
  )
}
