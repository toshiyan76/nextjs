'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multiSelect';
import { toast } from '@/components/ui/toast';
import { useMutation, useQueryClient } from 'react-query';

// クエストフォームのバリデーションスキーマ
const questSchema = z.object({
  title: z.string().min(3, '3文字以上入力してください').max(100),
  description: z.string().min(10, '10文字以上入力してください').max(1000),
  difficulty: z.enum(['初級', '中級', '上級', '超級']),
  reward: z.number().min(100).max(1000000),
  deadline: z.string().min(1, '締切日を設定してください'),
  category: z.string().min(1, 'カテゴリーを選択してください'),
  required_skills: z.array(z.string()).min(1, '必要スキルを1つ以上選択してください'),
});

type QuestFormData = z.infer<typeof questSchema>;

interface QuestFormProps {
  initialData?: QuestFormData;
  onSubmit: (data: QuestFormData) => Promise<void>;
  isEditing?: boolean;
}

const DIFFICULTY_OPTIONS = [
  { value: '初級', label: '初級' },
  { value: '中級', label: '中級' },
  { value: '上級', label: '上級' },
  { value: '超級', label: '超級' },
];

const CATEGORY_OPTIONS = [
  { value: 'バグ討伐', label: 'バグ討伐' },
  { value: '機能実装', label: '機能実装' },
  { value: 'デバッグ', label: 'デバッグ' },
  { value: 'コードレビュー', label: 'コードレビュー' },
];

const SKILL_OPTIONS = [
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'React', label: 'React' },
  { value: 'Next.js', label: 'Next.js' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'Python', label: 'Python' },
];

export function QuestForm({ initialData, onSubmit, isEditing = false }: QuestFormProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<QuestFormData>({
    resolver: zodResolver(questSchema),
    defaultValues: initialData,
  });

  const mutation = useMutation(onSubmit, {
    onSuccess: () => {
      queryClient.invalidateQueries('quests');
      toast({
        title: isEditing ? 'クエストを更新しました' : 'クエストを作成しました',
        variant: 'success',
      });
      if (!isEditing) {
        reset();
      }
    },
    onError: (error) => {
      toast({
        title: 'エラーが発生しました',
        description: error.message,
        variant: 'error',
      });
    },
  });

  const onFormSubmit = async (data: QuestFormData) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium">クエストタイトル</label>
        <Input
          {...register('title')}
          placeholder="クエストのタイトルを入力"
          error={errors.title?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">クエスト詳細</label>
        <Textarea
          {...register('description')}
          placeholder="クエストの詳細を入力"
          error={errors.description?.message}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">難易度</label>
          <Select
            control={control}
            name="difficulty"
            options={DIFFICULTY_OPTIONS}
            error={errors.difficulty?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">報酬 (G)</label>
          <Input
            {...register('reward', { valueAsNumber: true })}
            type="number"
            placeholder="報酬額を入力"
            error={errors.reward?.message}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">カテゴリー</label>
        <Select
          control={control}
          name="category"
          options={CATEGORY_OPTIONS}
          error={errors.category?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">必要スキル</label>
        <MultiSelect
          control={control}
          name="required_skills"
          options={SKILL_OPTIONS}
          error={errors.required_skills?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">締切日</label>
        <Input
          {...register('deadline')}
          type="datetime-local"
          error={errors.deadline?.message}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={mutation.isLoading}
        disabled={mutation.isLoading}
      >
        {isEditing ? 'クエストを更新' : 'クエストを作成'}
      </Button>
    </form>
  );
}