import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// クエストのバリデーションスキーマ
const questSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  reward: z.number().min(0),
  deadline: z.string().datetime(),
  category: z.string(),
  required_skills: z.array(z.string()),
  status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).default('open'),
});

// フィルタリングのためのクエリパラメータスキーマ
const querySchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']).optional(),
  category: z.string().optional(),
  status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).optional(),
  min_reward: z.string().transform(Number).optional(),
  max_reward: z.string().transform(Number).optional(),
  required_skills: z.string().transform(skills => skills.split(',')).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // クエリパラメータの取得と検証
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const validatedQuery = querySchema.parse(queryParams);

    // クエリの構築
    let query = supabase.from('quests').select('*');

    // フィルタリングの適用
    if (validatedQuery.difficulty) {
      query = query.eq('difficulty', validatedQuery.difficulty);
    }
    if (validatedQuery.category) {
      query = query.eq('category', validatedQuery.category);
    }
    if (validatedQuery.status) {
      query = query.eq('status', validatedQuery.status);
    }
    if (validatedQuery.min_reward) {
      query = query.gte('reward', validatedQuery.min_reward);
    }
    if (validatedQuery.max_reward) {
      query = query.lte('reward', validatedQuery.max_reward);
    }
    if (validatedQuery.required_skills) {
      query = query.contains('required_skills', validatedQuery.required_skills);
    }

    // クエリの実行
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // セッションの確認
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // リクエストボディの取得と検証
    const body = await request.json();
    const validatedData = questSchema.parse(body);

    // クエストの作成
    const { data, error } = await supabase
      .from('quests')
      .insert([
        {
          ...validatedData,
          client_id: session.data.session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating quest:', error);
    return NextResponse.json(
      { error: 'Failed to create quest' },
      { status: 500 }
    );
  }
}