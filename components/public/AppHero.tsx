import ScreenshotFrame from '@/components/public/ScreenshotFrame'

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

type Stats = { groups: number; nucleos: number; educators: number; countries: number }

export default function AppHero({ copy, stats }: { copy: any; stats?: Stats }) {
  const statItems = stats
    ? [
        { value: stats.groups, label: copy.statGroups },
        { value: stats.nucleos, label: copy.statNucleos },
        { value: stats.educators, label: copy.statEducators },
        { value: stats.countries, label: copy.statCountries },
      ]
    : []

  return (
    <section className="relative overflow-hidden bg-bg">
      {/* Subtle dot grid on right side behind phone */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-full w-[55%] text-text-muted opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="page-shell relative z-10 py-16 lg:py-24">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_400px] lg:gap-10">

          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-accent/20 bg-accent/8 px-4 py-2 emil-enter">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-ink">
                {copy.appHeroEyebrow}
              </span>
            </div>

            <h1
              className="max-w-[14ch] font-black text-ink leading-[0.96] tracking-[-0.04em] emil-enter-stagger emil-stagger-1"
              style={{ fontSize: 'clamp(34px, 9vw, 84px)' }}
            >
              {copy.appHeroTitle}
            </h1>

            <p className="max-w-[46ch] text-base text-text-secondary leading-relaxed lg:text-lg emil-enter-stagger emil-stagger-2">
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

            {/* Stats strip */}
            {statItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-border pt-6 emil-enter-stagger emil-stagger-4">
                {statItems.map(({ value, label }, i) => (
                  <div key={label} className="flex items-center gap-6">
                    <div>
                      <p className="text-2xl font-black text-ink tabular-nums">{value}</p>
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">{label}</p>
                    </div>
                    {i < statItems.length - 1 && <div className="hidden h-7 w-px bg-border sm:block" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phone mockup — bottom-aligned with section */}
          <div className="relative flex justify-center self-end lg:justify-end emil-enter-stagger emil-stagger-4">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 top-1/4 rounded-full bg-accent/18 blur-[80px]"
            />
            <div className="floating-rot relative" style={{ '--rot': '2deg' } as React.CSSProperties}>
              <ScreenshotFrame src="/mockups/home.png" alt="Agenda Capoeiragem app home screen" size="lg" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
