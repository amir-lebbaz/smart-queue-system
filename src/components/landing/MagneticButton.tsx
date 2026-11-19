'use client';

import React, { useRef, useState } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'subtle';
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
    // Primary: Charcoal Mist (#313c45) with crisp pure white text (#ffffff)
    primary:
      'bg-[#313c45] text-[#ffffff] shadow-[0_4px_16px_rgba(49,60,69,0.15)] hover:bg-[#4f6271] hover:shadow-[0_6px_22px_rgba(49,60,69,0.22)] border border-[#313c45]',
    // Secondary: Pure White container with 1.5px solid Icy Blue (#778ca4) border and Charcoal Mist (#313c45) text
    secondary:
      'bg-[#ffffff] text-[#313c45] border-[1.5px] border-[#778ca4] hover:bg-[#d5dbe2] hover:border-[#778ca4] shadow-[0_1px_3px_rgba(49,60,69,0.05)]',
    // Subtle: Slate Mist hover
    subtle:
      'bg-transparent text-[#313c45] hover:bg-[#d5dbe2] border border-transparent',
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
