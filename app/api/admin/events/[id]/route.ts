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

// El cronograma (agenda) son los bloques del programa que el usuario carga. Es la fuente
// del cronograma que se muestra en la app; nunca debe contener `undefined` (Firestore lo
// rechaza), por eso los campos de texto caen a string vacío.
function parseAgenda(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .map((item, index) => {
      const block = item && typeof item === 'object' ? (item as JsonRecord) : {}
      const title = parseString(block.title)
      const startTime = parseString(block.startTime)
      if (!title || !startTime) return null

      const result: JsonRecord = {
        id: parseString(block.id) || `block-${Date.now()}-${index}`,
        title,
        startTime,
      }
      const endTime = parseString(block.endTime)
      if (endTime) result.endTime = endTime
      const description = parseString(block.description)
      if (description) result.description = description

      const loc = block.location && typeof block.location === 'object' ? (block.location as JsonRecord) : null
      if (loc) {
        const isOnline = parseBoolean(loc.isOnline)
        const locationTBC = parseBoolean(loc.locationTBC)
        const address = parseString(loc.address)
        const onlineLink = parseString(loc.onlineLink)
        // Solo adjuntar location si el bloque realmente tiene lugar.
        if (isOnline || locationTBC || address || onlineLink) {
          result.location = {
            address,
            latitude: parseNumber(loc.latitude),
            longitude: parseNumber(loc.longitude),
            name: parseString(loc.name),
            country: parseString(loc.country),
            city: parseString(loc.city),
            isOnline,
            onlineLink,
            locationTBC,
          }
        }
      }
      return result
    })
    .filter((item): item is JsonRecord => item !== null)
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

  const update: Record<string, unknown> = {
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

  // Solo se toca `agenda` si el cliente la envía -- así otro cliente que no la mande
  // nunca borra el cronograma existente por accidente.
  if ('agenda' in body) {
    update.agenda = parseAgenda(body.agenda)
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
