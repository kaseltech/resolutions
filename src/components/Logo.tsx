'use client';

import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Light theme colors
  const lightColors = {
    skyStart: '#F8F8F5',
    skyMid: '#F0F0EB',
    skyEnd: '#E8E8E3',
    outerRing: '#D8D8D3',
    distantStars: '#C8C8C0',
    starStart: '#D4C9A8',
    starMid: '#C4B898',
    starEnd: '#B5A888',
    centerStart: '#FFFEF5',
    centerEnd: '#F5F0E0',
    centerCore: '#FFFEF8',
    accentStart: '#9AAA90',
    accentEnd: '#8A9A80',
    text: '#6A6A65',
  };

  // Dark theme colors - deeper, richer tones
  const darkColors = {
    skyStart: '#1e293b',
    skyMid: '#1a2332',
    skyEnd: '#0f172a',
    outerRing: '#475569',
    distantStars: '#94a3b8',
    starStart: '#fbbf24',
    starMid: '#f59e0b',
    starEnd: '#d97706',
    centerStart: '#fef3c7',
    centerEnd: '#fde68a',
    centerCore: '#fffbeb',
    accentStart: '#4ade80',
    accentEnd: '#22c55e',
    text: '#e2e8f0',
  };

  const c = isDark ? darkColors : lightColors;

  // Unique ID suffix to avoid conflicts when multiple logos are rendered
  const idSuffix = isDark ? '-dark' : '-light';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* North Star - Guidance, Direction, Hope, Stability */}
      <defs>
        <linearGradient id={`skyGradient${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.skyStart} />
          <stop offset="50%" stopColor={c.skyMid} />
          <stop offset="100%" stopColor={c.skyEnd} />
        </linearGradient>
        <linearGradient id={`starGradient${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.starStart} />
          <stop offset="50%" stopColor={c.starMid} />
          <stop offset="100%" stopColor={c.starEnd} />
        </linearGradient>
        <linearGradient id={`starCenterGradient${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.centerStart} />
          <stop offset="100%" stopColor={c.centerEnd} />
        </linearGradient>
        <linearGradient id={`accentGradient${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.accentStart} />
          <stop offset="100%" stopColor={c.accentEnd} />
        </linearGradient>
        <filter id={`starGlow${idSuffix}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={isDark ? "3" : "2"} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id={`softShadow${idSuffix}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={isDark ? "#00000040" : "#00000010"}/>
        </filter>
      </defs>

      {/* Main circle background */}
      <circle cx="50" cy="50" r="48" fill={`url(#skyGradient${idSuffix})`} filter={`url(#softShadow${idSuffix})`} />

      {/* Subtle outer ring */}
      <circle cx="50" cy="50" r="46" stroke={c.outerRing} strokeWidth="1" fill="none" />

      {/* Distant stars - subtle background */}
      <circle cx="25" cy="30" r="1" fill={c.distantStars} opacity={isDark ? "0.8" : "0.6"} />
      <circle cx="75" cy="25" r="0.8" fill={c.distantStars} opacity={isDark ? "0.7" : "0.5"} />
      <circle cx="20" cy="55" r="0.6" fill={c.distantStars} opacity={isDark ? "0.6" : "0.4"} />
      <circle cx="80" cy="45" r="0.7" fill={c.distantStars} opacity={isDark ? "0.7" : "0.5"} />
      <circle cx="30" cy="70" r="0.5" fill={c.distantStars} opacity={isDark ? "0.5" : "0.3"} />
      <circle cx="70" cy="72" r="0.6" fill={c.distantStars} opacity={isDark ? "0.6" : "0.4"} />

      {/* North Star - Main 4-point star */}
      <g filter={`url(#starGlow${idSuffix})`}>
        {/* Vertical beam */}
        <polygon
          points="50,15 52,45 50,50 48,45"
          fill={`url(#starGradient${idSuffix})`}
        />
        <polygon
          points="50,85 52,55 50,50 48,55"
          fill={`url(#starGradient${idSuffix})`}
        />

        {/* Horizontal beam */}
        <polygon
          points="15,50 45,48 50,50 45,52"
          fill={`url(#starGradient${idSuffix})`}
        />
        <polygon
          points="85,50 55,48 50,50 55,52"
          fill={`url(#starGradient${idSuffix})`}
        />

        {/* Diagonal beams - smaller, for 8-point effect */}
        <polygon
          points="26,26 44,46 50,50 46,44"
          fill={`url(#starGradient${idSuffix})`}
          opacity="0.7"
        />
        <polygon
          points="74,26 56,46 50,50 54,44"
          fill={`url(#starGradient${idSuffix})`}
          opacity="0.7"
        />
        <polygon
          points="26,74 44,54 50,50 46,56"
          fill={`url(#starGradient${idSuffix})`}
          opacity="0.7"
        />
        <polygon
          points="74,74 56,54 50,50 54,56"
          fill={`url(#starGradient${idSuffix})`}
          opacity="0.7"
        />
      </g>

      {/* Star center - bright core */}
      <circle cx="50" cy="50" r="6" fill={`url(#starCenterGradient${idSuffix})`} />
      <circle cx="50" cy="50" r="3" fill={c.centerCore} />

      {/* Subtle horizon line at bottom */}
      <path
        d="M 10 75 Q 50 70 90 75"
        stroke={`url(#accentGradient${idSuffix})`}
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />

      {/* 2026 text - grounded below the star */}
      <text
        x="50"
        y="93"
        textAnchor="middle"
        fill={c.text}
        fontSize="12"
        fontWeight="600"
        fontFamily="Arial, sans-serif"
        letterSpacing="0.05em"
      >
        2026
      </text>
    </svg>
  );
}
