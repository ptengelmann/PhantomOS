/**
 * Analytics Generation Script for PhantomOS
 *
 * Generates analytics snapshots and AI insights from existing sales data.
 * This script should be run:
 * - Initially to populate historical data
 * - Periodically (via cron) to generate new snapshots
 *
 * Usage:
 *   npx tsx scripts/generate-analytics.ts
 *
 * Options:
 *   --publisher-id <id>  Generate for specific publisher (default: all)
 *   --period <daily|weekly|monthly>  Generate specific period (default: all)
 *   --insights           Also generate AI insights
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import {
  publishers,
  sales,
  products,
  ipAssets,
  productAssets,
  analyticsSnapshots,
  aiInsights,
  gameIps,
} from '../src/lib/db/schema';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlClient);

// Types
interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalUnits: number;
  avgOrderValue: number;
  topProducts: Array<{ id: string; name: string; revenue: number }>;
  topAssets: Array<{ id: string; name: string; revenue: number }>;
  categoryBreakdown: Record<string, { revenue: number; units: number }>;
  regionBreakdown: Record<string, { revenue: number; orders: number }>;
  growthRate?: number;
}

// Helper functions
function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

// Calculate metrics for a date range
async function calculateMetrics(
  publisherId: string,
  startDate: Date,
  endDate: Date,
  previousStartDate?: Date,
  previousEndDate?: Date
): Promise<SalesMetrics> {
  // Get sales in range
  const salesData = await db
    .select({
      id: sales.id,
      productId: sales.productId,
      revenue: sales.revenue,
      quantity: sales.quantity,
      region: sales.region,
      orderDate: sales.orderDate,
    })
    .from(sales)
    .where(
      and(
        eq(sales.publisherId, publisherId),
        gte(sales.orderDate, startDate),
        lte(sales.orderDate, endDate)
      )
    );

  // Calculate basic metrics
  const totalRevenue = salesData.reduce((sum, s) => sum + parseFloat(s.revenue || '0'), 0);
  const totalUnits = salesData.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const totalOrders = salesData.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Get product details for top products
  const productRevenue = new Map<string, { name: string; revenue: number }>();
  for (const sale of salesData) {
    if (!sale.productId) continue;
    const existing = productRevenue.get(sale.productId);
    if (existing) {
      existing.revenue += parseFloat(sale.revenue || '0');
    } else {
      productRevenue.set(sale.productId, { name: '', revenue: parseFloat(sale.revenue || '0') });
    }
  }

  // Fetch product names for top products
  const productIds = Array.from(productRevenue.keys());
  if (productIds.length > 0) {
    for (const productId of productIds.slice(0, 20)) {
      const [productDetail] = await db
        .select({ id: products.id, name: products.name })
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      if (productDetail) {
        const existing = productRevenue.get(productId);
        if (existing) existing.name = productDetail.name;
      }
    }
  }

  const topProducts = Array.from(productRevenue.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Get asset performance
  const assetRevenue = new Map<string, { name: string; revenue: number }>();
  const productAssetLinks = await db
    .select({
      productId: productAssets.productId,
      assetId: productAssets.assetId,
      assetName: ipAssets.name,
    })
    .from(productAssets)
    .innerJoin(ipAssets, eq(productAssets.assetId, ipAssets.id));

  const productToAsset = new Map<string, { assetId: string; assetName: string }>();
  for (const link of productAssetLinks) {
    productToAsset.set(link.productId, { assetId: link.assetId, assetName: link.assetName });
  }

  for (const sale of salesData) {
    if (!sale.productId) continue;
    const assetInfo = productToAsset.get(sale.productId);
    if (!assetInfo) continue;

    const existing = assetRevenue.get(assetInfo.assetId);
    if (existing) {
      existing.revenue += parseFloat(sale.revenue || '0');
    } else {
      assetRevenue.set(assetInfo.assetId, { name: assetInfo.assetName, revenue: parseFloat(sale.revenue || '0') });
    }
  }

  const topAssets = Array.from(assetRevenue.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Category breakdown
  const categoryBreakdown: Record<string, { revenue: number; units: number }> = {};
  const productCategories = await db
    .select({ id: products.id, category: products.category })
    .from(products)
    .where(eq(products.publisherId, publisherId));

  const productCategoryMap = new Map<string, string>();
  for (const p of productCategories) {
    if (p.category) productCategoryMap.set(p.id, p.category);
  }

  for (const sale of salesData) {
    if (!sale.productId) continue;
    const category = productCategoryMap.get(sale.productId) || 'other';
    if (!categoryBreakdown[category]) {
      categoryBreakdown[category] = { revenue: 0, units: 0 };
    }
    categoryBreakdown[category].revenue += parseFloat(sale.revenue || '0');
    categoryBreakdown[category].units += sale.quantity || 0;
  }

  // Region breakdown
  const regionBreakdown: Record<string, { revenue: number; orders: number }> = {};
  for (const sale of salesData) {
    const region = sale.region || 'Unknown';
    if (!regionBreakdown[region]) {
      regionBreakdown[region] = { revenue: 0, orders: 0 };
    }
    regionBreakdown[region].revenue += parseFloat(sale.revenue || '0');
    regionBreakdown[region].orders += 1;
  }

  // Calculate growth rate if previous period provided
  let growthRate: number | undefined;
  if (previousStartDate && previousEndDate) {
    const previousSales = await db
      .select({ revenue: sales.revenue })
      .from(sales)
      .where(
        and(
          eq(sales.publisherId, publisherId),
          gte(sales.orderDate, previousStartDate),
          lte(sales.orderDate, previousEndDate)
        )
      );

    const previousRevenue = previousSales.reduce((sum, s) => sum + parseFloat(s.revenue || '0'), 0);
    if (previousRevenue > 0) {
      growthRate = ((totalRevenue - previousRevenue) / previousRevenue) * 100;
    }
  }

  return {
    totalRevenue,
    totalOrders,
    totalUnits,
    avgOrderValue,
    topProducts,
    topAssets,
    categoryBreakdown,
    regionBreakdown,
    growthRate,
  };
}

// Generate snapshots for a publisher
async function generateSnapshots(publisherId: string, period: 'daily' | 'weekly' | 'monthly' = 'daily') {
  console.log(`\n📊 Generating ${period} snapshots for publisher ${publisherId}`);

  // Get date range of sales data
  const [salesRange] = await db
    .select({
      minDate: sql<Date>`MIN(${sales.orderDate})`,
      maxDate: sql<Date>`MAX(${sales.orderDate})`,
    })
    .from(sales)
    .where(eq(sales.publisherId, publisherId));

  if (!salesRange.minDate || !salesRange.maxDate) {
    console.log('   No sales data found');
    return;
  }

  const minDate = new Date(salesRange.minDate);
  const maxDate = new Date(salesRange.maxDate);

  console.log(`   Sales data range: ${minDate.toISOString().split('T')[0]} to ${maxDate.toISOString().split('T')[0]}`);

  // Generate snapshots based on period
  let currentDate = new Date(minDate);
  let snapshotCount = 0;

  while (currentDate <= maxDate) {
    let startDate: Date;
    let endDate: Date;
    let prevStartDate: Date;
    let prevEndDate: Date;

    if (period === 'daily') {
      startDate = startOfDay(currentDate);
      endDate = endOfDay(currentDate);
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      prevStartDate = startOfDay(prevDay);
      prevEndDate = endOfDay(prevDay);
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (period === 'weekly') {
      startDate = startOfWeek(currentDate);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate = endOfDay(endDate);
      const prevWeek = new Date(startDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      prevStartDate = prevWeek;
      prevEndDate = new Date(prevWeek);
      prevEndDate.setDate(prevEndDate.getDate() + 6);
      prevEndDate = endOfDay(prevEndDate);
      currentDate.setDate(currentDate.getDate() + 7);
    } else {
      startDate = startOfMonth(currentDate);
      endDate = endOfMonth(currentDate);
      const prevMonth = new Date(startDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      prevStartDate = startOfMonth(prevMonth);
      prevEndDate = endOfMonth(prevMonth);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Check if snapshot already exists
    const [existing] = await db
      .select({ id: analyticsSnapshots.id })
      .from(analyticsSnapshots)
      .where(
        and(
          eq(analyticsSnapshots.publisherId, publisherId),
          eq(analyticsSnapshots.period, period),
          eq(analyticsSnapshots.startDate, startDate)
        )
      )
      .limit(1);

    if (existing) continue;

    // Calculate metrics
    const metrics = await calculateMetrics(publisherId, startDate, endDate, prevStartDate, prevEndDate);

    // Skip if no data
    if (metrics.totalOrders === 0) continue;

    // Insert snapshot
    await db.insert(analyticsSnapshots).values({
      publisherId,
      period,
      startDate,
      endDate,
      metrics: metrics as unknown as Record<string, unknown>,
    });

    snapshotCount++;
  }

  console.log(`   ✅ Generated ${snapshotCount} ${period} snapshots`);
}

// Generate AI insights for a publisher
async function generateInsightsForPublisher(publisherId: string) {
  console.log(`\n🤖 Generating AI insights for publisher ${publisherId}`);

  // Get publisher's game IPs and assets
  const gameIpData = await db
    .select({ id: gameIps.id, name: gameIps.name })
    .from(gameIps)
    .where(eq(gameIps.publisherId, publisherId));

  if (gameIpData.length === 0) {
    console.log('   No game IPs found');
    return;
  }

  const gameIpId = gameIpData[0].id;

  // Get asset performance data
  const assetPerformance = await db.execute(sql`
    SELECT
      ia.id as asset_id,
      ia.name as asset_name,
      ia.popularity,
      COALESCE(SUM(s.revenue::numeric), 0) as total_revenue,
      COALESCE(SUM(s.quantity), 0) as total_units,
      COUNT(DISTINCT p.id) as product_count
    FROM ip_assets ia
    LEFT JOIN product_assets pa ON pa.asset_id = ia.id
    LEFT JOIN products p ON p.id = pa.product_id
    LEFT JOIN sales s ON s.product_id = p.id
    WHERE ia.game_ip_id = ${gameIpId}
    GROUP BY ia.id, ia.name, ia.popularity
    ORDER BY total_revenue DESC
  `);

  // Generate insights based on data patterns
  const insights: Array<{
    publisherId: string;
    gameIpId: string;
    assetId?: string;
    type: string;
    title: string;
    description: string;
    confidence: string;
    data: Record<string, unknown>;
  }> = [];

  // Analyze each asset
  for (const asset of assetPerformance.rows as Array<{
    asset_id: string;
    asset_name: string;
    popularity: number;
    total_revenue: string;
    total_units: string;
    product_count: string;
  }>) {
    const revenue = parseFloat(asset.total_revenue) || 0;
    const units = parseInt(asset.total_units) || 0;
    const products = parseInt(asset.product_count) || 0;
    const popularity = asset.popularity || 50;

    // High performer insight
    if (revenue > 50000) {
      insights.push({
        publisherId,
        gameIpId,
        assetId: asset.asset_id,
        type: 'opportunity',
        title: `${asset.asset_name} is a top performer`,
        description: `${asset.asset_name} has generated $${revenue.toLocaleString()} in revenue across ${products} products. Consider expanding this character's product line with premium collectibles or limited editions.`,
        confidence: '0.92',
        data: { revenue, units, products, popularity },
      });
    }

    // Underperforming popular character
    if (popularity > 80 && revenue < 10000 && products < 5) {
      insights.push({
        publisherId,
        gameIpId,
        assetId: asset.asset_id,
        type: 'opportunity',
        title: `${asset.asset_name} is undermonetized`,
        description: `${asset.asset_name} has high popularity (${popularity}%) but only ${products} products and $${revenue.toLocaleString()} revenue. This character has untapped merchandise potential.`,
        confidence: '0.88',
        data: { revenue, units, products, popularity },
      });
    }

    // Low performer warning
    if (revenue < 5000 && products > 10) {
      insights.push({
        publisherId,
        gameIpId,
        assetId: asset.asset_id,
        type: 'warning',
        title: `${asset.asset_name} product line review needed`,
        description: `${asset.asset_name} has ${products} products but only $${revenue.toLocaleString()} revenue. Consider consolidating the product line or running promotional campaigns.`,
        confidence: '0.85',
        data: { revenue, units, products, popularity },
      });
    }
  }

  // Category analysis
  const categoryAnalysis = await db.execute(sql`
    SELECT
      p.category,
      COALESCE(SUM(s.revenue::numeric), 0) as total_revenue,
      COALESCE(SUM(s.quantity), 0) as total_units,
      COUNT(DISTINCT p.id) as product_count
    FROM products p
    LEFT JOIN sales s ON s.product_id = p.id
    WHERE p.publisher_id = ${publisherId}
    GROUP BY p.category
    ORDER BY total_revenue DESC
  `);

  const categories = categoryAnalysis.rows as Array<{
    category: string;
    total_revenue: string;
    total_units: string;
    product_count: string;
  }>;

  // Find category opportunities
  const totalRevenue = categories.reduce((sum, c) => sum + parseFloat(c.total_revenue || '0'), 0);

  for (const category of categories) {
    const catRevenue = parseFloat(category.total_revenue || '0');
    const percentage = totalRevenue > 0 ? (catRevenue / totalRevenue) * 100 : 0;

    if (category.category === 'collectibles' && percentage > 30) {
      insights.push({
        publisherId,
        gameIpId,
        type: 'insight',
        title: 'Collectibles driving strong revenue',
        description: `Collectibles represent ${percentage.toFixed(1)}% of total revenue. Your audience values premium, collectible merchandise. Consider launching limited edition figures or statues.`,
        confidence: '0.90',
        data: { category: category.category, revenue: catRevenue, percentage },
      });
    }

    if (category.category === 'digital' && percentage < 5 && parseInt(category.product_count) < 3) {
      insights.push({
        publisherId,
        gameIpId,
        type: 'opportunity',
        title: 'Digital products opportunity',
        description: `Digital products are underrepresented in your catalog (${percentage.toFixed(1)}% of revenue). Consider adding digital art, wallpapers, or soundtracks with high margins and instant delivery.`,
        confidence: '0.86',
        data: { category: category.category, revenue: catRevenue, percentage },
      });
    }
  }

  // Clear existing insights and insert new ones
  await db
    .delete(aiInsights)
    .where(eq(aiInsights.publisherId, publisherId));

  if (insights.length > 0) {
    await db.insert(aiInsights).values(insights);
    console.log(`   ✅ Generated ${insights.length} insights`);
  } else {
    console.log('   No insights generated (insufficient data patterns)');
  }
}

// Main function
async function main() {
  console.log('═'.repeat(60));
  console.log('📈 PhantomOS Analytics Generation');
  console.log('═'.repeat(60));

  // Parse arguments
  const args = process.argv.slice(2);
  const publisherIdArg = args.find(a => a.startsWith('--publisher-id='))?.split('=')[1];
  const periodArg = args.find(a => a.startsWith('--period='))?.split('=')[1] as 'daily' | 'weekly' | 'monthly' | undefined;
  const generateInsightsFlag = args.includes('--insights');

  // Get publishers to process
  let publisherIds: string[] = [];

  if (publisherIdArg) {
    publisherIds = [publisherIdArg];
  } else {
    const allPublishers = await db.select({ id: publishers.id }).from(publishers);
    publisherIds = allPublishers.map(p => p.id);
  }

  console.log(`\nProcessing ${publisherIds.length} publisher(s)`);

  for (const publisherId of publisherIds) {
    // Get publisher name
    const [publisher] = await db
      .select({ name: publishers.name })
      .from(publishers)
      .where(eq(publishers.id, publisherId));

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Publisher: ${publisher?.name || publisherId}`);

    // Generate snapshots
    if (periodArg) {
      await generateSnapshots(publisherId, periodArg);
    } else {
      await generateSnapshots(publisherId, 'daily');
      await generateSnapshots(publisherId, 'weekly');
      await generateSnapshots(publisherId, 'monthly');
    }

    // Generate insights if requested
    if (generateInsightsFlag) {
      await generateInsightsForPublisher(publisherId);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✅ Analytics generation complete!');
  console.log('═'.repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Failed:', err);
    process.exit(1);
  });
