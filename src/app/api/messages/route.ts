import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

// メッセージのバリデーションスキーマ
const messageSchema = z.object({
  quest_id: z.string().uuid(),
  receiver_id: z.string().uuid(),
  content: z.string().min(1).max(1000),
})

// メッセージの取得（履歴）
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // 認証チェック
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const searchParams = req.nextUrl.searchParams
    const questId = searchParams.get('quest_id')

    // クエリパラメータに基づいてメッセージを取得
    const query = supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (questId) {
      query.eq('quest_id', questId)
    }

    const { data: messages, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      )
    }

    return NextResponse.json({ messages })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// メッセージの送信
export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // 認証チェック
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    
    // バリデーション
    const validationResult = messageSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { quest_id, receiver_id, content } = validationResult.data
    const sender_id = session.user.id

    // メッセージの保存
    const { data: message, error } = await supabase
      .from('messages')
      .insert([
        {
          quest_id,
          sender_id,
          receiver_id,
          content,
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    // 通知の作成
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: receiver_id,
          type: 'message',
          content: `New message from ${session.user.email}`,
          related_id: message.id,
        }
      ])

    return NextResponse.json({ message })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}