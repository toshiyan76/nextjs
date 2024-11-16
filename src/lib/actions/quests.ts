'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Quest } from '@/types';

// バリデーションスキーマの定義
const questSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(1000),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  reward: z.number().min(1),
  deadline: z.date().min(new Date()),
  category: z.string().min(2).max(50),
  required_skills: z.array(z.string()).min(1),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
});

type QuestInput = z.infer<typeof questSchema>;

/**
 * クエストを作成する
 */
export async function createQuest(input: QuestInput): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerComponentClient({ cookies });
    const validated = questSchema.parse(input);
    
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase.from('quests').insert({
      ...validated,
      client_id: user.user.id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    if (error) throw error;

    revalidatePath('/quests');
    return { success: true };
  } catch (error) {
    console.error('Create quest error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create quest' 
    };
  }
}

/**
 * クエストを更新する
 */
export async function updateQuest(
  questId: string, 
  input: Partial<QuestInput>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerComponentClient({ cookies });
    const partialSchema = questSchema.partial();
    const validated = partialSchema.parse(input);

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // クエストの所有者確認
    const { data: quest } = await supabase
      .from('quests')
      .select()
      .eq('id', questId)
      .single();

    if (quest?.client_id !== user.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('quests')
      .update({
        ...validated,
        updated_at: new Date(),
      })
      .eq('id', questId);

    if (error) throw error;

    revalidatePath(`/quests/${questId}`);
    return { success: true };
  } catch (error) {
    console.error('Update quest error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update quest' 
    };
  }
}

/**
 * クエストを削除する
 */
export async function deleteQuest(
  questId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Unauthorized' };
    }

    // クエストの所有者確認
    const { data: quest } = await supabase
      .from('quests')
      .select()
      .eq('id', questId)
      .single();

    if (quest?.client_id !== user.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('quests')
      .delete()
      .eq('id', questId);

    if (error) throw error;

    revalidatePath('/quests');
    return { success: true };
  } catch (error) {
    console.error('Delete quest error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete quest' 
    };
  }
}

/**
 * クエストを受注する
 */
export async function acceptQuest(
  questId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('quests')
      .update({
        adventurer_id: user.user.id,
        status: 'IN_PROGRESS',
        updated_at: new Date(),
      })
      .eq('id', questId)
      .eq('status', 'OPEN');

    if (error) throw error;

    revalidatePath(`/quests/${questId}`);
    return { success: true };
  } catch (error) {
    console.error('Accept quest error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to accept quest' 
    };
  }
}