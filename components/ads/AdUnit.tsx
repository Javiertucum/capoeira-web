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

export default function AdUnit({ slot, format = 'auto', layout, layoutKey, className, style }: Props) {
  const pushed = useRef(false)

  useEffect(() => {
    if (!PUBLISHER_ID || pushed.current) return
    try {
      pushed.current = true
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // silently ignore
    }
  }, [])

  if (!PUBLISHER_ID || !slot) return null

  return (
    <ins
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
