'use client';

import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

// YearVow Brand Colors
const YEAR_COLORS = {
  navy: '#1E3A5F',         // Deep navy blue
  cream: '#F5F1EA',        // Warm cream
  gold: '#C4A35A',         // Gold accent
};

const sizes = {
  sm: { fontSize: 18 },
  md: { fontSize: 24 },
  lg: { fontSize: 32 },
  xl: { fontSize: 48 },
};

export function Logo({ size = 'md', className = '', animated = false }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { fontSize } = sizes[size];

  // Cream text on dark, navy text on light
  const textColor = isDark ? YEAR_COLORS.cream : YEAR_COLORS.navy;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontFamily: 'Georgia, "Times New Roman", Times, serif',
        fontSize,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        userSelect: 'none',
        color: textColor,
        fontWeight: 400,
        transition: animated ? 'opacity 0.3s ease' : undefined,
      }}
    >
      YearVow
    </span>
  );
}

// Export the year colors for use in other components
export { YEAR_COLORS };
