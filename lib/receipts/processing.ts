import { randomUUID } from 'node:crypto'
import { and, asc, eq, inArray, lte, lt, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { receiptProcessingJobs, receipts, validationLogs } from '@/lib/db/schema'
import { extractReceiptFromFile } from '@/lib/ai/extract'
import { getReceiptPeriodParts } from '@/lib/receipts/model'
import { captureException } from '@/lib/observability/error-tracking'
import { logError, logInfo, logWarn } from '@/lib/observability/logger'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { RECEIPTS_BUCKET } from '@/lib/supabase/storage'
import { enrichWithMoea, validateReceipt } from '@/lib/validation/receipt'

const BASE_RETRY_DELAY_MS = 30_000

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
    case 'vendorName': return extractedData.vendorName
    case 'taxId': return extractedData.taxId
    case 'invoiceNumber': return extractedData.invoiceNumber
    case 'invoiceDate': return extractedData.invoiceDate
    case 'subtotal': return extractedData.subtotal
    case 'tax': return extractedData.tax
    case 'total': return extractedData.total
    case 'category': return extractedData.category
    default: return ''
  }
}

function getRetryDelayMs(attemptNumber: number) {
  return BASE_RETRY_DELAY_MS * 2 ** Math.max(0, attemptNumber - 1)
}

async function loadJobFile(storagePath: string) {
  const { data, error } = await supabaseAdmin.storage.from(RECEIPTS_BUCKET).download(storagePath)
  if (error || !data) {
    throw new Error(`無法讀取已上傳檔案：${error?.message ?? storagePath}`)
  }

  return Buffer.from(await data.arrayBuffer())
}

async function writeValidationLogs(receiptId: string, extractedData: {
  vendorName: string
  taxId: string
  invoiceNumber: string
  invoiceDate: string
  subtotal: number
  tax: number
  total: number
  category: string
}, validationReport: Awaited<ReturnType<typeof validateReceipt>>) {
  const validationLogValues = Object.entries(validationReport.fields).flatMap(([fieldName, results]) =>
    results.map((result) => ({
      receiptId,
      validatorName: fieldName,
      passed: result.status === 'pass',
      inputValue: JSON.stringify(getValidationInputValue(extractedData, fieldName)),
      errorMessage: result.status === 'pass' ? null : result.label,
    }))
  )

  if (validationLogValues.length > 0) {
    await db.insert(validationLogs).values(validationLogValues)
  }
}

async function claimReceiptProcessingJob(jobId: string) {
  const now = new Date()
  const [job] = await db
    .update(receiptProcessingJobs)
    .set({
      status: 'processing',
      attempts: sql`${receiptProcessingJobs.attempts} + 1`,
      lockedAt: now,
      startedAt: now,
      lastAttemptAt: now,
      updatedAt: now,
      lastError: null,
    })
    .where(
      and(
        eq(receiptProcessingJobs.id, jobId),
        inArray(receiptProcessingJobs.status, ['pending', 'failed']),
        lte(receiptProcessingJobs.availableAt, now),
        lt(receiptProcessingJobs.attempts, receiptProcessingJobs.maxAttempts)
      )
    )
    .returning()

  return job ?? null
}

async function markJobForRetry(jobId: string, attempts: number, maxAttempts: number, errorMessage: string) {
  const exhausted = attempts >= maxAttempts
  const now = new Date()
  const availableAt = new Date(now.getTime() + getRetryDelayMs(attempts))

  await db
    .update(receiptProcessingJobs)
    .set({
      status: exhausted ? 'failed' : 'pending',
      lockedAt: null,
      finishedAt: exhausted ? now : null,
      lastError: errorMessage,
      availableAt: exhausted ? now : availableAt,
      updatedAt: now,
    })
    .where(eq(receiptProcessingJobs.id, jobId))

  return exhausted
}

