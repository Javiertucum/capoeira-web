import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { adminDb } from '@/lib/firebase-admin'
import type { AdminEntityType } from '@/lib/admin-queries'

type Params = {
  params: Promise<{
    entityType: string
    id: string
  }>
}

const ENTITY_TYPES: AdminEntityType[] = ['user', 'group', 'nucleo', 'event']

function isEntityType(value: string): value is AdminEntityType {
  return ENTITY_TYPES.includes(value as AdminEntityType)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { entityType, id } = await params
  const body = await request.json().catch(() => ({}))

  if (!isEntityType(entityType)) {
    return NextResponse.json({ error: 'Tipo de entidad invalido' }, { status: 400 })
  }

  const active = body.active === true
  const order = Number.isFinite(body.order) ? Number(body.order) : 999
  const docId = `${entityType}_${id}`

  try {
    await adminDb.collection('adminFeaturedContent').doc(docId).set(
      {
        entityType,
        entityId: id,
        groupId: typeof body.groupId === 'string' ? body.groupId : null,
        label: typeof body.label === 'string' ? body.label : null,
        active,
        order,
        updatedBy: authResult.uid,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    )

    await writeAdminAuditLog({
      actorUid: authResult.uid,
      action: active ? 'featured.activate' : 'featured.deactivate',
      entity: { type: entityType, id, path: `adminFeaturedContent/${docId}` },
      summary: `${active ? 'Activated' : 'Deactivated'} featured ${entityType}/${id}`,
      metadata: { active, order },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Admin/FeaturedContent/PATCH] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar destacado' },
      { status: 500 }
    )
  }
}
