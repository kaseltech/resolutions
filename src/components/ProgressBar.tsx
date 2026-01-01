'use client';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ progress, size = 'md', showLabel = true }: ProgressBarProps) {
  const heights = {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
  };

  // Cloud Dancer inspired progress colors - soft, muted tones
  const getProgressColor = (p: number) => {
    if (p === 100) return '#8A9A80'; // Sage green for complete
    if (p >= 75) return '#A0B4A0';   // Light sage
    if (p >= 50) return '#B4B4A0';   // Neutral
    if (p >= 25) return '#C4B0A0';   // Warm neutral
    return '#C4A0A0';                // Soft muted rose for low progress
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        backgroundColor: '#E0E0DB',
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
        <p style={{ fontSize: '0.875rem', color: '#8A8A85', marginTop: '0.25rem', textAlign: 'right', marginBottom: 0 }}>
          {progress}%
        </p>
      )}
    </div>
  );
}
