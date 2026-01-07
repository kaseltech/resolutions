'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/context/ThemeContext';
import { FeatherPenIcon } from './FeatherPenIcon';

// YearVow brand colors
const BRAND = {
  navy: '#1F3A5A',
  navyLight: '#2A4A6A',
  cream: '#F5F1EA',
  gold: '#C9A75A',
  goldMuted: '#B8A070',
};

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: {
    type: 'added' | 'improved' | 'fixed' | 'changed';
    description: string;
  }[];
}

// Changelog data - add new entries at the top
const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: 'January 6, 2026',
    title: 'Journal Modal & Checklist Tracking',
    changes: [
      { type: 'added', description: 'New Journal Modal - a dedicated, elegant modal for journaling your resolution progress' },
      { type: 'added', description: 'Checklist tracking type - create task-based resolutions with checkbox items' },
      { type: 'added', description: 'Partial progress tracking for checklist items (e.g., "$250 / $2,000 paid off")' },
      { type: 'added', description: 'Unit selector for checklist items ($, hrs, pts, or custom)' },
      { type: 'added', description: 'Gold feathered pen icon for journaling' },
      { type: 'added', description: 'Changelog page to track app updates' },
      { type: 'improved', description: 'Simplified card expansion - only shows notes and milestones when relevant' },
      { type: 'changed', description: 'Removed Notes field from resolution form (use description or journal instead)' },
    ],
  },
  {
    version: '1.1.0',
    date: 'January 5, 2026',
    title: 'Navigation Overhaul & Design Polish',
    changes: [
      { type: 'added', description: 'New navigation: Today view (goals needing attention) and All Goals view' },
      { type: 'added', description: 'View modes: Dashboard, Focus, and Reflect for different mindsets' },
      { type: 'added', description: 'Collapsible Insights section with tracking-aware metrics' },
      { type: 'improved', description: 'Refined design token system with consistent spacing and colors' },
      { type: 'improved', description: 'Journal UX with better habit check-ins flow' },
      { type: 'improved', description: 'Resolution form modal with enhanced visual depth' },
      { type: 'fixed', description: 'Check-in timezone bug that caused incorrect date tracking' },
      { type: 'fixed', description: 'Modal height issues on various screen sizes' },
    ],
  },
  {
    version: '1.0.2',
    date: 'January 4, 2026',
    title: 'YearVow Rebrand & Tracking Types',
    changes: [
      { type: 'added', description: 'New tracking types: Check-ins (frequency), Cumulative, Target, and Reflection' },
      { type: 'added', description: 'Quick update modal for cumulative and target progress' },
      { type: 'added', description: 'Desktop context menu (popover instead of action sheet)' },
      { type: 'changed', description: 'Rebranded from "2026 Resolutions" to "YearVow"' },
      { type: 'improved', description: 'New app icon with V + 2026 design' },
      { type: 'improved', description: 'Login screen with brand-aligned styling' },
      { type: 'improved', description: 'Category chips with refined muted styling' },
      { type: 'fixed', description: 'Status bar black bar issue' },
      { type: 'fixed', description: 'Google login hanging on some devices' },
      { type: 'fixed', description: 'Desktop drag handle and menu button visibility' },
    ],
  },
  {
    version: '1.0.1',
    date: 'January 3, 2026',
    title: 'Tutorial & Authentication',
    changes: [
      { type: 'added', description: 'Interactive spotlight tutorial for new users' },
      { type: 'added', description: 'Help & FAQ section in settings' },
      { type: 'added', description: 'Sample resolution for new users to explore' },
      { type: 'added', description: 'Sign in with Apple support' },
      { type: 'added', description: 'Sign in with Google support' },
      { type: 'improved', description: 'Splash screen animations' },
      { type: 'fixed', description: 'Face ID authentication flow' },
      { type: 'fixed', description: 'Social provider session clearing on logout' },
    ],
  },
  {
    version: '1.0.0',
    date: 'January 1-2, 2026',
    title: 'Initial Release',
    changes: [
      { type: 'added', description: 'Create and track New Year\'s resolutions with categories' },
      { type: 'added', description: 'Progress tracking with visual progress bars' },
      { type: 'added', description: 'Journal entries with mood tracking' },
      { type: 'added', description: 'Milestones to break down big goals' },
      { type: 'added', description: 'Dark and light theme support' },
      { type: 'added', description: 'Biometric authentication (Face ID / Touch ID)' },
      { type: 'added', description: 'Push notification reminders' },
      { type: 'added', description: 'Drag and drop reordering' },
      { type: 'added', description: 'Swipe actions for quick access' },
      { type: 'added', description: 'iOS native app with Capacitor' },
      { type: 'added', description: 'Privacy policy' },
    ],
  },
];

