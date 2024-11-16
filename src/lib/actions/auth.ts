'use strict';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type Database } from '@/types/supabase';
import { redirect } from 'next/navigation';

// 認証に関連する型定義
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
  role: 'ADVENTURER' | 'CLIENT';
}

export interface GuildJoinRequest {
  userId: string;
  skills: string[];
  level: number;
}

// エラー型の定義
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * 認証アクションクラス
 * Supabaseを使用した認証機能を提供
 */
export class AuthActions {
  private supabase;

  constructor() {
    this.supabase = createClientComponentClient<Database>();
  }

  /**
   * ログイン処理
   * @param credentials ログイン認証情報
   * @returns ユーザー情報
   */
  async login(credentials: LoginCredentials) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw new AuthError(error.message);

      // セッションの保存
      const cookieStore = cookies();
      cookieStore.set('session', JSON.stringify(data.session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 1週間
      });

      return data.user;
    } catch (error) {
      throw error instanceof AuthError ? error : new AuthError('ログインに失敗しました');
    }
  }

  /**
   * ギルド入会処理
   * @param request 入会リクエスト情報
   */
  async joinGuild(request: GuildJoinRequest) {
    try {
      const { error } = await this.supabase
        .from('adventurers')
        .insert({
          user_id: request.userId,
          skills: request.skills,
          level: request.level,
          experience: 0,
          completed_quests: 0,
        });

      if (error) throw new AuthError('ギルド入会に失敗しました');

      return true;
    } catch (error) {
      throw error instanceof AuthError ? error : new AuthError('ギルド入会処理でエラーが発生しました');
    }
  }

  /**
   * ログアウト処理
   */
  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw new AuthError(error.message);

      // セッションの削除
      const cookieStore = cookies();
      cookieStore.delete('session');

      redirect('/login');
    } catch (error) {
      throw error instanceof AuthError ? error : new AuthError('ログアウトに失敗しました');
    }
  }

  /**
   * セッション検証
   * @returns 有効なセッションの場合true
   */
  async validateSession(): Promise<boolean> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      return !!session;
    } catch {
      return false;
    }
  }

  /**
   * 新規ユーザー登録
   * @param credentials 登録情報
   */
  async signup(credentials: SignupCredentials) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            role: credentials.role,
          },
        },
      });

      if (error) throw new AuthError(error.message);

      return data.user;
    } catch (error) {
      throw error instanceof AuthError ? error : new AuthError('ユーザー登録に失敗しました');
    }
  }
}

// シングルトンインスタンスとしてエクスポート
export const authActions = new AuthActions();