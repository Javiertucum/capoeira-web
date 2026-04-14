import { getTranslations } from 'next-intl/server'
import CategoryCards from '@/components/public/CategoryCards'
import EducatorCard from '@/components/public/EducatorCard'
import HeroSearch from '@/components/public/HeroSearch'
import StatsBar from '@/components/public/StatsBar'
import SectionLabel from '@/components/ui/SectionLabel'
import type { PublicUserProfile, StatsData } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = Readonly<{
  params: Promise<{ locale: string }>
}>

const EMPTY_STATS: StatsData = {
  nucleos: 0,
  groups: 0,
  educators: 0,
  countries: 0,
}

const EMPTY_EDUCATORS: PublicUserProfile[] = []

export default async function LandingPage({ params }: Props) {
  const { locale } = await params

  const [tHero, tCategories, tEducators, tCta, tFooter] = await Promise.all([
    getTranslations({ locale, namespace: 'hero' }),
    getTranslations({ locale, namespace: 'categories' }),
    getTranslations({ locale, namespace: 'educators' }),
    getTranslations({ locale, namespace: 'cta' }),
    getTranslations({ locale, namespace: 'footer' }),
  ])

  let stats = EMPTY_STATS
  let educators = EMPTY_EDUCATORS

  try {
    const { getFeaturedEducators, getStats } = await import('@/lib/queries')
    ;[stats, educators] = await Promise.all([getStats(), getFeaturedEducators()])
  } catch (error) {
    console.error('Landing data unavailable, rendering fallback content.', error)
  }

  return (
    <div className="relative">
      <section className="relative isolate overflow-hidden px-5 pb-18 pt-14 sm:px-8 sm:pt-18 lg:px-12 lg:pb-24">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[-120px] h-[520px] bg-[radial-gradient(circle_at_top,rgba(102,187,106,0.18),transparent_58%)]"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[44%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[44%] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[44%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10"
        />

        <div className="relative mx-auto flex min-h-[calc(100svh-140px)] max-w-[1200px] flex-col items-center justify-center text-center">
          <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-accent">
            <span className="h-px w-8 bg-accent/40" />
            {tHero('eyebrow')}
            <span className="h-px w-8 bg-accent/40" />
          </p>

          <h1 className="max-w-[14ch] text-[clamp(46px,10vw,92px)] font-semibold leading-[0.94] tracking-[-0.05em] text-text">
            {tHero('title')}{' '}
            <span className="text-accent">{tHero('titleAccent')}</span>
          </h1>

          <p className="mt-6 max-w-[720px] text-[clamp(16px,2.2vw,21px)] leading-8 text-text-secondary">
            {tHero('subtitle')}
          </p>

          <div className="mt-10 w-full">
            <HeroSearch />
          </div>

          <div className="mt-12 w-full">
            <StatsBar stats={stats} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-6 sm:px-8 lg:px-12">
        <SectionLabel>{tCategories('title')}</SectionLabel>
        <CategoryCards locale={locale} stats={stats} />
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-12">
        <SectionLabel>{tEducators('featured')}</SectionLabel>

        {educators.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {educators.slice(0, 4).map((educator) => (
              <EducatorCard key={educator.uid} educator={educator} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-border bg-card/70 px-6 py-12 text-center text-sm leading-7 text-text-muted">
            {tEducators('empty')}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-card px-6 py-8 sm:px-8 sm:py-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-10">
          <div
            aria-hidden="true"
            className="absolute right-[-70px] top-[-90px] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(102,187,106,0.14)_0%,rgba(102,187,106,0)_72%)]"
          />

          <div className="relative max-w-[560px]">
            <h2 className="text-[clamp(28px,4vw,42px)] font-semibold leading-[1.02] tracking-[-0.04em] text-text">
              {tCta('title')}
            </h2>
            <p className="mt-4 max-w-[42ch] text-base leading-7 text-text-secondary">
              {tCta('subtitle')}
            </p>
          </div>

          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center rounded-[14px] bg-accent px-6 py-3 text-sm font-semibold tracking-[0.08em] text-[#08110C] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:opacity-90"
            >
              {tCta('download')}
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center rounded-[14px] border border-border px-6 py-3 text-sm font-semibold tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/35 hover:text-text focus-visible:outline-none focus-visible:text-text"
            >
              {tCta('learnMore')}
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
          <span className="text-[13px] font-semibold tracking-[0.16em] text-text-secondary">
            AGENDA<span className="text-accent">.</span>CAPOEIRAGEM
          </span>
          <span>&copy; 2026 · {tFooter('credits')}</span>
          <div className="flex gap-5 text-[12px] uppercase tracking-[0.16em]">
            <a href="#" className="transition-colors hover:text-text">{tFooter('privacy')}</a>
            <a href="#" className="transition-colors hover:text-text">{tFooter('terms')}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
