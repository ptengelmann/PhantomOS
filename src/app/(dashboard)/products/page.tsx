'use client';

import { useState, useRef } from 'react';
import {
  Tag,
  Package,
  AlertCircle,
  Check,
  Sparkles,
  X,
  ChevronRight,
  Search,
  Filter,
  Upload,
  DollarSign,
  Clock,
  Brain,
  FileSpreadsheet,
  Zap
} from 'lucide-react';
import { Header, StatsCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, Input } from '@/components/ui';
import {
  demoUnmappedProducts,
  demoAssets,
  demoMappingStats,
  demoGameIP
} from '@/lib/demo-data';

type Product = typeof demoUnmappedProducts[0];

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmedTags, setConfirmedTags] = useState<Record<string, string[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [autoApplyLoading, setAutoApplyLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('publisherId', 'demo-publisher-id');

      const response = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Successfully imported ${result.imported} products!`);
      } else {
        alert(`Import failed: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to import CSV file');
    } finally {
      setImportLoading(false);
      setShowImportModal(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAutoApply = async () => {
    setAutoApplyLoading(true);
    try {
      // Find products with high-confidence AI suggestions
      const highConfidenceProducts = filteredProducts.filter(
        p => p.aiSuggestions.length > 0 && p.aiSuggestions[0].confidence >= 85
      );

      // Auto-confirm these mappings
      for (const product of highConfidenceProducts) {
        const topSuggestion = product.aiSuggestions[0];
        setConfirmedTags(prev => ({
          ...prev,
          [product.id]: [topSuggestion.assetId]
        }));
      }

      alert(`Auto-applied ${highConfidenceProducts.length} high-confidence mappings!`);
    } catch (error) {
      alert('Failed to auto-apply suggestions');
    } finally {
      setAutoApplyLoading(false);
    }
  };

  // Filter products
  const filteredProducts = demoUnmappedProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = filterSource === 'all' || product.source === filterSource;
    const notConfirmed = !confirmedTags[product.id];
    return matchesSearch && matchesSource && notConfirmed;
  });

  const handleConfirmTag = (productId: string, assetIds: string[]) => {
    setConfirmedTags(prev => ({ ...prev, [productId]: assetIds }));
    setSelectedProduct(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-[#22c55e] bg-[#dcfce7]';
    if (confidence >= 70) return 'text-[#eab308] bg-[#fef9c3]';
    return 'text-[#737373] bg-[#f5f5f5]';
  };

  const sources = ['all', ...new Set(demoUnmappedProducts.map(p => p.source))];

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Panel - Product Queue */}
      <div className="w-1/2 border-r border-[#e5e5e5] flex flex-col">
        <Header
          title="Asset Tagging"
          description="Map products to IP assets for accurate analytics"
        />

        {/* Stats Bar */}
        <div className="p-4 border-b border-[#e5e5e5] bg-[#fafafa]">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#0a0a0a]">{demoMappingStats.unmappedProducts}</p>
              <p className="text-xs text-[#737373]">Unmapped</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#22c55e]">{demoMappingStats.mappedProducts}</p>
              <p className="text-xs text-[#737373]">Mapped</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#eab308]">${(demoMappingStats.unmappedRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-[#737373]">Unmapped Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#0a0a0a]">{demoMappingStats.mappingRate}%</p>
              <p className="text-xs text-[#737373]">Coverage</p>
            </div>
          </div>
        </div>

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
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="h-9 px-3 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a]"
          >
            {sources.map(source => (
              <option key={source} value={source}>
                {source === 'all' ? 'All Sources' : source}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoApply}
            disabled={autoApplyLoading || filteredProducts.filter(p => p.aiSuggestions.length > 0 && p.aiSuggestions[0].confidence >= 85).length === 0}
          >
            <Zap className="w-4 h-4 mr-1" />
            {autoApplyLoading ? 'Applying...' : 'Auto-Apply'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
            <Upload className="w-4 h-4 mr-1" />
            Import CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileImport}
          />
        </div>

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 max-w-md w-full mx-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0a0a0a]">Import Products</h3>
                <button onClick={() => setShowImportModal(false)} className="text-[#737373] hover:text-[#0a0a0a]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-[#fafafa] border border-[#e5e5e5]">
                  <div className="flex items-center gap-3 mb-2">
                    <FileSpreadsheet className="w-5 h-5 text-[#737373]" />
                    <span className="text-sm font-medium text-[#0a0a0a]">CSV Format Requirements</span>
                  </div>
                  <ul className="text-xs text-[#737373] space-y-1 ml-8">
                    <li>Required: <code className="bg-white px-1 border border-[#e5e5e5]">name</code> or <code className="bg-white px-1 border border-[#e5e5e5]">title</code></li>
                    <li>Optional: sku, description, category, price, vendor, tags</li>
                    <li>First row must be headers</li>
                  </ul>
                </div>
                <div className="border-2 border-dashed border-[#e5e5e5] p-8 text-center hover:border-[#a3a3a3] transition-colors">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-[#a3a3a3]" />
                  <p className="text-sm text-[#737373] mb-2">Drop your CSV file here, or</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={importLoading}
                  >
                    {importLoading ? 'Importing...' : 'Browse Files'}
                  </Button>
                </div>
                <p className="text-xs text-[#a3a3a3] text-center">
                  Products will be imported with &quot;unmapped&quot; status and queued for AI tagging.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
        <div className="flex-1 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <Check className="w-12 h-12 mx-auto mb-4 text-[#22c55e]" />
              <p className="font-medium text-[#0a0a0a]">All products tagged!</p>
              <p className="text-sm text-[#737373]">Great job - your asset data is now accurate.</p>
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
                    <div className="w-12 h-12 bg-[#e5e5e5] border border-[#d4d4d4] flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-[#737373]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-[#0a0a0a] truncate">{product.name}</p>
                        {product.aiSuggestions.length > 0 && (
                          <Badge variant="outline" className="flex-shrink-0">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#737373]">
                        <span className="font-mono">{product.sku}</span>
                        <span>•</span>
                        <span>{product.source}</span>
                        <span>•</span>
                        <span className="font-medium text-[#0a0a0a]">${product.totalRevenue.toLocaleString()}</span>
                      </div>
                      {product.aiSuggestions.length > 0 && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className="text-xs text-[#737373]">Suggested:</span>
                          {product.aiSuggestions.slice(0, 2).map((suggestion, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-1.5 py-0.5 ${getConfidenceColor(suggestion.confidence)}`}
                            >
                              {suggestion.assetName} ({suggestion.confidence}%)
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#a3a3a3] flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Tagging Interface */}
      <div className="w-1/2 flex flex-col bg-[#fafafa]">
        {selectedProduct ? (
          <ProductTaggingPanel
            product={selectedProduct}
            assets={demoAssets}
            onConfirm={(assetIds) => handleConfirmTag(selectedProduct.id, assetIds)}
            onSkip={() => setSelectedProduct(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <Tag className="w-12 h-12 mx-auto mb-4 text-[#a3a3a3]" />
              <p className="font-medium text-[#0a0a0a] mb-1">Select a product to tag</p>
              <p className="text-sm text-[#737373] max-w-xs">
                Click on a product from the left panel to assign IP assets and unlock accurate analytics.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Tagging Panel Component
function ProductTaggingPanel({
  product,
  assets,
  onConfirm,
  onSkip,
}: {
  product: typeof demoUnmappedProducts[0];
  assets: typeof demoAssets;
  onConfirm: (assetIds: string[]) => void;
  onSkip: () => void;
}) {
  const [selectedAssets, setSelectedAssets] = useState<string[]>(
    product.aiSuggestions.length > 0 && product.aiSuggestions[0].confidence >= 80
      ? [product.aiSuggestions[0].assetId]
      : []
  );

  const toggleAsset = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'border-[#22c55e] bg-[#dcfce7]';
    if (confidence >= 70) return 'border-[#eab308] bg-[#fef9c3]';
    return 'border-[#e5e5e5] bg-[#f5f5f5]';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Product Header */}
      <div className="p-6 bg-white border-b border-[#e5e5e5]">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-[#e5e5e5] border border-[#d4d4d4] flex items-center justify-center flex-shrink-0">
            <Package className="w-8 h-8 text-[#737373]" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#0a0a0a] mb-1">{product.name}</h2>
            <p className="text-sm text-[#737373] mb-2">{product.description}</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="font-mono text-[#737373]">{product.sku}</span>
              <Badge variant="outline">{product.source}</Badge>
              <Badge variant="outline">{product.category}</Badge>
            </div>
          </div>
        </div>

        {/* Revenue Impact */}
        <div className="mt-4 p-3 bg-[#f5f5f5] border border-[#e5e5e5]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#737373]" />
              <span className="text-sm text-[#737373]">Tagging this product will correctly map</span>
            </div>
            <span className="font-semibold text-[#0a0a0a]">${product.totalRevenue.toLocaleString()} in sales</span>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      {product.aiSuggestions.length > 0 && (
        <div className="p-4 bg-white border-b border-[#e5e5e5]">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-[#0a0a0a]" />
            <span className="text-sm font-medium text-[#0a0a0a]">AI Suggestions</span>
          </div>
          <div className="space-y-2">
            {product.aiSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                onClick={() => toggleAsset(suggestion.assetId)}
                className={`p-3 border cursor-pointer transition-all ${
                  selectedAssets.includes(suggestion.assetId)
                    ? 'border-[#0a0a0a] bg-[#0a0a0a]/5'
                    : getConfidenceColor(suggestion.confidence)
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {selectedAssets.includes(suggestion.assetId) ? (
                      <div className="w-5 h-5 bg-[#0a0a0a] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border border-[#d4d4d4]" />
                    )}
                    <span className="font-medium text-[#0a0a0a]">{suggestion.assetName}</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    suggestion.confidence >= 90 ? 'text-[#22c55e]' :
                    suggestion.confidence >= 70 ? 'text-[#eab308]' : 'text-[#737373]'
                  }`}>
                    {suggestion.confidence}% confident
                  </span>
                </div>
                <p className="text-xs text-[#737373] ml-7">{suggestion.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Assets */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm font-medium text-[#0a0a0a] mb-3">All IP Assets</p>
        <div className="grid grid-cols-2 gap-2">
          {assets.map((asset) => {
            const isSelected = selectedAssets.includes(asset.id);
            const isSuggested = product.aiSuggestions.some(s => s.assetId === asset.id);

            return (
              <div
                key={asset.id}
                onClick={() => toggleAsset(asset.id)}
                className={`p-3 border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#0a0a0a] bg-[#0a0a0a]/5'
                    : 'border-[#e5e5e5] hover:border-[#a3a3a3]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <div className="w-5 h-5 bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border border-[#d4d4d4] flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0a0a0a] truncate">{asset.name}</p>
                    <p className="text-xs text-[#737373] capitalize">{asset.type}</p>
                  </div>
                  {isSuggested && (
                    <Sparkles className="w-3 h-3 text-[#eab308] ml-auto flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-white border-t border-[#e5e5e5] flex items-center justify-between">
        <Button variant="ghost" onClick={onSkip}>
          Skip for now
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSelectedAssets([])}
            disabled={selectedAssets.length === 0}
          >
            Clear
          </Button>
          <Button
            onClick={() => onConfirm(selectedAssets)}
            disabled={selectedAssets.length === 0}
          >
            <Check className="w-4 h-4 mr-1" />
            Confirm Tag{selectedAssets.length > 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </div>
  );
}
