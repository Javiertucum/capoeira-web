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
    return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
  }

  const ref = adminDb.collection('adminExportJobs').doc()
  await ref.set({
    title,
    type: 'json',
    status: 'queued',
    attempts: 0,
    maxAttempts: 3,
    downloadUrl: null,
    errorMessage: null,
    createdBy: authResult.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    metadata: { scope: 'all' },
  })

  await writeAdminAuditLog({
    actorUid: authResult.uid,
    action: 'export.create',
    entity: { type: 'adminExportJob', id: ref.id, path: `adminExportJobs/${ref.id}` },
    summary: `Queued export job ${title}`,
  })

  return NextResponse.json({ ok: true, id: ref.id })
}
