import FeatureMockup, { type FeatureMockupType } from '@/components/public/FeatureMockup'

type SpotlightItem = { tag: string; title: string; desc: string; mockup: FeatureMockupType }

function SpotlightRow({ item }: { item: SpotlightItem }) {
  return (
    <div className="border-b border-border py-16 grid lg:grid-cols-[1fr_320px] lg:gap-16 items-center">
      <div className="space-y-5 max-w-[54ch]">
        <span
          className="inline-block rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em]"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}
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
      <div className="hidden lg:block">
        <FeatureMockup type={item.mockup} size="default" />
      </div>
    </div>
  )
}

export default function AppBenefitsEducators({ copy }: { copy: any }) {
  const spotlights: SpotlightItem[] = copy.educatorsSpotlights ?? []

  return (
    <section className="bg-bg">
      <div className="page-shell">
        <div className="flex items-center gap-4 border-b border-border py-16">
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

        {spotlights.map((item) => (
          <SpotlightRow key={item.tag} item={item} />
        ))}
      </div>
    </section>
  )
}
