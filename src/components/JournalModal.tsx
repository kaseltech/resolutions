'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Resolution, JournalEntry } from '@/types';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';
import { FeatherPenIcon } from './FeatherPenIcon';
import { YearVowIcon } from './YearVowIcon';

// Keep for displaying old entries that have moods
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

// Toolbar Button Component
function ToolbarButton({
  onClick,
  isActive,
  disabled,
  title,
  children,
  colors,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        padding: '0.375rem',
        backgroundColor: isActive ? colors.accent : 'transparent',
        color: isActive ? '#1F3A5A' : colors.textMuted,
        border: 'none',
        borderRadius: '0.375rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  );
}

// Entry Viewer Modal
function EntryViewerModal({
  entry,
  isOpen,
  onClose,
  onDelete,
  colors,
  theme,
}: {
  entry: JournalEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
  theme: string;
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShowDeleteConfirm(false);
      onClose();
    }, 200);
  };

  if (!isOpen || !entry) return null;

  return createPortal(
    <div
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 110,
        padding: '1rem',
        opacity: isClosing ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <div
        style={{
          backgroundColor: theme === 'light' ? '#FDFCFA' : colors.cardBg,
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '28rem',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 80px -20px rgba(0, 0, 0, 0.4)',
          border: `1px solid ${colors.border}`,
          transform: isClosing ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {entry.mood && (
              <span style={{ fontSize: '1.125rem' }}>{moodEmojis[entry.mood].emoji}</span>
            )}
            <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>
              {new Date(entry.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <button
            onClick={handleClose}
            style={{
              padding: '0.375rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              color: colors.textMuted,
              display: 'flex',
            }}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
        }}>
          <div
            className="journal-entry-content"
            style={{
              fontSize: '1rem',
              color: colors.text,
              lineHeight: 1.7,
            }}
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.875rem 1.25rem',
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>
            {new Date(entry.createdAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>

          {showDeleteConfirm ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  onDelete();
                  handleClose();
                }}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                }}
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.8125rem',
                  backgroundColor: 'transparent',
                  color: colors.textMuted,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '0.8125rem',
                backgroundColor: 'transparent',
                color: colors.textMuted,
                border: `1px solid ${colors.border}`,
                borderRadius: '0.375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function JournalModal({ resolution, isOpen, onClose }: JournalModalProps) {
  const { colors, theme } = useTheme();
  const { addJournalEntry, deleteJournalEntry } = useResolutions();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Reflect on your progress, challenges, or thoughts...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'journal-editor',
        style: `
          min-height: 120px;
          outline: none;
          font-size: 0.9375rem;
          line-height: 1.7;
        `,
      },
      handleKeyDown: (view, event) => {
        // Auto-capitalize after sentence endings
        if (event.key === ' ') {
          const { state } = view;
          const { from } = state.selection;
          const textBefore = state.doc.textBetween(Math.max(0, from - 3), from, ' ');

          if (/[.!?]\s?$/.test(textBefore)) {
            // The next character typed should be capitalized
            // This is handled naturally by the browser's autocapitalize
          }
        }
        return false;
      },
    },
    // Re-create editor when modal opens
    onCreate: ({ editor }) => {
      if (isOpen) {
        setTimeout(() => editor.commands.focus(), 100);
      }
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus editor when modal opens
  useEffect(() => {
    if (isOpen && editor) {
      setTimeout(() => editor.commands.focus(), 100);
    }
  }, [isOpen, editor]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen && editor) {
      editor.commands.clearContent();
      setIsClosing(false);
    }
  }, [isOpen, editor]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = useCallback(() => {
    if (!editor || editor.isEmpty || !resolution) return;

    const htmlContent = editor.getHTML();

    addJournalEntry(resolution.id, {
      content: htmlContent,
    });

    editor.commands.clearContent();
  }, [editor, resolution, addJournalEntry]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Escape' && !viewingEntry) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleSubmit, handleClose, viewingEntry]);

  if (!mounted || !isOpen || !resolution) return null;

  const entries = resolution.journal || [];
  const hasContent = editor && !editor.isEmpty;

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <YearVowIcon name="quill-scroll" size={36} />
            <div>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: colors.text,
                margin: 0,
              }}>
                Journal
              </h2>
              <p style={{
                fontSize: '0.8125rem',
                color: colors.textMuted,
                margin: 0,
                maxWidth: '18rem',
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

        {/* New Entry Form */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: theme === 'light' ? 'rgba(201, 167, 90, 0.03)' : 'rgba(201, 167, 90, 0.05)',
        }}>
          {/* Formatting Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginBottom: '0.625rem',
            paddingBottom: '0.625rem',
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBold().run()}
              isActive={editor?.isActive('bold')}
              title="Bold (Cmd+B)"
              colors={colors}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
              </svg>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              isActive={editor?.isActive('italic')}
              title="Italic (Cmd+I)"
              colors={colors}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
              </svg>
            </ToolbarButton>

            <div style={{ width: '1px', height: '1.25rem', backgroundColor: colors.border, margin: '0 0.375rem' }} />

            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              isActive={editor?.isActive('bulletList')}
              title="Bullet List"
              colors={colors}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
              </svg>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              isActive={editor?.isActive('orderedList')}
              title="Numbered List"
              colors={colors}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
              </svg>
            </ToolbarButton>

            <div style={{ width: '1px', height: '1.25rem', backgroundColor: colors.border, margin: '0 0.375rem' }} />

            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor?.isActive('heading', { level: 2 })}
              title="Heading"
              colors={colors}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 4v3h5.5v12h3V7H19V4z"/>
              </svg>
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              isActive={editor?.isActive('blockquote')}
              title="Quote"
              colors={colors}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
              </svg>
            </ToolbarButton>
          </div>

          {/* Editor */}
          <div
            style={{
              backgroundColor: theme === 'light' ? '#FFFFFF' : colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: '0.75rem',
              padding: '1rem',
              color: colors.text,
              minHeight: '120px',
            }}
          >
            <EditorContent editor={editor} />
          </div>

          {/* Submit Row */}
          <div style={{
            marginTop: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <p style={{
              fontSize: '0.6875rem',
              color: colors.textMuted,
              margin: 0,
              opacity: 0.7,
            }}>
              <kbd style={{
                padding: '0.125rem 0.25rem',
                backgroundColor: colors.bg,
                borderRadius: '0.25rem',
                border: `1px solid ${colors.border}`,
                fontFamily: 'inherit',
                fontSize: '0.625rem',
              }}>⌘</kbd>+<kbd style={{
                padding: '0.125rem 0.25rem',
                backgroundColor: colors.bg,
                borderRadius: '0.25rem',
                border: `1px solid ${colors.border}`,
                fontFamily: 'inherit',
                fontSize: '0.625rem',
              }}>Enter</kbd> to save
            </p>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!hasContent}
              style={{
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: hasContent ? colors.accent : colors.border,
                color: hasContent ? '#1F3A5A' : colors.textMuted,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: hasContent ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                boxShadow: hasContent ? '0 2px 8px rgba(201, 167, 90, 0.3)' : 'none',
              }}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Entry
            </button>
          </div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {entries.map((entry) => {
                // Get plain text preview
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = entry.content;
                const plainText = tempDiv.textContent || tempDiv.innerText || '';
                const preview = plainText.slice(0, 80) + (plainText.length > 80 ? '...' : '');

                return (
                  <button
                    key={entry.id}
                    onClick={() => setViewingEntry(entry)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      backgroundColor: colors.bg,
                      padding: '0.875rem 1rem',
                      borderRadius: '0.75rem',
                      border: `1px solid ${colors.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = colors.accent;
                      e.currentTarget.style.backgroundColor = theme === 'light'
                        ? 'rgba(201, 167, 90, 0.05)'
                        : 'rgba(201, 167, 90, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = colors.border;
                      e.currentTarget.style.backgroundColor = colors.bg;
                    }}
                  >
                    {/* Date */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.375rem',
                    }}>
                      {entry.mood && (
                        <span style={{ fontSize: '0.875rem' }}>{moodEmojis[entry.mood].emoji}</span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: colors.accent, fontWeight: 500 }}>
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: colors.textMuted }}>
                        {new Date(entry.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Preview */}
                    <p style={{
                      fontSize: '0.875rem',
                      color: colors.text,
                      margin: 0,
                      lineHeight: 1.5,
                      opacity: 0.9,
                    }}>
                      {preview || 'Empty entry'}
                    </p>
                  </button>
                );
              })}
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

      {/* Entry Viewer Modal */}
      <EntryViewerModal
        entry={viewingEntry}
        isOpen={!!viewingEntry}
        onClose={() => setViewingEntry(null)}
        onDelete={() => {
          if (viewingEntry) {
            deleteJournalEntry(resolution.id, viewingEntry.id);
          }
        }}
        colors={colors}
        theme={theme}
      />
    </div>
  );

  return createPortal(modalContent, document.body);
}
