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

  // Simplified gold-based progress colors
  const getProgressColor = (p: number) => {
    // Use gold as the primary progress color
    // Only 100% gets a special "complete" color (muted green)
    if (p === 100) {
      return theme === 'light' ? '#6B8E6B' : '#7FB07F'; // Muted sage for completion
    }
    // All other progress uses gold
    return colors.accent; // Gold (#C4A35A)
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
