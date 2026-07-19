import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { posthogServer } from '@/lib/posthog-server'

// Rate-limit en dos capas para este endpoint público sin autenticación:
// 1) Map en memoria: barato, corta ráfagas dentro de una misma instancia.
// 2) Contador transaccional en Firestore (`rateLimits/{hash(ip)}`): persiste
//    entre instancias/regiones serverless, donde el Map se reinicia y por sí
//    solo es casi decorativo en Vercel.
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

async function isRateLimitedPersistent(key: string): Promise<boolean> {
  // Hash de la IP: no guardamos la IP en claro en Firestore (minimización).
  const docId = createHash('sha256').update(key).digest('hex').slice(0, 32)
  const ref = adminDb.collection('rateLimits').doc(docId)
  const now = Date.now()

  try {
    return await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref)
      const data = snap.exists ? (snap.data() as { count?: number; windowStart?: number }) : null

      if (!data || typeof data.windowStart !== 'number' || now - data.windowStart >= RATE_LIMIT_WINDOW_MS) {
        tx.set(ref, { count: 1, windowStart: now })
        return false
      }

      const count = (typeof data.count === 'number' ? data.count : 0) + 1
      tx.set(ref, { count, windowStart: data.windowStart }, { merge: true })
      return count > MAX_REQUESTS_PER_WINDOW
    })
  } catch (error) {
    // Best-effort: si Firestore falla, no bloqueamos el registro legítimo.
    console.error('[beta-registration] persistent rate limit check failed', error)
    return false
  }
}

function boundedString(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const rateKey = `beta-registration:${ip}`
    if (isRateLimited(rateKey) || (await isRateLimitedPersistent(rateKey))) {
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

    posthogServer.capture({
      distinctId: `beta_request:${docRef.id}`,
      event: 'beta_registration_submitted',
      properties: { role: role || 'unspecified', has_group: Boolean(group) },
    })

    return NextResponse.json({ success: true, id: docRef.id })
  } catch (error) {
    console.error('Beta registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
