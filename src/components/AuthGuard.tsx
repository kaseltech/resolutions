'use client';

import { useAuth } from '@/context/AuthContext';
import { AuthForm } from './AuthForm';
import { Logo } from './Logo';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div style={{ animation: 'pulse 2s ease-in-out infinite' }}>
          <Logo size={100} />
        </div>
        <div
          style={{
            marginTop: '1.5rem',
            color: '#94a3b8',
            fontSize: '0.875rem',
            fontWeight: 400,
            letterSpacing: '0.05em',
          }}
        >
          Loading...
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

  if (!user) {
    return <AuthForm />;
  }

  return <>{children}</>;
}
