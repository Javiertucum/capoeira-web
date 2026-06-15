import ScreenshotFrame from '@/components/public/ScreenshotFrame'
import type { FeatureMockupType } from '@/components/public/FeatureMockup'

function FeatureRow({ index, title, description }: { index: number; title: string; description: string }) {
  return (
    <div className="group grid cursor-default grid-cols-[3.5rem_1fr] gap-6 border-t border-border py-7 transition-colors duration-150 ease-[var(--ease-out)] hover:bg-accent/[0.03]">
      <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-text-muted transition-colors duration-150 ease-[var(--ease-out)] group-hover:text-accent mt-0.5">
        {String(index).padStart(2, '0')}
      </span>
      <div>
        <h3 className="text-base font-bold text-ink transition-colors duration-150 ease-[var(--ease-out)] group-hover:text-accent">
          {title}
        </h3>
        <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>
    </div>
  )
}

export default function TutorialSectionBlock({
  id,
  index,
  title,
  intro,
  steps,
  mockups,
}: {
  id: string
  index: number
  title: string
  intro: string
  steps: readonly { t: string; d: string }[]
  mockups: readonly FeatureMockupType[]
}) {
  return (
    <section id={id} className="scroll-mt-28 py-16 lg:py-20">
      <div className="mb-12 flex items-center gap-4">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold tracking-widest"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}
        >
          {String(index).padStart(2, '0')}
        </span>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-ink lg:text-3xl">{title}</h2>
          <p className="mt-2 max-w-[60ch] text-sm text-text-secondary lg:text-base">{intro}</p>
        </div>
        <div className="hidden flex-1 border-t border-border sm:block" />
      </div>

      <div className="grid items-start gap-12 lg:grid-cols-[1fr_340px]">
        <div>
          {steps.map((step, i) => (
            <FeatureRow key={step.t} index={i + 1} title={step.t} description={step.d} />
          ))}
          <div className="border-t border-border" />
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            {mockups.map((type) => (
              <div key={type} className="floating">
                <ScreenshotFrame type={type} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
