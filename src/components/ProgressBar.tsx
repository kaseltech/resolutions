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

  const getProgressColor = (p: number) => {
    if (p === 100) return '#3d7a57';
    if (p >= 75) return '#3d7a6a';
    if (p >= 50) return '#9a8a4a';
    if (p >= 25) return '#a5724a';
    return '#a85454';
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        backgroundColor: '#334155',
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
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem', textAlign: 'right', marginBottom: 0 }}>
          {progress}%
        </p>
      )}
    </div>
  );
}
