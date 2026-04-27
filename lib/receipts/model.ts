import { z } from 'zod'

export const receiptStatusValues = ['pending', 'extracting', 'review', 'confirmed', 'error'] as const
export const receiptReviewStatusValues = ['review', 'confirmed'] as const
export const receiptDocumentTypeValues = ['uniform_invoice', 'receipt', 'other'] as const
export const receiptCategoryValues = ['dining', 'transport', 'office', 'materials', 'other'] as const
export const receiptValidationStatusValues = ['pass', 'warn', 'fail'] as const
export const receiptValidationStateValues = ['ready', 'needs_review', 'rejected'] as const
export const receiptValidationFieldNames = [
  'vendorName',
  'taxId',
  'invoiceNumber',
  'invoiceDate',
  'subtotal',
  'tax',
  'total',
  'category',
] as const
export const receiptProcessingJobStatusValues = ['pending', 'processing', 'completed', 'failed'] as const

export const receiptStatusSchema = z.enum(receiptStatusValues)
export const receiptReviewStatusSchema = z.enum(receiptReviewStatusValues)
export const receiptDocumentTypeSchema = z.enum(receiptDocumentTypeValues)
export const receiptCategorySchema = z.enum(receiptCategoryValues)
export const receiptValidationStatusSchema = z.enum(receiptValidationStatusValues)
export const receiptValidationStateSchema = z.enum(receiptValidationStateValues)
export const receiptValidationFieldSchema = z.enum(receiptValidationFieldNames)
export const receiptProcessingJobStatusSchema = z.enum(receiptProcessingJobStatusValues)

export const extractedReceiptLineItemSchema = z.object({
  description: z.string().trim(),
  quantity: z.number().optional(),
  unitPrice: z.number().optional(),
  amount: z.number().optional(),
})

export const extractedReceiptDataSchema = z.object({
  receiptType: receiptDocumentTypeSchema.default('other'),
  vendorName: z.string().trim().default(''),
  taxId: z.string().trim().default(''),
  invoiceNumber: z.string().trim().default(''),
  invoiceDate: z.string().trim().default(''),
  subtotal: z.number().default(0),
  tax: z.number().default(0),
  total: z.number().default(0),
  category: receiptCategorySchema.default('other'),
  lineItems: z.array(extractedReceiptLineItemSchema).default([]),
  notes: z.string().trim().optional(),
})

export const receiptConfidenceScoresSchema = z.object({
  vendorName: z.number().min(0).max(1).default(0),
  taxId: z.number().min(0).max(1).default(0),
  invoiceNumber: z.number().min(0).max(1).default(0),
  invoiceDate: z.number().min(0).max(1).default(0),
  subtotal: z.number().min(0).max(1).default(0),
  tax: z.number().min(0).max(1).default(0),
  total: z.number().min(0).max(1).default(0),
  category: z.number().min(0).max(1).default(0),
  lineItems: z.number().min(0).max(1).default(0),
})

export const validationResultSchema = z.object({
  status: receiptValidationStatusSchema,
  label: z.string(),
  details: z.string().optional(),
})

export const receiptValidationSummarySchema = z.object({
  passedChecks: z.number().int().nonnegative(),
  warningChecks: z.number().int().nonnegative(),
  failedChecks: z.number().int().nonnegative(),
  totalChecks: z.number().int().nonnegative(),
})

export const receiptValidationFieldsSchema = z.object({
  vendorName: z.array(validationResultSchema),
  taxId: z.array(validationResultSchema),
  invoiceNumber: z.array(validationResultSchema),
  invoiceDate: z.array(validationResultSchema),
  subtotal: z.array(validationResultSchema),
  tax: z.array(validationResultSchema),
  total: z.array(validationResultSchema),
  category: z.array(validationResultSchema),
})

export const receiptValidationReportSchema = z.object({
  fields: receiptValidationFieldsSchema,
  summary: receiptValidationSummarySchema,
  status: receiptValidationStateSchema,
})

export type ReceiptStatus = z.infer<typeof receiptStatusSchema>
export type ReceiptDocumentType = z.infer<typeof receiptDocumentTypeSchema>
export type ReceiptCategory = z.infer<typeof receiptCategorySchema>
export type ValidationStatus = z.infer<typeof receiptValidationStatusSchema>
export type ReceiptValidationState = z.infer<typeof receiptValidationStateSchema>
export type ReceiptValidationField = z.infer<typeof receiptValidationFieldSchema>
export type ReceiptProcessingJobStatus = z.infer<typeof receiptProcessingJobStatusSchema>
export type ValidationResult = z.infer<typeof validationResultSchema>
export type ReceiptValidationFields = z.infer<typeof receiptValidationFieldsSchema>
export type ReceiptValidationReport = z.infer<typeof receiptValidationReportSchema>
export type ExtractedReceiptLineItem = z.infer<typeof extractedReceiptLineItemSchema>
export type ExtractedReceiptData = z.infer<typeof extractedReceiptDataSchema>
export type ReceiptConfidenceScores = z.infer<typeof receiptConfidenceScoresSchema>

export function parseExtractedReceiptData(value: unknown): ExtractedReceiptData {
  return extractedReceiptDataSchema.parse(value ?? {})
}

export function parseReceiptConfidenceScores(value: unknown): ReceiptConfidenceScores {
  return receiptConfidenceScoresSchema.parse(value ?? {})
}

export function parseReceiptValidationReport(value: unknown): ReceiptValidationReport {
  return receiptValidationReportSchema.parse(value)
}

export function createEmptyReceiptValidationFields(): ReceiptValidationFields {
  return {
    vendorName: [],
    taxId: [],
    invoiceNumber: [],
    invoiceDate: [],
    subtotal: [],
    tax: [],
    total: [],
    category: [],
  }
}

export function getReceiptPeriodParts(invoiceDate: string) {
  const [yearString, monthString] = invoiceDate.split('-')
  const year = yearString ? Number(yearString) : NaN
  const month = monthString ? Number(monthString) : NaN

  return {
    periodYear: Number.isFinite(year) ? year : null,
    periodMonth: Number.isFinite(month) ? month : null,
  }
}
