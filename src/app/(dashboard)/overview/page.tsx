'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Package, TrendingUp, Users, Sparkles, ArrowUpRight, Globe, Plug, Upload, ShoppingBag, Loader2, Target } from 'lucide-react';
import Link from 'next/link';
import { Header, StatsCard } from '@/components/dashboard';
import { RevenueChart, AssetPerformanceChart, CategoryBreakdown } from '@/components/charts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from '@/components/ui';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  activeCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  aovGrowth: number;
  customerGrowth: number;
  productCount: number;
  connectedSources: number;
}

interface RevenueDataPoint {
  date: string;
  revenue: number;
}

interface CategoryData {
  name: string;
  value: number;
  revenue?: number;
  percentage: number;
}

interface AssetData {
  name: string;
  type: string;
  productCount: number;
  revenue: number;
  units: number;
  growth: number;
}

interface RecentOrder {
  id: string;
  product: string;
  region: string;
  amount: number;
  status: string;
  date: string;
}

export default function OverviewPage() {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [assetData, setAssetData] = useState<AssetData[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [connectorCount, setConnectorCount] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleExportReport = () => {
    if (!stats || !categoryData) return;

    // Generate CSV content
    let csv = 'PhantomOS Dashboard Report\n';
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Summary Stats
    csv += 'SUMMARY STATS\n';
    csv += `Total Revenue,$${stats.totalRevenue.toFixed(2)}\n`;
    csv += `Total Orders,${stats.totalOrders}\n`;
    csv += `Average Order Value,$${stats.avgOrderValue.toFixed(2)}\n`;
    csv += `Product Count,${stats.productCount}\n`;
    csv += `Revenue Growth,${stats.revenueGrowth}%\n`;
    csv += `Orders Growth,${stats.ordersGrowth}%\n\n`;

    // Category Breakdown
    csv += 'CATEGORY BREAKDOWN\n';
    csv += 'Category,Product Count,Percentage\n';
    categoryData.forEach(cat => {
      csv += `${cat.name},${cat.value},${cat.percentage}%\n`;
    });
    csv += '\n';

    // Asset Performance
    if (assetData.length > 0) {
      csv += 'ASSET PERFORMANCE\n';
      csv += 'Asset,Revenue,Units,Growth\n';
      assetData.forEach(asset => {
        csv += `${asset.name},$${asset.revenue},${asset.units},${asset.growth}%\n`;
      });
      csv += '\n';
    }

    // Recent Orders
    if (recentOrders.length > 0) {
      csv += 'RECENT ORDERS\n';
      csv += 'Order ID,Product,Region,Amount,Date\n';
      recentOrders.forEach(order => {
        csv += `${order.id},"${order.product}",${order.region},$${order.amount},${order.date}\n`;
      });
    }

    // Download the CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `phantomos-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadDashboardData = async () => {
    try {
      // Load dashboard stats
      const [statsRes, connectorsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/connectors'),
      ]);

      if (connectorsRes.ok) {
        const connectorsData = await connectorsRes.json();
        setConnectorCount(connectorsData.connectors?.length || 0);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.hasData) {
          setHasData(true);
          setStats(data.stats);
          setRevenueData(data.revenueData || []);
          setCategoryData(data.categoryData || []);
          setAssetData(data.assetData || []);
          setRecentOrders(data.recentOrders || []);
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <Header title="Overview" description="Loading..." />
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#737373]" />
        </div>
      </div>
    );
  }

  // Empty state - no data connected
  if (!hasData) {
    return (
      <div>
        <Header title="Overview" description="Welcome to PhantomOS" />
        <div className="p-6 space-y-6">
          {/* Welcome Card */}
          <Card>
            <CardContent className="py-12">
              <div className="text-center max-w-xl mx-auto">
                <div className="w-20 h-20 bg-[#0a0a0a] flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-[#0a0a0a] mb-3">
                  Welcome to PhantomOS
                </h2>
                <p className="text-[#737373] mb-8">
                  Connect your sales data to unlock AI-powered insights about your merchandise revenue and fan demand signals. Start by connecting your Shopify store or importing a CSV file.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/connectors">
                    <Button size="lg">
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Connect Shopify
                    </Button>
                  </Link>
                  <Link href="/connectors">
                    <Button variant="outline" size="lg">
                      <Upload className="w-5 h-5 mr-2" />
                      Import CSV
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started Steps */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0a0a0a] text-white flex items-center justify-center font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0a0a0a] mb-1">Connect Your Data</h3>
                    <p className="text-sm text-[#737373]">
                      Link your Shopify store or upload a CSV file with your product and sales data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] text-[#737373] flex items-center justify-center font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0a0a0a] mb-1">Map Your IPs</h3>
                    <p className="text-sm text-[#737373]">
                      Tag products with character names and IP assets to enable demand analysis.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] text-[#737373] flex items-center justify-center font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0a0a0a] mb-1">Get AI Insights</h3>
                    <p className="text-sm text-[#737373]">
                      Our AI analyzes your data to reveal hidden demand signals and revenue opportunities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Dashboard Preview */}
          <Card>
            <CardHeader>
              <CardTitle>What You&apos;ll See</CardTitle>
              <CardDescription>Preview of your analytics dashboard with real data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 opacity-50">
                <div className="p-4 bg-[#f5f5f5] border border-[#e5e5e5]">
                  <p className="text-xs text-[#737373] mb-1">Total Revenue</p>
                  <p className="text-xl font-semibold text-[#a3a3a3]">$---.--</p>
                </div>
                <div className="p-4 bg-[#f5f5f5] border border-[#e5e5e5]">
                  <p className="text-xs text-[#737373] mb-1">Total Orders</p>
                  <p className="text-xl font-semibold text-[#a3a3a3]">---</p>
                </div>
                <div className="p-4 bg-[#f5f5f5] border border-[#e5e5e5]">
                  <p className="text-xs text-[#737373] mb-1">Avg Order Value</p>
                  <p className="text-xl font-semibold text-[#a3a3a3]">$--.--</p>
                </div>
                <div className="p-4 bg-[#f5f5f5] border border-[#e5e5e5]">
                  <p className="text-xs text-[#737373] mb-1">Products</p>
                  <p className="text-xl font-semibold text-[#a3a3a3]">---</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/connectors">
              <Card hover>
                <CardContent className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                      <Plug className="w-6 h-6 text-[#737373]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#0a0a0a]">Data Connectors</h3>
                      <p className="text-sm text-[#737373]">
                        {connectorCount > 0 ? `${connectorCount} connected` : 'Connect your first data source'}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-[#737373] ml-auto" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/products">
              <Card hover>
                <CardContent className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                      <Package className="w-6 h-6 text-[#737373]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#0a0a0a]">Products</h3>
                      <p className="text-sm text-[#737373]">View and manage your product catalog</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-[#737373] ml-auto" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard with real data
  return (
    <div>
      <Header
        title="Overview"
        description="All connected sources"
        action={{ label: 'Export Report', onClick: handleExportReport }}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={stats ? `$${(stats.totalRevenue / 1000000).toFixed(2)}M` : '$0'}
            change={stats?.revenueGrowth || 0}
            changePeriod="vs last month"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Orders"
            value={stats?.totalOrders.toLocaleString() || '0'}
            change={stats?.ordersGrowth || 0}
            changePeriod="vs last month"
            icon={<Package className="w-5 h-5" />}
          />
          <StatsCard
            title="Avg Order Value"
            value={stats ? `$${stats.avgOrderValue.toFixed(2)}` : '$0'}
            change={stats?.aovGrowth || 0}
            changePeriod="vs last month"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatsCard
            title="Products"
            value={stats?.productCount.toLocaleString() || '0'}
            change={0}
            changePeriod="total"
            icon={<Users className="w-5 h-5" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            {revenueData.length > 0 ? (
              <RevenueChart data={revenueData} title="Revenue Trend" />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-[#fafafa] border border-dashed border-[#e5e5e5]">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-[#e5e5e5] mx-auto mb-3" />
                      <p className="text-[#737373] font-medium">No sales data yet</p>
                      <p className="text-sm text-[#a3a3a3] mt-1">
                        Charts will appear when you have orders
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          {categoryData.length > 0 ? (
            <CategoryBreakdown
              data={categoryData}
              title="Products by Category"
              description="Product distribution across categories"
              valuePrefix=""
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Products by Category</CardTitle>
                <CardDescription>Product distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-[#fafafa] border border-dashed border-[#e5e5e5]">
                  <div className="text-center">
                    <Package className="w-12 h-12 text-[#e5e5e5] mx-auto mb-3" />
                    <p className="text-[#737373] font-medium">No products yet</p>
                    <p className="text-sm text-[#a3a3a3] mt-1">
                      Connect data source to see products
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Asset Performance */}
        {assetData.length > 0 ? (
          <AssetPerformanceChart
            data={assetData.map(a => ({
              name: a.name,
              revenue: a.revenue,
              units: a.units,
              growth: a.growth,
            }))}
            title="Asset Performance"
            description="Revenue by character/IP asset"
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Asset Performance</CardTitle>
              <CardDescription>Revenue by character/IP asset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] flex items-center justify-center bg-[#fafafa] border border-dashed border-[#e5e5e5]">
                <div className="text-center">
                  <Target className="w-12 h-12 text-[#e5e5e5] mx-auto mb-3" />
                  <p className="text-[#737373] font-medium">No assets tagged yet</p>
                  <p className="text-sm text-[#a3a3a3] mt-1">
                    Tag products with IP assets in Asset Tagging
                  </p>
                  <Link href="/products">
                    <Button variant="outline" size="sm" className="mt-4">
                      Go to Asset Tagging
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest sales activity</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.slice(0, 10).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.product}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.region}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">${order.amount}</TableCell>
                      <TableCell className="text-[#737373] text-xs">{order.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center">
                <ShoppingBag className="w-12 h-12 text-[#e5e5e5] mx-auto mb-3" />
                <p className="text-[#737373] font-medium">No orders yet</p>
                <p className="text-sm text-[#a3a3a3] mt-1">
                  Orders will appear here when sales come in
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          <Link href="/intelligence">
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0a0a0a] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">AI Insights</p>
                    <p className="text-sm text-[#737373]">View recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/connectors">
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                    <Plug className="w-5 h-5 text-[#737373]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Data Sources</p>
                    <p className="text-sm text-[#737373]">{connectorCount} connected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/products">
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#737373]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Products</p>
                    <p className="text-sm text-[#737373]">{stats?.productCount || 0} total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#737373]" />
                </div>
                <div>
                  <p className="font-medium text-[#0a0a0a]">Demand Score</p>
                  <p className="text-sm text-[#22c55e] font-medium">Coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
