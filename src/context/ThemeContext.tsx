'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ColorScheme = 'navy' | 'charcoal' | 'forest' | 'slate';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  toggleTheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
  colors: typeof navyLightColors;
}

// Color scheme definitions
const COLOR_SCHEMES: Record<ColorScheme, {
  name: string;
  // Dark mode colors
  darkBg: string;
  darkCard: string;
  darkCardHover: string;
  darkCardInset: string;
  darkText: string;
  // Light mode colors
  lightBg: string;
  lightCard: string;
  lightCardHover: string;
  lightCardInset: string;
  lightText: string;
  // Accent (gold stays the same)
  accent: string;
  accentDark: string;
}> = {
  navy: {
    name: 'Navy',
    darkBg: '#0F2233',
    darkCard: '#1A3550',
    darkCardHover: '#162E45',
    darkCardInset: '#0C1F30',
    darkText: '#F4F7FB',
    lightBg: '#EBE7E0',
    lightCard: '#FFFFFF',
    lightCardHover: '#F5F3EE',
    lightCardInset: '#E5E1DA',
    lightText: '#1F3A5A',
    accent: '#C9A75A',
    accentDark: '#D1B061',
  },
  charcoal: {
    name: 'Charcoal',
    darkBg: '#121212',
    darkCard: '#1E1E1E',
    darkCardHover: '#2A2A2A',
    darkCardInset: '#0A0A0A',
    darkText: '#E8E8E8',
    lightBg: '#F0F0F0',
    lightCard: '#FFFFFF',
    lightCardHover: '#F7F7F7',
    lightCardInset: '#E8E8E8',
    lightText: '#1A1A1A',
    accent: '#C9A75A',
    accentDark: '#D4B56A',
  },
  forest: {
    name: 'Forest',
    darkBg: '#0D1A14',
    darkCard: '#152A20',
    darkCardHover: '#1A3528',
    darkCardInset: '#0A1410',
    darkText: '#E8F0EB',
    lightBg: '#E8EDE9',
    lightCard: '#FFFFFF',
    lightCardHover: '#F2F5F3',
    lightCardInset: '#DCE3DD',
    lightText: '#1A2E22',
    accent: '#C9A75A',
    accentDark: '#D4B56A',
  },
  slate: {
    name: 'Slate',
    darkBg: '#0F172A',
    darkCard: '#1E293B',
    darkCardHover: '#283548',
    darkCardInset: '#0B1222',
    darkText: '#E2E8F0',
    lightBg: '#E8ECF0',
    lightCard: '#FFFFFF',
    lightCardHover: '#F1F5F9',
    lightCardInset: '#CBD5E1',
    lightText: '#1E293B',
    accent: '#C9A75A',
    accentDark: '#D4B56A',
  },
};

// Generate colors based on scheme and theme
function generateColors(scheme: ColorScheme, theme: Theme) {
  const s = COLOR_SCHEMES[scheme];

  if (theme === 'light') {
    return {
      // Backgrounds
      bg: s.lightBg,
      cardBg: s.lightCard,
      cardBgHover: s.lightCardHover,
      cardBgInset: s.lightCardInset,
      border: `rgba(${hexToRgb(s.lightText)}, 0.12)`,
      borderSubtle: `rgba(${hexToRgb(s.lightText)}, 0.08)`,

      // Text
      text: s.lightText,
      textMuted: `rgba(${hexToRgb(s.lightText)}, 0.75)`,
      textTertiary: `rgba(${hexToRgb(s.lightText)}, 0.55)`,
      textDisabled: `rgba(${hexToRgb(s.lightText)}, 0.35)`,

      // Primary Accent (Gold)
      accent: s.accent,
      accentHover: s.accentDark,
      accentMuted: `rgba(${hexToRgb(s.accent)}, 0.25)`,

      // Progress Accent (Sage)
      progress: '#5C8B6F',
      progressMuted: 'rgba(92, 139, 111, 0.25)',

      // Input
      inputBg: s.lightCard,

      // Status colors
      success: '#5C8B6F',
      warning: '#C97C5D',
      error: '#B35C5C',

      // Category colors (muted, cohesive)
      health: '#5C8B6F',
      career: s.lightText,
      finance: s.accent,
      personal: '#8B7BA8',
      education: '#5C7A9F',
      social: '#6B9B9B',
      creative: '#B8866B',
      other: '#8B8B8B',
    };
  } else {
    return {
      // Backgrounds
      bg: s.darkBg,
      cardBg: s.darkCard,
      cardBgHover: s.darkCardHover,
      cardBgInset: s.darkCardInset,
      border: `rgba(255, 255, 255, 0.12)`,
      borderSubtle: `rgba(255, 255, 255, 0.08)`,

      // Text
      text: s.darkText,
      textMuted: `rgba(${hexToRgb(s.darkText)}, 0.75)`,
      textTertiary: `rgba(${hexToRgb(s.darkText)}, 0.55)`,
      textDisabled: `rgba(${hexToRgb(s.darkText)}, 0.35)`,

      // Primary Accent (Gold)
      accent: s.accentDark,
      accentHover: '#E2C678',
      accentMuted: `rgba(${hexToRgb(s.accentDark)}, 0.25)`,

      // Progress Accent (Blue)
      progress: '#6FA8FF',
      progressMuted: 'rgba(111, 168, 255, 0.25)',

      // Input
      inputBg: s.darkCard,

      // Status colors
      success: '#6FA8FF',
      warning: '#D98C6D',
      error: '#C36C6C',

      // Category colors (for dark mode)
      health: '#6FA8FF',
      career: '#7A9BC7',
      finance: s.accentDark,
      personal: '#A89BC7',
      education: '#7A9BC7',
      social: '#7AB8B8',
      creative: '#C9A07B',
      other: '#A0A8B0',
    };
  }
}

// Helper to convert hex to rgb values
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

// Default colors for SSR
const navyLightColors = generateColors('navy', 'light');

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('navy');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedScheme = localStorage.getItem('colorScheme') as ColorScheme;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    if (savedScheme && COLOR_SCHEMES[savedScheme]) {
      setColorSchemeState(savedScheme);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
      localStorage.setItem('colorScheme', colorScheme);
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-scheme', colorScheme);
    }
  }, [theme, colorScheme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  };

  const colors = generateColors(colorScheme, theme);

  // Use default theme before mounted to avoid hydration mismatch
  const currentColors = mounted ? colors : navyLightColors;
  const currentTheme = mounted ? theme : 'light';
  const currentScheme = mounted ? colorScheme : 'navy';

  return (
    <ThemeContext.Provider value={{
      theme: currentTheme,
      colorScheme: currentScheme,
      toggleTheme,
      setColorScheme,
      colors: currentColors
    }}>
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

// Export for type inference
export { COLOR_SCHEMES };
export type { ColorScheme };
