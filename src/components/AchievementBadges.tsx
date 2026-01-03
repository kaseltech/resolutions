'use client';

import { useState } from 'react';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';
import { calculateAchievements, getUnlockedCount, getTotalAchievements, Achievement } from '@/lib/achievements';

export function AchievementBadges() {
  const { resolutions } = useResolutions();
  const { theme, colors } = useTheme();
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
  const { theme, colors } = useTheme();
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
          ? (theme === 'light' ? `${colors.accent}10` : `${colors.accent}20`)
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
          backgroundColor: theme === 'light' ? '#1e293b' : '#f1f5f9',
          color: theme === 'light' ? '#f1f5f9' : '#1e293b',
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
            borderTop: `6px solid ${theme === 'light' ? '#1e293b' : '#f1f5f9'}`,
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

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    }}>
      <span style={{ fontSize: '1.25rem' }}>🏅</span>
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          marginBottom: '0.25rem',
        }}>
          <span style={{ color: colors.text, fontWeight: 500 }}>Achievements</span>
          <span style={{ color: colors.textMuted }}>{unlockedCount}/{totalCount}</span>
        </div>
        <div style={{
          height: '6px',
          backgroundColor: colors.bg,
          borderRadius: '3px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: colors.accent,
            borderRadius: '3px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>
    </div>
  );
}
