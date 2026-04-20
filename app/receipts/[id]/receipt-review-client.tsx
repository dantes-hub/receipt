'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AppNavbar } from '@/components/app/app-navbar'
import { ReceiptImageViewer } from '@/components/app/receipt-image-viewer'
import { ReceiptStatusBadge } from '@/components/app/receipt-status-badge'
import { ValidationBadge } from '@/components/app/validation-badge'
import { ConfidenceDot } from '@/components/app/confidence-dot'
import { TaiwanTaxIdInput } from '@/components/app/taiwan-tax-id-input'
import { FaPiaoNumberInput } from '@/components/app/fapiao-number-input'
import { AmountInput } from '@/components/app/amount-input'
import { DateInput } from '@/components/app/date-input'
import { ArrowLeft, ArrowRight, Trash2, Check, FileText, Loader2 } from 'lucide-react'
import { getConfidenceLevel } from '@/lib/validators'
import { useTranslations } from '@/lib/i18n/client'
import { useLocale } from '@/lib/i18n/client'
import type { ReceiptCategory, ReceiptDocumentType, ReceiptStatus, ValidationResult } from '@/types/receipt'

export interface ReceiptReviewFieldViewModel {
  value: string
  confidence: number
  validations: ValidationResult[]
}

export interface ReceiptReviewViewModel {
  id: string
  status: ReceiptStatus
  receiptType: ReceiptDocumentType
  uploadedAt: string
  imageUrl: string | null
  imagePath: string
  fileName: string
  isPdf: boolean
  vendorName: ReceiptReviewFieldViewModel
  taxId: ReceiptReviewFieldViewModel
  invoiceNumber: ReceiptReviewFieldViewModel
  invoiceDate: ReceiptReviewFieldViewModel
  subtotal: ReceiptReviewFieldViewModel
  tax: ReceiptReviewFieldViewModel
  total: ReceiptReviewFieldViewModel
  category: ReceiptCategory
  notes: string
}

interface ReceiptReviewClientProps {
  receipt: ReceiptReviewViewModel
  prevReceiptId: string | null
  nextReceiptId: string | null
}

