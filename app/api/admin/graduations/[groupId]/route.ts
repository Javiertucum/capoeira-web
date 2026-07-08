import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { notifyGroupAdminGraduationChange } from '@/lib/graduation-admin-notify'

type Params = { params: Promise<{ groupId: string }> }

const HEX_REGEX = /^#[0-9a-fA-F]{3,6}$/

function asHexOrNull(value: unknown): string | null {
  return typeof value === 'string' && HEX_REGEX.test(value.trim()) ? value.trim() : null
}

export async function POST(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId } = await params
  const body = await request.json() as Record<string, unknown>

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const colors = Array.isArray(body.colors)
    ? body.colors.filter((c): c is string => typeof c === 'string' && HEX_REGEX.test(c.trim()))
    : []

  if (!name) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
  if (colors.length < 1 || colors.length > 6) {
    return NextResponse.json({ error: 'La graduación debe tener entre 1 y 6 colores' }, { status: 400 })
  }

  const order = Number.isFinite(Number(body.order)) ? Number(body.order) : 0

  // Categoría válida — solo se persiste si es uno de los tres valores permitidos por la app.
  const VALID_CATEGORIES = ['adult', 'infantil', 'juvenil']
  const category =
    typeof body.category === 'string' && VALID_CATEGORIES.includes(body.category)
      ? body.category
      : 'adult'

  // Si notify === false (enviado explícitamente), omitir push al admin del grupo.
  // Útil cuando el admin web crea múltiples niveles en serie y quiere notificar solo al final.
  const shouldNotify = body.notify !== false

  try {
    await adminDb
      .collection('groups')
      .doc(groupId)
      .collection('graduationLevels')
      .add({
        name,
        order,
        colors,
        category,
        isEducator: body.isEducator === true,
        isEstagiario: body.isEstagiario === true,
        isSpecial: body.isSpecial === true,
        tipColorLeft: asHexOrNull(body.tipColorLeft),
        tipColorRight: asHexOrNull(body.tipColorRight),
        midColorLeft: asHexOrNull(body.midColorLeft),
        midColorRight: asHexOrNull(body.midColorRight),
        createdAt: FieldValue.serverTimestamp(),
      })

    if (shouldNotify) {
      await notifyGroupAdminGraduationChange(groupId, 'created', name)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[API/Graduations/POST] error:', error)
    return NextResponse.json({ error: 'Error al crear graduacion' }, { status: 500 })
  }
}