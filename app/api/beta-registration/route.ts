import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

// Rate-limit en memoria por IP (best-effort, igual que el patron usado en
// capoeira-app/functions/src/index.ts — no persiste entre instancias/regiones,
// pero frena abuso trivial de este endpoint publico sin autenticacion).
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 5
const requestBuckets = new Map<string, { count: number; windowStart: number }>()

function isRateLimited(key: string) {
  const now = Date.now()
  const bucket = requestBuckets.get(key)

  if (!bucket || now - bucket.windowStart >= RATE_LIMIT_WINDOW_MS) {
    requestBuckets.set(key, { count: 1, windowStart: now })
    return false
  }

  bucket.count += 1
  requestBuckets.set(key, bucket)
  return bucket.count > MAX_REQUESTS_PER_WINDOW
}

function boundedString(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    if (isRateLimited(`beta-registration:${ip}`)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await request.json().catch(() => ({}))
    const name = boundedString(body.name, 200)
    const email = boundedString(body.email, 320)
    const role = boundedString(body.role, 50)
    const group = boundedString(body.group, 200)
    const message = boundedString(body.message, 2000)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (!name) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }

    const docRef = await adminDb.collection('betaRequests').add({
      name,
      email,
      role,
      group,
      message,
      createdAt: new Date().toISOString(),
      status: 'pending'
    })

    return NextResponse.json({ success: true, id: docRef.id })
  } catch (error) {
    console.error('Beta registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
