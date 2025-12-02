'use client';

import { useState } from 'react';
import { Plug, Plus, Check, AlertCircle, RefreshCw, Settings, Trash2, ExternalLink, ShoppingBag, Package } from 'lucide-react';
import { Header, ConnectorWizard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@/components/ui';
import { demoConnectors } from '@/lib/demo-data';

const availableConnectors = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Connect your Shopify store to sync products, orders, and customer data',
    icon: <ShoppingBag className="w-6 h-6 text-[#96bf48]" />,
    category: 'E-commerce',
    popular: true,
  },
  {
    id: 'amazon',
    name: 'Amazon Seller',
    description: 'Import sales data from Amazon Seller Central across all marketplaces',
    icon: <Package className="w-6 h-6 text-[#ff9900]" />,
    category: 'Marketplace',
    popular: true,
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Sync data from your WooCommerce WordPress store',
    icon: <ShoppingBag className="w-6 h-6 text-[#7f54b3]" />,
    category: 'E-commerce',
  },
  {
    id: 'bigcommerce',
    name: 'BigCommerce',
    description: 'Connect your BigCommerce store for unified analytics',
    icon: <ShoppingBag className="w-6 h-6 text-[#34313f]" />,
    category: 'E-commerce',
  },
];

export default function ConnectorsPage() {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<typeof availableConnectors[0] | null>(null);

  const handleConnect = (connector: typeof availableConnectors[0]) => {
    setSelectedConnector(connector);
    setWizardOpen(true);
  };

  const handleWizardComplete = (config: Record<string, string>) => {
    console.log('Connected with config:', config);
    setWizardOpen(false);
    setSelectedConnector(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="success"><Check className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'syncing':
        return <Badge variant="warning"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Syncing</Badge>;
      case 'error':
        return <Badge variant="error"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge>Disconnected</Badge>;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'bg-[#22c55e]';
    if (health >= 80) return 'bg-[#eab308]';
    return 'bg-[#ef4444]';
  };

  // Calculate totals from connected sources
  const totalProducts = demoConnectors.reduce((sum, c) => sum + c.products, 0);
  const totalOrders = demoConnectors.reduce((sum, c) => sum + c.orders, 0);
  const totalRevenue = demoConnectors.reduce((sum, c) => sum + c.revenue, 0);

  return (
    <div>
      <Header
        title="Data Connectors"
        description="Connect your sales channels to aggregate revenue data"
        action={{ label: 'Add Source', onClick: () => {} }}
      />

      {/* Wizard Modal */}
      {wizardOpen && selectedConnector && (
        <ConnectorWizard
          connector={{
            id: selectedConnector.id,
            name: selectedConnector.name,
            icon: selectedConnector.icon,
          }}
          onClose={() => {
            setWizardOpen(false);
            setSelectedConnector(null);
          }}
          onComplete={handleWizardComplete}
        />
      )}

      <div className="p-6 space-y-6">
        {/* Aggregation Summary */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-[#0a0a0a] flex items-center justify-center">
                  <Plug className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#737373]">Revenue Aggregation Engine</p>
                  <p className="text-2xl font-semibold text-[#0a0a0a]">{demoConnectors.length} sources connected</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm text-[#737373]">Total Products</p>
                  <p className="text-xl font-semibold text-[#0a0a0a]">{totalProducts.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#737373]">Total Orders</p>
                  <p className="text-xl font-semibold text-[#0a0a0a]">{totalOrders.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#737373]">Aggregated Revenue</p>
                  <p className="text-xl font-semibold text-[#22c55e]">${(totalRevenue / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connected Sources */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0a0a0a]">Connected Sources</h2>
          <div className="grid grid-cols-2 gap-4">
            {demoConnectors.map((source) => (
              <Card key={source.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                        {source.type === 'shopify' && <ShoppingBag className="w-6 h-6 text-[#96bf48]" />}
                        {source.type === 'amazon' && <Package className="w-6 h-6 text-[#ff9900]" />}
                        {source.type === 'woocommerce' && <ShoppingBag className="w-6 h-6 text-[#7f54b3]" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-[#0a0a0a]">{source.name}</h3>
                        <p className="text-sm text-[#737373] capitalize">{source.type}</p>
                      </div>
                    </div>
                    {getStatusBadge(source.status)}
                  </div>

                  {/* Sync Health Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#737373]">Sync Health</span>
                      <span className="text-xs font-medium text-[#0a0a0a]">{source.syncHealth}%</span>
                    </div>
                    <div className="h-1.5 bg-[#e5e5e5]">
                      <div
                        className={`h-full ${getHealthColor(source.syncHealth)} transition-all`}
                        style={{ width: `${source.syncHealth}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-[#737373]">Products</p>
                      <p className="text-lg font-semibold">{source.products}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#737373]">Orders</p>
                      <p className="text-lg font-semibold">{source.orders.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#737373]">Revenue</p>
                      <p className="text-lg font-semibold">${(source.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#e5e5e5]">
                    <span className="text-xs text-[#737373]">Last sync: {source.lastSync}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Available Connectors */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0a0a0a]">Add More Sources</h2>
          <div className="grid grid-cols-2 gap-4">
            {availableConnectors.map((connector) => {
              const isConnected = demoConnectors.some(s => s.type === connector.id);

              return (
                <Card key={connector.id} hover={!isConnected}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                        {connector.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-[#0a0a0a]">{connector.name}</h3>
                          {connector.popular && <Badge variant="outline">Popular</Badge>}
                          <Badge variant="outline">{connector.category}</Badge>
                        </div>
                        <p className="text-sm text-[#737373] mb-4">{connector.description}</p>
                        <Button
                          variant={isConnected ? 'ghost' : 'default'}
                          size="sm"
                          disabled={isConnected}
                          onClick={() => handleConnect(connector)}
                        >
                          {isConnected ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Connected
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1" />
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Custom Integration CTA */}
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-[#737373]" />
              </div>
              <h3 className="font-medium text-[#0a0a0a] mb-1">Need a Custom Integration?</h3>
              <p className="text-sm text-[#737373] mb-4 max-w-md mx-auto">
                Connect any data source using our REST API or contact us for enterprise integrations with your existing systems.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View API Docs
                </Button>
                <Button>Contact Sales</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
