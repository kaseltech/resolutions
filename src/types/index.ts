export type Category =
  | 'health'
  | 'career'
  | 'finance'
  | 'relationships'
  | 'personal'
  | 'learning'
  | 'creativity'
  | 'other';

// Rugged, outdoorsy category colors with dark variants for badges
export const CATEGORIES: { value: Category; label: string; color: string; darkColor: string; bgLight: string; bgDark: string; icon: string }[] = [
  { value: 'health', label: 'Health & Fitness', color: '#047857', darkColor: '#10b981', bgLight: '#ecfdf5', bgDark: '#064e3b', icon: '💪' },
  { value: 'career', label: 'Career & Work', color: '#1e40af', darkColor: '#60a5fa', bgLight: '#eff6ff', bgDark: '#1e3a5f', icon: '💼' },
  { value: 'finance', label: 'Finance & Money', color: '#b45309', darkColor: '#fbbf24', bgLight: '#fffbeb', bgDark: '#78350f', icon: '💰' },
  { value: 'relationships', label: 'Relationships', color: '#be185d', darkColor: '#f472b6', bgLight: '#fdf2f8', bgDark: '#831843', icon: '❤️' },
  { value: 'personal', label: 'Personal Growth', color: '#7c3aed', darkColor: '#a78bfa', bgLight: '#f5f3ff', bgDark: '#4c1d95', icon: '🌱' },
  { value: 'learning', label: 'Learning & Education', color: '#0369a1', darkColor: '#38bdf8', bgLight: '#f0f9ff', bgDark: '#0c4a6e', icon: '📚' },
  { value: 'creativity', label: 'Creativity & Hobbies', color: '#c2410c', darkColor: '#fb923c', bgLight: '#fff7ed', bgDark: '#7c2d12', icon: '🎨' },
  { value: 'other', label: 'Other', color: '#475569', darkColor: '#94a3b8', bgLight: '#f8fafc', bgDark: '#334155', icon: '✨' },
];

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  createdAt: string;
  mood?: 'great' | 'good' | 'okay' | 'struggling';
}

export interface Reminder {
  id: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:mm format
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  enabled: boolean;
  lastShown?: string;
}

export interface Resolution {
  id: string;
  title: string;
  description: string;
  category: Category;
  progress: number; // 0-100
  milestones: Milestone[];
  journal: JournalEntry[];
  notes: string;
  deadline?: string;
  reminder?: Reminder;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface AppData {
  resolutions: Resolution[];
  version: string;
}

export function getCategoryInfo(category: Category) {
  return CATEGORIES.find(c => c.value === category) || CATEGORIES[CATEGORIES.length - 1];
}
