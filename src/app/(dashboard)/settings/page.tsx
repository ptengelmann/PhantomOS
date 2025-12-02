'use client';

import { useState, useEffect } from 'react';
import { User, Building, Bell, Shield, CreditCard, Key, X, Copy, Check, UserPlus, Mail, Trash2, Loader2 } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Badge } from '@/components/ui';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organization', label: 'Organization', icon: Building },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'api', label: 'API Keys', icon: Key },
];

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface PendingInvite {
  id: string;
  email: string;
  name?: string;
  role: string;
  expiresAt: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'analyst'>('member');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<{ url: string } | null>(null);
  const [inviteError, setInviteError] = useState('');
  const [copied, setCopied] = useState(false);

  // Team members from database
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  // Load team members from API
  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const response = await fetch('/api/settings/team');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.members || []);
        setPendingInvites(data.pendingInvites || []);
      }
    } catch (error) {
      console.error('Failed to load team:', error);
    } finally {
      setLoadingTeam(false);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      setInviteError('Please enter a valid email address');
      return;
    }

    setInviteLoading(true);
    setInviteError('');
    setInviteSuccess(null);

    try {
      const response = await fetch('/api/settings/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          name: inviteName,
          role: inviteRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setInviteError(data.error || 'Failed to send invitation');
        setInviteLoading(false);
        return;
      }

      setInviteSuccess({ url: data.invitation.inviteUrl });
      // Reload team members to get fresh data
      loadTeamMembers();
    } catch {
      setInviteError('An error occurred. Please try again.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (inviteSuccess?.url) {
      navigator.clipboard.writeText(inviteSuccess.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCloseModal = () => {
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteName('');
    setInviteRole('member');
    setInviteError('');
    setInviteSuccess(null);
  };

  const handleRevokeInvite = (email: string) => {
    setPendingInvites(prev => prev.filter(i => i.email !== email));
  };

  return (
    <div>
      <Header
        title="Settings"
        description="Manage your account and preferences"
      />

      <div className="p-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#f5f5f5] text-[#0a0a0a] font-medium'
                      : 'text-[#737373] hover:text-[#0a0a0a] hover:bg-[#fafafa]'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-2xl">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                        <span className="text-xl font-medium text-[#737373]">PO</span>
                      </div>
                      <Button variant="outline" size="sm">Change Avatar</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="First Name" defaultValue="Pedro" />
                      <Input label="Last Name" defaultValue="Oliveira" />
                    </div>
                    <Input label="Email" type="email" defaultValue="pedro@example.com" />
                    <Input label="Job Title" defaultValue="Head of Licensing" />
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {activeTab === 'organization' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Details</CardTitle>
                    <CardDescription>Manage your publisher profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input label="Organization Name" defaultValue="Phantom Games" />
                    <Input label="Website" defaultValue="https://phantomgames.com" />
                    <div>
                      <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
                        Subscription Plan
                      </label>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Growth</Badge>
                        <Button variant="link" size="sm" className="h-auto p-0">Upgrade Plan</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage who has access to your PhantomOS workspace</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingTeam ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-[#737373]" />
                      </div>
                    ) : teamMembers.length === 0 ? (
                      <div className="text-center py-8">
                        <User className="w-10 h-10 text-[#e5e5e5] mx-auto mb-3" />
                        <p className="text-sm text-[#737373]">No team members yet</p>
                        <p className="text-xs text-[#a3a3a3] mt-1">Invite your first team member to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between py-2 border-b border-[#e5e5e5] last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                                <span className="text-xs font-medium text-[#737373]">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#0a0a0a]">{member.name}</p>
                                <p className="text-xs text-[#737373]">{member.email}</p>
                              </div>
                            </div>
                            <Badge variant={member.role === 'owner' ? 'default' : 'outline'} className="capitalize">{member.role}</Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pending Invites */}
                    {pendingInvites.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-[#e5e5e5]">
                        <p className="text-sm font-medium text-[#0a0a0a] mb-3">Pending Invitations</p>
                        <div className="space-y-2">
                          {pendingInvites.map((invite) => (
                            <div key={invite.email} className="flex items-center justify-between py-2 px-3 bg-[#fafafa] border border-[#e5e5e5]">
                              <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-[#a3a3a3]" />
                                <div>
                                  <p className="text-sm text-[#0a0a0a]">{invite.email}</p>
                                  <p className="text-xs text-[#a3a3a3]">Expires {invite.expiresAt}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{invite.role}</Badge>
                                <button
                                  onClick={() => handleRevokeInvite(invite.email)}
                                  className="p-1 text-[#a3a3a3] hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={() => setShowInviteModal(true)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage API keys for integrations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-[#f5f5f5] border border-[#e5e5e5]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Production Key</span>
                        <Badge variant="success">Active</Badge>
                      </div>
                      <code className="text-sm text-[#737373] font-mono">pk_live_••••••••••••••••</code>
                      <div className="mt-2 flex gap-2">
                        <Button variant="outline" size="sm">Reveal</Button>
                        <Button variant="outline" size="sm">Regenerate</Button>
                      </div>
                    </div>
                    <div className="p-4 bg-[#f5f5f5] border border-[#e5e5e5]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Test Key</span>
                        <Badge>Test Mode</Badge>
                      </div>
                      <code className="text-sm text-[#737373] font-mono">pk_test_••••••••••••••••</code>
                      <div className="mt-2 flex gap-2">
                        <Button variant="outline" size="sm">Reveal</Button>
                        <Button variant="outline" size="sm">Regenerate</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {(activeTab === 'notifications' || activeTab === 'security' || activeTab === 'billing') && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <p className="text-[#737373]">Coming soon</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0a0a0a]">Invite Team Member</h3>
              <button onClick={handleCloseModal} className="text-[#737373] hover:text-[#0a0a0a]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteSuccess ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 text-green-700">
                  <p className="text-sm font-medium mb-1">Invitation Created!</p>
                  <p className="text-xs">Share this link with your team member.</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteSuccess.url}
                    readOnly
                    className="flex-1 h-9 px-3 bg-[#f5f5f5] border border-[#e5e5e5] text-sm font-mono text-[#737373]"
                  />
                  <Button variant="outline" size="sm" onClick={handleCopyLink}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <Button className="w-full" onClick={handleCloseModal}>Done</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {inviteError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                    {inviteError}
                  </div>
                )}

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />

                <Input
                  label="Name (optional)"
                  type="text"
                  placeholder="Their name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-[#0a0a0a] mb-2">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member' | 'analyst')}
                    className="w-full h-9 px-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a]"
                  >
                    <option value="admin">Admin - Full access, can invite others</option>
                    <option value="member">Member - Standard access</option>
                    <option value="analyst">Analyst - View-only access</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={handleCloseModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSendInvite} className="flex-1" loading={inviteLoading}>
                    {inviteLoading ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
