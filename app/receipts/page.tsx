import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AppNavbar } from '@/components/app/app-navbar'
import { ReceiptStatusBadge } from '@/components/app/receipt-status-badge'
import { createClient } from '@/lib/supabase/server'
import { getReceiptList } from '@/lib/receipts/queries'
import { getServerTranslations } from '@/lib/i18n/server'
import { formatCurrency } from '@/lib/validators'
import { FileText, Upload } from 'lucide-react'

function getCurrentMonth() {
  const now = new Date()
  return `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

export default async function ReceiptsPage() {
  const t = await getServerTranslations()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const currentMonth = getCurrentMonth()
  const receiptList = await getReceiptList(user.id, currentMonth)

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-wrap gap-3 flex-1">
            <div className="inline-flex items-center rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
              {t.receiptsPage.monthLabel}: {currentMonth}
            </div>
            <div className="inline-flex items-center rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
              {t.receiptsPage.allStatuses}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="rounded-lg border border-border overflow-hidden bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="w-16 p-3 text-left text-sm font-medium text-muted-foreground">{t.receiptsPage.thumbnail}</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">{t.receiptsPage.date}</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">{t.receiptsPage.vendor}</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">{t.fields.taxId}</th>
                  <th className="p-3 text-right text-sm font-medium text-muted-foreground">{t.receiptsPage.amount}</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">{t.fields.category}</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">{t.status.review}</th>
                </tr>
              </thead>
              <tbody>
                {receiptList.map((receipt) => (
                  <tr key={receipt.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <Link href={`/receipts/${receipt.id}`} className="block">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </Link>
                    </td>
                    <td className="p-3 text-sm"><Link href={`/receipts/${receipt.id}`} className="block">{receipt.invoiceDate || '-'}</Link></td>
                    <td className="p-3 text-sm font-medium"><Link href={`/receipts/${receipt.id}`} className="block">{receipt.vendorName || '-'}</Link></td>
                    <td className="p-3 text-sm font-mono"><Link href={`/receipts/${receipt.id}`} className="block">{receipt.taxId || '-'}</Link></td>
                    <td className="p-3 text-sm font-mono text-right"><Link href={`/receipts/${receipt.id}`} className="block">{receipt.total ? formatCurrency(receipt.total) : '-'}</Link></td>
                    <td className="p-3 text-sm text-muted-foreground"><Link href={`/receipts/${receipt.id}`} className="block">{t.categories[receipt.category]}</Link></td>
                    <td className="p-3"><Link href={`/receipts/${receipt.id}`} className="block"><ReceiptStatusBadge status={receipt.status} /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">{t.receiptsPage.totalCount.replace('{count}', String(receiptList.length))}</span>
          </div>
        </div>

        <div className="md:hidden space-y-3">
          {receiptList.map((receipt) => (
            <Link key={receipt.id} href={`/receipts/${receipt.id}`}>
              <Card className="hover:bg-muted/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium truncate">{receipt.vendorName || t.receiptsPage.unrecognized}</p>
                          <p className="text-sm text-muted-foreground">{receipt.invoiceDate || t.receiptsPage.processing}</p>
                        </div>
                        <ReceiptStatusBadge status={receipt.status} />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground font-mono">{receipt.taxId || '-'}</span>
                        <span className="font-medium font-mono">{receipt.total ? formatCurrency(receipt.total) : '-'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {receiptList.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t.empty.receipts}</h3>
            <p className="text-muted-foreground mb-6">{t.receiptsPage.emptyDescription}</p>
            <Link href="/dashboard">
              <Button className="bg-[#0F766E] hover:bg-[#0F766E]/90 text-white">
                <Upload className="w-4 h-4 mr-2" />
                {t.receiptsPage.uploadReceipt}
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
