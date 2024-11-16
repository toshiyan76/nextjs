// frontend/components/auth/server/authGuard.tsx

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { type ReactNode } from 'react';
import { type Database } from '@/types/supabase';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'ADVENTURER' | 'CLIENT' | 'ADMIN';
}

/**
 * サーバーサイドの認証ガードコンポーネント
 * - セッション確認
 * - ロールベースのアクセス制御
 * - 未認証ユーザーのリダイレクト
 */
export async function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const supabase = createServerComponentClient<Database>({ cookies });

  // セッションの取得
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  // セッションエラーの処理
  if (sessionError) {
    console.error('Session error:', sessionError);
    redirect('/auth/login?error=session_error');
  }

  // 未認証ユーザーのリダイレクト
  if (!session) {
    redirect('/auth/login?error=unauthorized');
  }

  // ユーザー情報の取得
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role, level')
    .eq('id', session.user.id)
    .single();

  // ユーザーデータエラーの処理
  if (userError) {
    console.error('User data error:', userError);
    redirect('/auth/login?error=user_data_error');
  }

  // ロールベースのアクセス制御
  if (requiredRole && userData?.role !== requiredRole) {
    redirect('/dashboard?error=insufficient_permissions');
  }

  // セッションの有効期限チェック
  const sessionExpiry = new Date(session.expires_at * 1000);
  const now = new Date();
  const timeUntilExpiry = sessionExpiry.getTime() - now.getTime();

  // セッションの更新が必要な場合（残り30分以下）
  if (timeUntilExpiry < 30 * 60 * 1000) {
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.error('Session refresh error:', refreshError);
      redirect('/auth/login?error=session_refresh_error');
    }
  }

  // ギルドメンバーシップの確認（レベル1以上が必要）
  if (userData?.level < 1) {
    redirect('/onboarding?error=guild_membership_required');
  }

  return (
    <>
      {/* セッション情報をメタデータとして埋め込み */}
      <script
        id="auth-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            userId: session.user.id,
            role: userData.role,
            level: userData.level,
          }),
        }}
      />
      {children}
    </>
  );
}

/**
 * 認証エラーの種類を定義
 */
export const AuthErrors = {
  SESSION_ERROR: 'session_error',
  UNAUTHORIZED: 'unauthorized',
  USER_DATA_ERROR: 'user_data_error',
  INSUFFICIENT_PERMISSIONS: 'insufficient_permissions',
  SESSION_REFRESH_ERROR: 'session_refresh_error',
  GUILD_MEMBERSHIP_REQUIRED: 'guild_membership_required',
} as const;

export default AuthGuard;
// pages/protected/dashboard/page.tsx
export default async function DashboardPage() {
  return (
    <AuthGuard requiredRole="ADVENTURER">
      <Dashboard />
    </AuthGuard>
  );
}