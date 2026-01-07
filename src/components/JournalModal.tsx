'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Resolution, JournalEntry } from '@/types';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';

const moodEmojis: Record<NonNullable<JournalEntry['mood']>, { emoji: string; label: string }> = {
  great: { emoji: '😄', label: 'Great' },
  good: { emoji: '🙂', label: 'Good' },
  okay: { emoji: '😐', label: 'Okay' },
  struggling: { emoji: '😔', label: 'Struggling' },
};

interface JournalModalProps {
  resolution: Resolution | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JournalModal({ resolution, isOpen, onClose }: JournalModalProps) {
  const { colors, theme } = useTheme();
  const { addJournalEntry, deleteJournalEntry } = useResolutions();
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>(undefined);
  const [isClosing, setIsClosing] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setContent('');
      setMood(undefined);
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

  const handleSubmit = () => {
    if (!content.trim() || !resolution) return;

    addJournalEntry(resolution.id, {
      content: content.trim(),
      mood,
    });

    setContent('');
    setMood(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!mounted || !isOpen || !resolution) return null;

  const entries = resolution.journal || [];

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
          maxWidth: '32rem',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: theme === 'light'
            ? '0 25px 80px -20px rgba(0, 0, 0, 0.25), 0 10px 40px -15px rgba(0, 0, 0, 0.1)'
            : '0 25px 80px -20px rgba(0, 0, 0, 0.5)',
          border: `1px solid ${theme === 'light' ? 'rgba(31, 58, 90, 0.08)' : colors.border}`,
          transform: isClosing ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.2s ease',
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📔</span>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: colors.text,
                margin: 0,
              }}>
                Journal
              </h2>
            </div>
            <p style={{
              fontSize: '0.8125rem',
              color: colors.textMuted,
              margin: 0,
              maxWidth: '20rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {resolution.title}
            </p>
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

        {/* New Entry Form */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: theme === 'light' ? 'rgba(201, 167, 90, 0.03)' : 'rgba(201, 167, 90, 0.05)',
        }}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How's it going? Reflect on your progress, challenges, or thoughts..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '1rem',
              backgroundColor: theme === 'light' ? '#FFFFFF' : colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: '0.75rem',
              color: colors.text,
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              resize: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />

          {/* Mood & Submit Row */}
          <div style={{
            marginTop: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}>
            {/* Mood Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', color: colors.textMuted }}>Feeling:</span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {(Object.entries(moodEmojis) as [NonNullable<JournalEntry['mood']>, { emoji: string; label: string }][]).map(([key, { emoji, label }]) => (
                  <button
                    key={key}
                    onClick={() => setMood(mood === key ? undefined : key)}
                    style={{
                      padding: '0.375rem 0.5rem',
                      fontSize: '1.125rem',
                      backgroundColor: mood === key
                        ? (theme === 'light' ? 'rgba(201, 167, 90, 0.15)' : 'rgba(201, 167, 90, 0.25)')
                        : 'transparent',
                      border: mood === key
                        ? `1px solid ${colors.accent}`
                        : `1px solid transparent`,
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    title={label}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              style={{
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: content.trim() ? colors.accent : colors.border,
                color: content.trim() ? '#1F3A5A' : colors.textMuted,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: content.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                boxShadow: content.trim() ? '0 2px 8px rgba(201, 167, 90, 0.3)' : 'none',
              }}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Entry
            </button>
          </div>

          <p style={{
            fontSize: '0.6875rem',
            color: colors.textMuted,
            marginTop: '0.75rem',
            marginBottom: 0,
            opacity: 0.7,
          }}>
            Press <kbd style={{
              padding: '0.125rem 0.25rem',
              backgroundColor: colors.bg,
              borderRadius: '0.25rem',
              border: `1px solid ${colors.border}`,
              fontFamily: 'inherit',
              fontSize: '0.625rem',
            }}>Ctrl</kbd>+<kbd style={{
              padding: '0.125rem 0.25rem',
              backgroundColor: colors.bg,
              borderRadius: '0.25rem',
              border: `1px solid ${colors.border}`,
              fontFamily: 'inherit',
              fontSize: '0.625rem',
            }}>Enter</kbd> to save
          </p>
        </div>

        {/* Entries List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem 1.5rem',
        }}>
          {entries.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2.5rem 1rem',
              color: colors.textMuted,
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.5 }}>📝</div>
              <p style={{ fontSize: '0.9375rem', margin: 0, marginBottom: '0.25rem' }}>No entries yet</p>
              <p style={{ fontSize: '0.8125rem', margin: 0, opacity: 0.7 }}>Start journaling your journey above</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    backgroundColor: colors.bg,
                    padding: '1rem 1.125rem',
                    borderRadius: '0.75rem',
                    borderLeft: `3px solid ${colors.accent}`,
                    position: 'relative',
                  }}
                >
                  {/* Entry Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.625rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {entry.mood && (
                        <span style={{ fontSize: '1rem' }}>{moodEmojis[entry.mood].emoji}</span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: new Date(entry.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
                        })}
                        {' · '}
                        {new Date(entry.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Delete Button */}
                    {entryToDelete === entry.id ? (
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <button
                          onClick={() => {
                            deleteJournalEntry(resolution.id, entry.id);
                            setEntryToDelete(null);
                          }}
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.6875rem',
                            fontWeight: 500,
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setEntryToDelete(null)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.6875rem',
                            backgroundColor: 'transparent',
                            color: colors.textMuted,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEntryToDelete(entry.id)}
                        style={{
                          padding: '0.25rem',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: colors.textMuted,
                          opacity: 0.5,
                          display: 'flex',
                        }}
                        title="Delete entry"
                      >
                        <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Entry Content */}
                  <p style={{
                    fontSize: '0.9375rem',
                    color: colors.text,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                  }}>
                    {entry.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Entry Count */}
        {entries.length > 0 && (
          <div style={{
            padding: '0.75rem 1.5rem',
            borderTop: `1px solid ${colors.border}`,
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
