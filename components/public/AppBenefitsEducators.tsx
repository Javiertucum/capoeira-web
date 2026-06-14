import Link from 'next/link'
import FeatureMockup from '@/components/public/FeatureMockup'

function FeatureRow({ index, title, description }: { index: number; title: string; description: string }) {
  return (
    <div className="group grid cursor-default grid-cols-[3.5rem_1fr] gap-6 border-t border-border py-7 transition-colors duration-150 ease-[var(--ease-out)] hover:bg-accent/[0.03]">
      <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-text-muted transition-colors duration-150 ease-[var(--ease-out)] group-hover:text-accent mt-0.5">
        {String(index).padStart(2, '0')}
      </span>
      <div>
        <h3 className="text-base font-bold text-ink transition-colors duration-150 ease-[var(--ease-out)] group-hover:text-accent">
          {title}
        </h3>
        <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>
    </div>
  )
}

export default function AppBenefitsEducators({ copy, locale }: { copy: any; locale: string }) {
  return (
    <section className="bg-bg py-24 lg:py-32">
      <div className="page-shell">

        <div className="mb-16 flex items-center gap-4">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold tracking-widest"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            01
          </span>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-ink lg:text-3xl">{copy.educatorsTitle}</h2>
            <p className="mt-2 max-w-[60ch] text-sm text-text-secondary lg:text-base">{copy.educatorsIntro}</p>
          </div>
          <div className="hidden flex-1 border-t border-border sm:block" />
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_340px]">
          <div>
            {copy.educatorsItems.map((f: { t: string; d: string }, i: number) => (
              <FeatureRow key={f.t} index={i + 1} title={f.t} description={f.d} />
            ))}
            <div className="border-t border-border" />
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="floating">
                <FeatureMockup type="kpi" />
              </div>
              <div className="rounded-[20px] border border-accent/20 bg-accent/5 p-6">
                <p className="text-sm leading-relaxed text-ink">{copy.educatorsMapCta}</p>
                <Link
                  href={`/${locale}/#directorio`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent transition-colors duration-150 ease-[var(--ease-out)] hover:text-accent-ink"
                >
                  {copy.educatorsMapCtaLink}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
