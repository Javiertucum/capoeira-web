import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) {
    return NextResponse.json([])
  }

  // Firestore range query: displayName >= q AND displayName <= q
  const end = q + ''
  const snap = await adminDb
    .collection('users')
    .where('displayName', '>=', q)
    .where('displayName', '<=', end)
    .limit(10)
    .get()

  const results = snap.docs.map((doc) => {
    const data = doc.data()
    return {
      uid: doc.id,
      displayName: typeof data.displayName === 'string' ? data.displayName : '',
      email: typeof data.email === 'string' ? data.email : '',
      photoURL: typeof data.photoURL === 'string' ? data.photoURL : null,
    }
  })

  return NextResponse.json(results)
}
