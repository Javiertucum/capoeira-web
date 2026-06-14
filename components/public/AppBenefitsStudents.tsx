import FeatureMockup from '@/components/public/FeatureMockup'

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

export default function AppBenefitsStudents({ copy }: { copy: any }) {
  return (
    <section className="bg-bg py-24 lg:py-32">
      <div className="page-shell">

        <div className="mb-16 flex items-center gap-4">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold tracking-widest"
            style={{ background: 'var(--ink)', color: 'var(--bg)' }}
          >
            02
          </span>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-ink lg:text-3xl">{copy.studentsTitle}</h2>
            <p className="mt-2 max-w-[60ch] text-sm text-text-secondary lg:text-base">{copy.studentsIntro}</p>
          </div>
          <div className="hidden flex-1 border-t border-border sm:block" />
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[340px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="floating">
                <FeatureMockup type="map" />
              </div>
            </div>
          </div>

          <div>
            {copy.studentsItems.map((f: { t: string; d: string }, i: number) => (
              <FeatureRow key={f.t} index={i + 1} title={f.t} description={f.d} />
            ))}
            <div className="border-t border-border" />
          </div>
        </div>

      </div>
    </section>
  )
}
