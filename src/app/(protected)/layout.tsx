import { ReactNode } from 'react'
import AuthGuard from '@/components/auth/server/authGuard'
import Header from '@/components/layout/server/header'

interface ProtectedLayoutProps {
  children: ReactNode
}

/**
 * 保護されたページのレイアウトコンポーネント
 * - ユーザー認証の確認
 * - 共通ヘッダーの表示
 * - 子コンポーネントのレンダリング
 */
export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}

// メタデータの設定
export const metadata = {
  title: 'クエストボード | メンバーエリア',
  description: 'ギルドメンバー専用のクエスト管理エリアです',
}

// ページの静的生成を無効化し、サーバーサイドレンダリングを強制
export const dynamic = 'force-dynamic'

// レイアウトの再検証間隔を設定
export const revalidate = 0