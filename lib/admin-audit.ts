import 'server-only'

import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'

type AuditStatus = 'success' | 'error'

type AuditEntity = Readonly<{
  type: string
  id: string
  path?: string
}>

type AuditPayload = Readonly<{
  actorUid: string
  action: string
  entity: AuditEntity
  status?: AuditStatus
  summary?: string
  metadata?: Record<string, unknown>
  errorMessage?: string
}>

export async function writeAdminAuditLog({
  actorUid,
  action,
  entity,
  status = 'success',
  summary,
  metadata,
  errorMessage,
}: AuditPayload) {
  await adminDb.collection('adminAuditLogs').add({
    actorUid,
    action,
    entity,
    status,
    summary: summary ?? null,
    metadata: metadata ?? {},
    errorMessage: errorMessage ?? null,
    createdAt: FieldValue.serverTimestamp(),
  })
}
