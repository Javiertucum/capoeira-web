import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/verify-api-session'
import {
  getAdminUsersForExport,
  getAdminGroupsForExport,
  getAdminEvents,
  getAdminAttendanceRows,
  getAdminClassPaymentRows,
} from '@/lib/admin-queries'

type Params = { params: Promise<{ type: string }> }

type Row = Record<string, string | number | null | undefined>

function toCsv(headers: string[], rows: Row[]): string {
  const escape = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const header = headers.join(',')
  const body = rows.map((row) => headers.map((h) => escape(row[h])).join(',')).join('\n')
  return `${header}\n${body}`
}

export async function GET(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  const { type } = await params

  let csv: string
  let filename: string

  if (type === 'users') {
    const rows = await getAdminUsersForExport()
    const headers = ['uid', 'name', 'email', 'role', 'country', 'groupId', 'plan', 'createdAt']
    csv = toCsv(headers, rows)
    filename = 'usuarios.csv'
  } else if (type === 'events') {
    const rows = await getAdminEvents(2000)
    const headers = ['id', 'title', 'category', 'startDate', 'endDate', 'createdBy', 'goingCount', 'interestedCount']
    csv = toCsv(headers, rows.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      startDate: row.startDate,
      endDate: row.endDate,
      createdBy: row.createdBy,
      goingCount: row.goingCount,
      interestedCount: row.interestedCount,
    })))
    filename = 'eventos.csv'
  } else if (type === 'groups') {
    const rows = await getAdminGroupsForExport()
    const headers = ['id', 'name', 'country', 'memberCount', 'nucleoCount']
    csv = toCsv(headers, rows)
    filename = 'grupos.csv'
  } else if (type === 'attendance') {
    const rows = await getAdminAttendanceRows(5000)
    const headers = ['groupName', 'nucleoName', 'date', 'attendees', 'absentees', 'pct', 'createdBy']
    csv = toCsv(headers, rows.map((row) => {
      const total = row.attendees + row.absentees
      return {
        groupName: row.groupName,
        nucleoName: row.nucleoName,
        date: row.date,
        attendees: row.attendees,
        absentees: row.absentees,
        pct: total > 0 ? Math.round((row.attendees / total) * 100) : 0,
        createdBy: row.createdBy,
      }
    }))
    filename = 'asistencia.csv'
  } else if (type === 'payments') {
    const rows = await getAdminClassPaymentRows(5000)
    const headers = ['groupName', 'nucleoName', 'userId', 'month', 'status', 'amount', 'billingMode']
    csv = toCsv(headers, rows.map((row) => ({
      groupName: row.groupName,
      nucleoName: row.nucleoName,
      userId: row.userId,
      month: row.month,
      status: row.status,
      amount: row.amount,
      billingMode: row.billingMode,
    })))
    filename = 'pagos.csv'
  } else {
    return NextResponse.json({ error: 'Tipo de export no soportado' }, { status: 400 })
  }

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
