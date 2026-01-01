'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

// Cloud Dancer light theme
const lightColors = {
  bg: '#F5F5F0',
  cardBg: '#FFFFFF',
  border: '#E0E0DB',
  text: '#4A4A45',
  textMuted: '#8A8A85',
  accent: '#7A8A70',
  accentHover: '#6A7A60',
  inputBg: '#FFFFFF',
  // Softer category colors for light mode
  health: '#9DB4A0',
  career: '#A0A4B4',
  finance: '#B4A890',
  personal: '#B49DA0',
  education: '#A8A0B4',
  social: '#A0B4B0',
  creative: '#B4A0A8',
  other: '#A8A8A0',
};

// Dark theme
const darkColors = {
  bg: '#0f172a',
  cardBg: '#1e293b',
  border: '#334155',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  accent: '#8A9A80',
  accentHover: '#9AAA90',
  inputBg: '#1e293b',
  // Richer category colors for dark mode
  health: '#4ade80',
  career: '#60a5fa',
  finance: '#fbbf24',
  personal: '#f472b6',
  education: '#a78bfa',
  social: '#2dd4bf',
  creative: '#fb923c',
  other: '#94a3b8',
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

  // Prevent flash by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
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
