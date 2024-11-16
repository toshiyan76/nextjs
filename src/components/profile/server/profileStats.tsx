import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User } from '@/types';

interface ProfileStatsProps {
  user: User;
}

const calculateLevel = (experience: number): number => {
  // 100経験値ごとにレベルアップする簡単な計算式
  return Math.floor(experience / 100) + 1;
};

const calculateNextLevelProgress = (experience: number): number => {
  const currentLevelExp = experience % 100;
  return (currentLevelExp / 100) * 100;
};

const getRank = (level: number): string => {
  if (level >= 50) return 'レジェンド級冒険者';
  if (level >= 40) return 'マスター級冒険者';
  if (level >= 30) return 'エキスパート級冒険者';
  if (level >= 20) return '上級冒険者';
  if (level >= 10) return '中級冒険者';
  return '初級冒険者';
};

const getAchievements = (user: User) => {
  const achievements = [];
  
  if (user.completed_quests >= 100) {
    achievements.push('クエストマスター');
  }
  if (user.level >= 50) {
    achievements.push('レジェンドハンター');
  }
  if (user.skills.length >= 10) {
    achievements.push('マルチタレント');
  }
  
  return achievements;
};

export default function ProfileStats({ user }: ProfileStatsProps) {
  const level = calculateLevel(user.experience);
  const nextLevelProgress = calculateNextLevelProgress(user.experience);
  const rank = getRank(level);
  const achievements = getAchievements(user);

  return (
    <div className="space-y-6">
      {/* ステータスセクション */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">冒険者ステータス</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">現在のランク</p>
            <p className="text-lg font-bold">{rank}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">レベル</p>
            <p className="text-lg font-bold">Lv. {level}</p>
            <div className="mt-2">
              <Progress value={nextLevelProgress} />
              <p className="text-xs text-gray-500 mt-1">
                次のレベルまで: {100 - (user.experience % 100)}経験値
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">完了クエスト数</p>
            <p className="text-lg font-bold">{user.completed_quests}件</p>
          </div>
        </div>
      </Card>

      {/* スキルセクション */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">習得スキル</h3>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill, index) => (
            <Badge key={index} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </Card>

      {/* 実績セクション */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">獲得実績</h3>
        <div className="space-y-2">
          {achievements.length > 0 ? (
            achievements.map((achievement, index) => (
              <Badge key={index} variant="default" className="block w-full p-2">
                {achievement}
              </Badge>
            ))
          ) : (
            <p className="text-gray-500">まだ実績はありません</p>
          )}
        </div>
      </Card>
    </div>
  );
}