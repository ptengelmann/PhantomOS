'use client';

import { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Loader2, Shield, Zap, BarChart3, ExternalLink } from 'lucide-react';
import { Button, Input, Card, CardContent } from '@/components/ui';

interface ConnectorWizardProps {
  connector: {
    id: string;
    name: string;
    icon: React.ReactNode;
  };
  onClose: () => void;
  onComplete: (config: Record<string, string>) => void;
}

const steps = [
  { id: 'intro', title: 'Connect Your Store' },
  { id: 'credentials', title: 'Store Details' },
  { id: 'permissions', title: 'Data Access' },
  { id: 'sync', title: 'Initial Sync' },
];

export function ConnectorWizard({ connector, onClose, onComplete }: ConnectorWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [storeUrl, setStoreUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncComplete, setSyncComplete] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  const isOAuthConnector = connector.id === 'shopify';

  const handleShopifyOAuth = async () => {
    if (!storeUrl) {
      setError('Please enter your store URL');
      return;
    }

    setConnecting(true);
    setError('');

    try {
      const response = await fetch('/api/connectors/shopify/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shop: storeUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to connect to Shopify');
        setConnecting(false);
        return;
      }

      // Redirect to Shopify OAuth
      window.location.href = data.authUrl;
    } catch {
      setError('Failed to connect. Please try again.');
      setConnecting(false);
    }
  };

  const handleNext = () => {
    if (currentStep === steps.length - 2) {
      // Start sync simulation
      setSyncing(true);
      setCurrentStep(currentStep + 1);

      // Simulate sync progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setSyncing(false);
          setSyncComplete(true);
        }
        setSyncProgress(Math.min(progress, 100));
      }, 500);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    onComplete({ storeUrl, apiKey, apiSecret });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1:
        if (isOAuthConnector) {
          return storeUrl.length > 0;
        }
        return storeUrl.length > 0 && apiKey.length > 0;
      case 2: return true;
      case 3: return syncComplete;
      default: return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
              {connector.icon}
            </div>
            <div>
              <h2 className="font-semibold text-[#0a0a0a]">Connect {connector.name}</h2>
              <p className="text-sm text-[#737373]">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f5f5f5] transition-colors">
            <X className="w-5 h-5 text-[#737373]" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex-1">
                <div className={`h-1 transition-colors ${
                  idx <= currentStep ? 'bg-[#0a0a0a]' : 'bg-[#e5e5e5]'
                }`} />
                <p className={`text-xs mt-2 ${
                  idx === currentStep ? 'text-[#0a0a0a] font-medium' : 'text-[#a3a3a3]'
                }`}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 0: Intro */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2">
                  Import your {connector.name} sales data
                </h3>
                <p className="text-[#737373] max-w-md mx-auto">
                  Connect your store to automatically sync products, orders, and revenue data.
                  PhantomOS will analyze your sales to reveal hidden demand signals.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Shield className="w-8 h-8 mx-auto mb-3 text-[#737373]" />
                    <h4 className="font-medium text-[#0a0a0a] mb-1">Secure Connection</h4>
                    <p className="text-xs text-[#737373]">Bank-level encryption for all data transfers</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-3 text-[#737373]" />
                    <h4 className="font-medium text-[#0a0a0a] mb-1">Real-time Sync</h4>
                    <p className="text-xs text-[#737373]">Automatic updates every 15 minutes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-3 text-[#737373]" />
                    <h4 className="font-medium text-[#0a0a0a] mb-1">Instant Insights</h4>
                    <p className="text-xs text-[#737373]">AI analysis begins immediately</p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-[#f5f5f5] border border-[#e5e5e5] p-4">
                <p className="text-sm text-[#737373]">
                  <span className="font-medium text-[#0a0a0a]">What we&apos;ll access:</span> Product catalog, order history, customer regions, and sales metrics.
                  We never access payment details or modify your store data.
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Credentials */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center py-2">
                <h3 className="text-lg font-semibold text-[#0a0a0a] mb-1">
                  {isOAuthConnector ? 'Connect your store' : 'Enter your store details'}
                </h3>
                <p className="text-sm text-[#737373]">
                  {isOAuthConnector
                    ? 'Enter your store URL to begin the secure connection'
                    : `You can find these in your ${connector.name} admin panel`}
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Store URL"
                  placeholder={connector.id === 'shopify' ? 'your-store.myshopify.com' : 'your-store.com'}
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                />

                {!isOAuthConnector && (
                  <>
                    <Input
                      label="API Key"
                      placeholder="Enter your API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <Input
                      label="API Secret (optional)"
                      type="password"
                      placeholder="Enter API secret for enhanced sync"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                    />
                  </>
                )}
              </div>

              {isOAuthConnector && (
                <div className="bg-[#f5f5f5] border border-[#e5e5e5] p-4">
                  <p className="text-sm text-[#737373]">
                    <span className="font-medium text-[#0a0a0a]">Secure OAuth:</span>{' '}
                    You&apos;ll be redirected to {connector.name} to authorize the connection.
                    We never see or store your password.
                  </p>
                </div>
              )}

              {!isOAuthConnector && (
                <div className="bg-[#f5f5f5] border border-[#e5e5e5] p-4">
                  <p className="text-sm text-[#737373]">
                    <span className="font-medium text-[#0a0a0a]">Need help?</span>{' '}
                    <a href="#" className="text-[#0a0a0a] underline">View our step-by-step guide</a> for finding your API credentials.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Permissions */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center py-2">
                <h3 className="text-lg font-semibold text-[#0a0a0a] mb-1">Confirm data access</h3>
                <p className="text-sm text-[#737373]">Review what PhantomOS will sync from your store</p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Products & Variants', desc: 'Names, prices, images, inventory levels', enabled: true },
                  { name: 'Orders & Revenue', desc: 'Order history, revenue, quantities sold', enabled: true },
                  { name: 'Customer Regions', desc: 'Geographic distribution (anonymized)', enabled: true },
                  { name: 'Product Tags', desc: 'Categories, collections, custom tags', enabled: true },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-[#f5f5f5] border border-[#e5e5e5]">
                    <div>
                      <p className="font-medium text-[#0a0a0a]">{item.name}</p>
                      <p className="text-sm text-[#737373]">{item.desc}</p>
                    </div>
                    <div className="w-6 h-6 bg-[#0a0a0a] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#dcfce7] border border-[#bbf7d0]">
                <Shield className="w-5 h-5 text-[#166534] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#166534]">Read-only access</p>
                  <p className="text-sm text-[#166534]/80">PhantomOS will never modify your store data or access payment information.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Sync */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center py-4">
                {!syncComplete ? (
                  <>
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#0a0a0a] animate-spin" />
                    <h3 className="text-lg font-semibold text-[#0a0a0a] mb-1">Syncing your data...</h3>
                    <p className="text-sm text-[#737373]">This usually takes 1-2 minutes</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 mx-auto mb-4 bg-[#0a0a0a] flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#0a0a0a] mb-1">Sync complete!</h3>
                    <p className="text-sm text-[#737373]">Your data is ready for analysis</p>
                  </>
                )}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="h-2 bg-[#e5e5e5]">
                  <div
                    className="h-full bg-[#0a0a0a] transition-all duration-500"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
                <p className="text-sm text-[#737373] text-center">{Math.round(syncProgress)}% complete</p>
              </div>

              {syncComplete && (
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <p className="text-2xl font-semibold text-[#0a0a0a]">156</p>
                      <p className="text-xs text-[#737373]">Products synced</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <p className="text-2xl font-semibold text-[#0a0a0a]">28,450</p>
                      <p className="text-xs text-[#737373]">Orders imported</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 text-center">
                      <p className="text-2xl font-semibold text-[#0a0a0a]">$542K</p>
                      <p className="text-xs text-[#737373]">Revenue tracked</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#e5e5e5] bg-[#fafafa]">
          <Button
            variant="ghost"
            onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : onClose()}
            disabled={syncing || connecting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>

          {syncComplete ? (
            <Button onClick={handleComplete}>
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : isOAuthConnector && currentStep === 1 ? (
            <Button onClick={handleShopifyOAuth} disabled={!canProceed() || connecting}>
              {connecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Connect with {connector.name}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed() || syncing}>
              {syncing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  {currentStep === steps.length - 2 ? 'Start Sync' : 'Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
