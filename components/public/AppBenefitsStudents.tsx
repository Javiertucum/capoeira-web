import ScreenshotFrame from '@/components/public/ScreenshotFrame'
import { type FeatureMockupType } from '@/components/public/FeatureMockup'

type SpotlightItem = { tag: string; title: string; desc: string; mockup: FeatureMockupType }
type MiniItem = { t: string; d: string }

function SpotlightRow({ item, flip }: { item: SpotlightItem; flip?: boolean }) {
  return (
    <div
      className={[
        'border-b border-border py-10 lg:py-16',
        'flex flex-col items-center gap-8',
        'lg:flex-row lg:gap-16',
        flip ? 'lg:flex-row-reverse' : '',
      ].join(' ')}
    >
      <div className="w-full space-y-5 lg:flex-1 lg:max-w-[54ch]">
        <span
          className="inline-block rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em]"
          style={{ background: 'var(--ink)', color: 'var(--bg)' }}
        >
          {item.tag}
        </span>
        <h3
          className="font-black text-ink leading-[0.96] tracking-[-0.035em]"
          style={{ fontSize: 'clamp(26px, 3vw, 40px)' }}
        >
          {item.title}
        </h3>
        <p className="text-base leading-relaxed text-text-secondary lg:text-[1.05rem]">
          {item.desc}
        </p>
      </div>
      <div className="hidden shrink-0 lg:block">
        <ScreenshotFrame src={`/mockups/${item.mockup}.png`} alt={item.title} size="default" />
      </div>
    </div>
  )
}

function MiniFeatureCard({ item }: { item: MiniItem }) {
  return (
    <div className="rounded-[20px] border border-border bg-bg p-6 transition-colors duration-150 hover:border-accent/30">
      <h4 className="font-bold text-ink">{item.t}</h4>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.d}</p>
    </div>
  )
}

export default function AppBenefitsStudents({ copy }: { copy: any }) {
  const spotlights: SpotlightItem[] = copy.studentsSpotlights ?? []
  const extras: MiniItem[] = copy.studentsExtras ?? []

  return (
    <section className="bg-bg">
      <div className="page-shell">
        <div className="flex items-center gap-4 border-b border-border py-10 lg:py-16">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold tracking-widest"
            style={{ background: 'var(--ink)', color: 'var(--bg)' }}
          >
            02
          </span>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-ink lg:text-3xl">{copy.studentsTitle}</h2>
            <p className="mt-1 max-w-[60ch] text-sm text-text-secondary lg:text-base">{copy.studentsIntro}</p>
          </div>
          <div className="hidden flex-1 border-t border-border sm:block" />
        </div>

        {spotlights.map((item, i) => (
          <SpotlightRow key={item.tag} item={item} flip={i % 2 !== 0} />
        ))}

        {extras.length > 0 && (
          <div className="py-10 lg:py-16">
            <p className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-text-muted">{copy.studentsExtrasLabel}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {extras.map((item) => (
                <MiniFeatureCard key={item.t} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
