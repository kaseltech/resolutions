'use client';

import { useAuth } from '@/context/AuthContext';
import { AuthForm } from './AuthForm';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #F8F8F5 0%, #F0F0EB 50%, #E8E8E3 100%)',
      }}>
        <div style={{ color: '#8A8A85', fontSize: '1.25rem', fontWeight: 300 }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <>{children}</>;
}
