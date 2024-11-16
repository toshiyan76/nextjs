'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dropdown } from '@/components/ui/dropdown';
import { Progress } from '@/components/ui/progress';
import { Shield, Sword, LogOut, User as UserIcon } from 'lucide-react';
import { useSupabase } from '@/lib/supabase/client';

interface UserMenuProps {
  user: User;
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { supabase } = useSupabase();

  // レベルアップに必要な経験値を計算
  const experienceToNextLevel = user.level * 100;
  const experienceProgress = (user.experience / experienceToNextLevel) * 100;

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 装備管理ページへの遷移
  const handleEquipmentClick = () => {
    router.push('/profile/equipment');
  };

  // プロフィールページへの遷移
  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar
          src={user.avatar_url || undefined}
          fallback={user.name[0]}
          className="w-8 h-8"
        />
        <span className="hidden md:inline">{user.name}</span>
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-64 p-4 shadow-lg z-50">
          <div className="space-y-4">
            {/* ステータス表示 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold">Level {user.level}</span>
                <span className="text-sm text-gray-500">
                  {user.experience}/{experienceToNextLevel} EXP
                </span>
              </div>
              <Progress value={experienceProgress} />
              <div className="text-sm text-gray-500">
                Completed Quests: {user.completed_quests}
              </div>
            </div>

            {/* メニューアイテム */}
            <div className="space-y-2">
              <Dropdown.Item
                onClick={handleProfileClick}
                className="flex items-center gap-2"
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={handleEquipmentClick}
                className="flex items-center gap-2"
              >
                <div className="flex gap-1">
                  <Shield size={16} />
                  <Sword size={16} />
                </div>
                <span>Equipment</span>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Dropdown.Item>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UserMenu;