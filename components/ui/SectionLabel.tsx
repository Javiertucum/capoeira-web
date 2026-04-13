type Props = Readonly<{
  children: React.ReactNode
}>

export default function SectionLabel({ children }: Props) {
  return (
    <div className="mb-7 flex items-center gap-4">
      <span className="text-[10px] font-normal uppercase tracking-[0.28em] text-accent">
        {children}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}
