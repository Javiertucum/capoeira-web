import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { FieldValue } from 'firebase-admin/firestore'

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const doc = await adminDb.collection('adminSettings').doc('global').get()
    const data = doc.data() ?? {}
    return NextResponse.json({
      appVersion: typeof data.appVersion === 'string' ? data.appVersion : '1.0.0',
      statusLabel: typeof data.statusLabel === 'string' ? data.statusLabel : 'Beta cerrada',
      betaRegistrationOpen: data.betaRegistrationOpen === true,
    })
  } catch {
    return NextResponse.json({ error: 'Error al leer configuración' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json() as Record<string, unknown>
    const { appVersion, statusLabel, betaRegistrationOpen } = body

    if (typeof appVersion !== 'string' || typeof statusLabel !== 'string' || typeof betaRegistrationOpen !== 'boolean') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    await adminDb.collection('adminSettings').doc('global').set(
      { appVersion, statusLabel, betaRegistrationOpen, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al guardar configuración' }, { status: 500 })
  }
}
