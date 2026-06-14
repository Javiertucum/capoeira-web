import Link from 'next/link'
import FeatureMockup from '@/components/public/FeatureMockup'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.capoeiraapp.mobile'

export default function CallToAction({ copy, locale }: { copy: any; locale: string }) {
  return (
    <section id="join" className="relative overflow-hidden bg-ink">
      {/* Subtle dot-grid texture — same as marquee section for visual language consistency */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Green atmospheric glow — top-left, out of the way */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-64 -top-64 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="page-shell relative z-10 py-24 lg:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_420px] lg:gap-24">

          {/* ── Left: statement ── */}
          <div className="space-y-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
              Agenda Capoeiragem
            </p>

            <h2
              className="font-black leading-[0.95] tracking-[-0.04em] text-white"
              style={{ fontSize: 'clamp(38px, 6vw, 68px)' }}
            >
              {copy.downloadTitle}
            </h2>

            <p className="max-w-[40ch] text-base leading-relaxed text-white/55 lg:text-lg">
              {copy.downloadBody}
            </p>

            {/* Benefits list */}
            <ul className="space-y-3 pt-4">
              {copy.downloadBenefits.map((item: string) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-14 items-center gap-3 rounded-2xl bg-accent px-8 text-sm font-bold text-white shadow-[0_4px_24px_-4px_oklch(0.56_0.19_158/0.38)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_-4px_oklch(0.56_0.19_158/0.48)] active:scale-[0.97] active:translate-y-0"
              >
                {copy.downloadButton}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <Link
                href={`/${locale}/app`}
                className="inline-flex h-14 items-center gap-2 rounded-2xl border border-white/15 px-6 text-sm font-bold text-white/70 transition-colors duration-150 ease-[var(--ease-out)] hover:text-white hover:border-white/30"
              >
                {copy.downloadLearnMore}
              </Link>
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/30">
              {copy.iosNote}
            </p>
          </div>

          {/* ── Right: phone mockup ── */}
          <div className="relative mx-auto hidden lg:block">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 scale-90 rounded-full bg-accent/15 blur-3xl"
            />
            <div className="floating-rot relative" style={{ '--rot': '-2deg' } as React.CSSProperties}>
              <FeatureMockup type="home" size="lg" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
