'use client';

import { DollarSign, Package, TrendingUp, Users, Sparkles, ArrowUpRight, Globe } from 'lucide-react';
import Link from 'next/link';
import { Header, StatsCard } from '@/components/dashboard';
import { RevenueChart, AssetPerformanceChart, CategoryBreakdown } from '@/components/charts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from '@/components/ui';
import {
  demoRevenueData,
  demoAssets,
  demoCategoryData,
  demoRecentOrders,
  demoSummaryStats,
  demoInsights,
  demoRegionalData,
  demoGameIP
} from '@/lib/demo-data';

export default function OverviewPage() {
  // Transform demo assets for chart
  const assetChartData = demoAssets.map(asset => ({
    name: asset.name,
    revenue: asset.revenue,
    units: asset.units,
    growth: asset.growth,
  }));

  // Transform category data for chart
  const categoryChartData = demoCategoryData.map(cat => ({
    name: cat.name,
    value: cat.value,
    percentage: cat.percentage,
  }));

  // Get high priority insight for highlight
  const topInsight = demoInsights.find(i => i.priority === 'high');

  return (
    <div>
      <Header
        title="Overview"
        description={`${demoGameIP.name} • All connected sources`}
        action={{ label: 'Export Report', onClick: () => console.log('Export') }}
      />

      <div className="p-6 space-y-6">
        {/* AI Insight Alert Banner */}
        {topInsight && (
          <Link href="/intelligence">
            <div className="bg-[#0a0a0a] text-white p-4 flex items-center justify-between cursor-pointer hover:bg-[#262626] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider">AI Insight</span>
                    <Badge variant="success" className="bg-[#22c55e] text-white border-0">
                      +${(topInsight.potentialRevenue / 1000).toFixed(0)}K opportunity
                    </Badge>
                  </div>
                  <p className="font-medium">{topInsight.title}</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </Link>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={`$${(demoSummaryStats.totalRevenue / 1000000).toFixed(2)}M`}
            change={demoSummaryStats.revenueGrowth}
            changePeriod="vs last month"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Orders"
            value={demoSummaryStats.totalOrders.toLocaleString()}
            change={demoSummaryStats.ordersGrowth}
            changePeriod="vs last month"
            icon={<Package className="w-5 h-5" />}
          />
          <StatsCard
            title="Avg Order Value"
            value={`$${demoSummaryStats.avgOrderValue.toFixed(2)}`}
            change={demoSummaryStats.aovGrowth}
            changePeriod="vs last month"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatsCard
            title="Active Customers"
            value={demoSummaryStats.activeCustomers.toLocaleString()}
            change={demoSummaryStats.customerGrowth}
            changePeriod="vs last month"
            icon={<Users className="w-5 h-5" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <RevenueChart data={demoRevenueData} title="Revenue Trend (12 months)" />
          </div>
          <CategoryBreakdown data={categoryChartData} />
        </div>

        {/* Asset Performance & Regional */}
        <div className="grid grid-cols-2 gap-4">
          <AssetPerformanceChart data={assetChartData} title="Asset Performance" description="Revenue by character/IP asset" />

          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>Revenue distribution by market</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoRegionalData.map((region) => (
                  <div key={region.region} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                        <Globe className="w-4 h-4 text-[#737373]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0a0a0a]">{region.region}</p>
                        <p className="text-xs text-[#737373]">Top: {region.topAsset}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#0a0a0a]">${(region.revenue / 1000).toFixed(0)}K</p>
                      <p className={`text-xs ${region.growth > 30 ? 'text-[#22c55e]' : region.growth > 0 ? 'text-[#737373]' : 'text-[#ef4444]'}`}>
                        {region.growth > 0 ? '+' : ''}{region.growth}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders with Live Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Live Activity</CardTitle>
              <CardDescription>Real-time order feed across all channels</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
              <span className="text-xs text-[#737373]">Live</span>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoRecentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{order.product}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.region}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">${order.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'delivered' ? 'success' :
                          order.status === 'shipped' ? 'default' : 'warning'
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#737373] text-xs">{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                    <p className="text-sm text-[#737373]">{demoSummaryStats.aiInsightsCount} new insights</p>
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
                    <Package className="w-5 h-5 text-[#737373]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">Data Sources</p>
                    <p className="text-sm text-[#737373]">{demoSummaryStats.connectedSources} connected</p>
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
                  <p className="text-sm text-[#22c55e] font-medium">{demoSummaryStats.phantomDemandScore}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#737373]" />
                </div>
                <div>
                  <p className="font-medium text-[#0a0a0a]">Products</p>
                  <p className="text-sm text-[#737373]">{demoSummaryStats.productCount} active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
