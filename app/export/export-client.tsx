'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Download, FileSpreadsheet, FileText, FileArchive, ChevronDown, Lightbulb, Check } from 'lucide-react'
import { formatCurrency } from '@/lib/validators'
import { useTranslations } from '@/lib/i18n/client'
import { cn } from '@/lib/utils'
import type { ReceiptExportItem } from '@/lib/receipts/queries'

type ExportFormat = 'xlsx' | 'csv' | 'pdf' | 'zip'

const formatOptions: {
  value: ExportFormat
  label: string
  desc: string
  icon: typeof FileSpreadsheet
  recommended?: boolean
  available: boolean
}[] = [
  { value: 'xlsx', label: 'Excel (.xlsx)', desc: '會計師標準傳票格式', icon: FileSpreadsheet, recommended: true, available: false },
  { value: 'csv', label: 'CSV (UTF-8 with BOM)', desc: '適合匯入其他系統', icon: FileText, available: true },
  { value: 'pdf', label: 'PDF 報表', desc: '含驗證摘要，適合存檔', icon: FileText, available: false },
  { value: 'zip', label: 'ZIP', desc: '含所有發票原始圖片', icon: FileArchive, available: false },
]

const availableFields = [
  { id: 'invoiceNumber', label: '發票號碼', default: true },
  { id: 'invoiceDate', label: '發票日期', default: true },
  { id: 'vendorName', label: '廠商名稱', default: true },
  { id: 'taxId', label: '統編', default: true },
  { id: 'subtotal', label: '未稅金額', default: true },
  { id: 'tax', label: '稅額', default: true },
  { id: 'total', label: '總金額', default: true },
  { id: 'category', label: '分類', default: true },
  { id: 'notes', label: '備註', default: false },
  { id: 'uploadedAt', label: '上傳時間', default: false },
  { id: 'status', label: '狀態', default: false },
] as const

interface ExportClientProps {
  initialDateFrom: string
  initialDateTo: string
  initialReceipts: ReceiptExportItem[]
}

export function ExportClient({
  initialDateFrom,
  initialDateTo,
  initialReceipts,
}: ExportClientProps) {
  const t = useTranslations()
  const [dateFrom, setDateFrom] = useState(initialDateFrom)
  const [dateTo, setDateTo] = useState(initialDateTo)
  const [confirmedOnly, setConfirmedOnly] = useState(true)
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv')
  const [selectedFields, setSelectedFields] = useState<string[]>(
    availableFields.filter((f) => f.default).map((f) => f.id)
  )
  const [isFieldsOpen, setIsFieldsOpen] = useState(false)

  const filteredReceipts = useMemo(() => {
    return initialReceipts.filter((receipt) => {
      if (confirmedOnly && receipt.status !== 'confirmed') return false
      return true
    })
  }, [confirmedOnly, initialReceipts])

  const totalAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.total, 0)

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId) ? prev.filter((f) => f !== fieldId) : [...prev, fieldId]
    )
  }

  const exportUrl = `/api/export/accountant-csv?dateFrom=${dateFrom}&dateTo=${dateTo}&confirmedOnly=${confirmedOnly}`

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0F766E] text-white text-sm flex items-center justify-center">1</span>
            {t.export.step1.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">{t.export.step1.from}</Label>
              <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">{t.export.step1.to}</Label>
              <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="confirmedOnly" className="cursor-pointer">
              {t.export.step1.confirmedOnly}
            </Label>
            <Switch id="confirmedOnly" checked={confirmedOnly} onCheckedChange={setConfirmedOnly} />
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm">
              {t.export.summary.replace('{count}', String(filteredReceipts.length))}{' '}
              <strong className="font-mono">{formatCurrency(totalAmount)}</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0F766E] text-white text-sm flex items-center justify-center">2</span>
            {t.export.step2.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {formatOptions.map((format) => {
              const Icon = format.icon
              const isSelected = selectedFormat === format.value
              return (
                <button
                  key={format.value}
                  onClick={() => format.available && setSelectedFormat(format.value)}
                  className={cn(
                    'relative flex items-start gap-3 p-4 rounded-lg border text-left transition-all',
                    isSelected
                      ? 'border-[#0F766E] bg-[#0F766E]/5 ring-1 ring-[#0F766E]'
                      : 'border-border hover:border-[#0F766E]/50',
                    !format.available && 'opacity-60'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                    isSelected ? 'bg-[#0F766E]/10 text-[#0F766E]' : 'bg-muted text-muted-foreground'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{format.label}</p>
                      {format.recommended && (
                        <span className="text-xs bg-[#CA8A04]/10 text-[#CA8A04] px-1.5 py-0.5 rounded">
                          {t.export.step2.recommended}
                        </span>
                      )}
                      {!format.available && (
                        <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                          {t.export.comingSoon}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{format.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-5 h-5 text-[#0F766E]" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <Collapsible open={isFieldsOpen} onOpenChange={setIsFieldsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-sm flex items-center justify-center">3</span>
                  {t.export.step3.title}
                  <span className="text-sm font-normal text-muted-foreground">({t.export.optional})</span>
                </span>
                <ChevronDown className={cn('w-5 h-5 text-muted-foreground transition-transform', isFieldsOpen && 'rotate-180')} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid sm:grid-cols-2 gap-3">
                {availableFields.map((field) => (
                  <label key={field.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={selectedFields.includes(field.id)} onCheckedChange={() => toggleField(field.id)} />
                    <span className="text-sm">{field.label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0F766E] text-white text-sm flex items-center justify-center">4</span>
            {t.export.step4.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  {selectedFields.slice(0, 5).map((fieldId) => {
                    const field = availableFields.find((f) => f.id === fieldId)
                    return (
                      <th key={fieldId} className="p-2 text-left font-medium text-muted-foreground">
                        {field?.label}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.slice(0, 3).map((receipt) => (
                  <tr key={receipt.id} className="border-t border-border">
                    {selectedFields.slice(0, 5).map((fieldId) => {
                      let value = '-'
                      if (fieldId === 'invoiceNumber') value = receipt.invoiceNumber
                      if (fieldId === 'invoiceDate') value = receipt.invoiceDate
                      if (fieldId === 'vendorName') value = receipt.vendorName
                      if (fieldId === 'taxId') value = receipt.taxId
                      if (fieldId === 'subtotal') value = String(receipt.subtotal)
                      if (fieldId === 'tax') value = String(receipt.tax)
                      if (fieldId === 'total') value = String(receipt.total)
                      if (fieldId === 'category') value = receipt.category
                      if (fieldId === 'notes') value = receipt.notes
                      if (fieldId === 'uploadedAt') value = receipt.uploadedAt
                      if (fieldId === 'status') value = receipt.status
                      return (
                        <td key={fieldId} className="p-2">
                          {value || '-'}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {t.export.step4.fullExport.replace('{count}', String(filteredReceipts.length))}
          </p>
        </CardContent>
      </Card>

      <Button
        size="lg"
        asChild
        disabled={selectedFormat !== 'csv' || filteredReceipts.length === 0}
        className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90 text-white text-base"
      >
        <a href={exportUrl}>
          <Download className="w-5 h-5 mr-2" />
          {t.export.downloadButton.replace('{format}', selectedFormat.toUpperCase())}
        </a>
      </Button>

      <div className="flex items-start gap-3 p-4 rounded-lg bg-[#CA8A04]/5 border border-[#CA8A04]/20">
        <Lightbulb className="w-5 h-5 text-[#CA8A04] shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          {t.export.tip}
        </p>
      </div>
    </div>
  )
}
