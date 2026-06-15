export default function ProfileCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[28px] border border-border bg-card p-6 shadow-soft sm:p-8 ${className}`}>
      {children}
    </div>
  )
}

export function LocationPinIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 22s8-7.58 8-13a8 8 0 1 0-16 0c0 5.42 8 13 8 13z" />
      <circle cx="12" cy="9" r="3" />
    </svg>
  )
}
