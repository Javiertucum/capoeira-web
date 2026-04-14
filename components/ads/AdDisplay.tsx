import AdUnit from './AdUnit'

const SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY

/**
 * Standard responsive display ad.
 * Renders nothing if ADSENSE is not configured.
 */
export default function AdDisplay({ className }: { className?: string }) {
  if (!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || !SLOT) return null

  return (
    <div className={`overflow-hidden rounded-[22px] border border-border/50 bg-card/30 ${className ?? ''}`}>
      <AdUnit
        slot={SLOT}
        format="auto"
        style={{ minHeight: 100 }}
      />
    </div>
  )
}
