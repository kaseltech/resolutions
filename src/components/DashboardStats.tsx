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

  const [isMobile, setIsMobile] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
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
  const currentWeek = Math.ceil((today.getTime() - new Date(2026, 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7));

  // Daily inspiration quote
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '500', color: colors.text, marginBottom: '0.5rem' }}>What matters to you this year?</h2>
        <p style={{ color: colors.textMuted, fontSize: '0.875rem', opacity: 0.85 }}>
          Start with one or two intentions. You can always add more.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Time awareness - simple, neutral */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        backgroundColor: colors.cardBg,
        borderRadius: '0.75rem',
        border: `1px solid ${colors.border}`,
      }}>
        <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>
          Week {currentWeek} of 52
        </span>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text }}>
          {daysRemaining} days left in 2026
        </span>
      </div>

      {/* Daily Inspiration - Quiet, optional */}
      <div style={{
        ...cardStyle,
        background: theme === 'light' ? '#1F3A5A' : '#0F1C2E',
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

      {/* Insights - Collapsible, opt-in */}
      <div style={cardStyle}>
        <button
          onClick={() => setShowInsights(!showInsights)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: colors.textMuted,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <svg style={{ width: '0.875rem', height: '0.875rem', opacity: 0.6 }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            Insights
          </span>
          <svg
            style={{
              width: '1rem',
              height: '1rem',
              color: colors.textMuted,
              opacity: 0.5,
              transform: showInsights ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showInsights && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Summary stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              textAlign: 'center',
            }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 500, color: colors.accent }}>{totalCount}</div>
                <div style={{ fontSize: '0.625rem', color: colors.textMuted, opacity: 0.6 }}>resolutions</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 500, color: colors.accent }}>{completedCount}</div>
                <div style={{ fontSize: '0.625rem', color: colors.textMuted, opacity: 0.6 }}>completed</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 500, color: colors.accent }}>{overallProgress}%</div>
                <div style={{ fontSize: '0.625rem', color: colors.textMuted, opacity: 0.6 }}>overall</div>
              </div>
            </div>

            {/* Overall Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <span style={{ fontSize: '0.75rem', color: colors.text }}>Overall Progress</span>
                <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>{overallProgress}%</span>
              </div>
              <ProgressBar progress={overallProgress} size="sm" showLabel={false} />
            </div>

            {/* Achievements */}
            <AchievementProgress />

            {/* Category Breakdown */}
            {categoryStats.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.75rem', color: colors.text, margin: '0 0 0.75rem 0' }}>By Category</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {categoryStats.map(cat => (
                    <div key={cat.value}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{
                          fontSize: '0.6875rem',
                          color: colors.text,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}>
                          <span style={{ opacity: 0.5 }}><CategoryIcon category={cat.value} size={10} /></span>
                          {cat.label}
                        </span>
                        <span style={{ fontSize: '0.625rem', color: colors.textMuted, opacity: 0.6 }}>
                          {cat.avgProgress}%
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        backgroundColor: theme === 'light' ? 'rgba(31, 58, 90, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '9999px',
                        height: '0.25rem',
                        overflow: 'hidden'
                      }}>
                        <div
                          style={{
                            height: '100%',
                            borderRadius: '9999px',
                            width: `${cat.avgProgress}%`,
                            backgroundColor: cat.avgProgress === 100 ? '#4C8B6F' : '#C9A75A'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
