import { Resolution } from '@/types';
import { supabase } from './supabase';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export function createResolution(partial: Partial<Resolution>): Resolution {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: '',
    description: '',
    category: 'personal',
    progress: 0,
    milestones: [],
    journal: [],
    notes: '',
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

// Convert database row to Resolution type
function rowToResolution(row: Record<string, unknown>): Resolution {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || '',
    category: row.category as Resolution['category'],
    progress: (row.progress as number) || 0,
    milestones: (row.milestones as Resolution['milestones']) || [],
    journal: (row.journal as Resolution['journal']) || [],
    notes: (row.notes as string) || '',
    deadline: row.deadline as string | undefined,
    reminder: row.reminder as Resolution['reminder'] | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    completedAt: row.completed_at as string | undefined,
  };
}

// Convert Resolution to database row format
function resolutionToRow(resolution: Resolution, userId: string): Record<string, unknown> {
  return {
    id: resolution.id,
    user_id: userId,
    title: resolution.title,
    description: resolution.description,
    category: resolution.category,
    progress: resolution.progress,
    milestones: resolution.milestones,
    journal: resolution.journal,
    notes: resolution.notes,
    deadline: resolution.deadline || null,
    reminder: resolution.reminder || null,
    created_at: resolution.createdAt,
    updated_at: resolution.updatedAt,
    completed_at: resolution.completedAt || null,
  };
}

export async function loadResolutions(): Promise<Resolution[]> {
  const { data, error } = await supabase
    .from('resolutions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load resolutions:', error);
    return [];
  }

  return (data || []).map(rowToResolution);
}

export async function saveResolution(resolution: Resolution): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return;
  }

  const row = resolutionToRow(resolution, userId);

  const { error } = await supabase
    .from('resolutions')
    .upsert(row, { onConflict: 'id' });

  if (error) {
    console.error('Failed to save resolution:', error);
  }
}

export async function deleteResolutionFromDb(id: string): Promise<void> {
  const { error } = await supabase
    .from('resolutions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete resolution:', error);
  }
}
