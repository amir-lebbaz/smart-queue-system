// Screen WakeLock and Web Notifications Helpers (Zero external dependencies)

let wakeLockSentinel: unknown = null;

export async function requestScreenWakeLock(): Promise<boolean> {
  if (typeof window === 'undefined' || !('wakeLock' in navigator)) {
    return false;
  }

  try {
    const nav = navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } };
    wakeLockSentinel = await nav.wakeLock.request('screen');
    console.log('Screen Wake Lock is active');
    return true;
  } catch (err) {
    console.warn('Wake Lock request error:', err);
    return false;
  }
}

export function releaseScreenWakeLock(): void {
  if (wakeLockSentinel && typeof (wakeLockSentinel as { release?: () => Promise<void> }).release === 'function') {
    (wakeLockSentinel as { release: () => Promise<void> }).release().catch(() => {});
    wakeLockSentinel = null;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendBrowserNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/icon.svg',
        badge: '/icon.svg',
        dir: 'rtl',
        lang: 'ar',
      });
    } catch {
      // In mobile browsers, serviceWorker registration notification may be required
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: '/icon.svg',
            badge: '/icon.svg',
            dir: 'rtl',
            lang: 'ar',
          });
        });
      }
    }
  }
}
