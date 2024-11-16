// frontend/lib/db/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { atom } from 'jotai';
import { Quest, User, Message } from '@/types';

// 環境変数の型チェック
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Supabaseクライアントの初期化
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// キャッシュの有効期限（5分）
const CACHE_EXPIRY = 5 * 60 * 1000;

// キャッシュインターフェース
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// キャッシュストア
class CacheStore {
  private cache: Map<string, CacheItem<any>> = new Map();

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > CACHE_EXPIRY) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }
}

export const cacheStore = new CacheStore();

// リアルタイム更新用のatomic state
export const questsAtom = atom<Quest[]>([]);
export const usersAtom = atom<User[]>([]);
export const messagesAtom = atom<Message[]>([]);

// DBクライアントクラス
export class DBClient {
  // クエスト関連
  async subscribeToQuests(callback: (quests: Quest[]) => void) {
    return supabase
      .from('quests')
      .on('*', (payload) => {
        const cachedQuests = cacheStore.get<Quest[]>('quests') || [];
        const updatedQuests = this.updateCache(cachedQuests, payload);
        cacheStore.set('quests', updatedQuests);
        callback(updatedQuests);
      })
      .subscribe();
  }

  async getQuests(): Promise<Quest[]> {
    const cached = cacheStore.get<Quest[]>('quests');
    if (cached) return cached;

    const { data, error } = await supabase.from('quests').select('*');
    if (error) throw error;

    cacheStore.set('quests', data);
    return data;
  }

  // ユーザー関連
  async getUser(id: string): Promise<User | null> {
    const cacheKey = `user:${id}`;
    const cached = cacheStore.get<User>(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    cacheStore.set(cacheKey, data);
    return data;
  }

  // メッセージ関連
  async subscribeToMessages(questId: string, callback: (messages: Message[]) => void) {
    return supabase
      .from('messages')
      .on('INSERT', (payload) => {
        if (payload.new.quest_id === questId) {
          const cachedMessages = cacheStore.get<Message[]>(`messages:${questId}`) || [];
          cachedMessages.push(payload.new);
          cacheStore.set(`messages:${questId}`, cachedMessages);
          callback(cachedMessages);
        }
      })
      .subscribe();
  }

  // ヘルパーメソッド
  private updateCache<T extends { id: string }>(
    cache: T[],
    payload: { eventType: string; new: T; old: T }
  ): T[] {
    const items = [...cache];
    const index = items.findIndex((item) => item.id === payload.new.id);

    switch (payload.eventType) {
      case 'INSERT':
        items.push(payload.new);
        break;
      case 'UPDATE':
        if (index !== -1) items[index] = payload.new;
        break;
      case 'DELETE':
        if (index !== -1) items.splice(index, 1);
        break;
    }

    return items;
  }
}

// シングルトンインスタンスをエクスポート
export const dbClient = new DBClient();

// 型エクスポート
export type { Quest, User, Message };