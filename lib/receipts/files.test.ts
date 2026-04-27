import { describe, expect, it } from 'vitest'
import { detectReceiptFileType, validateReceiptFileSignature } from './files'

describe('receipt file validation', () => {
  it('detects jpeg signatures', () => {
    const buffer = new Uint8Array([0xff, 0xd8, 0xff, 0xee])
    expect(detectReceiptFileType(buffer)).toBe('image/jpeg')
  })

  it('detects png signatures', () => {
    const buffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    expect(detectReceiptFileType(buffer)).toBe('image/png')
  })

  it('rejects pdf uploads explicitly', () => {
    const buffer = new Uint8Array([0x25, 0x50, 0x44, 0x46])
    const detected = detectReceiptFileType(buffer)
    expect(detected).toBe('application/pdf')
    expect(validateReceiptFileSignature(detected, 'application/pdf')).toEqual({
      ok: false,
      message: 'PDF 匯入流程尚未啟用，請先上傳圖片格式。',
    })
  })

  it('rejects mismatched mime types', () => {
    const buffer = new Uint8Array([0xff, 0xd8, 0xff, 0xee])
    const detected = detectReceiptFileType(buffer)
    expect(validateReceiptFileSignature(detected, 'image/png')).toEqual({
      ok: false,
      message: '檔案 MIME 類型與內容不一致：宣告為 image/png，實際為 image/jpeg。',
    })
  })
})
