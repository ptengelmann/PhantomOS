'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DollarSign, Package, TrendingUp, Users, Sparkles, ArrowUpRight, Globe, Plug, Upload, ShoppingBag, Loader2, Target, Calendar, BarChart3, LineChart as LineChartIcon, AreaChart, Map, List, RefreshCw, ChevronDown, Brain, AlertTriangle, TrendingDown, Zap } from 'lucide-react';
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

interface ForecastData {
  entity: { name: string; type?: string };
  historical: { period: string; revenue: number; units: number }[];
  forecast: {
    prediction: number;
    confidence: number;
    factors: string[];
    recommendation: string;
  };
}

interface TrendAlert {
  id: string;
  type: 'surge' | 'drop' | 'opportunity' | 'warning';
  title: string;
  description: string;
  metric: string;
  change: number;
  asset?: string;
}

type DateRange = '7d' | '30d' | '90d' | '12m';
type ChartDataType = 'revenue' | 'orders' | 'aov';
type ChartViewType = 'line' | 'bar' | 'area';
type OrdersViewType = 'table' | 'map';

// Format currency with appropriate suffix (K for thousands, M for millions)
function formatRevenue(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  } else {
    return `$${amount.toFixed(0)}`;
  }
}

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
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [trendAlerts, setTrendAlerts] = useState<TrendAlert[]>([]);

  // Close date dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setShowDateDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setLastUpdated(new Date());
    setRefreshing(false);
  };

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

  // Load demand forecast
  const loadForecast = useCallback(async () => {
    if (forecastLoading) return;
    setForecastLoading(true);
    try {
      const res = await fetch('/api/ai/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // Publisher-wide forecast
      });
      if (res.ok) {
        const data = await res.json();
        setForecastData(data);
      }
    } catch (error) {
      console.error('Failed to load forecast:', error);
    } finally {
      setForecastLoading(false);
    }
  }, [forecastLoading]);

  // Generate trend alerts from asset and revenue data
  useEffect(() => {
    if (!assetData.length || !stats) return;

    const alerts: TrendAlert[] = [];

    // Check for significant asset performance changes
    assetData.forEach((asset, index) => {
      if (asset.growth >= 25) {
        alerts.push({
          id: `surge-${index}`,
          type: 'surge',
          title: `${asset.name} is surging`,
          description: `Revenue up ${asset.growth}% this period`,
          metric: 'Revenue',
          change: asset.growth,
          asset: asset.name,
        });
      } else if (asset.growth <= -20) {
        alerts.push({
          id: `drop-${index}`,
          type: 'drop',
          title: `${asset.name} declining`,
          description: `Revenue down ${Math.abs(asset.growth)}% — consider promotions`,
          metric: 'Revenue',
          change: asset.growth,
          asset: asset.name,
        });
      }
    });

    // Check for overall growth opportunities
    if (stats.revenueGrowth >= 20) {
      alerts.push({
        id: 'opportunity-revenue',
        type: 'opportunity',
        title: 'Strong momentum',
        description: `Overall revenue up ${stats.revenueGrowth}% — capitalize on demand`,
        metric: 'Total Revenue',
        change: stats.revenueGrowth,
      });
    }

    // Check for concerning trends
    if (stats.aovGrowth <= -15) {
      alerts.push({
        id: 'warning-aov',
        type: 'warning',
        title: 'AOV declining',
        description: `Average order value down ${Math.abs(stats.aovGrowth)}% — consider bundles`,
        metric: 'AOV',
        change: stats.aovGrowth,
      });
    }

    setTrendAlerts(alerts.slice(0, 4)); // Max 4 alerts
  }, [assetData, stats]);

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
        {/* Stats Header with Refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-[#0a0a0a]">Key Metrics</h2>
            {lastUpdated && (
              <p className="text-xs text-[#a3a3a3]">
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#737373] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={stats ? formatRevenue(stats.totalRevenue) : '$0'}
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
                      {/* Date Range Dropdown */}
                      <div className="relative" ref={dateDropdownRef}>
                        <button
                          onClick={() => setShowDateDropdown(!showDateDropdown)}
                          className="h-8 px-3 flex items-center gap-2 text-xs border border-[#e5e5e5] bg-white text-[#0a0a0a] hover:bg-[#fafafa] transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#737373]" />
                          <span>{dateRangeOptions.find(o => o.value === dateRange)?.label}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-[#737373] transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showDateDropdown && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#e5e5e5] shadow-lg z-50">
                            {dateRangeOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setDateRange(option.value);
                                  setShowDateDropdown(false);
                                }}
                                className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                                  dateRange === option.value
                                    ? 'bg-[#0a0a0a] text-white'
                                    : 'text-[#0a0a0a] hover:bg-[#f5f5f5]'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
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

        {/* Demand Forecast & Trend Alerts Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Demand Forecast */}
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Demand Forecast
                </CardTitle>
                <CardDescription>AI-powered prediction for next period</CardDescription>
              </div>
              {!forecastData && !forecastLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadForecast}
                  disabled={forecastLoading}
                >
                  {forecastLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate Forecast
                    </>
                  )}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {forecastLoading ? (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-[#0a0a0a] mx-auto mb-3 animate-spin" />
                    <p className="text-[#737373]">Analyzing historical data...</p>
                  </div>
                </div>
              ) : forecastData ? (
                <div className="space-y-6">
                  {/* Prediction Header */}
                  <div className="flex items-start justify-between p-4 bg-[#0a0a0a]">
                    <div>
                      <div className="text-xs text-[#737373] uppercase tracking-wider mb-1">Next Period Prediction</div>
                      <div className="text-3xl font-bold text-white">
                        {forecastData.forecast.prediction.toLocaleString()} units
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#737373] uppercase tracking-wider mb-1">Confidence</div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-[#333] overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-500"
                            style={{ width: `${forecastData.forecast.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-white font-medium">
                          {Math.round(forecastData.forecast.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Factors & Recommendation */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-[#737373] uppercase tracking-wider mb-2">Contributing Factors</div>
                      <div className="space-y-2">
                        {forecastData.forecast.factors.map((factor, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-[#0a0a0a]" />
                            <span className="text-[#525252]">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#737373] uppercase tracking-wider mb-2">AI Recommendation</div>
                      <p className="text-sm text-[#525252] leading-relaxed">
                        {forecastData.forecast.recommendation}
                      </p>
                    </div>
                  </div>

                  {/* Refresh button */}
                  <button
                    onClick={loadForecast}
                    className="text-xs text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors"
                  >
                    ↻ Refresh forecast
                  </button>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center bg-[#fafafa] border border-dashed border-[#e5e5e5]">
                  <div className="text-center">
                    <Brain className="w-12 h-12 text-[#e5e5e5] mx-auto mb-3" />
                    <p className="text-[#737373] font-medium">No forecast generated</p>
                    <p className="text-sm text-[#a3a3a3] mt-1 mb-4">
                      AI will analyze your sales history
                    </p>
                    <Button variant="default" size="sm" onClick={loadForecast}>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate Forecast
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trend Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Trend Alerts
              </CardTitle>
              <CardDescription>Notable changes this period</CardDescription>
            </CardHeader>
            <CardContent>
              {trendAlerts.length > 0 ? (
                <div className="space-y-3">
                  {trendAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 border transition-colors ${
                        alert.type === 'surge' ? 'border-[#22c55e] bg-[#f0fdf4]' :
                        alert.type === 'drop' ? 'border-[#ef4444] bg-[#fef2f2]' :
                        alert.type === 'opportunity' ? 'border-[#0a0a0a] bg-[#fafafa]' :
                        'border-[#f59e0b] bg-[#fffbeb]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                          alert.type === 'surge' ? 'bg-[#22c55e]' :
                          alert.type === 'drop' ? 'bg-[#ef4444]' :
                          alert.type === 'opportunity' ? 'bg-[#0a0a0a]' :
                          'bg-[#f59e0b]'
                        }`}>
                          {alert.type === 'surge' && <TrendingUp className="w-4 h-4 text-white" />}
                          {alert.type === 'drop' && <TrendingDown className="w-4 h-4 text-white" />}
                          {alert.type === 'opportunity' && <Sparkles className="w-4 h-4 text-white" />}
                          {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-sm text-[#0a0a0a] truncate">{alert.title}</p>
                            <span className={`text-xs font-medium ${
                              alert.change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
                            }`}>
                              {alert.change >= 0 ? '+' : ''}{alert.change}%
                            </span>
                          </div>
                          <p className="text-xs text-[#737373] mt-0.5">{alert.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center bg-[#fafafa] border border-dashed border-[#e5e5e5]">
                  <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-[#e5e5e5] mx-auto mb-3" />
                    <p className="text-[#737373] font-medium">No alerts</p>
                    <p className="text-sm text-[#a3a3a3] mt-1">
                      Alerts appear when trends shift
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
