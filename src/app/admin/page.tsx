'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { Check, X, Copy, CheckCheck, Loader2, Clock, UserCheck, UserX, ArrowUpRight } from 'lucide-react';

interface WaitlistEntry {
  id: string;
  email: string;
  companyName: string | null;
  companyWebsite: string | null;
  revenueRange: string | null;
  primaryChannel: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  inviteToken: string | null;
  createdAt: string;
  approvedAt: string | null;
}

export default function AdminPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, converted: 0 });
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const response = await fetch('/api/waitlist/admin');
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load waitlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (entry: WaitlistEntry) => {
    try {
      const response = await fetch('/api/waitlist/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id }),
      });

      if (response.ok) {
        await loadEntries();
      }
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (entry: WaitlistEntry) => {
    try {
      const response = await fetch('/api/waitlist/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id }),
      });

      if (response.ok) {
        await loadEntries();
      }
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/register/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-[#fafafa] text-[#0a0a0a] border-[#e5e5e5]"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-[#f5f5f5] text-[#0a0a0a] border-[#e5e5e5]"><UserCheck className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-[#fafafa] text-[#737373] border-[#e5e5e5]"><UserX className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-[#0a0a0a] text-white border-[#0a0a0a]"><CheckCheck className="w-3 h-3 mr-1" />Registered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="mb-2">
              <div className="inline-block px-3 py-1 bg-[#f5f5f5] border border-[#e5e5e5] text-xs font-medium text-[#737373] tracking-wide">
                ADMIN
              </div>
            </div>
            <h1 className="text-4xl font-bold text-[#0a0a0a] mb-3 tracking-tight">
              Waitlist <span className="italic font-light">Management</span>
            </h1>
            <p className="text-lg text-[#737373] max-w-2xl">
              Review and approve pilot program applications
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#737373]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative">
        {/* Hero Header */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-2">
            <div className="inline-block px-3 py-1 bg-[#f5f5f5] border border-[#e5e5e5] text-xs font-medium text-[#737373] tracking-wide">
              ADMIN
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#0a0a0a] mb-3 tracking-tight">
            Waitlist <span className="italic font-light">Management</span>
          </h1>
          <p className="text-lg text-[#737373] max-w-2xl">
            Review and approve pilot program applications
          </p>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 pb-24 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-5 gap-4">
            <Card className="border-[#e5e5e5]">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl font-bold text-[#0a0a0a] mb-2 tracking-tight">{stats.total}</div>
                <div className="text-sm text-[#737373] tracking-wide">TOTAL</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e5e5]">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl font-bold text-[#0a0a0a] mb-2 tracking-tight">{stats.pending}</div>
                <div className="text-sm text-[#737373] tracking-wide">PENDING</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e5e5]">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl font-bold text-[#0a0a0a] mb-2 tracking-tight">{stats.approved}</div>
                <div className="text-sm text-[#737373] tracking-wide">APPROVED</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e5e5]">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl font-bold text-[#737373] mb-2 tracking-tight">{stats.rejected}</div>
                <div className="text-sm text-[#737373] tracking-wide">REJECTED</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e5e5]">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl font-bold text-[#0a0a0a] mb-2 tracking-tight">{stats.converted}</div>
                <div className="text-sm text-[#737373] tracking-wide">REGISTERED</div>
              </CardContent>
            </Card>
          </div>

          {/* Applications List */}
          <Card className="border-[#e5e5e5]">
            <CardContent className="p-0">
              {entries.length === 0 ? (
                <div className="py-24 text-center">
                  <div className="text-6xl text-[#f5f5f5] mb-4">—</div>
                  <p className="text-[#737373]">No applications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[#e5e5e5]">
                  {entries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`p-6 hover:bg-[#fafafa] transition-colors ${index === 0 ? 'rounded-t-lg' : ''} ${index === entries.length - 1 ? 'rounded-b-lg' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-6">
                        {/* Left: Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-[#0a0a0a] text-lg">{entry.email}</h3>
                            {getStatusBadge(entry.status)}
                          </div>

                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-3">
                            {entry.companyName && (
                              <div>
                                <div className="text-xs text-[#a3a3a3] mb-1 tracking-wide">COMPANY</div>
                                <div className="text-sm text-[#0a0a0a] flex items-center gap-2">
                                  {entry.companyName}
                                  {entry.companyWebsite && (
                                    <a
                                      href={entry.companyWebsite}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#737373] hover:text-[#0a0a0a] transition-colors"
                                    >
                                      <ArrowUpRight className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                            {entry.revenueRange && (
                              <div>
                                <div className="text-xs text-[#a3a3a3] mb-1 tracking-wide">REVENUE</div>
                                <div className="text-sm text-[#0a0a0a]">{entry.revenueRange.replace(/_/g, ' - ')}</div>
                              </div>
                            )}
                            {entry.primaryChannel && (
                              <div>
                                <div className="text-xs text-[#a3a3a3] mb-1 tracking-wide">CHANNEL</div>
                                <div className="text-sm text-[#0a0a0a] capitalize">{entry.primaryChannel}</div>
                              </div>
                            )}
                            <div>
                              <div className="text-xs text-[#a3a3a3] mb-1 tracking-wide">SUBMITTED</div>
                              <div className="text-sm text-[#0a0a0a]">
                                {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {entry.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(entry)}
                                className="bg-[#0a0a0a] text-white hover:bg-[#262626]"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(entry)}
                                className="border-[#e5e5e5] text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa]"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {entry.status === 'approved' && entry.inviteToken && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyInviteLink(entry.inviteToken!)}
                              className="border-[#e5e5e5] text-[#0a0a0a] hover:bg-[#fafafa]"
                            >
                              {copiedToken === entry.inviteToken ? (
                                <>
                                  <CheckCheck className="w-4 h-4 mr-2" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Invite Link
                                </>
                              )}
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

          {/* Instructions */}
          <div className="border border-[#e5e5e5] bg-[#fafafa] p-6">
            <h3 className="text-sm font-semibold text-[#0a0a0a] mb-3 tracking-wide">MANUAL EMAIL WORKFLOW</h3>
            <p className="text-sm text-[#737373] mb-4 leading-relaxed">
              After approving an entry, click Copy Invite Link and send it to the user via email. The invite link format:
            </p>
            <div className="p-4 bg-white border border-[#e5e5e5] font-mono text-xs text-[#0a0a0a] tracking-tight">
              https://yoursite.com/register/abc123xyz
            </div>
            <p className="text-xs text-[#a3a3a3] mt-4">
              Resend integration coming soon for automated email delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
