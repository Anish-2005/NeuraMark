// app/dashboard/page.js
'use client'
import { Suspense } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardContent from './DashboardContent';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={(
          <div className="min-h-[50vh] w-full flex items-center justify-center px-4">
            <div className="skeu-card-static rounded-2xl p-6 text-center max-w-sm w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent-primary)] mx-auto mb-3" />
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Loading dashboard...
              </p>
            </div>
          </div>
        )}
      >
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
