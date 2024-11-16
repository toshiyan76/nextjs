'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuestForm } from '@/components/quests/client/questForm'
import { getQuest, updateQuest } from '@/lib/actions/quests'
import { Quest } from '@/types/quest'
import { toast } from '@/components/ui/toast'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'

type Props = {
  params: {
    id: string
  }
}

export default function EditQuestPage({ params }: Props) {
  const router = useRouter()
  const [quest, setQuest] = useState<Quest | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const questData = await getQuest(params.id)
        setQuest(questData)
      } catch (error) {
        toast({
          title: 'エラー',
          description: 'クエストの取得に失敗しました',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuest()
  }, [params.id])

  const handleSubmit = async (formData: Partial<Quest>) => {
    try {
      setIsLoading(true)
      await updateQuest(params.id, {
        ...formData,
        updated_at: new Date(),
      })
      
      toast({
        title: '成功',
        description: 'クエストが更新されました',
      })
      
      router.push(`/quests/${params.id}`)
      router.refresh()
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'クエストの更新に失敗しました',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!quest) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">クエストが見つかりません</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">クエストの編集</h1>
      <QuestForm
        initialData={quest}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        mode="edit"
      />
    </div>
  )
}