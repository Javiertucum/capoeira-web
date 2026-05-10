import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json([])

  const end = q + ''
  const snap = await adminDb
    .collection('posts')
    .where('title', '>=', q)
    .where('title', '<=', end)
    .limit(10)
    .get()

  const results = snap.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      title: typeof data.title === 'string' ? data.title : doc.id,
      subtitle: null,
    }
  })

  return NextResponse.json(results)
}
