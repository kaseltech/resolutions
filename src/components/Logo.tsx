'use client';

import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Light theme - rugged outdoorsy colors
  const lightColors = {
    skyStart: '#2d3a3a',
    skyMid: '#1f2937',
    skyEnd: '#111827',
    outerRing: '#4b5563',
    distantStars: '#9ca3af',
    starStart: '#f5f5f4',
    starMid: '#e7e5e4',
    starEnd: '#d6d3d1',
    centerCore: '#ffffff',
    accentStart: '#059669',
    accentEnd: '#047857',
    text: '#d1d5db',
    mountainDark: '#1f2937',
    mountainMid: '#374151',
    mountainLight: '#4b5563',
  };

  // Dark theme - deeper wilderness night
  const darkColors = {
    skyStart: '#0c1222',
    skyMid: '#0a0f1a',
    skyEnd: '#050810',
    outerRing: '#334155',
    distantStars: '#cbd5e1',
    starStart: '#fafaf9',
    starMid: '#f5f5f4',
    starEnd: '#e7e5e4',
    centerCore: '#ffffff',
    accentStart: '#10b981',
    accentEnd: '#059669',
    text: '#e2e8f0',
    mountainDark: '#1e293b',
    mountainMid: '#334155',
    mountainLight: '#475569',
  };

  const c = isDark ? darkColors : lightColors;
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
      <defs>
        <linearGradient id={`skyGradient${idSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.skyStart} />
          <stop offset="50%" stopColor={c.skyMid} />
          <stop offset="100%" stopColor={c.skyEnd} />
        </linearGradient>
        <linearGradient id={`starGradient${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.starStart} />
          <stop offset="50%" stopColor={c.starMid} />
          <stop offset="100%" stopColor={c.starEnd} />
        </linearGradient>
        <linearGradient id={`mountainGradient${idSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.mountainLight} />
          <stop offset="100%" stopColor={c.mountainDark} />
        </linearGradient>
        <filter id={`starGlow${idSuffix}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main circle - night sky */}
      <circle cx="50" cy="50" r="48" fill={`url(#skyGradient${idSuffix})`} />
      <circle cx="50" cy="50" r="47" stroke={c.outerRing} strokeWidth="2" fill="none" />

      {/* Distant stars */}
      <circle cx="20" cy="25" r="0.8" fill={c.distantStars} opacity="0.9" />
      <circle cx="78" cy="18" r="1" fill={c.distantStars} opacity="0.8" />
      <circle cx="15" cy="45" r="0.6" fill={c.distantStars} opacity="0.7" />
      <circle cx="85" cy="35" r="0.7" fill={c.distantStars} opacity="0.6" />
      <circle cx="25" cy="55" r="0.5" fill={c.distantStars} opacity="0.5" />
      <circle cx="72" cy="50" r="0.6" fill={c.distantStars} opacity="0.7" />
      <circle cx="35" cy="15" r="0.7" fill={c.distantStars} opacity="0.8" />
      <circle cx="65" cy="22" r="0.5" fill={c.distantStars} opacity="0.6" />

      {/* Mountain range silhouette */}
      <path
        d="M 2 85 L 18 60 L 28 70 L 42 52 L 50 62 L 58 48 L 72 65 L 82 55 L 98 85 Z"
        fill={`url(#mountainGradient${idSuffix})`}
      />

      {/* Front mountain */}
      <path
        d="M 2 85 L 25 65 L 38 75 L 50 58 L 62 72 L 75 62 L 98 85 Z"
        fill={c.mountainDark}
        opacity="0.7"
      />

      {/* North Star - Sharp, rugged 4-point star */}
      <g filter={`url(#starGlow${idSuffix})`}>
        {/* Main vertical beam - sharp points */}
        <polygon
          points="50,8 51.5,42 50,50 48.5,42"
          fill={`url(#starGradient${idSuffix})`}
        />
        <polygon
          points="50,50 51.5,58 50,70 48.5,58"
          fill={`url(#starGradient${idSuffix})`}
          opacity="0.6"
        />

        {/* Main horizontal beam */}
        <polygon
          points="8,38 42,36.5 50,38 42,39.5"
          fill={`url(#starGradient${idSuffix})`}
        />
        <polygon
          points="50,38 58,36.5 92,38 58,39.5"
          fill={`url(#starGradient${idSuffix})`}
        />

        {/* Secondary diagonal beams - shorter */}
        <polygon
          points="22,18 44,34 50,38 46,36"
          fill={`url(#starGradient${idSuffix})`}
          opacity="0.5"
        />
        <polygon
          points="78,18 56,34 50,38 54,36"
          fill={`url(#starGradient${idSuffix})`}
          opacity="0.5"
        />
      </g>

      {/* Star center - bright core */}
      <circle cx="50" cy="38" r="4" fill={c.starMid} />
      <circle cx="50" cy="38" r="2" fill={c.centerCore} />

      {/* 2026 text */}
      <text
        x="50"
        y="96"
        textAnchor="middle"
        fill={c.text}
        fontSize="11"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
        letterSpacing="0.1em"
      >
        2026
      </text>
    </svg>
  );
}
