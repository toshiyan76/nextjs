'use client';

import { useEffect, useState } from 'react';
import { ProfileStats } from '@/components/profile/server/profileStats';
import { ProfileEdit } from '@/components/profile/client/profileEdit';
import { QuestHistory } from '@/components/profile/server/questHistory';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { User } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  // プロフィールデータの取得
  const { data: profile, isLoading, error } = useQuery<User>('profile', async () => {
    const response = await fetch('/api/profile');
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center text-red-500">
        エラーが発生しました。再度お試しください。
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* プロフィール情報セクション */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">冒険者プロフィール</h1>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
            >
              {isEditing ? '表示モード' : '編集モード'}
            </Button>
          </div>

          {isEditing ? (
            <ProfileEdit
              profile={profile}
              onSave={() => setIsEditing(false)}
            />
          ) : (
            <ProfileStats profile={profile} />
          )}
        </Card>

        {/* スキルと装備セクション */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">スキルと装備</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">保有スキル</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* クエスト履歴セクション */}
      <Card className="mt-8 p-6">
        <h2 className="text-xl font-bold mb-4">クエスト履歴</h2>
        <QuestHistory userId={profile.id} />
      </Card>
    </motion.div>
  );
}