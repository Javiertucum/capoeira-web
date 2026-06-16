import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { FieldValue } from 'firebase-admin/firestore'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  const body = await request.json()

  const allowedFields = [
    'name', 'description', 'country', 'city', 'logoUrl', 'websiteUrl',
    'instagramUrl', 'facebookUrl', 'youtubeUrl', 'whatsappUrl', 'tiktokUrl',
    'graduationSystemName', 'educatorThresholdOrder', 'style', 'visible',
    'adminUserIds', 'coAdminIds',
  ]
  const sanitizedBody = Object.fromEntries(
    Object.entries(body).filter(([key]) => allowedFields.includes(key))
  )

  try {
    await adminDb.collection('groups').doc(id).update({
      ...sanitizedBody,
      updatedAt: FieldValue.serverTimestamp(),
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Groups/PATCH] error:', error)
    return NextResponse.json({ error: 'Error al actualizar grupo' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params

  try {
    await adminDb.collection('groups').doc(id).delete()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Groups/DELETE] error:', error)
    return NextResponse.json({ error: 'Error al eliminar grupo' }, { status: 500 })
  }
}
