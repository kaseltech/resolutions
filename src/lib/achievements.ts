import { Resolution } from '@/types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (resolutions: Resolution[]) => boolean;
}

// All available achievements
export const achievementDefinitions: AchievementDefinition[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Make your first 10% progress on any resolution',
    icon: '👣',
    check: (resolutions) => resolutions.some(r => r.progress >= 10),
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Create your first resolution',
    icon: '🌱',
    check: (resolutions) => resolutions.length >= 1,
  },
  {
    id: 'the_closer',
    name: 'The Closer',
    description: 'Complete your first resolution',
    icon: '🏆',
    check: (resolutions) => resolutions.some(r => r.progress === 100),
  },
  {
    id: 'overachiever',
    name: 'Overachiever',
    description: 'Complete 3 resolutions',
    icon: '⭐',
    check: (resolutions) => resolutions.filter(r => r.progress === 100).length >= 3,
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Complete all your resolutions',
    icon: '👑',
    check: (resolutions) => resolutions.length >= 3 && resolutions.every(r => r.progress === 100),
  },
  {
    id: 'journaler',
    name: 'Journaler',
    description: 'Write 5 journal entries',
    icon: '📝',
    check: (resolutions) => {
      const totalEntries = resolutions.reduce((sum, r) => sum + (r.journal?.length || 0), 0);
      return totalEntries >= 5;
    },
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    description: 'Write 20 journal entries',
    icon: '📚',
    check: (resolutions) => {
      const totalEntries = resolutions.reduce((sum, r) => sum + (r.journal?.length || 0), 0);
      return totalEntries >= 20;
    },
  },
  {
    id: 'milestone_master',
    name: 'Milestone Master',
    description: 'Complete 10 milestones across all resolutions',
    icon: '🎯',
    check: (resolutions) => {
      const completedMilestones = resolutions.reduce(
        (sum, r) => sum + r.milestones.filter(m => m.completed).length,
        0
      );
      return completedMilestones >= 10;
    },
  },
  {
    id: 'halfway_hero',
    name: 'Halfway Hero',
    description: 'Get all resolutions to at least 50%',
    icon: '🦸',
    check: (resolutions) => resolutions.length >= 2 && resolutions.every(r => r.progress >= 50),
  },
  {
    id: 'ambitious',
    name: 'Ambitious',
    description: 'Create 5 or more resolutions',
    icon: '🚀',
    check: (resolutions) => resolutions.length >= 5,
  },
  {
    id: 'planner',
    name: 'Planner',
    description: 'Set deadlines for 3 resolutions',
    icon: '📅',
    check: (resolutions) => resolutions.filter(r => r.deadline).length >= 3,
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Have resolutions in 3 different categories',
    icon: '⚖️',
    check: (resolutions) => {
      const categories = new Set(resolutions.map(r => r.category));
      return categories.size >= 3;
    },
  },
];

// Calculate which achievements are unlocked
export function calculateAchievements(resolutions: Resolution[]): Achievement[] {
  return achievementDefinitions.map(def => ({
    id: def.id,
    name: def.name,
    description: def.description,
    icon: def.icon,
    unlocked: def.check(resolutions),
  }));
}

// Get count of unlocked achievements
export function getUnlockedCount(resolutions: Resolution[]): number {
  return achievementDefinitions.filter(def => def.check(resolutions)).length;
}

// Get total number of achievements
export function getTotalAchievements(): number {
  return achievementDefinitions.length;
}
