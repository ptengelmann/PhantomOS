'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Plus, X, Sparkles, TrendingUp, AlertCircle, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui';

interface HeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Sample notifications - in production these would come from an API
const sampleNotifications = [
  {
    id: '1',
    type: 'insight',
    title: 'New AI Insight Available',
    message: 'Your sales data has been analyzed. Check the Fan Intelligence Hub for new recommendations.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'sync',
    title: 'Shopify Sync Complete',
    message: '17 products synced successfully from your Shopify store.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'alert',
    title: 'Product Mapping Needed',
    message: '12 products are unmapped. Tag them with IP assets to enable analytics.',
    time: '1 day ago',
    read: true,
  },
];

// Keyboard shortcuts
const keyboardShortcuts = [
  { keys: ['↑', '↓'], description: 'Navigate products' },
  { keys: ['J', 'K'], description: 'Navigate (vim-style)' },
  { keys: ['N'], description: 'Next unmapped product' },
  { keys: ['A'], description: 'Accept AI suggestion' },
  { keys: ['S'], description: 'Skip AI suggestion' },
];

export function Header({ title, description, action }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shortcutsRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (shortcutsRef.current && !shortcutsRef.current.contains(event.target as Node)) {
        setShowShortcuts(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'insight':
        return <Sparkles className="w-4 h-4 text-[#22c55e]" />;
      case 'sync':
        return <TrendingUp className="w-4 h-4 text-[#3b82f6]" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-[#f59e0b]" />;
      default:
        return <Bell className="w-4 h-4 text-[#737373]" />;
    }
  };

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

        {/* Keyboard Shortcuts */}
        <div className="relative" ref={shortcutsRef}>
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-2 text-[#737373] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors"
            title="Keyboard shortcuts"
          >
            <Keyboard className="w-5 h-5" />
          </button>

          {/* Shortcuts Dropdown */}
          {showShortcuts && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#e5e5e5] shadow-lg z-50">
              <div className="px-4 py-3 border-b border-[#e5e5e5]">
                <h3 className="font-medium text-[#0a0a0a]">Keyboard Shortcuts</h3>
                <p className="text-xs text-[#737373] mt-0.5">Available on Asset Tagging page</p>
              </div>
              <div className="p-2">
                {keyboardShortcuts.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between px-2 py-2 hover:bg-[#fafafa]">
                    <span className="text-sm text-[#737373]">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, j) => (
                        <span key={j} className="px-1.5 py-0.5 bg-[#f5f5f5] border border-[#e5e5e5] text-xs font-mono text-[#0a0a0a]">
                          {key}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#737373] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0a0a0a]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#e5e5e5] shadow-lg z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5]">
                <h3 className="font-medium text-[#0a0a0a]">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#737373] hover:text-[#0a0a0a]"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="w-8 h-8 text-[#e5e5e5] mx-auto mb-2" />
                    <p className="text-sm text-[#737373]">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors ${
                        !notification.read ? 'bg-[#fafafa]' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.read ? 'font-medium text-[#0a0a0a]' : 'text-[#737373]'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-[#a3a3a3] mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[#a3a3a3] mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-[#e5e5e5]">
                <button className="w-full text-xs text-center text-[#737373] hover:text-[#0a0a0a] py-1">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

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
