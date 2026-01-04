'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Resolution, Category, CATEGORIES } from '@/types';
import { useResolutions } from '@/context/ResolutionContext';
import { useTheme } from '@/context/ThemeContext';
import { CategoryIcon } from './CategoryIcon';
import { Toggle } from './Toggle';

// Check if mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

interface ResolutionFormProps {
  resolution?: Resolution | null;
  onClose: () => void;
}

export function ResolutionForm({ resolution, onClose }: ResolutionFormProps) {
  const { addResolution, updateResolution } = useResolutions();
  const { theme, colors } = useTheme();
  const isMobile = useIsMobile();
  const isEditing = !!resolution;
  const formRef = useRef<HTMLFormElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.title.trim()) return;

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
  }, [formData, isEditing, resolution, addResolution, updateResolution, onClose]);

  // Keyboard shortcut: Ctrl+Enter to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: colors.inputBg,
    border: `1px solid ${colors.border}`,
    borderRadius: '0.5rem',
    color: colors.text,
    fontSize: '1rem',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.text,
    marginBottom: '0.375rem',
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'flex-start',
        justifyContent: 'center',
        zIndex: 50,
        overflowY: 'auto',
        padding: isMobile ? 0 : '1rem',
        paddingTop: isMobile ? 0 : '5vh',
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: colors.cardBg,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: isMobile ? '100%' : '28rem',
          border: `1px solid ${colors.border}`,
          borderRadius: isMobile ? '1.5rem 1.5rem 0 0' : '1rem',
          maxHeight: isMobile ? '90vh' : 'none',
          overflowY: 'auto',
          marginBottom: isMobile ? 0 : '2rem',
          paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : 0,
        }}
      >
        {/* Handle bar for mobile */}
        {isMobile && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '0.75rem',
          }}>
            <div style={{
              width: '40px',
              height: '4px',
              backgroundColor: colors.border,
              borderRadius: '2px',
            }} />
          </div>
        )}
        <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: colors.text, margin: 0 }}>
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Close (Esc)"
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              type="text"
              required
              autoFocus
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
              placeholder="Add more details..."
              rows={2}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          <div>
            <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {CATEGORIES.map((cat) => {
                const isSelected = formData.category === cat.value;
                const catColor = theme === 'light' ? cat.color : cat.darkColor;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    style={{
                      padding: '0.5rem 0.625rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      border: `1px solid ${isSelected ? colors.border : colors.border}`,
                      borderLeft: isSelected ? `3px solid ${catColor}73` : `1px solid ${colors.border}`,
                      cursor: 'pointer',
                      backgroundColor: isSelected
                        ? (theme === 'light' ? 'rgba(31, 58, 90, 0.06)' : 'rgba(255, 255, 255, 0.08)')
                        : colors.cardBg,
                      color: theme === 'light' ? 'rgba(31, 58, 90, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ opacity: 0.6 }}>
                      <CategoryIcon category={cat.value} size={14} />
                    </span>
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Target Date</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              style={{ ...inputStyle, colorScheme: theme }}
            />
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Motivation, strategies, etc..."
              rows={2}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text, display: 'block' }}>Reminder</span>
                <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>Get notified to check in</span>
              </div>
              <Toggle
                enabled={formData.reminderEnabled}
                onChange={(enabled) => setFormData(prev => ({ ...prev, reminderEnabled: enabled }))}
                size="md"
              />
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
                    style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.875rem', colorScheme: theme }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: `1px solid ${colors.border}`,
                color: colors.text,
                borderRadius: '0.5rem',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: colors.accent,
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
              title="Save (Ctrl+Enter)"
            >
              {isEditing ? 'Save' : 'Create'}
            </button>
          </div>

          <p style={{
            fontSize: '0.6875rem',
            color: colors.textMuted,
            textAlign: 'center',
            margin: 0,
            opacity: 0.7,
          }}>
            Press <kbd style={{
              padding: '0.125rem 0.25rem',
              backgroundColor: colors.bg,
              borderRadius: '0.25rem',
              border: `1px solid ${colors.border}`,
              fontFamily: 'inherit',
              fontSize: '0.625rem',
            }}>Ctrl</kbd>+<kbd style={{
              padding: '0.125rem 0.25rem',
              backgroundColor: colors.bg,
              borderRadius: '0.25rem',
              border: `1px solid ${colors.border}`,
              fontFamily: 'inherit',
              fontSize: '0.625rem',
            }}>Enter</kbd> to save
          </p>
        </form>
      </div>

    </div>
  );
}
