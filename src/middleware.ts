import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 保護されたルートのパターンを定義
const PROTECTED_ROUTES = [
  '/protected',
  '/dashboard',
  '/quests/new',
  '/quests/edit',
  '/profile',
]

// 認証が不要なパブリックルートのパターンを定義
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/signup',
  '/board',
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // // セッションの取得と検証
  // const {
  //   data: { session },
  //   error: sessionError,
  // } = await supabase.auth.getSession()

  // 現在のパス
  const path = req.nextUrl.pathname

  // // セッションエラーのハンドリング
  // if (sessionError) {
  //   console.error('Session error:', sessionError)
  //   return NextResponse.redirect(new URL('/auth/login', req.url))
  // }

  // // 保護されたルートへのアクセスチェック
  // const isProtectedRoute = PROTECTED_ROUTES.some(route => 
  //   path.startsWith(route)
  // )

  // // 認証済みユーザーの認証ページへのアクセス制限
  // const isAuthRoute = PUBLIC_ROUTES.some(route => 
  //   path.startsWith(route)
  // )

  // // 保護されたルートに未認証でアクセスした場合
  // if (isProtectedRoute && !session) {
  //   // ログインページにリダイレクト
  //   const redirectUrl = new URL('/auth/login', req.url)
  //   redirectUrl.searchParams.set('redirect', path)
  //   return NextResponse.redirect(redirectUrl)
  // }

  // // 認証済みユーザーが認証ページにアクセスした場合
  // if (isAuthRoute && session) {
  //   // ダッシュボードにリダイレクト
  //   return NextResponse.redirect(new URL('/dashboard', req.url))
  // }

  // レスポンスヘッダーにセキュリティ関連の設定を追加
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  )

  // 環境変数を使用してリダイレクトURLを設定
  const loginUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`
    : '/auth/login' // 編集3
  // 他のURLも同様に置き換え可能

  return response
}

// ミドルウェアを適用するパスを設定
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}