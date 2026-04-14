'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

type Props = {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  layout?: string
  layoutKey?: string
  className?: string
  style?: React.CSSProperties
}

const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
const ADSENSE_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`

function loadAdSenseScript() {
  if (!PUBLISHER_ID) return
  if (document.querySelector(`script[src*="adsbygoogle.js"]`)) return
  const script = document.createElement('script')
  script.src = ADSENSE_SRC
  script.async = true
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

export default function AdUnit({ slot, format = 'auto', layout, layoutKey, className, style }: Props) {
  const pushed = useRef(false)
  const ref = useRef<HTMLModElement>(null)

  useEffect(() => {
    if (!PUBLISHER_ID || pushed.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()
        loadAdSenseScript()
        try {
          pushed.current = true
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch {
          // silently ignore
        }
      },
      { rootMargin: '200px' }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  if (!PUBLISHER_ID || !slot) return null

  return (
    <ins
      ref={ref}
      className={`adsbygoogle${className ? ` ${className}` : ''}`}
      style={{ display: 'block', ...style }}
      data-ad-client={PUBLISHER_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layout ? { 'data-ad-layout': layout } : {})}
      {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
      data-full-width-responsive="true"
    />
  )
}
