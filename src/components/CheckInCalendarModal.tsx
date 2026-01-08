'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Resolution, CheckIn } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { YearVowIcon } from './YearVowIcon';

interface CheckInCalendarModalProps {
  resolution: Resolution | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper to get local date string (YYYY-MM-DD) in user's timezone
function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get all days in a month
function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

// Calculate current streak
function calculateStreak(checkIns: CheckIn[] | undefined): number {
  if (!checkIns || checkIns.length === 0) return 0;

  // Sort check-ins by date descending
  const sorted = [...checkIns].sort((a, b) => b.date.localeCompare(a.date));

  const today = getLocalDateString();
  const yesterday = getLocalDateString(new Date(Date.now() - 86400000));

  // Check if streak is still active (checked in today or yesterday)
  const mostRecent = sorted[0].date;
  if (mostRecent !== today && mostRecent !== yesterday) {
    return 0; // Streak broken
  }

  let streak = 1;
  let currentDate = new Date(sorted[0].date);

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateStr = getLocalDateString(prevDate);

    if (sorted[i].date === prevDateStr) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
}

// Calculate longest streak ever
function calculateLongestStreak(checkIns: CheckIn[] | undefined): number {
  if (!checkIns || checkIns.length === 0) return 0;

  const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1].date);
    const currDate = new Date(sorted[i].date);
    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / 86400000);

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diffDays > 1) {
      current = 1;
    }
    // If diffDays === 0, same day, don't change streak
  }

  return longest;
}

