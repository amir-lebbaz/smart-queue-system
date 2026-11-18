'use client';

import React, { useEffect, useState } from 'react';

interface NumberTickerProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function NumberTicker({
  value,
  duration = 400,
  suffix = '',
  prefix = '',
  className = '',
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const difference = value - startValue;

    if (difference === 0) return;

    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + difference * ease);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span className={`font-mono tabular-nums tracking-tight ${className}`}>
      {prefix}
      {displayValue.toLocaleString('ar-DZ')}
      {suffix}
    </span>
  );
}
