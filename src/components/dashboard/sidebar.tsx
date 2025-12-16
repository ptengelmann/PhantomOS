'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Brain,
  Palette,
  Factory,
  Store,
  Users,
  Settings,
  Plug,
  LogOut,
  Tag,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Fan Intelligence', href: '/intelligence', icon: Brain },
  { name: 'Asset Tagging', href: '/products', icon: Tag },
  { name: 'Merch Studio', href: '/studio', icon: Palette, badge: 'Soon' },
  { name: 'Production', href: '/production', icon: Factory, badge: 'Soon' },
  { name: 'Storefront', href: '/storefront', icon: Store, badge: 'Soon' },
  { name: 'Creators', href: '/creators', icon: Users, badge: 'Soon' },
];

const bottomNavigation = [
  { name: 'Connectors', href: '/connectors', icon: Plug },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const SIDEBAR_COLLAPSED_KEY = 'phantomos-sidebar-collapsed';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Prevent hydration mismatch and load collapsed state from localStorage
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored === 'true') {
      setCollapsed(true);
    }
  }, []);

  // Persist collapsed state and notify layout
  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newState));
    // Dispatch custom event for same-tab sync with layout
    window.dispatchEvent(new Event('sidebar-toggle'));
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Use consistent values during SSR and initial hydration
  const userName = mounted ? (session?.user?.name || 'User') : 'User';
  const userInitials = mounted ? getInitials(userName) : '...';
  const planName = 'Growth Plan'; // Could be derived from subscription tier

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-white border-r border-[#e5e5e5] flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-[#e5e5e5] relative">
        <Link href="/overview" className="flex items-center justify-center">
          {collapsed ? (
            <span className="text-lg font-bold text-[#0a0a0a] tracking-tight">
              P<span className="italic font-light">OS</span><span className="text-[#a3a3a3]">.</span>
            </span>
          ) : (
            <span className="text-xl font-bold text-[#0a0a0a] tracking-tight">
              Phantom<span className="italic font-light">OS</span><span className="text-[#a3a3a3]">.</span>
            </span>
          )}
        </Link>
        {/* Collapse toggle button */}
        <button
          onClick={toggleCollapsed}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-[#e5e5e5] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors',
            collapsed ? 'right-[-12px]' : 'right-[-12px]'
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeft className="w-3 h-3 text-[#737373]" />
          ) : (
            <PanelLeftClose className="w-3 h-3 text-[#737373]" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 py-2">
            <p className="text-xs font-medium text-[#737373] uppercase tracking-wider">Platform</p>
          </div>
        )}
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.badge ? '#' : item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                'flex items-center gap-3 py-2 text-sm transition-colors',
                collapsed ? 'justify-center px-2' : 'px-3',
                isActive
                  ? 'bg-[#f5f5f5] text-[#0a0a0a] font-medium'
                  : 'text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa]',
                item.badge && 'cursor-not-allowed opacity-60'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#f5f5f5] text-[#737373] border border-[#e5e5e5]">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-[#e5e5e5] px-2 py-4 space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                'flex items-center gap-3 py-2 text-sm transition-colors',
                collapsed ? 'justify-center px-2' : 'px-3',
                isActive
                  ? 'bg-[#f5f5f5] text-[#0a0a0a] font-medium'
                  : 'text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa]'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          title={collapsed ? 'Sign Out' : undefined}
          className={cn(
            'w-full flex items-center gap-3 py-2 text-sm text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa] transition-colors',
            collapsed ? 'justify-center px-2' : 'px-3'
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* User Section */}
      <div className={cn(
        'border-t border-[#e5e5e5]',
        collapsed ? 'p-2 flex justify-center' : 'p-4'
      )}>
        <div className={cn(
          'flex items-center',
          collapsed ? 'justify-center' : 'gap-3'
        )}>
          <div
            className="w-8 h-8 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0"
            title={collapsed ? userName : undefined}
          >
            <span className="text-xs font-medium text-[#737373]">{userInitials}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0a0a0a] truncate">{userName}</p>
              <p className="text-xs text-[#737373] truncate">{planName}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
