'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { lightTap } from '@/lib/haptics';

interface ContextMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: ContextMenuItem[];
  position?: { x: number; y: number };
}

export function ContextMenu({ isOpen, onClose, items, position }: ContextMenuProps) {
  const { colors, theme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      lightTap();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <div
        ref={menuRef}
        style={{
          backgroundColor: theme === 'dark'
            ? 'rgba(30, 41, 59, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1rem',
          overflow: 'hidden',
          minWidth: '200px',
          maxWidth: '280px',
          boxShadow: theme === 'dark'
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          animation: 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              lightTap();
              item.onClick();
              onClose();
            }}
            style={{
              width: '100%',
              padding: '0.875rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: index < items.length - 1 ? `1px solid ${colors.border}` : 'none',
              cursor: 'pointer',
              color: item.variant === 'danger'
                ? (theme === 'dark' ? '#f87171' : '#dc2626')
                : colors.text,
              fontSize: '1rem',
              fontWeight: 500,
              textAlign: 'left',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{
              width: '1.5rem',
              height: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8,
            }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}

        {/* Cancel button */}
        <button
          onClick={() => {
            lightTap();
            onClose();
          }}
          style={{
            width: '100%',
            padding: '0.875rem 1.25rem',
            backgroundColor: theme === 'dark'
              ? 'rgba(255, 255, 255, 0.03)'
              : 'rgba(0, 0, 0, 0.02)',
            border: 'none',
            borderTop: `1px solid ${colors.border}`,
            cursor: 'pointer',
            color: colors.textMuted,
            fontSize: '1rem',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          Cancel
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

// Hook for long press detection
export function useLongPress(
  callback: (e: React.TouchEvent | React.MouseEvent) => void,
  { threshold = 500, onStart, onCancel }: {
    threshold?: number;
    onStart?: () => void;
    onCancel?: () => void;
  } = {}
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const start = (e: React.TouchEvent | React.MouseEvent) => {
    isLongPress.current = false;

    // Get start position
    if ('touches' in e) {
      startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
      startPos.current = { x: e.clientX, y: e.clientY };
    }

    onStart?.();

    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      callback(e);
    }, threshold);
  };

  const move = (e: React.TouchEvent | React.MouseEvent) => {
    if (!startPos.current || !timerRef.current) return;

    // Get current position
    let currentX: number, currentY: number;
    if ('touches' in e) {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else {
      currentX = e.clientX;
      currentY = e.clientY;
    }

    // Cancel if moved too much
    const deltaX = Math.abs(currentX - startPos.current.x);
    const deltaY = Math.abs(currentY - startPos.current.y);

    if (deltaX > 10 || deltaY > 10) {
      clear();
      onCancel?.();
    }
  };

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startPos.current = null;
  };

  const end = (e: React.TouchEvent | React.MouseEvent) => {
    if (isLongPress.current) {
      e.preventDefault();
    }
    clear();
  };

  return {
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: end,
    onMouseDown: start,
    onMouseMove: move,
    onMouseUp: end,
    onMouseLeave: clear,
  };
}
