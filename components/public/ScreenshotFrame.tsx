import FeatureMockup, { type FeatureMockupSize, type FeatureMockupType } from '@/components/public/FeatureMockup'

/**
 * Placeholder visual for a tutorial step. Renders the matching FeatureMockup
 * until real phone screenshots are available — once added, an optional
 * `src` can be wired here to show the captured screenshot in the same frame.
 */
export default function ScreenshotFrame({
  type,
  size = 'default',
}: {
  type: FeatureMockupType
  size?: FeatureMockupSize
}) {
  return <FeatureMockup type={type} size={size} />
}
