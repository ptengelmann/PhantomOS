'use client';

import { Bell, Search, Plus } from 'lucide-react';
import { Button, Input } from '@/components/ui';

interface HeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-[#e5e5e5] flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold text-[#0a0a0a]">{title}</h1>
        {description && (
          <p className="text-sm text-[#737373]">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 h-9 pl-9 pr-3 bg-[#f5f5f5] border border-transparent text-sm text-[#0a0a0a] placeholder:text-[#a3a3a3] transition-colors focus:outline-none focus:border-[#0a0a0a] focus:bg-white"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-[#737373] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0a0a0a]" />
        </button>

        {/* Action Button */}
        {action && (
          <Button onClick={action.onClick} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            {action.label}
          </Button>
        )}
      </div>
    </header>
  );
}
