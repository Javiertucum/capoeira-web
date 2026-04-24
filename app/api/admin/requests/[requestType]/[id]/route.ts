import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import {
  applyAdminRequestDecision,
  type AdminRequestDecision,
} from '@/lib/admin-request-actions'
import type { AdminRequestType } from '@/lib/admin-queries'
import { writeAdminAuditLog } from '@/lib/admin-audit'

type Params = {
  params: Promise<{
    requestType: string
    id: string
  }>
}

const VALID_REQUEST_TYPES: AdminRequestType[] = [
  'group_requests',
  'nucleo_requests',
  'educatorRequests',
  'nucleo_transition_requests',
]

const VALID_DECISIONS: AdminRequestDecision[] = ['approve', 'reject']

function isAdminRequestType(value: string): value is AdminRequestType {
  return VALID_REQUEST_TYPES.includes(value as AdminRequestType)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { requestType, id } = await params
  const { decision } = await request.json()

  if (!isAdminRequestType(requestType)) {
    return NextResponse.json({ error: 'Tipo de solicitud invalido' }, { status: 400 })
  }

  if (!VALID_DECISIONS.includes(decision)) {
    return NextResponse.json({ error: 'Decision invalida' }, { status: 400 })
  }

  try {
    await applyAdminRequestDecision(requestType, id, decision)
    await writeAdminAuditLog({
      actorUid: authResult.uid,
      action: `request.${decision}`,
      entity: {
        type: requestType,
        id,
        path: `${requestType}/${id}`,
      },
      summary: `Admin ${decision === 'approve' ? 'approved' : 'rejected'} ${requestType}/${id}`,
      metadata: { decision },
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Admin/Requests/PATCH] error:', error)
    await writeAdminAuditLog({
      actorUid: authResult.uid,
      action: `request.${decision}`,
      entity: {
        type: isAdminRequestType(requestType) ? requestType : 'unknown_request',
        id,
        path: `${requestType}/${id}`,
      },
      status: 'error',
      summary: `Admin request decision failed for ${requestType}/${id}`,
      metadata: { decision },
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    }).catch((auditError) => {
      console.error('[API/Admin/Requests/PATCH] audit error:', auditError)
    })
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Error al procesar la solicitud',
      },
      { status: 500 }
    )
  }
}
