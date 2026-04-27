import type { Metadata, Viewport } from 'next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: '發票橋 ReceiptBridge - 把發票交給會計師，前所未有的輕鬆',
  description: '手機拍照上傳，AI 自動辨識 + 台灣專屬驗證，一鍵輸出會計師要的 Excel 格式。專為台灣中小企業設計。',
  keywords: ['發票', '會計', '統編', 'AI辨識', '台灣', '中小企業', '記帳'],
}

export const viewport: Viewport = {
  themeColor: '#0F766E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
