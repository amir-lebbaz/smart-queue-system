import React from 'react';

export interface PlanBadgeProps {
  plan?: 'starter' | 'pro' | 'elite' | string;
  count?: number;
  label?: string;
  showPrice?: boolean;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export default function PlanBadge({
  plan,
  count,
  label,
  showPrice = false,
  size = 'sm',
  className = '',
  active = false,
  onClick,
}: PlanBadgeProps) {
  const normalizedPlan = (plan || 'starter').toLowerCase();

  // Pricing labels
  const planDetails: Record<string, { title: string; price: string }> = {
    starter: { title: 'أساسية', price: '1,500 دج/شهر' },
    pro: { title: 'محترفة', price: '2,500 دج/شهر' },
    elite: { title: 'نخبة', price: '3,000 دج/شهر' },
  };

  const details = planDetails[normalizedPlan] || planDetails.starter;
  const displayLabel = label || (count !== undefined ? `${count} ${details.title}` : showPrice ? `${details.title} (${details.price})` : details.title);

  // SVG Icons
  const renderIcon = (iconSize: number = 14) => {
    if (normalizedPlan === 'elite') {
      return (
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="shrink-0"
          aria-hidden="true"
        >
          <path d="M6 3h12l4 6-10 13L2 9Z" />
          <path d="M11 3 8 9l4 13 4-13-3-6" />
          <path d="M2 9h20" />
        </svg>
      );
    }

    if (normalizedPlan === 'pro') {
      return (
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="shrink-0"
          aria-hidden="true"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    }

    // Default: Starter / Essential Concentric Target
    return (
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="shrink-0"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  };

  // Size styling
  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
  };

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
  };

  // Color mappings
  // Dual-theme compatible:
  // Dark mode uses subtle tinted borders
  // Light mode uses clean Frozen Whisper contrast
  const colorStyles: Record<string, string> = {
    starter: 'border-slate-500/30 bg-slate-500/10 text-slate-300 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-300',
    pro: 'border-sky-400/30 bg-sky-400/10 text-sky-300 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300',
    elite: 'border-amber-400/30 bg-amber-400/10 text-amber-300 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300',
  };

  const activeStyles: Record<string, string> = {
    starter: 'ring-2 ring-slate-400 bg-slate-500/20 text-white font-bold',
    pro: 'ring-2 ring-sky-400 bg-sky-400/20 text-white font-bold',
    elite: 'ring-2 ring-amber-400 bg-amber-400/20 text-white font-bold',
  };

  const baseClass = `inline-flex items-center rounded-full border font-medium select-none transition-all ${
    sizeStyles[size]
  } ${colorStyles[normalizedPlan] || colorStyles.starter} ${
    active ? (activeStyles[normalizedPlan] || activeStyles.starter) : ''
  } ${onClick ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''} ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={baseClass}>
        {renderIcon(iconSizes[size])}
        <span>{displayLabel}</span>
      </button>
    );
  }

  return (
    <span className={baseClass}>
      {renderIcon(iconSizes[size])}
      <span>{displayLabel}</span>
    </span>
  );
}
