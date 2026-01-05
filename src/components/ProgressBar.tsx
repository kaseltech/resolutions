'use client';

import { useTheme } from '@/context/ThemeContext';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ progress, size = 'md', showLabel = true }: ProgressBarProps) {
  const { colors } = useTheme();

  // 6px base height (design token recommendation)
  const heights = {
    sm: '4px',
    md: '6px',
    lg: '8px',
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        backgroundColor: colors.borderSubtle,
        borderRadius: '3px',
        height: heights[size],
        overflow: 'hidden',
      }}>
        <div
          style={{
            height: '100%',
            backgroundColor: progress === 100 ? colors.progress : colors.accent,
            borderRadius: '3px',
            transition: 'width 0.3s ease',
            width: `${progress}%`,
          }}
        />
      </div>
      {showLabel && (
        <p style={{
          fontSize: '0.75rem',
          color: colors.textTertiary,
          marginTop: '0.25rem',
          textAlign: 'right',
          marginBottom: 0,
        }}>
          {progress}%
        </p>
      )}
    </div>
  );
}
