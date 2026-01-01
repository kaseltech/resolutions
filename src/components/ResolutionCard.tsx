'use client';

import { useState } from 'react';
import { Resolution, getCategoryInfo, JournalEntry } from '@/types';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';
import { ProgressBar } from './ProgressBar';
import { MilestoneList } from './MilestoneList';

const moodEmojis: Record<NonNullable<JournalEntry['mood']>, string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  struggling: '😔',
};

interface ResolutionCardProps {
  resolution: Resolution;
  onEdit: (resolution: Resolution) => void;
}

export function ResolutionCard({ resolution, onEdit }: ResolutionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState<JournalEntry['mood']>(undefined);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const { deleteResolution, updateProgress, addJournalEntry, deleteJournalEntry } = useResolutions();
  const { theme, colors } = useTheme();

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
    <div
      style={{
        backgroundColor: isCompleted ? completedBg : colors.cardBg,
        borderRadius: '0.75rem',
        overflow: 'hidden',
        borderLeft: `4px solid ${borderColor}`,
        boxShadow: theme === 'light'
          ? '0 4px 12px -2px rgba(0, 0, 0, 0.08)'
          : '0 4px 12px -2px rgba(0, 0, 0, 0.3)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'white',
                  backgroundColor: categoryInfo.color,
                }}
              >
                {categoryInfo.icon} {categoryInfo.label}
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
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onEdit(resolution)}
              style={{
                padding: '0.5rem',
                color: colors.textMuted,
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
              title="Edit"
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this resolution?')) {
                  deleteResolution(resolution.id);
                }
              }}
              style={{
                padding: '0.5rem',
                color: colors.textMuted,
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
              title="Delete"
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text }}>Progress</span>
            {!isCompleted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => updateProgress(resolution.id, Math.max(0, resolution.progress - 10))}
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.textMuted,
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>
                <button
                  onClick={() => updateProgress(resolution.id, Math.min(100, resolution.progress + 10))}
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.textMuted,
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                  }}
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
            gap: '0.25rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {expanded ? 'Hide details' : 'Show details'}
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
                        onClick={() => {
                          if (confirm('Delete this journal entry?')) {
                            deleteJournalEntry(resolution.id, entry.id);
                          }
                        }}
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
    </div>
  );
}
