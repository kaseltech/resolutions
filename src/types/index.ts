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
export const CATEGORIES: { value: Category; label: string; color: string; darkColor: string; bgLight: string; bgDark: string }[] = [
  { value: 'health', label: 'Health & Fitness', color: '#047857', darkColor: '#10b981', bgLight: '#ecfdf5', bgDark: '#064e3b' },
  { value: 'career', label: 'Career & Work', color: '#1e40af', darkColor: '#60a5fa', bgLight: '#eff6ff', bgDark: '#1e3a5f' },
  { value: 'finance', label: 'Finance & Money', color: '#b45309', darkColor: '#fbbf24', bgLight: '#fffbeb', bgDark: '#78350f' },
  { value: 'relationships', label: 'Relationships', color: '#be185d', darkColor: '#f472b6', bgLight: '#fdf2f8', bgDark: '#831843' },
  { value: 'personal', label: 'Personal Growth', color: '#7c3aed', darkColor: '#a78bfa', bgLight: '#f5f3ff', bgDark: '#4c1d95' },
  { value: 'learning', label: 'Learning & Education', color: '#0369a1', darkColor: '#38bdf8', bgLight: '#f0f9ff', bgDark: '#0c4a6e' },
  { value: 'creativity', label: 'Creativity & Hobbies', color: '#c2410c', darkColor: '#fb923c', bgLight: '#fff7ed', bgDark: '#7c2d12' },
  { value: 'other', label: 'Other', color: '#475569', darkColor: '#94a3b8', bgLight: '#f8fafc', bgDark: '#334155' },
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

// Tracking types for different kinds of resolutions
export type TrackingType = 'frequency' | 'cumulative' | 'target' | 'reflection';

export const TRACKING_TYPES: { value: TrackingType; label: string; description: string; icon: string }[] = [
  {
    value: 'frequency',
    label: 'Regular Check-ins',
    description: 'Track how often you do something (e.g., meditate 4x per week)',
    icon: '📅'
  },
  {
    value: 'cumulative',
    label: 'Build Toward a Goal',
    description: 'Add progress toward a total (e.g., save $5,000, read 20 books)',
    icon: '📈'
  },
  {
    value: 'target',
    label: 'Reach a Target',
    description: 'Track a value moving toward a goal (e.g., reach 220lbs, run 7-min mile)',
    icon: '🎯'
  },
  {
    value: 'reflection',
    label: 'Reflection Only',
    description: 'Journal your journey without tracking numbers (e.g., be more present)',
    icon: '📝'
  },
];

// Check-in record for frequency-based tracking
export interface CheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  value?: number; // Optional value (e.g., miles run, minutes meditated)
  note?: string;
}

export interface Resolution {
  id: string;
  title: string;
  description: string;
  category: Category;
  progress: number; // 0-100 (legacy, used for cumulative)
  milestones: Milestone[];
  journal: JournalEntry[];
  notes: string;
  deadline?: string;
  reminder?: Reminder;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;

  // New tracking fields (optional for backward compatibility with legacy resolutions)
  trackingType?: TrackingType;

  // Frequency tracking (e.g., "meditate 4x per week")
  targetFrequency?: number; // How many times
  frequencyPeriod?: 'day' | 'week' | 'month'; // Per what period
  checkIns?: CheckIn[]; // Record of check-ins

  // Cumulative tracking (e.g., "save $5000")
  targetValue?: number; // The goal number
  currentValue?: number; // Current accumulated value
  unit?: string; // e.g., "$", "books", "miles"

  // Target tracking (e.g., "reach 220lbs") - reuses targetValue, currentValue, unit
  startingValue?: number; // Where you started (for calculating progress direction)
}

export interface AppData {
  resolutions: Resolution[];
  version: string;
}

export function getCategoryInfo(category: Category) {
  return CATEGORIES.find(c => c.value === category) || CATEGORIES[CATEGORIES.length - 1];
}
