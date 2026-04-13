type Variant = 'accent' | 'warning' | 'danger' | 'muted'

type Props = Readonly<{
  children: React.ReactNode
  variant?: Variant
}>

const styles: Record<Variant, string> = {
  accent: 'bg-[rgba(102,187,106,0.12)] text-accent',
  warning: 'bg-[rgba(246,173,85,0.12)] text-warning',
  danger: 'bg-[rgba(252,129,129,0.12)] text-danger',
  muted: 'bg-surface text-text-muted',
}

export default function Badge({ children, variant = 'muted' }: Props) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  )
}
