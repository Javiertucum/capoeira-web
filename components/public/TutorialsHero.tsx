export default function TutorialsHero({ copy }: { copy: { eyebrow: string; heroTitle: string; heroSubtitle: string } }) {
  return (
    <div className="border-b border-border bg-bg">
      <div className="page-shell py-10 lg:py-14">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-ink">
          {copy.eyebrow}
        </p>
        <h1
          className="font-black text-ink leading-[1.02] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
        >
          {copy.heroTitle}
        </h1>
        <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-text-secondary lg:text-base">
          {copy.heroSubtitle}
        </p>
      </div>
    </div>
  )
}
