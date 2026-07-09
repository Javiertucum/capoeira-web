type Step = { t: string; d: string }

export default function AppHowItWorks({ copy }: { copy: any }) {
  const steps: Step[] = copy.howSteps ?? []
  if (steps.length === 0) return null

  return (
    <section className="border-t border-border bg-surface/40">
      <div className="page-shell py-14 lg:py-20">
        <h2
          className="mb-8 font-black text-ink leading-[1] tracking-[-0.03em] lg:mb-12"
          style={{ fontSize: 'clamp(24px, 3.4vw, 40px)' }}
        >
          {copy.howTitle}
        </h2>

        <div className="grid gap-8 sm:grid-cols-3 lg:gap-12">
          {steps.map((step, i) => (
            <div key={step.t} className="relative">
              <div className="flex items-center gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-bold"
                  style={{ background: 'var(--accent)', color: 'var(--bg)' }}
                >
                  {i + 1}
                </span>
                {i < steps.length - 1 && (
                  <div aria-hidden className="hidden flex-1 border-t-2 border-dashed border-border sm:block" />
                )}
              </div>
              <h3 className="mt-4 text-lg font-black tracking-tight text-ink">{step.t}</h3>
              <p className="mt-1.5 max-w-[38ch] text-sm leading-relaxed text-text-secondary lg:text-base">
                {step.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
