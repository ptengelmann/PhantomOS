'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plug, Plus, Check, AlertCircle, RefreshCw, Settings, ExternalLink, ShoppingBag, Package, Upload, FileSpreadsheet, Download, X, Loader2, Clock, Trash2, AlertTriangle, Code } from 'lucide-react';
import { Header, ConnectorWizard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@/components/ui';

interface Connector {
  id: string;
  name: string;
  type: string;
  status: string;
  lastSyncAt: string | null;
  config: { shop?: string };
}

interface ConnectorStats {
  products: number;
  orders: number;
  revenue: number;
}

interface SyncResult {
  success: boolean;
  type: 'products' | 'orders';
  synced: number;
  total?: number;
  errors?: Array<{ product?: string; order?: string; error: string }>;
  skippedProducts?: number;
  unmatchedProducts?: string[];
}

const availableConnectors = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Connect your Shopify store to sync products, orders, and customer data',
    logo: '/logos/shopify.svg',
    bgColor: 'bg-[#96bf48]',
    category: 'E-commerce',
    popular: true,
    available: true,
  },
  {
    id: 'amazon',
    name: 'Amazon Seller',
    description: 'Import sales data from Amazon Seller Central across all marketplaces',
    logo: '/logos/amazon.svg',
    bgColor: 'bg-[#232f3e]',
    category: 'Marketplace',
    popular: true,
    available: false,
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Sync data from your WooCommerce WordPress store',
    logo: '/logos/woocommerce.svg',
    bgColor: 'bg-[#96588a]',
    category: 'E-commerce',
    available: false,
  },
  {
    id: 'bigcommerce',
    name: 'BigCommerce',
    description: 'Connect your BigCommerce store for unified analytics',
    logo: '/logos/bigcommerce.svg',
    bgColor: 'bg-[#121118]',
    category: 'E-commerce',
    available: false,
  },
];

interface ImportResult {
  success: boolean;
  imported: number;
  total: number;
  parseErrors?: Array<{ row: number; error: string }>;
  insertErrors?: Array<{ product?: string; order?: string; error: string }>;
  unmatchedProducts?: string[];
  skippedNoProduct?: number;
}

