'use client';

import { useRouter } from 'next/navigation';
import { QuestForm } from '@/components/quests/client/questForm';
import { createQuest } from '@/lib/actions/quests';
import { toast } from '@/components/ui/toast';

export default function NewQuestPage() {
  const router = useRouter();

  // クエスト作成のハンドラー
  const handleCreateQuest = async (questData: any) => {
    try {
      const response = await createQuest(questData);
      
      if (response.success) {
        toast({
          title: "クエスト作成成功",
          description: "新しいクエストが作成されました。",
          variant: "success",
        });
        router.push(`/quests/${response.data.id}`);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "クエストの作成に失敗しました。",
        variant: "destructive",
      });
      console.error("Failed to create quest:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          新規クエスト作成
        </h1>
        
        <div className="bg-card rounded-lg shadow-lg p-6">
          <QuestForm
            onSubmit={handleCreateQuest}
            initialData={{
              title: '',
              description: '',
              difficulty: 'beginner',
              reward: 0,
              deadline: new Date(),
              category: 'other',
              required_skills: [],
              status: 'open'
            }}
          />
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            ※ クエストを作成する前に以下の点を確認してください：
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>報酬は適切な金額に設定されていますか？</li>
            <li>必要なスキルは明確に記載されていますか？</li>
            <li>締め切りは現実的な日程になっていますか？</li>
            <li>クエストの説明は具体的で分かりやすいですか？</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// メタデータの設定
export const metadata = {
  title: '新規クエスト作成 | クエストボード',
  description: '新しいクエストを作成し、冒険者を募集します。',
};

// レイアウトの設定
export const dynamic = 'force-dynamic';
export const revalidate = 0;