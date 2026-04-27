import Link from 'next/link'
import type { Metadata } from 'next'
import { Navbar } from '@/components/app/navbar'
import { Footer } from '@/components/app/footer'

export const metadata: Metadata = {
  title: '隱私權政策 Privacy Policy — ReceiptBridge',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">{title}</h2>
      <div className="space-y-2 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-[#0F766E] mt-1 shrink-0">·</span>
      <span>{children}</span>
    </li>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/terms" className="hover:text-foreground transition-colors">服務條款 Terms</Link>
            <span>·</span>
            <span>隱私權政策 Privacy Policy</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Privacy Policy / 隱私權政策</h1>
          <p className="text-sm text-muted-foreground">Last updated / 最後更新: April 27, 2026</p>
        </div>

        {/* English */}
        <div className="space-y-8 mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-sm font-medium">English</div>

          <Section title="What we collect">
            <ul className="space-y-1.5">
              <Li>Email address (for login)</Li>
              <Li>Company information you enter in Settings (name, UBN, accountant info)</Li>
              <Li>Receipt images you upload</Li>
              <Li>Data extracted from receipts (vendor, amount, date, etc.)</Li>
            </ul>
          </Section>

          <Section title="Why we collect it">
            <p>To provide the Service: store your receipts, extract data, generate exports.</p>
          </Section>

          <Section title="Third-party processors">
            <ul className="space-y-1.5">
              <Li><strong className="text-foreground">Supabase</strong> — database and file storage (data hosted in Mumbai region)</Li>
              <Li><strong className="text-foreground">OpenAI</strong> — AI extraction (receipt images sent to OpenAI&apos;s API; per OpenAI&apos;s API terms, data is not used to train models and is retained for up to 30 days for abuse monitoring)</Li>
              <Li><strong className="text-foreground">Vercel</strong> — hosting and serverless infrastructure</Li>
              <Li><strong className="text-foreground">Stripe</strong> — payment processing (when paid plans are introduced)</Li>
            </ul>
          </Section>

          <Section title="Data retention">
            <ul className="space-y-1.5">
              <Li>Active accounts: data retained while your account is active</Li>
              <Li>Receipt images: deleted 90 days after upload</Li>
              <Li>Closed accounts: all data deleted within 30 days of account deletion request</Li>
            </ul>
          </Section>

          <Section title="Your rights (PDPA)">
            <p>Under Taiwan&apos;s Personal Data Protection Act, you may:</p>
            <ul className="space-y-1.5 mt-2">
              <Li>Request access to your data</Li>
              <Li>Request correction of inaccurate data</Li>
              <Li>Request deletion of your data</Li>
              <Li>Withdraw consent</Li>
            </ul>
            <p className="mt-2">
              Email <a href="mailto:contact@receiptbridge.app" className="text-[#0F766E] hover:underline">contact@receiptbridge.app</a> or use the Delete Account button in Settings.
            </p>
          </Section>

          <Section title="Cross-border data transfer">
            <p>Data is processed in the Asia-Pacific region (Supabase Mumbai) and the United States (OpenAI, Vercel). By using the Service, you consent to this transfer.</p>
          </Section>

          <Section title="Security">
            <p>We use industry-standard practices: encrypted connections (HTTPS), row-level security on all database tables, private file storage, no API keys in client code.</p>
          </Section>

          <Section title="Contact">
            <p>Privacy questions: <a href="mailto:contact@receiptbridge.app" className="text-[#0F766E] hover:underline">contact@receiptbridge.app</a></p>
          </Section>
        </div>

        <div className="border-t border-border my-10" />

        {/* 繁體中文 */}
        <div className="space-y-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-sm font-medium">繁體中文</div>

          <Section title="我們收集的資料">
            <ul className="space-y-1.5">
              <Li>電子郵件（用於登入）</Li>
              <Li>您在「設定」中填寫的公司資訊（公司名稱、統編、會計師資訊）</Li>
              <Li>您上傳的發票圖像</Li>
              <Li>從發票中辨識出的資料（廠商、金額、日期等）</Li>
            </ul>
          </Section>

          <Section title="收集目的">
            <p>為提供本服務：儲存您的發票、辨識資料、產生匯出檔案。</p>
          </Section>

          <Section title="第三方處理者">
            <ul className="space-y-1.5">
              <Li><strong className="text-foreground">Supabase</strong> — 資料庫與檔案儲存（資料存放於孟買區域）</Li>
              <Li><strong className="text-foreground">OpenAI</strong> — AI 辨識（發票圖像會傳送至 OpenAI API；依 OpenAI API 條款，資料不用於訓練模型，僅保留至多 30 天供濫用監測）</Li>
              <Li><strong className="text-foreground">Vercel</strong> — 網站代管與伺服器</Li>
              <Li><strong className="text-foreground">Stripe</strong> — 金流處理（付費方案啟用時）</Li>
            </ul>
          </Section>

          <Section title="資料保存期限">
            <ul className="space-y-1.5">
              <Li>帳號使用期間：資料持續保存</Li>
              <Li>發票圖像：上傳後 90 天刪除</Li>
              <Li>帳號刪除：刪除請求後 30 日內全數清除</Li>
            </ul>
          </Section>

          <Section title="您的權利（個資法）">
            <p>依《個人資料保護法》，您有權：</p>
            <ul className="space-y-1.5 mt-2">
              <Li>查詢您的個人資料</Li>
              <Li>請求更正錯誤資料</Li>
              <Li>請求刪除您的資料</Li>
              <Li>撤回同意</Li>
            </ul>
            <p className="mt-2">
              請來信 <a href="mailto:contact@receiptbridge.app" className="text-[#0F766E] hover:underline">contact@receiptbridge.app</a> 或在「設定」中點選「刪除帳號」。
            </p>
          </Section>

          <Section title="跨境資料傳輸">
            <p>資料處理地點包含亞太地區（Supabase 孟買區）及美國（OpenAI、Vercel）。使用本服務即表示您同意此跨境傳輸。</p>
          </Section>

          <Section title="資安措施">
            <p>本服務採用業界標準：HTTPS 加密連線、所有資料表啟用 Row-Level Security、檔案私有儲存、API 金鑰不暴露於前端。</p>
          </Section>

          <Section title="聯絡方式">
            <p>隱私權相關問題：<a href="mailto:contact@receiptbridge.app" className="text-[#0F766E] hover:underline">contact@receiptbridge.app</a></p>
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
