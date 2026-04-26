import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '隱私權政策 Privacy Policy — ReceiptBridge',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-[#0F766E]">發票橋 ReceiptBridge</Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">服務條款 Terms</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-neutral dark:prose-invert max-w-none">

          <h1>Privacy Policy / 隱私權政策</h1>
          <p className="text-muted-foreground text-sm">Last updated / 最後更新: April 27, 2026</p>

          {/* English */}
          <h2>English</h2>

          <h3>What we collect</h3>
          <ul>
            <li>Email address (for login)</li>
            <li>Company information you enter in Settings (name, UBN, accountant info)</li>
            <li>Receipt images you upload</li>
            <li>Data extracted from receipts (vendor, amount, date, etc.)</li>
          </ul>

          <h3>Why we collect it</h3>
          <p>To provide the Service: store your receipts, extract data, generate exports.</p>

          <h3>Third-party processors</h3>
          <ul>
            <li><strong>Supabase</strong> — database and file storage (data hosted in Mumbai region)</li>
            <li><strong>OpenAI</strong> — AI extraction (receipt images sent to OpenAI's API; per OpenAI's API terms, data is not used to train models and is retained for up to 30 days for abuse monitoring)</li>
            <li><strong>Vercel</strong> — hosting and serverless infrastructure</li>
            <li><strong>Stripe</strong> — payment processing (when paid plans are introduced)</li>
          </ul>

          <h3>Data retention</h3>
          <ul>
            <li>Active accounts: data retained while your account is active</li>
            <li>Receipt images: deleted 90 days after upload</li>
            <li>Closed accounts: all data deleted within 30 days of account deletion request</li>
          </ul>

          <h3>Your rights (PDPA)</h3>
          <p>Under Taiwan's Personal Data Protection Act, you may:</p>
          <ul>
            <li>Request access to your data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent</li>
          </ul>
          <p>
            To exercise these rights, email <a href="mailto:contact@receiptbridge.app">contact@receiptbridge.app</a> or use the Delete Account button in Settings.
          </p>

          <h3>Cross-border data transfer</h3>
          <p>
            Data is processed in the Asia-Pacific region (Supabase Mumbai) and the United States (OpenAI, Vercel).
            By using the Service, you consent to this transfer.
          </p>

          <h3>Security</h3>
          <p>
            We use industry-standard practices: encrypted connections (HTTPS), row-level security on all database tables,
            private file storage, no API keys in client code.
          </p>

          <h3>Contact</h3>
          <p>Privacy questions: <a href="mailto:contact@receiptbridge.app">contact@receiptbridge.app</a></p>

          <hr className="my-10" />

          {/* 繁體中文 */}
          <h2>繁體中文</h2>

          <h3>我們收集的資料</h3>
          <ul>
            <li>電子郵件（用於登入）</li>
            <li>您在「設定」中填寫的公司資訊（公司名稱、統編、會計師資訊）</li>
            <li>您上傳的發票圖像</li>
            <li>從發票中辨識出的資料（廠商、金額、日期等）</li>
          </ul>

          <h3>收集目的</h3>
          <p>為提供本服務：儲存您的發票、辨識資料、產生匯出檔案。</p>

          <h3>第三方處理者</h3>
          <ul>
            <li><strong>Supabase</strong> — 資料庫與檔案儲存（資料存放於孟買區域）</li>
            <li><strong>OpenAI</strong> — AI 辨識（發票圖像會傳送至 OpenAI API；依 OpenAI API 條款，資料不用於訓練模型，僅保留至多 30 天供濫用監測）</li>
            <li><strong>Vercel</strong> — 網站代管與伺服器</li>
            <li><strong>Stripe</strong> — 金流處理（付費方案啟用時）</li>
          </ul>

          <h3>資料保存期限</h3>
          <ul>
            <li>帳號使用期間：資料持續保存</li>
            <li>發票圖像：上傳後 90 天刪除</li>
            <li>帳號刪除：刪除請求後 30 日內全數清除</li>
          </ul>

          <h3>您的權利（個資法）</h3>
          <p>依《個人資料保護法》，您有權：</p>
          <ul>
            <li>查詢您的個人資料</li>
            <li>請求更正錯誤資料</li>
            <li>請求刪除您的資料</li>
            <li>撤回同意</li>
          </ul>
          <p>
            如需行使上述權利，請來信 <a href="mailto:contact@receiptbridge.app">contact@receiptbridge.app</a> 或在「設定」中點選「刪除帳號」。
          </p>

          <h3>跨境資料傳輸</h3>
          <p>
            資料處理地點包含亞太地區（Supabase 孟買區）及美國（OpenAI、Vercel）。
            使用本服務即表示您同意此跨境傳輸。
          </p>

          <h3>資安措施</h3>
          <p>
            本服務採用業界標準：HTTPS 加密連線、所有資料表啟用 Row-Level Security、
            檔案私有儲存、API 金鑰不暴露於前端。
          </p>

          <h3>聯絡方式</h3>
          <p>隱私權相關問題：<a href="mailto:contact@receiptbridge.app">contact@receiptbridge.app</a></p>

        </div>
      </main>
    </div>
  )
}