const typeColors = {
  added: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', label: 'New' },
  improved: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', label: 'Improved' },
  fixed: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', label: 'Fixed' },
  changed: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', label: 'Changed' },
};

interface ChangelogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Changelog({ isOpen, onClose }: ChangelogProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!mounted || !isOpen) return null;

  const isDark = theme === 'dark';

  const modalContent = (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '1rem',
        opacity: isClosing ? 0 : 1,
        transition: 'opacity 0.25s ease',
      }}
    >
      <div
        style={{
          backgroundColor: isDark ? BRAND.navy : BRAND.cream,
          borderRadius: '1.5rem',
          width: '100%',
          maxWidth: '36rem',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 80px -20px rgba(0, 0, 0, 0.5)',
          border: `1px solid ${isDark ? 'rgba(201, 167, 90, 0.2)' : 'rgba(31, 58, 90, 0.1)'}`,
          transform: isClosing ? 'scale(0.95) translateY(10px)' : 'scale(1) translateY(0)',
          transition: 'transform 0.25s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header - Navy with gold accents */}
        <div style={{
          padding: '1.5rem 1.75rem',
          background: isDark
            ? `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.navyLight} 100%)`
            : `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.navyLight} 100%)`,
          borderBottom: `1px solid rgba(201, 167, 90, 0.3)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.75rem',
              backgroundColor: 'rgba(201, 167, 90, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FeatherPenIcon size={22} color={BRAND.gold} />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: BRAND.cream,
                margin: 0,
                fontFamily: 'var(--font-libre-baskerville), Georgia, serif',
              }}>
                What's New
              </h2>
              <p style={{
                fontSize: '0.75rem',
                color: BRAND.goldMuted,
                margin: 0,
                marginTop: '0.125rem',
              }}>
                YearVow Changelog
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              padding: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              color: BRAND.cream,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease',
            }}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Changelog entries */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem 1.75rem',
        }}>
          {CHANGELOG.map((entry, index) => (
            <div
              key={entry.version}
              style={{
                marginBottom: index < CHANGELOG.length - 1 ? '2rem' : 0,
                paddingBottom: index < CHANGELOG.length - 1 ? '2rem' : 0,
                borderBottom: index < CHANGELOG.length - 1
                  ? `1px solid ${isDark ? 'rgba(201, 167, 90, 0.15)' : 'rgba(31, 58, 90, 0.1)'}`
                  : 'none',
              }}
            >
              {/* Version header */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{
                    padding: '0.25rem 0.625rem',
                    backgroundColor: isDark ? 'rgba(201, 167, 90, 0.2)' : BRAND.navy,
                    color: isDark ? BRAND.gold : BRAND.cream,
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    fontFamily: 'monospace',
                  }}>
                    v{entry.version}
                  </span>
                  <span style={{
                    fontSize: '0.8125rem',
                    color: isDark ? 'rgba(245, 241, 234, 0.5)' : 'rgba(31, 58, 90, 0.5)',
                  }}>
                    {entry.date}
                  </span>
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: isDark ? BRAND.cream : BRAND.navy,
                  margin: 0,
                }}>
                  {entry.title}
                </h3>
              </div>

              {/* Changes list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {entry.changes.map((change, changeIndex) => {
                  const typeStyle = typeColors[change.type];
                  return (
                    <div
                      key={changeIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.625rem',
                      }}
                    >
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        backgroundColor: typeStyle.bg,
                        color: typeStyle.text,
                        borderRadius: '0.25rem',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        flexShrink: 0,
                        marginTop: '0.125rem',
                      }}>
                        {typeStyle.label}
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        color: isDark ? 'rgba(245, 241, 234, 0.85)' : 'rgba(31, 58, 90, 0.85)',
                        lineHeight: 1.5,
                      }}>
                        {change.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: `1px solid ${isDark ? 'rgba(201, 167, 90, 0.15)' : 'rgba(31, 58, 90, 0.1)'}`,
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: isDark ? 'rgba(245, 241, 234, 0.4)' : 'rgba(31, 58, 90, 0.4)',
            margin: 0,
          }}>
            Made with care for your journey
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
