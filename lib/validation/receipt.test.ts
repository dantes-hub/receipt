import { describe, expect, it } from 'vitest'
import { validateReceipt } from './receipt'
import type { ExtractedReceiptData } from '@/types/receipt'

function buildReceipt(overrides: Partial<ExtractedReceiptData> = {}): ExtractedReceiptData {
  return {
    receiptType: 'uniform_invoice',
    vendorName: '家樂福 中科店',
    taxId: '24536806',
    invoiceNumber: 'AB12345678',
    invoiceDate: '2025-04-19',
    subtotal: 1200,
    tax: 60,
    total: 1260,
    category: 'dining',
    lineItems: [],
    ...overrides,
  }
}

describe('validateReceipt', () => {
  it('marks a valid uniform invoice as ready', () => {
    const report = validateReceipt(buildReceipt())

    expect(report.status).toBe('ready')
    expect(report.summary.failedChecks).toBe(0)
    expect(report.fields.taxId.some((item) => item.status === 'pass')).toBe(true)
    expect(report.fields.invoiceNumber.some((item) => item.label.includes('期別'))).toBe(true)
  })

  it('flags invalid values for review or rejection', () => {
    const report = validateReceipt(buildReceipt({
      vendorName: '',
      taxId: '12345678',
      invoiceNumber: 'bad',
      invoiceDate: '2028-01-01',
      tax: 12,
      total: 999,
    }))

    expect(report.status).toBe('rejected')
    expect(report.summary.failedChecks).toBeGreaterThan(0)
    expect(report.fields.vendorName[0]?.status).toBe('fail')
    expect(report.fields.invoiceDate.some((item) => item.status === 'warn')).toBe(true)
  })

  it('uses receipt-specific amount logic for non-invoice documents', () => {
    const report = validateReceipt(buildReceipt({
      receiptType: 'receipt',
      taxId: '',
      invoiceNumber: '',
      subtotal: 0,
      tax: 0,
      total: 320,
    }))

    expect(report.status).toBe('needs_review')
    expect(report.fields.taxId[0]?.label).toContain('非統一發票')
    expect(report.fields.total.some((item) => item.status === 'pass')).toBe(true)
  })
})
