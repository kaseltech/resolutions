'use client';

import { useState, useEffect, useMemo } from 'react';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';
import { Resolution } from '@/types';
import { getMotivationalQuote } from '@/lib/messages';

// Helper to get local date string (YYYY-MM-DD) in user's timezone
function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to get check-ins for a period
function getCheckInsForPeriod(resolution: Resolution): number {
  if (!resolution.checkIns || !resolution.frequencyPeriod) return 0;
  const now = new Date();
  const today = getLocalDateString(now);

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


interface DashboardStatsProps {
  onEditResolution?: (resolution: Resolution) => void;
}

export function DashboardStats({ onEditResolution }: DashboardStatsProps) {
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

  // Get frequency resolutions with their current period progress
  const frequencyProgress = useMemo(() => {
    return resolutions
      .filter(r => r.trackingType === 'frequency' && r.targetFrequency && r.frequencyPeriod)
      .map(r => {
        const count = getCheckInsForPeriod(r);
        const target = r.targetFrequency || 0;
        return { resolution: r, count, target, period: r.frequencyPeriod };
      });
  }, [resolutions]);

  // Only show "falling behind" for frequency goals significantly behind (missed 2+ expected)
  const fallingBehind = useMemo(() => {
    const now = new Date();
    return frequencyProgress.filter(({ resolution, count, target }) => {
      const period = resolution.frequencyPeriod || 'week';
      if (period === 'week') {
        const dayOfWeek = now.getDay();
        const expectedByNow = Math.floor((target / 7) * (dayOfWeek + 1));
        return count < expectedByNow - 1 && dayOfWeek >= 4; // 2+ behind, after Thursday
      } else if (period === 'month') {
        const dayOfMonth = now.getDate();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const expectedByNow = Math.floor((target / daysInMonth) * dayOfMonth);
        return count < expectedByNow * 0.5; // 50% behind pace
      }
      return false;
    });
  }, [frequencyProgress]);

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
          <span style={{ color: '#C9A75A', fontWeight: 600 }}>{daysRemaining}</span> days left in <span style={{ color: '#C9A75A' }}>2026</span>
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

      {/* Frequency Progress Summary - shows check-in status for habit goals */}
      {frequencyProgress.length > 0 && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: colors.textMuted }}>
              Habit Check-ins
            </span>
            {fallingBehind.length > 0 && (
              <span style={{
                fontSize: '0.6875rem',
                color: colors.textMuted,
                opacity: 0.7,
              }}>
                {fallingBehind.length} behind pace
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {frequencyProgress.slice(0, 4).map(({ resolution, count, target }) => {
              const progress = Math.min(100, (count / target) * 100);
              const isBehind = fallingBehind.some(f => f.resolution.id === resolution.id);

              return (
                <button
                  key={resolution.id}
                  onClick={() => onEditResolution?.(resolution)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.375rem',
                    padding: '0.625rem',
                    backgroundColor: colors.bg,
                    borderRadius: '0.5rem',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    cursor: onEditResolution ? 'pointer' : 'default',
                    transition: 'background-color 0.15s ease',
                  }}
                  className="habit-row"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.8125rem',
                      color: isBehind ? colors.textMuted : colors.text,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      marginRight: '0.5rem',
                    }}>
                      {resolution.title}
                      {isBehind && (
                        <span style={{
                          marginLeft: '0.375rem',
                          fontSize: '0.625rem',
                          color: theme === 'light' ? '#C4A0A0' : '#f87171',
                          fontWeight: 500,
                        }}>
                          behind
                        </span>
                      )}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: count >= target ? colors.accent : colors.textMuted,
                    }}>
                      {count}/{target}
                    </span>
                  </div>
                  {/* Mini progress bar - 5px per design tokens */}
                  <div style={{
                    height: '5px',
                    backgroundColor: colors.borderSubtle,
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      backgroundColor: count >= target ? colors.progress : (isBehind ? colors.error : colors.progress),
                      borderRadius: '3px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </button>
              );
            })}
          </div>
          {frequencyProgress.length > 4 && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: colors.accent,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {showDetails ? 'Show less' : `+${frequencyProgress.length - 4} more`}
            </button>
          )}
        </div>
      )}

      {/* Empty state - no frequency goals */}
      {frequencyProgress.length === 0 && (
        <div style={{
          ...cardStyle,
          textAlign: 'center',
          padding: '1.25rem',
        }}>
          <p style={{ fontSize: '0.875rem', color: colors.textMuted, margin: 0 }}>
            Add habit goals to track your daily/weekly progress here.
          </p>
        </div>
      )}
    </div>
  );
}
