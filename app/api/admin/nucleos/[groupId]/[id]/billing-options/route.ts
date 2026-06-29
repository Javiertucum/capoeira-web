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

const VALID_MODES = ['free', 'monthly', 'perClass', 'classPack']

function parseBillingOptions(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const option = item as Record<string, unknown>
      const id = typeof option.id === 'string' && option.id ? option.id : null
      const name = typeof option.name === 'string' ? option.name.trim() : ''
      const mode = typeof option.mode === 'string' ? option.mode : null
      if (!id || !name || !mode || !VALID_MODES.includes(mode)) return null

      return {
        id,
        name,
        mode,
        scheduleKeys: parseStringArray(option.scheduleKeys),
        scheduleGroupName:
          typeof option.scheduleGroupName === 'string' && option.scheduleGroupName
            ? option.scheduleGroupName
            : null,
        monthlyFee: parseNumber(option.monthlyFee),
        classFee: parseNumber(option.classFee),
        classesPerPackage: parseNumber(option.classesPerPackage),
        isDefault: typeof option.isDefault === 'boolean' ? option.isDefault : false,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

// Ruta dedicada y separada del PATCH principal de nucleo (que sobreescribe el
// documento completo) — solo toca el campo billingOptions, nunca el resto del doc.
export async function PATCH(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId, id } = await params
  const body = await request.json().catch(() => ({}))

  try {
    await adminDb
      .collection('groups')
      .doc(groupId)
      .collection('nucleos')
      .doc(id)
      .update({
        billingOptions: parseBillingOptions(body.billingOptions),
        updatedAt: FieldValue.serverTimestamp(),
      })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Nucleos/BillingOptions/PATCH] error:', error)
    return NextResponse.json({ error: 'Error al guardar las modalidades de cobro' }, { status: 500 })
  }
}
