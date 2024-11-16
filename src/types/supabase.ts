import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'default_url'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'default_key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  users: {
    Row: {
      id: string;
      role: 'ADVENTURER' | 'CLIENT' | 'ADMIN';
      level: number;
    };
    Insert: Partial<Database['users']['Row']>;
    Update: Partial<Database['users']['Row']>;
  };
  // 必要に応じて他のテーブルの型定義を追加
} 