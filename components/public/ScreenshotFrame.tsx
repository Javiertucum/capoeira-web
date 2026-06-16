import Image from 'next/image'
import FeatureMockup, { type FeatureMockupSize, type FeatureMockupType } from '@/components/public/FeatureMockup'

const MAX_W: Record<FeatureMockupSize, string> = {
  default: '300px',
  lg: '360px',
}

type Props =
  | { src: string; alt: string; size?: FeatureMockupSize; type?: never }
  | { type: FeatureMockupType; size?: FeatureMockupSize; src?: never; alt?: never }

export default function ScreenshotFrame({ src, alt, type, size = 'default' }: Props) {
  if (!src) {
    return <FeatureMockup type={type!} size={size} />
  }

  return (
    <div className="relative mx-auto" style={{ maxWidth: MAX_W[size], width: '100%' }}>
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 rounded-full opacity-30 blur-3xl"
        style={{ background: 'rgba(16,185,129,0.35)' }}
      />

      {/* Phone shell */}
      <div
        className="relative mx-auto aspect-[9/19] w-full overflow-hidden"
        style={{
          background: '#0A0C10',
          borderRadius: 52,
          border: '7px solid #1a1e26',
          boxShadow: '0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Dynamic Island */}
        <div
          aria-hidden
          className="absolute left-1/2 top-2 z-30"
          style={{
            transform: 'translateX(-50%)',
            width: 96,
            height: 26,
            background: '#0A0C10',
            borderRadius: 13,
            border: '1.5px solid #1a1e26',
          }}
        />

        {/* Screenshot */}
        <div className="absolute inset-0">
          <Image
            src={src}
            alt={alt!}
            fill
            className="object-cover object-top"
            sizes={MAX_W[size]}
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
