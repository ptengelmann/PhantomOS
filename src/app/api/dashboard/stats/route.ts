import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, sales, productAssets, ipAssets } from '@/lib/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId } from '@/lib/auth';

export async function GET() {
  try {
    let publisherId: string;

    if (isDemoMode()) {
      publisherId = getDemoPublisherId();
    } else {
      const session = await getServerSession();
      if (!session?.user?.publisherId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      publisherId = session.user.publisherId;
    }

    // Check if we have any data
    const [productCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.publisherId, publisherId));

    const [salesCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(sales)
      .where(eq(sales.publisherId, publisherId));

    const productCount = Number(productCountResult?.count || 0);
    const salesCount = Number(salesCountResult?.count || 0);

    // If no products, return empty state (products count as "having data")
    if (productCount === 0) {
      return NextResponse.json({
        hasData: false,
      });
    }

    // Get current period (last 30 days) revenue and orders
    const [currentPeriodResult] = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(CAST(revenue AS DECIMAL)), 0)`,
        totalOrders: sql<number>`count(*)`,
        totalQuantity: sql<number>`COALESCE(SUM(quantity), 0)`,
      })
      .from(sales)
      .where(sql`${sales.publisherId} = ${publisherId} AND ${sales.orderDate} >= NOW() - INTERVAL '30 days'`);

    // Get previous period (30-60 days ago) for comparison
    const [previousPeriodResult] = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(CAST(revenue AS DECIMAL)), 0)`,
        totalOrders: sql<number>`count(*)`,
        totalQuantity: sql<number>`COALESCE(SUM(quantity), 0)`,
      })
      .from(sales)
      .where(sql`${sales.publisherId} = ${publisherId} AND ${sales.orderDate} >= NOW() - INTERVAL '60 days' AND ${sales.orderDate} < NOW() - INTERVAL '30 days'`);

    // Get all-time totals
    const [allTimeResult] = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(CAST(revenue AS DECIMAL)), 0)`,
        totalOrders: sql<number>`count(*)`,
        totalQuantity: sql<number>`COALESCE(SUM(quantity), 0)`,
      })
      .from(sales)
      .where(eq(sales.publisherId, publisherId));

    const currentRevenue = Number(currentPeriodResult?.totalRevenue || 0);
    const currentOrders = Number(currentPeriodResult?.totalOrders || 0);
    const previousRevenue = Number(previousPeriodResult?.totalRevenue || 0);
    const previousOrders = Number(previousPeriodResult?.totalOrders || 0);

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    };

    const revenueGrowth = calculateGrowth(currentRevenue, previousRevenue);
    const ordersGrowth = calculateGrowth(currentOrders, previousOrders);

    const currentAOV = currentOrders > 0 ? currentRevenue / currentOrders : 0;
    const previousAOV = previousOrders > 0 ? previousRevenue / previousOrders : 0;
    const aovGrowth = calculateGrowth(currentAOV, previousAOV);

    // Use all-time totals for display
    const revenueResult = allTimeResult;

    const totalRevenue = Number(revenueResult?.totalRevenue || 0);
    const totalOrders = Number(revenueResult?.totalOrders || 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get revenue by month (last 12 months)
    const revenueByMonth = await db
      .select({
        month: sql<string>`TO_CHAR(order_date, 'Mon')`,
        revenue: sql<number>`COALESCE(SUM(CAST(revenue AS DECIMAL)), 0)`,
      })
      .from(sales)
      .where(eq(sales.publisherId, publisherId))
      .groupBy(sql`TO_CHAR(order_date, 'Mon'), DATE_TRUNC('month', order_date)`)
      .orderBy(sql`DATE_TRUNC('month', order_date)`)
      .limit(12);

    // Get products by category (shows categories even without sales)
    const productsByCategory = await db
      .select({
        category: products.category,
        productCount: sql<number>`count(*)`,
      })
      .from(products)
      .where(eq(products.publisherId, publisherId))
      .groupBy(products.category);

    // Get revenue by category (if we have sales)
    const revenueByCategory = await db
      .select({
        category: products.category,
        revenue: sql<number>`COALESCE(SUM(CAST(${sales.revenue} AS DECIMAL)), 0)`,
      })
      .from(sales)
      .innerJoin(products, eq(sales.productId, products.id))
      .where(eq(sales.publisherId, publisherId))
      .groupBy(products.category);

    // Merge product counts with revenue (use product counts as primary, add revenue if exists)
    const revenueMap = new Map(revenueByCategory.map(r => [r.category, Number(r.revenue)]));
    const totalProducts = productsByCategory.reduce((sum, cat) => sum + Number(cat.productCount), 0);

    const categoryData = productsByCategory.map(cat => {
      const revenue = revenueMap.get(cat.category) || 0;
      return {
        name: cat.category || 'Other',
        value: Number(cat.productCount),  // Use product count as value
        revenue: revenue,  // Add revenue separately
        percentage: totalProducts > 0 ? Math.round((Number(cat.productCount) / totalProducts) * 100) : 0,
      };
    });

    // Get asset performance data (products mapped to IP assets)
    const assetPerformance = await db
      .select({
        assetId: ipAssets.id,
        assetName: ipAssets.name,
        assetType: ipAssets.assetType,
        productCount: sql<number>`count(DISTINCT ${productAssets.productId})`,
      })
      .from(productAssets)
      .innerJoin(ipAssets, eq(productAssets.assetId, ipAssets.id))
      .innerJoin(products, eq(productAssets.productId, products.id))
      .where(eq(products.publisherId, publisherId))
      .groupBy(ipAssets.id, ipAssets.name, ipAssets.assetType);

    // Get revenue per asset (if we have sales)
    const assetRevenue = await db
      .select({
        assetId: ipAssets.id,
        revenue: sql<number>`COALESCE(SUM(CAST(${sales.revenue} AS DECIMAL)), 0)`,
        units: sql<number>`COALESCE(SUM(${sales.quantity}), 0)`,
      })
      .from(sales)
      .innerJoin(products, eq(sales.productId, products.id))
      .innerJoin(productAssets, eq(products.id, productAssets.productId))
      .innerJoin(ipAssets, eq(productAssets.assetId, ipAssets.id))
      .where(eq(sales.publisherId, publisherId))
      .groupBy(ipAssets.id);

    const assetRevenueMap = new Map(assetRevenue.map(a => [a.assetId, { revenue: Number(a.revenue), units: Number(a.units) }]));

    const assetData = assetPerformance.map(asset => {
      const revenueData = assetRevenueMap.get(asset.assetId) || { revenue: 0, units: 0 };
      return {
        name: asset.assetName,
        type: asset.assetType,
        productCount: Number(asset.productCount),
        revenue: revenueData.revenue,
        units: revenueData.units,
        growth: 0, // Would need historical data to calculate
      };
    });

    // Get recent orders
    const recentSales = await db
      .select({
        id: sales.externalOrderId,
        productName: products.name,
        region: sales.region,
        revenue: sales.revenue,
        orderDate: sales.orderDate,
      })
      .from(sales)
      .innerJoin(products, eq(sales.productId, products.id))
      .where(eq(sales.publisherId, publisherId))
      .orderBy(desc(sales.orderDate))
      .limit(10);

    const recentOrders = recentSales.map(sale => ({
      id: sale.id || 'N/A',
      product: sale.productName,
      region: sale.region || 'Unknown',
      amount: Number(sale.revenue || 0),
      status: 'completed',
      date: sale.orderDate ? new Date(sale.orderDate).toLocaleDateString() : 'N/A',
    }));

    return NextResponse.json({
      hasData: true,
      stats: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        activeCustomers: 0, // Not tracking customers yet
        revenueGrowth,
        ordersGrowth,
        aovGrowth,
        customerGrowth: 0,
        productCount,
        connectedSources: 0,
      },
      revenueData: revenueByMonth.map(r => ({
        date: r.month,
        revenue: Number(r.revenue),
      })),
      categoryData,
      assetData,
      recentOrders,
    });
  } catch (error) {
    console.error('Failed to load dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to load stats' },
      { status: 500 }
    );
  }
}
