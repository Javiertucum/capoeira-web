import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { getApps } from 'firebase-admin/app'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { FieldValue } from 'firebase-admin/firestore'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  const body = await request.json()

  // Permitted fields for users/{uid} (private)
  const userFields = [
    'name', 'surname', 'nickname', 'nameLower', 'surnameLower', 'nicknameLower',
    'role', 'groupId', 'nucleoIds', 'graduationLevelId', 'setupComplete',
    'bio', 'country', 'socialLinks', 'educatorEligible', 'supervisorIds',
  ]
  // Permitted fields for usersPublic/{uid} (public)
  const publicFields = [
    'name', 'surname', 'nickname', 'role', 'groupId', 'nucleoIds',
    'graduationLevelId', 'avatarUrl', 'bio', 'country', 'socialLinks',
    'educatorEligible', 'supervisorIds',
  ]
  // Firebase Auth fields
  const authFields = ['email', 'disabled']

  const userUpdate: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() }
  const publicUpdate: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() }
  const authUpdate: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(body)) {
    if (userFields.includes(key))   userUpdate[key]   = value
    if (publicFields.includes(key)) publicUpdate[key] = value
    if (authFields.includes(key))   authUpdate[key]   = value
  }

  const adminAuth = getAuth(getApps()[0])
  const batch = adminDb.batch()

  // Only update if documents exist (just in case)
  batch.update(adminDb.collection('users').doc(id), userUpdate)
  batch.update(adminDb.collection('usersPublic').doc(id), publicUpdate)

  try {
    await Promise.all([
      batch.commit(),
      Object.keys(authUpdate).length > 0
        ? adminAuth.updateUser(id, authUpdate as any)
        : Promise.resolve(),
    ])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Users/PATCH] error:', error)
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  const adminAuth = getAuth(getApps()[0])
  const batch = adminDb.batch()

  batch.delete(adminDb.collection('users').doc(id))
  batch.delete(adminDb.collection('usersPublic').doc(id))

  try {
    await Promise.all([
      batch.commit(),
      adminAuth.deleteUser(id),
    ])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Users/DELETE] error:', error)
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 })
  }
}
