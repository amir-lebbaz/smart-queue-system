'use client';

import React, { useEffect, useState } from 'react';

type Theme = 'arctic' | 'frozen';

interface ThemeToggleProps {
  className?: string;
  variant?: 'compact' | 'segmented';
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = '',
  variant = 'compact',
  showLabel = true,
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('arctic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 1. Initial read from DOM or localStorage
    const domTheme = document.documentElement.getAttribute('data-theme') as Theme | null;
    const storedTheme = (localStorage.getItem('smart_queue_theme') as Theme) || null;
    const initialTheme: Theme = domTheme === 'frozen' || storedTheme === 'frozen' ? 'frozen' : 'arctic';
    
    setTheme(initialTheme);
    applyTheme(initialTheme);

    // 2. Multi-instance & multi-tab synchronization listener
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<Theme>;
      if (customEvent.detail && (customEvent.detail === 'arctic' || customEvent.detail === 'frozen')) {
        setTheme(customEvent.detail);
      } else {
        const currentDom = document.documentElement.getAttribute('data-theme') as Theme | null;
        if (currentDom) setTheme(currentDom);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'smart_queue_theme' && (e.newValue === 'arctic' || e.newValue === 'frozen')) {
        setTheme(e.newValue);
        applyTheme(e.newValue);
      }
    };

    window.addEventListener('smart_queue_theme_changed', handleCustomChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('smart_queue_theme_changed', handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'frozen') {
      document.documentElement.classList.add('theme-frozen');
    } else {
      document.documentElement.classList.remove('theme-frozen');
    }
  };

  const handleSelectTheme = (newTheme: Theme) => {
    if (newTheme === theme) return;
    setTheme(newTheme);
    applyTheme(newTheme);
    try {
      localStorage.setItem('smart_queue_theme', newTheme);
    } catch {
      // Ignore private browsing storage quota errors
    }
    window.dispatchEvent(new CustomEvent('smart_queue_theme_changed', { detail: newTheme }));
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'arctic' ? 'frozen' : 'arctic';
    handleSelectTheme(nextTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slateNavy-800 bg-slateNavy-900/60 text-slateNavy-400 text-xs ${className}`}
        aria-hidden="true"
      >
        <span className="w-3.5 h-3.5 rounded-full bg-slateNavy-700 animate-pulse" />
        {showLabel && <span className="opacity-0">المظهر</span>}
      </div>
    );
  }

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-0.5 rounded-xl border border-slateNavy-800 bg-slateNavy-950/80 shadow-sm text-xs ${className}`}
        role="group"
        aria-label="اختيار مظهر الموقع"
      >
        <button
          type="button"
          onClick={() => handleSelectTheme('arctic')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition text-xs ${
            theme === 'arctic'
              ? 'bg-slateNavy-800 text-slateNavy-100 shadow-sm font-bold'
              : 'text-slateNavy-400 hover:text-slateNavy-200'
          }`}
          title="المظهر القطبي الكلاسيكي (أزرق عميق)"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
          </svg>
          {showLabel && <span>أزرق قطبي</span>}
        </button>

        <button
          type="button"
          onClick={() => handleSelectTheme('frozen')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition text-xs ${
            theme === 'frozen'
              ? 'bg-slateNavy-800 text-slateNavy-100 shadow-sm font-bold'
              : 'text-slateNavy-400 hover:text-slateNavy-200'
          }`}
          title="شتاء هادئ (فحم ياباني وثلج بارد)"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
          {showLabel && <span>شتاء هادئ</span>}
        </button>
      </div>
    );
  }

  // Compact Single Button Toggle
  const isFrozen = theme === 'frozen';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slateNavy-800 bg-slateNavy-900/80 hover:bg-slateNavy-850 hover:border-slateNavy-700 text-slateNavy-200 text-xs font-semibold shadow-sm transition active:scale-95 ${className}`}
      title={isFrozen ? 'التبديل إلى الأزرق القطبي' : 'التبديل إلى ثيم الشتاء الهادئ (冬色の吐息)'}
      aria-label="تبديل مظهر الموقع"
    >
      {isFrozen ? (
        <>
          <span className="w-2 h-2 rounded-full bg-[#778ca4] shadow-sm" />
          <svg className="w-3.5 h-3.5 text-[#b3bfcb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
          {showLabel && <span>شتاء هادئ</span>}
        </>
      ) : (
        <>
          <span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm" />
          <svg className="w-3.5 h-3.5 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
          </svg>
          {showLabel && <span>أزرق قطبي</span>}
        </>
      )}
    </button>
  );
}
