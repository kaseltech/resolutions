'use client';

import { useResolutions } from '@/context/ResolutionContext';
import { CATEGORIES } from '@/types';
import { ProgressBar } from './ProgressBar';

const colors = {
  bg: '#0f172a',
  cardBg: '#1e293b',
  border: '#334155',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
};

export function DashboardStats() {
  const { data, getOverallProgress, getCompletedCount } = useResolutions();
  const overallProgress = getOverallProgress();
  const completedCount = getCompletedCount();
  const totalCount = data.resolutions.length;

  const categoryStats = CATEGORIES.map(cat => ({
    ...cat,
    count: data.resolutions.filter(r => r.category === cat.value).length,
    avgProgress: Math.round(
      data.resolutions
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
  };

  if (totalCount === 0) {
    return (
      <div style={{
        background: `linear-gradient(135deg, ${colors.cardBg}, ${colors.bg})`,
        borderRadius: '1rem',
        padding: '2rem',
        textAlign: 'center',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Start Your 2026 Journey</h2>
        <p style={{ color: colors.textMuted }}>
          Create your first resolution and begin tracking your progress toward your goals!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Main Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#7a9ec4' }}>{totalCount}</div>
          <div style={{ fontSize: '0.875rem', color: colors.textMuted }}>Total Resolutions</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#6ba57a' }}>{completedCount}</div>
          <div style={{ fontSize: '0.875rem', color: colors.textMuted }}>Completed</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#9a7ab5' }}>{overallProgress}%</div>
          <div style={{ fontSize: '0.875rem', color: colors.textMuted }}>Overall Progress</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#b5845a' }}>{daysRemaining}</div>
          <div style={{ fontSize: '0.875rem', color: colors.textMuted }}>Days Remaining</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ fontWeight: 600, color: 'white', margin: 0 }}>Overall Progress</h3>
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
        background: 'linear-gradient(to right, #4a4a7a, #6a5a8a)',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        color: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ fontWeight: 600, margin: 0 }}>Year Progress</h3>
          <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>{yearProgress}% of 2026</span>
        </div>
        <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '9999px', height: '0.75rem', overflow: 'hidden' }}>
          <div
            style={{ height: '100%', backgroundColor: 'white', borderRadius: '9999px', transition: 'all 0.5s', width: `${yearProgress}%` }}
          />
        </div>
        <p style={{ fontSize: '0.875rem', marginTop: '0.75rem', opacity: 0.9, marginBottom: 0 }}>
          {daysRemaining > 0
            ? `${daysRemaining} days left to achieve your goals!`
            : 'The year has ended. How did you do?'}
        </p>
      </div>

      {/* Category Breakdown */}
      {categoryStats.length > 0 && (
        <div style={cardStyle}>
          <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '1rem', marginTop: 0 }}>Progress by Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categoryStats.map(cat => (
              <div key={cat.value}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text }}>
                    {cat.icon} {cat.label}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>
                    {cat.count} resolution{cat.count !== 1 ? 's' : ''} - {cat.avgProgress}% avg
                  </span>
                </div>
                <div style={{ width: '100%', backgroundColor: colors.border, borderRadius: '9999px', height: '0.5rem', overflow: 'hidden' }}>
                  <div
                    style={{ height: '100%', borderRadius: '9999px', transition: 'all 0.5s', width: `${cat.avgProgress}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Distribution Chart */}
      <div style={cardStyle}>
        <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '1rem', marginTop: 0 }}>Progress Distribution</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '8rem', gap: '0.5rem' }}>
          {[
            { label: '0-25%', min: 0, max: 25, color: '#a85454' },
            { label: '26-50%', min: 26, max: 50, color: '#a5724a' },
            { label: '51-75%', min: 51, max: 75, color: '#9a8a4a' },
            { label: '76-99%', min: 76, max: 99, color: '#3d7a6a' },
            { label: '100%', min: 100, max: 100, color: '#3d7a57' },
          ].map(bucket => {
            const count = data.resolutions.filter(
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
