'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Resolution, Milestone, Category, JournalEntry } from '@/types';
import { loadResolutions, saveResolution, deleteResolutionFromDb, generateId, createResolution } from '@/lib/storage';

interface ResolutionContextType {
  resolutions: Resolution[];
  loading: boolean;
  addResolution: (resolution: Partial<Resolution>) => Promise<void>;
  updateResolution: (id: string, updates: Partial<Resolution>) => Promise<void>;
  deleteResolution: (id: string) => Promise<void>;
  reorderResolutions: (fromIndex: number, toIndex: number) => void;
  addMilestone: (resolutionId: string, milestone: Partial<Milestone>) => Promise<void>;
  updateMilestone: (resolutionId: string, milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (resolutionId: string, milestoneId: string) => Promise<void>;
  toggleMilestone: (resolutionId: string, milestoneId: string) => Promise<void>;
  updateProgress: (resolutionId: string, progress: number) => Promise<void>;
  addJournalEntry: (resolutionId: string, entry: Partial<JournalEntry>) => Promise<void>;
  deleteJournalEntry: (resolutionId: string, entryId: string) => Promise<void>;
  getResolutionsByCategory: (category: Category | 'all') => Resolution[];
  getUsedCategories: () => Category[];
  getCompletedCount: () => number;
  getOverallProgress: () => number;
}

const ResolutionContext = createContext<ResolutionContextType | null>(null);

export function ResolutionProvider({ children }: { children: React.ReactNode }) {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [loading, setLoading] = useState(true);

  // Load resolutions from Supabase on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await loadResolutions();
        // Restore saved order from localStorage
        const savedOrder = localStorage.getItem('resolutions-order');
        if (savedOrder) {
          try {
            const orderIds = JSON.parse(savedOrder) as string[];
            const orderedData = [...data].sort((a, b) => {
              const aIndex = orderIds.indexOf(a.id);
              const bIndex = orderIds.indexOf(b.id);
              // Items not in saved order go to the end
              if (aIndex === -1 && bIndex === -1) return 0;
              if (aIndex === -1) return 1;
              if (bIndex === -1) return -1;
              return aIndex - bIndex;
            });
            setResolutions(orderedData);
          } catch {
            setResolutions(data);
          }
        } else {
          setResolutions(data);
        }
      } catch (error) {
        console.error('Failed to load resolutions:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const addResolution = useCallback(async (partial: Partial<Resolution>) => {
    const newResolution = createResolution(partial);
    setResolutions(prev => [newResolution, ...prev]);
    await saveResolution(newResolution);
  }, []);

  const updateResolution = useCallback(async (id: string, updates: Partial<Resolution>) => {
    let updatedResolution: Resolution | null = null;

    setResolutions(prev => prev.map(r => {
      if (r.id === id) {
        updatedResolution = { ...r, ...updates, updatedAt: new Date().toISOString() };
        return updatedResolution;
      }
      return r;
    }));

    if (updatedResolution) {
      await saveResolution(updatedResolution);
    }
  }, []);

  const deleteResolution = useCallback(async (id: string) => {
    setResolutions(prev => prev.filter(r => r.id !== id));
    await deleteResolutionFromDb(id);
  }, []);

  const reorderResolutions = useCallback((fromIndex: number, toIndex: number) => {
    setResolutions(prev => {
      const newResolutions = [...prev];
      const [removed] = newResolutions.splice(fromIndex, 1);
      newResolutions.splice(toIndex, 0, removed);
      // Save the order to localStorage
      const orderIds = newResolutions.map(r => r.id);
      localStorage.setItem('resolutions-order', JSON.stringify(orderIds));
      return newResolutions;
    });
  }, []);

  const addMilestone = useCallback(async (resolutionId: string, milestone: Partial<Milestone>) => {
    const newMilestone: Milestone = {
      id: generateId(),
      title: '',
      completed: false,
      ...milestone,
    };

    let updatedResolution: Resolution | null = null;

    setResolutions(prev => prev.map(r => {
      if (r.id === resolutionId) {
        updatedResolution = {
          ...r,
          milestones: [...r.milestones, newMilestone],
          updatedAt: new Date().toISOString(),
        };
        return updatedResolution;
      }
      return r;
    }));

    if (updatedResolution) {
      await saveResolution(updatedResolution);
    }
  }, []);

  const updateMilestone = useCallback(async (resolutionId: string, milestoneId: string, updates: Partial<Milestone>) => {
    let updatedResolution: Resolution | null = null;

    setResolutions(prev => prev.map(r => {
      if (r.id === resolutionId) {
        updatedResolution = {
          ...r,
          milestones: r.milestones.map(m =>
            m.id === milestoneId ? { ...m, ...updates } : m
          ),
          updatedAt: new Date().toISOString(),
        };
        return updatedResolution;
      }
      return r;
    }));

    if (updatedResolution) {
      await saveResolution(updatedResolution);
    }
  }, []);

