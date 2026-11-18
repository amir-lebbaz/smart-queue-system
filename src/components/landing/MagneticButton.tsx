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
    'relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-[0.98] select-none text-nowrap';

  const variants = {
    // Primary: Charcoal Mist (#313c45) with crisp pale text
    primary:
      'bg-[#313c45] text-[#f7f9fb] shadow-[0_4px_20px_rgba(49,60,69,0.18)] hover:bg-[#252f36] hover:shadow-[0_8px_30px_rgba(49,60,69,0.25)] border border-[#313c45]',
    // Secondary: Icy Blue outline & soft container
    secondary:
      'bg-[#ffffff]/80 backdrop-blur-md text-[#313c45] border border-[#b3bfcb] hover:border-[#778ca4] hover:bg-[#ffffff] shadow-[0_2px_12px_rgba(119,140,164,0.12)]',
    // Subtle: Slate Mist hover
    subtle:
      'bg-transparent text-[#4f6271] hover:text-[#313c45] hover:bg-[#b3bfcb]/20 border border-transparent',
  };

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
      className="inline-block"
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
