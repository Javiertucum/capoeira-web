import BetaRegistrationForm from '@/components/public/BetaRegistrationForm'

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
        <div className="grid gap-16 lg:grid-cols-[1fr_420px] lg:gap-24">

          {/* ── Left: statement ── */}
          <div className="space-y-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
              Agenda Capoeiragem
            </p>

            <h2
              className="font-black leading-[0.95] tracking-[-0.04em] text-white"
              style={{ fontSize: 'clamp(38px, 6vw, 68px)' }}
            >
              {copy.betaTitle}
            </h2>

            <p className="max-w-[40ch] text-base leading-relaxed text-white/55 lg:text-lg">
              {copy.betaBody}
            </p>

            {/* Benefits list — replaces fake "100% / Global" metrics */}
            <ul className="space-y-3 pt-4">
              {[
                'Disponible en iOS y Android',
                'Sin tarjeta de crédito requerida',
                'Configuración en menos de 5 minutos',
              ].map((item) => (
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
          </div>

          {/* ── Right: registration form ── */}
          {/* Single-level wrapper — no nested cards */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm lg:p-10">
            <BetaRegistrationForm locale={locale} />
          </div>

        </div>
      </div>
    </section>
  )
}
