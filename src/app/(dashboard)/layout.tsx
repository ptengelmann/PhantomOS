'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard';

const SIDEBAR_COLLAPSED_KEY = 'phantomos-sidebar-collapsed';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync with localStorage and listen for changes
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    setCollapsed(stored === 'true');

    // Listen for storage changes (from sidebar toggle)
    const handleStorage = () => {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      setCollapsed(stored === 'true');
    };

    // Also listen for custom event for same-tab updates
    const handleSidebarToggle = () => {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      setCollapsed(stored === 'true');
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('sidebar-toggle', handleSidebarToggle);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('sidebar-toggle', handleSidebarToggle);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Sidebar />
      <main
        className={`transition-all duration-300 ${
          mounted ? (collapsed ? 'pl-16' : 'pl-64') : 'pl-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
