import { describe, expect, it } from 'vitest'
import {
  getConfidenceLevel,
  getInvoicePeriod,
  parseFormattedNumber,
  rocToWestern,
  validateInvoiceNumber,
  validateTaxCalculation,
  validateTaxId,
  westernToRoc,
} from './validators'

describe('validators', () => {
  it('validates Taiwan tax IDs', () => {
    expect(validateTaxId('24536806')).toEqual({ valid: true })
    expect(validateTaxId('12345678')).toEqual({ valid: false, error: 'Checksum 驗證失敗' })
    expect(validateTaxId('1234')).toEqual({ valid: false, error: '統編必須為 8 位數字' })
  })

  it('validates invoice number format', () => {
    expect(validateInvoiceNumber('ab12345678')).toEqual({ valid: true })
    expect(validateInvoiceNumber('ABC1234567')).toEqual({
      valid: false,
      error: '發票號碼格式錯誤，應為 2 字母 + 8 數字',
    })
  })

  it('converts ROC dates and invoice periods', () => {
    expect(rocToWestern('114/04/19')).toEqual({
      western: '2025/04/19',
      roc: '114/04/19',
    })
    expect(westernToRoc('2025-04-19')).toBe('114/04/19')
    expect(getInvoicePeriod('2025-04-19')).toBe('114年 03-04 月')
  })

  it('checks Taiwan tax calculations', () => {
    expect(validateTaxCalculation(1200, 60, 1260)).toEqual({
      valid: true,
      expectedTax: 60,
      expectedTotal: 1260,
      taxRate: 5,
    })
  })

  it('parses formatted numbers and confidence levels', () => {
    expect(parseFormattedNumber('NT$ １,２６０')).toBe(1260)
    expect(getConfidenceLevel(0.95)).toBe('high')
    expect(getConfidenceLevel(0.75)).toBe('medium')
    expect(getConfidenceLevel(0.4)).toBe('low')
  })
})
