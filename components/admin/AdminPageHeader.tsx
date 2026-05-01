type Props = Readonly<{
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
}>

export default function AdminPageHeader({
  eyebrow = 'Admin panel',
  title,
  description,
  actions,
}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-ink sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-3 sm:text-[15px] font-medium">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  )
}
