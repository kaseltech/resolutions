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

type SortOption = 'newest' | 'oldest' | 'progress-high' | 'progress-low' | 'deadline';

export default function Home() {
  const { resolutions, loading, getResolutionsByCategory } = useResolutions();
  const { signOut } = useAuth();
  const { theme, toggleTheme, colors } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editingResolution, setEditingResolution] = useState<Resolution | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [view, setView] = useState<'dashboard' | 'list'>('dashboard');

  const filteredResolutions = getResolutionsByCategory(selectedCategory);

  const sortedResolutions = [...filteredResolutions].sort((a, b) => {
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

  const handleEdit = (resolution: Resolution) => {
    setEditingResolution(resolution);
    setShowForm(true);
  };

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingResolution(null);
  }, []);

  const handleOpenForm = useCallback(() => {
    setShowForm(true);
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: colors.accent, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, paddingBottom: '5rem', transition: 'background-color 0.3s ease' }}>
      {/* Header - Mobile Optimized */}
      <header style={{
        backgroundColor: colors.cardBg,
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: theme === 'light' ? '0 1px 3px rgba(0,0,0,0.05)' : '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Logo size={44} />
              <div>
                <h1 style={{ fontSize: '1.125rem', fontWeight: '500', color: colors.text, margin: 0 }}>2026 Resolutions</h1>
              </div>
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
          <div style={{
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

          {view === 'list' && resolutions.length > 0 && (
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

        {/* Resolutions List - Responsive Grid */}
        {sortedResolutions.length > 0 ? (
          <div className="resolution-grid">
            {sortedResolutions.map((resolution) => (
              <ResolutionCard
                key={resolution.id}
                resolution={resolution}
                onEdit={handleEdit}
              />
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
              Start your 2026 journey!
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
        style={{
          position: 'fixed',
          bottom: '1.5rem',
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
