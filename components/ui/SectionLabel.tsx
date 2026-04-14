type Props = Readonly<{
  children: React.ReactNode
}>

export default function SectionLabel({ children }: Props) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent shadow-[0_0_0_6px_rgba(121,207,114,0.12)]" />
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
        {children}
      </span>
      <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(121,207,114,0.42),rgba(36,54,74,0.8),transparent)]" />
    </div>
  )
}
