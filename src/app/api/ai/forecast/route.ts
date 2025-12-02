import { NextRequest, NextResponse } from 'next/server';
import { predictDemand } from '@/lib/ai';
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
    const { productId, assetId } = body;

    // Build the query based on whether we're forecasting for a product or asset
    let salesQuery;
    let entityData;

    if (productId) {
      // Product-specific forecast
      salesQuery = sql`
        SELECT
          DATE_TRUNC('week', order_date) as period,
          SUM(revenue) as revenue,
          SUM(quantity) as units
        FROM sales
        WHERE product_id = ${productId}
        GROUP BY DATE_TRUNC('week', order_date)
        ORDER BY period DESC
        LIMIT 12
      `;

      const productData = await db.execute(sql`
        SELECT name, category, price FROM products WHERE id = ${productId}
      `);
      entityData = productData.rows[0];
    } else if (assetId) {
      // Asset-specific forecast
      salesQuery = sql`
        SELECT
          DATE_TRUNC('week', s.order_date) as period,
          SUM(s.revenue) as revenue,
          SUM(s.quantity) as units
        FROM sales s
        JOIN product_assets pa ON pa.product_id = s.product_id
        WHERE pa.asset_id = ${assetId}
        GROUP BY DATE_TRUNC('week', s.order_date)
        ORDER BY period DESC
        LIMIT 12
      `;

      const assetData = await db.execute(sql`
        SELECT name, asset_type FROM ip_assets WHERE id = ${assetId}
      `);
      entityData = assetData.rows[0];
    } else {
      // Publisher-wide forecast
      salesQuery = sql`
        SELECT
          DATE_TRUNC('week', order_date) as period,
          SUM(revenue) as revenue,
          SUM(quantity) as units
        FROM sales
        WHERE publisher_id = ${publisherId}
        GROUP BY DATE_TRUNC('week', order_date)
        ORDER BY period DESC
        LIMIT 12
      `;
      entityData = { name: 'All Products', type: 'publisher' };
    }

    const historicalSales = await db.execute(salesQuery);

    // Generate demand forecast using AI
    const forecast = await predictDemand(
      entityData as Record<string, unknown>,
      historicalSales.rows as Record<string, unknown>[]
    );

    return NextResponse.json({
      entity: entityData,
      historical: historicalSales.rows,
      forecast,
    });
  } catch (error) {
    console.error('Forecast error:', error);
    return NextResponse.json({ error: 'Failed to generate forecast' }, { status: 500 });
  }
}
