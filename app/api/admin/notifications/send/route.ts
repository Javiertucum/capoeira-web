import { NextRequest, NextResponse } from 'next/server'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { adminDb } from '@/lib/firebase-admin'
import { runCampaignSend, type DeepLink } from '@/lib/notification-send-campaign'
import { type SegmentFilter } from '@/lib/notification-audience'

// Allow extra time for large audiences (Firestore + FCM round trips)
export const maxDuration = 60

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json().catch(() => ({})) as Record<string, unknown>
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const messageBody = typeof body.body === 'string' ? body.body.trim() : ''

  if (!title || !messageBody) {
    return NextResponse.json({ error: 'Título y cuerpo son requeridos' }, { status: 400 })
  }

  const segment: SegmentFilter = {
    roles: Array.isArray(body.roles) ? (body.roles as string[]) : [],
    countries: Array.isArray(body.countries) ? (body.countries as string[]) : [],
    groupIds: Array.isArray(body.groupIds) ? (body.groupIds as string[]) : [],
    nucleoIds: Array.isArray(body.nucleoIds) ? (body.nucleoIds as string[]) : [],
    subscriptionPlans: Array.isArray(body.subscriptionPlans) ? (body.subscriptionPlans as string[]) : [],
    userIds: Array.isArray(body.userIds) ? (body.userIds as string[]) : [],
    noGroup: body.noGroup === true,
    languages: Array.isArray(body.languages) ? (body.languages as string[]) : [],
  }

  const deepLink: DeepLink | undefined =
    typeof body.screen === 'string' && body.screen
      ? {
          screen: body.screen as string,
          entityId: typeof body.entityId === 'string' ? body.entityId : undefined,
          entityType: typeof body.entityType === 'string' ? body.entityType : undefined,
        }
      : undefined

  const scheduledAtRaw = typeof body.scheduledAt === 'string' ? new Date(body.scheduledAt) : null
  const scheduledAt = scheduledAtRaw && !Number.isNaN(scheduledAtRaw.getTime()) ? scheduledAtRaw : null

  // Future date → store the campaign as pending; the cron processor sends it when due.
  if (scheduledAt && scheduledAt.getTime() > Date.now()) {
    const ref = adminDb.collection('adminNotificationCampaigns').doc()
    await ref.set({
      title,
      body: messageBody,
      status: 'scheduled',
      type: 'push',
      segment,
      deepLink: deepLink ?? null,
      scheduledAt: Timestamp.fromDate(scheduledAt),
      metrics: { targeted: 0, sent: 0, failed: 0, opened: 0, purged: 0 },
      createdBy: authResult.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({
      ok: true,
      id: ref.id,
      scheduled: true,
      scheduledAt: scheduledAt.toISOString(),
    })
  }

  const result = await runCampaignSend({
    title,
    body: messageBody,
    segment,
    deepLink,
    createdBy: authResult.uid,
  })

  if (result.empty) {
    return NextResponse.json(
      { error: 'No se encontraron tokens para el segmento seleccionado' },
      { status: 400 },
    )
  }

  return NextResponse.json({
    ok: true,
    id: result.campaignId,
    targeted: result.targeted,
    sent: result.sent,
    failed: result.failed,
    purged: result.purged,
    errors: result.errors,
  })
}
