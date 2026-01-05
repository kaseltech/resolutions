'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

export type ViewMode = 'dashboard' | 'focus' | 'reflect';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const VIEW_MODE_KEY = 'viewMode';

const ViewModeContext = createContext<ViewModeContextType | null>(null);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved preference
    Preferences.get({ key: VIEW_MODE_KEY }).then(({ value }) => {
      if (value && ['dashboard', 'focus', 'reflect'].includes(value)) {
        setViewModeState(value as ViewMode);
      }
    });
  }, []);

  const setViewMode = async (mode: ViewMode) => {
    setViewModeState(mode);
    await Preferences.set({ key: VIEW_MODE_KEY, value: mode });
  };

  return (
    <ViewModeContext.Provider value={{
      viewMode: mounted ? viewMode : 'dashboard',
      setViewMode
    }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}

// Mode descriptions for UI
export const VIEW_MODE_INFO = {
  dashboard: {
    label: 'Dashboard',
    description: 'Full stats and insights',
    icon: '📊',
  },
  focus: {
    label: 'Focus',
    description: 'Clean view, just your goals',
    icon: '🎯',
  },
  reflect: {
    label: 'Reflect',
    description: 'Journal-first, more atmosphere',
    icon: '✨',
  },
} as const;
