'use client';

import { useState, useRef } from 'react';
import { Plug, Plus, Check, AlertCircle, RefreshCw, Settings, ExternalLink, ShoppingBag, Package, Upload, FileSpreadsheet, Download, X, Loader2 } from 'lucide-react';
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

  // CSV Import state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importType, setImportType] = useState<'products' | 'sales'>('products');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConnect = (connector: typeof availableConnectors[0]) => {
    setSelectedConnector(connector);
    setWizardOpen(true);
  };

  const handleWizardComplete = (config: Record<string, string>) => {
    console.log('Connected with config:', config);
    setWizardOpen(false);
    setSelectedConnector(null);
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
      csvContent += '"Shadow Phantom T-Shirt",SKU-001,ORD-1001,2,59.98,20.00,"United States","Online Store","2024-01-15"\n';
      csvContent += '"Eclipse Mug",SKU-002,ORD-1002,1,14.99,5.00,"United Kingdom","Amazon","2024-01-16"\n';
      csvContent += '"Neon Rider Figure",SKU-003,ORD-1003,3,149.97,60.00,"Germany","Online Store","2024-01-17"';
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
    </div>
  );
}
