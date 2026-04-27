import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { exportBatches } from '@/lib/db/schema'
import { captureException } from '@/lib/observability/error-tracking'
import { logError, logInfo } from '@/lib/observability/logger'
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

  try {
    const csv = buildAccountantCsv(receipts)

    await db.insert(exportBatches).values({
      userId: user.id,
      periodYear: monthParts.periodYear,
      periodMonth: monthParts.periodMonth,
      filePath: null,
      receiptCount: receipts.length,
    })

    logInfo('receipt.export.completed', {
      userId: user.id,
      dateFrom,
      dateTo,
      confirmedOnly,
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
  } catch (error) {
    logError('receipt.export.failed', {
      userId: user.id,
      dateFrom,
      dateTo,
      confirmedOnly,
      error: error instanceof Error ? error.message : 'unknown-error',
    })
    captureException(error, {
      userId: user.id,
      dateFrom,
      dateTo,
      confirmedOnly,
      service: 'accountant-csv-export',
    })
    return getExportError('匯出失敗，請稍後再試。', 500)
  }
}
