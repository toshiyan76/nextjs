import { Suspense } from 'react'
import QuestList from '@/components/quests/server/questList'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getQuestCategories, getDifficulties } from '@/lib/actions/quests'

// 検索パラメータの型定義
type SearchParams = {
  difficulty?: string
  category?: string
  sort?: string
}

// メインページコンポーネント
export default async function QuestsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // カテゴリーと難易度の一覧を取得
  const categories = await getQuestCategories()
  const difficulties = await getDifficulties()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        冒険者クエストボード
      </h1>

      {/* フィルターセクション */}
      <div className="mb-8">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">難易度</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={
                      searchParams.difficulty === difficulty
                        ? 'default'
                        : 'outline'
                    }
                    className="cursor-pointer"
                    asChild
                  >
                    <a
                      href={`/quests?difficulty=${difficulty}${
                        searchParams.category
                          ? `&category=${searchParams.category}`
                          : ''
                      }`}
                    >
                      {difficulty}
                    </a>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">カテゴリー</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={
                      searchParams.category === category ? 'default' : 'outline'
                    }
                    className="cursor-pointer"
                    asChild
                  >
                    <a
                      href={`/quests?category=${category}${
                        searchParams.difficulty
                          ? `&difficulty=${searchParams.difficulty}`
                          : ''
                      }`}
                    >
                      {category}
                    </a>
                  </Badge>
                ))}
              </div>
            </div>

            {/* ソートオプション */}
            <div>
              <h3 className="text-lg font-semibold mb-2">並び替え</h3>
              <select
                className="border rounded p-2"
                onChange={(e) =>
                  (window.location.href = `/quests?sort=${e.target.value}`)
                }
                value={searchParams.sort || 'latest'}
              >
                <option value="latest">最新順</option>
                <option value="reward-high">報酬金額（高い順）</option>
                <option value="reward-low">報酬金額（低い順）</option>
                <option value="deadline">締切が近い順</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      {/* クエスト一覧 */}
      <Suspense
        fallback={
          <div className="text-center">
            <p>クエスト情報を読み込み中...</p>
          </div>
        }
      >
        <QuestList
          difficulty={searchParams.difficulty}
          category={searchParams.category}
          sort={searchParams.sort}
        />
      </Suspense>
    </div>
  )
}

// メタデータ設定
export const metadata = {
  title: 'クエストボード | 冒険者ギルド',
  description: '冒険者ギルドの公式クエストボードです。新しい冒険を見つけよう！',
}