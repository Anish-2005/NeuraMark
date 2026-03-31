'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let cancelled = false;
    const register = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (err) {
        if (process.env.NODE_ENV !== 'production' && !cancelled) {
          console.warn('Service worker registration failed:', err);
        }
      }
    };

    register();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
