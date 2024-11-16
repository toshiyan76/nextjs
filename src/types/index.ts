// frontend/types/index.ts

// クエストの難易度を表す列挙型
export enum QuestDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXTREME = 'EXTREME'
}

// クエストのステータスを表す列挙型
export enum QuestStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

// スキルのカテゴリを表す列挙型
export enum SkillCategory {
  COMBAT = 'COMBAT',
  MAGIC = 'MAGIC',
  CRAFTING = 'CRAFTING',
  GATHERING = 'GATHERING',
  SOCIAL = 'SOCIAL'
}

// クエストのインターフェース
export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  reward: number;
  deadline: Date;
  category: string;
  requiredSkills: string[];
  status: QuestStatus;
  clientId: string;
  adventurerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// 冒険者（ユーザー）のインターフェース
export interface Adventurer {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: 'ADVENTURER' | 'CLIENT' | 'ADMIN';
  level: number;
  experience: number;
  skills: Skill[];
  completedQuests: number;
  createdAt: Date;
}

// スキルのインターフェース
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  description: string;
}

// クエスト履歴のインターフェース
export interface QuestHistory {
  id: string;
  questId: string;
  adventurerId: string;
  status: QuestStatus;
  startedAt: Date;
  completedAt?: Date;
  reward: number;
  rating?: number;
  feedback?: string;
}

// クエストステータスの詳細情報インターフェース
export interface QuestStatusDetails {
  currentStatus: QuestStatus;
  progress: number;
  timeRemaining: number;
  checkpoints: {
    id: string;
    title: string;
    isCompleted: boolean;
    completedAt?: Date;
  }[];
  lastUpdated: Date;
}

// API レスポンスの基本型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ページネーションのための型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// フィルター用の型
export interface QuestFilter {
  difficulty?: QuestDifficulty;
  category?: string;
  status?: QuestStatus;
  minReward?: number;
  maxReward?: number;
  requiredSkills?: string[];
}

// ソート用の型
export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

// 検索用のクエリパラメータ型
export interface SearchParams {
  query?: string;
  filter?: QuestFilter;
  sort?: SortOptions;
  page?: number;
  limit?: number;
}