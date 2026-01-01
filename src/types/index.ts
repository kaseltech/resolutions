export type Category =
  | 'health'
  | 'career'
  | 'finance'
  | 'relationships'
  | 'personal'
  | 'learning'
  | 'creativity'
  | 'other';

// Softer, muted colors for Cloud Dancer light theme
export const CATEGORIES: { value: Category; label: string; color: string; icon: string }[] = [
  { value: 'health', label: 'Health & Fitness', color: '#7A9A78', icon: '💪' },
  { value: 'career', label: 'Career & Work', color: '#7A8A9A', icon: '💼' },
  { value: 'finance', label: 'Finance & Money', color: '#9A9078', icon: '💰' },
  { value: 'relationships', label: 'Relationships', color: '#9A7A88', icon: '❤️' },
  { value: 'personal', label: 'Personal Growth', color: '#8A7A9A', icon: '🌱' },
  { value: 'learning', label: 'Learning & Education', color: '#7A7A9A', icon: '📚' },
  { value: 'creativity', label: 'Creativity & Hobbies', color: '#9A8070', icon: '🎨' },
  { value: 'other', label: 'Other', color: '#8A8A88', icon: '✨' },
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
