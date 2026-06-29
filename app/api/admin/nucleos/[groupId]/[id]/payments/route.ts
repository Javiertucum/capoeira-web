import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import { getAdminNucleoPayments } from '@/lib/admin-queries'

type Params = {
  params: Promise<{ groupId: string; id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { groupId, id: nucleoId } = await params
  const monthsParam = request.nextUrl.searchParams.get('months') ?? ''
  const months = monthsParam
    .split(',')
    .map((month) => month.trim())
    .filter(Boolean)

  try {
    const payments = await getAdminNucleoPayments(groupId, nucleoId, months)
    return NextResponse.json({ payments })
  } catch (error) {
    console.error('[API/Nucleos/Payments/GET] error:', error)
    return NextResponse.json({ error: 'Error al cargar pagos' }, { status: 500 })
  }
}
