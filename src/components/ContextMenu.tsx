'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/context/ThemeContext';
import { lightTap } from '@/lib/haptics';

interface ContextMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  dividerBefore?: boolean;
}

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: ContextMenuItem[];
  mode?: 'sheet' | 'popover';
  anchorPosition?: { x: number; y: number };
}

export function ContextMenu({ isOpen, onClose, items, mode = 'sheet', anchorPosition }: ContextMenuProps) {
  const { colors } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mount portal after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      lightTap();
    }
  }, [isOpen]);

  // Reset positioned state when menu closes
  useEffect(() => {
    if (!isOpen) {
      setIsPositioned(false);
    }
  }, [isOpen]);

  // Calculate popover position when it opens
  useEffect(() => {
    if (!isOpen || mode !== 'popover' || !anchorPosition || !menuRef.current) return;

    const menu = menuRef.current;
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = anchorPosition.y;
    let left = anchorPosition.x - menuRect.width; // Position to the left of anchor

    // If menu would go off the left edge, position to the right of anchor
    if (left < 8) {
      left = anchorPosition.x + 8;
    }

    // If menu would go off the right edge
    if (left + menuRect.width > viewportWidth - 8) {
      left = viewportWidth - menuRect.width - 8;
    }

    // If menu would go off the bottom, position above
    if (top + menuRect.height > viewportHeight - 8) {
      top = viewportHeight - menuRect.height - 8;
    }

    // Ensure not off top
    if (top < 8) {
      top = 8;
    }

    setMenuPosition({ top, left });
    setIsPositioned(true);
  }, [isOpen, mode, anchorPosition]);

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

    const handleScroll = () => {
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    if (mode === 'popover') {
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, onClose, mode]);

  if (!mounted || !isOpen) return null;

  // Mobile action sheet
  if (mode === 'sheet') {
    const sheetContent = (
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
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            borderRadius: '1rem',
            overflow: 'hidden',
            minWidth: '200px',
            maxWidth: '280px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
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
                borderTop: item.dividerBefore ? `1px solid ${colors.border}` : 'none',
                cursor: 'pointer',
                color: item.variant === 'danger' ? '#f87171' : colors.text,
                fontSize: '1rem',
                fontWeight: 500,
                textAlign: 'left',
                transition: 'background-color 0.15s ease',
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

          {/* Cancel button - Mobile only */}
          <button
            onClick={() => {
              lightTap();
              onClose();
            }}
            style={{
              width: '100%',
              padding: '0.875rem 1.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
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

    return createPortal(sheetContent, document.body);
  }

  // Desktop popover
  const popoverContent = (
    <>
      <div
        ref={menuRef}
        style={{
          position: 'fixed',
          top: menuPosition.top,
          left: menuPosition.left,
          zIndex: 100,
          backgroundColor: 'rgba(30, 41, 59, 0.98)',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          minWidth: '160px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          // Hide until positioned to prevent flash at (0,0)
          opacity: isPositioned ? 1 : 0,
          visibility: isPositioned ? 'visible' : 'hidden',
          animation: isPositioned ? 'popoverIn 0.12s ease-out' : 'none',
        }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderTop: item.dividerBefore ? `1px solid ${colors.border}` : 'none',
              marginTop: item.dividerBefore ? '0.25rem' : 0,
              paddingTop: item.dividerBefore ? '0.625rem' : '0.5rem',
              cursor: 'pointer',
              color: item.variant === 'danger' ? '#f87171' : colors.text,
              fontSize: '0.8125rem',
              fontWeight: 400,
              textAlign: 'left',
              transition: 'background-color 0.1s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{
              width: '1rem',
              height: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: item.variant === 'danger' ? 0.9 : 0.5,
              color: item.variant === 'danger' ? '#f87171' : colors.textMuted,
            }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes popoverIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );

  return createPortal(popoverContent, document.body);
}

// Hook for long press detection - TOUCH ONLY (no mouse/desktop)
export function useLongPress(
  callback: (e: React.TouchEvent) => void,
  { threshold = 500, onStart, onCancel }: {
    threshold?: number;
    onStart?: () => void;
    onCancel?: () => void;
  } = {}
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const start = (e: React.TouchEvent) => {
    isLongPress.current = false;
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    onStart?.();

    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      callback(e);
    }, threshold);
  };

  const move = (e: React.TouchEvent) => {
    if (!startPos.current || !timerRef.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

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

  const end = (e: React.TouchEvent) => {
    if (isLongPress.current) {
      e.preventDefault();
    }
    clear();
  };

  // Only return touch handlers - no mouse events
  return {
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: end,
  };
}
