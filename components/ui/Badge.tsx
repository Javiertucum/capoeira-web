type Variant = 'accent' | 'warning' | 'danger' | 'muted'

type Props = Readonly<{
  children: React.ReactNode
  variant?: Variant
}>

const styles: Record<Variant, string> = {
  accent: 'border border-accent/20 bg-[rgba(121,207,114,0.14)] text-accent',
  warning: 'border border-warning/20 bg-[rgba(216,173,99,0.14)] text-warning',
  danger: 'border border-danger/20 bg-[rgba(252,129,129,0.12)] text-danger',
  muted: 'border border-border bg-surface text-text-secondary',
}

export default function Badge({ children, variant = 'muted' }: Props) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${styles[variant]}`}
    >
      {children}
    </span>
  )
}
