'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Tag,
  Package,
  Check,
  Sparkles,
  X,
  ChevronRight,
  Search,
  Upload,
  DollarSign,
  FileSpreadsheet,
  Zap,
  Loader2,
  ShoppingBag,
  Plug
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@/components/ui';

interface Product {
  id: string;
  name: string;
  sku: string | null;
  description: string | null;
  category: string;
  price: string | null;
  vendor: string | null;
  source: string;
  imageUrl: string | null;
  mappingStatus: string;
  totalRevenue: number;
}

interface ProductStats {
  total: number;
  mapped: number;
  unmapped: number;
}

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats>({ total: 0, mapped: 0, unmapped: 0 });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; total: number } | null>(null);
  const [autoTagging, setAutoTagging] = useState(false);
  const [autoTagResult, setAutoTagResult] = useState<{ tagged: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setStats(data.stats || { total: 0, mapped: 0, unmapped: 0 });
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setImportResult({ imported: result.imported, total: result.total });
        loadProducts();
      } else {
        alert(`Import failed: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to import CSV file');
    } finally {
      setImportLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAutoTagAll = async () => {
    setAutoTagging(true);
    setAutoTagResult(null);

    try {
      const response = await fetch('/api/products/auto-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 50 }),
      });

      const result = await response.json();
      if (response.ok) {
        setAutoTagResult({ tagged: result.tagged, total: result.total });
        loadProducts();
        // Auto-dismiss after 5 seconds
        setTimeout(() => setAutoTagResult(null), 5000);
      } else {
        alert(result.error || 'Auto-tagging failed');
      }
    } catch (error) {
      alert('Failed to auto-tag products');
    } finally {
      setAutoTagging(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.sku?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    // Handle mapped filter - include both 'mapped' and 'confirmed' statuses
    let matchesStatus = false;
    if (filterStatus === 'all') {
      matchesStatus = true;
    } else if (filterStatus === 'mapped') {
      matchesStatus = product.mappingStatus === 'mapped' || product.mappingStatus === 'confirmed';
    } else if (filterStatus === 'unmapped') {
      matchesStatus = product.mappingStatus === 'unmapped' || product.mappingStatus === 'suggested';
    } else {
      matchesStatus = product.mappingStatus === filterStatus;
    }

    return matchesSearch && matchesStatus;
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)]">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#737373]" />
        </div>
      </div>
    );
  }

  // Empty state - no products
  if (products.length === 0) {
    return (
      <div className="flex h-[calc(100vh-64px)]">
        <div className="flex-1">
          <Header
            title="Products"
            description="Manage your product catalog"
          />
          <div className="p-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center max-w-xl mx-auto">
                  <div className="w-20 h-20 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-[#a3a3a3]" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#0a0a0a] mb-3">
                    No products yet
                  </h2>
                  <p className="text-[#737373] mb-8">
                    Import your product catalog to start tracking merchandise performance and mapping IP assets. Connect your Shopify store or upload a CSV file.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/connectors">
                      <Button size="lg">
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        Connect Shopify
                      </Button>
                    </Link>
                    <Button variant="outline" size="lg" onClick={() => setShowImportModal(true)}>
                      <Upload className="w-5 h-5 mr-2" />
                      Import CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Link href="/connectors">
                <Card hover>
                  <CardContent className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                        <Plug className="w-6 h-6 text-[#737373]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#0a0a0a]">Data Connectors</h3>
                        <p className="text-sm text-[#737373]">Connect Shopify to auto-sync products</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Card hover onClick={() => setShowImportModal(true)} className="cursor-pointer">
                <CardContent className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                      <FileSpreadsheet className="w-6 h-6 text-[#737373]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#0a0a0a]">CSV Import</h3>
                      <p className="text-sm text-[#737373]">Upload products from a spreadsheet</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Import Modal */}
          {showImportModal && (
            <ImportModal
              onClose={() => { setShowImportModal(false); setImportResult(null); }}
              onFileSelect={handleFileImport}
              loading={importLoading}
              result={importResult}
              fileInputRef={fileInputRef}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Panel - Product List */}
      <div className="w-1/2 border-r border-[#e5e5e5] flex flex-col">
        <Header
          title="Products"
          description="Manage your product catalog"
        />

        {/* Stats Bar */}
        <div className="p-4 border-b border-[#e5e5e5] bg-[#fafafa]">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#0a0a0a]">{stats.total}</p>
              <p className="text-xs text-[#737373]">Total Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#22c55e]">{stats.mapped}</p>
              <p className="text-xs text-[#737373]">Mapped</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#eab308]">{stats.unmapped}</p>
              <p className="text-xs text-[#737373]">Unmapped</p>
            </div>
          </div>
        </div>

        {/* Auto-Tag Result Toast */}
        {autoTagResult && (
          <div className="absolute top-4 right-4 z-50 p-4 bg-green-50 border border-green-200 shadow-lg">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Auto-tagging complete</p>
                <p className="text-sm text-green-600">Tagged {autoTagResult.tagged} of {autoTagResult.total} products</p>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="p-4 border-b border-[#e5e5e5] flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a]"
          >
            <option value="all">All Status</option>
            <option value="mapped">Mapped</option>
            <option value="unmapped">Unmapped</option>
          </select>
          {stats.unmapped > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={handleAutoTagAll}
              disabled={autoTagging}
            >
              {autoTagging ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-1" />
              )}
              {autoTagging ? 'Tagging...' : `Auto-Tag ${stats.unmapped}`}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileImport}
          />
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-[#a3a3a3]" />
              <p className="font-medium text-[#0a0a0a]">No products found</p>
              <p className="text-sm text-[#737373]">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="divide-y divide-[#e5e5e5]">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id
                      ? 'bg-[#f5f5f5] border-l-2 border-l-[#0a0a0a]'
                      : 'hover:bg-[#fafafa]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-[#e5e5e5] border border-[#d4d4d4] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-[#737373]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-[#0a0a0a] truncate">{product.name}</p>
                        <Badge variant={product.mappingStatus === 'mapped' ? 'success' : 'outline'} className="flex-shrink-0">
                          {product.mappingStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#737373]">
                        {product.sku && <span className="font-mono">{product.sku}</span>}
                        <span>•</span>
                        <span className="capitalize">{product.category}</span>
                        {product.price && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-[#0a0a0a]">${product.price}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#a3a3a3] flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Product Details */}
      <div className="w-1/2 flex flex-col bg-[#fafafa]">
        {selectedProduct ? (
          <ProductDetailPanel product={selectedProduct} onUpdate={loadProducts} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <Tag className="w-12 h-12 mx-auto mb-4 text-[#a3a3a3]" />
              <p className="font-medium text-[#0a0a0a] mb-1">Select a product</p>
              <p className="text-sm text-[#737373] max-w-xs">
                Click on a product from the left panel to view details and manage IP asset mappings.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal
          onClose={() => { setShowImportModal(false); setImportResult(null); }}
          onFileSelect={handleFileImport}
          loading={importLoading}
          result={importResult}
          fileInputRef={fileInputRef}
        />
      )}
    </div>
  );
}

// Types for assets
interface GameIP {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
  assets: Asset[];
}

interface Asset {
  id: string;
  name: string;
  assetType: string;
  imageUrl: string | null;
  gameIp?: { id: string; name: string };
}

interface LinkedAsset extends Asset {
  linkId: string;
  isPrimary: boolean;
}

interface AISuggestion {
  assetId: string;
  assetName: string;
  confidence: number;
  reason: string;
}

// Product Detail Panel
function ProductDetailPanel({ product, onUpdate }: { product: Product; onUpdate: () => void }) {
  const [linkedAssets, setLinkedAssets] = useState<LinkedAsset[]>([]);
  const [availableGameIps, setAvailableGameIps] = useState<GameIP[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [showCreateAsset, setShowCreateAsset] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newGameIpName, setNewGameIpName] = useState('');
  const [selectedGameIp, setSelectedGameIp] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  useEffect(() => {
    loadAssets();
    // Reset AI suggestions when product changes
    setAiSuggestions([]);
    setShowAISuggestions(false);
  }, [product.id]);

  const loadAssets = async () => {
    setLoadingAssets(true);
    try {
      const [linkedRes, availableRes] = await Promise.all([
        fetch(`/api/products/${product.id}/assets`),
        fetch('/api/assets'),
      ]);

      if (linkedRes.ok) {
        const data = await linkedRes.json();
        setLinkedAssets(data.assets || []);
      }

      if (availableRes.ok) {
        const data = await availableRes.json();
        setAvailableGameIps(data.gameIps || []);
      }
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoadingAssets(false);
    }
  };

  const getAISuggestions = async () => {
    // Need at least one game IP with assets to get suggestions
    const allAssets = availableGameIps.flatMap(gip =>
      gip.assets.map(a => ({
        id: a.id,
        name: a.name,
        type: a.assetType,
      }))
    );

    if (allAssets.length === 0) {
      alert('Please create at least one IP asset first before using AI suggestions.');
      return;
    }

    setLoadingAI(true);
    setShowAISuggestions(true);

    try {
      const response = await fetch('/api/ai/tagging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            id: product.id,
            name: product.name,
            description: product.description,
            sku: product.sku,
            category: product.category,
          },
          assets: allAssets,
          gameIp: availableGameIps.length > 0 ? {
            name: availableGameIps[0].name,
          } : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions || []);
      } else {
        console.error('AI tagging failed');
        setAiSuggestions([]);
      }
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      setAiSuggestions([]);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAcceptSuggestion = async (suggestion: AISuggestion) => {
    await handleAddAsset(suggestion.assetId);
    // Remove from suggestions
    setAiSuggestions(prev => prev.filter(s => s.assetId !== suggestion.assetId));
  };

  const handleDismissSuggestion = (assetId: string) => {
    setAiSuggestions(prev => prev.filter(s => s.assetId !== assetId));
  };

  const handleAddAsset = async (assetId: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/products/${product.id}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetIds: [assetId] }),
      });

      if (response.ok) {
        await loadAssets();
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to add asset:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAsset = async (assetId: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/products/${product.id}/assets?assetId=${assetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadAssets();
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to remove asset:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAsset = async () => {
    if (!newAssetName.trim()) return;
    if (!selectedGameIp && !newGameIpName.trim()) return;

    setSaving(true);
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameIpId: selectedGameIp || undefined,
          gameIpName: newGameIpName || undefined,
          assetName: newAssetName,
          assetType: 'character',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Immediately add to product
        await handleAddAsset(data.asset.id);
        setNewAssetName('');
        setNewGameIpName('');
        setSelectedGameIp('');
        setShowCreateAsset(false);
        await loadAssets();
      }
    } catch (error) {
      console.error('Failed to create asset:', error);
    } finally {
      setSaving(false);
    }
  };

  // Get all available assets that aren't already linked
  const linkedAssetIds = new Set(linkedAssets.map(a => a.id));
  const availableAssets = availableGameIps.flatMap(gip =>
    gip.assets.filter(a => !linkedAssetIds.has(a.id)).map(a => ({ ...a, gameIp: { id: gip.id, name: gip.name } }))
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 bg-white border-b border-[#e5e5e5]">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-[#e5e5e5] border border-[#d4d4d4] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-10 h-10 text-[#737373]" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#0a0a0a] mb-1">{product.name}</h2>
            {product.description && (
              <p className="text-sm text-[#737373] mb-2 line-clamp-2">{product.description}</p>
            )}
            <div className="flex items-center gap-3 text-xs">
              {product.sku && <span className="font-mono text-[#737373]">{product.sku}</span>}
              <Badge variant="outline" className="capitalize">{product.category}</Badge>
              <Badge variant={product.mappingStatus === 'confirmed' || linkedAssets.length > 0 ? 'success' : 'outline'}>
                {linkedAssets.length > 0 ? 'mapped' : product.mappingStatus}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Product Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-[#e5e5e5]">
            <p className="text-xs text-[#737373] mb-1">Price</p>
            <p className="text-lg font-semibold text-[#0a0a0a]">
              {product.price ? `$${product.price}` : 'N/A'}
            </p>
          </div>
          <div className="p-4 bg-white border border-[#e5e5e5]">
            <p className="text-xs text-[#737373] mb-1">Vendor</p>
            <p className="text-lg font-semibold text-[#0a0a0a]">
              {product.vendor || 'N/A'}
            </p>
          </div>
          <div className="p-4 bg-white border border-[#e5e5e5]">
            <p className="text-xs text-[#737373] mb-1">Source</p>
            <p className="text-lg font-semibold text-[#0a0a0a] capitalize">
              {product.source || 'CSV Import'}
            </p>
          </div>
          <div className="p-4 bg-white border border-[#e5e5e5]">
            <p className="text-xs text-[#737373] mb-1">Total Revenue</p>
            <p className="text-lg font-semibold text-[#22c55e]">
              ${product.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* IP Asset Mapping */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">IP Asset Mapping</CardTitle>
              <CardDescription>Tag this product with characters/IPs for analytics</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={getAISuggestions}
                disabled={loadingAssets || loadingAI}
              >
                {loadingAI ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-1" />
                )}
                AI Suggest
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAssetPicker(!showAssetPicker)}
                disabled={loadingAssets}
              >
                <Tag className="w-4 h-4 mr-1" />
                Add Tag
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingAssets ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-[#737373]" />
              </div>
            ) : linkedAssets.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-[#e5e5e5] bg-[#fafafa]">
                <Tag className="w-8 h-8 mx-auto mb-3 text-[#a3a3a3]" />
                <p className="text-sm text-[#737373] mb-2">No IP assets tagged</p>
                <p className="text-xs text-[#a3a3a3]">
                  Click &quot;Add Tag&quot; to link this product to a character or IP
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {linkedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-3 bg-white border border-[#e5e5e5] hover:border-[#a3a3a3] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0a0a0a] flex items-center justify-center text-white text-xs font-medium">
                        {asset.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0a0a0a]">{asset.name}</p>
                        <p className="text-xs text-[#737373]">
                          {asset.gameIp?.name} • {asset.assetType}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAsset(asset.id)}
                      disabled={saving}
                      className="p-1 text-[#a3a3a3] hover:text-[#ef4444] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* AI Suggestions */}
            {showAISuggestions && (
              <div className="mt-4 border border-purple-200 bg-purple-50">
                <div className="p-3 border-b border-purple-200 bg-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">AI Suggestions</span>
                  </div>
                  <button
                    onClick={() => setShowAISuggestions(false)}
                    className="text-purple-400 hover:text-purple-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {loadingAI ? (
                  <div className="p-6 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto mb-2" />
                    <p className="text-sm text-purple-700">Analyzing product...</p>
                  </div>
                ) : aiSuggestions.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-purple-700">No matching assets found.</p>
                    <p className="text-xs text-purple-500 mt-1">Try creating more assets or check the product name.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-purple-200">
                    {aiSuggestions.map((suggestion) => (
                      <div key={suggestion.assetId} className="p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 bg-purple-200 flex items-center justify-center text-purple-700 text-xs font-medium flex-shrink-0">
                              {suggestion.assetName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-purple-900">{suggestion.assetName}</p>
                                <span className={`text-xs px-1.5 py-0.5 ${
                                  suggestion.confidence >= 80
                                    ? 'bg-green-100 text-green-700'
                                    : suggestion.confidence >= 60
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {suggestion.confidence}%
                                </span>
                              </div>
                              <p className="text-xs text-purple-600">{suggestion.reason}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleAcceptSuggestion(suggestion)}
                              disabled={saving}
                              className="p-1.5 bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                              title="Accept"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDismissSuggestion(suggestion.assetId)}
                              className="p-1.5 bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                              title="Dismiss"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Asset Picker Dropdown */}
            {showAssetPicker && (
              <div className="mt-4 border border-[#e5e5e5] bg-white">
                <div className="p-3 border-b border-[#e5e5e5] bg-[#fafafa]">
                  <p className="text-sm font-medium text-[#0a0a0a]">Select an asset to tag</p>
                </div>
                {availableAssets.length === 0 && availableGameIps.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-[#737373] mb-3">No IP assets available</p>
                    <Button size="sm" onClick={() => { setShowAssetPicker(false); setShowCreateAsset(true); }}>
                      <Sparkles className="w-4 h-4 mr-1" />
                      Create First Asset
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="max-h-48 overflow-y-auto">
                      {availableAssets.length === 0 ? (
                        <p className="p-3 text-sm text-[#737373]">All assets already tagged</p>
                      ) : (
                        availableAssets.map((asset) => (
                          <button
                            key={asset.id}
                            onClick={() => { handleAddAsset(asset.id); setShowAssetPicker(false); }}
                            disabled={saving}
                            className="w-full flex items-center gap-3 p-3 hover:bg-[#f5f5f5] transition-colors text-left"
                          >
                            <div className="w-6 h-6 bg-[#e5e5e5] flex items-center justify-center text-xs font-medium">
                              {asset.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm text-[#0a0a0a]">{asset.name}</p>
                              <p className="text-xs text-[#737373]">{asset.gameIp?.name}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-[#e5e5e5]">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => { setShowAssetPicker(false); setShowCreateAsset(true); }}
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Create New Asset
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Create Asset Form */}
            {showCreateAsset && (
              <div className="mt-4 p-4 border border-[#e5e5e5] bg-[#fafafa]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-[#0a0a0a]">Create New Asset</p>
                  <button onClick={() => setShowCreateAsset(false)} className="text-[#737373] hover:text-[#0a0a0a]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {availableGameIps.length > 0 ? (
                    <div>
                      <label className="block text-xs text-[#737373] mb-1">Game/IP Franchise</label>
                      <select
                        value={selectedGameIp}
                        onChange={(e) => { setSelectedGameIp(e.target.value); setNewGameIpName(''); }}
                        className="w-full h-9 px-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a]"
                      >
                        <option value="">Select existing or create new...</option>
                        {availableGameIps.map(gip => (
                          <option key={gip.id} value={gip.id}>{gip.name}</option>
                        ))}
                      </select>
                    </div>
                  ) : null}
                  {!selectedGameIp && (
                    <div>
                      <label className="block text-xs text-[#737373] mb-1">
                        {availableGameIps.length > 0 ? 'Or create new Game/IP' : 'Game/IP Franchise Name'}
                      </label>
                      <input
                        type="text"
                        value={newGameIpName}
                        onChange={(e) => setNewGameIpName(e.target.value)}
                        placeholder="e.g., Phantom Warriors"
                        className="w-full h-9 px-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a]"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-[#737373] mb-1">Character/Asset Name</label>
                    <input
                      type="text"
                      value={newAssetName}
                      onChange={(e) => setNewAssetName(e.target.value)}
                      placeholder="e.g., Shadow, Eclipse, Neon"
                      className="w-full h-9 px-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a]"
                    />
                  </div>
                  <Button
                    onClick={handleCreateAsset}
                    disabled={saving || !newAssetName.trim() || (!selectedGameIp && !newGameIpName.trim())}
                    className="w-full"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                    Create & Tag
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Import Modal
function ImportModal({
  onClose,
  onFileSelect,
  loading,
  result,
  fileInputRef,
}: {
  onClose: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  result: { imported: number; total: number } | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 max-w-md w-full mx-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#0a0a0a]">Import Products</h3>
          <button onClick={onClose} className="text-[#737373] hover:text-[#0a0a0a]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Import Complete</span>
              </div>
              <p className="text-sm text-green-700">
                Successfully imported {result.imported} of {result.total} products.
              </p>
            </div>
            <Button className="w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-[#fafafa] border border-[#e5e5e5]">
              <div className="flex items-center gap-3 mb-2">
                <FileSpreadsheet className="w-5 h-5 text-[#737373]" />
                <span className="text-sm font-medium text-[#0a0a0a]">CSV Format</span>
              </div>
              <ul className="text-xs text-[#737373] space-y-1 ml-8">
                <li>Required: <code className="bg-white px-1 border border-[#e5e5e5]">name</code></li>
                <li>Optional: sku, description, category, price, vendor, tags</li>
              </ul>
            </div>
            <div className="border-2 border-dashed border-[#e5e5e5] p-8 text-center hover:border-[#a3a3a3] transition-colors">
              {loading ? (
                <div className="py-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#737373] mx-auto mb-2" />
                  <p className="text-sm text-[#737373]">Importing products...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-[#a3a3a3]" />
                  <p className="text-sm text-[#737373] mb-2">Drop your CSV file here, or</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </Button>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={onFileSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}
