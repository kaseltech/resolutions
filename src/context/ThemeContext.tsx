'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

// Rugged outdoorsy light theme - slate, forest, earth tones
const lightColors = {
  bg: '#f1f5f9',
  cardBg: '#ffffff',
  border: '#cbd5e1',
  text: '#1e293b',
  textMuted: '#64748b',
  accent: '#047857',
  accentHover: '#065f46',
  inputBg: '#ffffff',
  // Earthy category colors
  health: '#059669',
  career: '#0369a1',
  finance: '#b45309',
  personal: '#7c3aed',
  education: '#1d4ed8',
  social: '#0891b2',
  creative: '#c2410c',
  other: '#475569',
};

// Dark theme - deep wilderness night
const darkColors = {
  bg: '#0f172a',
  cardBg: '#1e293b',
  border: '#334155',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  accent: '#10b981',
  accentHover: '#34d399',
  inputBg: '#1e293b',
  // Vibrant category colors for dark
  health: '#34d399',
  career: '#38bdf8',
  finance: '#fbbf24',
  personal: '#a78bfa',
  education: '#60a5fa',
  social: '#22d3ee',
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
