'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { colors } = useTheme();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm();
    }
  }, [isOpen, onCancel, onConfirm]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the confirm button when modal opens
      setTimeout(() => confirmButtonRef.current?.focus(), 10);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const variantColors = {
    danger: {
      icon: (
        <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
      iconBg: '#450a0a',
      iconColor: '#f87171',
      buttonBg: '#dc2626',
      buttonHover: '#b91c1c',
    },
    warning: {
      icon: (
        <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      iconBg: '#451a03',
      iconColor: '#fbbf24',
      buttonBg: '#d97706',
      buttonHover: '#b45309',
    },
    info: {
      icon: (
        <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      iconBg: '#1e3a5f',
      iconColor: '#60a5fa',
      buttonBg: '#2563eb',
      buttonHover: '#1d4ed8',
    },
  };

  const v = variantColors[variant];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 100,
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        ref={modalRef}
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          width: '100%',
          maxWidth: '24rem',
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
          animation: 'slideUp 0.2s ease-out',
        }}
      >
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* Icon */}
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                backgroundColor: v.iconBg,
                color: v.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {v.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: colors.text,
                margin: 0,
                marginBottom: '0.5rem',
              }}>
                {title}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: colors.textMuted,
                margin: 0,
                lineHeight: 1.5,
              }}>
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#0f172a',
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.625rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: colors.text,
              backgroundColor: 'transparent',
              border: `1px solid ${colors.border}`,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              transition: 'all 0.15s ease',
            }}
          >
            {cancelLabel}
            <kbd style={{
              padding: '0.125rem 0.375rem',
              fontSize: '0.625rem',
              backgroundColor: colors.bg,
              borderRadius: '0.25rem',
              border: `1px solid ${colors.border}`,
              color: colors.textMuted,
              fontFamily: 'inherit',
            }}>
              Esc
            </kbd>
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            style={{
              padding: '0.625rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'white',
              backgroundColor: v.buttonBg,
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              transition: 'all 0.15s ease',
            }}
          >
            {confirmLabel}
            <kbd style={{
              padding: '0.125rem 0.375rem',
              fontSize: '0.625rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '0.25rem',
              color: 'rgba(255,255,255,0.9)',
              fontFamily: 'inherit',
            }}>
              Enter
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
