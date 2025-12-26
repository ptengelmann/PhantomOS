import { NextResponse } from 'next/server';
import { resolvePublisher } from '@/lib/auth';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

interface RegionalSalesData {
  region: string;
  revenue: number;
  orderCount: number;
  percentage: number;
}

export async function GET() {
  try {
    // SECURITY: Session-first pattern - always check auth before demo mode
    const resolved = await resolvePublisher();
    if (!resolved) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { publisherId } = resolved;

    // Get regional sales data
    const regionalData = await db.execute(sql`
      SELECT
        region,
        COUNT(*) as order_count,
        SUM(revenue::numeric) as total_revenue
      FROM sales
      WHERE publisher_id = ${publisherId}
        AND region IS NOT NULL
      GROUP BY region
      ORDER BY total_revenue DESC
    `);

    // Calculate total revenue for percentages
    const totalRevenue = regionalData.rows.reduce(
      (sum: number, row: any) => sum + parseFloat(row.total_revenue || 0),
      0
    );

    // Format the response
    const regions: RegionalSalesData[] = regionalData.rows.map((row: any) => ({
      region: row.region,
      revenue: parseFloat(row.total_revenue || 0),
      orderCount: parseInt(row.order_count || 0),
      percentage: totalRevenue > 0
        ? Math.round((parseFloat(row.total_revenue || 0) / totalRevenue) * 100)
        : 0,
    }));

    return NextResponse.json({
      regions,
      totalRevenue,
      totalOrders: regions.reduce((sum, r) => sum + r.orderCount, 0),
    });
  } catch (error) {
    console.error('Regional sales error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regional sales data' },
      { status: 500 }
    );
  }
}
