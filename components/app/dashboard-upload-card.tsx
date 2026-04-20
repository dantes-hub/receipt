'use client'

import { startTransition, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, CircleAlert, Clock3, Camera, Loader2, Upload, ScanLine } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/client'
import { cn } from '@/lib/utils'

type UploadState = 'queued' | 'uploading' | 'extracting' | 'done' | 'error'

interface UploadItem {
  file: File
  state: UploadState
  message?: string
  receiptId?: string
}

function getFilesFromEvent(fileList: FileList | null) {
  return Array.from(fileList || []).filter(
    (file) => file.type.startsWith('image/') || file.type === 'application/pdf'
  )
}

function getStateIcon(state: UploadState) {
  switch (state) {
    case 'uploading':
      return <Loader2 className="w-4 h-4 animate-spin text-[#0F766E]" />
    case 'extracting':
      return <ScanLine className="w-4 h-4 animate-pulse text-[#0F766E]" />
    case 'done':
      return <CheckCircle2 className="w-4 h-4 text-[#166534]" />
    case 'error':
      return <CircleAlert className="w-4 h-4 text-[#991B1B]" />
    default:
      return <Clock3 className="w-4 h-4 text-muted-foreground" />
  }
}

async function pollStatus(receiptId: string): Promise<'review' | 'error' | 'pending' | 'extracting'> {
  try {
    const res = await fetch(`/api/receipts/${receiptId}/status`)
    if (!res.ok) return 'error'
    const data = await res.json()
    return data.status
  } catch {
    return 'error'
  }
}

async function waitForExtraction(
  receiptId: string,
  onStatus: (status: string) => void
): Promise<'review' | 'error'> {
  const MAX_POLLS = 30
  const INTERVAL_MS = 2000

  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS))
    const status = await pollStatus(receiptId)
    onStatus(status)
    if (status === 'review' || status === 'error') return status
  }

  return 'error'
}

export function DashboardUploadCard() {
  const t = useTranslations()
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = getFilesFromEvent(e.dataTransfer.files)
    if (files.length > 0) void uploadFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = getFilesFromEvent(e.target.files)
    if (files.length > 0) void uploadFiles(files)
    e.target.value = ''
  }

  const updateUploadItem = (fileName: string, nextState: Partial<UploadItem>) => {
    setUploadItems((current) =>
      current.map((item) => item.file.name === fileName ? { ...item, ...nextState } : item)
    )
  }

  const uploadFiles = async (files: File[]) => {
    setError(null)
    setUploadItems(files.map((file) => ({ file, state: 'queued' })))
    setIsUploading(true)

    let firstReceiptId: string | null = null

    for (const file of files) {
      updateUploadItem(file.name, { state: 'uploading', message: t.dashboard.uploadingAndExtracting })

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/receipts/upload', { method: 'POST', body: formData })
        const payload = await response.json()

        if (!response.ok) throw new Error(payload.error || '上傳失敗')

        const receiptId = payload.receiptId
        if (!firstReceiptId && receiptId) firstReceiptId = receiptId

        updateUploadItem(file.name, {
          state: 'extracting',
          message: t.receiptsPage.processing,
          receiptId,
        })

        const finalStatus = await waitForExtraction(receiptId, (status) => {
          if (status === 'extracting') {
            updateUploadItem(file.name, { message: t.receiptsPage.processing })
          }
        })

        if (finalStatus === 'review') {
          updateUploadItem(file.name, { state: 'done', message: t.dashboard.uploadDone })
        } else {
          updateUploadItem(file.name, { state: 'error', message: t.errors.uploadFailed })
        }
      } catch (uploadError) {
        const message = uploadError instanceof Error ? uploadError.message : '上傳失敗'
        updateUploadItem(file.name, { state: 'error', message })
        setError(message)
      }
    }

    setIsUploading(false)

    if (firstReceiptId) {
      startTransition(() => {
        router.push(files.length === 1 ? `/receipts/${firstReceiptId}` : '/receipts')
      })
    }
  }

  const isProcessing = isUploading || uploadItems.some((i) => i.state === 'uploading' || i.state === 'extracting')

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all',
            isDragging
              ? 'border-[#0F766E] bg-[#0F766E]/5'
              : 'border-border hover:border-[#0F766E]/50 hover:bg-muted/30'
          )}
        >
          {isProcessing ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 mx-auto text-[#0F766E] animate-spin" />
              <p className="text-muted-foreground">
                {t.dashboard.processingFiles.replace('{count}', String(uploadItems.length))}
              </p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">{t.dashboard.upload.title}</p>
              <p className="text-sm text-muted-foreground mb-4 hidden md:block">
                {t.dashboard.upload.subtitle}
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                {t.dashboard.upload.formats}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                  <Button asChild className="bg-[#0F766E] hover:bg-[#0F766E]/90 text-white cursor-pointer">
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {t.dashboard.selectFiles}
                    </span>
                  </Button>
                </label>

                <label className="md:hidden">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                  <Button variant="outline" asChild className="cursor-pointer">
                    <span>
                      <Camera className="w-4 h-4 mr-2" />
                      {t.dashboard.takePhoto}
                    </span>
                  </Button>
                </label>
              </div>
            </>
          )}
        </div>

        {(uploadItems.length > 0 || error) && (
          <div className="mt-4 space-y-3">
            {uploadItems.length > 0 && (
              <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
                {uploadItems.map((item) => (
                  <div key={`${item.file.name}-${item.file.size}`} className="flex items-center justify-between gap-3 p-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.file.name}</p>
                      <p className="text-muted-foreground truncate">{item.message || t.dashboard.waitingUpload}</p>
                    </div>
                    <div className="shrink-0">
                      {getStateIcon(item.state)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
