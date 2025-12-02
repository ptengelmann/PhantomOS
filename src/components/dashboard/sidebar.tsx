'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Brain,
  Palette,
  Factory,
  Store,
  Users,
  Settings,
  Plug,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Fan Intelligence', href: '/intelligence', icon: Brain },
  { name: 'Merch Studio', href: '/studio', icon: Palette, badge: 'Soon' },
  { name: 'Production', href: '/production', icon: Factory, badge: 'Soon' },
  { name: 'Storefront', href: '/storefront', icon: Store, badge: 'Soon' },
  { name: 'Creators', href: '/creators', icon: Users, badge: 'Soon' },
];

const bottomNavigation = [
  { name: 'Connectors', href: '/connectors', icon: Plug },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#e5e5e5] flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#e5e5e5]">
        <Link href="/overview" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0a0a0a] flex items-center justify-center">
            <span className="text-white text-lg font-bold">P</span>
          </div>
          <span className="text-lg font-semibold text-[#0a0a0a] tracking-tight">PhantomOS</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-2">
          <p className="text-xs font-medium text-[#737373] uppercase tracking-wider">Platform</p>
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.badge ? '#' : item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-[#f5f5f5] text-[#0a0a0a] font-medium'
                  : 'text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa]',
                item.badge && 'cursor-not-allowed opacity-60'
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 bg-[#f5f5f5] text-[#737373] border border-[#e5e5e5]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-[#e5e5e5] px-3 py-4 space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-[#f5f5f5] text-[#0a0a0a] font-medium'
                  : 'text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa]'
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa] transition-colors">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* User Section */}
      <div className="border-t border-[#e5e5e5] p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
            <span className="text-xs font-medium text-[#737373]">PO</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#0a0a0a] truncate">Pedro Oliveira</p>
            <p className="text-xs text-[#737373] truncate">Growth Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
