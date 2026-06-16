import FeatureMockup from '@/components/public/FeatureMockup'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.capoeiraapp.mobile'

function PlayBadgeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 3.6v16.8c0 .5.3.9.7 1.1l10.8-9.5L3.7 2.5c-.4.2-.7.6-.7 1.1z" fill="currentColor" opacity="0.5" />
      <path d="M14.5 12l3.6-3.2L4.4 2.6 14.5 12z" fill="currentColor" />
      <path d="M14.5 12L4.4 21.4l13.7-6.2-3.6-3.2z" fill="currentColor" opacity="0.8" />
      <path d="M18.1 8.8L15.4 12l2.7 3.2 3.7-2c.7-.4.7-1.6 0-2L18.1 8.8z" fill="currentColor" opacity="0.65" />
    </svg>
  )
}

export default function AppHero({ copy }: { copy: any }) {
  return (
    <section className="relative overflow-hidden bg-bg">
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

          <div className="space-y-8 lg:space-y-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm emil-enter">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                {copy.appHeroEyebrow}
              </span>
            </div>

            <h1
              className="max-w-[16ch] font-black text-ink leading-[0.96] tracking-[-0.04em] emil-enter-stagger emil-stagger-1"
              style={{ fontSize: 'clamp(34px, 9vw, 84px)' }}
            >
              {copy.appHeroTitle}
            </h1>

            <p className="max-w-[48ch] text-base text-text-secondary leading-relaxed lg:text-lg emil-enter-stagger emil-stagger-2">
              {copy.appHeroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 emil-enter-stagger emil-stagger-3">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-14 items-center gap-3 rounded-2xl bg-[#211C15] px-8 text-sm font-bold text-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-[2px] active:scale-[0.97] active:translate-y-0"
              >
                <PlayBadgeIcon />
                {copy.appHeroPlayButton}
              </a>
              <span className="inline-flex h-14 items-center rounded-2xl border border-border px-6 text-sm font-bold text-text-muted">
                {copy.appHeroIosNote}
              </span>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end emil-enter-stagger emil-stagger-4">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 scale-90 rounded-full bg-accent/15 blur-3xl"
            />
            <div className="floating-rot relative" style={{ '--rot': '2deg' } as React.CSSProperties}>
              <FeatureMockup type="home" size="lg" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
