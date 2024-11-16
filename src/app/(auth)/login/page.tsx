'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/client/authForm'
import { signIn } from '@/lib/actions/auth'
import { toast } from '@/components/ui/toast'

// ログインページコンポーネント
export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // ログイン処理のハンドラー
  const handleLogin = useCallback(async (data: {
    email: string
    password: string
    role: 'adventurer' | 'client'
  }) => {
    try {
      setIsLoading(true)
      const result = await signIn(data)
      
      if (result.error) {
        toast({
          title: 'ログインエラー',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      // ログイン成功時の処理
      toast({
        title: 'ログイン成功',
        description: 'クエストボードへようこそ！',
        variant: 'success'
      })

      // ダッシュボードへリダイレクト
      router.push('/protected/dashboard')

    } catch (error) {
      toast({
        title: 'エラーが発生しました',
        description: '再度お試しください',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-md w-full space-y-8">
        {/* ヘッダー部分 */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            クエストボードへようこそ
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            冒険を始める準備はできていますか？
          </p>
        </div>

        {/* 認証フォーム */}
        <AuthForm
          mode="login"
          onSubmit={handleLogin}
          isLoading={isLoading}
        />

        {/* フッター部分 */}
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