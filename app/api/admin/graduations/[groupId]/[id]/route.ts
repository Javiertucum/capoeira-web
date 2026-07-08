import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { notifyGroupAdminGraduationChange } from '@/lib/graduation-admin-notify'

type Params = { params: Promise<{ groupId: string; id: string }> }

const HEX_REGEX = /^#[0-9a-fA-F]{3,6}$/

function asHexOrNull(value: unknown): string | null {
  return typeof value === 'string' && HEX_REGEX.test(value.trim()) ? value.trim() : null
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId, id } = await params
  const body = await request.json() as Record<string, unknown>

  const colors = Array.isArray(body.colors)
    ? body.colors.filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
    : []

  const order = typeof body.order === 'number' && Number.isFinite(body.order)
    ? body.order
    : Number.isFinite(Number(body.order)) ? Number(body.order) : 0

  try {
    await adminDb
      .collection('groups')
      .doc(groupId)
      .collection('graduationLevels')
      .doc(id)
      .update({
        name: typeof body.name === 'string' ? body.name.trim() : '',
        order,
        colors,
        category: typeof body.category === 'string' && body.category.trim() ? body.category.trim() : null,
        isEducator: body.isEducator === true,
        isSpecial: body.isSpecial === true,
        tipColorLeft: asHexOrNull(body.tipColorLeft),
        tipColorRight: asHexOrNull(body.tipColorRight),
        midColorLeft: asHexOrNull(body.midColorLeft),
        midColorRight: asHexOrNull(body.midColorRight),
        updatedAt: FieldValue.serverTimestamp(),
      })

    await notifyGroupAdminGraduationChange(
      groupId,
      'updated',
      typeof body.name === 'string' ? body.name.trim() : id,
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Graduations/PATCH] error:', error)
    return NextResponse.json({ error: 'Error al actualizar graduacion' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId, id } = await params

  try {
    await adminDb
      .collection('groups')
      .doc(groupId)
      .collection('graduationLevels')
      .doc(id)
      .delete()

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Graduations/DELETE] error:', error)
    return NextResponse.json({ error: 'Error al eliminar graduacion' }, { status: 500 })
  }
}
