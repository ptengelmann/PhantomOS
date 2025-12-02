'use client';

import { useState } from 'react';
import { Plug, Plus, Check, AlertCircle, RefreshCw, Settings, Trash2 } from 'lucide-react';
import { Header } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@/components/ui';

const availableConnectors = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Connect your Shopify store to sync products and orders',
    logo: '/connectors/shopify.svg',
    category: 'E-commerce',
  },
  {
    id: 'amazon',
    name: 'Amazon Seller',
    description: 'Import sales data from Amazon Seller Central',
    logo: '/connectors/amazon.svg',
    category: 'Marketplace',
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Sync data from your WooCommerce WordPress store',
    logo: '/connectors/woocommerce.svg',
    category: 'E-commerce',
  },
  {
    id: 'bigcommerce',
    name: 'BigCommerce',
    description: 'Connect your BigCommerce store',
    logo: '/connectors/bigcommerce.svg',
    category: 'E-commerce',
  },
];

const connectedSources = [
  {
    id: '1',
    connector: 'shopify',
    name: 'Main Store',
    status: 'connected',
    lastSync: '5 minutes ago',
    products: 245,
    orders: 12847,
  },
  {
    id: '2',
    connector: 'amazon',
    name: 'Amazon US',
    status: 'syncing',
    lastSync: 'Syncing...',
    products: 89,
    orders: 5623,
  },
];

export default function ConnectorsPage() {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (connectorId: string) => {
    setConnecting(connectorId);
    // Simulating connection flow
    setTimeout(() => {
      setConnecting(null);
      // In real app, would open OAuth flow or configuration modal
    }, 2000);
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

  return (
    <div>
      <Header
        title="Data Connectors"
        description="Connect your sales channels to aggregate revenue data"
      />

      <div className="p-6 space-y-6">
        {/* Connected Sources */}
        {connectedSources.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#0a0a0a]">Connected Sources</h2>
            <div className="grid grid-cols-2 gap-4">
              {connectedSources.map((source) => (
                <Card key={source.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                          <Plug className="w-6 h-6 text-[#737373]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[#0a0a0a]">{source.name}</h3>
                          <p className="text-sm text-[#737373] capitalize">{source.connector}</p>
                        </div>
                      </div>
                      {getStatusBadge(source.status)}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#e5e5e5]">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-[#737373]">Products</p>
                          <p className="text-lg font-semibold">{source.products}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#737373]">Orders</p>
                          <p className="text-lg font-semibold">{source.orders.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#737373]">Last Sync</p>
                          <p className="text-sm">{source.lastSync}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Sync Now
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-[#ef4444] hover:text-[#ef4444] hover:bg-[#fee2e2]">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Connectors */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0a0a0a]">Available Connectors</h2>
          <div className="grid grid-cols-2 gap-4">
            {availableConnectors.map((connector) => {
              const isConnected = connectedSources.some(s => s.connector === connector.id);
              const isConnecting = connecting === connector.id;

              return (
                <Card key={connector.id} hover={!isConnected}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                        <Plug className="w-6 h-6 text-[#737373]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-[#0a0a0a]">{connector.name}</h3>
                          <Badge variant="outline">{connector.category}</Badge>
                        </div>
                        <p className="text-sm text-[#737373] mb-4">{connector.description}</p>
                        <Button
                          variant={isConnected ? 'ghost' : 'outline'}
                          size="sm"
                          disabled={isConnected || isConnecting}
                          onClick={() => handleConnect(connector.id)}
                        >
                          {isConnecting ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                              Connecting...
                            </>
                          ) : isConnected ? (
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

        {/* Custom Connector */}
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-[#737373]" />
              </div>
              <h3 className="font-medium text-[#0a0a0a] mb-1">Need a Custom Integration?</h3>
              <p className="text-sm text-[#737373] mb-4 max-w-md mx-auto">
                Connect any data source using our REST API or contact us for enterprise integrations.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline">View API Docs</Button>
                <Button>Contact Sales</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
