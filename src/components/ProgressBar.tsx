'use client';

import { useTheme } from '@/context/ThemeContext';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ progress, size = 'md', showLabel = true }: ProgressBarProps) {
  const { theme, colors } = useTheme();

  const heights = {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
  };

  // Progress colors - softer for light mode, more vibrant for dark mode
  const getProgressColor = (p: number) => {
    if (theme === 'light') {
      // Soft, muted tones for Cloud Dancer light theme
      if (p === 100) return '#8A9A80';
      if (p >= 75) return '#A0B4A0';
      if (p >= 50) return '#B4B4A0';
      if (p >= 25) return '#C4B0A0';
      return '#C4A0A0';
    } else {
      // More vibrant colors for dark mode
      if (p === 100) return '#4ade80';
      if (p >= 75) return '#34d399';
      if (p >= 50) return '#a3e635';
      if (p >= 25) return '#fbbf24';
      return '#f87171';
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        backgroundColor: colors.border,
        borderRadius: '9999px',
        height: heights[size],
        overflow: 'hidden',
      }}>
        <div
          style={{
            height: '100%',
            backgroundColor: getProgressColor(progress),
            borderRadius: '9999px',
            transition: 'all 0.5s ease-out',
            width: `${progress}%`,
          }}
        />
      </div>
      {showLabel && (
        <p style={{ fontSize: '0.875rem', color: colors.textMuted, marginTop: '0.25rem', textAlign: 'right', marginBottom: 0 }}>
          {progress}%
        </p>
      )}
    </div>
  );
}
