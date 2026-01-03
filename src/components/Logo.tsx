'use client';

import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

// 2026 Color Theme - Teal/Emerald for navigation/journey
const YEAR_COLORS = {
  primary: '#0d9488',      // Teal
  secondary: '#14b8a6',    // Lighter teal
  accent: '#2dd4bf',       // Bright teal
  glow: '#5eead4',         // Light glow
};

export function Logo({ size = 40, className = '', animated = false }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colors = {
    compass: YEAR_COLORS,
    ring: isDark ? 'rgba(45, 212, 191, 0.25)' : 'rgba(13, 148, 136, 0.15)',
    bg: isDark ? '#0f172a' : '#ffffff',
    cardinalMarks: isDark ? '#334155' : '#cbd5e1',
  };

  const id = isDark ? 'dark' : 'light';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block' }}
    >
      <defs>
        {/* Compass needle gradient - North */}
        <linearGradient id={`needleNorth-${id}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={colors.compass.glow} />
          <stop offset="100%" stopColor={colors.compass.primary} />
        </linearGradient>

        {/* Compass needle gradient - South */}
        <linearGradient id={`needleSouth-${id}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#475569' : '#94a3b8'} />
          <stop offset="100%" stopColor={isDark ? '#334155' : '#64748b'} />
        </linearGradient>

        {/* Glow filter */}
        <filter id={`compassGlow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer ring */}
      <circle cx="50" cy="50" r="46" fill="none" stroke={colors.ring} strokeWidth="2.5" />

      {/* Background circle */}
      <circle cx="50" cy="50" r="43" fill={colors.bg} />

      {/* Cardinal direction marks */}
      <g stroke={colors.cardinalMarks} strokeWidth="2" strokeLinecap="round">
        {/* N */}
        <line x1="50" y1="12" x2="50" y2="18" />
        {/* E */}
        <line x1="88" y1="50" x2="82" y2="50" />
        {/* S */}
        <line x1="50" y1="88" x2="50" y2="82" />
        {/* W */}
        <line x1="12" y1="50" x2="18" y2="50" />
      </g>

      {/* Minor tick marks */}
      <g stroke={colors.cardinalMarks} strokeWidth="1" strokeLinecap="round" opacity="0.5">
        {/* NE */}
        <line x1="76.5" y1="23.5" x2="72.5" y2="27.5" />
        {/* SE */}
        <line x1="76.5" y1="76.5" x2="72.5" y2="72.5" />
        {/* SW */}
        <line x1="23.5" y1="76.5" x2="27.5" y2="72.5" />
        {/* NW */}
        <line x1="23.5" y1="23.5" x2="27.5" y2="27.5" />
      </g>

      {/* Compass needle */}
      <g filter={`url(#compassGlow-${id})`}>
        {/* North needle (colored) */}
        <path
          d="M50 18 L55 50 L50 54 L45 50 Z"
          fill={`url(#needleNorth-${id})`}
        >
          {animated && (
            <animate
              attributeName="opacity"
              values="0.9;1;0.9"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* South needle (muted) */}
        <path
          d="M50 82 L55 50 L50 46 L45 50 Z"
          fill={`url(#needleSouth-${id})`}
        />
      </g>

      {/* Center pivot */}
      <circle cx="50" cy="50" r="6" fill={colors.bg} stroke={colors.compass.primary} strokeWidth="2" />
      <circle cx="50" cy="50" r="3" fill={colors.compass.accent} />
      <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
    </svg>
  );
}

// Export the year colors for use in other components
export { YEAR_COLORS };
