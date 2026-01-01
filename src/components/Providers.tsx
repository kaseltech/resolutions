'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ResolutionProvider } from '@/context/ResolutionContext';
import { AuthGuard } from './AuthGuard';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <ResolutionProvider>
          {children}
        </ResolutionProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
