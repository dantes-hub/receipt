import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import type { ExtractedReceiptData, ReceiptCategory, ReceiptDocumentType } from '@/types/receipt'
import { rocToWestern } from '@/lib/validators'

const DEFAULT_RECEIPT_MODEL = process.env.OPENAI_RECEIPT_MODEL ?? 'gpt-4o-2024-08-06'

const receiptCategorySchema = z.enum(['dining', 'transport', 'office', 'materials', 'other'])
const receiptDocumentTypeSchema = z.enum(['uniform_invoice', 'receipt', 'other'])

const extractedReceiptLineItemSchema = z.object({
  description: z.string(),
  quantity: z.number().nullable().optional(),
  unitPrice: z.number().nullable().optional(),
  amount: z.number().nullable().optional(),
})

const confidenceScoresSchema = z.object({
  vendorName: z.number().min(0).max(1),
  taxId: z.number().min(0).max(1),
  invoiceNumber: z.number().min(0).max(1),
  invoiceDate: z.number().min(0).max(1),
  subtotal: z.number().min(0).max(1),
  tax: z.number().min(0).max(1),
  total: z.number().min(0).max(1),
  category: z.number().min(0).max(1),
  lineItems: z.number().min(0).max(1),
})

export const receiptExtractionSchema = z.object({
  receiptType: receiptDocumentTypeSchema,
  vendorName: z.string(),
  taxId: z.string(),
  invoiceNumber: z.string(),
  invoiceDate: z.string(),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  category: receiptCategorySchema,
  lineItems: z.array(extractedReceiptLineItemSchema),
  notes: z.string().optional().default(''),
  confidenceScores: confidenceScoresSchema,
})

export type ReceiptExtraction = z.infer<typeof receiptExtractionSchema>
export type ReceiptConfidenceScores = ReceiptExtraction['confidenceScores']

export interface ExtractReceiptInput {
  fileBuffer: Buffer
  mimeType: string
  fileName?: string
}

export interface ExtractReceiptResult {
  model: string
  extractedData: ExtractedReceiptData
  confidenceScores: ReceiptConfidenceScores
  raw: ReceiptExtraction
}

function buildDataUrl(fileBuffer: Buffer, mimeType: string) {
  return `data:${mimeType};base64,${fileBuffer.toString('base64')}`
}

function normalizeInvoiceDate(invoiceDate: string) {
  const trimmed = invoiceDate.trim()
  const rocDate = rocToWestern(trimmed)

  if (rocDate) {
    return rocDate.western.replaceAll('/', '-')
  }

  const normalized = trimmed.replace(/[./]/g, '-')
  const isoMatch = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)

  if (!isoMatch) {
    return trimmed
  }

  const [, year, month, day] = isoMatch
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

function normalizeCategory(category: ReceiptCategory) {
  return category
}

function normalizeReceiptType(receiptType: ReceiptDocumentType) {
  return receiptType
}

function normalizeLineItems(lineItems: ReceiptExtraction['lineItems']) {
  return lineItems.map((item) => ({
    description: item.description.trim(),
    quantity: item.quantity ?? undefined,
    unitPrice: item.unitPrice ?? undefined,
    amount: item.amount ?? undefined,
  }))
}

export function normalizeExtractionResult(result: ReceiptExtraction): ExtractedReceiptData {
  const normalizedReceiptType = normalizeReceiptType(result.receiptType)

  return {
    receiptType: normalizedReceiptType,
    vendorName: result.vendorName.trim(),
    taxId: result.taxId.trim(),
    invoiceNumber:
      normalizedReceiptType === 'uniform_invoice'
        ? result.invoiceNumber.trim().toUpperCase()
        : '',
    invoiceDate: normalizeInvoiceDate(result.invoiceDate),
    subtotal: result.subtotal,
    tax: result.tax,
    total: result.total,
    category: normalizeCategory(result.category),
    lineItems: normalizeLineItems(result.lineItems),
    notes: result.notes?.trim() || undefined,
  }
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.')
  }

  return new OpenAI({ apiKey })
}

function assertSupportedMimeType(mimeType: string) {
  if (mimeType === 'application/pdf') {
    throw new Error('PDF extraction is not implemented yet.')
  }

  if (!mimeType.startsWith('image/')) {
    throw new Error(`Unsupported receipt file type: ${mimeType}`)
  }
}

export async function extractReceiptFromFile(input: ExtractReceiptInput): Promise<ExtractReceiptResult> {
  assertSupportedMimeType(input.mimeType)

  const client = getOpenAIClient()
  const completion = await client.beta.chat.completions.parse({
    model: DEFAULT_RECEIPT_MODEL,
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text:
              'You extract structured data from Taiwan receipts and invoices. First classify the document as uniform_invoice, receipt, or other. A payment slip, transaction detail, EasyCard receipt, or store transaction record is receipt, not uniform_invoice. Only populate invoiceNumber and taxId when they are actually present as invoice/business-tax fields. Do not put transaction serial numbers into invoiceNumber. Return only the schema fields. Normalize ROC dates such as 114/04/19 to 2025-04-19. Keep unknown strings empty and unknown numbers as 0. Use Traditional Chinese understanding for vendor names and handwritten fields.',
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text:
              'Extract the document into the provided JSON schema. Required targets: receipt type, vendor name, Taiwan tax ID if present, invoice number if present, invoice date, subtotal, tax, total, category, line items, and per-field confidence scores.',
          },
          {
            type: 'image_url',
            image_url: {
              url: buildDataUrl(input.fileBuffer, input.mimeType),
            },
          },
        ],
      },
    ],
    response_format: zodResponseFormat(receiptExtractionSchema, 'taiwan_receipt_extraction'),
  })

  const parsed = completion.choices[0]?.message.parsed

  if (!parsed) {
    throw new Error('OpenAI did not return a parsed receipt payload.')
  }

  return {
    model: DEFAULT_RECEIPT_MODEL,
    extractedData: normalizeExtractionResult(parsed),
    confidenceScores: parsed.confidenceScores,
    raw: parsed,
  }
}
