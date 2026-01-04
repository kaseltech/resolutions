'use client';

import { useState, useEffect, useCallback } from 'react';
import { useResolutions } from '@/context/ResolutionContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Resolution, Category } from '@/types';
import { ResolutionCard } from '@/components/ResolutionCard';
import { ResolutionForm } from '@/components/ResolutionForm';
import { DashboardStats } from '@/components/DashboardStats';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Logo } from '@/components/Logo';
import { Confetti } from '@/components/Confetti';
import { Settings } from '@/components/Settings';
import { SwipeableCard } from '@/components/SwipeableCard';
import { SpotlightTutorial, hasSeenOnboarding } from '@/components/SpotlightTutorial';

type SortOption = 'custom' | 'newest' | 'oldest' | 'progress-high' | 'progress-low' | 'deadline';

export default function Home() {
  const { resolutions, loading, getResolutionsByCategory, reorderResolutions, updateProgress, showCelebration, celebrationMessage, dismissCelebration } = useResolutions();
  const { signOut } = useAuth();
  const { theme, toggleTheme, colors } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editingResolution, setEditingResolution] = useState<Resolution | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('custom');
  const [view, setView] = useState<'dashboard' | 'list'>('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [openJournalForId, setOpenJournalForId] = useState<string | null>(null);

  const filteredResolutions = getResolutionsByCategory(selectedCategory);

  const sortedResolutions = sortBy === 'custom'
    ? filteredResolutions
    : [...filteredResolutions].sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'progress-high':
            return b.progress - a.progress;
          case 'progress-low':
            return a.progress - b.progress;
          case 'deadline':
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          default:
            return 0;
        }
      });

  // Track if drag was initiated from handle
  const [dragFromHandle, setDragFromHandle] = useState(false);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    // Only allow drag if initiated from handle
    if (!dragFromHandle) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index && sortBy === 'custom' && selectedCategory === 'all') {
      reorderResolutions(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragFromHandle(false);
  };

  // Handler for drag handle mousedown - sets flag to allow drag
  const handleDragHandleMouseDown = () => {
    setDragFromHandle(true);
  };

  // Drag only works on desktop (not touch devices)
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    // Reset scroll position on mount (fixes scroll offset after login)
    window.scrollTo(0, 0);

    // Check if user has seen onboarding
    hasSeenOnboarding().then((seen) => {
      if (!seen) {
        setShowOnboarding(true);
      }
      setOnboardingChecked(true);
    });
  }, []);

  const isDragEnabled = sortBy === 'custom' && selectedCategory === 'all' && !isTouchDevice;

  const handleEdit = (resolution: Resolution) => {
    setEditingResolution(resolution);
    setShowForm(true);
  };

  const handleAddJournal = (resolution: Resolution) => {
    setOpenJournalForId(resolution.id);
  };

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingResolution(null);
  }, []);

  const handleOpenForm = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleShowOnboarding = useCallback(() => {
    setShowOnboarding(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        // Allow Escape to close form even when in input
        if (e.key === 'Escape' && showForm) {
          handleCloseForm();
        }
        return;
      }

      // 'C' to create new resolution
      if (e.key === 'c' || e.key === 'C') {
        if (!showForm) {
          e.preventDefault();
          handleOpenForm();
        }
      }

      // Escape to close modal
      if (e.key === 'Escape' && showForm) {
        handleCloseForm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm, handleCloseForm, handleOpenForm]);

  if (loading || !onboardingChecked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: colors.accent, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, paddingBottom: '5rem', transition: 'background-color 0.3s ease' }}>
      {/* Header - Mobile Optimized with safe area */}
      <header style={{
        backgroundColor: colors.cardBg,
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: theme === 'light' ? '0 1px 3px rgba(0,0,0,0.05)' : '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
        paddingTop: 'env(safe-area-inset-top)',
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Logo size="lg" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Dark mode toggle - 60% opacity icons */}
              <button
                onClick={toggleTheme}
                className="header-icon-btn"
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  color: colors.text,
                  opacity: 0.6,
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.15s ease',
                }}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                ) : (
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                )}
              </button>
              {/* Settings button - 60% opacity */}
              <button
                onClick={() => setShowSettings(true)}
                data-tutorial="settings-button"
                className="header-icon-btn"
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  color: colors.text,
                  opacity: 0.6,
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.15s ease',
                }}
                title="Settings"
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
              {/* Desktop: New Resolution button */}
              <button
                onClick={handleOpenForm}
                className="hidden-mobile"
                style={{
                  padding: '0.5rem 0.875rem',
                  backgroundColor: colors.accent,
                  color: '#1F3A5A',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  transition: 'opacity 0.15s ease',
                }}
              >
                New Resolution
              </button>
              {/* Sign out - 60% opacity */}
              <button
                onClick={signOut}
                className="header-icon-btn"
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  color: colors.text,
                  opacity: 0.6,
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.15s ease',
                }}
                title="Sign out"
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '1rem' }}>
        {/* View Toggle & Sort - Responsive */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <div
            data-tutorial="view-toggle"
            style={{
            display: 'flex',
            backgroundColor: colors.cardBg,
            borderRadius: '0.5rem',
            padding: '0.25rem',
            border: `1px solid ${colors.border}`,
            flex: '0 0 auto'
          }}>
            <button
              onClick={() => setView('dashboard')}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.8125rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: view === 'dashboard' ? colors.accent : 'transparent',
                color: view === 'dashboard' ? 'white' : colors.textMuted,
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setView('list')}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.8125rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: view === 'list' ? colors.accent : 'transparent',
                color: view === 'list' ? 'white' : colors.textMuted,
              }}
            >
              List
            </button>
          </div>

          {resolutions.length > 0 && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{
                padding: '0.5rem 0.625rem',
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                color: colors.text,
                flex: '0 0 auto',
              }}
            >
              <option value="custom">Custom Order</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="progress-high">Most Progress</option>
              <option value="progress-low">Least Progress</option>
              <option value="deadline">By Deadline</option>
            </select>
          )}

          {/* Category Filter - inline on mobile */}
          {resolutions.length > 0 && (
            <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
          )}
        </div>

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <DashboardStats />
          </div>
        )}

        {/* Drag hint - Desktop only (very subtle helper text) */}
        {isDragEnabled && sortedResolutions.length > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginBottom: '0.5rem',
            fontSize: '0.625rem',
            color: colors.textMuted,
            opacity: 0.5,
          }}>
            <svg style={{ width: 10, height: 10, flexShrink: 0 }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
            </svg>
            Use handle to reorder
          </div>
        )}

        {/* Resolutions List - Responsive Grid */}
        {sortedResolutions.length > 0 ? (
          <div className="resolution-grid">
            {sortedResolutions.map((resolution, index) => (
              <div
                key={resolution.id}
                draggable={isDragEnabled}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                {...(index === 0 ? { 'data-tutorial': 'resolution-card' } : {})}
                style={{
                  cursor: 'default',
                  opacity: draggedIndex === index ? 0.5 : 1,
                  transform: dragOverIndex === index ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.15s ease, opacity 0.15s ease',
                  position: 'relative',
                }}
              >
                {/* Drop indicator */}
                {dragOverIndex === index && draggedIndex !== index && (
                  <div style={{
                    position: 'absolute',
                    top: -4,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: colors.accent,
                    borderRadius: 2,
                    zIndex: 10,
                  }} />
                )}
                <SwipeableCard
                  onSwipeLeft={() => handleEdit(resolution)}
                  onSwipeRight={() => handleAddJournal(resolution)}
                  leftLabel="Edit"
                  rightLabel="Journal"
                  leftColor={theme === 'light' ? '#3b82f6' : '#60a5fa'}
                  rightColor={theme === 'light' ? '#8b5cf6' : '#a78bfa'}
                  disabled={!isTouchDevice}
                >
                  <ResolutionCard
                    resolution={resolution}
                    onEdit={handleEdit}
                    openJournalOnMount={openJournalForId === resolution.id}
                    onJournalOpened={() => setOpenJournalForId(null)}
                    isDragEnabled={isDragEnabled}
                    onDragHandleMouseDown={handleDragHandleMouseDown}
                  />
                </SwipeableCard>
              </div>
            ))}
          </div>
        ) : resolutions.length > 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: colors.textMuted }}>
            No resolutions in this category yet.
          </div>
        ) : view === 'list' ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎯</div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: colors.text, marginBottom: '0.5rem' }}>No resolutions yet</h2>
            <p style={{ color: colors.textMuted, marginBottom: '1rem', fontSize: '0.875rem' }}>
              Start your journey!
            </p>
            <button
              onClick={handleOpenForm}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: colors.accent,
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              Create Resolution
            </button>
          </div>
        ) : null}
      </main>

      {/* Floating Action Button - Mobile (smaller, more subtle) */}
      <button
        onClick={handleOpenForm}
        className="fab-mobile"
        data-tutorial="add-button"
        style={{
          position: 'fixed',
          bottom: 'calc(1.25rem + env(safe-area-inset-bottom))',
          right: '1.25rem',
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          backgroundColor: colors.accent,
          color: '#1F3A5A',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
          opacity: 0.9,
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}
        title="New Resolution (C)"
      >
        <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* Keyboard shortcuts hint - Desktop only */}
      <div className="keyboard-hints" style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        fontSize: '0.6875rem',
        color: colors.textMuted,
        opacity: 0.6,
      }}>
        <kbd style={{
          padding: '0.125rem 0.375rem',
          backgroundColor: colors.cardBg,
          borderRadius: '0.25rem',
          border: `1px solid ${colors.border}`,
          marginRight: '0.25rem',
          fontFamily: 'inherit'
        }}>C</kbd>
        New
      </div>

      {/* Resolution Form Modal */}
      {showForm && (
        <ResolutionForm
          resolution={editingResolution}
          onClose={handleCloseForm}
        />
      )}

      {/* Confetti Celebration */}
      <Confetti active={showCelebration} onComplete={dismissCelebration} />

      {/* Celebration Modal */}
      {showCelebration && celebrationMessage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: colors.cardBg,
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            zIndex: 9998,
            textAlign: 'center',
            animation: 'scaleIn 0.3s ease-out',
          }}
          onClick={dismissCelebration}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ color: colors.text, margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
            Congratulations!
          </h2>
          <p style={{ color: colors.textMuted, margin: 0, fontSize: '1rem' }}>
            {celebrationMessage}
          </p>
          <p style={{ color: colors.accent, marginTop: '1rem', fontSize: '0.875rem' }}>
            Tap anywhere to continue
          </p>
        </div>
      )}

      {/* Settings Modal */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} onShowOnboarding={handleShowOnboarding} />

      {/* Spotlight Tutorial */}
      {showOnboarding && (
        <SpotlightTutorial onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Mobile-specific styles */}
      <style jsx global>{`
        .resolution-grid {
          display: grid;
          gap: 1.125rem;
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px) {
          .resolution-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 1.25rem;
          }
        }

        .hidden-mobile {
          display: none;
        }

        .fab-mobile {
          display: flex;
        }

        .keyboard-hints {
          display: none;
        }

        /* Header icon hover states - subtle brightness increase */
        .header-icon-btn:hover {
          opacity: 1 !important;
        }

        /* Show card actions (menu + drag handle) on card hover - Desktop only */
        .card-hover:hover .card-actions {
          opacity: 1 !important;
        }
        .drag-handle:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        /* Hide desktop-only actions on mobile */
        .desktop-only-action {
          display: none;
        }

        /* Reduced animation speed globally */
        * {
          transition-duration: 0.15s !important;
        }

        @media (min-width: 768px) {
          .hidden-mobile {
            display: flex;
          }

          .fab-mobile {
            display: none;
          }

          .keyboard-hints {
            display: block;
          }

          /* Show desktop-only actions */
          .desktop-only-action {
            display: flex;
          }
        }

      `}</style>
    </div>
  );
}
