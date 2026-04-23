type Props = Readonly<{
  title?: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
}>

export default function AdminSectionCard({
  title,
  description,
  action,
  children,
  className = '',
  contentClassName = '',
}: Props) {
  return (
    <section
      className={`overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_18px_40px_-30px_var(--shadow)] ${className}`.trim()}
    >
      {title || description || action ? (
        <div className="flex flex-col gap-3 border-b border-border bg-surface/20 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="min-w-0">
            {title ? <h2 className="text-base font-semibold text-text">{title}</h2> : null}
            {description ? (
              <p className="mt-1 text-sm leading-6 text-text-muted">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      <div className={contentClassName || 'px-5 py-5 sm:px-6'}>{children}</div>
    </section>
  )
}
