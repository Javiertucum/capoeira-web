export default function TutorialsHero({ copy }: { copy: any }) {
  return (
    <section className="relative overflow-hidden bg-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2"
      >
        <div className="h-[480px] w-[480px] rounded-full border border-accent/8" />
        <div className="absolute inset-[60px] rounded-full border border-accent/10" />
        <div className="absolute inset-[120px] rounded-full border border-accent/14" />
      </div>

      <div className="page-shell relative z-10 py-16 lg:py-24">
        <div className="max-w-[60ch] space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-white px-4 py-2 shadow-sm emil-enter">
            <span className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary">
              {copy.eyebrow}
            </span>
          </div>

          <h1
            className="font-black text-ink leading-[0.98] tracking-[-0.04em] emil-enter-stagger emil-stagger-1"
            style={{ fontSize: 'clamp(38px, 5.5vw, 68px)' }}
          >
            {copy.title}
          </h1>

          <p className="max-w-[52ch] text-base text-text-secondary leading-relaxed lg:text-lg emil-enter-stagger emil-stagger-2">
            {copy.subtitle}
          </p>
        </div>
      </div>
    </section>
  )
}
