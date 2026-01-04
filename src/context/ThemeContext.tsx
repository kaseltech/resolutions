'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

// YearVow light theme - cream background with navy accent
const lightColors = {
  bg: '#F5F1EA',           // Warm cream background
  cardBg: '#ffffff',
  border: '#E8E4DD',       // Cream border
  text: '#1E3A5F',         // Navy text
  textMuted: '#6B7B8F',
  accent: '#1E3A5F',       // Navy accent
  accentHover: '#2A4A6F',
  inputBg: '#ffffff',
  // Category colors
  health: '#059669',
  career: '#1E3A5F',
  finance: '#C4A35A',
  personal: '#7c3aed',
  education: '#1d4ed8',
  social: '#0891b2',
  creative: '#c2410c',
  other: '#6B7B8F',
};

// YearVow dark theme - navy background with cream accents
const darkColors = {
  bg: '#1E3A5F',           // Navy background
  cardBg: '#2A4A6F',       // Lighter navy
  border: '#3A5A7F',
  text: '#F5F1EA',         // Cream text
  textMuted: '#B8C4D0',
  accent: '#C4A35A',       // Gold accent for dark mode
  accentHover: '#D4B36A',
  inputBg: '#2A4A6F',
  // Vibrant category colors for dark
  health: '#34d399',
  career: '#60a5fa',
  finance: '#C4A35A',
  personal: '#a78bfa',
  education: '#60a5fa',
  social: '#22d3ee',
  creative: '#fb923c',
  other: '#B8C4D0',
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
