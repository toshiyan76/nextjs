// /root/babel_generated/user_6cbb1bfd-c9ab-47fd-ba08-6892a1ae3aa8/frontend/app/(auth)/layout.tsx

import { ReactNode } from 'react';
import Header from '@/components/layout/server/header';
import Footer from '@/components/layout/server/footer';
import { Metadata } from 'next';

// メタデータの定義
export const metadata: Metadata = {
  title: 'Quest Board - Authentication',
  description: 'Adventure awaits! Login or sign up to join the quest board.',
};

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * 認証関連ページのレイアウトコンポーネント
 * ギルドホール風のデザインを適用し、認証関連のページをラップします
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
      <Header variant="auth" />
      
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* ギルドホール風装飾 */}
          <div className="bg-slate-700 rounded-lg shadow-xl border-2 border-amber-600 p-8">
            <div className="relative">
              {/* 装飾的な要素 */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-slate-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              
              {/* メインコンテンツ */}
              <div className="mt-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}