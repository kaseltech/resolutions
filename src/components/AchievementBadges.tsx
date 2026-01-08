'use client';

import { useState } from 'react';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';
import { calculateAchievements, getUnlockedCount, getTotalAchievements, Achievement } from '@/lib/achievements';

export function AchievementBadges() {
  const { resolutions } = useResolutions();
  const { colors } = useTheme();
  const [showAll, setShowAll] = useState(false);

  const achievements = calculateAchievements(resolutions);
  const unlockedCount = getUnlockedCount(resolutions);
  const totalCount = getTotalAchievements();

  const displayedAchievements = showAll
    ? achievements
    : achievements.filter(a => a.unlocked).slice(0, 6);

  return (
    <div style={{
      backgroundColor: colors.cardBg,
      borderRadius: '0.75rem',
      padding: '1rem',
      border: `1px solid ${colors.border}`,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
      }}>
        <h3 style={{
          fontSize: '0.9375rem',
          fontWeight: 600,
          color: colors.text,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          Achievements
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: colors.textMuted,
            backgroundColor: colors.bg,
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
          }}>
            {unlockedCount}/{totalCount}
          </span>
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            fontSize: '0.75rem',
            color: colors.accent,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {showAll ? 'Show less' : 'View all'}
        </button>
      </div>

      {unlockedCount === 0 ? (
        <p style={{
          fontSize: '0.875rem',
          color: colors.textMuted,
          margin: 0,
          textAlign: 'center',
          padding: '1rem 0',
        }}>
          Start working on your resolutions to unlock achievements!
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: '0.5rem',
        }}>
          {displayedAchievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      )}
    </div>
  );
}

function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const { colors } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.75rem 0.5rem',
        borderRadius: '0.5rem',
        backgroundColor: achievement.unlocked
          ? `${colors.accent}20`
          : colors.bg,
        opacity: achievement.unlocked ? 1 : 0.5,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <span style={{
        fontSize: '1.5rem',
        filter: achievement.unlocked ? 'none' : 'grayscale(100%)',
      }}>
        {achievement.icon}
      </span>
      <span style={{
        fontSize: '0.625rem',
        fontWeight: 500,
        color: achievement.unlocked ? colors.text : colors.textMuted,
        textAlign: 'center',
        marginTop: '0.25rem',
        lineHeight: 1.2,
      }}>
        {achievement.name}
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '0.5rem',
          padding: '0.5rem 0.75rem',
          backgroundColor: '#f1f5f9',
          color: '#1e293b',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          whiteSpace: 'nowrap',
          zIndex: 50,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {achievement.description}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid #f1f5f9`,
          }} />
        </div>
      )}
    </div>
  );
}

// Compact version for dashboard
export function AchievementProgress() {
  const { resolutions } = useResolutions();
  const { colors } = useTheme();

  const unlockedCount = getUnlockedCount(resolutions);
  const totalCount = getTotalAchievements();
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  // More saturated gold for achievements
  const rewardGold = '#D9A635';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    }}>
      <svg style={{ width: '1.25rem', height: '1.25rem', color: colors.text, opacity: 0.25 }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          marginBottom: '0.25rem',
        }}>
          <span style={{ color: colors.text, fontWeight: 500 }}>Achievements</span>
          <span style={{ color: colors.accent, fontWeight: 500 }}>{unlockedCount}/{totalCount}</span>
        </div>
        <div style={{
          height: '0.375rem',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: rewardGold,
            borderRadius: '9999px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>
    </div>
  );
}