  const deleteMilestone = useCallback(async (resolutionId: string, milestoneId: string) => {
    let updatedResolution: Resolution | null = null;

    setResolutions(prev => prev.map(r => {
      if (r.id === resolutionId) {
        updatedResolution = {
          ...r,
          milestones: r.milestones.filter(m => m.id !== milestoneId),
          updatedAt: new Date().toISOString(),
        };
        return updatedResolution;
      }
      return r;
    }));

    if (updatedResolution) {
      await saveResolution(updatedResolution);
    }
  }, []);

  const toggleMilestone = useCallback(async (resolutionId: string, milestoneId: string) => {
    let updatedResolution: Resolution | null = null;

    setResolutions(prev => prev.map(r => {
      if (r.id !== resolutionId) return r;

      const updatedMilestones = r.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          completed: !m.completed,
          completedAt: !m.completed ? new Date().toISOString() : undefined,
        };
      });

      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const newProgress = updatedMilestones.length > 0
        ? Math.round((completedCount / updatedMilestones.length) * 100)
        : r.progress;

      updatedResolution = {
        ...r,
        milestones: updatedMilestones,
        progress: newProgress,
        updatedAt: new Date().toISOString(),
        completedAt: newProgress === 100 ? new Date().toISOString() : undefined,
      };
      return updatedResolution;
    }));

    if (updatedResolution) {
      await saveResolution(updatedResolution);
    }
  }, []);

  const updateProgress = useCallback(async (resolutionId: string, progress: number) => {
    let updatedResolution: Resolution | null = null;

    setResolutions(prev => prev.map(r => {
      if (r.id === resolutionId) {
        updatedResolution = {
          ...r,
          progress: Math.max(0, Math.min(100, progress)),
          updatedAt: new Date().toISOString(),
          completedAt: progress === 100 ? new Date().toISOString() : undefined,
        };
        return updatedResolution;
      }
      return r;
    }));

    if (updatedResolution) {
      await saveResolution(updatedResolution);
    }
  }, []);

  const addJournalEntry = useCallback(async (resolutionId: string, entry: Partial<JournalEntry>) => {
    const newEntry: JournalEntry = {
      id: generateId(),
      content: '',
      createdAt: new Date().toISOString(),
      ...entry,
    };

    let updatedResolution: Resolution | null = null;

    setResolutions(prev => prev.map(r => {
      if (r.id === resolutionId) {
        updatedResolution = {
          ...r,
          journal: [newEntry, ...(r.journal || [])],
          updatedAt: new Date().toISOString(),
        };
        return updatedResolution;
      }
      return r;
    }));

    if (updatedResolution) {
      await saveResolution(updatedResolution);
    }
  }, []);

  const deleteJournalEntry = useCallback(async (resolutionId: string, entryId: string) => {
    let updatedResolution: Resolution | null = null;

    setResolutions(prev => prev.map(r => {
      if (r.id === resolutionId) {
        updatedResolution = {
          ...r,
          journal: (r.journal || []).filter(e => e.id !== entryId),
          updatedAt: new Date().toISOString(),
        };
        return updatedResolution;
      }
      return r;
    }));

    if (updatedResolution) {
      await saveResolution(updatedResolution);
    }
  }, []);

  const getResolutionsByCategory = useCallback((category: Category | 'all') => {
    if (category === 'all') return resolutions;
    return resolutions.filter(r => r.category === category);
  }, [resolutions]);

  const getUsedCategories = useCallback(() => {
    const categories = new Set<Category>();
    resolutions.forEach(r => categories.add(r.category));
    return Array.from(categories);
  }, [resolutions]);

  const getCompletedCount = useCallback(() => {
    return resolutions.filter(r => r.progress === 100).length;
  }, [resolutions]);

  const getOverallProgress = useCallback(() => {
    if (resolutions.length === 0) return 0;
    const total = resolutions.reduce((sum, r) => sum + r.progress, 0);
    return Math.round(total / resolutions.length);
  }, [resolutions]);

  return (
    <ResolutionContext.Provider
      value={{
        resolutions,
        loading,
        addResolution,
        updateResolution,
        deleteResolution,
        reorderResolutions,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        toggleMilestone,
        updateProgress,
        addJournalEntry,
        deleteJournalEntry,
        getResolutionsByCategory,
        getUsedCategories,
        getCompletedCount,
        getOverallProgress,
      }}
    >
      {children}
    </ResolutionContext.Provider>
  );
}

export function useResolutions() {
  const context = useContext(ResolutionContext);
  if (!context) {
    throw new Error('useResolutions must be used within a ResolutionProvider');
  }
  return context;
}
