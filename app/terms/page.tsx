import Link from 'next/link'
import type { Metadata } from 'next'
import { Navbar } from '@/components/app/navbar'
import { Footer } from '@/components/app/footer'

export const metadata: Metadata = {
  title: '服務條款 Terms of Service — ReceiptBridge',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">{title}</h2>
      <div className="space-y-2 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <span>服務條款 Terms of Service</span>
            <span>·</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">隱私權政策 Privacy Policy</Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Terms of Service / 服務條款</h1>
          <p className="text-sm text-muted-foreground">Last updated / 最後更新: April 27, 2026</p>
        </div>

        {/* English */}
        <div className="space-y-8 mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-sm font-medium">English</div>

          <p className="text-muted-foreground leading-relaxed">By using ReceiptBridge ("the Service"), you agree to these terms.</p>

          <Section title="1. What the Service Does">
            <p>ReceiptBridge uses AI to extract data from receipt images and export it as spreadsheet files for your accounting use.</p>
          </Section>

          <Section title="2. Accuracy Disclaimer">
            <p>
              ReceiptBridge uses AI to extract data from receipt images. Extracted data may contain errors.
              You are solely responsible for verifying every field before using the data for accounting, tax filing, or any other purpose.
              The Service displays a review screen specifically for this verification.
            </p>
          </Section>

          <Section title="3. Not Professional Advice">
            <p>ReceiptBridge is a software tool, not a tax, accounting, or legal advisor. Consult qualified professionals for accounting and tax decisions.</p>
          </Section>

          <Section title="4. Limitation of Liability">
            <p>
              Our total liability for any claim arising from your use of the Service is limited to the fees you paid us in the 12 months prior to the claim.
              We are not liable for indirect, incidental, or consequential damages, including but not limited to lost profits, tax penalties, or audit costs arising from incorrect extracted data.
            </p>
          </Section>

          <Section title="5. Acceptable Use">
            <p>You agree not to upload illegal content, attempt to breach security, or use the Service to process data you do not have rights to.</p>
          </Section>

          <Section title="6. Account Termination">
            <p>You may delete your account anytime in Settings. We may suspend accounts that violate these terms.</p>
          </Section>

          <Section title="7. Changes">
            <p>We may update these terms. Continued use after changes constitutes acceptance.</p>
          </Section>

          <Section title="8. Contact">
            <p>Questions: <a href="mailto:contact@receiptbridge.app" className="text-[#0F766E] hover:underline">contact@receiptbridge.app</a></p>
          </Section>
        </div>

        <div className="border-t border-border my-10" />

        {/* 繁體中文 */}
        <div className="space-y-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-sm font-medium">繁體中文</div>

          <p className="text-muted-foreground leading-relaxed">使用 ReceiptBridge（「本服務」）即表示您同意以下條款。</p>

          <Section title="1. 服務內容">
            <p>ReceiptBridge 使用 AI 技術辨識發票圖像中的資料，並匯出為試算表檔案供會計使用。</p>
          </Section>

          <Section title="2. 辨識準確性免責聲明">
            <p>
              本服務使用 AI 辨識發票資料，辨識結果可能有誤。
              您須自行確認每一欄位後，方可用於記帳、報稅或其他用途。
              本服務提供確認頁面供您檢查。
            </p>
          </Section>

          <Section title="3. 非專業建議">
            <p>ReceiptBridge 為軟體工具，並非稅務、會計或法律顧問。會計及稅務決策請諮詢專業人員。</p>
          </Section>

          <Section title="4. 責任限制">
            <p>
              本服務對任何因使用本服務而產生之請求，責任上限為請求發生前 12 個月內您支付之費用總額。
              本服務不負責間接、附帶或衍生損害，包含但不限於利潤損失、稅務罰鍰、或因辨識錯誤造成之查核成本。
            </p>
          </Section>

          <Section title="5. 使用規範">
            <p>您同意不上傳違法內容、不嘗試破壞系統安全、不處理您無權處理的資料。</p>
          </Section>

          <Section title="6. 帳號終止">
            <p>您可隨時於「設定」中刪除帳號。違反本條款者，本服務得暫停其帳號。</p>
          </Section>

          <Section title="7. 條款變更">
            <p>本條款可能更新。變更後繼續使用即視為同意。</p>
          </Section>

          <Section title="8. 聯絡方式">
            <p>如有疑問請聯絡：<a href="mailto:contact@receiptbridge.app" className="text-[#0F766E] hover:underline">contact@receiptbridge.app</a></p>
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
