'use client';

import { useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { lightTap, successHaptic } from '@/lib/haptics';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftLabel?: string;
  rightLabel?: string;
  leftColor?: string;
  rightColor?: string;
  disabled?: boolean;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftLabel = 'Edit',
  rightLabel = '+10%',
  leftColor,
  rightColor,
  disabled = false,
}: SwipeableCardProps) {
  const { colors } = useTheme();
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontalSwipe = useRef(false);

  const threshold = 80; // Minimum swipe distance to trigger action

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX.current;
    const diffY = currentY - startY.current;

    // Determine swipe direction on first significant move
    if (!isHorizontalSwipe.current && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
      isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
    }

    if (isHorizontalSwipe.current) {
      e.preventDefault();
      // Limit the swipe distance with resistance
      const maxOffset = 120;
      const resistance = 0.5;
      let newOffset = diffX;

      if (Math.abs(newOffset) > maxOffset) {
        const excess = Math.abs(newOffset) - maxOffset;
        newOffset = (newOffset > 0 ? 1 : -1) * (maxOffset + excess * resistance);
      }

      // Only allow swipe in directions that have handlers
      if ((newOffset > 0 && !onSwipeRight) || (newOffset < 0 && !onSwipeLeft)) {
        newOffset = 0;
      }

      setOffsetX(newOffset);

      // Haptic feedback when crossing threshold
      if (Math.abs(newOffset) >= threshold && Math.abs(diffX - newOffset) < 10) {
        lightTap();
      }
    }
  };

  const handleTouchEnd = () => {
    if (disabled) return;
    setIsDragging(false);

    if (Math.abs(offsetX) >= threshold) {
      if (offsetX > 0 && onSwipeRight) {
        successHaptic();
        onSwipeRight();
      } else if (offsetX < 0 && onSwipeLeft) {
        lightTap();
        onSwipeLeft();
      }
    }

    // Animate back
    setOffsetX(0);
  };

  const defaultLeftColor = '#60a5fa';
  const defaultRightColor = '#34d399';

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0.75rem' }}>
      {/* Left action background (swipe right to reveal) */}
      {onSwipeRight && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '100%',
            backgroundColor: rightColor || defaultRightColor,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '1.5rem',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.875rem',
            opacity: offsetX > 0 ? Math.min(offsetX / threshold, 1) : 0,
          }}
        >
          {rightLabel}
        </div>
      )}

      {/* Right action background (swipe left to reveal) */}
      {onSwipeLeft && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            backgroundColor: leftColor || defaultLeftColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '1.5rem',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.875rem',
            opacity: offsetX < 0 ? Math.min(Math.abs(offsetX) / threshold, 1) : 0,
          }}
        >
          {leftLabel}
        </div>
      )}

      {/* Main content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          position: 'relative',
          zIndex: 1,
          backgroundColor: colors.cardBg,
        }}
      >
        {children}
      </div>
    </div>
  );
}
