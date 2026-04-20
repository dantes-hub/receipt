import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { receiptCorrections, receipts } from '@/lib/db/schema'
import { getReceiptDetail } from '@/lib/receipts/queries'
import { createClient } from '@/lib/supabase/server'
import { validateReceipt } from '@/lib/validation/receipt'
import type { ExtractedReceiptData } from '@/types/receipt'

const extractedReceiptDataSchema = z.object({
  receiptType: z.enum(['uniform_invoice', 'receipt', 'other']).default('other'),
  vendorName: z.string().trim(),
  taxId: z.string().trim(),
  invoiceNumber: z.string().trim(),
  invoiceDate: z.string().trim(),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  category: z.enum(['dining', 'transport', 'office', 'materials', 'other']),
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

const receiptUpdateSchema = z.object({
  extractedData: extractedReceiptDataSchema,
  status: z.enum(['review', 'confirmed']).default('confirmed'),
})

function getErrorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function parseExistingExtractedData(value: unknown): ExtractedReceiptData {
  return extractedReceiptDataSchema.parse(value ?? {})
}

function toCorrectionEntries(options: {
  receiptId: string
  userId: string
  oldData: ExtractedReceiptData
  newData: ExtractedReceiptData
}) {
  const fields: Array<keyof ExtractedReceiptData> = [
    'vendorName',
    'taxId',
    'invoiceNumber',
    'invoiceDate',
    'subtotal',
    'tax',
    'total',
    'category',
    'notes',
  ]

  return fields.flatMap((fieldName) => {
    const oldValue = options.oldData[fieldName]
    const newValue = options.newData[fieldName]

    if (String(oldValue ?? '') === String(newValue ?? '')) {
      return []
    }

    return [
      {
        receiptId: options.receiptId,
        userId: options.userId,
        fieldName,
        oldValue: oldValue == null ? null : String(oldValue),
        newValue: newValue == null ? null : String(newValue),
      },
    ]
  })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return getErrorResponse('請先登入。', 401)
  }

  const receipt = await getReceiptDetail(user.id, id)
  if (!receipt) {
    return getErrorResponse('找不到該發票。', 404)
  }

  return NextResponse.json({ receipt })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return getErrorResponse('請先登入再更新發票。', 401)
  }

  const body = await request.json()
  const payload = receiptUpdateSchema.safeParse(body)

  if (!payload.success) {
    return getErrorResponse('更新資料格式錯誤。', 400)
  }

  const [receiptRow] = await db
    .select({
      id: receipts.id,
      userId: receipts.userId,
      extractedData: receipts.extractedData,
      confidenceScores: receipts.confidenceScores,
    })
    .from(receipts)
    .where(and(eq(receipts.id, id), eq(receipts.userId, user.id)))
    .limit(1)

  if (!receiptRow) {
    return getErrorResponse('找不到該發票。', 404)
  }

  const oldData = parseExistingExtractedData(receiptRow.extractedData)
  const newData = payload.data.extractedData
  const validationReport = validateReceipt(newData)
  const correctionEntries = toCorrectionEntries({
    receiptId: id,
    userId: user.id,
    oldData,
    newData,
  })

  await db
    .update(receipts)
    .set({
      extractedData: newData,
      receiptType: newData.receiptType,
      validationResults: validationReport,
      notes: newData.notes ?? null,
      status: payload.data.status,
      updatedAt: new Date(),
    })
    .where(eq(receipts.id, id))

  if (correctionEntries.length > 0) {
    await db.insert(receiptCorrections).values(correctionEntries)
  }

  return NextResponse.json({
    receiptId: id,
    status: payload.data.status,
    validationResults: validationReport,
    correctionsLogged: correctionEntries.length,
  })
}
