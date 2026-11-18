'use client';

import React from 'react';

export interface ThemeToggleProps {
  variant?: 'compact' | 'segmented';
  showLabel?: boolean;
  className?: string;
  [key: string]: any;
}

export default function ThemeToggle(_props: ThemeToggleProps = {}) {
  // Theme locked to user-specified signature midnight-slate palette
  return null;
}
