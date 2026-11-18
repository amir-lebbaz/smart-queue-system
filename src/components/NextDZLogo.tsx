import React from 'react';

interface NextDZLogoProps {
  className?: string;
  width?: number;
  height?: number;
  textSize?: string;
}

export default function NextDZLogo({
  className = '',
  width = 40,
  height = 26,
  textSize = 'text-xl',
}: NextDZLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} dir="ltr">
      <svg
        width={width}
        height={height}
        viewBox="0 0 64 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="NextDZ Queue Ticket Logo"
        className="shrink-0"
      >
        <path
          d="M4 4H60V14C56.686 14 54 16.686 54 20C54 23.314 56.686 26 60 26V36H4V26C7.314 26 10 23.314 10 20C10 16.686 7.314 14 4 14V4Z"
          stroke="#313c45"
          strokeWidth="3.5"
          strokeLinejoin="round"
          fill="#eef1f5"
        />
        <path
          d="M16 12H36L45 20L36 28H16L22 20L16 12Z"
          fill="#778ca4"
          fillOpacity="0.35"
        />
        <path
          d="M18 20H40M40 20L32 12.5M40 20L32 27.5"
          stroke="#313c45"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`${textSize} font-bold tracking-tight leading-none`}>
        <span style={{ color: '#313c45' }}>Next</span>
        <span style={{ color: '#778ca4' }}>DZ</span>
      </span>
    </div>
  );
}
