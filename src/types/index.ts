export type Category =
  | 'health'
  | 'career'
  | 'finance'
  | 'relationships'
  | 'personal'
  | 'learning'
  | 'creativity'
  | 'other';

export const CATEGORIES: { value: Category; label: string; color: string; icon: string }[] = [
  { value: 'health', label: 'Health & Fitness', color: '#2d6a4f', icon: '💪' },
  { value: 'career', label: 'Career & Work', color: '#1e4976', icon: '💼' },
  { value: 'finance', label: 'Finance & Money', color: '#806b2a', icon: '💰' },
  { value: 'relationships', label: 'Relationships', color: '#7d4466', icon: '❤️' },
  { value: 'personal', label: 'Personal Growth', color: '#5b4b8a', icon: '🌱' },
  { value: 'learning', label: 'Learning & Education', color: '#3d4a7a', icon: '📚' },
  { value: 'creativity', label: 'Creativity & Hobbies', color: '#8b5a3c', icon: '🎨' },
  { value: 'other', label: 'Other', color: '#4a5568', icon: '✨' },
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
