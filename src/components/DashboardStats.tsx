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
        background: colors.cardBg,
        borderRadius: '0.75rem',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        border: `1px solid ${colors.border}`,
      }}>
        <svg style={{ width: '3rem', height: '3rem', color: colors.text, opacity: 0.25, marginBottom: '1rem' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: colors.text, marginBottom: '0.5rem' }}>This is where your year takes shape</h2>
        <p style={{ color: colors.textMuted, fontSize: '0.875rem', opacity: 0.85 }}>
          Create your first resolution to begin tracking progress toward your goals.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Main Stats Row - with icons */}
      <div className="stats-grid">
        <div style={{ ...cardStyle, padding: isMobile ? '0.75rem' : '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
            <svg style={{ width: '0.875rem', height: '0.875rem', color: colors.text, opacity: 0.15 }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <div style={{ fontSize: '2rem', fontWeight: '500', color: colors.accent }}>{totalCount}</div>
          </div>
          <div style={{ fontSize: '0.5625rem', color: colors.textMuted, textTransform: 'lowercase', opacity: 0.5, letterSpacing: '-0.01em' }}>total</div>
        </div>
        <div style={{ ...cardStyle, padding: isMobile ? '0.75rem' : '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
            <svg style={{ width: '0.875rem', height: '0.875rem', color: colors.text, opacity: 0.15 }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <div style={{ fontSize: '2rem', fontWeight: '500', color: colors.accent }}>{completedCount}</div>
          </div>
          <div style={{ fontSize: '0.5625rem', color: colors.textMuted, textTransform: 'lowercase', opacity: 0.5, letterSpacing: '-0.01em' }}>done</div>
        </div>
        <div style={{ ...cardStyle, padding: isMobile ? '0.75rem' : '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
            <svg style={{ width: '0.875rem', height: '0.875rem', color: colors.text, opacity: 0.15 }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
            <div style={{ fontSize: '2rem', fontWeight: '500', color: colors.accent }}>{overallProgress}%</div>
          </div>
          <div style={{ fontSize: '0.5625rem', color: colors.textMuted, textTransform: 'lowercase', opacity: 0.5, letterSpacing: '-0.01em' }}>progress</div>
        </div>
        <div style={{ ...cardStyle, padding: isMobile ? '0.75rem' : '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
            <svg style={{ width: '0.875rem', height: '0.875rem', color: colors.text, opacity: 0.15 }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <div style={{ fontSize: '2rem', fontWeight: '500', color: colors.accent }}>{daysRemaining}</div>
          </div>
          <div style={{ fontSize: '0.5625rem', color: colors.textMuted, textTransform: 'lowercase', opacity: 0.5, letterSpacing: '-0.01em' }}>days left</div>
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

      {/* Daily Inspiration - Subtle navy with gold quotation mark */}
      <div style={{
        ...cardStyle,
        background: theme === 'light'
          ? '#1F3A5A'
          : '#0F1C2E',
        borderColor: 'transparent',
        padding: isMobile ? '0.625rem 0.75rem' : '0.75rem 0.875rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.125rem',
            color: '#C9A75A',
            lineHeight: 1,
            marginTop: '-0.0625rem',
          }}>"</span>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '0.75rem',
              fontStyle: 'italic',
              color: '#F5F1EA',
              margin: 0,
              lineHeight: 1.5,
              opacity: 0.9,
            }}>
              {dailyQuote.text}
            </p>
            <p style={{
              fontSize: '0.5rem',
              color: 'rgba(201, 167, 90, 0.6)',
              margin: '0.1875rem 0 0 0.25rem',
              fontWeight: 300,
              letterSpacing: '0.02em',
            }}>
              — {dailyQuote.author}
            </p>
          </div>
          <button
            onClick={refreshQuote}
            style={{
              padding: '0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(245, 241, 234, 0.3)',
              borderRadius: '0.25rem',
              transition: 'color 0.15s ease',
            }}
            title="New quote"
          >
            <svg style={{ width: '0.625rem', height: '0.625rem' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
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

      {/* Year Progress - subtle gradient bar */}
      <div style={{
        ...cardStyle,
        background: colors.cardBg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h3 style={{ fontWeight: 500, margin: 0, color: colors.text, fontSize: '0.875rem' }}>Year progress</h3>
          <span style={{ fontSize: '0.6875rem', color: colors.textMuted, opacity: 0.7 }}>{yearProgress}% of 2026</span>
        </div>
        <div style={{
          width: '100%',
          backgroundColor: theme === 'light' ? 'rgba(31, 58, 90, 0.12)' : 'rgba(255, 255, 255, 0.12)',
          borderRadius: '9999px',
          height: '0.375rem',
          overflow: 'hidden'
        }}>
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #C9A75A 0%, #9E843F 100%)',
              borderRadius: '9999px',
              transition: 'width 0.3s ease',
              width: `${yearProgress}%`
            }}
          />
        </div>
        <p style={{ fontSize: '0.6875rem', marginTop: '0.375rem', color: colors.textMuted, marginBottom: 0, opacity: 0.7 }}>
          {daysRemaining > 0
            ? `${daysRemaining} days remaining`
            : 'The year has ended'}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {categoryStats.map(cat => (
                <div key={cat.value}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: colors.text,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}>
                      <span style={{ opacity: 0.5 }}><CategoryIcon category={cat.value} size={11} /></span>
                      {cat.label}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: colors.textMuted, fontWeight: 400, opacity: 0.7 }}>
                      {cat.count} · {cat.avgProgress}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    backgroundColor: theme === 'light' ? 'rgba(31, 58, 90, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '9999px',
                    height: '0.3125rem',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '9999px',
                        transition: 'width 0.3s ease',
                        width: `${cat.avgProgress}%`,
                        backgroundColor: cat.avgProgress === 100 ? '#4C8B6F' : '#C9A75A'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress Distribution - Horizontal segmented bar */}
      <div style={cardStyle}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.625rem',
        }}>
          <h3 style={{ fontWeight: 500, color: colors.text, margin: 0, fontSize: '0.875rem' }}>Distribution</h3>
          <span style={{ fontSize: '0.6875rem', color: colors.textMuted, opacity: 0.85 }}>
            {totalCount} resolution{totalCount !== 1 ? 's' : ''}
          </span>
        </div>
        {(() => {
          const buckets = [
            { label: '0-25', min: 0, max: 25 },
            { label: '26-50', min: 26, max: 50 },
            { label: '51-75', min: 51, max: 75 },
            { label: '76-99', min: 76, max: 99 },
            { label: '100', min: 100, max: 100 },
          ].map(b => ({
            ...b,
            count: resolutions.filter(r => r.progress >= b.min && r.progress <= b.max).length,
          }));

          return (
            <>
              {/* Segmented bar */}
              <div style={{
                display: 'flex',
                height: '0.5rem',
                borderRadius: '9999px',
                overflow: 'hidden',
                backgroundColor: theme === 'light' ? 'rgba(31, 58, 90, 0.08)' : 'rgba(255, 255, 255, 0.08)',
              }}>
                {buckets.map((bucket, i) => {
                  const width = totalCount > 0 ? (bucket.count / totalCount) * 100 : 0;
                  if (width === 0) return null;
                  const isComplete = bucket.min === 100;
                  return (
                    <div
                      key={bucket.label}
                      style={{
                        width: `${width}%`,
                        backgroundColor: isComplete ? '#4C8B6F' : '#C9A75A',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  );
                })}
              </div>
              {/* Labels below - more subtle */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.375rem',
              }}>
                {buckets.map(bucket => (
                  <div key={bucket.label} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      fontSize: '0.625rem',
                      fontWeight: 500,
                      color: bucket.count > 0 ? colors.accent : colors.textMuted,
                      opacity: bucket.count > 0 ? 0.9 : 0.4,
                    }}>
                      {bucket.count}
                    </div>
                    <div style={{
                      fontSize: '0.5rem',
                      color: colors.textMuted,
                      opacity: 0.5,
                    }}>
                      {bucket.label}%
                    </div>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
