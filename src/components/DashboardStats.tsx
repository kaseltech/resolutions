'use client';

import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';
import { CATEGORIES } from '@/types';
import { ProgressBar } from './ProgressBar';

export function DashboardStats() {
  const { resolutions, getOverallProgress, getCompletedCount } = useResolutions();
  const { theme, colors } = useTheme();
  const overallProgress = getOverallProgress();
  const completedCount = getCompletedCount();
  const totalCount = resolutions.length;

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

  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.cardBg,
    borderRadius: '0.75rem',
    padding: '1.25rem',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
          }
        }
      `}</style>

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

      {/* Category Breakdown */}
      {categoryStats.length > 0 && (
        <div style={cardStyle}>
          <h3 style={{ fontWeight: 500, color: colors.text, marginBottom: '1rem', marginTop: 0 }}>Progress by Category</h3>
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
                      gap: '0.375rem',
                    }}
                  >
                    <span style={{ fontSize: '0.875rem' }}>{cat.icon}</span>
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
        </div>
      )}

      {/* Progress Distribution Chart */}
      <div style={cardStyle}>
        <h3 style={{ fontWeight: 500, color: colors.text, marginBottom: '1rem', marginTop: 0 }}>Progress Distribution</h3>
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
      </div>
    </div>
  );
}
