/**
 * CordaVisual — web port of the mobile CordaVisual component.
 *
 * Visual rules (same as mobile):
 * - 1 color  → solid bar
 * - 2 colors → left half / right half
 * - 3-6 colors → diagonal braided stripes at -35°
 * Tip colors appear as 20%-wide overlays on each end.
 */

type Props = Readonly<{
  colors: string[]
  tipColorLeft?: string | null
  tipColorRight?: string | null
  width?: number
  height?: number
}>

function buildBackground(colors: string[]): string {
  if (colors.length === 0) return '#A69F93'
  if (colors.length === 1) return colors[0]
  if (colors.length === 2) {
    return `linear-gradient(to right, ${colors[0]} 50%, ${colors[1]} 50%)`
  }

  // 3-6 colors: diagonal stripes at -35deg, 5px each stripe
  const stripeWidth = 5
  const stops: string[] = []
  colors.forEach((color, i) => {
    const start = i * stripeWidth
    const end = start + stripeWidth
    stops.push(`${color} ${start}px`, `${color} ${end}px`)
  })
  const totalWidth = colors.length * stripeWidth
  return `repeating-linear-gradient(-35deg, ${stops.join(', ')}) 0 0 / ${totalWidth}px ${totalWidth}px`
}

export default function CordaVisual({
  colors,
  tipColorLeft,
  tipColorRight,
  width = 80,
  height = 12,
}: Props) {
  const radius = height / 2
  const background = buildBackground(colors)

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: radius,
        background,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        flexShrink: 0,
      }}
    >
      {tipColorLeft && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '20%',
            backgroundColor: tipColorLeft,
          }}
        />
      )}
      {tipColorRight && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '20%',
            backgroundColor: tipColorRight,
          }}
        />
      )}
    </div>
  )
}
