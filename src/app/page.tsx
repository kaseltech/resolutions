'use client';

import { useState } from 'react';
import { useResolutions } from '@/context/ResolutionContext';
import { useAuth } from '@/context/AuthContext';
import { Resolution, Category } from '@/types';
import { ResolutionCard } from '@/components/ResolutionCard';
import { ResolutionForm } from '@/components/ResolutionForm';
import { DashboardStats } from '@/components/DashboardStats';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Logo } from '@/components/Logo';

type SortOption = 'newest' | 'oldest' | 'progress-high' | 'progress-low' | 'deadline';

// Cloud Dancer theme - serene whites and soft neutrals
const colors = {
  bg: '#F5F5F0',
  cardBg: '#FFFFFF',
  border: '#E0E0DB',
  text: '#4A4A45',
  textMuted: '#8A8A85',
  accent: '#8A9A80',
};

export default function Home() {
  const { resolutions, loading, getResolutionsByCategory } = useResolutions();
  const { user, signOut } = useAuth();
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

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingResolution(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#8A9A80', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg }}>
      {/* Header */}
      <header style={{ backgroundColor: colors.cardBg, borderBottom: `1px solid ${colors.border}`, position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Logo size={48} />
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '500', color: colors.text, margin: 0 }}>2026 Resolutions</h1>
                <p style={{ fontSize: '0.875rem', color: colors.textMuted, margin: 0 }}>Track your journey to a better you</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>
                {user?.user_metadata?.username || user?.email}
              </span>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '0.625rem 1.25rem',
                  backgroundColor: colors.accent,
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Resolution
              </button>
              <button
                onClick={signOut}
                style={{
                  padding: '0.625rem 1rem',
                  backgroundColor: 'transparent',
                  color: colors.textMuted,
                  borderRadius: '0.5rem',
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {/* View Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', backgroundColor: colors.cardBg, borderRadius: '0.5rem', padding: '0.25rem', border: `1px solid ${colors.border}` }}>
            <button
              onClick={() => setView('dashboard')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
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
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: view === 'list' ? colors.accent : 'transparent',
                color: view === 'list' ? 'white' : colors.textMuted,
              }}
            >
              All Resolutions
            </button>
          </div>

          {view === 'list' && resolutions.length > 0 && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: 'white',
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="progress-high">Highest Progress</option>
              <option value="progress-low">Lowest Progress</option>
              <option value="deadline">By Deadline</option>
            </select>
          )}
        </div>

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div style={{ marginBottom: '2rem' }}>
            <DashboardStats />
          </div>
        )}

        {/* Category Filter */}
        {resolutions.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
          </div>
        )}

        {/* Resolutions List */}
        {sortedResolutions.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
            {sortedResolutions.map((resolution) => (
              <ResolutionCard
                key={resolution.id}
                resolution={resolution}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : resolutions.length > 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: colors.textMuted }}>
            No resolutions in this category yet.
          </div>
        ) : view === 'list' ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text, marginBottom: '0.5rem' }}>No resolutions yet</h2>
            <p style={{ color: colors.textMuted, marginBottom: '1rem' }}>
              Start by adding your first resolution for 2026!
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: colors.accent,
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Create Your First Resolution
            </button>
          </div>
        ) : null}
      </main>

      {/* Resolution Form Modal */}
      {showForm && (
        <ResolutionForm
          resolution={editingResolution}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
