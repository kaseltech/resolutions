'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  isBiometricAvailable,
  isBiometricLoginEnabled,
  getBiometryType,
  deleteStoredCredentials
} from '@/lib/biometric';
import {
  checkNotificationPermission,
  requestNotificationPermission,
  sendTestNotification
} from '@/lib/reminders';
import { Toggle } from './Toggle';
import { lightTap } from '@/lib/haptics';
import { resetOnboarding } from './SpotlightTutorial';
import { HelpFeedback } from './HelpFeedback';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onShowOnboarding?: () => void;
}

export function Settings({ isOpen, onClose, onShowOnboarding }: SettingsProps) {
  const { colors } = useTheme();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricOn, setBiometricOn] = useState(false);
  const [biometryType, setBiometryType] = useState('Face ID');
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [testingSent, setTestingSent] = useState(false);
  const [showHelpFeedback, setShowHelpFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  async function loadSettings() {
    setLoading(true);
    try {
      const [available, enabled, type, notifPermission] = await Promise.all([
        isBiometricAvailable(),
        isBiometricLoginEnabled(),
        getBiometryType(),
        checkNotificationPermission(),
      ]);
      setBiometricAvailable(available);
      setBiometricOn(enabled);
      setBiometryType(type);
      setNotificationsEnabled(notifPermission);
    } catch {
      // Ignore errors
    }
    setLoading(false);
  }

  async function disableBiometric() {
    await deleteStoredCredentials();
    setBiometricOn(false);
  }

  async function handleNotificationToggle(enabled: boolean) {
    if (enabled) {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    } else {
      setNotificationsEnabled(false);
    }
  }

  async function handleTestNotification() {
    lightTap();
    const sent = await sendTestNotification();
    if (sent) {
      setTestingSent(true);
      setTimeout(() => setTestingSent(false), 3000);
    }
  }

  async function handleShowTutorial() {
    lightTap();
    await resetOnboarding();
    onClose();
    onShowOnboarding?.();
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 50,
        padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: colors.cardBg,
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '80vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
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

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem 1rem',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: colors.text,
            margin: 0,
          }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: colors.textMuted,
            }}
          >
            <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Notifications Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 1rem',
            }}>
              Notifications
            </h3>

            <div
              style={{
                padding: '1rem',
                backgroundColor: colors.bg,
                borderRadius: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🔔</span>
                  <div>
                    <div style={{ fontWeight: 500, color: colors.text }}>
                      Reminders
                    </div>
                    <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>
                      {notificationsEnabled ? 'Allowed' : 'Not allowed'}
                    </div>
                  </div>
                </div>
                <Toggle
                  enabled={notificationsEnabled}
                  onChange={handleNotificationToggle}
                  size="md"
                />
              </div>

              <button
                onClick={handleTestNotification}
                disabled={!notificationsEnabled}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: notificationsEnabled ? colors.accent : colors.border,
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: notificationsEnabled ? 'pointer' : 'not-allowed',
                  opacity: notificationsEnabled ? 1 : 0.5,
                }}
              >
                {testingSent ? 'Notification Sent!' : 'Send Test Notification'}
              </button>

              {!notificationsEnabled && (
                <p style={{
                  fontSize: '0.75rem',
                  color: colors.textMuted,
                  margin: '0.75rem 0 0',
                  lineHeight: 1.4,
                }}>
                  Enable notifications to receive reminders for your resolutions.
                </p>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 1rem',
            }}>
              Security
            </h3>

            {loading ? (
              <div style={{ color: colors.textMuted, fontSize: '0.875rem' }}>
                Loading...
              </div>
            ) : biometricAvailable ? (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: colors.bg,
                  borderRadius: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: biometricOn ? '1rem' : 0 }}>
                  <span style={{ fontSize: '1.5rem' }}>
                    {biometryType === 'Face ID' ? '👤' : '👆'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: colors.text }}>
                      {biometryType} Login
                    </div>
                    <div style={{ fontSize: '0.75rem', color: biometricOn ? colors.accent : colors.textMuted }}>
                      {biometricOn ? 'Enabled' : 'Not enabled'}
                    </div>
                  </div>
                </div>
                {biometricOn ? (
                  <button
                    onClick={disableBiometric}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: 'transparent',
                      color: colors.textMuted,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Disable {biometryType} Login
                  </button>
                ) : (
                  <p style={{
                    fontSize: '0.75rem',
                    color: colors.textMuted,
                    margin: '0.75rem 0 0',
                    lineHeight: 1.4,
                  }}>
                    Log out and sign in again to enable {biometryType} login.
                  </p>
                )}
              </div>
            ) : (
              <div style={{
                padding: '1rem',
                backgroundColor: colors.bg,
                borderRadius: '0.75rem',
                color: colors.textMuted,
                fontSize: '0.875rem',
              }}>
                {biometryType !== 'none'
                  ? `${biometryType} is not available on this device.`
                  : 'Biometric authentication is not available on this device.'}
              </div>
            )}
          </div>

          {/* Help & Support Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 1rem',
            }}>
              Help & Support
            </h3>
            <div style={{
              backgroundColor: colors.bg,
              borderRadius: '0.75rem',
              overflow: 'hidden',
            }}>
              <button
                onClick={() => { lightTap(); setShowHelpFeedback(true); }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>❓</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 500, color: colors.text }}>
                    Help & FAQ
                  </div>
                  <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>
                    Get answers to common questions
                  </div>
                </div>
                <svg style={{ width: '1.25rem', height: '1.25rem', color: colors.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={handleShowTutorial}
                style={{
                  width: '100%',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>📖</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 500, color: colors.text }}>
                    View Tutorial
                  </div>
                  <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>
                    See the app introduction again
                  </div>
                </div>
                <svg style={{ width: '1.25rem', height: '1.25rem', color: colors.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 1rem',
            }}>
              About
            </h3>
            <div style={{
              padding: '1rem',
              backgroundColor: colors.bg,
              borderRadius: '0.75rem',
            }}>
              <div style={{ fontWeight: 500, color: colors.text, marginBottom: '0.25rem' }}>
                YearVow
              </div>
              <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>
                Version 1.0.0
              </div>
            </div>
          </div>
        </div>

        {/* Help & Feedback Modal */}
        <HelpFeedback isOpen={showHelpFeedback} onClose={() => setShowHelpFeedback(false)} />

        <style jsx>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
