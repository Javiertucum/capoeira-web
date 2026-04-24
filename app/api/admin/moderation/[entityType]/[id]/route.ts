import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import {
  applyAdminModerationDecision,
  type AdminModerationDecision,
} from '@/lib/admin-moderation-actions'
import type { AdminModerationEntityType } from '@/lib/admin-queries'

type Params = {
  params: Promise<{
    entityType: string
    id: string
  }>
}

const ENTITY_TYPES: AdminModerationEntityType[] = ['user', 'group', 'nucleo', 'event']
const DECISIONS: AdminModerationDecision[] = ['hide', 'suspend', 'restore']

function isEntityType(value: string): value is AdminModerationEntityType {
  return ENTITY_TYPES.includes(value as AdminModerationEntityType)
}

function isDecision(value: unknown): value is AdminModerationDecision {
  return typeof value === 'string' && DECISIONS.includes(value as AdminModerationDecision)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { entityType, id } = await params
  const body = await request.json().catch(() => ({}))
  const decision = body.decision

  if (!isEntityType(entityType)) {
    return NextResponse.json({ error: 'Tipo de entidad invalido' }, { status: 400 })
  }

  if (!isDecision(decision)) {
    return NextResponse.json({ error: 'Decision invalida' }, { status: 400 })
  }

  if (decision === 'suspend' && entityType !== 'user') {
    return NextResponse.json({ error: 'Solo usuarios pueden suspenderse' }, { status: 400 })
  }

  try {
    const result = await applyAdminModerationDecision({
      actorUid: authResult.uid,
      entityType,
      entityId: id,
      decision,
      groupId: typeof body.groupId === 'string' ? body.groupId : undefined,
      reason: typeof body.reason === 'string' ? body.reason : undefined,
      note: typeof body.note === 'string' ? body.note : undefined,
    })

    await writeAdminAuditLog({
      actorUid: authResult.uid,
      action: `moderation.${decision}`,
      entity: {
        type: entityType,
        id,
        path: entityType === 'nucleo' && typeof body.groupId === 'string'
          ? `groups/${body.groupId}/nucleos/${id}`
          : `${entityType}s/${id}`,
      },
      summary: `Admin set ${entityType}/${id} to ${result.state}`,
      metadata: { decision, state: result.state },
    })

    return NextResponse.json({ ok: true, state: result.state })
  } catch (error) {
    console.error('[API/Admin/Moderation/PATCH] error:', error)
    await writeAdminAuditLog({
      actorUid: authResult.uid,
      action: `moderation.${decision}`,
      entity: { type: entityType, id },
      status: 'error',
      summary: `Moderation action failed for ${entityType}/${id}`,
      metadata: { decision },
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    }).catch((auditError) => {
      console.error('[API/Admin/Moderation/PATCH] audit error:', auditError)
    })

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al moderar entidad' },
      { status: 500 }
    )
  }
}
