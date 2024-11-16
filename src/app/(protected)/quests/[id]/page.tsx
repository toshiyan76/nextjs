// frontend/app/(protected)/quests/[id]/page.tsx

import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import QuestDetail from '@/components/quests/server/questDetail'
import { getQuestById } from '@/lib/actions/quests'
import LoadingSpinner from '@/components/ui/loadingSpinner'
import { auth } from '@/lib/auth'

interface QuestPageProps {
  params: {
    id: string
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function QuestPage({ params }: QuestPageProps) {
  // ユーザー認証の確認
  const session = await auth()
  if (!session) {
    return notFound()
  }

  try {
    // クエスト情報の取得
    const quest = await getQuestById(params.id)
    if (!quest) {
      return notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-[50vh]">
            <LoadingSpinner size="large" />
          </div>
        }>
          <QuestDetail
            quest={quest}
            userId={session.user.id}
            userRole={session.user.role}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error loading quest:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          クエストの読み込み中にエラーが発生しました。
          <br />
          しばらく経ってから再度お試しください。
        </div>
      </div>
    )
  }
}

// メタデータの動的生成
export async function generateMetadata({ params }: QuestPageProps) {
  try {
    const quest = await getQuestById(params.id)
    if (!quest) {
      return {
        title: 'クエスト不明 | クエストボード',
        description: 'クエストが見つかりませんでした。',
      }
    }

    return {
      title: `${quest.title} | クエストボード`,
      description: quest.description.substring(0, 160),
      openGraph: {
        title: quest.title,
        description: quest.description.substring(0, 160),
        type: 'article',
        // 必要に応じてOGP画像を追加
      },
    }
  } catch (error) {
    return {
      title: 'エラー | クエストボード',
      description: 'クエスト情報の読み込み中にエラーが発生しました。',
    }
  }
}

// エラーバウンダリ
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center text-red-600">
        <h2 className="text-xl font-bold mb-4">エラーが発生しました</h2>
        <p>{error.message}</p>
      </div>
    </div>
  )
}