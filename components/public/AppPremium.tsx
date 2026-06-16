const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.capoeiraapp.mobile'

function CheckIcon({ muted }: { muted?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={muted ? 'var(--text-muted)' : 'var(--accent)'}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function PlayBadgeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 3.6v16.8c0 .5.3.9.7 1.1l10.8-9.5L3.7 2.5c-.4.2-.7.6-.7 1.1z" fill="currentColor" opacity="0.5" />
      <path d="M14.5 12l3.6-3.2L4.4 2.6 14.5 12z" fill="currentColor" />
      <path d="M14.5 12L4.4 21.4l13.7-6.2-3.6-3.2z" fill="currentColor" opacity="0.8" />
      <path d="M18.1 8.8L15.4 12l2.7 3.2 3.7-2c.7-.4.7-1.6 0-2L18.1 8.8z" fill="currentColor" opacity="0.65" />
    </svg>
  )
}

export default function AppPremium({ copy }: { copy: any }) {
  const freeItems: string[] = copy.premiumFreeItems ?? []
  const proItems: string[] = copy.premiumProItems ?? []

  return (
    <section className="bg-bg border-t border-border">
      <div className="page-shell py-24 lg:py-32">
        {/* Header */}
        <div className="mb-14 max-w-[54ch]">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-accent-ink">
            {copy.premiumEyebrow}
          </p>
          <h2
            className="font-black text-ink leading-[0.96] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
          >
            {copy.premiumTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary lg:text-lg">
            {copy.premiumBody}
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          {/* Free card */}
          <div className="rounded-[24px] border border-border bg-bg p-8">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-text-muted">{copy.premiumFreeLabel}</p>
              <p className="mt-1 text-3xl font-black text-ink">{copy.premiumFreePrice}</p>
            </div>
            <ul className="space-y-3.5">
              {freeItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-sm leading-snug text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl border border-border text-sm font-bold text-ink transition-colors duration-150 hover:border-ink/40"
            >
              <PlayBadgeIcon />
              {copy.premiumFreeCta}
            </a>
          </div>

          {/* Pro card — always dark regardless of theme */}
          <div
            className="relative overflow-hidden rounded-[24px] p-8"
            style={{ background: '#0f1318' }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl"
              style={{ background: 'var(--accent)', opacity: 0.2 }}
            />
            <div className="relative">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>
                    {copy.premiumProLabel}
                  </p>
                  <p className="mt-1 text-3xl font-black text-white">{copy.premiumProPrice}</p>
                  <p className="mt-1 text-xs text-white/50">{copy.premiumProPeriod}</p>
                </div>
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  Pro
                </span>
              </div>

              <ul className="space-y-3.5">
                {proItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm leading-snug text-white/85">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl text-sm font-bold text-white transition-[transform,opacity] duration-150 hover:-translate-y-[1px] hover:opacity-90 active:translate-y-0 active:opacity-100"
                style={{ background: 'var(--accent)' }}
              >
                <PlayBadgeIcon />
                {copy.premiumProCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
