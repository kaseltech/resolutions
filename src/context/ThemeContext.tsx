'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

// YearVow Light Theme - LOCKED DESIGN TOKENS
const lightColors = {
  // Backgrounds
  bg: '#EBE7E0',                      // --bg-app
  cardBg: '#FFFFFF',                  // --bg-surface-1
  cardBgHover: '#F5F3EE',             // --bg-surface-2
  cardBgInset: '#E5E1DA',             // --bg-surface-3
  border: 'rgba(31, 58, 90, 0.12)',   // --border-default
  borderSubtle: 'rgba(31, 58, 90, 0.08)', // --border-subtle

  // Text
  text: '#1F3A5A',                    // --text-primary
  textMuted: 'rgba(31, 58, 90, 0.75)', // --text-secondary
  textTertiary: 'rgba(31, 58, 90, 0.55)', // --text-tertiary
  textDisabled: 'rgba(31, 58, 90, 0.35)', // --text-disabled

  // Primary Accent (Gold)
  accent: '#C9A75A',                  // --accent-primary
  accentHover: '#D4B56A',             // --accent-primary-hover
  accentMuted: 'rgba(201, 167, 90, 0.25)', // --accent-primary-muted

  // Progress Accent (Sage)
  progress: '#5C8B6F',                // --accent-progress
  progressMuted: 'rgba(92, 139, 111, 0.25)', // --accent-progress-muted

  // Input
  inputBg: '#FFFFFF',

  // Status colors (use sparingly)
  success: '#5C8B6F',
  warning: '#C97C5D',
  error: '#B35C5C',

  // Category colors (muted, cohesive)
  health: '#5C8B6F',
  career: '#1F3A5A',
  finance: '#C9A75A',
  personal: '#8B7BA8',
  education: '#5C7A9F',
  social: '#6B9B9B',
  creative: '#B8866B',
  other: '#8B8B8B',
};

// YearVow Dark Theme - LOCKED DESIGN TOKENS
const darkColors = {
  // Backgrounds
  bg: '#0F2233',                      // --bg-app
  cardBg: '#1A3550',                  // --bg-surface-1
  cardBgHover: '#162E45',             // --bg-surface-2
  cardBgInset: '#0C1F30',             // --bg-surface-3
  border: 'rgba(255, 255, 255, 0.12)', // --border-default
  borderSubtle: 'rgba(255, 255, 255, 0.08)', // --border-subtle

  // Text
  text: '#F4F7FB',                    // --text-primary
  textMuted: 'rgba(244, 247, 251, 0.75)', // --text-secondary
  textTertiary: 'rgba(244, 247, 251, 0.55)', // --text-tertiary
  textDisabled: 'rgba(244, 247, 251, 0.35)', // --text-disabled

  // Primary Accent (Gold)
  accent: '#D1B061',                  // --accent-primary
  accentHover: '#E2C678',             // --accent-primary-hover
  accentMuted: 'rgba(209, 176, 97, 0.25)', // --accent-primary-muted

  // Progress Accent (Blue)
  progress: '#6FA8FF',                // --accent-progress
  progressMuted: 'rgba(111, 168, 255, 0.25)', // --accent-progress-muted

  // Input
  inputBg: '#1A3550',

  // Status colors
  success: '#6FA8FF',
  warning: '#D98C6D',
  error: '#C36C6C',

  // Category colors (for dark mode)
  health: '#6FA8FF',
  career: '#7A9BC7',
  finance: '#D1B061',
  personal: '#A89BC7',
  education: '#7A9BC7',
  social: '#7AB8B8',
  creative: '#C9A07B',
  other: '#A0A8B0',
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
