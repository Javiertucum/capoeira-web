'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2026-05-30',
  capture_pageview: 'history_change',
})

export default function PostHogClient() {
  useEffect(() => {
    posthog.startExceptionAutocapture()
  }, [])

  return null
}
