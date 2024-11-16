'use server';

import { Suspense } from 'react';
import { getQuestById } from '@/lib/api/quests';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatDistance } from 'date-fns';
import { Shield, Trophy, Clock, Coins } from 'lucide-react';
import type { Quest } from '@/types';

interface QuestDetailProps {
  questId: string;
}

async function QuestDetailContent({ questId }: QuestDetailProps) {
  const quest: Quest = await getQuestById(questId);

  const isActive = quest.status === 'active';
  const isCompleted = quest.status === 'completed';
  const progress = isCompleted ? 100 : isActive ? 50 : 0;

  return (
    <div className="bg-slate-800 rounded-lg p-6 space-y-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{quest.title}</h1>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-blue-500/10">
              {quest.category}
            </Badge>
            <Badge variant="outline" className="bg-yellow-500/10">
              {quest.difficulty}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-yellow-400">
            <Coins size={20} />
            <span className="text-xl font-bold">{quest.reward} G</span>
          </div>
          <div className="text-slate-400 text-sm mt-1">
            <Clock size={14} className="inline mr-1" />
            {formatDistance(new Date(quest.deadline), new Date(), { addSuffix: true })}
          </div>
        </div>
      </div>

      {/* 詳細説明 */}
      <div className="prose prose-invert max-w-none">
        <p>{quest.description}</p>
      </div>

      {/* 必要スキル */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">必要スキル</h3>
        <div className="flex flex-wrap gap-2">
          {quest.required_skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* 進捗状況 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">進捗状況</h3>
          <span className="text-slate-400">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* アクション */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-400" size={20} />
          <span className="text-slate-400">
            {isActive ? '受注済み' : isCompleted ? '完了' : '受注可能'}
          </span>
        </div>
        {!isActive && !isCompleted && (
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={async () => {
              'use server';
              // クエスト受注のロジックを実装
            }}
          >
            クエストを受注する
          </Button>
        )}
        {isCompleted && (
          <div className="flex items-center gap-2 text-yellow-400">
            <Trophy size={20} />
            <span>クエスト完了!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuestDetail({ questId }: QuestDetailProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestDetailContent questId={questId} />
    </Suspense>
  );
}