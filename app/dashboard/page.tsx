import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppNavbar } from '@/components/app/app-navbar'
import { DashboardUploadCard } from '@/components/app/dashboard-upload-card'
import { ReceiptStatusBadge } from '@/components/app/receipt-status-badge'
import { createClient } from '@/lib/supabase/server'
import { getRecentReceipts, getReceiptStats } from '@/lib/receipts/queries'
import { formatCurrency } from '@/lib/validators'
import { getServerTranslations } from '@/lib/i18n/server'
import { cn } from '@/lib/utils'
import { ArrowRight, CheckCircle, Clock, DollarSign, FileText } from 'lucide-react'

function getCurrentMonth() {
  const now = new Date()
  return `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export default async function DashboardPage() {
  const t = await getServerTranslations()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [recentReceipts, stats] = await Promise.all([
    getRecentReceipts(user.id, 5),
    getReceiptStats(user.id, getCurrentMonth()),
  ])

  const estimatedMinutesSaved = stats.totalThisMonth * 3
  const displayName = user.email?.split('@')[0] || t.dashboard.greetingFallback

  const statCards = [
    {
      label: t.dashboard.stats.monthlyReceipts,
      value: stats.totalThisMonth,
      icon: FileText,
      color: 'text-[#0F766E]',
      bgColor: 'bg-[#0F766E]/10',
    },
    {
      label: t.dashboard.stats.pending,
      value: stats.pendingReview,
      icon: Clock,
      color: stats.pendingReview > 0 ? 'text-[#B45309]' : 'text-muted-foreground',
      bgColor: stats.pendingReview > 0 ? 'bg-[#B45309]/10' : 'bg-muted',
      highlight: stats.pendingReview > 0,
    },
    {
      label: t.dashboard.stats.confirmed,
      value: stats.confirmed,
      icon: CheckCircle,
      color: 'text-[#166534]',
      bgColor: 'bg-[#166534]/10',
    },
    {
      label: t.dashboard.stats.monthlyTotal,
      value: formatCurrency(stats.totalAmount),
      icon: DollarSign,
      color: 'text-[#0F766E]',
      bgColor: 'bg-[#0F766E]/10',
      isAmount: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="relative bg-[#0F766E]/5 border border-[#0F766E]/20 rounded-xl p-4 pr-12">
          <p className="text-[#0F766E]">
            {t.dashboard.welcome
              .replace('{name}', displayName)
              .replace('{count}', String(stats.totalThisMonth))
              .replace('{minutes}', String(estimatedMinutesSaved))}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className={cn('border-border', stat.highlight && 'border-[#B45309]/30')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.bgColor)}>
                      <Icon className={cn('w-5 h-5', stat.color)} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={cn('text-xl font-bold', stat.isAmount && 'font-mono')}>
                        {stat.isAmount ? stat.value : `${stat.value}${t.dashboard.filesUnit ? ` ${t.dashboard.filesUnit}` : ''}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <DashboardUploadCard />

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t.dashboard.recentReceipts}</CardTitle>
            <Link href="/receipts">
              <Button variant="ghost" size="sm" className="text-[#0F766E]">
                {t.actions.viewAll}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentReceipts.map((receipt) => (
                <Link
                  key={receipt.id}
                  href={`/receipts/${receipt.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{receipt.vendorName || t.receiptsPage.processing}</p>
                    <p className="text-sm text-muted-foreground">{receipt.invoiceDate || formatDate(receipt.uploadedAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-medium">{receipt.total ? formatCurrency(receipt.total) : '-'}</p>
                    <ReceiptStatusBadge status={receipt.status} className="mt-1" />
                  </div>
                </Link>
              ))}
            </div>

            {recentReceipts.length === 0 && (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t.empty.receipts}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
