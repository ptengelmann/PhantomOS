'use client';

import { DollarSign, Package, TrendingUp, Users } from 'lucide-react';
import { Header, StatsCard } from '@/components/dashboard';
import { RevenueChart, AssetPerformanceChart, CategoryBreakdown } from '@/components/charts';
import { Card, CardHeader, CardTitle, CardContent, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';

// Mock data - will be replaced with real data from API
const revenueData = [
  { date: 'Jan', revenue: 45000 },
  { date: 'Feb', revenue: 52000 },
  { date: 'Mar', revenue: 48000 },
  { date: 'Apr', revenue: 61000 },
  { date: 'May', revenue: 55000 },
  { date: 'Jun', revenue: 67000 },
  { date: 'Jul', revenue: 72000 },
  { date: 'Aug', revenue: 78000 },
  { date: 'Sep', revenue: 85000 },
  { date: 'Oct', revenue: 92000 },
  { date: 'Nov', revenue: 105000 },
  { date: 'Dec', revenue: 125000 },
];

const assetData = [
  { name: 'Master Chief', revenue: 285000, units: 12500, growth: 24 },
  { name: 'Kratos', revenue: 215000, units: 9800, growth: 18 },
  { name: 'Geralt', revenue: 178000, units: 7200, growth: 12 },
  { name: 'Link', revenue: 156000, units: 6500, growth: 5 },
  { name: 'Ezio', revenue: 98000, units: 4200, growth: -3 },
];

const categoryData = [
  { name: 'Apparel', value: 425000, percentage: 42 },
  { name: 'Collectibles', value: 285000, percentage: 28 },
  { name: 'Accessories', value: 152000, percentage: 15 },
  { name: 'Home & Living', value: 98000, percentage: 10 },
  { name: 'Digital', value: 52000, percentage: 5 },
];

const recentOrders = [
  { id: 'ORD-001', product: 'Master Chief Statue', customer: 'John D.', amount: 299.99, status: 'delivered' },
  { id: 'ORD-002', product: 'Kratos T-Shirt Bundle', customer: 'Sarah M.', amount: 89.99, status: 'shipped' },
  { id: 'ORD-003', product: 'Geralt Medallion', customer: 'Mike R.', amount: 49.99, status: 'processing' },
  { id: 'ORD-004', product: 'Link Hoodie', customer: 'Emma L.', amount: 79.99, status: 'shipped' },
  { id: 'ORD-005', product: 'Ezio Collector Set', customer: 'David K.', amount: 199.99, status: 'delivered' },
];

export default function OverviewPage() {
  return (
    <div>
      <Header
        title="Overview"
        description="Your gaming commerce performance at a glance"
        action={{ label: 'Add Product', onClick: () => console.log('Add product') }}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value="$1.01M"
            change={23.5}
            changePeriod="vs last month"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Orders"
            value="12,847"
            change={12.3}
            changePeriod="vs last month"
            icon={<Package className="w-5 h-5" />}
          />
          <StatsCard
            title="Conversion Rate"
            value="3.24%"
            change={0.8}
            changePeriod="vs last month"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatsCard
            title="Active Customers"
            value="8,432"
            change={15.2}
            changePeriod="vs last month"
            icon={<Users className="w-5 h-5" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <RevenueChart data={revenueData} title="Revenue Trend" />
          </div>
          <CategoryBreakdown data={categoryData} />
        </div>

        {/* Asset Performance & Recent Orders */}
        <div className="grid grid-cols-2 gap-4">
          <AssetPerformanceChart data={assetData} title="Top Performing Assets" />

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>${order.amount}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
