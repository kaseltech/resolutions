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

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
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
              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  color: colors.textMuted,
                  borderRadius: '0.5rem',
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              {/* Settings button */}
              <button
                onClick={() => setShowSettings(true)}
                data-tutorial="settings-button"
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  color: colors.textMuted,
                  borderRadius: '0.5rem',
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                title="Settings"
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              {/* Desktop: New Resolution button */}
              <button
                onClick={handleOpenForm}
                className="hidden-mobile"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: colors.accent,
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New</span>
              </button>
              <button
                onClick={signOut}
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'transparent',
                  color: colors.textMuted,
                  borderRadius: '0.5rem',
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                }}
                title="Sign Out"
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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

        {/* Drag hint - Desktop only */}
        {isDragEnabled && sortedResolutions.length > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1rem',
            backgroundColor: theme === 'light' ? 'rgba(138, 154, 128, 0.1)' : 'rgba(138, 154, 128, 0.15)',
            border: `1px solid ${theme === 'light' ? 'rgba(138, 154, 128, 0.3)' : 'rgba(138, 154, 128, 0.25)'}`,
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.8125rem',
            color: theme === 'light' ? '#6A7A60' : '#A0B090',
          }}>
            <svg style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.8 }} viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="9" r="1.5" />
              <circle cx="12" cy="9" r="1.5" />
              <circle cx="19" cy="9" r="1.5" />
              <circle cx="5" cy="15" r="1.5" />
              <circle cx="12" cy="15" r="1.5" />
              <circle cx="19" cy="15" r="1.5" />
            </svg>
            Drag cards to reorder
          </div>
        )}

        {/* Resolutions List - Responsive Grid */}
        {sortedResolutions.length > 0 ? (
          <div className="resolution-grid">
            {sortedResolutions.map((resolution, index) => (
              <div
                key={resolution.id}
                draggable={isDragEnabled}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                {...(index === 0 ? { 'data-tutorial': 'resolution-card' } : {})}
                style={{
                  cursor: isDragEnabled ? 'grab' : 'default',
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

      {/* Floating Action Button - Mobile */}
      <button
        onClick={handleOpenForm}
        className="fab-mobile"
        data-tutorial="add-button"
        style={{
          position: 'fixed',
          bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
          right: '1.5rem',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: colors.accent,
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
        }}
        title="New Resolution (C)"
      >
        <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
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
          gap: 1rem;
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px) {
          .resolution-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
        }

      `}</style>
    </div>
  );
}
