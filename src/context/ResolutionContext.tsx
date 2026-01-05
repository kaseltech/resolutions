'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Resolution, Milestone, Category, JournalEntry, CheckIn, TrackingType } from '@/types';
import { loadResolutions, saveResolution, deleteResolutionFromDb, generateId, createResolution } from '@/lib/storage';
import { Preferences } from '@capacitor/preferences';
import { celebrationHaptic, progressHaptic } from '@/lib/haptics';
import { scheduleReminder, cancelReminder, syncReminders, initNotificationListeners } from '@/lib/reminders';

// Helper to get local date string (YYYY-MM-DD) in user's timezone
function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface ResolutionContextType {
  resolutions: Resolution[];
  loading: boolean;
  showCelebration: boolean;
  celebrationMessage: string | null;
  dismissCelebration: () => void;
  addResolution: (resolution: Partial<Resolution>) => Promise<void>;
  updateResolution: (id: string, updates: Partial<Resolution>) => Promise<void>;
  deleteResolution: (id: string) => Promise<void>;
  reorderResolutions: (fromIndex: number, toIndex: number) => void;
  addMilestone: (resolutionId: string, milestone: Partial<Milestone>) => Promise<void>;
  updateMilestone: (resolutionId: string, milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (resolutionId: string, milestoneId: string) => Promise<void>;
  toggleMilestone: (resolutionId: string, milestoneId: string) => Promise<void>;
  updateProgress: (resolutionId: string, progress: number) => Promise<void>;
  addCheckIn: (resolutionId: string, checkIn?: Partial<CheckIn>) => Promise<void>;
  removeCheckIn: (resolutionId: string, checkInId: string) => Promise<void>;
  updateCumulativeValue: (resolutionId: string, value: number) => Promise<void>;
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
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  const triggerCelebration = useCallback((title: string) => {
    setShowCelebration(true);
    setCelebrationMessage(`You completed "${title}"!`);
    celebrationHaptic();
  }, []);

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
    setCelebrationMessage(null);
  }, []);

  // Track if reminders have been synced
  const remindersSynced = useRef(false);

  // Load resolutions from Supabase on mount
  useEffect(() => {
    async function load() {
      try {
        let data = await loadResolutions();

        // Create a sample resolution for new users
        if (data.length === 0) {
          const { value: hasCreatedSample } = await Preferences.get({ key: 'hasCreatedSampleResolution' });
          if (hasCreatedSample !== 'true') {
            const sampleResolution = createResolution({
              title: 'Complete my first resolution',
              description: 'This is a sample resolution to help you get started. Tap this card to edit it, update your progress, or delete it and create your own!',
              category: 'personal',
              progress: 25,
              milestones: [
                { id: generateId(), title: 'Download the app', completed: true },
                { id: generateId(), title: 'Create my first real resolution', completed: false },
                { id: generateId(), title: 'Track my progress regularly', completed: false },
                { id: generateId(), title: 'Celebrate when I hit 100%!', completed: false },
              ],
            });
            await saveResolution(sampleResolution);
            await Preferences.set({ key: 'hasCreatedSampleResolution', value: 'true' });
            data = [sampleResolution];
          }
        }

        // Restore saved order from localStorage
        const savedOrder = localStorage.getItem('resolutions-order');
        let orderedData = data;
        if (savedOrder) {
          try {
            const orderIds = JSON.parse(savedOrder) as string[];
            orderedData = [...data].sort((a, b) => {
              const aIndex = orderIds.indexOf(a.id);
              const bIndex = orderIds.indexOf(b.id);
              // Items not in saved order go to the end
              if (aIndex === -1 && bIndex === -1) return 0;
              if (aIndex === -1) return 1;
              if (bIndex === -1) return -1;
              return aIndex - bIndex;
            });
          } catch {
            orderedData = data;
          }
        }
        setResolutions(orderedData);

        // Sync reminders on initial load (only once)
        if (!remindersSynced.current && orderedData.length > 0) {
          remindersSynced.current = true;
          syncReminders(orderedData).catch(console.error);
        }

        // Initialize notification listeners
        initNotificationListeners(
          // On notification received while app is open
          (resolutionId) => {
            console.log('Reminder received for resolution:', resolutionId);
          },
          // On notification tapped
          (resolutionId) => {
            console.log('User tapped reminder for resolution:', resolutionId);
            // Could navigate to the resolution or show it
          }
        );
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

    // Schedule reminder if enabled
    if (newResolution.reminder?.enabled) {
      scheduleReminder(newResolution).catch(console.error);
    }
  }, []);

  const updateResolution = useCallback(async (id: string, updates: Partial<Resolution>) => {
    let updatedResolution: Resolution | null = null;
    let previousReminder: Resolution['reminder'] | undefined;

    setResolutions(prev => prev.map(r => {
      if (r.id === id) {
        previousReminder = r.reminder;
        updatedResolution = { ...r, ...updates, updatedAt: new Date().toISOString() };
        return updatedResolution;
      }
      return r;
    }));

    if (updatedResolution) {
      const resolution = updatedResolution as Resolution;
      await saveResolution(resolution);

      // Handle reminder changes
      const reminderChanged =
        updates.reminder !== undefined ||
        previousReminder?.enabled !== resolution.reminder?.enabled ||
        previousReminder?.frequency !== resolution.reminder?.frequency ||
        previousReminder?.time !== resolution.reminder?.time;

      if (reminderChanged) {
        if (resolution.reminder?.enabled && resolution.progress < 100) {
          scheduleReminder(resolution).catch(console.error);
        } else {
          cancelReminder(id).catch(console.error);
        }
      }
    }
  }, []);

  const deleteResolution = useCallback(async (id: string) => {
    setResolutions(prev => prev.filter(r => r.id !== id));
    await deleteResolutionFromDb(id);
    // Cancel any scheduled reminder
    cancelReminder(id).catch(console.error);
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
    let wasAlreadyComplete = false;
    let title = '';
    let newProgress = 0;

    setResolutions(prev => prev.map(r => {
      if (r.id !== resolutionId) return r;

      wasAlreadyComplete = r.progress === 100;
      title = r.title;

      const updatedMilestones = r.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          completed: !m.completed,
          completedAt: !m.completed ? new Date().toISOString() : undefined,
        };
      });

      const completedCount = updatedMilestones.filter(m => m.completed).length;
      newProgress = updatedMilestones.length > 0
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

      // Trigger celebration when hitting 100% for the first time
      if (newProgress === 100 && !wasAlreadyComplete) {
        triggerCelebration(title);
      } else {
        progressHaptic();
      }
    }
  }, [triggerCelebration]);

  const updateProgress = useCallback(async (resolutionId: string, progress: number) => {
    let updatedResolution: Resolution | null = null;
    let wasAlreadyComplete = false;
    let title = '';

    setResolutions(prev => prev.map(r => {
      if (r.id === resolutionId) {
        wasAlreadyComplete = r.progress === 100;
        title = r.title;
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

      // Trigger celebration when hitting 100% for the first time
      if (progress === 100 && !wasAlreadyComplete) {
        triggerCelebration(title);
        // Cancel reminder since resolution is complete
        cancelReminder(resolutionId).catch(console.error);
      } else {
        // Regular progress haptic
        progressHaptic();
      }
    }
  }, [triggerCelebration]);

  // Add a check-in for frequency tracking
  const addCheckIn = useCallback(async (resolutionId: string, checkIn?: Partial<CheckIn>) => {
    const today = getLocalDateString();
    const newCheckIn: CheckIn = {
      id: generateId(),
      date: today,
      ...checkIn,
    };

    let updatedResolution: Resolution | null = null;

    setResolutions(prev => prev.map(r => {
      if (r.id === resolutionId) {
        updatedResolution = {
          ...r,
          checkIns: [...(r.checkIns || []), newCheckIn],
          updatedAt: new Date().toISOString(),
        };
        return updatedResolution;
      }
      return r;
    }));

    if (updatedResolution) {
      await saveResolution(updatedResolution);
      progressHaptic();
    }
  }, []);

  // Remove a check-in (e.g., undo today's check-in)
  const removeCheckIn = useCallback(async (resolutionId: string, checkInId: string) => {
    let updatedResolution: Resolution | null = null;

    setResolutions(prev => prev.map(r => {
      if (r.id === resolutionId) {
        updatedResolution = {
          ...r,
          checkIns: (r.checkIns || []).filter(c => c.id !== checkInId),
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

  // Update cumulative value (e.g., add $100 to savings goal)
  const updateCumulativeValue = useCallback(async (resolutionId: string, value: number) => {
    let updatedResolution: Resolution | null = null;
    let wasAlreadyComplete = false;
    let title = '';
    let reachedTarget = false;

    setResolutions(prev => prev.map(r => {
      if (r.id === resolutionId) {
        wasAlreadyComplete = r.currentValue !== undefined && r.targetValue !== undefined && r.currentValue >= r.targetValue;
        title = r.title;
        const newValue = Math.max(0, value);
        reachedTarget = r.targetValue !== undefined && newValue >= r.targetValue;

        // Calculate progress percentage for cumulative type
        const progress = r.targetValue ? Math.round((newValue / r.targetValue) * 100) : 0;

        updatedResolution = {
          ...r,
          currentValue: newValue,
          progress: Math.min(100, progress),
          updatedAt: new Date().toISOString(),
          completedAt: reachedTarget && !wasAlreadyComplete ? new Date().toISOString() : r.completedAt,
        };
        return updatedResolution;
      }
      return r;
    }));

    if (updatedResolution) {
      await saveResolution(updatedResolution);

      if (reachedTarget && !wasAlreadyComplete) {
        triggerCelebration(title);
        cancelReminder(resolutionId).catch(console.error);
      } else {
        progressHaptic();
      }
    }
  }, [triggerCelebration]);

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
        showCelebration,
        celebrationMessage,
        dismissCelebration,
        addResolution,
        updateResolution,
        deleteResolution,
        reorderResolutions,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        toggleMilestone,
        updateProgress,
        addCheckIn,
        removeCheckIn,
        updateCumulativeValue,
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
