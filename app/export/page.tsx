import { redirect } from 'next/navigation'
import { AppNavbar } from '@/components/app/app-navbar'
import { createClient } from '@/lib/supabase/server'
import { getReceiptsForExport } from '@/lib/receipts/queries'
import { getServerTranslations } from '@/lib/i18n/server'
import { ExportClient } from './export-client'

function getCurrentMonthDateRange() {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const lastDay = new Date(Date.UTC(year, now.getUTCMonth() + 1, 0)).getUTCDate()

  return {
    dateFrom: `${year}-${month}-01`,
    dateTo: `${year}-${month}-${String(lastDay).padStart(2, '0')}`,
  }
}

export default async function ExportPage() {
  const t = await getServerTranslations()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { dateFrom, dateTo } = getCurrentMonthDateRange()
  const receipts = await getReceiptsForExport({
    userId: user.id,
    dateFrom,
    dateTo,
    confirmedOnly: false,
  })

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">{t.nav.export}</h1>
        <ExportClient
          initialDateFrom={dateFrom}
          initialDateTo={dateTo}
          initialReceipts={receipts}
        />
      </main>
    </div>
  )
}
