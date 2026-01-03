'use client';

import { useTheme } from '@/context/ThemeContext';
import { lightTap } from '@/lib/haptics';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Toggle({ enabled, onChange, disabled = false, size = 'md' }: ToggleProps) {
  const { colors } = useTheme();

  const sizes = {
    sm: { width: 42, height: 26, knob: 22, translate: 16 },
    md: { width: 51, height: 31, knob: 27, translate: 20 },
    lg: { width: 60, height: 36, knob: 32, translate: 24 },
  };

  const s = sizes[size];

  const handleClick = () => {
    if (disabled) return;
    lightTap();
    onChange(!enabled);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={handleClick}
      disabled={disabled}
      style={{
        position: 'relative',
        width: s.width,
        height: s.height,
        borderRadius: s.height,
        border: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: enabled ? '#34c759' : colors.border,
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
      }}
    >
      {/* Knob */}
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          width: s.knob,
          height: s.knob,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)',
          transform: enabled ? `translateX(${s.translate}px)` : 'translateX(0)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </button>
  );
}
