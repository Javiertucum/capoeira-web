import ScreenshotFrame from '@/components/public/ScreenshotFrame'
import { type FeatureMockupType } from '@/components/public/FeatureMockup'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.capoeiraapp.mobile'

type SpotlightItem = { tag: string; title: string; desc: string; mockup: FeatureMockupType }

function SpotlightRow({ item, flip }: { item: SpotlightItem; flip?: boolean }) {
  return (
    <div
      className={[
        'border-b border-border py-10 lg:py-14',
        'flex flex-col items-center gap-8',
        'lg:flex-row lg:gap-16',
        flip ? 'lg:flex-row-reverse' : '',
      ].join(' ')}
    >
      <div className="w-full space-y-4 lg:flex-1 lg:max-w-[50ch]">
        <span
          className="inline-block rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em]"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}
        >
          {item.tag}
        </span>
        <h3
          className="font-black text-ink leading-[0.96] tracking-[-0.035em]"
          style={{ fontSize: 'clamp(24px, 2.6vw, 36px)' }}
        >
          {item.title}
        </h3>
        <p className="text-base leading-relaxed text-text-secondary">
          {item.desc}
        </p>
      </div>
      <div className="flex shrink-0 justify-center">
        <ScreenshotFrame src={`/mockups/${item.mockup}.png`} alt={item.title} size="default" />
      </div>
    </div>
  )
}

function MiniCard({ item }: { item: SpotlightItem }) {
  return (
    <div className="rounded-2xl border border-border p-5">
      <span
        className="inline-block rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em]"
        style={{ background: 'var(--accent)', color: 'var(--bg)' }}
      >
        {item.tag}
      </span>
      <h4 className="mt-3 text-base font-black text-ink">{item.title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{item.desc}</p>
    </div>
  )
}

export default function AppBenefitsEducators({ copy }: { copy: any }) {
  const spotlights: SpotlightItem[] = copy.educatorsSpotlights ?? []
  const featured = spotlights.slice(0, 2)
  const rest = spotlights.slice(2)

  return (
    <section className="bg-bg">
      <div className="page-shell">
        <div className="flex items-center gap-4 border-b border-border py-10 lg:py-16">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold tracking-widest"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            01
          </span>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-ink lg:text-3xl">{copy.educatorsTitle}</h2>
            <p className="mt-1 max-w-[60ch] text-sm text-text-secondary lg:text-base">{copy.educatorsIntro}</p>
          </div>
          <div className="hidden flex-1 border-t border-border sm:block" />
        </div>

        {featured.map((item, i) => (
          <SpotlightRow key={item.tag} item={item} flip={i % 2 !== 0} />
        ))}

        {rest.length > 0 && (
          <div className="grid gap-4 border-b border-border py-10 sm:grid-cols-2 lg:py-12">
            {rest.map((item) => (
              <MiniCard key={item.tag} item={item} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between py-8 border-b border-border">
          <p className="text-sm text-text-secondary">{copy.educatorsCtaBody ?? copy.educatorsIntro}</p>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-8 shrink-0 inline-flex h-10 items-center gap-2 rounded-xl bg-accent-solid px-5 text-[13px] font-bold text-white shadow-[0_4px_16px_-4px_oklch(0.56_0.19_158/0.4)] transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[0_6px_20px_-4px_oklch(0.56_0.19_158/0.5)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 3.6v16.8c0 .5.3.9.7 1.1l10.8-9.5L3.7 2.5c-.4.2-.7.6-.7 1.1z" fill="currentColor" opacity="0.6"/><path d="M14.5 12l3.6-3.2L4.4 2.6 14.5 12z" fill="currentColor"/><path d="M14.5 12L4.4 21.4l13.7-6.2-3.6-3.2z" fill="currentColor" opacity="0.8"/><path d="M18.1 8.8L15.4 12l2.7 3.2 3.7-2c.7-.4.7-1.6 0-2L18.1 8.8z" fill="currentColor" opacity="0.65"/></svg>
            {copy.educatorsCtaLabel ?? 'Descargar gratis'}
          </a>
        </div>
      </div>
    </section>
  )
}
