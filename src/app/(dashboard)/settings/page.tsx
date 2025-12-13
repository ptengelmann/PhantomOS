'use client';

import { useState, useEffect, useRef } from 'react';
import { User, Building, Bell, Shield, CreditCard, Key, X, Copy, Check, UserPlus, Mail, Trash2, Loader2, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Badge } from '@/components/ui';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organization', label: 'Organization', icon: Building },
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

interface ProfileData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

interface PublisherData {
  id: string;
  name: string;
  website?: string;
  subscriptionTier?: string;
}

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

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

  // Profile data
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [publisher, setPublisher] = useState<PublisherData | null>(null);

  // Profile form state
  const [profileName, setProfileName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileSaveStatus, setProfileSaveStatus] = useState<SaveStatus>('idle');
  const [profileError, setProfileError] = useState('');

  // Organization form state
  const [orgName, setOrgName] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [orgSaveStatus, setOrgSaveStatus] = useState<SaveStatus>('idle');
  const [orgError, setOrgError] = useState('');

  // Team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile data
  useEffect(() => {
    loadProfile();
    loadTeamMembers();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/settings/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setPublisher(data.publisher);
        // Initialize form values
        setProfileName(data.user?.name || '');
        setProfileAvatar(data.user?.avatar || '');
        setOrgName(data.publisher?.name || '');
        setOrgWebsite(data.publisher?.website || '');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

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

  const handleSaveProfile = async () => {
    setProfileSaveStatus('saving');
    setProfileError('');

    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileName,
          avatar: profileAvatar || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      setProfileSaveStatus('success');
      // Update local profile data
      if (profile) {
        setProfile({ ...profile, name: profileName, avatar: profileAvatar });
      }
      setTimeout(() => setProfileSaveStatus('idle'), 3000);
    } catch (error) {
      setProfileSaveStatus('error');
      setProfileError(error instanceof Error ? error.message : 'Failed to save');
    }
  };

  const handleSaveOrganization = async () => {
    setOrgSaveStatus('saving');
    setOrgError('');

    try {
      const response = await fetch('/api/settings/organization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orgName,
          website: orgWebsite || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save organization');
      }

      setOrgSaveStatus('success');
      // Update local publisher data
      if (publisher) {
        setPublisher({ ...publisher, name: orgName, website: orgWebsite });
      }
      setTimeout(() => setOrgSaveStatus('idle'), 3000);
    } catch (error) {
      setOrgSaveStatus('error');
      setOrgError(error instanceof Error ? error.message : 'Failed to save');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setProfileError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setProfileError('Image must be less than 2MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setProfileAvatar(base64);
    };
    reader.readAsDataURL(file);
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

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      await fetch(`/api/settings/invite/${inviteId}`, { method: 'DELETE' });
      setPendingInvites(prev => prev.filter(i => i.id !== inviteId));
    } catch (error) {
      console.error('Failed to revoke invite:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (profileLoading) {
    return (
      <div>
        <Header title="Settings" description="Manage your account and preferences" />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#737373]" />
        </div>
      </div>
    );
  }

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
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div
                        className="relative w-16 h-16 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center cursor-pointer group overflow-hidden"
                        onClick={handleAvatarClick}
                      >
                        {profileAvatar ? (
                          <img src={profileAvatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-medium text-[#737373]">
                            {getInitials(profileName || 'User')}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" onClick={handleAvatarClick}>
                          Change Avatar
                        </Button>
                        <p className="text-xs text-[#a3a3a3] mt-1">JPG, PNG. Max 2MB.</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Email (read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile?.email || ''}
                        disabled
                        className="w-full h-10 px-3 bg-[#fafafa] border border-[#e5e5e5] text-sm text-[#737373] cursor-not-allowed"
                      />
                      <p className="text-xs text-[#a3a3a3] mt-1">Email cannot be changed</p>
                    </div>

                    {/* Role (read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
                        Role
                      </label>
                      <div className="flex items-center gap-2">
                        <Badge variant={profile?.role === 'owner' ? 'default' : 'outline'} className="capitalize">
                          {profile?.role || 'member'}
                        </Badge>
                      </div>
                    </div>

                    {/* Error/Success messages */}
                    {profileError && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {profileError}
                      </div>
                    )}

                    {profileSaveStatus === 'success' && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        Profile saved successfully
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={profileSaveStatus === 'saving'}
                    >
                      {profileSaveStatus === 'saving' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
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
                    <div>
                      <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={orgWebsite}
                        onChange={(e) => setOrgWebsite(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                        placeholder="https://yourcompany.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0a0a0a] mb-2">
                        Subscription Plan
                      </label>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">
                          {publisher?.subscriptionTier || 'Free'}
                        </Badge>
                        <Button variant="link" size="sm" className="h-auto p-0">Upgrade Plan</Button>
                      </div>
                    </div>

                    {/* Error/Success messages */}
                    {orgError && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {orgError}
                      </div>
                    )}

                    {orgSaveStatus === 'success' && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        Organization saved successfully
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleSaveOrganization}
                      disabled={orgSaveStatus === 'saving' || !['owner', 'admin'].includes(profile?.role || '')}
                    >
                      {orgSaveStatus === 'saving' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    {!['owner', 'admin'].includes(profile?.role || '') && (
                      <p className="text-xs text-[#a3a3a3] ml-4">Only owners and admins can edit organization settings</p>
                    )}
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
                              <div className="w-8 h-8 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center overflow-hidden">
                                {member.avatar ? (
                                  <img src={member.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xs font-medium text-[#737373]">
                                    {getInitials(member.name)}
                                  </span>
                                )}
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
                            <div key={invite.id} className="flex items-center justify-between py-2 px-3 bg-[#fafafa] border border-[#e5e5e5]">
                              <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-[#a3a3a3]" />
                                <div>
                                  <p className="text-sm text-[#0a0a0a]">{invite.email}</p>
                                  <p className="text-xs text-[#a3a3a3]">Expires {invite.expiresAt}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize">{invite.role}</Badge>
                                <button
                                  onClick={() => handleRevokeInvite(invite.id)}
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
                    <Button
                      variant="outline"
                      onClick={() => setShowInviteModal(true)}
                      disabled={!['owner', 'admin'].includes(profile?.role || '')}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                    {!['owner', 'admin'].includes(profile?.role || '') && (
                      <p className="text-xs text-[#a3a3a3] ml-4">Only owners and admins can invite members</p>
                    )}
                  </CardFooter>
                </Card>
              </div>
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

                <div>
                  <label className="block text-sm font-medium text-[#0a0a0a] mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0a0a0a] mb-2">Name (optional)</label>
                  <input
                    type="text"
                    placeholder="Their name"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0a0a0a] mb-2">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member' | 'analyst')}
                    className="w-full h-10 px-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a]"
                  >
                    <option value="admin">Admin - Full access, can invite others</option>
                    <option value="member">Member - Can view and edit data</option>
                    <option value="analyst">Analyst - View-only access</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={handleCloseModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSendInvite} className="flex-1" disabled={inviteLoading}>
                    {inviteLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Invitation'
                    )}
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
