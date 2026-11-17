'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Smart Queue Service Worker active:', reg.scope);
          // Check for service worker updates immediately on page load
          reg.update().catch(() => {});
        })
        .catch((err) => {
          console.warn('Service Worker registration failed:', err);
        });
    }
  }, []);

  return null;
}
