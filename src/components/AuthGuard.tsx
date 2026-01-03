'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthForm } from './AuthForm';
import { AnimatedSplash } from './AnimatedSplash';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [splashState, setSplashState] = useState<'checking' | 'show' | 'hidden'>('checking');

  // Check if this is a fresh app launch (not a hot reload)
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const seen = sessionStorage.getItem('splashSeen');
    if (seen) {
      setSplashState('hidden');
    } else {
      setSplashState('show');
    }
  }, []);

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
          background: 'linear-gradient(180deg, #0a0f1a 0%, #0f172a 40%, #1e293b 100%)',
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
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Minimal loading indicator */}
        <div
          style={{
            width: '24px',
            height: '24px',
            border: '2px solid rgba(16, 185, 129, 0.2)',
            borderTopColor: '#10b981',
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
