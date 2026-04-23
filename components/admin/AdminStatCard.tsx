type Tone = 'default' | 'accent' | 'warning' | 'danger'

type Props = Readonly<{
  label: string
  value: React.ReactNode
  helper?: string | null
  tone?: Tone
}>

const toneStyles: Record<Tone, string> = {
  default: 'text-text',
  accent: 'text-accent',
  warning: 'text-warning',
  danger: 'text-danger',
}

export default function AdminStatCard({
  label,
  value,
  helper,
  tone = 'default',
}: Props) {
  return (
    <div className="rounded-[24px] border border-border bg-card px-5 py-5 shadow-[0_18px_40px_-30px_var(--shadow)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted">
        {label}
      </p>
      <div className={`mt-4 text-3xl font-semibold leading-none sm:text-[2rem] ${toneStyles[tone]}`}>
        {value}
      </div>
      {helper ? <p className="mt-3 text-xs leading-5 text-text-secondary">{helper}</p> : null}
    </div>
  )
}
