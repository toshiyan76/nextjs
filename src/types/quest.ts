/**
 * クエスト関連の型定義
 * @file quest.ts
 */

// クエストの難易度を定義
export type QuestDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'LEGENDARY';

// クエストのステータスを定義
export type QuestStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

// クエストのカテゴリーを定義
export type QuestCategory = 
  | 'COMBAT'
  | 'GATHERING'
  | 'CRAFTING'
  | 'ESCORT'
  | 'DELIVERY'
  | 'INVESTIGATION'
  | 'OTHER';

// クエストの必須スキルを定義
export type QuestSkill = {
  name: string;
  level: number;
};

// クエストの報酬を定義
export type QuestReward = {
  gold: number;
  experience: number;
  items?: {
    id: string;
    name: string;
    quantity: number;
  }[];
};

// メインのクエスト型を定義
export type Quest = {
  id: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  reward: QuestReward;
  deadline: Date;
  category: QuestCategory;
  required_skills: QuestSkill[];
  status: QuestStatus;
  client_id: string;
  adventurer_id: string | null;
  created_at: Date;
  updated_at: Date;
  location?: {
    name: string;
    coordinates: {
      x: number;
      y: number;
    };
  };
  min_level?: number;
  max_participants?: number;
  current_participants?: number;
  tags?: string[];
};

// クエスト作成時の入力型を定義
export type CreateQuestInput = Omit<
  Quest,
  'id' | 'status' | 'adventurer_id' | 'created_at' | 'updated_at'
>;

// クエスト更新時の入力型を定義
export type UpdateQuestInput = Partial<Omit<Quest, 'id' | 'created_at' | 'updated_at'>>;

// クエストフィルター用の型を定義
export type QuestFilter = {
  difficulty?: QuestDifficulty;
  category?: QuestCategory;
  status?: QuestStatus;
  minReward?: number;
  maxReward?: number;
  requiredSkills?: string[];
  searchTerm?: string;
  deadlineBefore?: Date;
  deadlineAfter?: Date;
};

// クエストソート用の型を定義
export type QuestSort = {
  field: keyof Quest;
  direction: 'asc' | 'desc';
};

// クエスト検索結果の型を定義
export type QuestSearchResult = {
  quests: Quest[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};