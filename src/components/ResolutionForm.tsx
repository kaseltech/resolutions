'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Resolution, Category, CATEGORIES, TrackingType, TRACKING_TYPES } from '@/types';
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
    // New tracking fields
    trackingType: 'frequency' as TrackingType,
    targetFrequency: 3,
    frequencyPeriod: 'week' as 'day' | 'week' | 'month',
    targetValue: 0,
    currentValue: 0,
    startingValue: 0,
    unit: '',
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
        // New tracking fields
        trackingType: resolution.trackingType ?? 'frequency',
        targetFrequency: resolution.targetFrequency ?? 3,
        frequencyPeriod: resolution.frequencyPeriod ?? 'week',
        targetValue: resolution.targetValue ?? 0,
        currentValue: resolution.currentValue ?? 0,
        startingValue: resolution.startingValue ?? 0,
        unit: resolution.unit ?? '',
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
      // New tracking fields
      trackingType: formData.trackingType,
      targetFrequency: formData.trackingType === 'frequency' ? formData.targetFrequency : undefined,
      frequencyPeriod: formData.trackingType === 'frequency' ? formData.frequencyPeriod : undefined,
      targetValue: (formData.trackingType === 'cumulative' || formData.trackingType === 'target') ? formData.targetValue : undefined,
      unit: (formData.trackingType === 'cumulative' || formData.trackingType === 'target') ? formData.unit : undefined,
      currentValue: (formData.trackingType === 'cumulative' || formData.trackingType === 'target') ? formData.currentValue : undefined,
      startingValue: formData.trackingType === 'target' ? formData.startingValue : undefined,
      checkIns: formData.trackingType === 'frequency' ? (resolution?.checkIns ?? []) : undefined,
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

          {/* Tracking Type Selection */}
          <div>
            <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>How do you want to track this?</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {TRACKING_TYPES.map((type) => {
                const isSelected = formData.trackingType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, trackingType: type.value }))}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${isSelected ? colors.accent : colors.border}`,
                      backgroundColor: isSelected
                        ? (theme === 'light' ? 'rgba(31, 58, 90, 0.06)' : 'rgba(255, 255, 255, 0.08)')
                        : colors.cardBg,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{type.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.text }}>{type.label}</div>
                        <div style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.125rem' }}>{type.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frequency-specific fields */}
          {formData.trackingType === 'frequency' && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: theme === 'light' ? 'rgba(31, 58, 90, 0.03)' : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '0.5rem',
              border: `1px solid ${colors.border}`,
            }}>
              <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Target frequency</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.targetFrequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetFrequency: parseInt(e.target.value) || 1 }))}
                  style={{ ...inputStyle, width: '4rem', textAlign: 'center' }}
                />
                <span style={{ color: colors.textMuted, fontSize: '0.875rem' }}>times per</span>
                <select
                  value={formData.frequencyPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequencyPeriod: e.target.value as 'day' | 'week' | 'month' }))}
                  style={{ ...inputStyle, width: 'auto' }}
                >
                  <option value="day">day</option>
                  <option value="week">week</option>
                  <option value="month">month</option>
                </select>
              </div>
            </div>
          )}

          {/* Cumulative-specific fields */}
          {formData.trackingType === 'cumulative' && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: theme === 'light' ? 'rgba(31, 58, 90, 0.03)' : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '0.5rem',
              border: `1px solid ${colors.border}`,
            }}>
              <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>What's your target?</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="$"
                  style={{ ...inputStyle, width: '3.5rem', textAlign: 'center' }}
                />
                <input
                  type="number"
                  min="1"
                  value={formData.targetValue || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 0 }))}
                  placeholder="5000"
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.5rem', marginBottom: 0 }}>
                e.g., $ 5000 for saving money, or leave unit blank for "20 books"
              </p>

              {/* Current progress - only show when editing */}
              {isEditing && (
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: `1px solid ${colors.border}` }}>
                  <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Current progress</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: colors.textMuted, minWidth: '2rem' }}>
                      {formData.unit || ''}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={formData.currentValue || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentValue: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <span style={{ fontSize: '0.875rem', color: colors.textMuted }}>
                      of {formData.unit}{formData.targetValue?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Target-specific fields (e.g., reach 220lbs) */}
          {formData.trackingType === 'target' && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: theme === 'light' ? 'rgba(31, 58, 90, 0.03)' : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '0.5rem',
              border: `1px solid ${colors.border}`,
            }}>
              <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>What's your target?</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="number"
                  value={formData.targetValue || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetValue: parseFloat(e.target.value) || 0 }))}
                  placeholder="220"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="lbs"
                  style={{ ...inputStyle, width: '4rem', textAlign: 'center' }}
                />
              </div>

              <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Where did you start?</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="number"
                  value={formData.startingValue || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({
                      ...prev,
                      startingValue: val,
                      // Also set currentValue to starting if not editing
                      currentValue: isEditing ? prev.currentValue : val,
                    }));
                  }}
                  placeholder="250"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <span style={{ fontSize: '0.875rem', color: colors.textMuted, width: '4rem', textAlign: 'center' }}>
                  {formData.unit || 'units'}
                </span>
              </div>

              {/* Current value - only show when editing */}
              {isEditing && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${colors.border}` }}>
                  <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Current value</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      value={formData.currentValue || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentValue: parseFloat(e.target.value) || 0 }))}
                      placeholder="235"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <span style={{ fontSize: '0.875rem', color: colors.textMuted, width: '4rem', textAlign: 'center' }}>
                      {formData.unit || 'units'}
                    </span>
                  </div>
                </div>
              )}

              <p style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.75rem', marginBottom: 0 }}>
                Progress is calculated based on how far you've moved from your starting point toward your target.
              </p>
            </div>
          )}

          {/* Reflection-only info */}
          {formData.trackingType === 'reflection' && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: theme === 'light' ? 'rgba(31, 58, 90, 0.03)' : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '0.5rem',
              border: `1px solid ${colors.border}`,
            }}>
              <p style={{ fontSize: '0.875rem', color: colors.textMuted, margin: 0 }}>
                No numbers to track. You'll journal your thoughts and reflections as you go.
              </p>
            </div>
          )}

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
