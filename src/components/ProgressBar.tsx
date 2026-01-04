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

  // Consistent heights - fully rounded
  const heights = {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.625rem',
  };

  // Gold only - with subtle success state for 100%
  const getProgressColor = (p: number) => {
    if (p === 100) {
      return colors.success || '#4C8B6F'; // Muted success green
    }
    return '#C9A75A'; // Gold
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        backgroundColor: theme === 'light' ? 'rgba(31, 58, 90, 0.08)' : 'rgba(255, 255, 255, 0.08)',
        borderRadius: '9999px',  // Fully rounded
        height: heights[size],
        overflow: 'hidden',
      }}>
        <div
          style={{
            height: '100%',
            backgroundColor: getProgressColor(progress),
            borderRadius: '9999px',  // Fully rounded
            transition: 'width 0.3s ease',
            width: `${progress}%`,
          }}
        />
      </div>
      {showLabel && (
        <p style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.25rem', textAlign: 'right', marginBottom: 0, opacity: 0.85 }}>
          {progress}%
        </p>
      )}
    </div>
  );
}
