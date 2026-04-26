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
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">服務條款</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-neutral dark:prose-invert max-w-none">

          {/* zh-TW */}
          <h1>隱私權政策</h1>
          <p className="text-muted-foreground text-sm">最後更新：2026 年 4 月 · Last updated: April 2026</p>

          <p>
            發票橋（ReceiptBridge，以下簡稱「本服務」）重視您的隱私。本政策說明我們收集哪些資料、如何使用，以及您的權利。
          </p>

          <h2>一、我們收集的資料</h2>
          <ul>
            <li><strong>帳號資料：</strong>您的電子郵件地址（用於 Magic Link 登入）。</li>
            <li><strong>公司資料：</strong>您自願填寫的公司名稱、統編、地址、會計師資訊。</li>
            <li><strong>發票圖片：</strong>您上傳的發票或收據圖片，儲存於加密的私有儲存空間。</li>
            <li><strong>辨識結果：</strong>AI 從圖片中擷取的結構化資料（廠商名稱、金額、發票號碼等）。</li>
            <li><strong>使用紀錄：</strong>上傳時間、操作紀錄，用於除錯與服務改善。</li>
          </ul>

          <h2>二、我們如何使用您的資料</h2>
          <ul>
            <li>提供發票辨識、驗證、匯出功能。</li>
            <li>發送登入連結（Magic Link）。</li>
            <li>改善服務品質與辨識準確率。</li>
            <li>我們<strong>不會</strong>出售、出租或以任何方式與第三方共享您的個人資料用於行銷目的。</li>
          </ul>

          <h2>三、第三方服務</h2>
          <p>本服務使用以下第三方服務處理您的資料：</p>
          <ul>
            <li>
              <strong>OpenAI：</strong>發票圖片會透過 API 傳送至 OpenAI 進行 AI 辨識。
              依據 OpenAI API 服務條款，API 傳入的資料不會用於訓練模型。
              詳見 <a href="https://openai.com/policies/api-data-usage-policies" target="_blank" rel="noreferrer">OpenAI API 資料使用政策</a>。
            </li>
            <li>
              <strong>Supabase：</strong>資料庫與檔案儲存服務，通過 SOC 2 Type II 認證。
            </li>
            <li>
              <strong>Vercel：</strong>網頁伺服器託管，通過 SOC 2 Type II 認證。
            </li>
            <li>
              <strong>經濟部商業司 API：</strong>統編驗證時會查詢政府公開 API，僅傳送統編號碼，不含其他個人資料。
            </li>
          </ul>

          <h2>四、跨境資料傳輸</h2>
          <p>
            本服務的伺服器主要位於亞太地區（AWS 孟買節點）。AI 辨識功能需將圖片傳輸至 OpenAI 位於美國的伺服器進行處理。
            使用本服務即表示您同意此跨境傳輸。
          </p>

          <h2>五、資料保存期限</h2>
          <ul>
            <li>帳號資料與發票資料：保存至您主動刪除帳號為止。</li>
            <li>帳號刪除後：所有個人資料於 30 日內完全刪除。</li>
          </ul>

          <h2>六、您的權利（個資法）</h2>
          <p>依據《個人資料保護法》，您有權：</p>
          <ul>
            <li>查閱您的個人資料</li>
            <li>要求更正不正確的資料</li>
            <li>要求刪除您的帳號及所有相關資料</li>
            <li>了解我們如何處理您的資料</li>
          </ul>
          <p>請寄信至 <a href="mailto:contact@receiptbridge.app">contact@receiptbridge.app</a> 提出請求，我們將於 15 個工作日內回覆。</p>

          <h2>七、資料安全</h2>
          <ul>
            <li>所有資料傳輸採用 HTTPS 加密。</li>
            <li>發票圖片儲存於私有儲存空間，不可公開存取。</li>
            <li>資料庫啟用行列層級安全性（Row Level Security），每位使用者僅能存取自己的資料。</li>
          </ul>

          <h2>八、Cookie</h2>
          <p>本服務僅使用功能性 Cookie（語系設定、登入 Session），不使用任何追蹤或廣告 Cookie。</p>

          <h2>九、政策異動</h2>
          <p>如有重大異動，我們將以電子郵件通知您，並更新本頁面頂部的日期。</p>

          <h2>十、聯絡我們</h2>
          <p>
            如有任何疑問，請聯絡：<br />
            <a href="mailto:contact@receiptbridge.app">contact@receiptbridge.app</a>
          </p>

          <hr className="my-12" />

          {/* English */}
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: April 2026</p>

          <p>
            ReceiptBridge ("the Service") is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.
          </p>

          <h2>1. Data We Collect</h2>
          <ul>
            <li><strong>Account data:</strong> Your email address (used for Magic Link login).</li>
            <li><strong>Company data:</strong> Company name, UBN, address, and accountant info you voluntarily provide.</li>
            <li><strong>Receipt images:</strong> Images you upload, stored in encrypted private storage.</li>
            <li><strong>Extracted data:</strong> Structured data extracted by AI (vendor name, amounts, invoice numbers, etc.).</li>
            <li><strong>Usage logs:</strong> Upload timestamps and operation logs used for debugging and service improvement.</li>
          </ul>

          <h2>2. How We Use Your Data</h2>
          <ul>
            <li>To provide receipt extraction, validation, and export features.</li>
            <li>To send login links (Magic Link).</li>
            <li>To improve service quality and extraction accuracy.</li>
            <li>We do <strong>not</strong> sell, rent, or share your personal data with third parties for marketing purposes.</li>
          </ul>

          <h2>3. Third-Party Services</h2>
          <ul>
            <li>
              <strong>OpenAI:</strong> Receipt images are sent to OpenAI's API for AI extraction.
              Per OpenAI's API usage policies, data submitted via API is not used to train models.
              See <a href="https://openai.com/policies/api-data-usage-policies" target="_blank" rel="noreferrer">OpenAI API Data Usage Policy</a>.
            </li>
            <li><strong>Supabase:</strong> Database and file storage, SOC 2 Type II certified.</li>
            <li><strong>Vercel:</strong> Web hosting, SOC 2 Type II certified.</li>
            <li><strong>Taiwan MOEA API:</strong> UBN validation queries the government's public API. Only the UBN number is transmitted — no personal data.</li>
          </ul>

          <h2>4. Cross-Border Data Transfer</h2>
          <p>
            Our servers are primarily located in the Asia-Pacific region (AWS Mumbai). AI extraction requires transmitting images to OpenAI's servers in the United States. By using the Service, you consent to this transfer.
          </p>

          <h2>5. Data Retention</h2>
          <ul>
            <li>Account and receipt data: retained until you delete your account.</li>
            <li>After account deletion: all personal data deleted within 30 days.</li>
          </ul>

          <h2>6. Your Rights</h2>
          <p>Under Taiwan's Personal Data Protection Act, you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and all related data</li>
            <li>Understand how we process your data</li>
          </ul>
          <p>Email <a href="mailto:contact@receiptbridge.app">contact@receiptbridge.app</a> to submit a request. We will respond within 15 business days.</p>

          <h2>7. Security</h2>
          <ul>
            <li>All data transmission is HTTPS encrypted.</li>
            <li>Receipt images are stored in private storage, not publicly accessible.</li>
            <li>Database Row Level Security ensures each user can only access their own data.</li>
          </ul>

          <h2>8. Cookies</h2>
          <p>We use only functional cookies (language preference, login session). No tracking or advertising cookies.</p>

          <h2>9. Policy Changes</h2>
          <p>For significant changes, we will notify you by email and update the date at the top of this page.</p>

          <h2>10. Contact</h2>
          <p>
            For any questions:<br />
            <a href="mailto:contact@receiptbridge.app">contact@receiptbridge.app</a>
          </p>

        </div>
      </main>
    </div>
  )
}
