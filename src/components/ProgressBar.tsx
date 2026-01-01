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

  // Rugged, outdoorsy progress colors
  const getProgressColor = (p: number) => {
    if (theme === 'light') {
      if (p === 100) return '#047857';
      if (p >= 75) return '#059669';
      if (p >= 50) return '#0369a1';
      if (p >= 25) return '#b45309';
      return '#dc2626';
    } else {
      if (p === 100) return '#10b981';
      if (p >= 75) return '#34d399';
      if (p >= 50) return '#38bdf8';
      if (p >= 25) return '#fbbf24';
      return '#f87171';
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        backgroundColor: colors.border,
        borderRadius: '0.375rem',
        height: heights[size],
        overflow: 'hidden',
      }}>
        <div
          style={{
            height: '100%',
            backgroundColor: getProgressColor(progress),
            borderRadius: '0.375rem',
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
