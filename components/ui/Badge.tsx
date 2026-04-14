type Variant = 'accent' | 'warning' | 'danger' | 'muted'

type Props = Readonly<{
  children: React.ReactNode
  variant?: Variant
}>

const styles: Record<Variant, string> = {
  accent: 'border border-accent/20 bg-[rgba(102,187,106,0.12)] text-accent',
  warning: 'border border-warning/20 bg-[rgba(246,173,85,0.12)] text-warning',
  danger: 'border border-danger/20 bg-[rgba(252,129,129,0.12)] text-danger',
  muted: 'border border-border bg-surface text-text-muted',
}

export default function Badge({ children, variant = 'muted' }: Props) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.08em] ${styles[variant]}`}
    >
      {children}
    </span>
  )
}
