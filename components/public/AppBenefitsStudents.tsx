import ScreenshotFrame from '@/components/public/ScreenshotFrame'
import { type FeatureMockupType } from '@/components/public/FeatureMockup'

type SpotlightItem = { tag: string; title: string; desc: string; mockup: FeatureMockupType }
type MiniItem = { t: string; d: string }

function SpotlightRow({ item }: { item: SpotlightItem }) {
  return (
    <div className="border-b border-border py-10 lg:py-14 flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
      <div className="w-full space-y-4 lg:flex-1 lg:max-w-[50ch]">
        <span
          className="inline-block rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em]"
          style={{ background: 'var(--ink)', color: 'var(--bg)' }}
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

function MiniFeatureCard({ item }: { item: MiniItem | SpotlightItem }) {
  const title = 't' in item ? item.t : item.tag
  const desc = 'd' in item ? item.d : item.desc
  return (
    <div className="rounded-2xl border border-border p-5 transition-colors duration-150 hover:border-accent/30">
      <h4 className="font-bold text-ink">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{desc}</p>
    </div>
  )
}

export default function AppBenefitsStudents({ copy }: { copy: any }) {
  const spotlights: SpotlightItem[] = copy.studentsSpotlights ?? []
  const extras: MiniItem[] = copy.studentsExtras ?? []

  // Show the last spotlight (event) with phone; demote the rest to mini-cards
  const featured = spotlights.slice(-1)
  const demoted = spotlights.slice(0, -1)

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

        {featured.map((item) => (
          <SpotlightRow key={item.tag} item={item} />
        ))}

        {(demoted.length > 0 || extras.length > 0) && (
          <div className="py-10 lg:py-12">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-text-muted">{copy.studentsExtrasLabel}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {demoted.map((item) => (
                <MiniFeatureCard key={item.tag} item={item} />
              ))}
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
