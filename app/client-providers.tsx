'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ServiceWorkerRegister from './components/ServiceWorkerRegister';
import OfflineStatus from './components/OfflineStatus';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ServiceWorkerRegister />
        <OfflineStatus />
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}
