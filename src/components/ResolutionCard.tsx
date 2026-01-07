'use client';

import { useState, useEffect, useRef } from 'react';
import { Resolution, getCategoryInfo, JournalEntry, CheckIn, TRACKING_TYPES } from '@/types';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';
import { ProgressBar } from './ProgressBar';
import { MilestoneList } from './MilestoneList';
import { CategoryIcon } from './CategoryIcon';
import { ConfirmModal } from './ConfirmModal';
import { ContextMenu, useLongPress } from './ContextMenu';
import { QuickUpdateModal } from './QuickUpdateModal';

const moodEmojis: Record<NonNullable<JournalEntry['mood']>, string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  struggling: '😔',
};

// Helper to get local date string (YYYY-MM-DD) in user's timezone
function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to get check-ins for the current period
function getCheckInsForPeriod(checkIns: CheckIn[] | undefined, period: 'day' | 'week' | 'month'): CheckIn[] {
  if (!checkIns) return [];
  const now = new Date();
  const today = getLocalDateString(now);

  return checkIns.filter(c => {
    const checkInDate = new Date(c.date);

    if (period === 'day') {
      return c.date === today;
    } else if (period === 'week') {
      // Get start of current week (Sunday)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return checkInDate >= startOfWeek && checkInDate <= now;
    } else if (period === 'month') {
      return checkInDate.getMonth() === now.getMonth() && checkInDate.getFullYear() === now.getFullYear();
    }
    return false;
  });
}

// Helper to check if user already checked in today
function hasCheckedInToday(checkIns: CheckIn[] | undefined): boolean {
  if (!checkIns) return false;
  const today = getLocalDateString();
  return checkIns.some(c => c.date === today);
}

// Helper to get today's check-in
function getTodayCheckIn(checkIns: CheckIn[] | undefined): CheckIn | undefined {
  if (!checkIns) return undefined;
  const today = getLocalDateString();
  return checkIns.find(c => c.date === today);
}

// Period label for display
const periodLabels: Record<string, string> = {
  day: 'today',
  week: 'this week',
  month: 'this month',
};

interface ResolutionCardProps {
  resolution: Resolution;
  onEdit: (resolution: Resolution) => void;
  openJournalOnMount?: boolean;
  onJournalOpened?: () => void;
  // Drag handle support for desktop
  isDragEnabled?: boolean;
  onDragHandleMouseDown?: (e: React.MouseEvent) => void;
}

