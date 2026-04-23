type Props = Readonly<{
  eyebrow?: string
  title: string
  description: string
  action?: React.ReactNode
}>

export default function AdminEmptyState({
  eyebrow = 'Preparando modulo',
  title,
  description,
  action,
}: Props) {
  return (
    <div className="rounded-[24px] border border-dashed border-border bg-surface-muted/50 px-6 py-10 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
        {eyebrow}
      </p>
      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-text">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
