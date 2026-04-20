import type { ExtractedReceiptData, ReceiptValidationField, ReceiptValidationReport, ValidationResult } from '@/types/receipt'
import { validateInvoiceNumber, validateTaxCalculation, validateTaxId } from '@/lib/validators'
import { lookupCompanyByUbn } from '@/lib/moea/lookup'

type FieldValidationMap = Record<ReceiptValidationField, ValidationResult[]>

function createEmptyFieldValidationMap(): FieldValidationMap {
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

function addValidationResult(
  fields: FieldValidationMap,
  field: ReceiptValidationField,
  status: ValidationResult['status'],
  label: string,
  details?: string
) {
  fields[field].push({ status, label, details })
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function validateInvoiceDate(invoiceDate: string, fields: FieldValidationMap) {
  if (!invoiceDate) {
    addValidationResult(fields, 'invoiceDate', 'fail', '缺少發票日期')
    return
  }

  if (!isIsoDate(invoiceDate)) {
    addValidationResult(fields, 'invoiceDate', 'fail', '日期格式錯誤，應為 YYYY-MM-DD')
    return
  }

  const parsed = new Date(`${invoiceDate}T00:00:00+08:00`)

  if (Number.isNaN(parsed.getTime())) {
    addValidationResult(fields, 'invoiceDate', 'fail', '日期無法解析')
    return
  }

  const now = new Date()
  const sevenYearsAgo = new Date(now)
  sevenYearsAgo.setFullYear(now.getFullYear() - 7)

  if (parsed > now) {
    addValidationResult(fields, 'invoiceDate', 'warn', '日期落在未來，請人工確認')
    return
  }

  if (parsed < sevenYearsAgo) {
    addValidationResult(fields, 'invoiceDate', 'warn', '日期超過 7 年，請人工確認')
    return
  }

  addValidationResult(fields, 'invoiceDate', 'pass', '日期格式合理')
}

function validateVendorName(vendorName: string, fields: FieldValidationMap) {
  if (!vendorName.trim()) {
    addValidationResult(fields, 'vendorName', 'fail', '缺少廠商名稱')
    return
  }

  if (vendorName.trim().length < 2) {
    addValidationResult(fields, 'vendorName', 'warn', '廠商名稱過短，請人工確認')
    return
  }

  addValidationResult(fields, 'vendorName', 'pass', '廠商名稱已擷取')
}

function validateCategory(category: ExtractedReceiptData['category'], fields: FieldValidationMap) {
  if (!category) {
    addValidationResult(fields, 'category', 'warn', '尚未分類')
    return
  }

  addValidationResult(fields, 'category', 'pass', '分類已設定')
}

function validateAmountsForUniformInvoice(receipt: ExtractedReceiptData, fields: FieldValidationMap) {
  if (receipt.subtotal < 0) {
    addValidationResult(fields, 'subtotal', 'fail', '未稅金額不可為負數')
  } else {
    addValidationResult(fields, 'subtotal', 'pass', '未稅金額已擷取')
  }

  if (receipt.tax < 0) {
    addValidationResult(fields, 'tax', 'fail', '稅額不可為負數')
  }

  if (receipt.total < 0) {
    addValidationResult(fields, 'total', 'fail', '總金額不可為負數')
  }

  const taxCheck = validateTaxCalculation(receipt.subtotal, receipt.tax, receipt.total)

  if (receipt.subtotal === 0 && receipt.tax === 0 && receipt.total === 0) {
    addValidationResult(fields, 'tax', 'warn', '金額皆為 0，請人工確認')
    addValidationResult(fields, 'total', 'warn', '金額皆為 0，請人工確認')
    return
  }

  if (taxCheck.valid) {
    addValidationResult(fields, 'tax', 'pass', `稅率 ${taxCheck.taxRate}% 一致`)
    addValidationResult(fields, 'total', 'pass', `${receipt.subtotal} + ${receipt.tax} = ${receipt.total}`)
    return
  }

  const totalDelta = Math.abs(receipt.total - taxCheck.expectedTotal)

  if (totalDelta <= 1) {
    addValidationResult(fields, 'tax', 'warn', `稅率 ${taxCheck.taxRate}% 略有偏差`)
    addValidationResult(fields, 'total', 'warn', `總金額與預期差 ${totalDelta} 元`)
    return
  }

  addValidationResult(fields, 'tax', 'fail', `預期稅額 ${taxCheck.expectedTax}，實際為 ${receipt.tax}`)
  addValidationResult(fields, 'total', 'fail', `預期總金額 ${taxCheck.expectedTotal}，實際為 ${receipt.total}`)
}

function validateAmountsForReceipt(receipt: ExtractedReceiptData, fields: FieldValidationMap) {
  if (receipt.total < 0) {
    addValidationResult(fields, 'total', 'fail', '總金額不可為負數')
  } else if (receipt.total === 0) {
    addValidationResult(fields, 'total', 'warn', '總金額為 0，請人工確認')
  } else {
    addValidationResult(fields, 'total', 'pass', '總金額已擷取')
  }

  if (receipt.subtotal > 0) {
    addValidationResult(fields, 'subtotal', 'pass', '金額已擷取')
  } else {
    addValidationResult(fields, 'subtotal', 'warn', '非統一發票，通常不含未稅金額')
  }

  if (receipt.tax > 0) {
    addValidationResult(fields, 'tax', 'warn', '非統一發票，稅額拆分請人工確認')
  } else {
    addValidationResult(fields, 'tax', 'pass', '非統一發票，未提供稅額拆分')
  }
}

function recomputeSummary(fields: Record<ReceiptValidationField, ValidationResult[]>): ReceiptValidationReport['summary'] {
  return Object.values(fields).flat().reduce(
    (acc, result) => {
      acc.totalChecks += 1
      if (result.status === 'pass') acc.passedChecks += 1
      if (result.status === 'warn') acc.warningChecks += 1
      if (result.status === 'fail') acc.failedChecks += 1
      return acc
    },
    { passedChecks: 0, warningChecks: 0, failedChecks: 0, totalChecks: 0 }
  )
}

export async function enrichWithMoea(
  report: ReceiptValidationReport,
  extractedData: ExtractedReceiptData
): Promise<ReceiptValidationReport> {
  if (extractedData.receiptType !== 'uniform_invoice' || !extractedData.taxId) {
    return report
  }

  const taxIdPassed = report.fields.taxId.some((r) => r.status === 'pass')
  if (!taxIdPassed) return report

  const result = await lookupCompanyByUbn(extractedData.taxId)

  if (result.error) {
    report.fields.taxId.push({ status: 'warn', label: `政府資料庫查詢失敗：${result.error}` })
  } else if (!result.found) {
    report.fields.taxId.push({ status: 'fail', label: '統編在政府資料庫中查無此公司' })
    report.fields.vendorName.push({ status: 'warn', label: '無法從政府資料庫確認廠商名稱' })
  } else if (result.company) {
    const { name, status, isActive } = result.company

    if (!isActive) {
      report.fields.taxId.push({ status: 'warn', label: `公司已停業：${status}` })
    } else {
      report.fields.taxId.push({ status: 'pass', label: `政府資料庫確認：${name}` })
    }

    const extractedName = extractedData.vendorName.trim()
    const registeredName = name.trim()
    if (extractedName && registeredName && !registeredName.includes(extractedName) && !extractedName.includes(registeredName)) {
      report.fields.vendorName.push({
        status: 'warn',
        label: `廠商名稱與登記不符：登記為「${registeredName}」`,
      })
    } else if (extractedName) {
      report.fields.vendorName.push({ status: 'pass', label: `廠商名稱與登記一致` })
    }
  }

  const summary = recomputeSummary(report.fields)
  let status: ReceiptValidationReport['status'] = 'ready'
  if (summary.failedChecks > 0) status = 'rejected'
  else if (summary.warningChecks > 0) status = 'needs_review'

  return { ...report, summary, status }
}

export function validateReceipt(extractedData: ExtractedReceiptData): ReceiptValidationReport {
  const fields = createEmptyFieldValidationMap()

  validateVendorName(extractedData.vendorName, fields)
  validateInvoiceDate(extractedData.invoiceDate, fields)
  validateCategory(extractedData.category, fields)

  if (extractedData.receiptType === 'uniform_invoice') {
    const taxIdResult = validateTaxId(extractedData.taxId)
    addValidationResult(
      fields,
      'taxId',
      taxIdResult.valid ? 'pass' : 'fail',
      taxIdResult.valid ? '統編 checksum 驗證通過' : taxIdResult.error ?? '統編驗證失敗'
    )

    const invoiceNumberResult = validateInvoiceNumber(extractedData.invoiceNumber)
    addValidationResult(
      fields,
      'invoiceNumber',
      invoiceNumberResult.valid ? 'pass' : 'fail',
      invoiceNumberResult.valid ? '發票號碼格式正確' : invoiceNumberResult.error ?? '發票號碼驗證失敗'
    )

    if (invoiceNumberResult.period) {
      addValidationResult(fields, 'invoiceNumber', 'pass', `期別: ${invoiceNumberResult.period}`)
    }

    validateAmountsForUniformInvoice(extractedData, fields)
  } else {
    addValidationResult(
      fields,
      'taxId',
      extractedData.taxId ? 'warn' : 'pass',
      extractedData.taxId ? '非統一發票，統編請人工確認' : '非統一發票，通常不含統編'
    )
    addValidationResult(
      fields,
      'invoiceNumber',
      extractedData.invoiceNumber ? 'warn' : 'pass',
      extractedData.invoiceNumber ? '非統一發票，不套用發票號碼規則' : '非統一發票，通常不含發票號碼'
    )
    validateAmountsForReceipt(extractedData, fields)
  }

  const summary = recomputeSummary(fields)

  let status: ReceiptValidationReport['status'] = 'ready'
  if (summary.failedChecks > 0) {
    status = 'rejected'
  } else if (summary.warningChecks > 0) {
    status = 'needs_review'
  }

  return {
    fields,
    summary,
    status,
  }
}
