import { NextRequest, NextResponse } from 'next/server';
import { generateInsights } from '@/lib/ai';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { getServerSession, isDemoMode, getDemoPublisherId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Get publisherId from session, not request body
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

    const body = await request.json();
    const { type } = body;

    // Fetch relevant data for analysis
    const recentSales = await db.execute(sql`
      SELECT
        p.name as product_name,
        p.category,
        ia.name as asset_name,
        SUM(s.revenue) as revenue,
        SUM(s.quantity) as units,
        COUNT(*) as orders
      FROM sales s
      JOIN products p ON p.id = s.product_id
      LEFT JOIN product_assets pa ON pa.product_id = p.id
      LEFT JOIN ip_assets ia ON ia.id = pa.asset_id
      WHERE s.publisher_id = ${publisherId}
        AND s.order_date >= NOW() - INTERVAL '30 days'
      GROUP BY p.name, p.category, ia.name
      ORDER BY revenue DESC
      LIMIT 20
    `);

    const previousPeriodSales = await db.execute(sql`
      SELECT
        SUM(revenue) as total_revenue,
        COUNT(*) as total_orders
      FROM sales
      WHERE publisher_id = ${publisherId}
        AND order_date >= NOW() - INTERVAL '60 days'
        AND order_date < NOW() - INTERVAL '30 days'
    `);

    // Generate AI insights
    const context = `Gaming merchandise sales data for a publisher.
    Analyze trends, opportunities, and risks. Focus on:
    1. Demand patterns for specific characters/assets
    2. Category performance
    3. Growth opportunities
    4. Potential concerns`;

    const insights = await generateInsights({
      context,
      data: {
        recentSales: recentSales.rows,
        previousPeriod: previousPeriodSales.rows[0],
        analysisType: type || 'general',
      },
      question: 'What are the top 3-5 actionable insights from this sales data? Focus on opportunities and risks.',
    });

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
