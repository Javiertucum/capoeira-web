import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { writeAdminAuditLog } from '@/lib/admin-audit'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json().catch(() => ({}))
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  if (!title) {
    return NextResponse.json({ error: 'Titulo requerido' }, { status: 400 })
  }

  const ref = adminDb.collection('adminNotificationCampaigns').doc()
  await ref.set({
    title,
    status: 'draft',
    type: 'push',
    segment: { roles: [], countries: [], groupIds: [], nucleoIds: [], subscriptionPlans: [], userIds: [] },
    metrics: { targeted: 0, sent: 0, failed: 0 },
    createdBy: authResult.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  await writeAdminAuditLog({
    actorUid: authResult.uid,
    action: 'notification.create',
    entity: { type: 'adminNotificationCampaign', id: ref.id, path: `adminNotificationCampaigns/${ref.id}` },
    summary: `Created notification campaign ${title}`,
  })

  return NextResponse.json({ ok: true, id: ref.id })
}
