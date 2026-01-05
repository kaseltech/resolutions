'use client';

import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ResolutionProvider } from '@/context/ResolutionContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ViewModeProvider } from '@/context/ViewModeContext';
import { AuthGuard } from './AuthGuard';
import { initOneSignal } from '@/lib/onesignal';

function OneSignalInit() {
  useEffect(() => {
    initOneSignal();
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OneSignalInit />
        <AuthGuard>
          <ViewModeProvider>
            <ResolutionProvider>
              {children}
            </ResolutionProvider>
          </ViewModeProvider>
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}
