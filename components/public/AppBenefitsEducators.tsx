import ScreenshotFrame from '@/components/public/ScreenshotFrame'
import { type FeatureMockupType } from '@/components/public/FeatureMockup'

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
      <div className="hidden shrink-0 lg:block">
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
      </div>
    </section>
  )
}
