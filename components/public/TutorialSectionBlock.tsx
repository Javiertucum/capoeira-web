import ScreenshotFrame from '@/components/public/ScreenshotFrame'
import type { FeatureMockupType } from '@/components/public/FeatureMockup'

type CalloutType = 'tip' | 'info' | 'warning'

export type CalloutLabels = { tip: string; note: string; warning: string }

function Callout({ type, label, children }: { type: CalloutType; label: string; children: React.ReactNode }) {
  const cfg = {
    tip: {
      bg: 'bg-emerald-500/8 dark:bg-emerald-500/10',
      border: 'border-emerald-500/25',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-emerald-500">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
        </svg>
      ),
      labelClass: 'text-emerald-600 dark:text-emerald-400',
    },
    info: {
      bg: 'bg-accent/6',
      border: 'border-accent/20',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-accent">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
        </svg>
      ),
      labelClass: 'text-accent-ink',
    },
    warning: {
      bg: 'bg-amber-500/8',
      border: 'border-amber-500/25',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-amber-500">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" />
        </svg>
      ),
      labelClass: 'text-amber-600 dark:text-amber-400',
    },
  }[type]

  return (
    <div className={`mt-4 flex gap-3 rounded-xl border ${cfg.bg} ${cfg.border} px-4 py-3`}>
      <span className="mt-0.5">{cfg.icon}</span>
      <div>
        <span className={`text-xs font-bold uppercase tracking-wider ${cfg.labelClass}`}>{label} — </span>
        <span className="text-sm text-text-secondary leading-relaxed">{children}</span>
      </div>
    </div>
  )
}

export type StepItem = {
  t: string
  d: string
  tip?: string
  note?: string
  warn?: string
}

function StepBlock({
  index,
  step,
  isLast,
  calloutLabels,
}: {
  index: number
  step: StepItem
  isLast: boolean
  calloutLabels: CalloutLabels
}) {
  return (
    <div className="relative pl-12 pb-8">
      {!isLast && (
        <span className="absolute left-[15px] top-9 bottom-0 w-px bg-border" aria-hidden />
      )}
      <div
        className="absolute left-0 top-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold font-mono"
        style={{ background: 'var(--accent)', color: 'var(--bg)' }}
      >
        {index}
      </div>
      <h3 className="pt-0.5 text-base font-bold text-ink leading-snug">{step.t}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary max-w-[62ch]">{step.d}</p>
      {step.tip && <Callout type="tip" label={calloutLabels.tip}>{step.tip}</Callout>}
      {step.note && <Callout type="info" label={calloutLabels.note}>{step.note}</Callout>}
      {step.warn && <Callout type="warning" label={calloutLabels.warning}>{step.warn}</Callout>}
    </div>
  )
}

export default function TutorialSectionBlock({
  id,
  title,
  category,
  intro,
  steps,
  mockup,
  calloutLabels,
}: {
  id: string
  title: string
  category: string
  intro: string
  steps: readonly StepItem[]
  mockup?: FeatureMockupType
  calloutLabels: CalloutLabels
}) {
  return (
    <section id={id} className="scroll-mt-24 py-14 lg:py-16 border-b border-border last:border-b-0">
      {/* Section header */}
      <div className="mb-8">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-ink">{category}</p>
        <h2 className="text-2xl font-black tracking-tight text-ink lg:text-[1.75rem]">{title}</h2>
        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-text-secondary lg:text-base">{intro}</p>
      </div>

      {/* Steps + optional mockup */}
      <div className={`grid items-start gap-10 ${mockup ? 'lg:grid-cols-[1fr_300px]' : ''}`}>
        <div>
          {steps.map((step, i) => (
            <StepBlock key={step.t} index={i + 1} step={step} isLast={i === steps.length - 1} calloutLabels={calloutLabels} />
          ))}
        </div>

        {mockup && (
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="floating">
                <ScreenshotFrame type={mockup} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
