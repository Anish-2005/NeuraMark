'use client';

import { useEffect, useState } from 'react';

export default function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[70] skeu-card-static px-4 py-3 rounded-xl max-w-sm"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-semibold" style={{ color: 'var(--accent-danger)' }}>
        You are offline
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
        Some features may be unavailable until your connection is restored.
      </p>
    </div>
  );
}
