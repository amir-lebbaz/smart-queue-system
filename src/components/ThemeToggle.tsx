'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Snowflake, Sun } from 'lucide-react';

export interface ThemeToggleProps {
  variant?: 'compact' | 'segmented';
  showLabel?: boolean;
  className?: string;
  [key: string]: any;
}

export default function ThemeToggle({
  variant = 'compact',
  showLabel = true,
  className = '',
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<'arctic' | 'frozen'>('arctic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial theme from DOM or localStorage
    const saved = localStorage.getItem('smart_queue_theme') as 'arctic' | 'frozen' | null;
    const currentAttr = document.documentElement.getAttribute('data-theme') as 'arctic' | 'frozen' | null;
    const initialTheme = saved || currentAttr || 'arctic';
    setTheme(initialTheme);

    // Sync listener for cross-component or cross-tab updates
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: 'arctic' | 'frozen' }>;
      if (customEvent.detail?.theme) {
        setTheme(customEvent.detail.theme);
      } else {
        const updated = (document.documentElement.getAttribute('data-theme') as 'arctic' | 'frozen') || 'arctic';
        setTheme(updated);
      }
    };

    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  const handleSelectTheme = (newTheme: 'arctic' | 'frozen') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('smart_queue_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      if (newTheme === 'frozen') {
        document.documentElement.classList.add('theme-frozen');
      } else {
        document.documentElement.classList.remove('theme-frozen');
      }
      // Broadcast event so all ThemeToggle instances update synchronously
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  };

  const toggleTheme = () => {
    handleSelectTheme(theme === 'frozen' ? 'arctic' : 'frozen');
  };

  if (!mounted) {
    // Render unobtrusive placeholder during SSR to prevent layout shifts
    return (
      <div className={`inline-flex items-center justify-center p-2 rounded-xl opacity-0 ${className}`}>
        <span className="w-4 h-4" />
      </div>
    );
  }

  // Segmented Mode (Side-by-side selection)
  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-slateNavy-900/90 border border-slateNavy-800 shadow-sm text-xs font-semibold ${className}`}
        dir="rtl"
      >
        <button
          type="button"
          onClick={() => handleSelectTheme('arctic')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
            theme === 'arctic'
              ? 'bg-slateNavy-800 text-slateNavy-100 shadow-sm font-bold border border-slateNavy-700'
              : 'text-slateNavy-400 hover:text-slateNavy-200'
          }`}
          title="الوضع الأصلي (الكحلي الليلي الفاخر)"
        >
          <Moon className="w-3.5 h-3.5 text-slateNavy-300" />
          {showLabel && <span>الوضع الأصلي</span>}
        </button>

        <button
          type="button"
          onClick={() => handleSelectTheme('frozen')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
            theme === 'frozen'
              ? 'bg-slateNavy-800 text-slateNavy-100 shadow-sm font-bold border border-slateNavy-700'
              : 'text-slateNavy-400 hover:text-slateNavy-200'
          }`}
          title="ثيم صفحة الهبوط (شتاء هادئ - Frozen Whisper)"
        >
          <Snowflake className="w-3.5 h-3.5 text-[#778ca4]" />
          {showLabel && <span>ثيم صفحة الهبوط</span>}
        </button>
      </div>
    );
  }

  // Compact Button Mode
  const isFrozen = theme === 'frozen';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slateNavy-800 bg-slateNavy-900/90 hover:bg-slateNavy-850 hover:border-slateNavy-700 text-slateNavy-200 text-xs font-bold shadow-sm transition active:scale-95 ${className}`}
      title={isFrozen ? 'العودة للوضع الأصلي (كحلي ليلي فاخر)' : 'التحويل إلى ثيم صفحة الهبوط (شتاء هادئ)'}
      aria-label="تبديل مظهر الموقع"
    >
      {isFrozen ? (
        <>
          <Snowflake className="w-3.5 h-3.5 text-[#778ca4]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#778ca4]" />
          {showLabel && <span className="text-slateNavy-100">ثيم صفحة الهبوط</span>}
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-slateNavy-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#4A5C6A]" />
          {showLabel && <span className="text-slateNavy-100">الوضع الأصلي</span>}
        </>
      )}
    </button>
  );
}
