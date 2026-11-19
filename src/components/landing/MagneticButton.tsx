'use client';

import React, { useRef, useState } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'subtle' | 'inverted';
  target?: string;
  rel?: string;
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  target,
  rel,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable magnetic physics on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.22;
    const deltaY = (e.clientY - centerY) * 0.22;
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  // Luxury Editorial Color Schemes
  const baseStyles =
    'relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold transition-all duration-300 active:scale-[0.98] select-none';

  const variants = {
    // Primary: Adapts dynamically (Charcoal Mist #313c45 on light, Crisp Light #CCD0CF on dark)
    primary:
      'bg-slateNavy-100 text-slateNavy-950 hover:opacity-90 shadow-lg border border-slateNavy-700 font-bold',
    // Secondary: Adapts dynamically (Pure White #ffffff on light, Deep Navy #11212D on dark)
    secondary:
      'bg-slateNavy-900 text-slateNavy-100 border border-slateNavy-800 hover:bg-slateNavy-850 shadow-sm font-bold',
    // Subtle: Muted hover
    subtle:
      'bg-transparent text-slateNavy-100 hover:bg-slateNavy-850 border border-transparent font-medium',
    // Inverted: High-contrast CTA
    inverted:
      'bg-slateNavy-100 text-slateNavy-950 hover:opacity-90 shadow-xl border border-transparent font-bold',
  };

  const isFullWidth = className.includes('w-full');
  const wrapperClass = isFullWidth ? 'w-full sm:w-auto inline-block' : 'inline-block';
  const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <div
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
      }}
      className={wrapperClass}
    >
      {href ? (
        <a href={href} target={target} rel={rel} className={combinedStyles}>
          {children}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={combinedStyles}>
          {children}
        </button>
      )}
    </div>
  );
}
