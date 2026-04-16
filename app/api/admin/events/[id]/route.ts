import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { FieldValue } from 'firebase-admin/firestore'

type Params = { params: Promise<{ id: string }> }
type JsonRecord = Record<string, unknown>

function parseDate(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

function parseString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback
}

function parseOptionalString(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
}

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

function parseBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function parseLocations(value: unknown) {
  if (!Array.isArray(value)) return []

  return value.map((item) => {
    const location = item && typeof item === 'object' ? (item as JsonRecord) : {}
    return {
      name: parseString(location.name),
      address: parseString(location.address),
      latitude: parseNumber(location.latitude),
      longitude: parseNumber(location.longitude),
      date: parseDate(location.date),
      endTime: parseDate(location.endTime),
      description: parseString(location.description),
      country: parseString(location.country),
      city: parseString(location.city),
      isOnline: parseBoolean(location.isOnline),
      onlineLink: parseString(location.onlineLink),
      locationTBC: parseBoolean(location.locationTBC),
    }
  })
}

function parsePaymentMethods(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      const method = item && typeof item === 'object' ? (item as JsonRecord) : {}
      const type = parseString(method.type)
      const valueText = parseString(method.value)

      if (!type || !valueText) return null

      return {
        type,
        label: parseString(method.label),
        value: valueText,
        instructions: parseString(method.instructions),
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  const body = await request.json()

  const update = {
    title: parseString(body.title),
    description: parseString(body.description),
    category: parseString(body.category).toLowerCase(),
    groupId: parseOptionalString(body.groupId),
    startDate: parseDate(body.startDate),
    endDate: parseDate(body.endDate),
    recurrence: parseOptionalString(body.recurrence),
    recurrenceEndDate: parseDate(body.recurrenceEndDate),
    locations: parseLocations(body.locations),
    coOrganizerIds: parseStringArray(body.coOrganizerIds),
    showOrganizerGroups: parseBoolean(body.showOrganizerGroups, true),
    posterUrls: parseStringArray(body.posterUrls),
    price: Math.max(0, parseNumber(body.price)),
    currency: parseString(body.currency, 'CLP').toUpperCase() || 'CLP',
    paymentMethods: parsePaymentMethods(body.paymentMethods),
    updatedAt: FieldValue.serverTimestamp(),
  }

  try {
    await adminDb.collection('events').doc(id).update(update)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Events/PATCH] error:', error)
    return NextResponse.json({ error: 'Error al actualizar evento' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params

  try {
    await adminDb.collection('events').doc(id).delete()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Events/DELETE] error:', error)
    return NextResponse.json({ error: 'Error al eliminar evento' }, { status: 500 })
  }
}
