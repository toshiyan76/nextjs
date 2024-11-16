// frontend/lib/db/server.ts

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// 環境変数の型チェック
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Supabaseクライアントの設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// シングルトンパターンでクライアントを管理
let supabase: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Supabaseクライアントのインスタンスを取得する
 * @returns Supabaseクライアントインスタンス
 */
export const getSupabaseClient = () => {
  if (!supabase) {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public',
      },
    });
  }
  return supabase;
};

/**
 * トランザクションを実行する
 * @param callback トランザクション内で実行する処理
 * @returns 処理結果
 */
export async function withTransaction<T>(
  callback: (client: ReturnType<typeof createClient<Database>>) => Promise<T>
): Promise<T> {
  const client = getSupabaseClient();
  
  try {
    await client.rpc('begin_transaction');
    const result = await callback(client);
    await client.rpc('commit_transaction');
    return result;
  } catch (error) {
    await client.rpc('rollback_transaction');
    throw error;
  }
}

/**
 * クエストデータに関する操作を提供するクラス
 */
export class QuestRepository {
  private client: ReturnType<typeof createClient<Database>>;

  constructor() {
    this.client = getSupabaseClient();
  }

  async getQuests(filters?: {
    category?: string;
    difficulty?: string;
    status?: string;
  }) {
    const query = this.client.from('quests').select('*');
    
    if (filters?.category) {
      query.eq('category', filters.category);
    }
    if (filters?.difficulty) {
      query.eq('difficulty', filters.difficulty);
    }
    if (filters?.status) {
      query.eq('status', filters.status);
    }

    return await query;
  }

  async getQuestById(id: string) {
    return await this.client
      .from('quests')
      .select('*')
      .eq('id', id)
      .single();
  }
}

/**
 * ユーザー情報に関する操作を提供するクラス
 */
export class UserRepository {
  private client: ReturnType<typeof createClient<Database>>;

  constructor() {
    this.client = getSupabaseClient();
  }

  async getUserProfile(userId: string) {
    return await this.client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
  }

  async updateUserProfile(userId: string, data: Partial<Database['public']['Tables']['users']['Update']>) {
    return await this.client
      .from('users')
      .update(data)
      .eq('id', userId);
  }
}

// エクスポートするインスタンス
export const questRepository = new QuestRepository();
export const userRepository = new UserRepository();

// 型定義のエクスポート
export type { Database };
// 使用例
import { questRepository, userRepository, withTransaction } from '@/lib/db/server';

// クエストの取得
const quests = await questRepository.getQuests({ status: 'active' });

// ユーザープロフィールの更新
await userRepository.updateUserProfile(userId, { level: newLevel });

// トランザクション処理
await withTransaction(async (client) => {
  // トランザクション内の処理
});