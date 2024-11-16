/**
 * @file Quest Board Utility Functions
 * @description Contains utility functions for experience calculation, rank determination, and reward conversion
 */

// Constants for experience and rank calculations
const RANK_THRESHOLDS = {
  F: 0,
  E: 1000,
  D: 3000,
  C: 7000,
  B: 15000,
  A: 30000,
  S: 60000,
  SS: 100000,
} as const;

const DIFFICULTY_MULTIPLIERS = {
  easy: 1,
  normal: 1.5,
  hard: 2.5,
  expert: 4,
  legendary: 6,
} as const;

// Types
export type Rank = keyof typeof RANK_THRESHOLDS;
export type Difficulty = keyof typeof DIFFICULTY_MULTIPLIERS;

/**
 * Calculates experience points based on quest difficulty and completion time
 * @param difficulty Quest difficulty level
 * @param completionTimeMinutes Time taken to complete the quest in minutes
 * @param baseExperience Base experience points for the quest
 * @returns Calculated experience points
 */
export function calculateExperience(
  difficulty: Difficulty,
  completionTimeMinutes: number,
  baseExperience: number
): number {
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty];
  const timeBonus = Math.max(0, 1 - (completionTimeMinutes - 30) / 120); // Time bonus decreases after 30 minutes
  return Math.round(baseExperience * multiplier * (1 + timeBonus));
}

/**
 * Determines user rank based on total experience points
 * @param experience Total experience points
 * @returns Current rank
 */
export function determineRank(experience: number): Rank {
  const ranks = Object.entries(RANK_THRESHOLDS).reverse();
  const rank = ranks.find(([_, threshold]) => experience >= threshold);
  return (rank?.[0] as Rank) || 'F';
}

/**
 * Calculates experience needed for next rank
 * @param currentExperience Current experience points
 * @returns Experience points needed for next rank
 */
export function experienceToNextRank(currentExperience: number): number {
  const currentRank = determineRank(currentExperience);
  const ranks = Object.entries(RANK_THRESHOLDS);
  const currentRankIndex = ranks.findIndex(([rank]) => rank === currentRank);
  
  if (currentRankIndex === ranks.length - 1) return 0;
  const nextRankThreshold = ranks[currentRankIndex + 1][1];
  return nextRankThreshold - currentExperience;
}

/**
 * Converts quest reward to currency value
 * @param baseReward Base reward amount
 * @param difficulty Quest difficulty
 * @param userRank User's current rank
 * @returns Calculated reward amount
 */
export function calculateReward(
  baseReward: number,
  difficulty: Difficulty,
  userRank: Rank
): number {
  const difficultyBonus = DIFFICULTY_MULTIPLIERS[difficulty];
  const rankBonus = 1 + (Object.keys(RANK_THRESHOLDS).indexOf(userRank) * 0.1);
  return Math.round(baseReward * difficultyBonus * rankBonus);
}

/**
 * Formats experience points for display
 * @param experience Experience points
 * @returns Formatted string
 */
export function formatExperience(experience: number): string {
  return new Intl.NumberFormat('en-US').format(experience);
}

/**
 * Formats reward amount for display
 * @param amount Reward amount
 * @returns Formatted string with currency symbol
 */
export function formatReward(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Calculates completion rate as a percentage
 * @param completedQuests Number of completed quests
 * @param totalQuests Total number of quests
 * @returns Completion rate percentage
 */
export function calculateCompletionRate(
  completedQuests: number,
  totalQuests: number
): number {
  if (totalQuests === 0) return 0;
  return Math.round((completedQuests / totalQuests) * 100);
}

// For testing purposes
export const utils = {
  RANK_THRESHOLDS,
  DIFFICULTY_MULTIPLIERS,
};
