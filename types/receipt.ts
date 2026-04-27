import type {
  ReceiptCategory,
  ReceiptStatus,
  ValidationResult,
} from '@/lib/receipts/model'

export {
  receiptCategoryValues as receiptCategories,
  receiptDocumentTypeValues as receiptDocumentTypes,
  receiptStatusValues as receiptStatuses,
  receiptValidationFieldNames,
  type ExtractedReceiptData,
  type ExtractedReceiptLineItem,
  type ReceiptCategory,
  type ReceiptConfidenceScores,
  type ReceiptDocumentType,
  type ReceiptStatus,
  type ReceiptValidationField,
  type ReceiptValidationReport,
  type ValidationResult,
  type ValidationStatus,
} from '@/lib/receipts/model'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface ReceiptField {
  value: string
  confidence: number
  validations: ValidationResult[]
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
