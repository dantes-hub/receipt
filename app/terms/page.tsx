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
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">隱私權政策</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-neutral dark:prose-invert max-w-none">

          {/* zh-TW */}
          <h1>服務條款</h1>
          <p className="text-muted-foreground text-sm">最後更新：2026 年 4 月 · Last updated: April 2026</p>

          <p>
            請在使用發票橋（ReceiptBridge）服務前詳閱本條款。使用本服務即表示您同意以下條款。
          </p>

          <h2>一、服務說明</h2>
          <p>
            發票橋提供 AI 發票辨識、驗證與匯出功能，協助台灣中小企業整理發票資料。
            本服務為輔助工具，不構成會計、稅務或法律建議。
          </p>

          <h2>二、帳號與使用</h2>
          <ul>
            <li>您須提供有效的電子郵件地址以使用本服務。</li>
            <li>您有責任維護帳號安全，不得將帳號分享給他人使用。</li>
            <li>您上傳的內容必須為您有權處理的合法文件。</li>
            <li>禁止使用本服務進行任何非法活動，或上傳與發票、收據無關的內容。</li>
          </ul>

          <h2>三、AI 辨識準確性免責聲明（重要）</h2>
          <p>
            本服務使用 AI 技術從發票圖片中辨識資料。AI 辨識<strong>可能包含錯誤</strong>，包括但不限於：
            金額錯誤、統編錯誤、日期錯誤、廠商名稱錯誤。
          </p>
          <p>
            <strong>您有責任在確認並匯出前，逐一核對所有欄位的正確性。</strong>
            本服務已提供每個欄位的辨識信心度與驗證結果供您參考。
          </p>
          <p>
            對於因 AI 辨識錯誤導致的任何損失，包括但不限於報稅錯誤、會計錯誤、罰款或其他財務損失，
            發票橋概不負責。
          </p>

          <h2>四、不構成專業建議</h2>
          <p>
            本服務為軟體工具，不提供稅務、會計或法律建議。
            任何涉及稅務申報或財務決策，請諮詢合格的記帳士、會計師或法律專業人士。
          </p>

          <h2>五、服務可用性</h2>
          <p>
            我們盡力維持服務穩定，但不保證 100% 的可用性。
            本服務可能因維護、升級或不可抗力因素而暫時中斷。
            我們不因服務中斷造成的損失承擔責任。
          </p>

          <h2>六、責任限制</h2>
          <p>
            在法律允許的最大範圍內，發票橋對任何索賠的總賠償責任，
            以您在索賠發生前 12 個月內支付給本服務的金額為上限。
            試用期間（零付費）的使用者，本服務的最高賠償責任為新台幣零元。
          </p>

          <h2>七、智慧財產權</h2>
          <p>
            您上傳的發票圖片及相關資料，其所有權歸您所有。
            本服務的軟體、設計、品牌及文字內容，其智慧財產權歸發票橋所有。
          </p>

          <h2>八、終止服務</h2>
          <p>
            您可隨時於「設定 → 危險操作區」刪除帳號，終止使用本服務。
            如發現您違反本條款，我們保留暫停或終止您帳號的權利。
          </p>

          <h2>九、條款異動</h2>
          <p>
            本條款如有重大異動，我們將以電子郵件提前通知您。
            繼續使用本服務即視為接受修訂後的條款。
          </p>

          <h2>十、準據法</h2>
          <p>本條款依中華民國法律解釋及執行。</p>

          <h2>十一、聯絡我們</h2>
          <p>
            如有任何問題：<br />
            <a href="mailto:contact@receiptbridge.app">contact@receiptbridge.app</a>
          </p>

          <hr className="my-12" />

          {/* English */}
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Last updated: April 2026</p>

          <p>
            Please read these Terms carefully before using ReceiptBridge. By using the Service, you agree to these Terms.
          </p>

          <h2>1. Service Description</h2>
          <p>
            ReceiptBridge provides AI-powered receipt extraction, validation, and export features to help Taiwan SMEs manage receipt data.
            The Service is an assistive tool and does not constitute accounting, tax, or legal advice.
          </p>

          <h2>2. Account and Use</h2>
          <ul>
            <li>You must provide a valid email address to use the Service.</li>
            <li>You are responsible for maintaining account security and must not share your account.</li>
            <li>Content you upload must be documents you are legally authorized to process.</li>
            <li>You may not use the Service for any illegal purpose or upload content unrelated to receipts or invoices.</li>
          </ul>

          <h2>3. AI Accuracy Disclaimer (Important)</h2>
          <p>
            The Service uses AI to extract data from receipt images. AI extraction <strong>may contain errors</strong>, including but not limited to: incorrect amounts, incorrect UBN, incorrect dates, and incorrect vendor names.
          </p>
          <p>
            <strong>You are solely responsible for verifying the accuracy of all extracted fields before confirming and exporting.</strong>
            The Service provides confidence scores and validation results for each field to assist your review.
          </p>
          <p>
            ReceiptBridge is not liable for any loss arising from AI extraction errors, including but not limited to tax filing errors, accounting errors, penalties, or other financial losses.
          </p>

          <h2>4. No Professional Advice</h2>
          <p>
            The Service is a software tool. It does not provide tax, accounting, or legal advice.
            For any tax filing or financial decisions, please consult a qualified accountant or legal professional.
          </p>

          <h2>5. Service Availability</h2>
          <p>
            We strive to maintain a stable service but do not guarantee 100% uptime.
            The Service may be temporarily unavailable due to maintenance, upgrades, or force majeure.
            We are not liable for losses caused by service interruptions.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, ReceiptBridge's total liability for any claim is limited to the amount you paid for the Service in the 12 months preceding the claim.
            For users during the free trial period (zero payment), our maximum liability is NT$0.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            You retain ownership of all receipt images and data you upload.
            The software, design, brand, and written content of the Service are owned by ReceiptBridge.
          </p>

          <h2>8. Termination</h2>
          <p>
            You may delete your account at any time via Settings → Danger Zone.
            We reserve the right to suspend or terminate accounts that violate these Terms.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We will notify you by email of any material changes before they take effect.
            Continued use of the Service constitutes acceptance of the revised Terms.
          </p>

          <h2>10. Governing Law</h2>
          <p>These Terms are governed by and construed in accordance with the laws of the Republic of China (Taiwan).</p>

          <h2>11. Contact</h2>
          <p>
            For any questions:<br />
            <a href="mailto:contact@receiptbridge.app">contact@receiptbridge.app</a>
          </p>

        </div>
      </main>
    </div>
  )
}
