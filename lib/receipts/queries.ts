import { and, desc, eq, gte, lte, lt } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { receipts } from '@/lib/db/schema'
import type { ExtractedReceiptData, ReceiptCategory, ReceiptDocumentType, ReceiptStats, ReceiptStatus } from '@/types/receipt'

const extractedReceiptDataSchema = z.object({
  receiptType: z.enum(['uniform_invoice', 'receipt', 'other']).default('other'),
  vendorName: z.string().default(''),
  taxId: z.string().default(''),
  invoiceNumber: z.string().default(''),
  invoiceDate: z.string().default(''),
  subtotal: z.number().default(0),
  tax: z.number().default(0),
  total: z.number().default(0),
  category: z.enum(['dining', 'transport', 'office', 'materials', 'other']).default('other'),
  lineItems: z.array(
    z.object({
      description: z.string(),
      quantity: z.number().optional(),
      unitPrice: z.number().optional(),
      amount: z.number().optional(),
    })
  ).default([]),
  notes: z.string().optional(),
})

export interface ReceiptListItem {
  id: string
  status: ReceiptStatus
  uploadedAt: string
  vendorName: string
  taxId: string
  invoiceNumber: string
  invoiceDate: string
  total: number
  category: ReceiptCategory
  receiptType: ReceiptDocumentType
  imagePath: string
}

export interface ReceiptExportItem extends ReceiptListItem {
  subtotal: number
  tax: number
  notes: string
}

export interface ReceiptDetailItem extends ReceiptExportItem {
  confidenceScores: {
    vendorName: number
    taxId: number
    invoiceNumber: number
    invoiceDate: number
    subtotal: number
    tax: number
    total: number
    category: number
    lineItems: number
  }
  validationResults: unknown
}

const confidenceScoresSchema = z.object({
  vendorName: z.number().default(0),
  taxId: z.number().default(0),
  invoiceNumber: z.number().default(0),
  invoiceDate: z.number().default(0),
  subtotal: z.number().default(0),
  tax: z.number().default(0),
  total: z.number().default(0),
  category: z.number().default(0),
  lineItems: z.number().default(0),
})

function parseExtractedData(value: unknown): ExtractedReceiptData {
  return extractedReceiptDataSchema.parse(value ?? {})
}

function parseConfidenceScores(value: unknown): ReceiptDetailItem['confidenceScores'] {
  return confidenceScoresSchema.parse(value ?? {})
}

function getMonthRange(month: string) {
  const match = month.match(/^(\d{4})\/(\d{2})$/)
  if (!match) {
    return null
  }

  const [, year, monthValue] = match
  const start = new Date(Date.UTC(Number(year), Number(monthValue) - 1, 1))
  const end = new Date(Date.UTC(Number(year), Number(monthValue), 1))

  return { start, end }
}

function toReceiptListItem(row: {
  id: string
  status: ReceiptStatus
  createdAt: Date
  imagePath: string
  extractedData: unknown
}): ReceiptListItem {
  const extractedData = parseExtractedData(row.extractedData)

  return {
    id: row.id,
    status: row.status,
    uploadedAt: row.createdAt.toISOString(),
    vendorName: extractedData.vendorName,
    taxId: extractedData.taxId,
    invoiceNumber: extractedData.invoiceNumber,
    invoiceDate: extractedData.invoiceDate,
    total: extractedData.total,
    category: extractedData.category,
    receiptType: extractedData.receiptType,
    imagePath: row.imagePath,
  }
}

export async function getRecentReceipts(userId: string, limit = 5): Promise<ReceiptListItem[]> {
  const rows = await db
    .select({
      id: receipts.id,
      status: receipts.status,
      createdAt: receipts.createdAt,
      imagePath: receipts.imagePath,
      extractedData: receipts.extractedData,
    })
    .from(receipts)
    .where(eq(receipts.userId, userId))
    .orderBy(desc(receipts.createdAt))
    .limit(limit)

  return rows.map(toReceiptListItem)
}

