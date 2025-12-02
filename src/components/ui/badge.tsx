'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-[#f5f5f5] text-[#0a0a0a] border-[#e5e5e5]',
      success: 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]',
      warning: 'bg-[#fef9c3] text-[#854d0e] border-[#fef08a]',
      error: 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]',
      outline: 'bg-transparent text-[#0a0a0a] border-[#0a0a0a]',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2 py-0.5 text-xs font-medium border',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
