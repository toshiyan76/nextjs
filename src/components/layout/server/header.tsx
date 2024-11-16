'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserMenu } from '../client/userMenu';
import { NavigationMenu } from '../client/navigationMenu';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // 通知のモックデータ（実際の実装では API から取得）
  const notifications: Notification[] = [
    { id: '1', message: '新しいクエストが追加されました', isRead: false },
    { id: '2', message: 'クエストが承認されました', isRead: true },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/board?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-slate-900 text-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className="text-xl font-bold">
            Quest Board
          </Link>

          {/* デスクトップナビゲーション */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu />
            
            {/* 検索フォーム */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                placeholder="クエストを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* 通知ボタン */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-slate-800 rounded-full"
              >
                <Bell className="h-5 w-5" />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                )}
              </button>

              {/* 通知ドロップダウン */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-lg py-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-2 hover:bg-slate-700 cursor-pointer ${
                        !notification.isRead ? 'font-bold' : ''
                      }`}
                    >
                      {notification.message}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ユーザーメニュー */}
            <UserMenu />
          </div>

          {/* モバイルメニューボタン */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <NavigationMenu />
            <form onSubmit={handleSearch} className="mt-4">
              <input
                type="search"
                placeholder="クエストを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 rounded-full py-2 px-4 text-sm"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}