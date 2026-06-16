const SOCIAL_PLATFORMS = ['instagram', 'facebook', 'whatsapp', 'youtube', 'tiktok', 'website'] as const
export type SocialPlatform = typeof SOCIAL_PLATFORMS[number]

export function SocialIcon({ platform, size = 16, className = 'shrink-0 text-accent-ink' }: {
  platform: string
  size?: number
  className?: string
}) {
  switch (platform as SocialPlatform) {
    case 'instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'facebook':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-4-1L3 21l1.3-3.9a8.38 8.38 0 0 1-1.2-4.5 8.5 8.5 0 1 1 17.9-1.1z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="2" y="5" width="20" height="14" rx="3" />
          <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M14 2v12.5a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 2a5 5 0 0 0 5 5" />
        </svg>
      )
    case 'website':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
        </svg>
      )
  }
}
