'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Package, TrendingUp, Users, Sparkles, ArrowUpRight, Globe, Plug, Upload, ShoppingBag, Loader2, Target, Calendar, BarChart3, LineChart as LineChartIcon, AreaChart, Map, List } from 'lucide-react';
import Link from 'next/link';
import { Header, StatsCard } from '@/components/dashboard';
import { RevenueChart, AssetPerformanceChart, CategoryBreakdown, SalesMap } from '@/components/charts';
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
  orders?: number;
  aov?: number;
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

interface RegionalSalesData {
  region: string;
  revenue: number;
  orderCount: number;
  percentage: number;
}

type DateRange = '7d' | '30d' | '90d' | '12m';
type ChartDataType = 'revenue' | 'orders' | 'aov';
type ChartViewType = 'line' | 'bar' | 'area';
type OrdersViewType = 'table' | 'map';

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '12m', label: 'Last 12 months' },
];

const chartDataOptions: { value: ChartDataType; label: string; icon: React.ReactNode }[] = [
  { value: 'revenue', label: 'Revenue', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
  { value: 'aov', label: 'AOV', icon: <TrendingUp className="w-4 h-4" /> },
];

const chartViewOptions: { value: ChartViewType; label: string; icon: React.ReactNode }[] = [
  { value: 'line', label: 'Line', icon: <LineChartIcon className="w-4 h-4" /> },
  { value: 'bar', label: 'Bar', icon: <BarChart3 className="w-4 h-4" /> },
  { value: 'area', label: 'Area', icon: <AreaChart className="w-4 h-4" /> },
];

export default function OverviewPage() {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [assetData, setAssetData] = useState<AssetData[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [connectorCount, setConnectorCount] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [chartDataType, setChartDataType] = useState<ChartDataType>('revenue');
  const [chartViewType, setChartViewType] = useState<ChartViewType>('line');
  const [ordersViewType, setOrdersViewType] = useState<OrdersViewType>('table');
  const [regionalData, setRegionalData] = useState<RegionalSalesData[]>([]);
  const [regionalTotalRevenue, setRegionalTotalRevenue] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

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
      // Calculate date range
      const now = new Date();
      let startDate: Date;
      switch (dateRange) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '12m':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Load dashboard stats with date range
      const [statsRes, connectorsRes, regionalRes] = await Promise.all([
        fetch(`/api/dashboard/stats?startDate=${startDate.toISOString()}&endDate=${now.toISOString()}`),
        fetch('/api/connectors'),
        fetch('/api/dashboard/regional-sales'),
      ]);

      if (connectorsRes.ok) {
        const connectorsData = await connectorsRes.json();
        setConnectorCount(connectorsData.connectors?.length || 0);
      }

      if (regionalRes.ok) {
        const regionalDataRes = await regionalRes.json();
        setRegionalData(regionalDataRes.regions || []);
        setRegionalTotalRevenue(regionalDataRes.totalRevenue || 0);
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

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div>
        <Header title="Overview" description="Your merchandise command center" />
        <div className="p-6 space-y-6">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="animate-pulse">
                    <div className="h-4 w-24 bg-[#e5e5e5] mb-3"></div>
                    <div className="h-8 w-20 bg-[#f5f5f5] mb-2"></div>
                    <div className="h-3 w-16 bg-[#f5f5f5]"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row Skeleton */}
          <div className="grid grid-cols-3 gap-6">
            {/* Revenue Chart Skeleton */}
            <Card className="col-span-2">
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-5 w-32 bg-[#e5e5e5] mb-2"></div>
                  <div className="h-3 w-48 bg-[#f5f5f5]"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-[#fafafa] animate-pulse flex items-end justify-around gap-2 p-4">
                  {[40, 65, 55, 80, 45, 70, 60, 85, 50, 75, 55, 68].map((height, i) => (
                    <div
                      key={i}
                      className="bg-[#e5e5e5] w-full"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown Skeleton */}
            <Card>
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-5 w-36 bg-[#e5e5e5] mb-2"></div>
                  <div className="h-3 w-40 bg-[#f5f5f5]"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center animate-pulse">
                  <div className="w-32 h-32 bg-[#f5f5f5] rounded-full mb-4"></div>
                  <div className="space-y-2 w-full">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="h-3 w-20 bg-[#e5e5e5]"></div>
                        <div className="h-3 w-12 bg-[#f5f5f5]"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Asset Performance Skeleton */}
          <Card>
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-5 w-40 bg-[#e5e5e5] mb-2"></div>
                <div className="h-3 w-56 bg-[#f5f5f5]"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] bg-[#fafafa] animate-pulse flex items-end justify-around gap-4 p-4">
                {[75, 60, 85, 50, 70, 55].map((height, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="bg-[#e5e5e5] w-full"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="h-3 w-16 bg-[#f5f5f5]"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders Skeleton */}
          <Card>
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-5 w-32 bg-[#e5e5e5] mb-2"></div>
                <div className="h-3 w-44 bg-[#f5f5f5]"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-[#f5f5f5]">
                    <div className="h-4 w-20 bg-[#e5e5e5]"></div>
                    <div className="h-4 w-40 bg-[#f5f5f5] flex-1"></div>
                    <div className="h-4 w-24 bg-[#f5f5f5]"></div>
                    <div className="h-4 w-16 bg-[#e5e5e5]"></div>
                    <div className="h-4 w-20 bg-[#f5f5f5]"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
          <div className="col-span-2 flex flex-col">
            {revenueData.length > 0 ? (
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>
                        {chartDataType === 'revenue' ? 'Revenue Trend' : chartDataType === 'orders' ? 'Orders Trend' : 'Average Order Value'}
                      </CardTitle>
                      <CardDescription>
                        {chartDataType === 'revenue' ? 'Revenue over time' : chartDataType === 'orders' ? 'Order count over time' : 'AOV trend over time'}
                      </CardDescription>
                    </div>
                    {/* Chart Controls */}
                    <div className="flex items-center gap-2">
                      {/* Date Range */}
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value as DateRange)}
                        className="h-8 px-2 text-xs border border-[#e5e5e5] bg-white text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a]"
                      >
                        {dateRangeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {/* Data Type Toggle */}
                      <div className="flex border border-[#e5e5e5]">
                        {chartDataOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setChartDataType(option.value)}
                            className={`h-8 px-2 flex items-center gap-1 text-xs transition-colors ${
                              chartDataType === option.value
                                ? 'bg-[#0a0a0a] text-white'
                                : 'bg-white text-[#737373] hover:bg-[#f5f5f5]'
                            }`}
                            title={option.label}
                          >
                            {option.icon}
                          </button>
                        ))}
                      </div>
                      {/* Chart Type Toggle */}
                      <div className="flex border border-[#e5e5e5]">
                        {chartViewOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setChartViewType(option.value)}
                            className={`h-8 px-2 flex items-center gap-1 text-xs transition-colors ${
                              chartViewType === option.value
                                ? 'bg-[#0a0a0a] text-white'
                                : 'bg-white text-[#737373] hover:bg-[#f5f5f5]'
                            }`}
                            title={option.label}
                          >
                            {option.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <RevenueChart
                    data={revenueData}
                    title=""
                    dataKey={chartDataType === 'revenue' ? 'revenue' : chartDataType === 'orders' ? 'orders' : 'aov'}
                    valuePrefix={chartDataType === 'aov' || chartDataType === 'revenue' ? '$' : ''}
                    chartType={chartViewType}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="h-full w-full flex items-center justify-center bg-[#fafafa] border border-dashed border-[#e5e5e5]">
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
          <div className="flex flex-col">
            {categoryData.length > 0 ? (
              <CategoryBreakdown
                data={categoryData}
                title="Products by Category"
                description="Product distribution across categories"
                valuePrefix=""
              />
            ) : (
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Products by Category</CardTitle>
                  <CardDescription>Product distribution</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="h-full w-full flex items-center justify-center bg-[#fafafa] border border-dashed border-[#e5e5e5]">
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

        {/* Recent Orders / Sales Map */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{ordersViewType === 'table' ? 'Recent Orders' : 'Sales by Region'}</CardTitle>
              <CardDescription>{ordersViewType === 'table' ? 'Latest sales activity' : 'Geographic distribution of revenue'}</CardDescription>
            </div>
            <div className="flex border border-[#e5e5e5]">
              <button
                onClick={() => setOrdersViewType('table')}
                className={`h-8 px-3 flex items-center gap-2 text-xs transition-colors ${
                  ordersViewType === 'table'
                    ? 'bg-[#0a0a0a] text-white'
                    : 'bg-white text-[#737373] hover:bg-[#f5f5f5]'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setOrdersViewType('map')}
                className={`h-8 px-3 flex items-center gap-2 text-xs transition-colors ${
                  ordersViewType === 'map'
                    ? 'bg-[#0a0a0a] text-white'
                    : 'bg-white text-[#737373] hover:bg-[#f5f5f5]'
                }`}
                title="Map View"
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {ordersViewType === 'table' ? (
              recentOrders.length > 0 ? (
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
                    {recentOrders.slice(0, 10).map((order, index) => (
                      <TableRow key={`${order.id}-${index}`}>
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
              )
            ) : (
              regionalData.length > 0 ? (
                <div className="h-[400px]">
                  <SalesMap data={regionalData} totalRevenue={regionalTotalRevenue} />
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center bg-[#fafafa] border border-dashed border-[#e5e5e5]">
                  <div className="text-center">
                    <Globe className="w-12 h-12 text-[#e5e5e5] mx-auto mb-3" />
                    <p className="text-[#737373] font-medium">No regional data yet</p>
                    <p className="text-sm text-[#a3a3a3] mt-1">
                      Sales data with regions will appear here
                    </p>
                  </div>
                </div>
              )
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
          <Link href="/settings">
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#737373]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Team</p>
                    <p className="text-sm text-[#737373]">Manage members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
