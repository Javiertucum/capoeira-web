type Props = Readonly<{
  children: React.ReactNode
}>

export default function SectionLabel({ children }: Props) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
        {children}
      </span>
      <div className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  )
}
