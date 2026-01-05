'use client';

import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

// YearVow Brand Colors
const YEAR_COLORS = {
  navy: '#1F3A5A',         // Primary navy
  cream: '#F5F1EA',        // Warm cream
  gold: '#C9A75A',         // Gold accent
};

// Reduced sizes (~10% smaller) for refinement
const sizes = {
  sm: { fontSize: 14 },
  md: { fontSize: 18 },
  lg: { fontSize: 22 },
  xl: { fontSize: 36 },
};

export function Logo({ size = 'md', className = '', animated = false }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { fontSize } = sizes[size];

  // White/off-white on dark, navy on light
  const textColor = isDark ? '#F5F1EA' : YEAR_COLORS.navy;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        position: 'relative',
        fontFamily: 'var(--font-libre-baskerville), Georgia, "Times New Roman", Times, serif',
        fontSize,
        letterSpacing: '0.02em',  // +2% letter-spacing
        lineHeight: 1,
        userSelect: 'none',
        color: textColor,
        fontWeight: 500,  // Medium weight
        transition: animated ? 'opacity 0.15s ease' : undefined,
      }}
    >
      YearVow
      <span style={{
        position: 'absolute',
        bottom: '-0.15em',
        right: '-1.8em',
        color: YEAR_COLORS.gold,
        fontSize: '0.45em',
        fontWeight: 600,
        letterSpacing: '0.05em',
      }}>
        2026
      </span>
    </span>
  );
}

// Export the year colors for use in other components
export { YEAR_COLORS };
