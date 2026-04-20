export const receiptStatuses = ['pending', 'extracting', 'review', 'confirmed', 'error'] as const
export type ReceiptStatus = (typeof receiptStatuses)[number]
export type ConfidenceLevel = 'high' | 'medium' | 'low'
export type ValidationStatus = 'pass' | 'warn' | 'fail'
export const receiptDocumentTypes = ['uniform_invoice', 'receipt', 'other'] as const
export type ReceiptDocumentType = (typeof receiptDocumentTypes)[number]

export const receiptCategories = ['dining', 'transport', 'office', 'materials', 'other'] as const
export type ReceiptCategory = (typeof receiptCategories)[number]

export interface ValidationResult {
  status: ValidationStatus
  label: string
  details?: string
}

export type ReceiptValidationField =
  | 'vendorName'
  | 'taxId'
  | 'invoiceNumber'
  | 'invoiceDate'
  | 'subtotal'
  | 'tax'
  | 'total'
  | 'category'

export interface ReceiptValidationReport {
  fields: Record<ReceiptValidationField, ValidationResult[]>
  summary: {
    passedChecks: number
    warningChecks: number
    failedChecks: number
    totalChecks: number
  }
  status: 'ready' | 'needs_review' | 'rejected'
}

export interface ReceiptField {
  value: string
  confidence: number
  validations: ValidationResult[]
}

export interface ExtractedReceiptLineItem {
  description: string
  quantity?: number
  unitPrice?: number
  amount?: number
}

export interface ExtractedReceiptData {
  receiptType: ReceiptDocumentType
  vendorName: string
  taxId: string
  invoiceNumber: string
  invoiceDate: string
  subtotal: number
  tax: number
  total: number
  category: ReceiptCategory
  lineItems: ExtractedReceiptLineItem[]
  notes?: string
}

export interface Receipt {
  id: string
  imageUrl: string
  status: ReceiptStatus
  uploadedAt: string
  
  // Extracted fields
  vendorName: ReceiptField
  taxId: ReceiptField
  invoiceNumber: ReceiptField
  invoiceDate: ReceiptField
  subtotal: ReceiptField
  tax: ReceiptField
  total: ReceiptField
  
  // User-editable
  category: ReceiptCategory
  notes?: string
  
  // Government verification (beta)
  govVerification?: {
    verified: boolean
    verifiedAt: string
    discrepancies?: string[]
  }
}

export interface ReceiptStats {
  totalThisMonth: number
  pendingReview: number
  confirmed: number
  totalAmount: number
}

export interface UserSettings {
  name: string
  email: string
  company: {
    name: string
    taxId: string
    address?: string
  }
  accountant?: {
    name: string
    firm: string
    email: string
    preferredFormat: 'xlsx' | 'csv' | 'pdf'
  }
  categories: string[]
  notifications: {
    email: boolean
    monthlyReport: boolean
  }
}

export interface ExportOptions {
  dateFrom: string
  dateTo: string
  confirmedOnly: boolean
  format: 'xlsx' | 'csv' | 'pdf' | 'zip'
  fields: string[]
}
