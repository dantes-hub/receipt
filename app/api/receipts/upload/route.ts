import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { eq, gte, count } from 'drizzle-orm'
import { db } from '@/lib/db'
import { receipts, validationLogs } from '@/lib/db/schema'
import { extractReceiptFromFile } from '@/lib/ai/extract'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { RECEIPTS_BUCKET } from '@/lib/supabase/storage'
import { validateReceipt } from '@/lib/validation/receipt'
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const RATE_LIMIT_PER_HOUR = 20

async function isRateLimited(userId: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  const [result] = await db
    .select({ total: count() })
    .from(receipts)
    .where(eq(receipts.userId, userId) && gte(receipts.createdAt, oneHourAgo))
  return (result?.total ?? 0) >= RATE_LIMIT_PER_HOUR
}

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'application/pdf',
])

const mimeTypeToExtension: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'application/pdf': 'pdf',
}

function getUploadErrorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function getFileExtension(file: File) {
  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName) {
    return fromName
  }

  return mimeTypeToExtension[file.type] ?? 'bin'
}

function buildStoragePath(userId: string, file: File) {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const extension = getFileExtension(file)

  return `${userId}/${year}/${month}/${randomUUID()}.${extension}`
}

function getFirstFile(formData: FormData) {
  for (const value of formData.values()) {
    if (value instanceof File) {
      return value
    }
  }

  return null
}

function getValidationInputValue(
  extractedData: {
    vendorName: string
    taxId: string
    invoiceNumber: string
    invoiceDate: string
    subtotal: number
    tax: number
    total: number
    category: string
  },
  fieldName: string
) {
  switch (fieldName) {
    case 'vendorName':
      return extractedData.vendorName
    case 'taxId':
      return extractedData.taxId
    case 'invoiceNumber':
      return extractedData.invoiceNumber
    case 'invoiceDate':
      return extractedData.invoiceDate
    case 'subtotal':
      return extractedData.subtotal
    case 'tax':
      return extractedData.tax
    case 'total':
      return extractedData.total
    case 'category':
      return extractedData.category
    default:
      return ''
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return getUploadErrorResponse('請先登入再上傳發票。', 401)
  }

  if (await isRateLimited(user.id)) {
    return getUploadErrorResponse('上傳次數已達每小時上限（20 張），請稍後再試。', 429)
  }

  const formData = await request.formData()
  const file = getFirstFile(formData)

  if (!file) {
    return getUploadErrorResponse('請提供要上傳的檔案。', 400)
  }

  if (file.size === 0) {
    return getUploadErrorResponse('檔案內容不可為空。', 400)
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return getUploadErrorResponse('檔案不可超過 10MB。', 400)
  }

  if (!allowedMimeTypes.has(file.type)) {
    return getUploadErrorResponse('僅支援 JPG、PNG、HEIC、HEIF、PDF。', 400)
  }

  const storagePath = buildStoragePath(user.id, file)
  const fileBuffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseAdmin.storage
    .from(RECEIPTS_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return getUploadErrorResponse(`檔案上傳失敗：${uploadError.message}`, 500)
  }

  const [insertedReceipt] = await db
    .insert(receipts)
    .values({
      userId: user.id,
      imagePath: storagePath,
      status: 'pending',
    })
    .returning({
      id: receipts.id,
      status: receipts.status,
      createdAt: receipts.createdAt,
    })

  try {
    await db
      .update(receipts)
      .set({
        status: 'extracting',
        updatedAt: new Date(),
      })
      .where(eq(receipts.id, insertedReceipt.id))

    const extractionStartedAt = Date.now()
    const extraction = await extractReceiptFromFile({
      fileBuffer,
      mimeType: file.type,
      fileName: file.name,
    })
    const validationReport = validateReceipt(extraction.extractedData)
    const processingMs = Date.now() - extractionStartedAt
    const invoiceDate = extraction.extractedData.invoiceDate
    const [yearString, monthString] = invoiceDate.split('-')
    const periodYear = yearString ? Number(yearString) : null
    const periodMonth = monthString ? Number(monthString) : null

    await db
      .update(receipts)
      .set({
        status: 'review',
        receiptType: extraction.extractedData.receiptType,
        extractedData: extraction.extractedData,
        confidenceScores: extraction.confidenceScores,
        validationResults: validationReport,
        aiModel: extraction.model,
        processingMs,
        periodYear: Number.isFinite(periodYear) ? periodYear : null,
        periodMonth: Number.isFinite(periodMonth) ? periodMonth : null,
        updatedAt: new Date(),
      })
      .where(eq(receipts.id, insertedReceipt.id))

    const validationLogValues = Object.entries(validationReport.fields).flatMap(([fieldName, results]) =>
      results.map((result) => ({
        receiptId: insertedReceipt.id,
        validatorName: fieldName,
        passed: result.status === 'pass',
        inputValue: JSON.stringify(getValidationInputValue(extraction.extractedData, fieldName)),
        errorMessage: result.status === 'pass' ? null : result.label,
      }))
    )

    if (validationLogValues.length > 0) {
      await db.insert(validationLogs).values(validationLogValues)
    }
  } catch (error) {
    await db
      .update(receipts)
      .set({
        status: 'error',
        notes: error instanceof Error ? error.message : 'Receipt processing failed.',
        updatedAt: new Date(),
      })
      .where(eq(receipts.id, insertedReceipt.id))

    return getUploadErrorResponse(
      error instanceof Error ? `發票辨識失敗：${error.message}` : '發票辨識失敗',
      500
    )
  }

  return NextResponse.json(
    {
      receiptId: insertedReceipt.id,
      status: 'review',
      createdAt: insertedReceipt.createdAt,
      imagePath: storagePath,
      extractionQueued: true,
      message: '檔案已上傳並完成初步辨識。',
    },
    { status: 201 }
  )
}
