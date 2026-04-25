import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, role, group, message } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
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
