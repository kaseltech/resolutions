'use client';

import { useState } from 'react';
import { Resolution } from '@/types';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';

interface MilestoneListProps {
  resolution: Resolution;
}

export function MilestoneList({ resolution }: MilestoneListProps) {
  const [newMilestone, setNewMilestone] = useState('');
  const { addMilestone, toggleMilestone, deleteMilestone } = useResolutions();
  const { colors } = useTheme();

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMilestone.trim()) {
      addMilestone(resolution.id, { title: newMilestone.trim() });
      setNewMilestone('');
    }
  };

  return (
    <div>
      <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text, marginBottom: '0.5rem', marginTop: 0 }}>
        Milestones
      </h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {resolution.milestones.map((milestone) => (
          <li
            key={milestone.id}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <button
              onClick={() => toggleMilestone(resolution.id, milestone.id)}
              style={{
                width: '1.25rem',
                height: '1.25rem',
                borderRadius: '0.25rem',
                border: `2px solid ${milestone.completed ? colors.accent : colors.border}`,
                backgroundColor: milestone.completed ? colors.accent : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {milestone.completed && (
                <svg style={{ width: '0.75rem', height: '0.75rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span
              style={{
                flex: 1,
                fontSize: '0.875rem',
                color: milestone.completed ? colors.textMuted : colors.text,
                textDecoration: milestone.completed ? 'line-through' : 'none',
              }}
            >
              {milestone.title}
            </span>
            {milestone.dueDate && (
              <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>
                {new Date(milestone.dueDate).toLocaleDateString()}
              </span>
            )}
            <button
              onClick={() => deleteMilestone(resolution.id, milestone.id)}
              style={{
                padding: '0.25rem',
                color: colors.textMuted,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                opacity: 0.5,
              }}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddMilestone} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={newMilestone}
          onChange={(e) => setNewMilestone(e.target.value)}
          placeholder="Add a milestone..."
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: '0.5rem',
            color: colors.text,
          }}
        />
        <button
          type="submit"
          disabled={!newMilestone.trim()}
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            backgroundColor: colors.accent,
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: newMilestone.trim() ? 'pointer' : 'not-allowed',
            opacity: newMilestone.trim() ? 1 : 0.5,
          }}
        >
          Add
        </button>
      </form>
    </div>
  );
}