function formatDateTime(dateString: string, locale: string) {
  const date = new Date(dateString)
  return date.toLocaleString(locale === 'en' ? 'en-US' : 'zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ReceiptReviewClient({
  receipt,
  prevReceiptId,
  nextReceiptId,
}: ReceiptReviewClientProps) {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()

  const categories: { value: ReceiptCategory; label: string }[] = [
    { value: 'dining', label: t.categories.dining },
    { value: 'transport', label: t.categories.transport },
    { value: 'office', label: t.categories.office },
    { value: 'materials', label: t.categories.materials },
    { value: 'other', label: t.categories.other },
  ]
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    vendorName: receipt.vendorName.value,
    taxId: receipt.taxId.value,
    invoiceNumber: receipt.invoiceNumber.value,
    invoiceDate: receipt.invoiceDate.value,
    subtotal: Number.parseInt(receipt.subtotal.value, 10) || 0,
    tax: Number.parseInt(receipt.tax.value, 10) || 0,
    total: Number.parseInt(receipt.total.value, 10) || 0,
    category: receipt.category,
    notes: receipt.notes,
  })

  const validatedFields = [
    receipt.vendorName.confidence > 0.8,
    receipt.taxId.validations.some((v) => v.status === 'pass'),
    receipt.invoiceNumber.validations.some((v) => v.status === 'pass'),
    receipt.invoiceDate.validations.some((v) => v.status === 'pass') || receipt.invoiceDate.confidence > 0.8,
    receipt.subtotal.confidence > 0.8,
    receipt.tax.validations.some((v) => v.status === 'pass'),
    receipt.total.validations.some((v) => v.status === 'pass'),
  ].filter(Boolean).length

  const totalFields = 7
  const progressPercent = (validatedFields / totalFields) * 100

  const handleConfirmAndNext = () => {
    void saveReceipt()
  }

  const saveReceipt = async () => {
    setIsSaving(true)
    setSaveError(null)

    try {
      const response = await fetch(`/api/receipts/${receipt.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'confirmed',
          extractedData: {
            receiptType: receipt.receiptType,
            vendorName: formData.vendorName,
            taxId: formData.taxId,
            invoiceNumber: formData.invoiceNumber,
            invoiceDate: formData.invoiceDate,
            subtotal: formData.subtotal,
            tax: formData.tax,
            total: formData.total,
            category: formData.category,
            lineItems: [],
            notes: formData.notes || undefined,
          },
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || t.errors.saveFailed)
      }

      if (nextReceiptId) {
        router.push(`/receipts/${nextReceiptId}`)
        return
      }

      router.push('/receipts')
      router.refresh()
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : t.errors.saveFailed)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />

      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/receipts" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            {t.review.backToList}
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden sm:inline">
              {t.review.receiptPrefix} #{receipt.invoiceNumber.value || receipt.id}
            </span>
            <span className="text-sm text-muted-foreground hidden md:inline">
              &middot; {formData.invoiceDate || t.review.pendingRecognition} &middot; {formData.vendorName || t.review.pendingRecognition}
            </span>
            <ReceiptStatusBadge status={receipt.status} />
          </div>

          <div className="w-24" />
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-11 gap-6">
          <div className="lg:col-span-6">
            {receipt.imageUrl && !receipt.isPdf ? (
              <ReceiptImageViewer
                src={receipt.imageUrl}
                alt={`發票 ${receipt.invoiceNumber.value || receipt.id}`}
                className="h-full"
              />
            ) : (
              <Card className="h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center border-dashed">
                <CardContent className="py-10 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium mb-2">{receipt.isPdf ? t.review.previewPdf : t.review.previewUnavailable}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {receipt.isPdf ? t.review.pdfHint : t.review.previewHint}
                  </p>
                  {receipt.imageUrl && (
                    <Button asChild variant="outline">
                      <a href={receipt.imageUrl} target="_blank" rel="noreferrer">
                        {t.review.openOriginalFile}
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
            <div className="mt-3 text-xs text-muted-foreground">
              {receipt.fileName} &middot; {t.review.uploadedAt} {formatDateTime(receipt.uploadedAt, locale)}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{t.review.validationProgress}</span>
                <span className="text-muted-foreground">{t.review.validatedFields.replace('{count}', String(validatedFields)).replace('{total}', String(totalFields))}</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">{t.review.basicInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="vendorName">{t.fields.vendorName}</Label>
                    <ConfidenceDot level={getConfidenceLevel(receipt.vendorName.confidence)} score={receipt.vendorName.confidence} />
                  </div>
                  <Input
                    id="vendorName"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  />
                  {receipt.vendorName.validations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {receipt.vendorName.validations.map((v, i) => (
                        <ValidationBadge key={i} status={v.status} label={v.label} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="taxId">{t.fields.taxId}</Label>
                    <ConfidenceDot level={getConfidenceLevel(receipt.taxId.confidence)} score={receipt.taxId.confidence} />
                  </div>
                  <TaiwanTaxIdInput
                    value={formData.taxId}
                    onChange={(value) => setFormData({ ...formData, taxId: value })}
                  />
                  {receipt.taxId.validations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {receipt.taxId.validations.map((v, i) => (
                        <ValidationBadge key={i} status={v.status} label={v.label} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="invoiceNumber">{t.fields.invoiceNumber}</Label>
                    <ConfidenceDot level={getConfidenceLevel(receipt.invoiceNumber.confidence)} score={receipt.invoiceNumber.confidence} />
                  </div>
                  <FaPiaoNumberInput
                    value={formData.invoiceNumber}
                    onChange={(value) => setFormData({ ...formData, invoiceNumber: value })}
                  />
                  {receipt.invoiceNumber.validations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {receipt.invoiceNumber.validations.map((v, i) => (
                        <ValidationBadge key={i} status={v.status} label={v.label} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="invoiceDate">{t.fields.invoiceDate}</Label>
                    <ConfidenceDot level={getConfidenceLevel(receipt.invoiceDate.confidence)} score={receipt.invoiceDate.confidence} />
                  </div>
                  <DateInput
                    value={formData.invoiceDate}
                    onChange={(value) => setFormData({ ...formData, invoiceDate: value })}
                    allowMinguo
                  />
                  {receipt.invoiceDate.validations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {receipt.invoiceDate.validations.map((v, i) => (
                        <ValidationBadge key={i} status={v.status} label={v.label} />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">{t.review.amountInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subtotal">{t.fields.subtotal}</Label>
                  <AmountInput
                    value={formData.subtotal}
                    onChange={(value) => setFormData({ ...formData, subtotal: value })}
                  />
                  {receipt.subtotal.validations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {receipt.subtotal.validations.map((v, i) => (
                        <ValidationBadge key={i} status={v.status} label={v.label} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax">{t.fields.tax} (5%)</Label>
                  <AmountInput
                    value={formData.tax}
                    onChange={(value) => setFormData({ ...formData, tax: value })}
                  />
                  {receipt.tax.validations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {receipt.tax.validations.map((v, i) => (
                        <ValidationBadge key={i} status={v.status} label={v.label} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total">{t.fields.total}</Label>
                  <AmountInput
                    value={formData.total}
                    onChange={(value) => setFormData({ ...formData, total: value })}
                  />
                  {receipt.total.validations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {receipt.total.validations.map((v, i) => (
                        <ValidationBadge key={i} status={v.status} label={v.label} />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">{t.review.otherInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">{t.fields.category}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: ReceiptCategory) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{t.fields.notes}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={t.review.optionalPlaceholder}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-2" />
              {t.actions.delete}
            </Button>

            <div className="flex items-center gap-2">
              {prevReceiptId && (
                <Link href={`/receipts/${prevReceiptId}`}>
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    {t.actions.previous}
                  </Button>
                </Link>
              )}
              {nextReceiptId && (
                <Link href={`/receipts/${nextReceiptId}`}>
                  <Button variant="outline" size="sm">
                    {t.actions.next}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
              <Button
                onClick={handleConfirmAndNext}
                disabled={isSaving}
                className="bg-[#0F766E] hover:bg-[#0F766E]/90 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.review.saving}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t.review.saveAndNext}
                  </>
                )}
              </Button>
            </div>
          </div>

          {saveError && (
            <p className="text-xs text-destructive text-center mt-2">{saveError}</p>
          )}

          <div className="text-xs text-muted-foreground text-center mt-2 hidden md:block">
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Enter</kbd> {t.review.keyboardConfirm} &middot;
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground ml-2">Esc</kbd> {t.review.keyboardCancel} &middot;
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground ml-2">&larr;</kbd><kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">&rarr;</kbd> {t.review.keyboardBrowse}
          </div>
        </div>
      </div>
    </div>
  )
}
