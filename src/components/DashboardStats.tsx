'use client';

import { useState, useEffect, useMemo } from 'react';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';
import { CATEGORIES } from '@/types';
import { ProgressBar } from './ProgressBar';
import { CategoryIcon } from './CategoryIcon';
import { AchievementProgress } from './AchievementBadges';
import { getMotivationalQuote } from '@/lib/messages';

export function DashboardStats() {
  const { resolutions, getOverallProgress, getCompletedCount } = useResolutions();
  const { theme, colors } = useTheme();
  const overallProgress = getOverallProgress();
  const completedCount = getCompletedCount();
  const totalCount = resolutions.length;

  // Collapsible sections - default collapsed on mobile
  const [isMobile, setIsMobile] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [showDistribution, setShowDistribution] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      // Collapse by default on mobile
      if (mobile) {
        setShowCategories(false);
        setShowDistribution(false);
      } else {
        setShowCategories(true);
        setShowDistribution(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categoryStats = CATEGORIES.map(cat => ({
    ...cat,
    count: resolutions.filter(r => r.category === cat.value).length,
    avgProgress: Math.round(
      resolutions
        .filter(r => r.category === cat.value)
        .reduce((sum, r, _, arr) => sum + r.progress / (arr.length || 1), 0)
    ),
  })).filter(cat => cat.count > 0);

  const endOfYear = new Date(2026, 11, 31);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endOfYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const yearProgress = Math.round(((365 - daysRemaining) / 365) * 100);

  // Daily inspiration quote - changes based on overall progress
  const [quoteKey, setQuoteKey] = useState(0);
  const dailyQuote = useMemo(() => getMotivationalQuote(overallProgress), [overallProgress, quoteKey]);

  const refreshQuote = () => setQuoteKey(k => k + 1);

  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.cardBg,
    borderRadius: '0.75rem',
    padding: isMobile ? '1rem' : '1.25rem',
    border: `1px solid ${colors.border}`,
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  };

  if (totalCount === 0) {
    return (
      <div style={{
        background: theme === 'light'
          ? `linear-gradient(135deg, ${colors.cardBg}, ${colors.bg})`
          : `linear-gradient(135deg, ${colors.cardBg}, ${colors.bg})`,
        borderRadius: '1rem',
        padding: '2rem',
        textAlign: 'center',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '500', color: colors.text, marginBottom: '0.5rem' }}>Start Your 2026 Journey</h2>
        <p style={{ color: colors.textMuted }}>
          Create your first resolution and begin tracking your progress toward your goals!
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Main Stats Row */}
      <div className="stats-grid">
        <div style={cardStyle}>
          <div style={{ fontSize: '1.5rem', fontWeight: '500', color: theme === 'light' ? '#7A8A90' : '#94a3b8' }}>{totalCount}</div>
          <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>Total</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '1.5rem', fontWeight: '500', color: colors.accent }}>{completedCount}</div>
          <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>Done</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '1.5rem', fontWeight: '500', color: theme === 'light' ? '#9A8A80' : '#fbbf24' }}>{overallProgress}%</div>
          <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>Progress</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '1.5rem', fontWeight: '500', color: theme === 'light' ? '#A09080' : '#fb923c' }}>{daysRemaining}</div>
          <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>Days Left</div>
        </div>
      </div>
      <style jsx>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .dashboard-container {
            gap: 1.5rem;
          }
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }
        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
          }
        }
      `}</style>

      {/* Daily Inspiration */}
      <div style={{
        ...cardStyle,
        background: theme === 'light'
          ? 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)'
          : 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
        borderColor: theme === 'light' ? '#bbf7d0' : '#10b981',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>💡</span>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '0.9375rem',
              fontStyle: 'italic',
              color: colors.text,
              margin: 0,
              lineHeight: 1.5,
            }}>
              "{dailyQuote.text}"
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: colors.textMuted,
              margin: '0.5rem 0 0',
            }}>
              — {dailyQuote.author}
            </p>
          </div>
          <button
            onClick={refreshQuote}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: colors.textMuted,
              borderRadius: '0.375rem',
              transition: 'all 0.2s',
            }}
            title="New quote"
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ fontWeight: 500, color: colors.text, margin: 0 }}>Overall Progress</h3>
          <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>{completedCount} of {totalCount} complete</span>
        </div>
        <ProgressBar progress={overallProgress} size="lg" showLabel={false} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.875rem', color: colors.textMuted }}>
          <span>Start</span>
          <span>{overallProgress}%</span>
          <span>Goal</span>
        </div>
      </div>

      {/* Year Progress */}
      <div style={{
        background: theme === 'light'
          ? 'linear-gradient(135deg, #E8E8E3 0%, #D8D8D3 100%)'
          : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ fontWeight: 500, margin: 0, color: colors.text }}>Year Progress</h3>
          <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>{yearProgress}% of 2026</span>
        </div>
        <div style={{
          width: '100%',
          backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.1)',
          borderRadius: '9999px',
          height: '0.75rem',
          overflow: 'hidden'
        }}>
          <div
            style={{ height: '100%', backgroundColor: colors.accent, borderRadius: '9999px', transition: 'all 0.5s', width: `${yearProgress}%` }}
          />
        </div>
        <p style={{ fontSize: '0.875rem', marginTop: '0.75rem', color: colors.textMuted, marginBottom: 0 }}>
          {daysRemaining > 0
            ? `${daysRemaining} days left to achieve your goals!`
            : 'The year has ended. How did you do?'}
        </p>
      </div>

      {/* Achievements Progress */}
      <div style={cardStyle}>
        <AchievementProgress />
      </div>

      {/* Category Breakdown - Collapsible on mobile */}
      {categoryStats.length > 0 && (
        <div style={cardStyle}>
          <button
            onClick={() => isMobile && setShowCategories(!showCategories)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: isMobile ? 'pointer' : 'default',
              marginBottom: showCategories ? '1rem' : 0,
            }}
          >
            <h3 style={{ fontWeight: 500, color: colors.text, margin: 0 }}>Progress by Category</h3>
            {isMobile && (
              <svg
                style={{
                  width: 20,
                  height: 20,
                  color: colors.textMuted,
                  transform: showCategories ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          {showCategories && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categoryStats.map(cat => (
                <div key={cat.value}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: theme === 'light' ? cat.color : cat.darkColor,
                        backgroundColor: theme === 'light' ? cat.bgLight : cat.bgDark,
                        padding: '0.25rem 0.625rem',
                        borderRadius: '0.375rem',
                        border: `1px solid ${theme === 'light' ? `${cat.color}25` : `${cat.darkColor}35`}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <CategoryIcon category={cat.value} size={14} />
                      {cat.label}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: colors.textMuted, fontWeight: 500 }}>
                      {cat.count} resolution{cat.count !== 1 ? 's' : ''} · {cat.avgProgress}%
                    </span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: colors.border, borderRadius: '0.375rem', height: '0.5rem', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '0.375rem',
                        transition: 'all 0.5s',
                        width: `${cat.avgProgress}%`,
                        backgroundColor: theme === 'light' ? cat.color : cat.darkColor
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress Distribution Chart - Collapsible on mobile */}
      <div style={cardStyle}>
        <button
          onClick={() => isMobile && setShowDistribution(!showDistribution)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: isMobile ? 'pointer' : 'default',
            marginBottom: showDistribution ? '1rem' : 0,
          }}
        >
          <h3 style={{ fontWeight: 500, color: colors.text, margin: 0 }}>Progress Distribution</h3>
          {isMobile && (
            <svg
              style={{
                width: 20,
                height: 20,
                color: colors.textMuted,
                transform: showDistribution ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        {showDistribution && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '8rem', gap: '0.5rem' }}>
            {[
              { label: '0-25%', min: 0, max: 25, color: theme === 'light' ? '#C4A0A0' : '#f87171' },
              { label: '26-50%', min: 26, max: 50, color: theme === 'light' ? '#C4B0A0' : '#fbbf24' },
              { label: '51-75%', min: 51, max: 75, color: theme === 'light' ? '#B4B4A0' : '#a3e635' },
              { label: '76-99%', min: 76, max: 99, color: theme === 'light' ? '#A0B4A0' : '#34d399' },
              { label: '100%', min: 100, max: 100, color: colors.accent },
            ].map(bucket => {
              const count = resolutions.filter(
                r => r.progress >= bucket.min && r.progress <= bucket.max
              ).length;
              const height = totalCount > 0 ? (count / totalCount) * 100 : 0;
              return (
                <div key={bucket.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: colors.text, marginBottom: '0.25rem' }}>{count}</div>
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: bucket.color,
                      borderTopLeftRadius: '0.5rem',
                      borderTopRightRadius: '0.5rem',
                      transition: 'all 0.5s',
                      height: `${Math.max(4, height)}%`,
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.5rem' }}>{bucket.label}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
