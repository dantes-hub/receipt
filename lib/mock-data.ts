import type { Receipt, ReceiptStats, UserSettings } from '@/types/receipt'

export const mockReceipts: Receipt[] = [
  {
    id: 'AB12345678',
    imageUrl: '/placeholder-receipt.jpg',
    status: 'confirmed',
    uploadedAt: '2026-04-15T10:30:00Z',
    vendorName: { value: '家樂福 中科店', confidence: 0.96, validations: [] },
    taxId: { 
      value: '83579948', 
      confidence: 0.98, 
      validations: [
        { status: 'pass', label: 'Checksum 驗證通過' },
        { status: 'pass', label: '格式正確 8 碼' },
      ] 
    },
    invoiceNumber: { 
      value: 'AB12345678', 
      confidence: 0.99, 
      validations: [
        { status: 'pass', label: '格式正確' },
        { status: 'pass', label: '期別: 115年 03-04 月' },
      ] 
    },
    invoiceDate: { 
      value: '2026/04/15', 
      confidence: 0.95, 
      validations: [
        { status: 'pass', label: '民國 115/04/15 → 2026/04/15' },
      ] 
    },
    subtotal: { value: '1200', confidence: 0.97, validations: [] },
    tax: { 
      value: '60', 
      confidence: 0.97, 
      validations: [
        { status: 'pass', label: '稅率 5.0% 一致' },
      ] 
    },
    total: { 
      value: '1260', 
      confidence: 0.98, 
      validations: [
        { status: 'pass', label: '1,200 + 60 = 1,260' },
      ] 
    },
    category: 'dining',
    govVerification: {
      verified: true,
      verifiedAt: '2026-04-19T14:23:00Z',
    },
  },
  {
    id: 'CD23456789',
    imageUrl: '/placeholder-receipt.jpg',
    status: 'review',
    uploadedAt: '2026-04-16T09:15:00Z',
    vendorName: { value: '全聯福利中心', confidence: 0.92, validations: [] },
    taxId: { 
      value: '22099131', 
      confidence: 0.95, 
      validations: [
        { status: 'pass', label: 'Checksum 驗證通過' },
        { status: 'pass', label: '格式正確 8 碼' },
      ] 
    },
    invoiceNumber: { 
      value: 'CD23456789', 
      confidence: 0.98, 
      validations: [
        { status: 'pass', label: '格式正確' },
        { status: 'pass', label: '期別: 115年 03-04 月' },
      ] 
    },
    invoiceDate: { 
      value: '2026/04/16', 
      confidence: 0.96, 
      validations: [] 
    },
    subtotal: { value: '856', confidence: 0.94, validations: [] },
    tax: { 
      value: '43', 
      confidence: 0.90, 
      validations: [
        { status: 'warn', label: '稅率 5.02% 略有偏差' },
      ] 
    },
    total: { 
      value: '899', 
      confidence: 0.95, 
      validations: [
        { status: 'pass', label: '856 + 43 = 899' },
      ] 
    },
    category: 'dining',
  },
  {
    id: 'EF34567890',
    imageUrl: '/placeholder-receipt.jpg',
    status: 'error',
    uploadedAt: '2026-04-17T14:20:00Z',
    vendorName: { value: '未能辨識', confidence: 0.45, validations: [] },
    taxId: { 
      value: '1234567', 
      confidence: 0.50, 
      validations: [
        { status: 'fail', label: 'Checksum 錯誤' },
        { status: 'fail', label: '統編必須為 8 碼' },
      ] 
    },
    invoiceNumber: { 
      value: 'EF345678', 
      confidence: 0.60, 
      validations: [
        { status: 'fail', label: '格式錯誤' },
      ] 
    },
    invoiceDate: { 
      value: '2026/04/17', 
      confidence: 0.80, 
      validations: [] 
    },
    subtotal: { value: '500', confidence: 0.70, validations: [] },
    tax: { value: '25', confidence: 0.70, validations: [] },
    total: { value: '525', confidence: 0.70, validations: [] },
    category: 'other',
  },
  {
    id: 'GH45678901',
    imageUrl: '/placeholder-receipt.jpg',
    status: 'extracting',
    uploadedAt: '2026-04-18T11:00:00Z',
    vendorName: { value: '處理中...', confidence: 0, validations: [] },
    taxId: { value: '', confidence: 0, validations: [] },
    invoiceNumber: { value: '', confidence: 0, validations: [] },
    invoiceDate: { value: '', confidence: 0, validations: [] },
    subtotal: { value: '', confidence: 0, validations: [] },
    tax: { value: '', confidence: 0, validations: [] },
    total: { value: '', confidence: 0, validations: [] },
    category: 'other',
  },
  {
    id: 'IJ56789012',
    imageUrl: '/placeholder-receipt.jpg',
    status: 'confirmed',
    uploadedAt: '2026-04-14T16:45:00Z',
    vendorName: { value: '台灣中油', confidence: 0.99, validations: [] },
    taxId: { 
      value: '03785503', 
      confidence: 0.99, 
      validations: [
        { status: 'pass', label: 'Checksum 驗證通過' },
        { status: 'pass', label: '格式正確 8 碼' },
      ] 
    },
    invoiceNumber: { 
      value: 'IJ56789012', 
      confidence: 0.99, 
      validations: [
        { status: 'pass', label: '格式正確' },
        { status: 'pass', label: '期別: 115年 03-04 月' },
      ] 
    },
    invoiceDate: { 
      value: '2026/04/14', 
      confidence: 0.99, 
      validations: [] 
    },
    subtotal: { value: '1428', confidence: 0.99, validations: [] },
    tax: { 
      value: '71', 
      confidence: 0.99, 
      validations: [
        { status: 'pass', label: '稅率 4.97% 一致' },
      ] 
    },
    total: { 
      value: '1499', 
      confidence: 0.99, 
      validations: [
        { status: 'pass', label: '1,428 + 71 = 1,499' },
      ] 
    },
    category: 'transport',
    govVerification: {
      verified: true,
      verifiedAt: '2026-04-18T10:15:00Z',
    },
  },
]

export const mockStats: ReceiptStats = {
  totalThisMonth: 47,
  pendingReview: 3,
  confirmed: 44,
  totalAmount: 128450,
}

export const mockUser: UserSettings = {
  name: '王小明',
  email: 'wang.xiaoming@example.com',
  company: {
    name: '小明五金行',
    taxId: '12345678',
    address: '台中市西屯區文心路三段100號',
  },
  accountant: {
    name: '陳會計師',
    firm: '陳記帳士事務所',
    email: 'chen.accountant@example.com',
    preferredFormat: 'xlsx',
  },
  categories: ['餐飲', '交通', '辦公', '原物料', '其他'],
  notifications: {
    email: true,
    monthlyReport: false,
  },
}

export function getReceiptById(id: string): Receipt | undefined {
  return mockReceipts.find((r) => r.id === id)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
