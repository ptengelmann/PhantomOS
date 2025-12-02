'use client';

import { useState } from 'react';
import { User, Building, Bell, Shield, CreditCard, Key } from 'lucide-react';
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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

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
                    <div className="space-y-3">
                      {[
                        { name: 'Pedro Oliveira', email: 'pedro@example.com', role: 'Owner' },
                        { name: 'Sarah Chen', email: 'sarah@example.com', role: 'Admin' },
                        { name: 'Mike Johnson', email: 'mike@example.com', role: 'Member' },
                      ].map((member) => (
                        <div key={member.email} className="flex items-center justify-between py-2 border-b border-[#e5e5e5] last:border-0">
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
                          <Badge variant={member.role === 'Owner' ? 'default' : 'outline'}>{member.role}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Invite Member</Button>
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
    </div>
  );
}
