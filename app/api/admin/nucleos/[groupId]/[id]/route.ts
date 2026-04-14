import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'

type Params = {
  params: Promise<{ groupId: string; id: string }>
}

function parseNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function parseStringArray(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

function parseSchedules(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const schedule = item as Record<string, unknown>
      const dayOfWeek = parseNumber(schedule.dayOfWeek)
      const startTime = typeof schedule.startTime === 'string' ? schedule.startTime : null
      const endTime = typeof schedule.endTime === 'string' ? schedule.endTime : null

      if (dayOfWeek === null || !startTime || !endTime) {
        return null
      }

      return {
        dayOfWeek,
        startTime,
        endTime,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId, id } = await params
  const body = await request.json()

  try {
    await adminDb
      .collection('groups')
      .doc(groupId)
      .collection('nucleos')
      .doc(id)
      .update({
        name: typeof body.name === 'string' ? body.name : '',
        city: typeof body.city === 'string' ? body.city : null,
        country: typeof body.country === 'string' ? body.country : null,
        address: typeof body.address === 'string' ? body.address : null,
        latitude: parseNumber(body.latitude),
        longitude: parseNumber(body.longitude),
        responsibleEducatorId:
          typeof body.responsibleEducatorId === 'string' ? body.responsibleEducatorId : null,
        coEducatorIds: parseStringArray(body.coEducatorIds),
        schedules: parseSchedules(body.schedules),
        updatedAt: FieldValue.serverTimestamp(),
      })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Nucleos/PATCH] error:', error)
    return NextResponse.json({ error: 'Error al actualizar nucleo' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId, id } = await params

  try {
    await adminDb.collection('groups').doc(groupId).collection('nucleos').doc(id).delete()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Nucleos/DELETE] error:', error)
    return NextResponse.json({ error: 'Error al eliminar nucleo' }, { status: 500 })
  }
}