export async function enqueueReceiptProcessingJob(input: {
  receiptId: string
  userId: string
  storagePath: string
  originalFilename: string
  mimeType: string
}) {
  const [job] = await db
    .insert(receiptProcessingJobs)
    .values({
      id: randomUUID(),
      receiptId: input.receiptId,
      userId: input.userId,
      storagePath: input.storagePath,
      originalFilename: input.originalFilename,
      mimeType: input.mimeType,
      status: 'pending',
    })
    .returning()

  logInfo('receipt.job.enqueued', {
    receiptId: input.receiptId,
    jobId: job.id,
    storagePath: input.storagePath,
  })

  return job
}

export async function runReceiptProcessingJob(jobId: string) {
  const job = await claimReceiptProcessingJob(jobId)
  if (!job) {
    logWarn('receipt.job.skipped', { jobId, reason: 'job-not-claimable' })
    return { processed: false, reason: 'job-not-claimable' as const }
  }

  logInfo('receipt.job.started', {
    jobId: job.id,
    receiptId: job.receiptId,
    attempt: job.attempts,
  })

  try {
    await db
      .update(receipts)
      .set({ status: 'extracting', updatedAt: new Date() })
      .where(eq(receipts.id, job.receiptId))

    const fileBuffer = await loadJobFile(job.storagePath)
    const extractionStartedAt = Date.now()
    const extraction = await extractReceiptFromFile({
      fileBuffer,
      mimeType: job.mimeType,
      fileName: job.originalFilename,
    })
    const baseValidation = validateReceipt(extraction.extractedData)
    logInfo('receipt.validation.completed', {
      jobId: job.id,
      receiptId: job.receiptId,
      status: baseValidation.status,
      failedChecks: baseValidation.summary.failedChecks,
      warningChecks: baseValidation.summary.warningChecks,
    })
    const validationReport = await enrichWithMoea(baseValidation, extraction.extractedData)
    const processingMs = Date.now() - extractionStartedAt
    const { periodYear, periodMonth } = getReceiptPeriodParts(extraction.extractedData.invoiceDate)

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
        periodYear,
        periodMonth,
        updatedAt: new Date(),
      })
      .where(eq(receipts.id, job.receiptId))

    await writeValidationLogs(job.receiptId, extraction.extractedData, validationReport)

    await db
      .update(receiptProcessingJobs)
      .set({
        status: 'completed',
        lockedAt: null,
        finishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(receiptProcessingJobs.id, job.id))

    logInfo('receipt.job.completed', {
      jobId: job.id,
      receiptId: job.receiptId,
      processingMs,
      retriedByModel: extraction.retried,
      aiModel: extraction.model,
    })

    return { processed: true, status: 'completed' as const }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Receipt processing failed.'
    const exhausted = await markJobForRetry(job.id, job.attempts, job.maxAttempts, message)

    await db
      .update(receipts)
      .set({
        status: exhausted ? 'error' : 'pending',
        notes: message,
        updatedAt: new Date(),
      })
      .where(eq(receipts.id, job.receiptId))

    logError('receipt.job.failed', {
      jobId: job.id,
      receiptId: job.receiptId,
      attempt: job.attempts,
      maxAttempts: job.maxAttempts,
      exhausted,
      error: message,
    })
    captureException(error, {
      receiptId: job.receiptId,
      receiptJobId: job.id,
      attempt: job.attempts,
      exhausted,
    })

    return { processed: false, status: exhausted ? 'failed' as const : 'retry_scheduled' as const }
  }
}

export async function processAvailableReceiptJobs(limit = 10) {
  const now = new Date()
  const jobs = await db
    .select({ id: receiptProcessingJobs.id })
    .from(receiptProcessingJobs)
    .where(and(eq(receiptProcessingJobs.status, 'pending'), lte(receiptProcessingJobs.availableAt, now)))
    .orderBy(asc(receiptProcessingJobs.availableAt))
    .limit(limit)

  const results = []
  for (const job of jobs) {
    results.push(await runReceiptProcessingJob(job.id))
  }
  return results
}
