'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ResolutionProvider } from '@/context/ResolutionContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthGuard } from './AuthGuard';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGuard>
          <ResolutionProvider>
            {children}
          </ResolutionProvider>
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}
