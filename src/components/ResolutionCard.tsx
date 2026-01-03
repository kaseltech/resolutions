'use client';

import { useState, useEffect } from 'react';
import { Resolution, getCategoryInfo, JournalEntry } from '@/types';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';
import { ProgressBar } from './ProgressBar';
import { MilestoneList } from './MilestoneList';
import { CategoryIcon } from './CategoryIcon';
import { ConfirmModal } from './ConfirmModal';
import { ContextMenu, useLongPress } from './ContextMenu';

const moodEmojis: Record<NonNullable<JournalEntry['mood']>, string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  struggling: '😔',
};

interface ResolutionCardProps {
  resolution: Resolution;
  onEdit: (resolution: Resolution) => void;
  openJournalOnMount?: boolean;
  onJournalOpened?: () => void;
}

export function ResolutionCard({ resolution, onEdit, openJournalOnMount, onJournalOpened }: ResolutionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState<JournalEntry['mood']>(undefined);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const { deleteResolution, updateProgress, addJournalEntry, deleteJournalEntry } = useResolutions();
  const { theme, colors } = useTheme();

  // Open journal when triggered from parent (e.g., swipe action)
  useEffect(() => {
    if (openJournalOnMount) {
      setExpanded(true);
      setShowJournalForm(true);
      onJournalOpened?.();
    }
  }, [openJournalOnMount, onJournalOpened]);

  // Long press handler for context menu
  const longPressHandlers = useLongPress(
    () => setShowContextMenu(true),
    { threshold: 500 }
  );

  // Context menu items
  const contextMenuItems = [
    {
      label: 'Edit Resolution',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: () => onEdit(resolution),
    },
    {
      label: resolution.progress < 100 ? 'Add 10% Progress' : 'Completed!',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () => {
        if (resolution.progress < 100) {
          updateProgress(resolution.id, Math.min(100, resolution.progress + 10));
        }
      },
    },
    {
      label: 'Add Journal Entry',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: () => {
        setExpanded(true);
        setShowJournalForm(true);
      },
    },
    {
      label: 'Delete',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: () => setShowDeleteModal(true),
      variant: 'danger' as const,
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
  const isCompleted = resolution.progress === 100;

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
      }}
    >
      {/* Tappable card header area - clicking opens edit */}
      <div
        onClick={() => onEdit(resolution)}
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
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  color: theme === 'light' ? categoryInfo.color : categoryInfo.darkColor,
                  backgroundColor: theme === 'light' ? categoryInfo.bgLight : categoryInfo.bgDark,
                  border: `1px solid ${theme === 'light' ? `${categoryInfo.color}30` : `${categoryInfo.darkColor}40`}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <CategoryIcon category={resolution.category} size={14} />
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
          <div style={{ display: 'flex', gap: '0.25rem' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="action-btn action-btn-danger"
              style={{
                padding: '0.5rem',
                color: colors.textMuted,
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Delete"
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Non-tappable card content area */}
      <div style={{ padding: '0 1.25rem 1.25rem' }}>

        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text }}>Progress</span>
            {!isCompleted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            marginTop: '0.75rem',
            fontSize: '0.875rem',
            color: colors.accent,
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {expanded ? 'Hide' : 'Journal & Notes'}
          {!expanded && resolution.journal && resolution.journal.length > 0 && (
            <span style={{
              backgroundColor: `${colors.accent}20`,
              padding: '0.125rem 0.375rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
            }}>
              {resolution.journal.length}
            </span>
          )}
          <svg
            style={{
              width: '1rem',
              height: '1rem',
              transition: 'transform 0.2s',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
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

          {/* Journal Section */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📝 Journal
                {resolution.journal && resolution.journal.length > 0 && (
                  <span style={{
                    backgroundColor: colors.border,
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    color: colors.textMuted,
                  }}>
                    {resolution.journal.length}
                  </span>
                )}
              </h4>
              <button
                onClick={() => setShowJournalForm(!showJournalForm)}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.75rem',
                  backgroundColor: showJournalForm ? colors.border : colors.accent,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                {showJournalForm ? 'Cancel' : '+ Add Entry'}
              </button>
            </div>

            {/* Add Journal Entry Form */}
            {showJournalForm && (
              <div style={{
                backgroundColor: colors.bg,
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
              }}>
                <textarea
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="How's it going? Write about your progress, challenges, or thoughts..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '0.75rem',
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '0.375rem',
                    color: colors.text,
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>How are you feeling?</span>
                    {(Object.entries(moodEmojis) as [NonNullable<JournalEntry['mood']>, string][]).map(([mood, emoji]) => (
                      <button
                        key={mood}
                        onClick={() => setJournalMood(journalMood === mood ? undefined : mood)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '1rem',
                          backgroundColor: journalMood === mood ? `${colors.accent}30` : 'transparent',
                          border: journalMood === mood ? `1px solid ${colors.accent}` : `1px solid ${colors.border}`,
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                        }}
                        title={mood}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleAddJournalEntry}
                    disabled={!journalContent.trim()}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      backgroundColor: journalContent.trim() ? colors.accent : colors.border,
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: journalContent.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Save Entry
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
                fontSize: '0.875rem',
                color: colors.textMuted,
                fontStyle: 'italic',
                margin: 0,
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: colors.bg,
                borderRadius: '0.5rem',
              }}>
                No journal entries yet. Start documenting your journey!
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

    {/* Long-press context menu */}
    <ContextMenu
      isOpen={showContextMenu}
      onClose={() => setShowContextMenu(false)}
      items={contextMenuItems}
    />
    </>
  );
}
