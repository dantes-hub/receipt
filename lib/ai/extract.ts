import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import type { ExtractedReceiptData, ReceiptCategory, ReceiptDocumentType } from '@/types/receipt'
import { rocToWestern } from '@/lib/validators'

const DEFAULT_RECEIPT_MODEL = process.env.OPENAI_RECEIPT_MODEL ?? 'gpt-4o-2024-11-20'
const CONFIDENCE_RETRY_THRESHOLD = 0.45

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
  retried: boolean
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

function normalizeLineItems(lineItems: ReceiptExtraction['lineItems']) {
  return lineItems.map((item) => ({
    description: item.description.trim(),
    quantity: item.quantity ?? undefined,
    unitPrice: item.unitPrice ?? undefined,
    amount: item.amount ?? undefined,
  }))
}

export function normalizeExtractionResult(result: ReceiptExtraction): ExtractedReceiptData {
  const isUniformInvoice = result.receiptType === 'uniform_invoice'

  return {
    receiptType: result.receiptType,
    vendorName: result.vendorName.trim(),
    taxId: isUniformInvoice ? result.taxId.trim() : '',
    invoiceNumber: isUniformInvoice ? result.invoiceNumber.trim().toUpperCase() : '',
    invoiceDate: normalizeInvoiceDate(result.invoiceDate),
    subtotal: result.subtotal,
    tax: result.tax,
    total: result.total,
    category: result.category as ReceiptCategory,
    lineItems: normalizeLineItems(result.lineItems),
    notes: result.notes?.trim() || undefined,
  }
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured.')
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

const SYSTEM_PROMPT = `You extract structured data from Taiwan receipts and invoices. Be precise and conservative — only output what you can clearly read.

DOCUMENT CLASSIFICATION:
- uniform_invoice: Has 發票號碼 (2 uppercase letters + 8 digits e.g. AB12345678) AND seller 統編 (8-digit tax ID). Formal B2B/B2C invoice issued under Taiwan tax law.
- receipt: Store receipt, payment slip, EasyCard top-up, convenience store printout, taxi receipt, parking ticket, bank transaction slip. Has a total but no formal invoice number.
- other: Cannot clearly be classified as either above.

FIELD RULES:
taxId
  — ONLY for uniform_invoice. Exactly 8 digits. Example: "28769401"
  — Do NOT invent or guess. If not clearly visible return "".

invoiceNumber
  — ONLY for uniform_invoice. Exactly 2 uppercase letters + 8 digits. Example: "AB12345678"
  — Do NOT use transaction serial numbers, order IDs, or barcode numbers.
  — If not clearly visible return "".

invoiceDate
  — Return as YYYY-MM-DD.
  — Taiwan ROC year: add 1911. Examples: 114/04/19 → 2025-04-19, 113/12/01 → 2024-12-01
  — Western year: use as-is. Example: 2025/04/19 → 2025-04-19
  — If date is ambiguous return "".

vendorName
  — Full name as printed. Include branch if shown: "7-ELEVEN 中山店", "全家 信義店"
  — For handwritten receipts use the store stamp name if available.

subtotal (未稅金額)
  — Amount before 5% tax. Only populate when tax is broken out separately.
  — For receipts without tax breakdown return 0.

tax (稅額)
  — Usually 5% of subtotal in Taiwan. Only populate when printed separately.
  — Return 0 if not shown.

total (總金額/合計/應付金額)
  — Final amount the customer paid. Required. Look for the largest bottom-line amount.
  — Return 0 only if completely unreadable.

category
  — dining: restaurants, cafes, convenience stores, food delivery, supermarkets
  — transport: taxi, MRT, bus, EasyCard, parking, fuel, highway toll
  — office: stationery, software, printing, office supplies
  — materials: raw materials, inventory, manufacturing supplies
  — other: everything else

LANGUAGE:
  — All string fields (vendorName, notes) must be in Traditional Chinese (繁體中文) or the original printed text.
  — Never write notes or descriptions in English.

CONFIDENCE SCORES:
  — Score each field 0.0–1.0. Be honest — do not inflate scores.
  — 0.95+: every character clearly legible
  — 0.80–0.94: mostly clear, minor uncertainty
  — 0.50–0.79: partially readable or inferred
  — Below 0.50: guessed or not found (field should be empty/0)`

const USER_PROMPT = `Extract this Taiwan receipt or invoice into the JSON schema.

Pay special attention to:
1. Document type classification (uniform_invoice vs receipt)
2. The total amount — find the final "合計" or "總計" line
3. ROC date conversion if applicable
4. Taiwan tax ID (統編) — only if this is a uniform_invoice

Return honest confidence scores. If a field is absent or unreadable, return "" or 0 and score 0.0.`

function buildRetryHint(lowFields: string[]): string {
  const fieldNames: Record<string, string> = {
    vendorName: '廠商名稱 (vendor name)',
    taxId: '統編 (8-digit tax ID)',
    invoiceNumber: '發票號碼 (2 letters + 8 digits)',
    invoiceDate: '發票日期 (date)',
    total: '總金額 (total amount)',
    subtotal: '未稅金額 (subtotal before tax)',
    tax: '稅額 (tax amount)',
  }

  const named = lowFields.map((f) => fieldNames[f] ?? f).join(', ')
  return `The previous extraction had low confidence on: ${named}. Please look more carefully at these specific fields. If truly unreadable, return "" or 0 — do not guess.`
}

function getLowConfidenceFields(scores: ReceiptConfidenceScores, receiptType: string): string[] {
  const criticalFields: (keyof ReceiptConfidenceScores)[] = ['vendorName', 'total', 'invoiceDate']
  if (receiptType === 'uniform_invoice') {
    criticalFields.push('taxId', 'invoiceNumber')
  }
  return criticalFields.filter((f) => scores[f] < CONFIDENCE_RETRY_THRESHOLD)
}

async function callExtraction(
  client: OpenAI,
  dataUrl: string,
  retryHint?: string
): Promise<ReceiptExtraction> {
  const userContent: OpenAI.Chat.ChatCompletionContentPart[] = [
    { type: 'text', text: retryHint ? `${USER_PROMPT}\n\n${retryHint}` : USER_PROMPT },
    { type: 'image_url', image_url: { url: dataUrl, detail: 'high' } },
  ]

  const completion = await client.beta.chat.completions.parse({
    model: DEFAULT_RECEIPT_MODEL,
    temperature: retryHint ? 0.1 : 0,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    response_format: zodResponseFormat(receiptExtractionSchema, 'taiwan_receipt_extraction'),
  })

  const parsed = completion.choices[0]?.message.parsed
  if (!parsed) throw new Error('OpenAI did not return a parsed receipt payload.')
  return parsed
}

export async function extractReceiptFromFile(input: ExtractReceiptInput): Promise<ExtractReceiptResult> {
  assertSupportedMimeType(input.mimeType)

  const client = getOpenAIClient()
  const dataUrl = buildDataUrl(input.fileBuffer, input.mimeType)

  const first = await callExtraction(client, dataUrl)
  const lowFields = getLowConfidenceFields(first.confidenceScores, first.receiptType)

  let final = first
  let retried = false

  if (lowFields.length > 0) {
    retried = true
    const retryHint = buildRetryHint(lowFields)
    const second = await callExtraction(client, dataUrl, retryHint)

    // Keep the extraction with higher total confidence on the low fields
    const firstScore = lowFields.reduce((s, f) => s + first.confidenceScores[f as keyof ReceiptConfidenceScores], 0)
    const secondScore = lowFields.reduce((s, f) => s + second.confidenceScores[f as keyof ReceiptConfidenceScores], 0)
    final = secondScore >= firstScore ? second : first
  }

  return {
    model: DEFAULT_RECEIPT_MODEL,
    extractedData: normalizeExtractionResult(final),
    confidenceScores: final.confidenceScores,
    raw: final,
    retried,
  }
}
