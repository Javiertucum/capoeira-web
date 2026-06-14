import Link from 'next/link'
import FeatureMockup from '@/components/public/FeatureMockup'

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent" />
        </svg>
      </span>
      <span>{text}</span>
    </li>
  )
}

export default function FeaturesOverview({ copy, locale }: { copy: any; locale: string }) {
  return (
    <section id="features" className="bg-bg py-24 lg:py-32">
      <div className="page-shell">

        {/* ── Section intro ── */}
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="max-w-[20ch] font-black leading-[0.96] tracking-[-0.04em] text-ink"
            style={{ fontSize: 'clamp(34px, 4.5vw, 60px)' }}
          >
            {copy.featuresTitle}
          </h2>
          <p className="max-w-[38ch] text-base leading-relaxed text-text-secondary lg:pb-2 lg:text-lg">
            {copy.featuresBody}
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[28px] border border-border bg-border lg:grid-cols-2">

          {/* ── Para quien busca dónde entrenar ── */}
          <div className="flex flex-col gap-8 bg-card p-8 lg:p-12">
            <div>
              <h3 className="text-xl font-black text-ink lg:text-2xl">{copy.studentsTitle}</h3>
              <ul className="mt-6 space-y-4">
                {copy.studentsItems.map((item: string) => (
                  <CheckItem key={item} text={item} />
                ))}
              </ul>
            </div>
            <div className="mt-auto overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="pointer-events-none scale-[0.9] origin-top">
                <FeatureMockup type="event" />
              </div>
            </div>
          </div>

          {/* ── Para quien organiza ── */}
          <div className="flex flex-col gap-8 bg-card p-8 lg:p-12">
            <div>
              <h3 className="text-xl font-black text-ink lg:text-2xl">{copy.educatorsTitle}</h3>
              <ul className="mt-6 space-y-4">
                {copy.educatorsItems.map((item: string) => (
                  <CheckItem key={item} text={item} />
                ))}
              </ul>
              <Link
                href={`/${locale}/app`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent transition-colors duration-150 ease-[var(--ease-out)] hover:text-accent-ink"
              >
                {copy.educatorsCta}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className="mt-auto overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="pointer-events-none scale-[0.9] origin-top">
                <FeatureMockup type="attendance" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
