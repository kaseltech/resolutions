'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ColorTheme = 'navy' | 'charcoal' | 'forest' | 'slate' | 'midnight' | 'plum' | 'coffee' | 'ocean';

interface ThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  colors: typeof COLOR_THEMES['navy']['colors'];
}

// All dark themes with gold accent
const COLOR_THEMES: Record<ColorTheme, {
  name: string;
  preview: string; // Primary color for preview dot
  colors: {
    bg: string;
    cardBg: string;
    cardBgHover: string;
    cardBgInset: string;
    border: string;
    borderSubtle: string;
    text: string;
    textMuted: string;
    textTertiary: string;
    textDisabled: string;
    accent: string;
    accentHover: string;
    accentMuted: string;
    progress: string;
    progressMuted: string;
    inputBg: string;
    success: string;
    warning: string;
    error: string;
    health: string;
    career: string;
    finance: string;
    personal: string;
    education: string;
    social: string;
    creative: string;
    other: string;
  };
}> = {
  navy: {
    name: 'Navy',
    preview: '#0F2233',
    colors: {
      bg: '#0F2233',
      cardBg: '#1A3550',
      cardBgHover: '#162E45',
      cardBgInset: '#0C1F30',
      border: 'rgba(255, 255, 255, 0.12)',
      borderSubtle: 'rgba(255, 255, 255, 0.08)',
      text: '#F4F7FB',
      textMuted: 'rgba(244, 247, 251, 0.75)',
      textTertiary: 'rgba(244, 247, 251, 0.55)',
      textDisabled: 'rgba(244, 247, 251, 0.35)',
      accent: '#D1B061',
      accentHover: '#E2C678',
      accentMuted: 'rgba(209, 176, 97, 0.25)',
      progress: '#6FA8FF',
      progressMuted: 'rgba(111, 168, 255, 0.25)',
      inputBg: '#1A3550',
      success: '#6FA8FF',
      warning: '#D98C6D',
      error: '#C36C6C',
      health: '#6FA8FF',
      career: '#7A9BC7',
      finance: '#D1B061',
      personal: '#A89BC7',
      education: '#7A9BC7',
      social: '#7AB8B8',
      creative: '#C9A07B',
      other: '#A0A8B0',
    },
  },
  charcoal: {
    name: 'Charcoal',
    preview: '#1A1A1A',
    colors: {
      bg: '#121212',
      cardBg: '#1E1E1E',
      cardBgHover: '#2A2A2A',
      cardBgInset: '#0A0A0A',
      border: 'rgba(255, 255, 255, 0.12)',
      borderSubtle: 'rgba(255, 255, 255, 0.08)',
      text: '#E8E8E8',
      textMuted: 'rgba(232, 232, 232, 0.75)',
      textTertiary: 'rgba(232, 232, 232, 0.55)',
      textDisabled: 'rgba(232, 232, 232, 0.35)',
      accent: '#D4B56A',
      accentHover: '#E5C87A',
      accentMuted: 'rgba(212, 181, 106, 0.25)',
      progress: '#6FA8FF',
      progressMuted: 'rgba(111, 168, 255, 0.25)',
      inputBg: '#1E1E1E',
      success: '#6FA8FF',
      warning: '#D98C6D',
      error: '#C36C6C',
      health: '#6FA8FF',
      career: '#9CA3AF',
      finance: '#D4B56A',
      personal: '#A89BC7',
      education: '#7A9BC7',
      social: '#7AB8B8',
      creative: '#C9A07B',
      other: '#9CA3AF',
    },
  },
  midnight: {
    name: 'Midnight',
    preview: '#08080A',
    colors: {
      bg: '#08080A',
      cardBg: '#131316',
      cardBgHover: '#1A1A1E',
      cardBgInset: '#050506',
      border: 'rgba(255, 255, 255, 0.10)',
      borderSubtle: 'rgba(255, 255, 255, 0.06)',
      text: '#FAFAFA',
      textMuted: 'rgba(250, 250, 250, 0.70)',
      textTertiary: 'rgba(250, 250, 250, 0.50)',
      textDisabled: 'rgba(250, 250, 250, 0.30)',
      accent: '#D4B56A',
      accentHover: '#E5C87A',
      accentMuted: 'rgba(212, 181, 106, 0.20)',
      progress: '#8B9FFF',
      progressMuted: 'rgba(139, 159, 255, 0.25)',
      inputBg: '#131316',
      success: '#8B9FFF',
      warning: '#E5A07A',
      error: '#E57070',
      health: '#8B9FFF',
      career: '#A0A8B0',
      finance: '#D4B56A',
      personal: '#B8A0D0',
      education: '#8B9FFF',
      social: '#7AB8B8',
      creative: '#D4A07A',
      other: '#A0A8B0',
    },
  },
  forest: {
    name: 'Forest',
    preview: '#0D1A14',
    colors: {
      bg: '#0D1A14',
      cardBg: '#152A20',
      cardBgHover: '#1A3528',
      cardBgInset: '#0A1410',
      border: 'rgba(255, 255, 255, 0.12)',
      borderSubtle: 'rgba(255, 255, 255, 0.08)',
      text: '#E8F0EB',
      textMuted: 'rgba(232, 240, 235, 0.75)',
      textTertiary: 'rgba(232, 240, 235, 0.55)',
      textDisabled: 'rgba(232, 240, 235, 0.35)',
      accent: '#C9A75A',
      accentHover: '#DABB6A',
      accentMuted: 'rgba(201, 167, 90, 0.25)',
      progress: '#6BBF8A',
      progressMuted: 'rgba(107, 191, 138, 0.25)',
      inputBg: '#152A20',
      success: '#6BBF8A',
      warning: '#D9A06D',
      error: '#C77070',
      health: '#6BBF8A',
      career: '#7A9B8C',
      finance: '#C9A75A',
      personal: '#A89BB8',
      education: '#7A9BC7',
      social: '#6BBF8A',
      creative: '#C9A07B',
      other: '#8FA098',
    },
  },
  slate: {
    name: 'Slate',
    preview: '#0F172A',
    colors: {
      bg: '#0F172A',
      cardBg: '#1E293B',
      cardBgHover: '#283548',
      cardBgInset: '#0B1222',
      border: 'rgba(255, 255, 255, 0.12)',
      borderSubtle: 'rgba(255, 255, 255, 0.08)',
      text: '#E2E8F0',
      textMuted: 'rgba(226, 232, 240, 0.75)',
      textTertiary: 'rgba(226, 232, 240, 0.55)',
      textDisabled: 'rgba(226, 232, 240, 0.35)',
      accent: '#D4B56A',
      accentHover: '#E5C87A',
      accentMuted: 'rgba(212, 181, 106, 0.25)',
      progress: '#60A5FA',
      progressMuted: 'rgba(96, 165, 250, 0.25)',
      inputBg: '#1E293B',
      success: '#60A5FA',
      warning: '#FB923C',
      error: '#F87171',
      health: '#60A5FA',
      career: '#94A3B8',
      finance: '#D4B56A',
      personal: '#A78BFA',
      education: '#60A5FA',
      social: '#5EEAD4',
      creative: '#FB923C',
      other: '#94A3B8',
    },
  },
  plum: {
    name: 'Plum',
    preview: '#1A0F1F',
    colors: {
      bg: '#1A0F1F',
      cardBg: '#2A1A32',
      cardBgHover: '#352040',
      cardBgInset: '#140A18',
      border: 'rgba(255, 255, 255, 0.12)',
      borderSubtle: 'rgba(255, 255, 255, 0.08)',
      text: '#F0E8F4',
      textMuted: 'rgba(240, 232, 244, 0.75)',
      textTertiary: 'rgba(240, 232, 244, 0.55)',
      textDisabled: 'rgba(240, 232, 244, 0.35)',
      accent: '#D4B56A',
      accentHover: '#E5C87A',
      accentMuted: 'rgba(212, 181, 106, 0.25)',
      progress: '#C084FC',
      progressMuted: 'rgba(192, 132, 252, 0.25)',
      inputBg: '#2A1A32',
      success: '#A78BFA',
      warning: '#F0A060',
      error: '#F87171',
      health: '#A78BFA',
      career: '#B8A0C8',
      finance: '#D4B56A',
      personal: '#C084FC',
      education: '#A78BFA',
      social: '#E879F9',
      creative: '#F0A060',
      other: '#A8A0B0',
    },
  },
  coffee: {
    name: 'Coffee',
    preview: '#1A1410',
    colors: {
      bg: '#1A1410',
      cardBg: '#2A221A',
      cardBgHover: '#352A20',
      cardBgInset: '#14100C',
      border: 'rgba(255, 255, 255, 0.12)',
      borderSubtle: 'rgba(255, 255, 255, 0.08)',
      text: '#F4EDE6',
      textMuted: 'rgba(244, 237, 230, 0.75)',
      textTertiary: 'rgba(244, 237, 230, 0.55)',
      textDisabled: 'rgba(244, 237, 230, 0.35)',
      accent: '#D4A860',
      accentHover: '#E5BB70',
      accentMuted: 'rgba(212, 168, 96, 0.25)',
      progress: '#D4A070',
      progressMuted: 'rgba(212, 160, 112, 0.25)',
      inputBg: '#2A221A',
      success: '#A8C080',
      warning: '#E5A060',
      error: '#D07070',
      health: '#A8C080',
      career: '#C0A890',
      finance: '#D4A860',
      personal: '#C0A0B8',
      education: '#A0B8C0',
      social: '#A8C080',
      creative: '#E5A060',
      other: '#A8A098',
    },
  },
  ocean: {
    name: 'Ocean',
    preview: '#0A1520',
    colors: {
      bg: '#0A1520',
      cardBg: '#122535',
      cardBgHover: '#183045',
      cardBgInset: '#060E18',
      border: 'rgba(255, 255, 255, 0.12)',
      borderSubtle: 'rgba(255, 255, 255, 0.08)',
      text: '#E6F0F8',
      textMuted: 'rgba(230, 240, 248, 0.75)',
      textTertiary: 'rgba(230, 240, 248, 0.55)',
      textDisabled: 'rgba(230, 240, 248, 0.35)',
      accent: '#D4B56A',
      accentHover: '#E5C87A',
      accentMuted: 'rgba(212, 181, 106, 0.25)',
      progress: '#22D3EE',
      progressMuted: 'rgba(34, 211, 238, 0.25)',
      inputBg: '#122535',
      success: '#22D3EE',
      warning: '#F0A060',
      error: '#F87171',
      health: '#22D3EE',
      career: '#7AA8C0',
      finance: '#D4B56A',
      personal: '#A0B8D0',
      education: '#60A5FA',
      social: '#22D3EE',
      creative: '#F0A060',
      other: '#90A8B8',
    },
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('navy');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('colorTheme') as ColorTheme;
    if (saved && COLOR_THEMES[saved]) {
      setColorThemeState(saved);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('colorTheme', colorTheme);
      document.documentElement.setAttribute('data-theme', colorTheme);
    }
  }, [colorTheme, mounted]);

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
  };

  const colors = COLOR_THEMES[colorTheme].colors;
  const currentTheme = mounted ? colorTheme : 'navy';
  const currentColors = mounted ? colors : COLOR_THEMES['navy'].colors;

  return (
    <ThemeContext.Provider value={{
      colorTheme: currentTheme,
      setColorTheme,
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

export { COLOR_THEMES };
export type { ColorTheme };
