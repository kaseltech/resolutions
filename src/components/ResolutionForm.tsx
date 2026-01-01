'use client';

import { useState, useEffect } from 'react';
import { Resolution, Category, CATEGORIES } from '@/types';
import { useResolutions } from '@/context/ResolutionContext';

const colors = {
  bg: '#0f172a',
  cardBg: '#1e293b',
  border: '#475569',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  accent: '#4a6fa5',
};

interface ResolutionFormProps {
  resolution?: Resolution | null;
  onClose: () => void;
}

export function ResolutionForm({ resolution, onClose }: ResolutionFormProps) {
  const { addResolution, updateResolution } = useResolutions();
  const isEditing = !!resolution;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal' as Category,
    deadline: '',
    notes: '',
    reminderEnabled: false,
    reminderFrequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    reminderTime: '09:00',
  });

  useEffect(() => {
    if (resolution) {
      setFormData({
        title: resolution.title,
        description: resolution.description,
        category: resolution.category,
        deadline: resolution.deadline ? resolution.deadline.split('T')[0] : '',
        notes: resolution.notes,
        reminderEnabled: resolution.reminder?.enabled ?? false,
        reminderFrequency: resolution.reminder?.frequency ?? 'weekly',
        reminderTime: resolution.reminder?.time ?? '09:00',
      });
    }
  }, [resolution]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: Partial<Resolution> = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      deadline: formData.deadline || undefined,
      notes: formData.notes,
      reminder: formData.reminderEnabled
        ? {
            id: resolution?.reminder?.id || `reminder-${Date.now()}`,
            frequency: formData.reminderFrequency,
            time: formData.reminderTime,
            enabled: true,
          }
        : undefined,
    };

    if (isEditing && resolution) {
      updateResolution(resolution.id, data);
    } else {
      addResolution(data);
    }

    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 1rem',
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: '0.5rem',
    color: 'white',
    fontSize: '1rem',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.text,
    marginBottom: '0.25rem',
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 50,
    }}>
      <div style={{
        backgroundColor: colors.cardBg,
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '32rem',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ padding: '1.5rem', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', margin: 0 }}>
              {isEditing ? 'Edit Resolution' : 'New Resolution'}
            </h2>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem',
                color: colors.textMuted,
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What do you want to achieve?"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add more details about your resolution..."
              rows={3}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          <div>
            <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: formData.category === cat.value ? cat.color : '#334155',
                    color: formData.category === cat.value ? 'white' : colors.text,
                  }}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Target Date</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes, motivation, or strategies..."
              rows={3}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text }}>Reminder</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, reminderEnabled: !prev.reminderEnabled }))}
                style={{
                  width: '2.75rem',
                  height: '1.5rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: formData.reminderEnabled ? colors.accent : '#475569',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '0.125rem',
                    left: formData.reminderEnabled ? '1.375rem' : '0.125rem',
                    width: '1.25rem',
                    height: '1.25rem',
                    backgroundColor: 'white',
                    borderRadius: '9999px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    transition: 'left 0.2s',
                  }}
                />
              </button>
            </div>

            {formData.reminderEnabled && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Frequency</label>
                  <select
                    value={formData.reminderFrequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, reminderFrequency: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
                    style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: colors.textMuted, marginBottom: '0.25rem' }}>Time</label>
                  <input
                    type="time"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, reminderTime: e.target.value }))}
                    style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.875rem', colorScheme: 'dark' }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                border: `1px solid ${colors.border}`,
                color: colors.text,
                borderRadius: '0.5rem',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                backgroundColor: colors.accent,
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {isEditing ? 'Save Changes' : 'Create Resolution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
