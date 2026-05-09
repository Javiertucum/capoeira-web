import FeatureMockup from '@/components/public/FeatureMockup'
import TutorialSection from '@/components/public/TutorialSection'

function SectionLabel({
  number,
  label,
  accent = false,
}: {
  number: string
  label: string
  accent?: boolean
}) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold tracking-widest"
        style={{
          background: accent ? 'var(--accent)' : 'var(--ink)',
          color: 'var(--bg)',
        }}
      >
        {number}
      </span>
      <h2 className="text-2xl font-black tracking-tight text-ink lg:text-3xl">{label}</h2>
      <div className="hidden flex-1 border-t border-border sm:block" />
    </div>
  )
}

function FeatureRow({
  index,
  title,
  description,
}: {
  index: number
  title: string
  description: string
}) {
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

export default function FeaturesShowcase({ copy, locale }: { copy: any; locale: string }) {
  return (
    <section id="features" className="bg-bg py-24 lg:py-32">
      <div className="page-shell">

        {/* ── Section intro ── */}
        <div className="mb-24 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="max-w-[18ch] font-black leading-[0.96] tracking-[-0.04em] text-ink"
            style={{ fontSize: 'clamp(38px, 5vw, 72px)' }}
          >
            {copy.showcaseTitle}
          </h2>
          <p className="max-w-[38ch] text-base leading-relaxed text-text-secondary lg:pb-2 lg:text-lg">
            {copy.showcaseBody}
          </p>
        </div>

        {/* ── 01 Educators ── */}
        <div className="mb-28">
          <SectionLabel number="01" label={copy.educatorSubtitle} accent />

          <div className="grid items-start gap-12 lg:grid-cols-[1fr_340px]">
            {/* Feature rows — NO cards */}
            <div>
              {copy.educatorFeatures.map((f: any, i: number) => (
                <FeatureRow
                  key={f.t}
                  index={i + 1}
                  title={f.t}
                  description={f.d}
                />
              ))}
              {/* Closing rule */}
              <div className="border-t border-border" />
            </div>

            {/* Sticky mockup */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <div className="floating">
                  <FeatureMockup type="attendance" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 02 Students ── */}
        <div className="mb-28">
          <SectionLabel number="02" label={copy.studentSubtitle} />

          <div className="grid items-start gap-12 lg:grid-cols-[340px_1fr]">
            {/* Sticky mockup — left for visual rhythm change */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <div className="floating">
                  <FeatureMockup type="graduation" />
                </div>
              </div>
            </div>

            {/* Feature rows */}
            <div>
              {copy.studentFeatures.map((f: any, i: number) => (
                <FeatureRow
                  key={f.t}
                  index={i + 1}
                  title={f.t}
                  description={f.d}
                />
              ))}
              <div className="border-t border-border" />
            </div>
          </div>
        </div>

        {/* ── 03 Advanced ecosystem — full-width horizontal strip ── */}
        <div className="mb-28">
          <SectionLabel number="03" label={('advancedTitle' in copy) ? (copy as any).advancedTitle : 'Ecosistema Avanzado'} />

          <div className="grid gap-px bg-border sm:grid-cols-3">
            {(('advancedFeatures' in copy) ? (copy as any).advancedFeatures : []).map(
              (f: any, i: number) => (
                <div key={f.t} className="group relative bg-bg p-8 lg:p-10">
                  <div className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-ink transition-colors duration-150 ease-[var(--ease-out)] group-hover:text-accent">
                    {f.t}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{f.d}</p>

                  {/* Subtle app preview — inline, not in a card */}
                  <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
                    <div className="pointer-events-none scale-[0.88] origin-top transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[0.92]">
                      <FeatureMockup type={f.mockup} />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ── Tutorials ── */}
        <TutorialSection locale={locale} />

      </div>
    </section>
  )
}
