import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/site'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || SITE_NAME
  const sub = searchParams.get('sub') || 'Directorio Global de Capoeira'
  const type = searchParams.get('type') || 'default'

  const accentColor = '#84c97a'
  const bg = '#081019'
  const card = '#0d1f2d'
  const muted = '#3e5468'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: bg,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background radial glow */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(132,201,122,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(216,173,99,0.10) 0%, transparent 70%)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '72px 80px',
            position: 'relative',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 32,
            }}
          >
            <div style={{ width: 32, height: 1, background: accentColor, opacity: 0.5 }} />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: accentColor,
                fontFamily: 'sans-serif',
              }}
            >
              {type === 'educator' ? 'Educador · Capoeira' : type === 'group' ? 'Grupo · Capoeira' : type === 'nucleo' ? 'Núcleo · Capoeira' : 'Agenda Capoeiragem'}
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 30 ? 52 : 68,
              fontWeight: 700,
              color: '#f0f4f8',
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              fontFamily: 'sans-serif',
              maxWidth: 900,
              marginBottom: 24,
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 22,
              color: '#6b8fa8',
              fontFamily: 'sans-serif',
              letterSpacing: '-0.01em',
              maxWidth: 700,
            }}
          >
            {sub}
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 80px',
            borderTop: `1px solid ${muted}`,
            background: card,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: accentColor,
              fontFamily: 'sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            {SITE_NAME}
          </span>
          <span
            style={{
              fontSize: 14,
              color: muted,
              fontFamily: 'sans-serif',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            agendacapoeiragem.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
