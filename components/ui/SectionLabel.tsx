type Props = Readonly<{
  children: React.ReactNode
}>

export default function SectionLabel({ children }: Props) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
        {children}
      </span>
      <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(132,201,122,0.24),rgba(39,49,59,0.8),transparent)]" />
    </div>
  )
}
