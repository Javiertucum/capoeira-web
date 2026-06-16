import Image from 'next/image'
import FeatureMockup, { type FeatureMockupSize, type FeatureMockupType } from '@/components/public/FeatureMockup'

const SIZES: Record<FeatureMockupSize, { width: number; radius: number; border: number; islandW: number; islandH: number }> = {
  default: { width: 230, radius: 40, border: 5, islandW: 74, islandH: 20 },
  lg:      { width: 280, radius: 48, border: 6, islandW: 90, islandH: 24 },
}

type Props =
  | { src: string; alt: string; size?: FeatureMockupSize; type?: never }
  | { type: FeatureMockupType; size?: FeatureMockupSize; src?: never; alt?: never }

export default function ScreenshotFrame({ src, alt, type, size = 'default' }: Props) {
  if (!src) {
    return <FeatureMockup type={type!} size={size} />
  }

  const s = SIZES[size]

  return (
    <div className="relative mx-auto" style={{ width: s.width }}>
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 rounded-full opacity-25 blur-2xl"
        style={{ background: 'rgba(16,185,129,0.4)' }}
      />

      {/* Phone shell */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          width: s.width,
          aspectRatio: '9/19',
          background: '#0A0C10',
          borderRadius: s.radius,
          border: `${s.border}px solid #1a1e26`,
          boxShadow: '0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Dynamic Island */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1.5 z-30"
          style={{
            transform: 'translateX(-50%)',
            width: s.islandW,
            height: s.islandH,
            background: '#0A0C10',
            borderRadius: s.islandH / 2,
            border: '1px solid #1a1e26',
          }}
        />

        {/* Screenshot */}
        <div className="absolute inset-0">
          <Image
            src={src}
            alt={alt!}
            fill
            className="object-cover object-top"
            sizes={`${s.width}px`}
            priority={size === 'lg'}
          />
        </div>

        {/* Glass highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-40"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)' }}
        />
      </div>
    </div>
  )
}
