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

    // Fetch ALL products (not just ones with sales)
    const productsData = await db.execute(sql`
      SELECT
        p.id,
        p.name,
        p.category,
        p.price,
        p.sku,
        p.created_at,
        COALESCE(
          (SELECT json_agg(ia.name)
           FROM product_assets pa
           JOIN ip_assets ia ON ia.id = pa.asset_id
           WHERE pa.product_id = p.id),
          '[]'
        ) as tagged_assets
      FROM products p
      WHERE p.publisher_id = ${publisherId}
      ORDER BY p.created_at DESC
      LIMIT 50
    `);

    // Fetch IP assets
    const ipAssetsData = await db.execute(sql`
      SELECT
        ia.id,
        ia.name,
        ia.asset_type,
        gi.name as game_ip,
        (SELECT COUNT(*) FROM product_assets pa WHERE pa.asset_id = ia.id) as product_count
      FROM ip_assets ia
      JOIN game_ips gi ON gi.id = ia.game_ip_id
      WHERE gi.publisher_id = ${publisherId}
    `);

    // Fetch sales data if any
    const salesData = await db.execute(sql`
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

    // Calculate tagging stats
    const taggingStats = await db.execute(sql`
      SELECT
        COUNT(*) as total_products,
        COUNT(CASE WHEN EXISTS (SELECT 1 FROM product_assets pa WHERE pa.product_id = p.id) THEN 1 END) as tagged_products
      FROM products p
      WHERE p.publisher_id = ${publisherId}
    `);

    const stats = taggingStats.rows[0] as { total_products: number; tagged_products: number } | undefined;
    const totalProducts = Number(stats?.total_products || 0);
    const taggedProducts = Number(stats?.tagged_products || 0);
    const untaggedProducts = totalProducts - taggedProducts;

    // Build rich context for AI
    const context = `You are analyzing a gaming merchandise catalog for PhantomOS.

CATALOG SUMMARY:
- Total products: ${totalProducts}
- Tagged with IP assets: ${taggedProducts}
- Untagged (need mapping): ${untaggedProducts}
- IP Assets created: ${ipAssetsData.rows.length}

Your job is to provide SPECIFIC, ACTIONABLE insights based on the actual products and data.
Be specific about product names, categories, and characters when making recommendations.
Focus on practical merchandising opportunities.`;

    const insights = await generateInsights({
      context,
      data: {
        products: productsData.rows.slice(0, 30), // Top 30 products
        ipAssets: ipAssetsData.rows,
        recentSales: salesData.rows,
        taggingProgress: {
          total: totalProducts,
          tagged: taggedProducts,
          untagged: untaggedProducts,
          percentComplete: totalProducts > 0 ? Math.round((taggedProducts / totalProducts) * 100) : 0,
        },
        analysisType: type || 'general',
      },
      question: `Analyze this merchandise catalog and provide 3-5 specific, actionable insights:
1. If products exist but are untagged, identify specific products that should be prioritized for tagging
2. Look at product names/categories to suggest which IP assets they might belong to
3. Identify gaps in the product catalog (e.g., "You have Mario products but no Luigi")
4. Spot pricing optimization opportunities
5. Recommend specific next actions

Be SPECIFIC - mention actual product names and categories from the data. No generic advice.`,
    });

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
