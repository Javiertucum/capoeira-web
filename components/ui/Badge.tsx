type Variant = 'accent' | 'warning' | 'danger' | 'muted'

type Props = Readonly<{
  children: React.ReactNode
  variant?: Variant
}>

const styles: Record<Variant, string> = {
  accent: 'border border-accent/20 bg-accent-soft text-accent-ink',
  warning: 'border border-gold/20 bg-[rgba(201,154,58,0.12)] text-gold',
  danger: 'border border-[#C0392B]/20 bg-[rgba(192,57,43,0.08)] text-[#C0392B]',
  muted: 'border border-line bg-surface-muted text-ink-2',
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