export default function ConnectorsPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<typeof availableConnectors[0] | null>(null);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [connectorStats, setConnectorStats] = useState<Record<string, ConnectorStats>>({});
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  // CSV Import state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importType, setImportType] = useState<'products' | 'sales'>('products');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Connector Settings Modal
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedConnectorForSettings, setSelectedConnectorForSettings] = useState<Connector | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Sync result state
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);

  // Load connectors from database
  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = async () => {
    try {
      const response = await fetch('/api/connectors');
      if (response.ok) {
        const data = await response.json();
        setConnectors(data.connectors || []);
        // TODO: Load stats for each connector
      }
    } catch (error) {
      console.error('Failed to load connectors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (connector: typeof availableConnectors[0]) => {
    if (!connector.available) return;
    setSelectedConnector(connector);
    setWizardOpen(true);
  };

  const handleWizardComplete = () => {
    setWizardOpen(false);
    setSelectedConnector(null);
    loadConnectors(); // Reload connectors
  };

  const handleOpenSettings = (connector: Connector) => {
    setSelectedConnectorForSettings(connector);
    setSettingsModalOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsModalOpen(false);
    setSelectedConnectorForSettings(null);
  };

  const handleDeleteConnector = async () => {
    if (!selectedConnectorForSettings) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/connectors/${selectedConnectorForSettings.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        handleCloseSettings();
        loadConnectors();
      }
    } catch (error) {
      console.error('Failed to delete connector:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSync = async (connectorId: string, type: string) => {
    setSyncing(connectorId);
    setSyncResult(null);

    try {
      // Sync products first
      const productsRes = await fetch(`/api/connectors/${type}/sync/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectorId }),
      });

      const productsData = await productsRes.json();

      if (!productsRes.ok) {
        setSyncResult({
          success: false,
          message: 'Product sync failed',
          details: productsData.error || 'Unknown error occurred',
        });
        return;
      }

      // Then sync orders
      const ordersRes = await fetch(`/api/connectors/${type}/sync/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectorId }),
      });

      const ordersData = await ordersRes.json();

      if (!ordersRes.ok) {
        setSyncResult({
          success: false,
          message: 'Order sync failed',
          details: ordersData.error || 'Unknown error occurred',
        });
        return;
      }

      // Show success message
      const details = [];
      if (productsData.synced > 0) {
        details.push(`${productsData.synced} products`);
      }
      if (ordersData.synced > 0) {
        details.push(`${ordersData.synced} orders`);
      }

      setSyncResult({
        success: true,
        message: 'Sync completed successfully',
        details: details.length > 0
          ? `Synced ${details.join(' and ')}`
          : 'No new data to sync',
      });

      loadConnectors();
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncResult({
        success: false,
        message: 'Sync failed',
        details: 'Network error or server unavailable',
      });
    } finally {
      setSyncing(null);
      // Auto-dismiss success message after 5 seconds
      setTimeout(() => setSyncResult(null), 5000);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setImportError('Please upload a CSV file');
      return;
    }

    setImporting(true);
    setImportError('');
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = importType === 'products'
        ? '/api/products/import'
        : '/api/sales/import';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setImportError(data.error || 'Import failed');
      } else {
        setImportResult(data);
      }
    } catch (err) {
      setImportError('Failed to upload file. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const downloadTemplate = (type: 'products' | 'sales') => {
    let csvContent = '';
    let filename = '';

    if (type === 'products') {
      csvContent = 'name,sku,description,category,price,vendor,tags\n';
      csvContent += '"Shadow Phantom T-Shirt",SKU-001,"Premium cotton t-shirt featuring Shadow character",apparel,29.99,"MerchCo","character,apparel,shadow"\n';
      csvContent += '"Eclipse Mug",SKU-002,"Ceramic mug with Eclipse logo",home,14.99,"MerchCo","logo,home,eclipse"\n';
      csvContent += '"Neon Rider Figure",SKU-003,"Collectible 6-inch figure",collectibles,49.99,"ToyWorks","figure,collectible,character"';
      filename = 'phantomos-products-template.csv';
    } else {
      csvContent = 'product_name,sku,order_id,quantity,revenue,cost,region,channel,date\n';
      csvContent += '"Shadow Phantom T-Shirt",SKU-001,ORD-1001,2,59.98,20.00,"United States","Online Store","2025-11-15"\n';
      csvContent += '"Eclipse Mug",SKU-002,ORD-1002,1,14.99,5.00,"United Kingdom","Amazon","2025-11-16"\n';
      csvContent += '"Neon Rider Figure",SKU-003,ORD-1003,3,149.97,60.00,"Germany","Online Store","2025-11-17"';
      filename = 'phantomos-sales-template.csv';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetImportModal = () => {
    setImportModalOpen(false);
    setImportResult(null);
    setImportError('');
    setImportType('products');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success"><Check className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'syncing':
        return <Badge variant="warning"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Syncing</Badge>;
      case 'error':
        return <Badge variant="error"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge>Pending</Badge>;
    }
  };

  const formatLastSync = (lastSyncAt: string | null) => {
    if (!lastSyncAt) return 'Never synced';
    const date = new Date(lastSyncAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const getConnectorIcon = (type: string) => {
    const logoMap: Record<string, string> = {
      shopify: '/logos/shopify.svg',
      amazon: '/logos/amazon.svg',
      woocommerce: '/logos/woocommerce.svg',
      bigcommerce: '/logos/bigcommerce.svg',
    };

    if (logoMap[type]) {
      return <Image src={logoMap[type]} alt={type} width={40} height={40} className="object-contain w-full h-full" />;
    }
    return <Plug className="w-6 h-6 text-[#737373]" />;
  };

  const isConnectorConnected = (connectorId: string) => {
    return connectors.some(c => c.type === connectorId);
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <Header
          title="Data Connectors"
          description="Connect your sales channels to aggregate revenue data"
        />
        <div className="p-6 space-y-6">
          {/* Skeleton for aggregation summary */}
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-[#f5f5f5] animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-[#e5e5e5] animate-pulse"></div>
                  <div className="h-6 w-48 bg-[#f5f5f5] animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skeleton for connector cards */}
          <div className="space-y-4">
            <div className="h-5 w-40 bg-[#e5e5e5] animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#f5f5f5] animate-pulse rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 bg-[#e5e5e5] animate-pulse"></div>
                        <div className="h-3 w-full bg-[#f5f5f5] animate-pulse"></div>
                        <div className="h-3 w-3/4 bg-[#f5f5f5] animate-pulse"></div>
                        <div className="h-8 w-20 bg-[#e5e5e5] animate-pulse mt-2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Data Connectors"
        description="Connect your sales channels to aggregate revenue data"
      />

      {/* Wizard Modal */}
      {wizardOpen && selectedConnector && (
        <ConnectorWizard
          connector={{
            id: selectedConnector.id,
            name: selectedConnector.name,
            icon: <Image src={selectedConnector.logo} alt={selectedConnector.name} width={48} height={48} className="object-contain w-12 h-12" />,
          }}
          onClose={() => {
            setWizardOpen(false);
            setSelectedConnector(null);
          }}
          onComplete={handleWizardComplete}
        />
      )}

      {/* Sync Result Toast */}
      {syncResult && (
        <div className={`fixed top-4 right-4 z-50 p-4 shadow-lg border ${
          syncResult.success
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {syncResult.success ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <div>
              <p className={`font-medium ${syncResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {syncResult.message}
              </p>
              {syncResult.details && (
                <p className={`text-sm mt-1 ${syncResult.success ? 'text-green-600' : 'text-red-600'}`}>
                  {syncResult.details}
                </p>
              )}
            </div>
            <button
              onClick={() => setSyncResult(null)}
              className={`ml-2 ${syncResult.success ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
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
                  <p className="text-2xl font-semibold text-[#0a0a0a]">
                    {loading ? '...' : connectors.length === 0 ? 'No sources connected' : `${connectors.length} source${connectors.length > 1 ? 's' : ''} connected`}
                  </p>
                </div>
              </div>
              {connectors.length === 0 && !loading && (
                <p className="text-sm text-[#737373] max-w-xs text-right">
                  Connect a data source or import CSV to get started with real data
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Connected Sources */}
        {connectors.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#0a0a0a]">Connected Sources</h2>
            <div className="grid grid-cols-2 gap-4">
              {connectors.map((connector) => (
                <Card key={connector.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center p-2">
                          {getConnectorIcon(connector.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-[#0a0a0a]">{connector.name}</h3>
                          <p className="text-sm text-[#737373] capitalize">{connector.type}</p>
                        </div>
                      </div>
                      {syncing === connector.id ? (
                        <Badge variant="warning"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Syncing</Badge>
                      ) : (
                        getStatusBadge(connector.status)
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#e5e5e5]">
                      <span className="text-xs text-[#737373]">
                        Last sync: {formatLastSync(connector.lastSyncAt)}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSync(connector.id, connector.type)}
                          disabled={syncing === connector.id}
                        >
                          <RefreshCw className={`w-4 h-4 ${syncing === connector.id ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenSettings(connector)}>
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {connectors.length === 0 && !loading && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                  <Plug className="w-8 h-8 text-[#a3a3a3]" />
                </div>
                <h3 className="font-semibold text-[#0a0a0a] mb-2">No data sources connected</h3>
                <p className="text-sm text-[#737373] mb-6 max-w-md mx-auto">
                  Connect your Shopify store or import a CSV file to start analyzing your merchandise revenue and fan demand signals.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => handleConnect(availableConnectors[0])}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Connect Shopify
                  </Button>
                  <Button variant="outline" onClick={() => setImportModalOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Connectors */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0a0a0a]">Available Connectors</h2>
          <div className="grid grid-cols-2 gap-4">
            {availableConnectors.map((connector) => {
              const isConnected = isConnectorConnected(connector.id);

              return (
                <Card key={connector.id} hover={connector.available && !isConnected}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center flex-shrink-0 p-3 ${!connector.available ? 'opacity-50' : ''}`}>
                        <Image src={connector.logo} alt={connector.name} width={48} height={48} className="object-contain w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${connector.available ? 'text-[#0a0a0a]' : 'text-[#a3a3a3]'}`}>
                            {connector.name}
                          </h3>
                          {connector.popular && connector.available && (
                            <Badge variant="outline">Popular</Badge>
                          )}
                          {!connector.available && (
                            <Badge variant="outline" className="text-[#a3a3a3] border-[#e5e5e5]">
                              <Clock className="w-3 h-3 mr-1" />
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm mb-4 ${connector.available ? 'text-[#737373]' : 'text-[#a3a3a3]'}`}>
                          {connector.description}
                        </p>
                        {connector.available ? (
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
                        ) : (
                          <Button variant="ghost" size="sm" disabled>
                            <Clock className="w-4 h-4 mr-1" />
                            Notify Me
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CSV Import Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0a0a0a]">Manual Import</h2>
          <Card>
            <CardContent className="py-6">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet className="w-6 h-6 text-[#737373]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#0a0a0a] mb-1">CSV Import</h3>
                  <p className="text-sm text-[#737373] mb-4">
                    Upload your product catalog or sales data directly via CSV files. Perfect for getting started quickly or importing data from unsupported platforms.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={() => setImportModalOpen(true)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Import CSV
                    </Button>
                    <Button variant="outline" onClick={() => downloadTemplate('products')}>
                      <Download className="w-4 h-4 mr-2" />
                      Products Template
                    </Button>
                    <Button variant="outline" onClick={() => downloadTemplate('sales')}>
                      <Download className="w-4 h-4 mr-2" />
                      Sales Template
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* More Connectors Coming Soon */}
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-[#737373]" />
              </div>
              <h3 className="font-medium text-[#0a0a0a] mb-1">More Connectors Coming in 2026</h3>
              <p className="text-sm text-[#737373] mb-4 max-w-md mx-auto">
                Amazon Seller Central, WooCommerce, BigCommerce, and custom API integrations are on our roadmap. Use CSV import in the meantime to bring in data from any source.
              </p>
              <div className="flex gap-2 justify-center">
                <Link href="/roadmap">
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Roadmap
                  </Button>
                </Link>
                <Button onClick={() => setImportModalOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CSV Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-lg w-full mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#0a0a0a]">Import CSV</h3>
              <button onClick={resetImportModal} className="text-[#737373] hover:text-[#0a0a0a]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Import Type Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setImportType('products')}
                className={`flex-1 py-2 px-4 text-sm font-medium border transition-colors ${
                  importType === 'products'
                    ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                    : 'bg-white text-[#737373] border-[#e5e5e5] hover:border-[#a3a3a3]'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setImportType('sales')}
                className={`flex-1 py-2 px-4 text-sm font-medium border transition-colors ${
                  importType === 'sales'
                    ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                    : 'bg-white text-[#737373] border-[#e5e5e5] hover:border-[#a3a3a3]'
                }`}
              >
                Sales Data
              </button>
            </div>

            {/* Result Display */}
            {importResult ? (
              <div className="space-y-4">
                <div className={`p-4 border ${importResult.success ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Import Complete</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Successfully imported {importResult.imported} of {importResult.total} {importType}.
                  </p>
                  {importResult.skippedNoProduct && importResult.skippedNoProduct > 0 && (
                    <p className="text-sm text-yellow-700 mt-1">
                      {importResult.skippedNoProduct} sales skipped (product not found)
                    </p>
                  )}
                </div>

                {importResult.unmatchedProducts && importResult.unmatchedProducts.length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-800 mb-2">Unmatched Products:</p>
                    <ul className="text-xs text-yellow-700 space-y-1 max-h-24 overflow-y-auto">
                      {importResult.unmatchedProducts.slice(0, 5).map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                      {importResult.unmatchedProducts.length > 5 && (
                        <li>...and {importResult.unmatchedProducts.length - 5} more</li>
                      )}
                    </ul>
                    <p className="text-xs text-yellow-600 mt-2">
                      Import products first, then re-import sales to match them.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={resetImportModal}>
                    Close
                  </Button>
                  <Button className="flex-1" onClick={() => {
                    setImportResult(null);
                    setImportError('');
                  }}>
                    Import More
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed p-8 text-center transition-colors ${
                    dragOver
                      ? 'border-[#0a0a0a] bg-[#f5f5f5]'
                      : 'border-[#e5e5e5] hover:border-[#a3a3a3]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />

                  {importing ? (
                    <div className="py-4">
                      <Loader2 className="w-8 h-8 animate-spin text-[#737373] mx-auto mb-2" />
                      <p className="text-sm text-[#737373]">Importing {importType}...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-[#a3a3a3] mx-auto mb-2" />
                      <p className="text-sm text-[#737373] mb-1">
                        Drag and drop your CSV file here, or
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-[#0a0a0a] font-medium hover:underline"
                      >
                        browse to upload
                      </button>
                    </>
                  )}
                </div>

                {importError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                    {importError}
                  </div>
                )}

                {/* Template Download */}
                <div className="mt-4 pt-4 border-t border-[#e5e5e5]">
                  <p className="text-xs text-[#737373] mb-2">
                    Need a template? Download our sample CSV:
                  </p>
                  <button
                    onClick={() => downloadTemplate(importType)}
                    className="text-sm text-[#0a0a0a] font-medium hover:underline flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Download {importType === 'products' ? 'Products' : 'Sales'} Template
                  </button>
                </div>

                {/* Column Info */}
                <div className="mt-4 pt-4 border-t border-[#e5e5e5]">
                  <p className="text-xs font-medium text-[#737373] mb-2">Expected columns:</p>
                  {importType === 'products' ? (
                    <p className="text-xs text-[#a3a3a3]">
                      name (required), sku, description, category, price, vendor, tags
                    </p>
                  ) : (
                    <p className="text-xs text-[#a3a3a3]">
                      product_name or sku (to match), quantity, revenue, date (required), cost, region, channel
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Connector Settings Modal */}
      {settingsModalOpen && selectedConnectorForSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#0a0a0a]">Connector Settings</h3>
              <button onClick={handleCloseSettings} className="text-[#737373] hover:text-[#0a0a0a]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Connector Info */}
              <div className="flex items-center gap-4 p-4 bg-[#f5f5f5] border border-[#e5e5e5]">
                <div className="w-16 h-16 bg-white border border-[#e5e5e5] flex items-center justify-center p-2">
                  {getConnectorIcon(selectedConnectorForSettings.type)}
                </div>
                <div>
                  <h4 className="font-medium text-[#0a0a0a]">{selectedConnectorForSettings.name}</h4>
                  <p className="text-sm text-[#737373] capitalize">{selectedConnectorForSettings.type}</p>
                </div>
              </div>

              {/* Connection Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#737373]">Status</span>
                  <span className="capitalize text-[#0a0a0a]">{selectedConnectorForSettings.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#737373]">Last Synced</span>
                  <span className="text-[#0a0a0a]">{formatLastSync(selectedConnectorForSettings.lastSyncAt)}</span>
                </div>
                {selectedConnectorForSettings.config?.shop && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#737373]">Shop URL</span>
                    <span className="text-[#0a0a0a] font-mono text-xs">{selectedConnectorForSettings.config.shop}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#e5e5e5] space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    handleSync(selectedConnectorForSettings.id, selectedConnectorForSettings.type);
                    handleCloseSettings();
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Now
                </Button>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-[#e5e5e5]">
                <div className="p-3 bg-red-50 border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Danger Zone</p>
                      <p className="text-xs text-red-600 mt-1">
                        Disconnecting will remove all synced products and sales data from this source.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 text-red-600 border-red-300 hover:bg-red-50"
                        onClick={handleDeleteConnector}
                        disabled={deleting}
                      >
                        {deleting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        {deleting ? 'Disconnecting...' : 'Disconnect'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
