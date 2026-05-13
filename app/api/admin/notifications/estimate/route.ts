import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { resolveAudience, type SegmentFilter } from '@/lib/notification-audience'

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json().catch(() => ({})) as Record<string, unknown>

  const segment: SegmentFilter = {
    roles: Array.isArray(body.roles) ? (body.roles as string[]) : [],
    countries: Array.isArray(body.countries) ? (body.countries as string[]) : [],
    appVersions: Array.isArray(body.appVersions) ? (body.appVersions as string[]) : [],
    groupIds: Array.isArray(body.groupIds) ? (body.groupIds as string[]) : [],
    nucleoIds: Array.isArray(body.nucleoIds) ? (body.nucleoIds as string[]) : [],
    subscriptionPlans: Array.isArray(body.subscriptionPlans) ? (body.subscriptionPlans as string[]) : [],
    userIds: Array.isArray(body.userIds) ? (body.userIds as string[]) : [],
    noGroup: body.noGroup === true,
    adminsOnly: body.adminsOnly === true,
  }

  const entries = await resolveAudience(segment)
  return NextResponse.json({ count: entries.length })
}
