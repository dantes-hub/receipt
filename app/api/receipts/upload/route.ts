import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { and, eq, gte, count } from 'drizzle-orm'
import { waitUntil } from '@vercel/functions'
import { db } from '@/lib/db'
import { receipts } from '@/lib/db/schema'
import { captureException } from '@/lib/observability/error-tracking'
import { logError, logInfo, logWarn } from '@/lib/observability/logger'
import {
  detectReceiptFileType,
  getReceiptFileExtension,
  MAX_RECEIPT_FILE_SIZE_BYTES,
  validateReceiptFileSignature,
} from '@/lib/receipts/files'
import { enqueueReceiptProcessingJob, runReceiptProcessingJob } from '@/lib/receipts/processing'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { RECEIPTS_BUCKET } from '@/lib/supabase/storage'

const RATE_LIMIT_PER_HOUR = 20

async function isRateLimited(userId: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  const [result] = await db
    .select({ total: count() })
    .from(receipts)
    .where(and(eq(receipts.userId, userId), gte(receipts.createdAt, oneHourAgo)))
  return (result?.total ?? 0) >= RATE_LIMIT_PER_HOUR
}

function getUploadErrorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function getFileExtension(file: File, mimeType: 'image/jpeg' | 'image/png' | 'image/heic' | 'image/heif' | 'application/pdf') {
  const inferred = getReceiptFileExtension(mimeType)
  if (inferred) return inferred
  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName) return fromName
  return 'bin'
}

function buildStoragePath(userId: string, file: File, mimeType: 'image/jpeg' | 'image/png' | 'image/heic' | 'image/heif' | 'application/pdf') {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const extension = getFileExtension(file, mimeType)
  return `${userId}/${year}/${month}/${randomUUID()}.${extension}`
}

function getFirstFile(formData: FormData) {
  for (const value of formData.values()) {
    if (value instanceof File) return value
  }
  return null
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
    logWarn('receipt.upload.rate_limited', { userId: user.id })
    return getUploadErrorResponse('上傳次數已達每小時上限（20 張），請稍後再試。', 429)
  }

  const formData = await request.formData()
  const file = getFirstFile(formData)

  if (!file) return getUploadErrorResponse('請提供要上傳的檔案。', 400)
  if (file.size === 0) return getUploadErrorResponse('檔案內容不可為空。', 400)
  if (file.size > MAX_RECEIPT_FILE_SIZE_BYTES) return getUploadErrorResponse('檔案不可超過 10MB。', 400)

  const fileBuffer = Buffer.from(await file.arrayBuffer())
  const detectedType = detectReceiptFileType(fileBuffer)
  const signatureValidation = validateReceiptFileSignature(detectedType, file.type)

  if (!signatureValidation.ok) {
    logWarn('receipt.upload.invalid_signature', {
      userId: user.id,
      fileName: file.name,
      declaredMimeType: file.type,
      detectedType,
    })
    return getUploadErrorResponse(signatureValidation.message, 400)
  }

  const storagePath = buildStoragePath(user.id, file, signatureValidation.mimeType)

  const { error: uploadError } = await supabaseAdmin.storage
    .from(RECEIPTS_BUCKET)
    .upload(storagePath, fileBuffer, { contentType: signatureValidation.mimeType, upsert: false })

  if (uploadError) {
    logError('receipt.upload.storage_failed', {
      userId: user.id,
      fileName: file.name,
      storagePath,
      error: uploadError.message,
    })
    captureException(uploadError, { userId: user.id, storagePath, fileName: file.name })
    return getUploadErrorResponse(`檔案上傳失敗：${uploadError.message}`, 500)
  }

  const [insertedReceipt] = await db
    .insert(receipts)
    .values({ userId: user.id, imagePath: storagePath, status: 'pending' })
    .returning({ id: receipts.id, status: receipts.status, createdAt: receipts.createdAt })

  const job = await enqueueReceiptProcessingJob({
    receiptId: insertedReceipt.id,
    userId: user.id,
    storagePath,
    originalFilename: file.name,
    mimeType: signatureValidation.mimeType,
  })

  waitUntil(runReceiptProcessingJob(job.id))
  logInfo('receipt.upload.accepted', {
    receiptId: insertedReceipt.id,
    jobId: job.id,
    userId: user.id,
    fileName: file.name,
    mimeType: signatureValidation.mimeType,
    sizeBytes: file.size,
  })

  return NextResponse.json(
    {
      receiptId: insertedReceipt.id,
      status: 'pending',
      createdAt: insertedReceipt.createdAt,
      imagePath: storagePath,
      jobId: job.id,
      message: '檔案已上傳，辨識中...',
    },
    { status: 201 }
  )
}
