import Image from 'next/image'
import type { FeatureMockupType } from '@/components/public/FeatureMockup'

type SpotlightItem = { tag: string; title: string; desc: string; mockup: FeatureMockupType }

function FeatureIcon({ type }: { type: FeatureMockupType }) {
  const s = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (type) {
    case 'attendance':
      return (
        <svg {...s}>
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M8 10l3 3 5-5" />
        </svg>
      )
    case 'kpi':
      return (
        <svg {...s} stroke="none">
          <rect x="3" y="13" width="4" height="8" rx="1" fill="currentColor" opacity="0.45" />
          <rect x="10" y="8" width="4" height="13" rx="1" fill="currentColor" opacity="0.7" />
          <rect x="17" y="4" width="4" height="17" rx="1" fill="currentColor" />
        </svg>
      )
    case 'graduation':
      return (
        <svg {...s}>
          <circle cx="12" cy="8.5" r="5.5" />
          <path d="M8.5 15.5L7 22l5-2 5 2-1.5-6.5" />
        </svg>
      )
    case 'finances':
      return (
        <svg {...s}>
          <rect x="2" y="7" width="20" height="14" rx="3" />
          <path d="M2 11h20" />
          <circle cx="17" cy="15.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'map':
      return (
        <svg {...s}>
          <path d="M12 22s-8-5.5-8-12a8 8 0 0116 0c0 6.5-8 12-8 12z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      )
    case 'event':
      return (
        <svg {...s}>
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M16 2v4M8 2v4M3 10h18" />
          <path d="M8 14.5h.01M12 14.5h.01M16 14.5h.01M8 18.5h.01" strokeWidth="2.5" />
        </svg>
      )
    default:
      return null
  }
}

// Col-span for each position: 6-col grid on lg, 2-col on sm
const SPANS = [
  'col-span-2 lg:col-span-4', // attendance — featured wide
  'col-span-2 sm:col-span-1 lg:col-span-2', // kpi
  'col-span-2 sm:col-span-1 lg:col-span-2', // graduation
  'col-span-2 lg:col-span-4', // finances — featured wide
  'col-span-2 sm:col-span-1 lg:col-span-3', // map
  'col-span-2 sm:col-span-1 lg:col-span-3', // event
]

function BentoTile({ item, index }: { item: SpotlightItem; index: number }) {
  const featured = index === 0 || index === 3
  return (
    <div
      className={[
        SPANS[index] ?? 'col-span-2 sm:col-span-1 lg:col-span-2',
        'relative overflow-hidden rounded-[20px] border p-6 lg:p-7',
        featured ? 'border-accent/15 bg-accent/5' : 'border-border bg-card',
      ].join(' ')}
    >
      <div
        className={[
          'mb-4 flex h-9 w-9 items-center justify-center rounded-xl',
          featured ? 'bg-accent/15 text-accent' : 'bg-surface text-text-secondary',
        ].join(' ')}
      >
        <FeatureIcon type={item.mockup} />
      </div>

      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-text-muted">
        {item.tag}
      </p>

      <h3
        className="font-black text-ink leading-[1.1] tracking-[-0.02em]"
        style={{ fontSize: 'clamp(15px, 1.5vw, 19px)' }}
      >
        {item.title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-text-secondary lg:max-w-[50%]">
        {item.desc}
      </p>

      {/* ATOKS-style: thumbnail screenshot clipped to the right on wide featured tiles */}
      {featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 hidden w-[38%] overflow-hidden rounded-br-[20px] lg:block"
          style={{ height: '130%' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent z-10" />
          <Image
            src={`/mockups/${item.mockup}.png`}
            alt=""
            fill
            className="object-cover object-top opacity-80"
            sizes="200px"
          />
        </div>
      )}
    </div>
  )
}

export default function AppFeaturesBento({ copy }: { copy: any }) {
  const educators: SpotlightItem[] = copy.educatorsSpotlights ?? []
  const students: SpotlightItem[] = copy.studentsSpotlights ?? []
  const tiles = [...educators, ...students].slice(0, 6)

  return (
    <section className="border-t border-border bg-bg">
      <div className="page-shell py-14 lg:py-20">
        <p className="mb-8 text-[11px] font-black uppercase tracking-[0.22em] text-text-muted lg:mb-10">
          {copy.featuresBentoLabel}
        </p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6 lg:gap-4">
          {tiles.map((item, i) => (
            <BentoTile key={item.mockup} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
