import React from 'react';
import { useQuery } from 'react-query';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { User, Quest } from '@/types';

interface QuestStatsProps {
  userId: string;
}

interface StatsData {
  completionRate: number;
  totalRewards: number;
  ranking: {
    position: number;
    totalUsers: number;
  };
  completedQuests: number;
  totalQuests: number;
}

const QuestStats: React.FC<QuestStatsProps> = ({ userId }) => {
  // クエスト統計データを取得
  const { data: stats, isLoading } = useQuery<StatsData>(
    ['questStats', userId],
    async () => {
      const response = await fetch(`/api/quests/stats?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quest stats');
      }
      return response.json();
    }
  );

  if (isLoading || !stats) {
    return (
      <div className="animate-pulse">
        <Card className="p-6">
          <div className="h-40 bg-gray-200 rounded"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 完了率 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">クエスト完了率</h3>
        <Progress 
          value={stats.completionRate} 
          max={100}
          className="h-2 mb-2"
        />
        <p className="text-sm text-gray-600">
          {stats.completedQuests} / {stats.totalQuests} クエスト完了
        </p>
        <p className="text-2xl font-bold mt-2">
          {stats.completionRate.toFixed(1)}%
        </p>
      </Card>

      {/* 報酬集計 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">累計報酬</h3>
        <div className="flex items-center">
          <span className="text-3xl font-bold">
            {new Intl.NumberFormat().format(stats.totalRewards)}
          </span>
          <Badge className="ml-2">G</Badge>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          完了クエストからの総報酬
        </p>
      </Card>

      {/* ランキング */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">冒険者ランキング</h3>
        <div className="text-center">
          <span className="text-4xl font-bold text-primary">
            #{stats.ranking.position}
          </span>
          <p className="text-sm text-gray-600 mt-2">
            総冒険者数: {stats.ranking.totalUsers}人中
          </p>
        </div>
        {stats.ranking.position <= 3 && (
          <Badge 
            className="mt-4 w-full justify-center"
            variant={stats.ranking.position === 1 ? "destructive" : "default"}
          >
            {stats.ranking.position === 1 && "🏆 "}
            トップ {stats.ranking.position} 位
          </Badge>
        )}
      </Card>
    </div>
  );
};

export default QuestStats;