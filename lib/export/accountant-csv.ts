import type { ReceiptCategory } from '@/types/receipt'
import type { ReceiptExportItem } from '@/lib/receipts/queries'

const debitAccountByCategory: Record<ReceiptCategory, string> = {
  dining: '餐飲費',
  transport: '交通費',
  office: '辦公費',
  materials: '進貨/原物料',
  other: '雜項支出',
}

function escapeCsvCell(value: string | number) {
  const stringValue = String(value ?? '')
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`
  }

  return stringValue
}

function buildVoucherNumber(receipt: ReceiptExportItem) {
  return receipt.invoiceNumber || receipt.id
}

function buildSummary(receipt: ReceiptExportItem) {
  return receipt.vendorName || '未命名發票'
}

export function buildAccountantCsv(receipts: ReceiptExportItem[]) {
  const headers = [
    '日期',
    '憑證編號',
    '摘要',
    '借方科目',
    '借方金額',
    '貸方科目',
    '貸方金額',
    '統編',
    '發票號碼',
    '附註',
  ]

  const rows = receipts.map((receipt) => [
    receipt.invoiceDate || receipt.uploadedAt.slice(0, 10),
    buildVoucherNumber(receipt),
    buildSummary(receipt),
    debitAccountByCategory[receipt.category],
    receipt.total,
    '現金',
    receipt.total,
    receipt.taxId,
    receipt.invoiceNumber,
    receipt.notes,
  ])

  const csvLines = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(','))
  return `\uFEFF${csvLines.join('\n')}`
}
