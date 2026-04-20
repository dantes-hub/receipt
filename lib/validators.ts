/**
 * Taiwan Tax ID (統編) checksum validation
 * 統編 is 8 digits with specific checksum algorithm
 */
export function validateTaxId(taxId: string): { valid: boolean; error?: string } {
  // Remove any spaces or dashes
  const cleaned = taxId.replace(/[\s-]/g, '')
  
  // Must be exactly 8 digits
  if (!/^\d{8}$/.test(cleaned)) {
    return { valid: false, error: '統編必須為 8 位數字' }
  }
  
  // Taiwan Tax ID checksum algorithm
  const weights = [1, 2, 1, 2, 1, 2, 4, 1]
  const digits = cleaned.split('').map(Number)
  
  let sum = 0
  for (let i = 0; i < 8; i++) {
    const product = digits[i] * weights[i]
    sum += Math.floor(product / 10) + (product % 10)
  }
  
  // Special case for 7th digit being 7
  if (digits[6] === 7) {
    // Either sum % 10 === 0 or (sum + 1) % 10 === 0
    if (sum % 10 === 0 || (sum + 1) % 10 === 0) {
      return { valid: true }
    }
  } else {
    if (sum % 10 === 0) {
      return { valid: true }
    }
  }
  
  return { valid: false, error: 'Checksum 驗證失敗' }
}

/**
 * Taiwan Invoice Number (發票號碼) format validation
 * Format: 2 uppercase letters + 8 digits (e.g., AB12345678)
 */
export function validateInvoiceNumber(invoiceNumber: string): { valid: boolean; error?: string } {
  const cleaned = invoiceNumber.toUpperCase().replace(/[\s-]/g, '')

  if (!/^[A-Z]{2}\d{8}$/.test(cleaned)) {
    return { valid: false, error: '發票號碼格式錯誤，應為 2 字母 + 8 數字' }
  }

  return { valid: true }
}

export function getInvoicePeriod(invoiceDate: string): string | null {
  const match = invoiceDate.match(/^(\d{4})-(\d{2})-\d{2}$/)
  if (!match) return null

  const year = parseInt(match[1], 10)
  const month = parseInt(match[2], 10)
  if (year < 1912 || month < 1 || month > 12) return null

  const rocYear = year - 1911
  const periodStart = month % 2 === 1 ? month : month - 1
  const periodEnd = periodStart + 1

  return `${rocYear}年 ${String(periodStart).padStart(2, '0')}-${String(periodEnd).padStart(2, '0')} 月`
}

/**
 * Convert Taiwan ROC date (民國) to Western date
 * ROC year = Western year - 1911
 */
export function rocToWestern(rocDate: string): { western: string; roc: string } | null {
  // Try to parse various ROC date formats
  // 114/04/19, 114-04-19, 114.04.19
  const match = rocDate.match(/^(\d{2,3})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/)
  
  if (!match) {
    return null
  }
  
  const [, rocYear, month, day] = match
  const westernYear = parseInt(rocYear, 10) + 1911
  const paddedMonth = month.padStart(2, '0')
  const paddedDay = day.padStart(2, '0')
  
  return {
    western: `${westernYear}/${paddedMonth}/${paddedDay}`,
    roc: `${rocYear}/${paddedMonth}/${paddedDay}`,
  }
}

/**
 * Convert Western date to ROC date
 */
export function westernToRoc(westernDate: string): string {
  const match = westernDate.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/)
  
  if (!match) {
    return westernDate
  }
  
  const [, year, month, day] = match
  const rocYear = parseInt(year, 10) - 1911
  
  return `${rocYear}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`
}

/**
 * Validate tax calculation (5% business tax in Taiwan)
 */
export function validateTaxCalculation(subtotal: number, tax: number, total: number): {
  valid: boolean
  expectedTax: number
  expectedTotal: number
  taxRate: number
} {
  const expectedTax = Math.round(subtotal * 0.05)
  const expectedTotal = subtotal + expectedTax
  const actualTaxRate = subtotal > 0 ? (tax / subtotal) * 100 : 0
  
  return {
    valid: tax === expectedTax && total === expectedTotal,
    expectedTax,
    expectedTotal,
    taxRate: Math.round(actualTaxRate * 10) / 10,
  }
}

/**
 * Format currency for display (Taiwan dollars)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-TW').format(num)
}

/**
 * Parse number from formatted string (handles full-width digits)
 */
export function parseFormattedNumber(str: string): number {
  // Convert full-width digits to half-width
  const halfWidth = str.replace(/[０-９]/g, (c) => 
    String.fromCharCode(c.charCodeAt(0) - 0xFEE0)
  )
  
  // Remove non-digit characters except decimal point
  const cleaned = halfWidth.replace(/[^\d.]/g, '')
  
  return parseFloat(cleaned) || 0
}

/**
 * Get confidence level from score
 */
export function getConfidenceLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 0.9) return 'high'
  if (score >= 0.7) return 'medium'
  return 'low'
}
