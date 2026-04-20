import { notFound, redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { RECEIPTS_BUCKET } from '@/lib/supabase/storage'
import { getReceiptDetail, getReceiptList } from '@/lib/receipts/queries'
import { ReceiptReviewClient, type ReceiptReviewFieldViewModel, type ReceiptReviewViewModel } from './receipt-review-client'
import type { ReceiptValidationReport, ValidationResult } from '@/types/receipt'

const validationResultSchema = z.object({
  status: z.enum(['pass', 'warn', 'fail']),
  label: z.string(),
  details: z.string().optional(),
})

const validationReportSchema = z.object({
  fields: z.object({
    vendorName: z.array(validationResultSchema).default([]),
    taxId: z.array(validationResultSchema).default([]),
    invoiceNumber: z.array(validationResultSchema).default([]),
    invoiceDate: z.array(validationResultSchema).default([]),
    subtotal: z.array(validationResultSchema).default([]),
    tax: z.array(validationResultSchema).default([]),
    total: z.array(validationResultSchema).default([]),
    category: z.array(validationResultSchema).default([]),
  }),
  summary: z.object({
    passedChecks: z.number().default(0),
    warningChecks: z.number().default(0),
    failedChecks: z.number().default(0),
    totalChecks: z.number().default(0),
  }),
  status: z.enum(['ready', 'needs_review', 'rejected']).default('needs_review'),
})

function parseValidationReport(value: unknown): ReceiptValidationReport {
  return validationReportSchema.parse(value ?? { fields: {}, summary: {}, status: 'needs_review' })
}

function toFieldViewModel(value: string | number, confidence: number, validations: ValidationResult[]): ReceiptReviewFieldViewModel {
  return {
    value: typeof value === 'number' ? String(value) : value,
    confidence,
    validations,
  }
}

function getValidationResults(report: ReceiptValidationReport, field: keyof ReceiptValidationReport['fields']) {
  return report.fields[field] ?? []
}

function getFileName(path: string) {
  const parts = path.split('/')
  return parts.at(-1) ?? path
}

function isPdfPath(path: string) {
  return path.toLowerCase().endsWith('.pdf')
}

export default async function ReceiptReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [receiptDetail, receiptList] = await Promise.all([
    getReceiptDetail(user.id, id),
    getReceiptList(user.id),
  ])

  if (!receiptDetail) {
    notFound()
  }

  const validationReport = parseValidationReport(receiptDetail.validationResults)
  const { data: signedUrlData } = await supabaseAdmin.storage
    .from(RECEIPTS_BUCKET)
    .createSignedUrl(receiptDetail.imagePath, 60 * 60)

  const currentIndex = receiptList.findIndex((receipt) => receipt.id === receiptDetail.id)
  const prevReceiptId = currentIndex > 0 ? receiptList[currentIndex - 1]?.id ?? null : null
  const nextReceiptId = currentIndex >= 0 && currentIndex < receiptList.length - 1
    ? receiptList[currentIndex + 1]?.id ?? null
    : null

  const receipt: ReceiptReviewViewModel = {
    id: receiptDetail.id,
    status: receiptDetail.status,
    receiptType: receiptDetail.receiptType,
    uploadedAt: receiptDetail.uploadedAt,
    imageUrl: signedUrlData?.signedUrl ?? null,
    imagePath: receiptDetail.imagePath,
    fileName: getFileName(receiptDetail.imagePath),
    isPdf: isPdfPath(receiptDetail.imagePath),
    vendorName: toFieldViewModel(receiptDetail.vendorName, receiptDetail.confidenceScores.vendorName, getValidationResults(validationReport, 'vendorName')),
    taxId: toFieldViewModel(receiptDetail.taxId, receiptDetail.confidenceScores.taxId, getValidationResults(validationReport, 'taxId')),
    invoiceNumber: toFieldViewModel(receiptDetail.invoiceNumber, receiptDetail.confidenceScores.invoiceNumber, getValidationResults(validationReport, 'invoiceNumber')),
    invoiceDate: toFieldViewModel(receiptDetail.invoiceDate, receiptDetail.confidenceScores.invoiceDate, getValidationResults(validationReport, 'invoiceDate')),
    subtotal: toFieldViewModel(receiptDetail.subtotal, receiptDetail.confidenceScores.subtotal, getValidationResults(validationReport, 'subtotal')),
    tax: toFieldViewModel(receiptDetail.tax, receiptDetail.confidenceScores.tax, getValidationResults(validationReport, 'tax')),
    total: toFieldViewModel(receiptDetail.total, receiptDetail.confidenceScores.total, getValidationResults(validationReport, 'total')),
    category: receiptDetail.category,
    notes: receiptDetail.notes,
  }

  return (
    <ReceiptReviewClient
      receipt={receipt}
      prevReceiptId={prevReceiptId}
      nextReceiptId={nextReceiptId}
    />
  )
}
