'use client';

import { useState, useEffect, useMemo } from 'react';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';
import { Resolution } from '@/types';
import { getMotivationalQuote } from '@/lib/messages';

// Helper to get check-ins for a period
function getCheckInsForPeriod(resolution: Resolution): number {
  if (!resolution.checkIns || !resolution.frequencyPeriod) return 0;
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  return resolution.checkIns.filter(c => {
    const checkInDate = new Date(c.date);
    if (resolution.frequencyPeriod === 'day') {
      return c.date === today;
    } else if (resolution.frequencyPeriod === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return checkInDate >= startOfWeek && checkInDate <= now;
    } else if (resolution.frequencyPeriod === 'month') {
      return checkInDate.getMonth() === now.getMonth() && checkInDate.getFullYear() === now.getFullYear();
    }
    return false;
  }).length;
}

// Helper to check if resolution needs attention
function needsAttention(resolution: Resolution): { needs: boolean; reason: string } {
  const now = new Date();
  const lastUpdated = new Date(resolution.updatedAt);
  const daysSinceUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

  // Stale check - not updated in 14+ days
  if (daysSinceUpdate >= 14) {
    return { needs: true, reason: `No activity in ${daysSinceUpdate} days` };
  }

  if (resolution.trackingType === 'frequency') {
    const count = getCheckInsForPeriod(resolution);
    const target = resolution.targetFrequency || 0;
    const period = resolution.frequencyPeriod || 'week';

    // Check if behind pace for the period
    if (period === 'week') {
      const dayOfWeek = now.getDay(); // 0 = Sunday
      const expectedByNow = Math.floor((target / 7) * (dayOfWeek + 1));
      if (count < expectedByNow && dayOfWeek >= 3) { // Only flag after Wednesday
        return { needs: true, reason: `${count} of ${target} this week` };
      }
    } else if (period === 'month') {
      const dayOfMonth = now.getDate();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const expectedByNow = Math.floor((target / daysInMonth) * dayOfMonth);
      if (count < expectedByNow * 0.7) { // 30% behind pace
        return { needs: true, reason: `${count} of ${target} this month` };
      }
    }
  }

  if (resolution.trackingType === 'cumulative') {
    const current = resolution.currentValue || 0;
    const target = resolution.targetValue || 0;
    if (target > 0) {
      // Check if on pace for end of year
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31);
      const totalDays = (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
      const daysPassed = (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
      const expectedProgress = (daysPassed / totalDays) * target;

      if (current < expectedProgress * 0.7) { // 30% behind pace
        const percentComplete = Math.round((current / target) * 100);
        return { needs: true, reason: `${percentComplete}% - behind pace` };
      }
    }
  }

  if (resolution.trackingType === 'target') {
    // Check if no movement in 7+ days
    if (daysSinceUpdate >= 7) {
      return { needs: true, reason: 'No progress this week' };
    }
  }

  return { needs: false, reason: '' };
}

// Helper to check if resolution is doing well
function isDoingGreat(resolution: Resolution): { great: boolean; reason: string } {
  if (resolution.trackingType === 'frequency') {
    const count = getCheckInsForPeriod(resolution);
    const target = resolution.targetFrequency || 0;
    if (count >= target) {
      return { great: true, reason: `${count}/${target} - goal met!` };
    }
  }

  if (resolution.trackingType === 'cumulative') {
    const current = resolution.currentValue || 0;
    const target = resolution.targetValue || 0;
    if (target > 0 && current >= target) {
      return { great: true, reason: 'Goal reached!' };
    }
    // On pace or ahead
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    const totalDays = (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
    const expectedProgress = (daysPassed / totalDays) * target;

    if (current >= expectedProgress) {
      return { great: true, reason: 'On pace' };
    }
  }

  if (resolution.trackingType === 'target') {
    const current = resolution.currentValue;
    const start = resolution.startingValue;
    const target = resolution.targetValue;

    if (current !== undefined && start !== undefined && target !== undefined) {
      const isGoingDown = target < start;
      const isComplete = isGoingDown ? (current <= target) : (current >= target);
      if (isComplete) {
        return { great: true, reason: 'Goal reached!' };
      }

      // Check if trending right direction
      const totalDistance = Math.abs(target - start);
      const currentDistance = Math.abs(current - start);
      const progress = totalDistance > 0 ? (currentDistance / totalDistance) * 100 : 0;

      if (progress >= 50) {
        return { great: true, reason: `${Math.round(progress)}% there` };
      }
    }
  }

  // Legacy percentage
  if (!resolution.trackingType && resolution.progress >= 75) {
    return { great: true, reason: `${resolution.progress}%` };
  }

  return { great: false, reason: '' };
}

export function DashboardStats() {
  const { resolutions } = useResolutions();
  const { theme, colors } = useTheme();
  const totalCount = resolutions.length;

  const [isMobile, setIsMobile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate insights
  const insights = useMemo(() => {
    const needsAttentionList: { resolution: Resolution; reason: string }[] = [];
    const doingGreatList: { resolution: Resolution; reason: string }[] = [];

    resolutions.forEach(r => {
      const attention = needsAttention(r);
      if (attention.needs) {
        needsAttentionList.push({ resolution: r, reason: attention.reason });
      }

      const great = isDoingGreat(r);
      if (great.great) {
        doingGreatList.push({ resolution: r, reason: great.reason });
      }
    });

    return { needsAttention: needsAttentionList, doingGreat: doingGreatList };
  }, [resolutions]);

  // Time info
  const endOfYear = new Date(2026, 11, 31);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endOfYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const currentWeek = Math.ceil((today.getTime() - new Date(2026, 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7));

  // Daily quote
  const [quoteKey, setQuoteKey] = useState(0);
  const dailyQuote = useMemo(() => getMotivationalQuote(50), [quoteKey]);
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

  const hasNeedsAttention = insights.needsAttention.length > 0;
  const hasDoingGreat = insights.doingGreat.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Time awareness */}
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

      {/* Daily Inspiration */}
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

      {/* Insights Summary Cards */}
      {(hasNeedsAttention || hasDoingGreat) && (
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {/* Needs Attention */}
          {hasNeedsAttention && (
            <div style={{
              flex: 1,
              padding: '0.875rem',
              backgroundColor: theme === 'light' ? '#FEF3C7' : '#78350F',
              borderRadius: '0.75rem',
              border: `1px solid ${theme === 'light' ? '#FCD34D' : '#92400E'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1rem' }}>⚠️</span>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: theme === 'light' ? '#92400E' : '#FCD34D'
                }}>
                  {insights.needsAttention.length}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: theme === 'light' ? '#A16207' : '#FBBF24'
                }}>
                  need attention
                </span>
              </div>
            </div>
          )}

          {/* Doing Great */}
          {hasDoingGreat && (
            <div style={{
              flex: 1,
              padding: '0.875rem',
              backgroundColor: theme === 'light' ? '#D1FAE5' : '#064E3B',
              borderRadius: '0.75rem',
              border: `1px solid ${theme === 'light' ? '#6EE7B7' : '#047857'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1rem' }}>🎯</span>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: theme === 'light' ? '#047857' : '#6EE7B7'
                }}>
                  {insights.doingGreat.length}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: theme === 'light' ? '#059669' : '#34D399'
                }}>
                  on track
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detailed Insights - Collapsible */}
      {(hasNeedsAttention || hasDoingGreat) && (
        <div style={cardStyle}>
          <button
            onClick={() => setShowDetails(!showDetails)}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              Details
            </span>
            <svg
              style={{
                width: '1rem',
                height: '1rem',
                color: colors.textMuted,
                opacity: 0.5,
                transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDetails && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Needs Attention List */}
              {hasNeedsAttention && (
                <div>
                  <h4 style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: theme === 'light' ? '#92400E' : '#FCD34D',
                    margin: '0 0 0.5rem 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Needs Attention
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {insights.needsAttention.slice(0, 5).map(({ resolution, reason }) => (
                      <div
                        key={resolution.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.5rem 0.625rem',
                          backgroundColor: theme === 'light' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.05)',
                          borderRadius: '0.375rem',
                        }}
                      >
                        <span style={{
                          fontSize: '0.8125rem',
                          color: colors.text,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                          marginRight: '0.5rem',
                        }}>
                          {resolution.title}
                        </span>
                        <span style={{
                          fontSize: '0.6875rem',
                          color: theme === 'light' ? '#B45309' : '#FBBF24',
                          whiteSpace: 'nowrap',
                        }}>
                          {reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Doing Great List */}
              {hasDoingGreat && (
                <div>
                  <h4 style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: theme === 'light' ? '#047857' : '#6EE7B7',
                    margin: '0 0 0.5rem 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    On Track
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {insights.doingGreat.slice(0, 5).map(({ resolution, reason }) => (
                      <div
                        key={resolution.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.5rem 0.625rem',
                          backgroundColor: theme === 'light' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                          borderRadius: '0.375rem',
                        }}
                      >
                        <span style={{
                          fontSize: '0.8125rem',
                          color: colors.text,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                          marginRight: '0.5rem',
                        }}>
                          {resolution.title}
                        </span>
                        <span style={{
                          fontSize: '0.6875rem',
                          color: theme === 'light' ? '#059669' : '#34D399',
                          whiteSpace: 'nowrap',
                        }}>
                          {reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* All good message when nothing needs attention */}
      {!hasNeedsAttention && !hasDoingGreat && (
        <div style={{
          ...cardStyle,
          textAlign: 'center',
          padding: '1.5rem',
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}>✨</span>
          <p style={{ fontSize: '0.875rem', color: colors.textMuted, margin: 0 }}>
            Keep going! Check in on your goals to see insights here.
          </p>
        </div>
      )}
    </div>
  );
}
