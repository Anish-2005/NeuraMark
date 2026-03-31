// components/ProtectedRoute.js
'use client'
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[50vh] w-full flex items-center justify-center px-4">
        <div className="skeu-card-static rounded-2xl p-6 text-center max-w-sm w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent-primary)] mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  return <>{user ? children : null}</>;
}
