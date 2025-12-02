import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sales, products, ipAssets, gameIps } from '@/lib/db/schema';
import { sql, desc, eq, and, gte, lte } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Get publisherId from session, not query params
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

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const groupBy = searchParams.get('groupBy') || 'day'; // day, week, month

    // Get date range (default to last 30 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Revenue over time
    const revenueByDate = await db.execute(sql`
      SELECT
        DATE_TRUNC(${groupBy}, order_date) as date,
        SUM(revenue) as total_revenue,
        COUNT(*) as order_count,
        SUM(quantity) as units_sold
      FROM sales
      WHERE publisher_id = ${publisherId}
        AND order_date >= ${start.toISOString()}
        AND order_date <= ${end.toISOString()}
      GROUP BY DATE_TRUNC(${groupBy}, order_date)
      ORDER BY date ASC
    `);

    // Top performing products
    const topProducts = await db.execute(sql`
      SELECT
        p.id,
        p.name,
        p.category,
        p.image_url,
        SUM(s.revenue) as total_revenue,
        SUM(s.quantity) as total_units,
        COUNT(s.id) as order_count
      FROM products p
      JOIN sales s ON s.product_id = p.id
      WHERE p.publisher_id = ${publisherId}
        AND s.order_date >= ${start.toISOString()}
        AND s.order_date <= ${end.toISOString()}
      GROUP BY p.id
      ORDER BY total_revenue DESC
      LIMIT 10
    `);

    // Revenue by category
    const revenueByCategory = await db.execute(sql`
      SELECT
        p.category,
        SUM(s.revenue) as total_revenue,
        SUM(s.quantity) as total_units
      FROM products p
      JOIN sales s ON s.product_id = p.id
      WHERE p.publisher_id = ${publisherId}
        AND s.order_date >= ${start.toISOString()}
        AND s.order_date <= ${end.toISOString()}
      GROUP BY p.category
      ORDER BY total_revenue DESC
    `);

    // Summary stats
    const summary = await db.execute(sql`
      SELECT
        SUM(revenue) as total_revenue,
        COUNT(*) as total_orders,
        SUM(quantity) as total_units,
        AVG(revenue) as avg_order_value
      FROM sales
      WHERE publisher_id = ${publisherId}
        AND order_date >= ${start.toISOString()}
        AND order_date <= ${end.toISOString()}
    `);

    // Previous period for comparison
    const periodLength = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - periodLength);
    const prevEnd = start;

    const previousSummary = await db.execute(sql`
      SELECT
        SUM(revenue) as total_revenue,
        COUNT(*) as total_orders
      FROM sales
      WHERE publisher_id = ${publisherId}
        AND order_date >= ${prevStart.toISOString()}
        AND order_date < ${prevEnd.toISOString()}
    `);

    return NextResponse.json({
      summary: summary.rows[0],
      previousPeriod: previousSummary.rows[0],
      revenueOverTime: revenueByDate.rows,
      topProducts: topProducts.rows,
      revenueByCategory: revenueByCategory.rows,
      dateRange: { start, end },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
