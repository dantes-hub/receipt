import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { exportBatches } from '@/lib/db/schema'
import { buildAccountantCsv } from '@/lib/export/accountant-csv'
import { getReceiptsForExport } from '@/lib/receipts/queries'
import { createClient } from '@/lib/supabase/server'

function getExportError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function getMonthParts(dateFrom: string) {
  const match = dateFrom.match(/^(\d{4})-(\d{2})-\d{2}$/)
  if (!match) {
    return null
  }

  return {
    periodYear: Number(match[1]),
    periodMonth: Number(match[2]),
  }
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return getExportError('請先登入再匯出資料。', 401)
  }

  const { searchParams } = new URL(request.url)
  const dateFrom = searchParams.get('dateFrom')
  const dateTo = searchParams.get('dateTo')
  const confirmedOnly = searchParams.get('confirmedOnly') !== 'false'

  if (!dateFrom || !dateTo) {
    return getExportError('匯出需要 dateFrom 與 dateTo。', 400)
  }

  const monthParts = getMonthParts(dateFrom)
  if (!monthParts) {
    return getExportError('dateFrom 格式必須為 YYYY-MM-DD。', 400)
  }

  const receipts = await getReceiptsForExport({
    userId: user.id,
    dateFrom,
    dateTo,
    confirmedOnly,
  })

  const csv = buildAccountantCsv(receipts)

  await db.insert(exportBatches).values({
    userId: user.id,
    periodYear: monthParts.periodYear,
    periodMonth: monthParts.periodMonth,
    filePath: null,
    receiptCount: receipts.length,
  })

  const fileName = `receiptbridge-accountant-${dateFrom}-to-${dateTo}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store',
    },
  })
}
