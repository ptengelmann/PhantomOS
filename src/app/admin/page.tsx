'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, Clock, CheckCircle, XCircle, Mail, Building, Globe, DollarSign, ShoppingBag, Loader2, Copy, Check, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, Input } from '@/components/ui';

interface WaitlistEntry {
  id: string;
  email: string;
  companyName: string | null;
  companyWebsite: string | null;
  revenueRange: string | null;
  primaryChannel: string | null;
  notes: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  createdAt: string;
  approvedAt: string | null;
}

interface WaitlistStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  converted: number;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [stats, setStats] = useState<WaitlistStats>({ total: 0, pending: 0, approved: 0, rejected: 0, converted: 0 });
  const [filter, setFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAuth = async () => {
    if (!secretKey.trim()) {
      setAuthError('Please enter the admin secret key');
      return;
    }

    setLoading(true);
    setAuthError('');

    try {
      const response = await fetch(`/api/waitlist?key=${encodeURIComponent(secretKey)}`);

      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
        calculateStats(data.entries || []);
        setAuthenticated(true);
        // Store in session for refresh
        sessionStorage.setItem('adminKey', secretKey);
      } else {
        setAuthError('Invalid admin key');
      }
    } catch {
      setAuthError('Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  // Check for stored session on mount
  useEffect(() => {
    const storedKey = sessionStorage.getItem('adminKey');
    if (storedKey) {
      setSecretKey(storedKey);
      // Auto-authenticate
      fetch(`/api/waitlist?key=${encodeURIComponent(storedKey)}`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Invalid key');
        })
        .then(data => {
          setEntries(data.entries || []);
          calculateStats(data.entries || []);
          setAuthenticated(true);
        })
        .catch(() => {
          sessionStorage.removeItem('adminKey');
        });
    }
  }, []);

  const calculateStats = (data: WaitlistEntry[]) => {
    const stats: WaitlistStats = {
      total: data.length,
      pending: data.filter(e => e.status === 'pending').length,
      approved: data.filter(e => e.status === 'approved').length,
      rejected: data.filter(e => e.status === 'rejected').length,
      converted: data.filter(e => e.status === 'converted').length,
    };
    setStats(stats);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/waitlist?key=${encodeURIComponent(secretKey)}`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
        calculateStats(data.entries || []);
      }
    } catch {
      console.error('Failed to refresh');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setUpdating(id);
    try {
      const response = await fetch('/api/waitlist/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, key: secretKey }),
      });

      if (response.ok) {
        // Update local state
        setEntries(prev => prev.map(e =>
          e.id === id ? { ...e, status, approvedAt: status === 'approved' ? new Date().toISOString() : null } : e
        ));
        calculateStats(entries.map(e =>
          e.id === id ? { ...e, status } : e
        ));
      }
    } catch {
      console.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const copyInviteLink = (email: string, id: string) => {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/register?email=${encodeURIComponent(email)}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEntries = filter === 'all'
    ? entries
    : entries.filter(e => e.status === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="error"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'converted':
        return <Badge><Users className="w-3 h-3 mr-1" />Converted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Auth screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#0a0a0a] flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter your admin secret key to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                  {authError}
                </div>
              )}
              <div className="relative">
                <Input
                  type={showKey ? 'text' : 'password'}
                  placeholder="Admin secret key"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#0a0a0a]"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button className="w-full" onClick={handleAuth} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {loading ? 'Authenticating...' : 'Access Admin'}
              </Button>
              <p className="text-xs text-[#a3a3a3] text-center">
                The admin key is set in your ADMIN_SECRET_KEY environment variable
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e5e5] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0a0a0a] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#0a0a0a]">PhantomOS Admin</h1>
              <p className="text-sm text-[#737373]">Waitlist Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                sessionStorage.removeItem('adminKey');
                setAuthenticated(false);
                setSecretKey('');
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#737373]" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#0a0a0a]">{stats.total}</p>
                  <p className="text-sm text-[#737373]">Total Signups</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-50 border border-yellow-200 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#0a0a0a]">{stats.pending}</p>
                  <p className="text-sm text-[#737373]">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 border border-green-200 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#0a0a0a]">{stats.approved}</p>
                  <p className="text-sm text-[#737373]">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 border border-red-200 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#0a0a0a]">{stats.rejected}</p>
                  <p className="text-sm text-[#737373]">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#0a0a0a]">{stats.converted}</p>
                  <p className="text-sm text-[#737373]">Converted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected', 'converted'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium border transition-colors capitalize ${
                filter === status
                  ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                  : 'bg-white text-[#737373] border-[#e5e5e5] hover:border-[#a3a3a3]'
              }`}
            >
              {status} {status === 'all' ? `(${stats.total})` : `(${stats[status as keyof WaitlistStats]})`}
            </button>
          ))}
        </div>

        {/* Entries List */}
        <Card>
          <CardHeader>
            <CardTitle>Waitlist Entries</CardTitle>
            <CardDescription>
              {filteredEntries.length} {filter === 'all' ? 'total' : filter} entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEntries.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="w-12 h-12 text-[#e5e5e5] mx-auto mb-4" />
                <p className="text-[#737373]">No {filter === 'all' ? '' : filter} entries yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-[#e5e5e5] p-4 hover:border-[#a3a3a3] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium text-[#0a0a0a]">{entry.email}</p>
                          {getStatusBadge(entry.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                          {entry.companyName && (
                            <div className="flex items-center gap-2 text-[#737373]">
                              <Building className="w-4 h-4" />
                              {entry.companyName}
                            </div>
                          )}
                          {entry.companyWebsite && (
                            <div className="flex items-center gap-2 text-[#737373]">
                              <Globe className="w-4 h-4" />
                              <a href={entry.companyWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-[#0a0a0a] truncate">
                                {entry.companyWebsite.replace(/^https?:\/\//, '')}
                              </a>
                            </div>
                          )}
                          {entry.revenueRange && (
                            <div className="flex items-center gap-2 text-[#737373]">
                              <DollarSign className="w-4 h-4" />
                              {entry.revenueRange}
                            </div>
                          )}
                          {entry.primaryChannel && (
                            <div className="flex items-center gap-2 text-[#737373]">
                              <ShoppingBag className="w-4 h-4" />
                              {entry.primaryChannel}
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-[#a3a3a3] mt-2">
                          Submitted {formatDate(entry.createdAt)}
                          {entry.approvedAt && ` • Approved ${formatDate(entry.approvedAt)}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {entry.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(entry.id, 'approved')}
                              disabled={updating === entry.id}
                            >
                              {updating === entry.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4 mr-1" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateStatus(entry.id, 'rejected')}
                              disabled={updating === entry.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {entry.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyInviteLink(entry.email, entry.id)}
                          >
                            {copiedId === entry.id ? (
                              <Check className="w-4 h-4 mr-1" />
                            ) : (
                              <Copy className="w-4 h-4 mr-1" />
                            )}
                            {copiedId === entry.id ? 'Copied!' : 'Copy Invite'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