export function ResolutionCard({ resolution, onEdit, openJournalOnMount, onJournalOpened, isDragEnabled, onDragHandleMouseDown }: ResolutionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState<JournalEntry['mood']>(undefined);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuAnchorPosition, setMenuAnchorPosition] = useState<{ x: number; y: number } | undefined>();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showQuickUpdate, setShowQuickUpdate] = useState(false);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const journalFormRef = useRef<HTMLDivElement>(null);
  const { deleteResolution, updateProgress, addCheckIn, removeCheckIn, updateCumulativeValue, addJournalEntry, deleteJournalEntry, updateResolution, toggleMilestone } = useResolutions();
  const { theme, colors } = useTheme();

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Open journal when triggered from parent (e.g., swipe action)
  useEffect(() => {
    if (openJournalOnMount) {
      setExpanded(true);
      setShowJournalForm(true);
      onJournalOpened?.();
    }
  }, [openJournalOnMount, onJournalOpened]);

  // Auto-scroll to journal form when it opens
  useEffect(() => {
    if (showJournalForm && journalFormRef.current) {
      // Small delay to allow the DOM to update
      setTimeout(() => {
        journalFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus the textarea for immediate typing
        const textarea = journalFormRef.current?.querySelector('textarea');
        textarea?.focus();
      }, 100);
    }
  }, [showJournalForm]);

  // Long press handler for context menu (mobile only)
  const longPressHandlers = useLongPress(
    () => setShowContextMenu(true),
    { threshold: 500 }
  );

  // Handle menu button click (desktop)
  const handleMenuButtonClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuAnchorPosition({ x: rect.left, y: rect.bottom + 4 });
    setShowContextMenu(true);
  };

  // Build tracking-specific menu item
  const getTrackingMenuItem = () => {
    if (resolution.trackingType === 'frequency') {
      return {
        label: hasCheckedInToday(resolution.checkIns) ? 'Checked in today!' : 'Check in',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        onClick: () => {
          if (!hasCheckedInToday(resolution.checkIns)) {
            addCheckIn(resolution.id);
          }
        },
      };
    }
    if (resolution.trackingType === 'cumulative') {
      return {
        label: resolution.currentValue !== undefined && resolution.targetValue !== undefined && resolution.currentValue >= resolution.targetValue ? 'Goal reached!' : 'Log progress',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        ),
        onClick: () => setShowQuickUpdate(true),
      };
    }
    if (resolution.trackingType === 'target') {
      return {
        label: 'Update value',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
          </svg>
        ),
        onClick: () => setShowQuickUpdate(true),
      };
    }
    if (resolution.trackingType === 'reflection') {
      return null; // No progress action for reflection
    }
    // Legacy/default percentage tracking
    return {
      label: resolution.progress < 100 ? 'Update Progress (+10%)' : 'Completed!',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      onClick: () => {
        if (resolution.progress < 100) {
          updateProgress(resolution.id, Math.min(100, resolution.progress + 10));
        }
      },
    };
  };

  const trackingMenuItem = getTrackingMenuItem();

  // Context menu items - reordered: Edit, Journal, Progress, Delete (with divider)
  const contextMenuItems = [
    {
      label: 'Edit',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
        </svg>
      ),
      onClick: () => onEdit(resolution),
    },
    {
      label: 'Add Journal Entry',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      ),
      onClick: () => {
        setExpanded(true);
        setShowJournalForm(true);
      },
    },
    // Add tracking menu item if it exists
    ...(trackingMenuItem ? [trackingMenuItem] : []),
    {
      label: 'Delete',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      ),
      onClick: () => setShowDeleteModal(true),
      variant: 'danger' as const,
      dividerBefore: true,
    },
  ];

  const handleAddJournalEntry = () => {
    if (!journalContent.trim()) return;
    addJournalEntry(resolution.id, {
      content: journalContent.trim(),
      mood: journalMood,
    });
    setJournalContent('');
    setJournalMood(undefined);
    setShowJournalForm(false);
  };
  const categoryInfo = getCategoryInfo(resolution.category);

  const daysRemaining = resolution.deadline
    ? Math.ceil((new Date(resolution.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const isOverdue = daysRemaining !== null && daysRemaining < 0;

  // Determine completion based on tracking type
  const isCompleted = (() => {
    // Legacy resolutions (no trackingType) use percentage
    if (!resolution.trackingType) {
      return resolution.progress === 100;
    }
    if (resolution.trackingType === 'cumulative') {
      return resolution.currentValue !== undefined && resolution.targetValue !== undefined && resolution.currentValue >= resolution.targetValue;
    }
    if (resolution.trackingType === 'target') {
      if (resolution.currentValue === undefined || resolution.targetValue === undefined || resolution.startingValue === undefined) {
        return false;
      }
      const isGoingDown = resolution.targetValue < resolution.startingValue;
      return isGoingDown ? (resolution.currentValue <= resolution.targetValue) : (resolution.currentValue >= resolution.targetValue);
    }
    if (resolution.trackingType === 'reflection') {
      return false; // Reflection goals don't "complete"
    }
    if (resolution.trackingType === 'frequency') {
      return false; // Frequency goals are ongoing
    }
    // Fallback to percentage-based
    return resolution.progress === 100;
  })();

  const borderColor = isCompleted
    ? colors.accent
    : isOverdue
    ? (theme === 'light' ? '#C4A0A0' : '#f87171')
    : colors.border;

  const completedBg = theme === 'light' ? '#F0F2EE' : '#1a2e1a';

  return (
    <>
    <div
      {...longPressHandlers}
      className="card-hover animate-fadeIn"
      style={{
        backgroundColor: isCompleted ? completedBg : colors.cardBg,
        borderRadius: '0.875rem',
        overflow: 'hidden',
        borderLeft: `4px solid ${borderColor}`,
        boxShadow: theme === 'light'
          ? '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06)'
          : '0 1px 3px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        position: 'relative',
      }}
    >
      {/* Tappable card header area - clicking expands journal/notes */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '1.25rem',
          paddingBottom: '0',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '0.125rem 0.625rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  color: theme === 'light' ? 'rgba(31, 58, 90, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                  backgroundColor: theme === 'light' ? 'rgba(31, 58, 90, 0.06)' : 'rgba(255, 255, 255, 0.08)',
                  borderLeft: `2px solid ${theme === 'light' ? `${categoryInfo.color}70` : `${categoryInfo.darkColor}70`}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <span style={{ opacity: 0.6 }}>
                  <CategoryIcon category={resolution.category} size={12} />
                </span>
                {categoryInfo.label}
              </span>
              {isCompleted && (
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  backgroundColor: `${colors.accent}30`,
                  color: theme === 'light' ? '#6A7A60' : '#4ade80',
                }}>
                  Completed
                </span>
              )}
            </div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: isCompleted ? colors.textMuted : colors.text,
              textDecoration: isCompleted ? 'line-through' : 'none',
              margin: 0,
            }}>
              {resolution.title}
            </h3>
            {resolution.description && (
              <p style={{ color: colors.textMuted, fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>
                {resolution.description}
              </p>
            )}
          </div>
          {/* Card actions - Desktop only (visible on hover) */}
          <div className="card-actions" style={{ display: 'flex', gap: '0.125rem', opacity: 0, transition: 'opacity 0.15s ease' }} onClick={(e) => e.stopPropagation()}>
            {/* Drag handle */}
            {isDragEnabled && onDragHandleMouseDown && (
              <div
                className="drag-handle desktop-only-action"
                onMouseDown={onDragHandleMouseDown}
                style={{
                  padding: '0.5rem',
                  cursor: 'grab',
                  color: colors.textMuted,
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Drag to reorder"
              >
                <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                </svg>
              </div>
            )}
            {/* Menu button */}
            <button
              ref={menuButtonRef}
              onClick={handleMenuButtonClick}
              className="action-btn desktop-only-action"
              style={{
                padding: '0.5rem',
                color: colors.textMuted,
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Actions"
            >
              <svg style={{ width: '1.125rem', height: '1.125rem' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Non-tappable card content area */}
      <div style={{ padding: '0 1.25rem 1.25rem' }}>

        {/* Tracking Progress Section - renders differently based on trackingType */}
        {resolution.trackingType === 'frequency' && resolution.frequencyPeriod && resolution.targetFrequency ? (
          // FREQUENCY TRACKING: Show check-ins for current period
          <div style={{ marginTop: '1rem' }}>
            {(() => {
              const periodCheckIns = getCheckInsForPeriod(resolution.checkIns, resolution.frequencyPeriod);
              const count = periodCheckIns.length;
              const target = resolution.targetFrequency;
              const isMetGoal = count >= target;
              const checkedInToday = hasCheckedInToday(resolution.checkIns);
              const todayCheckIn = getTodayCheckIn(resolution.checkIns);

              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '1.25rem', fontWeight: 600, color: isMetGoal ? colors.accent : colors.text }}>
                        {count}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>
                        {' '}of {target} {periodLabels[resolution.frequencyPeriod]}
                      </span>
                      {isMetGoal && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: colors.accent }}>Goal met!</span>
                      )}
                    </div>
                    {!checkedInToday ? (
                      <button
                        onClick={() => {
                          addCheckIn(resolution.id);
                          setShowJournalPrompt(true);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          backgroundColor: colors.accent,
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                        }}
                      >
                        <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Check in
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          todayCheckIn && removeCheckIn(resolution.id, todayCheckIn.id);
                          setShowJournalPrompt(false);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          backgroundColor: `${colors.accent}20`,
                          color: colors.accent,
                          border: `1px solid ${colors.accent}40`,
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                        }}
                      >
                        <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        Done today
                      </button>
                    )}
                  </div>
                  {/* Visual progress bar for frequency */}
                  <div style={{
                    height: '0.5rem',
                    backgroundColor: colors.border,
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(100, (count / target) * 100)}%`,
                      height: '100%',
                      backgroundColor: isMetGoal ? colors.accent : (theme === 'light' ? '#1e40af' : '#60a5fa'),
                      borderRadius: '9999px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>

                  {/* Contextual journal prompt after check-in */}
                  {checkedInToday && showJournalPrompt && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.625rem 0.75rem',
                        backgroundColor: theme === 'light' ? 'rgba(92, 139, 111, 0.08)' : 'rgba(92, 139, 111, 0.15)',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', color: colors.textMuted }}>
                        How did it go?
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            setExpanded(true);
                            setShowJournalForm(true);
                            setShowJournalPrompt(false);
                          }}
                          style={{
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            backgroundColor: colors.accent,
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <svg style={{ width: '0.75rem', height: '0.75rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Add note
                        </button>
                        <button
                          onClick={() => setShowJournalPrompt(false)}
                          style={{
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: colors.textMuted,
                            opacity: 0.6,
                          }}
                          title="Dismiss"
                        >
                          <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        ) : resolution.trackingType === 'cumulative' && resolution.targetValue ? (
          // CUMULATIVE TRACKING: Show current/target with progress bar
          <div style={{ marginTop: '1rem' }}>
            {(() => {
              const current = resolution.currentValue || 0;
              const target = resolution.targetValue;
              const progress = Math.min(100, (current / target) * 100);
              const unit = resolution.unit || '';
              const isComplete = current >= target;

              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '1.25rem', fontWeight: 600, color: isComplete ? colors.accent : colors.text }}>
                        {unit}{current.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>
                        {' '}/ {unit}{target.toLocaleString()}
                      </span>
                      {isComplete && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: colors.accent }}>Goal reached!</span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.textMuted }}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <ProgressBar progress={progress} size="md" />
                </>
              );
            })()}
          </div>
        ) : resolution.trackingType === 'target' && resolution.targetValue !== undefined && resolution.startingValue !== undefined ? (
          // TARGET TRACKING: Show current value moving toward target
          <div style={{ marginTop: '1rem' }}>
            {(() => {
              const current = resolution.currentValue ?? resolution.startingValue;
              const start = resolution.startingValue;
              const target = resolution.targetValue;
              const unit = resolution.unit || '';

              // Calculate progress - works for both directions
              const totalDistance = Math.abs(target - start);
              const currentDistance = Math.abs(current - start);
              const progress = totalDistance > 0 ? Math.min(100, (currentDistance / totalDistance) * 100) : 0;

              // Check if moving in right direction
              const isGoingDown = target < start; // e.g., losing weight
              const isMovingRight = isGoingDown ? (current <= start) : (current >= start);
              const isComplete = isGoingDown ? (current <= target) : (current >= target);

              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '1.25rem', fontWeight: 600, color: isComplete ? colors.accent : colors.text }}>
                        {current}{unit}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>
                        {' '}→ {target}{unit}
                      </span>
                      {isComplete && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: colors.accent }}>Goal reached!</span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.textMuted }}>
                      {Math.round(isMovingRight ? progress : 0)}%
                    </span>
                  </div>
                  <ProgressBar progress={isMovingRight ? progress : 0} size="md" />
                  <div style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.25rem' }}>
                    Started at {start}{unit}
                  </div>
                </>
              );
            })()}
          </div>
        ) : resolution.trackingType === 'checklist' ? (
          // CHECKLIST TRACKING: Show milestone items
          <div style={{ marginTop: '1rem' }}>
            {(() => {
              const milestones = resolution.milestones || [];
              const completedCount = milestones.filter(m => m.completed).length;
              const totalCount = milestones.length;

              // Check if any milestones have amounts (for dollar-based progress)
              const hasAmounts = milestones.some(m => m.amount !== undefined);
              const totalAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
              const completedAmount = milestones.filter(m => m.completed).reduce((sum, m) => sum + (m.amount || 0), 0);

              // Use amount-based progress if amounts exist, otherwise count-based
              const progress = hasAmounts
                ? (totalAmount > 0 ? Math.round((completedAmount / totalAmount) * 100) : 0)
                : (totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0);

              const isAllDone = hasAmounts
                ? completedAmount >= totalAmount && totalAmount > 0
                : completedCount === totalCount && totalCount > 0;

              return (
                <>
                  {/* Progress summary */}
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>
                      {hasAmounts ? (
                        <>
                          <span style={{ fontSize: '1.25rem', fontWeight: 600, color: isAllDone ? colors.accent : colors.text }}>
                            ${completedAmount.toLocaleString()}
                          </span>
                          <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>
                            {' '}/ ${totalAmount.toLocaleString()}
                          </span>
                          <span style={{ fontSize: '0.8125rem', color: colors.textMuted, marginLeft: '0.25rem' }}>
                            paid off
                          </span>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '1.25rem', fontWeight: 600, color: isAllDone ? colors.accent : colors.text }}>
                            {completedCount}/{totalCount}
                          </span>
                          <span style={{ fontSize: '0.875rem', color: colors.textMuted, marginLeft: '0.375rem' }}>
                            completed
                          </span>
                        </>
                      )}
                      {isAllDone && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: colors.accent }}>
                          {hasAmounts ? 'Debt free!' : 'All done!'}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.textMuted }}>
                      {progress}%
                    </span>
                  </div>
                  <ProgressBar progress={progress} size="md" />

                  {/* Checklist items */}
                  {milestones.length > 0 && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      {milestones.map((milestone) => (
                        <button
                          key={milestone.id}
                          onClick={() => toggleMilestone(resolution.id, milestone.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.625rem',
                            backgroundColor: milestone.completed
                              ? (theme === 'light' ? 'rgba(92, 139, 111, 0.08)' : 'rgba(92, 139, 111, 0.15)')
                              : colors.bg,
                            borderRadius: '0.375rem',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            transition: 'background-color 0.15s ease',
                          }}
                        >
                          {/* Checkbox */}
                          <div style={{
                            width: '1.125rem',
                            height: '1.125rem',
                            borderRadius: '0.25rem',
                            border: milestone.completed
                              ? 'none'
                              : `2px solid ${theme === 'light' ? 'rgba(31, 58, 90, 0.25)' : 'rgba(255, 255, 255, 0.25)'}`,
                            backgroundColor: milestone.completed ? colors.accent : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {milestone.completed && (
                              <svg style={{ width: '0.75rem', height: '0.75rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          {/* Title */}
                          <span style={{
                            flex: 1,
                            fontSize: '0.875rem',
                            color: milestone.completed ? colors.textMuted : colors.text,
                            textDecoration: milestone.completed ? 'line-through' : 'none',
                            opacity: milestone.completed ? 0.7 : 1,
                          }}>
                            {milestone.title}
                          </span>
                          {/* Amount if exists */}
                          {milestone.amount !== undefined && (
                            <span style={{
                              fontSize: '0.8125rem',
                              fontWeight: 500,
                              color: milestone.completed ? colors.textMuted : colors.accent,
                              opacity: milestone.completed ? 0.6 : 1,
                            }}>
                              ${milestone.amount.toLocaleString()}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {milestones.length === 0 && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: colors.bg,
                      borderRadius: '0.5rem',
                      textAlign: 'center',
                    }}>
                      <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>
                        No items yet. Edit to add checklist items.
                      </span>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        ) : resolution.trackingType === 'reflection' ? (
          // REFLECTION TRACKING: Show journal count only
          <div style={{ marginTop: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              backgroundColor: colors.bg,
              borderRadius: '0.5rem',
            }}>
              <span style={{ fontSize: '1.25rem' }}>📝</span>
              <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>
                {resolution.journal?.length || 0} journal {(resolution.journal?.length || 0) === 1 ? 'entry' : 'entries'}
              </span>
            </div>
          </div>
        ) : (
          // LEGACY/DEFAULT: Show percentage progress (for resolutions without trackingType)
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text }}>Progress</span>
              {!isCompleted && (
                <div className="progress-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0, transition: 'opacity 0.15s ease' }}>
                  <button
                    onClick={() => updateProgress(resolution.id, Math.max(0, resolution.progress - 10))}
                    className="action-btn"
                    style={{
                      width: '1.75rem',
                      height: '1.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.textMuted,
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                    }}
                    title="Decrease progress"
                  >
                    −
                  </button>
                  <button
                    onClick={() => updateProgress(resolution.id, Math.min(100, resolution.progress + 10))}
                    className="action-btn action-btn-success"
                    style={{
                      width: '1.75rem',
                      height: '1.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.textMuted,
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                    }}
                    title="Increase progress"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
            <ProgressBar progress={resolution.progress} size="md" />
          </div>
        )}

        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
          {resolution.deadline && (
            <span style={{
              color: isOverdue ? (theme === 'light' ? '#C4A0A0' : '#f87171') : colors.textMuted,
              fontWeight: isOverdue ? 500 : 400
            }}>
              {isOverdue
                ? `${Math.abs(daysRemaining!)} days overdue`
                : daysRemaining === 0
                ? 'Due today'
                : `${daysRemaining} days left`}
            </span>
          )}
          {resolution.milestones.length > 0 && (
            <span style={{ color: colors.textMuted }}>
              {resolution.milestones.filter(m => m.completed).length}/{resolution.milestones.length} milestones
            </span>
          )}
        </div>

        {/* Journal indicator - icon only, contextual */}
        <div style={{
          marginTop: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Journal icon + count - only show if entries exist or expanded */}
          {(resolution.journal && resolution.journal.length > 0) || expanded ? (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                fontSize: '0.8125rem',
                color: colors.textMuted,
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem 0',
                transition: 'color 0.15s ease',
              }}
              className="journal-toggle"
            >
              {/* Pen/writing icon */}
              <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
              </svg>
              {resolution.journal && resolution.journal.length > 0 && (
                <span style={{
                  backgroundColor: theme === 'light' ? 'rgba(31, 58, 90, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '9999px',
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                }}>
                  {resolution.journal.length}
                </span>
              )}
              {expanded && (
                <span style={{ fontSize: '0.75rem' }}>
                  {resolution.journal && resolution.journal.length > 0 ? 'Journal' : 'Add note'}
                </span>
              )}
              <svg
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  transition: 'transform 0.2s',
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  opacity: 0.5,
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ) : (
            <div /> /* Empty placeholder for layout */
          )}

          {/* Notes indicator if notes exist and not expanded */}
          {!expanded && resolution.notes && (
            <span style={{
              fontSize: '0.6875rem',
              color: colors.textMuted,
              opacity: 0.7,
            }}>
              Has notes
            </span>
          )}
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 1.25rem 1.25rem', borderTop: `1px solid ${colors.border}`, paddingTop: '1rem' }}>
          {resolution.milestones.length > 0 && (
            <MilestoneList resolution={resolution} />
          )}

          {resolution.notes && (
            <div style={{ marginTop: resolution.milestones.length > 0 ? '1rem' : 0 }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text, marginBottom: '0.25rem', marginTop: 0 }}>Notes</h4>
              <p style={{
                fontSize: '0.875rem',
                color: colors.textMuted,
                whiteSpace: 'pre-wrap',
                backgroundColor: colors.bg,
                padding: '0.75rem',
                borderRadius: '0.5rem',
                margin: 0,
              }}>
                {resolution.notes}
              </p>
            </div>
          )}

          {resolution.reminder?.enabled && (
            <div style={{ fontSize: '0.875rem', color: colors.textMuted, marginTop: '1rem' }}>
              Reminder: {resolution.reminder.frequency} at {resolution.reminder.time}
            </div>
          )}

          {/* Journal Section - Lighter styling per design tokens */}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${colors.borderSubtle}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.textTertiary, margin: 0 }}>
                Journal
                {resolution.journal && resolution.journal.length > 0 && (
                  <span style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.75rem',
                    color: colors.textDisabled,
                  }}>
                    ({resolution.journal.length})
                  </span>
                )}
              </h4>
              <button
                onClick={() => setShowJournalForm(!showJournalForm)}
                style={{
                  padding: '0.375rem 0.625rem',
                  fontSize: '0.8125rem',
                  backgroundColor: 'transparent',
                  color: showJournalForm ? colors.textTertiary : colors.accent,
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {showJournalForm ? 'Cancel' : '+ Add entry'}
              </button>
            </div>

            {/* Add Journal Entry Form */}
            {showJournalForm && (
              <div
                ref={journalFormRef}
                style={{
                  backgroundColor: colors.bg,
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <textarea
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="How's it going? Write about your progress, challenges, or thoughts..."
                  style={{
                    width: '100%',
                    minHeight: '70px',
                    padding: '0.625rem 0.75rem',
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '0.375rem',
                    color: colors.text,
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
                {/* Mood selector row */}
                <div style={{ marginTop: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>Mood:</span>
                  {(Object.entries(moodEmojis) as [NonNullable<JournalEntry['mood']>, string][]).map(([mood, emoji]) => (
                    <button
                      key={mood}
                      onClick={() => setJournalMood(journalMood === mood ? undefined : mood)}
                      style={{
                        padding: '0.1875rem 0.375rem',
                        fontSize: '0.9375rem',
                        backgroundColor: journalMood === mood ? `${colors.accent}30` : 'transparent',
                        border: journalMood === mood ? `1px solid ${colors.accent}` : `1px solid ${colors.border}`,
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                      }}
                      title={mood}
                    >
                      {emoji}
                    </button>
                  ))}
                  <button
                    onClick={handleAddJournalEntry}
                    disabled={!journalContent.trim()}
                    style={{
                      marginLeft: 'auto',
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      backgroundColor: journalContent.trim() ? colors.accent : colors.border,
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: journalContent.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Journal Entries List */}
            {resolution.journal && resolution.journal.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resolution.journal.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      backgroundColor: colors.bg,
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      borderLeft: `3px solid ${colors.accent}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          {entry.mood && (
                            <span title={entry.mood}>{moodEmojis[entry.mood]}</span>
                          )}
                          <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>
                            {new Date(entry.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '0.875rem',
                          color: colors.text,
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.5,
                        }}>
                          {entry.content}
                        </p>
                      </div>
                      <button
                        onClick={() => setJournalToDelete(entry.id)}
                        style={{
                          padding: '0.25rem',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: colors.textMuted,
                          opacity: 0.6,
                        }}
                        title="Delete entry"
                      >
                        <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : !showJournalForm && (
              <p style={{
                fontSize: '0.8125rem',
                color: colors.textTertiary,
                fontStyle: 'italic',
                margin: 0,
                padding: '0.5rem 0',
              }}>
                No journal entries yet — reflect after your first check-in.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Delete Resolution Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Resolution"
        message={`Are you sure you want to delete "${resolution.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep it"
        variant="danger"
        onConfirm={() => {
          deleteResolution(resolution.id);
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Delete Journal Entry Modal */}
      <ConfirmModal
        isOpen={journalToDelete !== null}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this journal entry? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep it"
        variant="warning"
        onConfirm={() => {
          if (journalToDelete) {
            deleteJournalEntry(resolution.id, journalToDelete);
          }
          setJournalToDelete(null);
        }}
        onCancel={() => setJournalToDelete(null)}
      />
    </div>

    {/* Context menu - sheet on mobile, popover on desktop */}
    <ContextMenu
      isOpen={showContextMenu}
      onClose={() => setShowContextMenu(false)}
      items={contextMenuItems}
      mode={isTouchDevice ? 'sheet' : 'popover'}
      anchorPosition={menuAnchorPosition}
    />

    {/* Quick Update Modal for cumulative/target types */}
    <QuickUpdateModal
      resolution={resolution}
      isOpen={showQuickUpdate}
      onClose={() => setShowQuickUpdate(false)}
      onSave={(resolutionId, newValue) => {
        updateResolution(resolutionId, { currentValue: newValue });
      }}
    />
    </>
  );
}
