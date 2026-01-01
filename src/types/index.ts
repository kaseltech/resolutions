export type Category =
  | 'health'
  | 'career'
  | 'finance'
  | 'relationships'
  | 'personal'
  | 'learning'
  | 'creativity'
  | 'other';

// Rugged, outdoorsy category colors
export const CATEGORIES: { value: Category; label: string; color: string; icon: string }[] = [
  { value: 'health', label: 'Health & Fitness', color: '#059669', icon: '💪' },
  { value: 'career', label: 'Career & Work', color: '#0369a1', icon: '💼' },
  { value: 'finance', label: 'Finance & Money', color: '#b45309', icon: '💰' },
  { value: 'relationships', label: 'Relationships', color: '#be185d', icon: '❤️' },
  { value: 'personal', label: 'Personal Growth', color: '#7c3aed', icon: '🌱' },
  { value: 'learning', label: 'Learning & Education', color: '#1d4ed8', icon: '📚' },
  { value: 'creativity', label: 'Creativity & Hobbies', color: '#c2410c', icon: '🎨' },
  { value: 'other', label: 'Other', color: '#475569', icon: '✨' },
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
