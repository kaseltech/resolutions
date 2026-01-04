'use client';

import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { authenticateWithBiometric, isBiometricEnabled, isBiometricAvailable, getBiometryType } from '@/lib/biometric';

interface BiometricLockProps {
  children: React.ReactNode;
}

export function BiometricLock({ children }: BiometricLockProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [biometryType, setBiometryType] = useState<string>('Face ID');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkBiometricLock();
  }, []);

  async function checkBiometricLock() {
    setIsChecking(true);

    try {
      const [available, enabled] = await Promise.all([
        isBiometricAvailable(),
        isBiometricEnabled(),
      ]);

      if (!available || !enabled) {
        // Biometric not available or not enabled, skip lock
        setIsLocked(false);
        setIsChecking(false);
        return;
      }

      // Get biometry type for display
      const type = await getBiometryType();
      setBiometryType(type);

      // Prompt for authentication
      setIsChecking(false);
      await promptBiometric();
    } catch {
      setIsLocked(false);
      setIsChecking(false);
    }
  }

  async function promptBiometric() {
    setError(null);

    const success = await authenticateWithBiometric();

    if (success) {
      setIsLocked(false);
    } else {
      setError('Authentication failed. Tap to try again.');
    }
  }

  // Still checking biometric status
  if (isChecking) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #1E3A5F 0%, #2A4A6F 50%, #1E3A5F 100%)',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div style={{ animation: 'pulse 2s ease-in-out infinite' }}>
          <Logo size="xl" />
        </div>
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(0.98); }
          }
        `}</style>
      </div>
    );
  }

  // Locked - show unlock screen
  if (isLocked) {
    return (
      <div
        onClick={promptBiometric}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #1E3A5F 0%, #2A4A6F 50%, #1E3A5F 100%)',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          cursor: 'pointer',
        }}
      >
        <Logo size="xl" />

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {biometryType === 'Face ID' ? '👤' : '👆'}
          </div>
          <h2 style={{
            color: '#f1f5f9',
            fontSize: '1.25rem',
            fontWeight: 600,
            margin: '0 0 0.5rem',
          }}>
            Unlock with {biometryType}
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '0.875rem',
            margin: 0,
          }}>
            Tap anywhere to authenticate
          </p>

          {error && (
            <p style={{
              color: '#f87171',
              fontSize: '0.875rem',
              marginTop: '1rem',
            }}>
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Unlocked - render children
  return <>{children}</>;
}
