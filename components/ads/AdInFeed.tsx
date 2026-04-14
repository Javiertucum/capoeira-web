import AdUnit from './AdUnit'

const SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED

/**
 * In-feed ad — styled to blend with NucleoListItem / EducatorCard cards.
 * Renders nothing if ADSENSE is not configured.
 */
export default function AdInFeed() {
  if (!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || !SLOT) return null

  return (
    <div className="overflow-hidden rounded-[26px] border border-border/50 bg-card/30">
      <AdUnit
        slot={SLOT}
        format="fluid"
        layoutKey="-fb+5w+4e-db+86"
        style={{ minHeight: 100 }}
      />
    </div>
  )
}
