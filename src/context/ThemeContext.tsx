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
  bg: '#F5F1EA',           // Warm cream background
  cardBg: '#ffffff',
  border: '#E8E4DD',       // Cream border
  text: '#1E3A5F',         // Navy text
  textMuted: '#6B7B8F',
  accent: '#C4A35A',       // Gold accent (simplified)
  accentHover: '#B8974E',
  inputBg: '#ffffff',
  // Simplified category colors - muted tones
  health: '#6B8E6B',       // Muted sage
  career: '#1E3A5F',       // Navy
  finance: '#C4A35A',      // Gold
  personal: '#8B7BA8',     // Muted purple
  education: '#5C7A9F',    // Muted blue
  social: '#6B9B9B',       // Muted teal
  creative: '#B8866B',     // Muted terracotta
  other: '#8B8B8B',        // Neutral gray
};

// YearVow dark theme - navy background with gold accent
const darkColors = {
  bg: '#1E3A5F',           // Navy background
  cardBg: '#2A4A6F',       // Lighter navy
  border: '#3A5A7F',
  text: '#F5F1EA',         // Cream text
  textMuted: '#B8C4D0',
  accent: '#C4A35A',       // Gold accent
  accentHover: '#D4B36A',
  inputBg: '#2A4A6F',
  // Muted category colors for dark - slightly brighter than light
  health: '#7FB07F',       // Sage
  career: '#7A9BC7',       // Muted blue
  finance: '#C4A35A',      // Gold
  personal: '#A89BC7',     // Muted purple
  education: '#7A9BC7',    // Muted blue
  social: '#7AB8B8',       // Muted teal
  creative: '#C9A07B',     // Terracotta
  other: '#B8C4D0',        // Neutral
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
