const jpegMagic = [0xff, 0xd8, 0xff]
const pngMagic = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const pdfMagic = [0x25, 0x50, 0x44, 0x46]
const heicBrands = new Set(['heic', 'heix', 'hevc', 'hevx'])
const heifBrands = new Set(['mif1', 'msf1', 'heif'])

export const MAX_RECEIPT_FILE_SIZE_BYTES = 10 * 1024 * 1024
export const supportedReceiptMimeTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'] as const
export const deferredReceiptMimeTypes = ['application/pdf'] as const

export type SupportedReceiptMimeType = (typeof supportedReceiptMimeTypes)[number]
export type DeferredReceiptMimeType = (typeof deferredReceiptMimeTypes)[number]
export type DetectedReceiptFileType = SupportedReceiptMimeType | DeferredReceiptMimeType | 'unknown'
type ReceiptFileValidationResult =
  | { ok: true; mimeType: SupportedReceiptMimeType }
  | { ok: false; message: string }

function startsWithBytes(buffer: Uint8Array, magic: number[]) {
  return magic.every((byte, index) => buffer[index] === byte)
}

export function detectReceiptFileType(buffer: Uint8Array): DetectedReceiptFileType {
  if (buffer.length >= jpegMagic.length && startsWithBytes(buffer, jpegMagic)) {
    return 'image/jpeg'
  }

  if (buffer.length >= pngMagic.length && startsWithBytes(buffer, pngMagic)) {
    return 'image/png'
  }

  if (buffer.length >= pdfMagic.length && startsWithBytes(buffer, pdfMagic)) {
    return 'application/pdf'
  }

  if (buffer.length >= 12) {
    const brand = Buffer.from(buffer.slice(8, 12)).toString('ascii')
    const marker = Buffer.from(buffer.slice(4, 8)).toString('ascii')

    if (marker === 'ftyp' && heicBrands.has(brand)) {
      return 'image/heic'
    }

    if (marker === 'ftyp' && heifBrands.has(brand)) {
      return 'image/heif'
    }
  }

  return 'unknown'
}

export function getReceiptFileExtension(mimeType: SupportedReceiptMimeType | DeferredReceiptMimeType) {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/heic':
      return 'heic'
    case 'image/heif':
      return 'heif'
    case 'application/pdf':
      return 'pdf'
  }
}

export function validateReceiptFileSignature(
  fileType: DetectedReceiptFileType,
  declaredMimeType: string
): ReceiptFileValidationResult {
  if (fileType === 'unknown') {
    return { ok: false, message: '無法辨識檔案格式，請重新匯出為 JPG、PNG、HEIC 或 HEIF。' }
  }

  if (fileType === 'application/pdf') {
    return { ok: false, message: 'PDF 匯入流程尚未啟用，請先上傳圖片格式。' }
  }

  if (declaredMimeType && declaredMimeType !== fileType) {
    return { ok: false, message: `檔案 MIME 類型與內容不一致：宣告為 ${declaredMimeType}，實際為 ${fileType}。` }
  }

  return { ok: true as const, mimeType: fileType }
}
