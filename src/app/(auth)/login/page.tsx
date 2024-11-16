'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthForm from '@/components/auth/client/authForm'

// ログインページコンポーネント
export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // ログイン処理のハンドラー
  const handleLogin = useCallback(async (data: {
    email: string
    password: string
    role: 'ADVENTURER' | 'CLIENT'
  }) => {
    try {
      setIsLoading(true)
      // モックとして成功を仮定
      const result = { error: null }

      if (result.error) {
        return
      }

      // ダッシュボードへリダイレクト
      const dashboardUrl = process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
        : '/dashboard'
      router.push(dashboardUrl)

    } catch (error) {
      // エラーハンドリング
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            クエストボードへようこそ
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            冒険を始める準備はできていますか？
          </p>
        </div>

        <AuthForm
          mode="login"
          onSubmit={handleLogin}
          isLoading={isLoading}
        />

        <div className="text-center">
          <p className="mt-2 text-sm text-gray-400">
            アカウントをお持ちでない方は{' '}
            <Link
              href="/signup"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              こちら
            </Link>
            から登録できます
          </p>
        </div>
      </div>
    </div>
  )
}