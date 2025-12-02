'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { formatCompactNumber } from '@/lib/utils';

interface CategoryData {
  name: string;
  value: number;
  revenue?: number;
  percentage: number;
}

interface ProductPreview {
  id: string;
  name: string;
  imageUrl: string | null;
  price: number | null;
  sku: string | null;
  revenue: number;
}

interface CategoryBreakdownProps {
  data: CategoryData[];
  title?: string;
  description?: string;
  valuePrefix?: string;
  expandable?: boolean;
}

export function CategoryBreakdown({
  data,
  title = 'Category Breakdown',
  description = 'Revenue distribution by product category',
  valuePrefix = '$',
  expandable = true
}: CategoryBreakdownProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Record<string, {
    products: ProductPreview[];
    total: number;
    loading: boolean;
  }>>({});

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const handleCategoryClick = async (categoryName: string) => {
    if (!expandable) return;

    // Toggle off if already expanded
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
      return;
    }

    setExpandedCategory(categoryName);

    // Check if we already loaded this category
    if (categoryProducts[categoryName]?.products) {
      return;
    }

    // Set loading state
    setCategoryProducts(prev => ({
      ...prev,
      [categoryName]: { products: [], total: 0, loading: true }
    }));

    try {
      const response = await fetch(
        `/api/products/by-category?category=${encodeURIComponent(categoryName.toLowerCase())}&limit=5`
      );

      if (response.ok) {
        const data = await response.json();
        setCategoryProducts(prev => ({
          ...prev,
          [categoryName]: {
            products: data.products,
            total: data.pagination.total,
            loading: false
          }
        }));
      }
    } catch (error) {
      console.error('Failed to load category products:', error);
      setCategoryProducts(prev => ({
        ...prev,
        [categoryName]: { products: [], total: 0, loading: false }
      }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => {
            const isExpanded = expandedCategory === item.name;
            const categoryData = categoryProducts[item.name];

            return (
              <div key={item.name}>
                {/* Category Row */}
                <div
                  className={`${expandable ? 'cursor-pointer hover:bg-[#fafafa] -mx-2 px-2 py-1 rounded transition-colors' : ''}`}
                  onClick={() => handleCategoryClick(item.name)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {expandable && (
                        isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#737373]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#737373]" />
                        )
                      )}
                      <span className="text-sm text-[#0a0a0a] capitalize">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#0a0a0a]">
                        {valuePrefix}{formatCompactNumber(item.value)}
                      </span>
                      <span className="text-xs text-[#737373]">
                        {item.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className={`h-2 bg-[#f5f5f5] border border-[#e5e5e5] ${expandable ? 'ml-6' : ''}`}>
                    <div
                      className="h-full bg-[#0a0a0a] transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        opacity: 1 - (index * 0.15)
                      }}
                    />
                  </div>
                </div>

                {/* Expanded Products List */}
                {isExpanded && (
                  <div className="ml-6 mt-2 mb-3 pl-4 border-l-2 border-[#e5e5e5]">
                    {categoryData?.loading ? (
                      <div className="flex items-center gap-2 py-2 text-sm text-[#737373]">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading products...
                      </div>
                    ) : categoryData?.products?.length > 0 ? (
                      <>
                        <div className="space-y-2">
                          {categoryData.products.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center gap-3 py-1.5"
                            >
                              {/* Product Image */}
                              <div className="w-8 h-8 bg-[#f5f5f5] border border-[#e5e5e5] flex-shrink-0 overflow-hidden">
                                {product.imageUrl ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#a3a3a3] text-xs">
                                    ?
                                  </div>
                                )}
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-[#0a0a0a] truncate">
                                  {product.name}
                                </p>
                                <p className="text-xs text-[#737373]">
                                  {product.price ? `$${product.price.toFixed(2)}` : 'No price'}
                                  {product.revenue > 0 && (
                                    <span className="ml-2 text-[#22c55e]">
                                      ${formatCompactNumber(product.revenue)} revenue
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* View All Link */}
                        {categoryData.total > 5 && (
                          <Link
                            href={`/products?category=${encodeURIComponent(item.name.toLowerCase())}`}
                            className="flex items-center gap-1 mt-2 text-xs text-[#737373] hover:text-[#0a0a0a] transition-colors"
                          >
                            View all {categoryData.total} products
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-[#737373] py-2">
                        No products found
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-[#e5e5e5]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#737373]">Total</span>
            <span className="text-lg font-semibold text-[#0a0a0a]">
              {valuePrefix}{formatCompactNumber(total)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
