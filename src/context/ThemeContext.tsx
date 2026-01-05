'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

// YearVow light theme - cream background with gold accent
const lightColors = {
  bg: '#EBE7E0',           // Slightly darker cream for depth
  cardBg: '#FDFCFA',       // Bright card surface
  border: 'rgba(30, 58, 95, 0.08)',  // Subtle navy-tinted border
  text: '#1F3A5A',         // Primary navy
  textMuted: 'rgba(31, 58, 90, 0.6)', // 60% opacity navy
  accent: '#C9A75A',       // Gold accent (ONE brand color)
  accentHover: '#B8964A',
  inputBg: '#ffffff',
  // Secondary accent - soft sage for progress/completion
  progress: '#5C8B6F',     // Soft sage green
  progressMuted: 'rgba(92, 139, 111, 0.15)',
  // Status colors (muted - use sparingly)
  success: '#4C8B6F',
  warning: '#C97C5D',
  error: '#B35C5C',
  // Simplified category colors - all muted, cohesive
  health: '#4C8B6F',       // Muted sage (same as success)
  career: '#1F3A5A',       // Navy
  finance: '#C9A75A',      // Gold
  personal: '#8B7BA8',     // Muted purple
  education: '#5C7A9F',    // Muted blue
  social: '#6B9B9B',       // Muted teal
  creative: '#B8866B',     // Muted terracotta
  other: '#8B8B8B',        // Neutral gray
};

// YearVow dark theme - deeper navy background with gold accent
const darkColors = {
  bg: '#152838',           // Deeper navy for more depth
  cardBg: '#1F3A5A',       // Cards use original navy (now lighter than bg)
  border: 'rgba(255, 255, 255, 0.08)', // Subtle white border
  text: '#F5F1EA',         // Cream text
  textMuted: 'rgba(245, 241, 234, 0.7)', // 70% opacity cream
  accent: '#C9A75A',       // Gold accent (same as light)
  accentHover: '#D9B76A',
  inputBg: '#1F3A5A',
  // Secondary accent - soft sage for progress/completion
  progress: '#6B9B7F',     // Soft sage green (brighter for dark mode)
  progressMuted: 'rgba(107, 155, 127, 0.2)',
  // Status colors (muted)
  success: '#5C9B7F',
  warning: '#D98C6D',
  error: '#C36C6C',
  // Category colors for dark
  health: '#5C9B7F',       // Sage
  career: '#7A9BC7',       // Muted blue
  finance: '#C9A75A',      // Gold
  personal: '#A89BC7',     // Muted purple
  education: '#7A9BC7',    // Muted blue
  social: '#7AB8B8',       // Muted teal
  creative: '#C9A07B',     // Terracotta
  other: '#A0A8B0',        // Neutral
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) {
      setTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  // Use default theme before mounted to avoid hydration mismatch
  // but still render children to maintain scroll position
  const currentColors = mounted ? colors : lightColors;
  const currentTheme = mounted ? theme : 'light';

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { lightColors, darkColors };
