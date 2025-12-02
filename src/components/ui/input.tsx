'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'w-full h-10 px-3 bg-white border border-[#e5e5e5] text-[#0a0a0a] text-sm placeholder:text-[#a3a3a3] transition-colors duration-200 focus:outline-none focus:border-[#0a0a0a]',
            error && 'border-[#ef4444] focus:border-[#ef4444]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-[#ef4444]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
