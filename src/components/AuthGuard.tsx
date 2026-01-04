'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthForm } from './AuthForm';
import { AnimatedSplash } from './AnimatedSplash';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [splashState, setSplashState] = useState<'checking' | 'show' | 'hidden'>('checking');

  // Hide the native splash screen
  const hideNativeSplash = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await SplashScreen.hide();
      } catch (e) {
        // Splash screen may already be hidden
      }
    }
  }, []);

  // Check if this is a fresh app launch (not a hot reload)
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const seen = sessionStorage.getItem('splashSeen');
    if (seen) {
      setSplashState('hidden');
      // Hide native splash immediately if we're skipping the animated splash
      hideNativeSplash();
    } else {
      setSplashState('show');
      // Hide native splash so our animated splash can show
      hideNativeSplash();
    }
  }, [hideNativeSplash]);

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashSeen', 'true');
    setSplashState('hidden');
  };

  // Wait until we've checked sessionStorage before deciding what to show
  if (splashState === 'checking') {
    // Return minimal loading state while checking
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #1E3A5F 0%, #2A4A6F 50%, #1E3A5F 100%)',
        }}
      />
    );
  }

  // Show animated splash on first launch
  if (splashState === 'show') {
    return <AnimatedSplash onComplete={handleSplashComplete} duration={2200} />;
  }

  if (loading) {
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
        {/* Minimal loading indicator */}
        <div
          style={{
            width: '24px',
            height: '24px',
            border: '2px solid rgba(196, 163, 90, 0.3)',
            borderTopColor: '#C4A35A',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <>{children}</>;
}
