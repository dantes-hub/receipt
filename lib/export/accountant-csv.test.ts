import { describe, expect, it } from 'vitest'
import { buildAccountantCsv } from './accountant-csv'
import type { ReceiptExportItem } from '@/lib/receipts/queries'

const receipt: ReceiptExportItem = {
  id: 'r_1',
  status: 'confirmed',
  uploadedAt: '2025-04-19T10:30:00.000Z',
  vendorName: '家樂福, 中科店',
  taxId: '24536806',
  invoiceNumber: 'AB12345678',
  invoiceDate: '2025-04-19',
  total: 1260,
  category: 'dining',
  receiptType: 'uniform_invoice',
  imagePath: 'receipts/u1/2025/04/r_1.jpg',
  subtotal: 1200,
  tax: 60,
  notes: '會計備註',
}

describe('buildAccountantCsv', () => {
  it('includes BOM and properly escapes CSV values', () => {
    const csv = buildAccountantCsv([receipt])

    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(csv).toContain('發票號碼')
    expect(csv).toContain('"家樂福, 中科店"')
    expect(csv).toContain('AB12345678')
    expect(csv).toContain('會計備註')
  })
})
