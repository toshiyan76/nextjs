import { Suspense } from 'react'
import QuestStats from '@/components/dashboard/server/questStats'
import QuestChart from '@/components/dashboard/client/questChart'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// ダッシュボードのスケルトンローダー
function DashboardSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="h-48 animate-pulse bg-gray-200 rounded-lg" />
      <div className="h-96 animate-pulse bg-gray-200 rounded-lg" />
    </div>
  )
}

export default async function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">ギルドダッシュボード</h1>
      
      {/* アクティブクエストセクション */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">アクティブクエスト</h2>
          <Suspense fallback={<div className="h-32 animate-pulse bg-gray-200 rounded" />}>
            <div className="space-y-2">
              <ActiveQuestsList />
            </div>
          </Suspense>
        </Card>

        {/* 報酬統計 */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">報酬統計</h2>
          <Suspense fallback={<div className="h-32 animate-pulse bg-gray-200 rounded" />}>
            <QuestStats />
          </Suspense>
        </Card>

        {/* ランキング */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">冒険者ランキング</h2>
          <Suspense fallback={<div className="h-32 animate-pulse bg-gray-200 rounded" />}>
            <AdventurerRanking />
          </Suspense>
        </Card>
      </section>

      {/* クエストチャート */}
      <section className="mt-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">クエスト分析</h2>
          <QuestChart />
        </Card>
      </section>
    </div>
  )
}

// アクティブクエストリストコンポーネント
async function ActiveQuestsList() {
  // 実際のデータフェッチロジックはここに実装
  const activeQuests = [
    { id: 1, title: "ゴブリン討伐", difficulty: "初級", progress: 65 },
    { id: 2, title: "古代遺跡の探索", difficulty: "中級", progress: 30 },
    { id: 3, title: "ドラゴン討伐", difficulty: "上級", progress: 10 },
  ]

  return (
    <div className="space-y-4">
      {activeQuests.map((quest) => (
        <div key={quest.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">{quest.title}</span>
            <Badge>{quest.difficulty}</Badge>
          </div>
          <Progress value={quest.progress} max={100} />
        </div>
      ))}
    </div>
  )
}

// 冒険者ランキングコンポーネント
async function AdventurerRanking() {
  // 実際のデータフェッチロジックはここに実装
  const rankings = [
    { id: 1, name: "勇者A", exp: 1200, rank: 1 },
    { id: 2, name: "魔法使いB", exp: 980, rank: 2 },
    { id: 3, name: "戦士C", exp: 850, rank: 3 },
  ]

  return (
    <div className="space-y-2">
      {rankings.map((adventurer) => (
        <div key={adventurer.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">{adventurer.rank}</span>
            <span>{adventurer.name}</span>
          </div>
          <span className="text-sm text-gray-600">{adventurer.exp}EXP</span>
        </div>
      ))}
    </div>
  )
}