export function CheckInCalendarModal({ resolution, isOpen, onClose }: CheckInCalendarModalProps) {
  const { colors, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset to current month when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentMonth(new Date());
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Memoize check-in dates for quick lookup
  const checkInDates = useMemo(() => {
    if (!resolution?.checkIns) return new Set<string>();
    return new Set(resolution.checkIns.map(c => c.date));
  }, [resolution?.checkIns]);

  // Get resolution creation date
  const createdDate = useMemo(() => {
    if (!resolution?.createdAt) return null;
    return getLocalDateString(new Date(resolution.createdAt));
  }, [resolution?.createdAt]);

  // Calculate streaks
  const currentStreak = useMemo(() => calculateStreak(resolution?.checkIns), [resolution?.checkIns]);
  const longestStreak = useMemo(() => calculateLongestStreak(resolution?.checkIns), [resolution?.checkIns]);

  if (!mounted || !isOpen || !resolution) return null;

  const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const today = getLocalDateString();
  const isDaily = resolution.frequencyPeriod === 'day';

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const modalContent = (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
        opacity: isClosing ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <div
        style={{
          backgroundColor: theme === 'light' ? '#FDFCFA' : colors.cardBg,
          borderRadius: '1.25rem',
          width: '100%',
          maxWidth: '24rem',
          boxShadow: theme === 'light'
            ? '0 25px 80px -20px rgba(0, 0, 0, 0.25), 0 10px 40px -15px rgba(0, 0, 0, 0.1)'
            : '0 25px 80px -20px rgba(0, 0, 0, 0.5)',
          border: `1px solid ${theme === 'light' ? 'rgba(31, 58, 90, 0.08)' : colors.border}`,
          transform: isClosing ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.2s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <YearVowIcon name="calendar" size={36} />
            <div>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: colors.text,
                margin: 0,
              }}>
                Check-in History
              </h2>
            <p style={{
              fontSize: '0.8125rem',
              color: colors.textMuted,
              margin: 0,
              marginTop: '0.125rem',
              maxWidth: '14rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {resolution.title}
            </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              color: colors.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Streak Stats */}
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: theme === 'light' ? 'rgba(201, 167, 90, 0.06)' : 'rgba(201, 167, 90, 0.1)',
          display: 'flex',
          gap: '1.5rem',
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {currentStreak > 0 && <YearVowIcon name="flame" size={28} />}
              <span style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: currentStreak > 0 ? colors.accent : colors.textMuted,
              }}>
                {currentStreak}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.125rem' }}>
              Current Streak
            </div>
          </div>
          <div style={{
            width: '1px',
            backgroundColor: colors.border,
          }} />
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: colors.text,
            }}>
              {longestStreak}
            </div>
            <div style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.125rem' }}>
              Longest Streak
            </div>
          </div>
          <div style={{
            width: '1px',
            backgroundColor: colors.border,
          }} />
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: colors.text,
            }}>
              {resolution.checkIns?.length || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.125rem' }}>
              Total Days
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div style={{
          padding: '1rem 1.5rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button
            onClick={goToPreviousMonth}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              color: colors.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: colors.text,
          }}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={goToNextMonth}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              color: colors.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          {/* Day headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.25rem',
            marginBottom: '0.5rem',
          }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: colors.textMuted,
                  padding: '0.25rem',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.25rem',
          }}>
            {/* Empty cells for days before first of month */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} style={{ aspectRatio: '1' }} />
            ))}

            {/* Actual days */}
            {days.map((date) => {
              const dateStr = getLocalDateString(date);
              const hasCheckIn = checkInDates.has(dateStr);
              const isToday = dateStr === today;
              const isPast = dateStr < today;
              const isAfterCreation = !createdDate || dateStr >= createdDate;
              const isMissed = isDaily && isPast && isAfterCreation && !hasCheckIn;
              const isFuture = dateStr > today;

              return (
                <div
                  key={dateStr}
                  style={{
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '0.375rem',
                    position: 'relative',
                    backgroundColor: hasCheckIn
                      ? (theme === 'light' ? 'rgba(92, 139, 111, 0.15)' : 'rgba(92, 139, 111, 0.25)')
                      : isMissed
                      ? (theme === 'light' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.15)')
                      : 'transparent',
                    border: isToday ? `2px solid ${colors.accent}` : 'none',
                  }}
                >
                  {/* Day number */}
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: isToday ? 600 : 400,
                    color: hasCheckIn
                      ? (theme === 'light' ? '#2d5a3d' : '#4ade80')
                      : isMissed
                      ? (theme === 'light' ? '#dc2626' : '#f87171')
                      : isFuture
                      ? colors.textMuted
                      : colors.text,
                    opacity: isFuture ? 0.4 : 1,
                  }}>
                    {date.getDate()}
                  </span>

                  {/* Checkmark indicator */}
                  {hasCheckIn && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0.125rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}>
                      <svg
                        style={{
                          width: '0.625rem',
                          height: '0.625rem',
                          color: theme === 'light' ? '#2d5a3d' : '#4ade80',
                        }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  {/* Missed indicator (only for daily) */}
                  {isMissed && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0.125rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}>
                      <div style={{
                        width: '0.25rem',
                        height: '0.25rem',
                        borderRadius: '50%',
                        backgroundColor: theme === 'light' ? '#dc2626' : '#f87171',
                      }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{
          padding: '0.75rem 1.5rem',
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{
              width: '0.75rem',
              height: '0.75rem',
              borderRadius: '0.25rem',
              backgroundColor: theme === 'light' ? 'rgba(92, 139, 111, 0.15)' : 'rgba(92, 139, 111, 0.25)',
            }} />
            <span style={{ fontSize: '0.6875rem', color: colors.textMuted }}>Checked in</span>
          </div>
          {isDaily && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{
                width: '0.75rem',
                height: '0.75rem',
                borderRadius: '0.25rem',
                backgroundColor: theme === 'light' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.15)',
              }} />
              <span style={{ fontSize: '0.6875rem', color: colors.textMuted }}>Missed</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{
              width: '0.75rem',
              height: '0.75rem',
              borderRadius: '0.25rem',
              border: `2px solid ${colors.accent}`,
            }} />
            <span style={{ fontSize: '0.6875rem', color: colors.textMuted }}>Today</span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
