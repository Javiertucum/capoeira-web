type FaqItem = { q: string; a: string }

export default function AppFAQ({ copy }: { copy: any }) {
  const items: FaqItem[] = copy.faqItems ?? []
  if (items.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <section className="border-t border-border bg-bg">
      <div className="page-shell py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <h2
            className="font-black text-ink leading-[1] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(24px, 3.4vw, 40px)' }}
          >
            {copy.faqTitle}
          </h2>

          <div className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <details key={item.q} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-left [&::-webkit-details-marker]:hidden">
                  <span className="text-base font-bold text-ink lg:text-lg">{item.q}</span>
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-text-muted transition-transform duration-200 group-open:rotate-45 group-open:border-accent/40 group-open:text-accent"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="max-w-[65ch] pb-5 text-sm leading-relaxed text-text-secondary lg:text-base">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  )
}
