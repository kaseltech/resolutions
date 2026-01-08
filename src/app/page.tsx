'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useResolutions } from '@/context/ResolutionContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Resolution, Category } from '@/types';
import { ResolutionCard } from '@/components/ResolutionCard';
import { ResolutionForm } from '@/components/ResolutionForm';
import { DashboardStats } from '@/components/DashboardStats';
import { CategoryFilter } from '@/components/CategoryFilter';
import Image from 'next/image';
import { Confetti } from '@/components/Confetti';
import { Settings } from '@/components/Settings';
import { SwipeableCard } from '@/components/SwipeableCard';
import { SpotlightTutorial, hasSeenOnboarding } from '@/components/SpotlightTutorial';
import { YearVowIcon } from '@/components/YearVowIcon';

type SortOption = 'custom' | 'newest' | 'oldest' | 'progress-high' | 'progress-low' | 'deadline';

export default function Home() {
  const { resolutions, loading, getResolutionsByCategory, reorderResolutions, updateProgress, showCelebration, celebrationMessage, dismissCelebration } = useResolutions();
  const { signOut } = useAuth();
  const { colors } = useTheme();

  const [showForm, setShowForm] = useState(false);
  const [editingResolution, setEditingResolution] = useState<Resolution | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('custom');
  const [view, setView] = useState<'today' | 'all'>('today');
  const [showFilterSort, setShowFilterSort] = useState(false);
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
      <header className="app-header" style={{
        backgroundColor: colors.cardBg,
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
        paddingTop: 'env(safe-area-inset-top)',
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Image
                src="/yearvow-wordmark.png"
                alt="YearVow 2026"
                width={142}
                height={40}
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
        {/* Today / All Goals Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}>
          {/* Primary Nav Tabs */}
          <div
            data-tutorial="view-toggle"
            style={{
              display: 'flex',
              backgroundColor: colors.cardBg,
              borderRadius: '0.5rem',
              padding: '0.25rem',
              border: `1px solid ${colors.border}`,
            }}
          >
            <button
              onClick={() => setView('today')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.8125rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: view === 'today' ? colors.accent : 'transparent',
                color: view === 'today' ? 'white' : colors.textMuted,
              }}
            >
              Today
            </button>
            <button
              onClick={() => setView('all')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.8125rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: view === 'all' ? colors.accent : 'transparent',
                color: view === 'all' ? 'white' : colors.textMuted,
              }}
            >
              All Goals
            </button>
          </div>

          {/* Filter/Sort Button - Only show in All Goals view when there are resolutions */}
          {view === 'all' && resolutions.length > 0 && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowFilterSort(!showFilterSort)}
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: (sortBy !== 'custom' || selectedCategory !== 'all') ? `${colors.accent}15` : colors.cardBg,
                  border: `1px solid ${(sortBy !== 'custom' || selectedCategory !== 'all') ? colors.accent : colors.border}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: (sortBy !== 'custom' || selectedCategory !== 'all') ? colors.accent : colors.textMuted,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
                Filter
                {(sortBy !== 'custom' || selectedCategory !== 'all') && (
                  <span style={{
                    width: '0.375rem',
                    height: '0.375rem',
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                  }} />
                )}
              </button>

              {/* Filter/Sort Dropdown */}
              {showFilterSort && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                    onClick={() => setShowFilterSort(false)}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    zIndex: 50,
                    minWidth: '200px',
                    overflow: 'hidden',
                  }}>
                    {/* Sort Section */}
                    <div style={{ padding: '0.75rem', borderBottom: `1px solid ${colors.border}` }}>
                      <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.textMuted, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Sort by
                      </div>
                      {[
                        { value: 'custom', label: 'Manual order' },
                        { value: 'deadline', label: 'Due date' },
                        { value: 'progress-high', label: 'Most progress' },
                        { value: 'progress-low', label: 'Least progress' },
                        { value: 'newest', label: 'Newest' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value as SortOption)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '0.5rem 0.5rem',
                            backgroundColor: sortBy === option.value ? `${colors.accent}15` : 'transparent',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.8125rem',
                            color: sortBy === option.value ? colors.accent : colors.text,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          {sortBy === option.value && (
                            <svg style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.5rem' }} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          )}
                          <span style={{ marginLeft: sortBy === option.value ? 0 : '1.25rem' }}>{option.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Category Section */}
                    <div style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: colors.textMuted, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Category
                      </div>
                      <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} variant="list" />
                    </div>

                    {/* Reset Button */}
                    {(sortBy !== 'custom' || selectedCategory !== 'all') && (
                      <div style={{ padding: '0.5rem 0.75rem', borderTop: `1px solid ${colors.border}` }}>
                        <button
                          onClick={() => {
                            setSortBy('custom');
                            setSelectedCategory('all');
                          }}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            color: colors.textMuted,
                            cursor: 'pointer',
                          }}
                        >
                          Reset filters
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Today View - Stats + Actionable Items */}
        {view === 'today' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <DashboardStats onEditResolution={handleEdit} />
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
                  leftColor="#60a5fa"
                  rightColor="#a78bfa"
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
        ) : view === 'all' ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
              <YearVowIcon name="target" size={64} />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: colors.text, marginBottom: '0.5rem' }}>No goals yet</h2>
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
              Create Goal
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
