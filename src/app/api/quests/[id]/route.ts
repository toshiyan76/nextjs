import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Supabaseクライアントの初期化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// クエスト状態更新のバリデーションスキーマ
const questUpdateSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  adventurer_id: z.string().optional(),
});

// クエスト受注のバリデーションスキーマ
const questAcceptSchema = z.object({
  adventurer_id: z.string(),
});

// 認証チェック関数
async function checkAuth() {
  const cookieStore = cookies();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await checkAuth();
    
    // クエスト詳細の取得
    const { data: quest, error } = await supabase
      .from('quests')
      .select(`
        *,
        client:client_id(id, name, avatar_url),
        adventurer:adventurer_id(id, name, avatar_url)
      `)
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!quest) return NextResponse.json({ error: 'Quest not found' }, { status: 404 });

    return NextResponse.json(quest);
  } catch (error) {
    console.error('Error fetching quest:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quest' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await checkAuth();
    const body = await request.json();
    
    // リクエストボディのバリデーション
    const validatedData = questUpdateSchema.parse(body);

    // クエストの更新
    const { data, error } = await supabase
      .from('quests')
      .update({
        status: validatedData.status,
        adventurer_id: validatedData.adventurer_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating quest:', error);
    return NextResponse.json(
      { error: 'Failed to update quest' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await checkAuth();
    const body = await request.json();
    
    // リクエストボディのバリデーション
    const validatedData = questAcceptSchema.parse(body);

    // クエストの受注処理
    const { data: quest, error: questError } = await supabase
      .from('quests')
      .select('status, adventurer_id')
      .eq('id', params.id)
      .single();

    if (questError) throw questError;
    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }
    if (quest.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Quest is not available' },
        { status: 400 }
      );
    }

    // クエストの状態を更新
    const { data, error } = await supabase
      .from('quests')
      .update({
        status: 'IN_PROGRESS',
        adventurer_id: validatedData.adventurer_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error accepting quest:', error);
    return NextResponse.json(
      { error: 'Failed to accept quest' },
      { status: 500 }
    );
  }
}