export async function getReceiptList(userId: string, month?: string): Promise<ReceiptListItem[]> {
  const monthRange = month ? getMonthRange(month) : null
  const whereClause = monthRange
    ? and(
        eq(receipts.userId, userId),
        gte(receipts.createdAt, monthRange.start),
        lt(receipts.createdAt, monthRange.end)
      )
    : eq(receipts.userId, userId)

  const rows = await db
    .select({
      id: receipts.id,
      status: receipts.status,
      createdAt: receipts.createdAt,
      imagePath: receipts.imagePath,
      extractedData: receipts.extractedData,
    })
    .from(receipts)
    .where(whereClause)
    .orderBy(desc(receipts.createdAt))

  return rows.map(toReceiptListItem)
}

export async function getReceiptStats(userId: string, month: string): Promise<ReceiptStats> {
  const monthRange = getMonthRange(month)

  if (!monthRange) {
    return {
      totalThisMonth: 0,
      pendingReview: 0,
      confirmed: 0,
      totalAmount: 0,
    }
  }

  const rows = await db
    .select({
      id: receipts.id,
      status: receipts.status,
      extractedData: receipts.extractedData,
    })
    .from(receipts)
    .where(
      and(
        eq(receipts.userId, userId),
        gte(receipts.createdAt, monthRange.start),
        lt(receipts.createdAt, monthRange.end)
      )
    )

  return rows.reduce<ReceiptStats>(
    (acc, row) => {
      const extractedData = parseExtractedData(row.extractedData)
      acc.totalThisMonth += 1
      if (row.status === 'review') {
        acc.pendingReview += 1
      }
      if (row.status === 'confirmed') {
        acc.confirmed += 1
      }
      acc.totalAmount += extractedData.total
      return acc
    },
    {
      totalThisMonth: 0,
      pendingReview: 0,
      confirmed: 0,
      totalAmount: 0,
    }
  )
}

export async function getReceiptsForExport(options: {
  userId: string
  dateFrom: string
  dateTo: string
  confirmedOnly: boolean
}): Promise<ReceiptExportItem[]> {
  const start = new Date(`${options.dateFrom}T00:00:00+08:00`)
  const end = new Date(`${options.dateTo}T23:59:59.999+08:00`)

  const filters = [
    eq(receipts.userId, options.userId),
    gte(receipts.createdAt, start),
    lte(receipts.createdAt, end),
  ]

  if (options.confirmedOnly) {
    filters.push(eq(receipts.status, 'confirmed'))
  }

  const rows = await db
    .select({
      id: receipts.id,
      status: receipts.status,
      createdAt: receipts.createdAt,
      imagePath: receipts.imagePath,
      extractedData: receipts.extractedData,
    })
    .from(receipts)
    .where(and(...filters))
    .orderBy(desc(receipts.createdAt))

  return rows.map((row) => {
    const extractedData = parseExtractedData(row.extractedData)

    return {
      id: row.id,
      status: row.status,
      uploadedAt: row.createdAt.toISOString(),
      vendorName: extractedData.vendorName,
      taxId: extractedData.taxId,
      invoiceNumber: extractedData.invoiceNumber,
      invoiceDate: extractedData.invoiceDate,
      total: extractedData.total,
      category: extractedData.category,
      receiptType: extractedData.receiptType,
      imagePath: row.imagePath,
      subtotal: extractedData.subtotal,
      tax: extractedData.tax,
      notes: extractedData.notes ?? '',
    }
  })
}

export async function getReceiptDetail(userId: string, receiptId: string): Promise<ReceiptDetailItem | null> {
  const [row] = await db
    .select({
      id: receipts.id,
      status: receipts.status,
      createdAt: receipts.createdAt,
      imagePath: receipts.imagePath,
      extractedData: receipts.extractedData,
      confidenceScores: receipts.confidenceScores,
      validationResults: receipts.validationResults,
    })
    .from(receipts)
    .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId)))
    .limit(1)

  if (!row) {
    return null
  }

  const extractedData = parseExtractedData(row.extractedData)

  return {
    id: row.id,
    status: row.status,
    uploadedAt: row.createdAt.toISOString(),
    vendorName: extractedData.vendorName,
    taxId: extractedData.taxId,
    invoiceNumber: extractedData.invoiceNumber,
    invoiceDate: extractedData.invoiceDate,
    total: extractedData.total,
    category: extractedData.category,
    receiptType: extractedData.receiptType,
    imagePath: row.imagePath,
    subtotal: extractedData.subtotal,
    tax: extractedData.tax,
    notes: extractedData.notes ?? '',
    confidenceScores: parseConfidenceScores(row.confidenceScores),
    validationResults: row.validationResults,
  }
}
