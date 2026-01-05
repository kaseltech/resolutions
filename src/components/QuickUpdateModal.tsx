'use client';

import { useState, useEffect, useRef } from 'react';
import { Resolution } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface QuickUpdateModalProps {
  resolution: Resolution | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (resolutionId: string, newValue: number) => void;
}

export function QuickUpdateModal({ resolution, isOpen, onClose, onSave }: QuickUpdateModalProps) {
  const { colors, theme } = useTheme();
  const [value, setValue] = useState('');
  const [mode, setMode] = useState<'set' | 'add'>('set');
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen && resolution) {
      setValue('');
      setMode('set');
      // Focus input after a short delay to ensure modal is rendered
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, resolution]);

  if (!isOpen || !resolution) return null;

  const isCumulative = resolution.trackingType === 'cumulative';
  const isTarget = resolution.trackingType === 'target';

  if (!isCumulative && !isTarget) return null;

  const currentValue = resolution.currentValue ?? 0;
  const targetValue = resolution.targetValue ?? 0;
  const unit = resolution.unit || '';
  const startingValue = resolution.startingValue ?? 0;

  const handleSave = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    let finalValue: number;
    if (mode === 'add') {
      finalValue = currentValue + numValue;
    } else {
      finalValue = numValue;
    }

    onSave(resolution.id, finalValue);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Calculate progress for display
  const getProgressDisplay = () => {
    if (isCumulative) {
      const pct = targetValue > 0 ? Math.round((currentValue / targetValue) * 100) : 0;
      return `${pct}% complete`;
    }
    if (isTarget) {
      const totalDistance = Math.abs(targetValue - startingValue);
      const currentDistance = Math.abs(currentValue - startingValue);
      const pct = totalDistance > 0 ? Math.round((currentDistance / totalDistance) * 100) : 0;
      return `${pct}% there`;
    }
    return '';
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '20rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: colors.text,
            margin: 0,
            marginBottom: '0.25rem',
          }}>
            {isCumulative ? 'Log Progress' : 'Update Value'}
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: colors.textMuted,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {resolution.title}
          </p>
        </div>

        {/* Current Status */}
        <div style={{
          padding: '1rem 1.25rem',
          backgroundColor: colors.bg,
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.text }}>
                {isCumulative ? `${unit}${currentValue.toLocaleString()}` : `${currentValue}${unit}`}
              </span>
              <span style={{ fontSize: '0.875rem', color: colors.textMuted, marginLeft: '0.5rem' }}>
                {isCumulative
                  ? `/ ${unit}${targetValue.toLocaleString()}`
                  : `→ ${targetValue}${unit}`
                }
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: colors.accent }}>
              {getProgressDisplay()}
            </span>
          </div>
          {isTarget && (
            <div style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.25rem' }}>
              Started at {startingValue}{unit}
            </div>
          )}
        </div>

        {/* Input Section */}
        <div style={{ padding: '1.25rem' }}>
          {/* Mode toggle for cumulative */}
          {isCumulative && (
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}>
              <button
                type="button"
                onClick={() => setMode('add')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  backgroundColor: mode === 'add' ? colors.accent : 'transparent',
                  color: mode === 'add' ? 'white' : colors.textMuted,
                  border: `1px solid ${mode === 'add' ? colors.accent : colors.border}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                + Add
              </button>
              <button
                type="button"
                onClick={() => setMode('set')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  backgroundColor: mode === 'set' ? colors.accent : 'transparent',
                  color: mode === 'set' ? 'white' : colors.textMuted,
                  border: `1px solid ${mode === 'set' ? colors.accent : colors.border}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                Set to
              </button>
            </div>
          )}

          {/* Value input */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: colors.textMuted,
              marginBottom: '0.375rem',
            }}>
              {isCumulative
                ? (mode === 'add' ? 'Amount to add' : 'New total')
                : 'Current value'
              }
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isCumulative && unit && (
                <span style={{ fontSize: '1rem', color: colors.textMuted }}>{unit}</span>
              )}
              <input
                ref={inputRef}
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isCumulative ? (mode === 'add' ? '500' : currentValue.toString()) : currentValue.toString()}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '0.5rem',
                  color: colors.text,
                  textAlign: 'center',
                }}
              />
              {isTarget && unit && (
                <span style={{ fontSize: '1rem', color: colors.textMuted }}>{unit}</span>
              )}
            </div>
          </div>

          {/* Preview what the new value will be */}
          {value && !isNaN(parseFloat(value)) && (
            <div style={{
              padding: '0.625rem',
              backgroundColor: theme === 'light' ? 'rgba(31, 58, 90, 0.05)' : 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>New value: </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text }}>
                {isCumulative
                  ? `${unit}${(mode === 'add' ? currentValue + parseFloat(value) : parseFloat(value)).toLocaleString()}`
                  : `${parseFloat(value)}${unit}`
                }
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                backgroundColor: 'transparent',
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!value || isNaN(parseFloat(value))}
              style={{
                flex: 1,
                padding: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                backgroundColor: value && !isNaN(parseFloat(value)) ? colors.accent : colors.border,
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: value && !isNaN(parseFloat(value)) ? 'pointer' : 'not-allowed',
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
