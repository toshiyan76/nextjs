import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { QuestCard } from '../client/questCard';
import { QuestFilter } from '../client/questFilter';
import { Button } from '@/components/ui/button';
import { Quest } from '@/types/quest';
import { fetchQuests } from '@/lib/api/quests';

type SortOption = 'reward' | 'deadline' | 'difficulty' | 'created_at';
type SortDirection = 'asc' | 'desc';

interface QuestListProps {
  initialQuests?: Quest[];
}

export default function QuestList({ initialQuests }: QuestListProps) {
  // フィルター状態の管理
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    status: '',
    minReward: 0,
    requiredSkills: [] as string[],
  });

  // ソート状態の管理
  const [sortConfig, setSortConfig] = useState<{
    field: SortOption;
    direction: SortDirection;
  }>({
    field: 'created_at',
    direction: 'desc',
  });

  // クエストデータの取得
  const { data: quests = initialQuests || [], isLoading, error } = useQuery(
    ['quests', filters],
    () => fetchQuests(filters),
    {
      initialData: initialQuests,
      refetchInterval: 30000, // 30秒ごとに更新
    }
  );

  // フィルター適用関数
  const applyFilters = (quests: Quest[]) => {
    return quests.filter((quest) => {
      const categoryMatch = !filters.category || quest.category === filters.category;
      const difficultyMatch = !filters.difficulty || quest.difficulty === filters.difficulty;
      const statusMatch = !filters.status || quest.status === filters.status;
      const rewardMatch = quest.reward >= filters.minReward;
      const skillsMatch = filters.requiredSkills.length === 0 || 
        filters.requiredSkills.every(skill => quest.required_skills.includes(skill));

      return categoryMatch && difficultyMatch && statusMatch && rewardMatch && skillsMatch;
    });
  };

  // ソート適用関数
  const applySorting = (quests: Quest[]) => {
    return [...quests].sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      
      switch (sortConfig.field) {
        case 'reward':
          return (a.reward - b.reward) * direction;
        case 'deadline':
          return (new Date(a.deadline).getTime() - new Date(b.deadline).getTime()) * direction;
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
                 difficultyOrder[b.difficulty as keyof typeof difficultyOrder]) * direction;
        default:
          return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * direction;
      }
    });
  };

  // フィルターとソートを適用したクエストリスト
  const filteredAndSortedQuests = applySorting(applyFilters(quests));

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading quests...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading quests</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* フィルターセクション */}
      <div className="mb-6">
        <QuestFilter
          currentFilters={filters}
          onFilterChange={setFilters}
        />
      </div>

      {/* ソートコントロール */}
      <div className="flex gap-4 mb-6">
        <select
          className="border rounded p-2"
          value={sortConfig.field}
          onChange={(e) => setSortConfig({
            ...sortConfig,
            field: e.target.value as SortOption
          })}
        >
          <option value="created_at">Latest</option>
          <option value="reward">Reward</option>
          <option value="deadline">Deadline</option>
          <option value="difficulty">Difficulty</option>
        </select>
        <Button
          onClick={() => setSortConfig({
            ...sortConfig,
            direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
          })}
        >
          {sortConfig.direction === 'asc' ? '↑' : '↓'}
        </Button>
      </div>

      {/* クエストリスト */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
          />
        ))}
      </div>

      {filteredAndSortedQuests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No quests found matching your criteria
        </div>
      )}
    </div>
  );
}