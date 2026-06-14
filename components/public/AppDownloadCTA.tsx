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

export default function AppDownloadCTA({ copy }: { copy: any }) {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-64 -top-64 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="page-shell relative z-10 py-24 lg:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_420px] lg:gap-24">

          <div className="space-y-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
              Agenda Capoeiragem
            </p>

            <h2
              className="font-black leading-[0.95] tracking-[-0.04em] text-white"
              style={{ fontSize: 'clamp(38px, 6vw, 68px)' }}
            >
              {copy.appCtaTitle}
            </h2>

            <p className="max-w-[40ch] text-base leading-relaxed text-white/55 lg:text-lg">
              {copy.appCtaBody}
            </p>

            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 items-center gap-3 rounded-2xl bg-accent px-8 text-sm font-bold text-white shadow-[0_4px_24px_-4px_oklch(0.56_0.19_158/0.38)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_-4px_oklch(0.56_0.19_158/0.48)] active:scale-[0.97] active:translate-y-0"
            >
              <PlayBadgeIcon />
              {copy.appCtaButton}
            </a>
          </div>

          <div className="relative mx-auto hidden lg:block">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 scale-90 rounded-full bg-accent/15 blur-3xl"
            />
            <div className="floating-rot relative" style={{ '--rot': '-2deg' } as React.CSSProperties}>
              <FeatureMockup type="event" size="lg" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
