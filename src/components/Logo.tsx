'use client';

import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

// YearVow Brand Colors
const YEAR_COLORS = {
  primary: '#0F1C2E',      // Midnight blue
  secondary: '#1A2B3C',    // Lighter midnight
  accent: '#2A4A6A',       // Accent blue
  glow: '#F6F4EF',         // Warm neutral
};

const sizes = {
  sm: { fontSize: 18, letterSpacing: -0.5 },
  md: { fontSize: 24, letterSpacing: -0.75 },
  lg: { fontSize: 32, letterSpacing: -1 },
  xl: { fontSize: 48, letterSpacing: -1.5 },
};

export function Logo({ size = 'md', className = '', animated = false }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { fontSize, letterSpacing } = sizes[size];

  // Color scheme: "Year" is subtle, "Vow" is standout
  const yearColor = isDark ? '#94A3B8' : '#64748B';  // Muted
  const vowColor = isDark ? '#F6F4EF' : '#0F1C2E';   // Standout

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        fontSize,
        letterSpacing,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      <span
        style={{
          fontWeight: 300,
          color: yearColor,
          transition: animated ? 'opacity 0.3s ease' : undefined,
        }}
      >
        Year
      </span>
      <span
        style={{
          fontWeight: 700,
          color: vowColor,
          transition: animated ? 'transform 0.3s ease' : undefined,
        }}
      >
        Vow
      </span>
    </span>
  );
}

// Export the year colors for use in other components
export { YEAR_COLORS };
