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
  /** Franja intermedia: contigua a la punta (20%-33% del ancho). */
  midColorLeft?: string | null
  midColorRight?: string | null
  width?: number
  height?: number
}>

function buildBackground(colors: string[], height: number): string {
  if (colors.length === 0) return '#A69F93'
  if (colors.length === 1) return colors[0]
  if (colors.length === 2) {
    return `linear-gradient(to right, ${colors[0]} 50%, ${colors[1]} 50%)`
  }

  // 3-6 colores: franjas diagonales a -35°. El ancho escala con la altura para
  // que cada color se distinga; sin background-size — un repeating-linear-gradient
  // ya es continuo, y recortarlo en tiles rompía el empalme diagonal.
  const stripeWidth = Math.max(5, Math.round(height * 0.45))
  const stops: string[] = []
  colors.forEach((color, i) => {
    const start = i * stripeWidth
    const end = start + stripeWidth
    stops.push(`${color} ${start}px`, `${color} ${end}px`)
  })
  return `repeating-linear-gradient(-35deg, ${stops.join(', ')})`
}

export default function CordaVisual({
  colors,
  tipColorLeft,
  tipColorRight,
  midColorLeft,
  midColorRight,
  width = 80,
  height = 12,
}: Props) {
  const radius = height / 2
  const background = buildBackground(colors, height)

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
      {/* Franjas intermedias: contiguas a la punta (20%-33%), sin separación */}
      {midColorLeft && (
        <div
          style={{
            position: 'absolute',
            left: '20%',
            top: 0,
            bottom: 0,
            width: '13%',
            backgroundColor: midColorLeft,
          }}
        />
      )}
      {midColorRight && (
        <div
          style={{
            position: 'absolute',
            right: '20%',
            top: 0,
            bottom: 0,
            width: '13%',
            backgroundColor: midColorRight,
          }}
        />
      )}
    </div>
  )
}
