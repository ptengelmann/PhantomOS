'use client';

import { useState, useEffect } from 'react';
import { Header, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from '@/components/ui';
import { Check, X, Copy, CheckCheck, Loader2, Clock, UserCheck, UserX } from 'lucide-react';

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

export default function WaitlistAdminPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      // Note: In production, this should be protected by proper auth
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
        await loadEntries(); // Reload the list
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
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><UserCheck className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><UserX className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><CheckCheck className="w-3 h-3 mr-1" />Registered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Waitlist Management" description="Review and approve pilot program applications" />
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#737373]" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Waitlist Management" description="Review and approve pilot program applications" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[#0a0a0a] mb-1">{stats.total}</div>
              <div className="text-sm text-[#737373]">Total Applications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
              <div className="text-sm text-[#737373]">Pending Review</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.approved}</div>
              <div className="text-sm text-[#737373]">Approved</div>
            </CardContent>
          </Card>
        </div>

        {/* Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>Review and manage waitlist entries</CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="py-12 text-center text-[#737373]">
                No waitlist entries yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.email}</TableCell>
                      <TableCell>
                        {entry.companyName || '-'}
                        {entry.companyWebsite && (
                          <a
                            href={entry.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-xs text-[#737373] hover:text-[#0a0a0a]"
                          >
                            ↗
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[#737373]">
                        {entry.revenueRange?.replace(/_/g, ' ') || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-[#737373]">
                        {entry.primaryChannel || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                      <TableCell className="text-sm text-[#737373]">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {entry.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(entry)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(entry)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {entry.status === 'approved' && entry.inviteToken && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyInviteLink(entry.inviteToken!)}
                            >
                              {copiedToken === entry.inviteToken ? (
                                <>
                                  <CheckCheck className="w-4 h-4 mr-1" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-1" />
                                  Copy Invite Link
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Instructions for Manual Email */}
        <Card className="bg-[#fafafa]">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-[#0a0a0a] mb-2">📧 Manual Email Instructions</h3>
            <p className="text-sm text-[#737373] mb-4">
              After approving an entry, click "Copy Invite Link" and send it to the user via email. The invite link will look like:
            </p>
            <div className="p-3 bg-white border border-[#e5e5e5] font-mono text-sm text-[#0a0a0a]">
              https://yoursite.com/register/abc123xyz
            </div>
            <p className="text-xs text-[#a3a3a3] mt-4">
              Later, we'll integrate Resend to automate this process.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
