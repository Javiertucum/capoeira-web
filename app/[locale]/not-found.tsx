import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import Footer from '@/components/public/Footer'

export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations('notFound')

  return (
    <>
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
        <p className="eyebrow acc mb-3">404</p>
        <h1 className="text-[clamp(28px,5vw,40px)] font-semibold tracking-[-0.04em] text-text">
          {t('title')}
        </h1>
        <p className="mt-3 max-w-[50ch] text-base leading-7 text-text-secondary">
          {t('description')}
        </p>
        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex items-center justify-center rounded-[14px] border border-border px-6 py-3 text-sm font-semibold tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/35 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {t('cta')}
        </Link>
      </section>
      <Footer locale={locale} />
    </>
  )
}
