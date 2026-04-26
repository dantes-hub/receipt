import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '服務條款 Terms of Service — ReceiptBridge',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-[#0F766E]">發票橋 ReceiptBridge</Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">隱私權政策 Privacy Policy</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-neutral dark:prose-invert max-w-none">

          <h1>Terms of Service / 服務條款</h1>
          <p className="text-muted-foreground text-sm">Last updated / 最後更新: April 27, 2026</p>

          {/* English */}
          <h2>English</h2>

          <p>By using ReceiptBridge ("the Service"), you agree to these terms.</p>

          <h3>1. What the Service Does</h3>
          <p>ReceiptBridge uses AI to extract data from receipt images and export it as CSV files for your accounting use.</p>

          <h3>2. Accuracy Disclaimer</h3>
          <p>
            ReceiptBridge uses AI to extract data from receipt images. Extracted data may contain errors.
            You are solely responsible for verifying every field before using the data for accounting, tax filing, or any other purpose.
            The Service displays a review screen specifically for this verification.
          </p>

          <h3>3. Not Professional Advice</h3>
          <p>ReceiptBridge is a software tool, not a tax, accounting, or legal advisor. Consult qualified professionals for accounting and tax decisions.</p>

          <h3>4. Limitation of Liability</h3>
          <p>
            Our total liability for any claim arising from your use of the Service is limited to the fees you paid us in the 12 months prior to the claim.
            We are not liable for indirect, incidental, or consequential damages, including but not limited to lost profits, tax penalties, or audit costs arising from incorrect extracted data.
          </p>

          <h3>5. Acceptable Use</h3>
          <p>You agree not to upload illegal content, attempt to breach security, or use the Service to process data you do not have rights to.</p>

          <h3>6. Account Termination</h3>
          <p>You may delete your account anytime in Settings. We may suspend accounts that violate these terms.</p>

          <h3>7. Changes</h3>
          <p>We may update these terms. Continued use after changes constitutes acceptance.</p>

          <h3>8. Contact</h3>
          <p>Questions: <a href="mailto:contact@receiptbridge.app">contact@receiptbridge.app</a></p>

          <hr className="my-10" />

          {/* 繁體中文 */}
          <h2>繁體中文</h2>

          <p>使用 ReceiptBridge（「本服務」）即表示您同意以下條款。</p>

          <h3>1. 服務內容</h3>
          <p>ReceiptBridge 使用 AI 技術辨識發票圖像中的資料，並匯出為 CSV 檔案供會計使用。</p>

          <h3>2. 辨識準確性免責聲明</h3>
          <p>
            本服務使用 AI 辨識發票資料，辨識結果可能有誤。
            您須自行確認每一欄位後，方可用於記帳、報稅或其他用途。
            本服務提供確認頁面供您檢查。
          </p>

          <h3>3. 非專業建議</h3>
          <p>ReceiptBridge 為軟體工具，並非稅務、會計或法律顧問。會計及稅務決策請諮詢專業人員。</p>

          <h3>4. 責任限制</h3>
          <p>
            本服務對任何因使用本服務而產生之請求，責任上限為請求發生前 12 個月內您支付之費用總額。
            本服務不負責間接、附帶或衍生損害，包含但不限於利潤損失、稅務罰鍰、或因辨識錯誤造成之查核成本。
          </p>

          <h3>5. 使用規範</h3>
          <p>您同意不上傳違法內容、不嘗試破壞系統安全、不處理您無權處理的資料。</p>

          <h3>6. 帳號終止</h3>
          <p>您可隨時於「設定」中刪除帳號。違反本條款者，本服務得暫停其帳號。</p>

          <h3>7. 條款變更</h3>
          <p>本條款可能更新。變更後繼續使用即視為同意。</p>

          <h3>8. 聯絡方式</h3>
          <p>如有疑問請聯絡：<a href="mailto:contact@receiptbridge.app">contact@receiptbridge.app</a></p>

        </div>
      </main>
    </div>
  )
}
