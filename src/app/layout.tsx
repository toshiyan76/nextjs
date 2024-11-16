import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/server/header'
import Footer from '@/components/layout/server/footer'
import { ThemeProvider } from '@/components/theme-provider'

// フォントの設定
const inter = Inter({ subsets: ['latin'] })

// メタデータの設定
export const metadata: Metadata = {
  title: 'クエストボード - 冒険者ギルド',
  description: '冒険者とクライアントをつなぐクエストボードプラットフォーム',
  keywords: ['クエスト', '冒険者', 'ギルド', 'フリーランス', '仕事'],
  authors: [{ name: 'Quest Board Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1a1a1a',
}

// ルートレイアウトの型定義
interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            {/* ヘッダー */}
            <Header />
            
            {/* メインコンテンツ */}
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            
            {/* フッター */}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

// 動的レンダリングの設定
export const dynamic = 'force-dynamic'

// キャッシュの設定
export const revalidate = 0

// ランタイムの設定
export const runtime = 'nodejs'