import Link from 'next/link'
import FeatureMockup from '@/components/public/FeatureMockup'

export default function Hero({ copy, stats }: { copy: any; stats: any }) {
  return (
    <section className="relative overflow-hidden bg-bg">
      {/* Concentric ring accent — geometric, not blur-ball generic */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2"
      >
        <div className="h-[640px] w-[640px] rounded-full border border-accent/8" />
        <div className="absolute inset-[80px] rounded-full border border-accent/10" />
        <div className="absolute inset-[160px] rounded-full border border-accent/14" />
      </div>

      <div className="page-shell relative z-10 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-10">

          {/* ── Left column — content ── */}
          <div className="space-y-8 lg:space-y-10">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-white px-4 py-2 shadow-sm emil-enter">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                {copy.eyebrow}
              </span>
            </div>

            {/* Headline — massive, tight, left-aligned */}
            <div className="space-y-1 emil-enter-stagger emil-stagger-1">
              <h1
                className="font-black text-ink leading-[0.92] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(54px, 8vw, 100px)' }}
              >
                {copy.heroLine1}
              </h1>
              <h1
                className="font-black leading-[0.92] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(54px, 8vw, 100px)', color: 'var(--accent)' }}
              >
                {copy.heroEm}
              </h1>
              <h1
                className="font-black text-ink leading-[0.92] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(54px, 8vw, 100px)' }}
              >
                {copy.heroLine2} {copy.heroLine3}
              </h1>
            </div>

            {/* Body */}
            <p className="max-w-[46ch] text-base text-text-secondary leading-relaxed lg:text-lg emil-enter-stagger emil-stagger-2">
              {copy.body}
            </p>

            {/* CTA + inline stats */}
            <div className="flex flex-wrap items-center gap-6 pt-2 emil-enter-stagger emil-stagger-3">
              <Link
                href="#join"
                className="group inline-flex h-14 items-center gap-3 rounded-2xl bg-accent px-8 text-sm font-bold text-white shadow-[0_4px_24px_-4px_oklch(0.56_0.19_158/0.38)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_-4px_oklch(0.56_0.19_158/0.48)] active:scale-[0.97] active:translate-y-0"
              >
                {copy.ctaHero}
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1"
                >
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              {/* Stats — woven into the CTA row, not a separate block */}
              <div className="flex items-center gap-5 border-l border-border pl-5">
                {[
                  { val: stats.educators, label: copy.statsLabel1 },
                  { val: stats.nucleos,   label: copy.statsLabel2 },
                  { val: stats.countries, label: copy.statsLabel3 },
                ].map((s) => (
                  <div key={s.label} className="text-left">
                    <p className="font-mono text-xl font-black text-ink tabular-nums leading-none">
                      {s.val}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column — phone mockup ── */}
          <div className="relative flex justify-center lg:justify-end emil-enter-stagger emil-stagger-4">
            {/* Green halo — subtle, not garish */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 scale-90 rounded-full bg-accent/15 blur-3xl"
            />
            <div
              className="floating-rot relative"
              style={{ '--rot': '2deg' } as React.CSSProperties}
            >
              <FeatureMockup type="home" size="lg" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
