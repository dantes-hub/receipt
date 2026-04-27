import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const scriptDir = fileURLToPath(new URL('.', import.meta.url))
const fixturesPath = new URL('../demo/receipts.json', `file://${scriptDir}`)

const databaseUrl = process.env.DATABASE_URL
const userId = process.env.DEMO_USER_ID

if (!databaseUrl) {
  console.error('Missing DATABASE_URL')
  process.exit(1)
}

if (!userId) {
  console.error('Missing DEMO_USER_ID')
  process.exit(1)
}

const sql = postgres(databaseUrl, { prepare: false })
const fixtures = JSON.parse(await readFile(fixturesPath, 'utf8'))

function buildConfidenceScores(status) {
  if (status === 'error') {
    return {
      vendorName: 0,
      taxId: 0,
      invoiceNumber: 0,
      invoiceDate: 0,
      subtotal: 0,
      tax: 0,
      total: 0,
      category: 0,
      lineItems: 0,
    }
  }

  return {
    vendorName: 0.95,
    taxId: 0.96,
    invoiceNumber: 0.97,
    invoiceDate: 0.94,
    subtotal: 0.92,
    tax: 0.91,
    total: 0.98,
    category: 0.9,
    lineItems: 0.75,
  }
}

function buildValidationResults(status) {
  if (status === 'confirmed') {
    return {
      fields: {
        vendorName: [{ status: 'pass', label: '廠商名稱已擷取' }],
        taxId: [{ status: 'pass', label: '統編 checksum 驗證通過' }],
        invoiceNumber: [{ status: 'pass', label: '發票號碼格式正確' }],
        invoiceDate: [{ status: 'pass', label: '日期格式合理' }],
        subtotal: [{ status: 'pass', label: '未稅金額已擷取' }],
        tax: [{ status: 'pass', label: '稅率 5% 一致' }],
        total: [{ status: 'pass', label: '總金額已擷取' }],
        category: [{ status: 'pass', label: '分類已設定' }],
      },
      summary: {
        passedChecks: 8,
        warningChecks: 0,
        failedChecks: 0,
        totalChecks: 8,
      },
      status: 'ready',
    }
  }

  if (status === 'review') {
    return {
      fields: {
        vendorName: [{ status: 'pass', label: '廠商名稱已擷取' }],
        taxId: [{ status: 'pass', label: '非統一發票，通常不含統編' }],
        invoiceNumber: [{ status: 'pass', label: '非統一發票，通常不含發票號碼' }],
        invoiceDate: [{ status: 'pass', label: '日期格式合理' }],
        subtotal: [{ status: 'warn', label: '非統一發票，通常不含未稅金額' }],
        tax: [{ status: 'pass', label: '非統一發票，未提供稅額拆分' }],
        total: [{ status: 'pass', label: '總金額已擷取' }],
        category: [{ status: 'pass', label: '分類已設定' }],
      },
      summary: {
        passedChecks: 7,
        warningChecks: 1,
        failedChecks: 0,
        totalChecks: 8,
      },
      status: 'needs_review',
    }
  }

  return {
    fields: {
      vendorName: [{ status: 'fail', label: '缺少廠商名稱' }],
      taxId: [{ status: 'pass', label: '非統一發票，通常不含統編' }],
      invoiceNumber: [{ status: 'pass', label: '非統一發票，通常不含發票號碼' }],
      invoiceDate: [{ status: 'fail', label: '缺少發票日期' }],
      subtotal: [{ status: 'warn', label: '非統一發票，通常不含未稅金額' }],
      tax: [{ status: 'pass', label: '非統一發票，未提供稅額拆分' }],
      total: [{ status: 'warn', label: '總金額為 0，請人工確認' }],
      category: [{ status: 'pass', label: '分類已設定' }],
    },
    summary: {
      passedChecks: 4,
      warningChecks: 2,
      failedChecks: 2,
      totalChecks: 8,
    },
    status: 'rejected',
  }
}

for (const fixture of fixtures) {
  const receiptId = randomUUID()
  const createdAt = new Date().toISOString()

  await sql`
    insert into receipts (
      id,
      user_id,
      image_path,
      status,
      receipt_type,
      extracted_data,
      confidence_scores,
      validation_results,
      ai_model,
      processing_ms,
      period_year,
      period_month,
      notes,
      created_at,
      updated_at
    ) values (
      ${receiptId}::uuid,
      ${userId}::uuid,
      ${`demo/${fixture.invoiceNumber || receiptId}.jpg`},
      ${fixture.status},
      ${fixture.receiptType},
      ${JSON.stringify({
        receiptType: fixture.receiptType,
        vendorName: fixture.vendorName,
        taxId: fixture.taxId,
        invoiceNumber: fixture.invoiceNumber,
        invoiceDate: fixture.invoiceDate,
        subtotal: fixture.subtotal,
        tax: fixture.tax,
        total: fixture.total,
        category: fixture.category,
        lineItems: [],
        notes: fixture.notes,
      })}::jsonb,
      ${JSON.stringify(buildConfidenceScores(fixture.status))}::jsonb,
      ${JSON.stringify(buildValidationResults(fixture.status))}::jsonb,
      ${'demo-seed'},
      ${fixture.processingMs},
      ${fixture.invoiceDate ? Number(fixture.invoiceDate.slice(0, 4)) : null},
      ${fixture.invoiceDate ? Number(fixture.invoiceDate.slice(5, 7)) : null},
      ${fixture.notes},
      ${createdAt}::timestamptz,
      ${createdAt}::timestamptz
    )
  `
}

await sql.end()
console.log(`Seeded ${fixtures.length} demo receipts for ${userId}`)
