/**
 * User型定義
 * アプリケーション全体で使用されるユーザー関連の型を定義
 */

// ユーザーの役割を定義
export type UserRole = 'ADVENTURER' | 'CLIENT' | 'ADMIN';

// ユーザーのスキルレベルを定義
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

// ユーザーのスキル情報を定義
export interface UserSkill {
  name: string;
  level: SkillLevel;
  experience: number;
}

// ユーザーの基本情報を定義
export interface UserBase {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: Date;
}

// ユーザーのゲーム関連情報を定義
export interface UserGameStats {
  level: number;
  experience: number;
  completed_quests: number;
  skills: UserSkill[];
}

// ユーザーのプロフィール設定を定義
export interface UserSettings {
  notifications_enabled: boolean;
  display_level: boolean;
  public_profile: boolean;
}

// メインのUser型を定義
export interface User extends UserBase, UserGameStats {
  settings: UserSettings;
  updated_at: Date;
}

// ユーザー作成時に必要な情報を定義
export type CreateUserDTO = Omit<
  User,
  'id' | 'created_at' | 'updated_at' | 'level' | 'experience' | 'completed_quests'
>;

// ユーザー更新時に使用する部分的な型を定義
export type UpdateUserDTO = Partial<Omit<User, 'id' | 'email' | 'created_at' | 'updated_at'>>;

// ユーザーの公開プロフィール情報を定義
export type PublicUserProfile = Pick<User, 'id' | 'name' | 'avatar_url' | 'level' | 'skills'> & {
  quest_completion_rate: number;
};

// ユーザーの認証状態を定義
export interface UserAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

// バリデーション用の定数
export const USER_CONSTRAINTS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  MAX_SKILLS: 10,
  MIN_LEVEL: 1,
  MAX_LEVEL: 100,
} as const;